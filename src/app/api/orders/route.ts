import { NextResponse } from "next/server";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, type OrderItem } from "@/db/schema";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  PIX_DISCOUNT_RATE,
  SHIPPING_FLAT_CENTS,
} from "@/lib/site";
import { notifyNewOrder } from "@/lib/notify";
import { signOrderCode } from "@/lib/order-token";
import { buildPixPayload } from "@/lib/pix";

export const dynamic = "force-dynamic";

type IncomingOrder = {
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    cep?: string;
    address?: string;
    number?: string;
    complement?: string;
    city?: string;
    state?: string;
  };
  /** O cliente envia apenas slug + quantidade. Preço vem do banco. */
  items?: { slug?: string; qty?: number }[];
  paymentMethod?: string;
};

const MAX_QTY_PER_ITEM = 10;
const MAX_ITEMS = 20;

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 5; i++) {
    suffix += alphabet[bytes[i] % alphabet.length];
  }
  return `MP-${suffix}`;
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as IncomingOrder;
    const c = payload.customer ?? {};

    const required = [c.name, c.email, c.phone, c.cep, c.address, c.number, c.city, c.state];
    if (required.some((v) => !v || String(v).trim().length < 2)) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 },
      );
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(c.email))) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    // ---------------------------------------------------------------
    // Preço, nome e imagem SEMPRE do banco. O body só carrega slug + qty.
    // Antes, um `priceCents` de R$ 0,01 no body fechava o pedido por centavos.
    // ---------------------------------------------------------------
    const requested = (payload.items ?? []).slice(0, MAX_ITEMS);
    const slugs = [
      ...new Set(
        requested
          .map((i) => (i && typeof i.slug === "string" ? i.slug.trim() : ""))
          .filter(Boolean),
      ),
    ];

    if (slugs.length === 0) {
      return NextResponse.json({ error: "Sua sacola está vazia." }, { status: 400 });
    }

    const rows = await db
      .select({
        slug: products.slug,
        name: products.name,
        brand: products.brand,
        sizeMl: products.sizeMl,
        priceCents: products.priceCents,
        image: products.image,
        stock: products.stock,
        concentration: products.concentration,
      })
      .from(products)
      .where(inArray(products.slug, slugs));

    const bySlug = new Map(rows.map((p) => [p.slug, p]));

    const missing = slugs.filter((s) => !bySlug.has(s));
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Produto indisponível: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    const items: OrderItem[] = [];
    for (const raw of requested) {
      const slug = typeof raw?.slug === "string" ? raw.slug.trim() : "";
      const p = bySlug.get(slug);
      if (!p) continue;

      const qty = Math.min(
        MAX_QTY_PER_ITEM,
        Math.max(1, Math.round(Number(raw.qty) || 0)),
      );
      if (p.stock <= 0) {
        return NextResponse.json(
          { error: `${p.name} está esgotado.` },
          { status: 409 },
        );
      }

      const existing = items.find((i) => i.slug === p.slug);
      if (existing) {
        existing.qty = Math.min(MAX_QTY_PER_ITEM, existing.qty + qty);
        continue;
      }

      items.push({
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        sizeMl: p.sizeMl,
        priceCents: p.priceCents,
        image: p.image,
        qty,
      });
    }

    // Estoque insuficiente para o que foi pedido
    for (const item of items) {
      const available = bySlug.get(item.slug)?.stock ?? 0;
      if (item.qty > available) {
        return NextResponse.json(
          {
            error: `Temos apenas ${available} unidade(s) de ${item.name} em estoque.`,
          },
          { status: 409 },
        );
      }
    }

    const payment = ["pix", "card", "whatsapp"].includes(
      String(payload.paymentMethod),
    )
      ? String(payload.paymentMethod)
      : "pix";

    const subtotal = items.reduce((acc, i) => acc + i.priceCents * i.qty, 0);
    const shipping =
      subtotal >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
    const discount =
      payment === "pix" ? Math.round(subtotal * PIX_DISCOUNT_RATE) : 0;
    const total = subtotal + shipping - discount;

    let code = makeCode();
    let inserted: { code: string } | null = null;

    for (let attempt = 0; attempt < 3 && !inserted; attempt++) {
      try {
        [inserted] = await db
          .insert(orders)
          .values({
            code,
            customerName: String(c.name).trim().slice(0, 120),
            email: String(c.email).trim().toLowerCase().slice(0, 160),
            phone: String(c.phone).trim().slice(0, 30),
            cep: String(c.cep).trim().slice(0, 12),
            address: String(c.address).trim().slice(0, 200),
            number: String(c.number).trim().slice(0, 20),
            complement: c.complement ? String(c.complement).trim().slice(0, 80) : null,
            city: String(c.city).trim().slice(0, 80),
            state: String(c.state).trim().toUpperCase().slice(0, 2),
            items,
            subtotalCents: subtotal,
            shippingCents: shipping,
            discountCents: discount,
            totalCents: total,
            paymentMethod: payment,
            status:
              payment === "whatsapp"
                ? "aguardando_contato"
                : "aguardando_pagamento",
          })
          .returning({ code: orders.code });
      } catch {
        code = makeCode();
      }
    }

    if (!inserted) {
      throw new Error("Não foi possível registrar o pedido.");
    }

    // PIX: devolve o BR Code já com valor e identificador do pedido.
    // Sem a chave configurada não há como gerar o QR: o pedido fica guardado
    // e o checkout orienta o cliente a combinar o pagamento no WhatsApp.
    const pixKey = process.env.PIX_KEY ?? "";
    const pixPayload =
      payment === "pix" && pixKey
        ? buildPixPayload({
            key: pixKey,
            merchantName: process.env.PIX_HOLDER ?? "",
            merchantCity: process.env.PIX_CITY ?? "LONDRINA",
            amount: total / 100,
            txid: inserted.code.replace("-", ""),
          })
        : null;

    // Notificação é best-effort: nunca derruba o checkout.
    void notifyNewOrder({
      code: inserted.code,
      totalCents: total,
      subtotalCents: subtotal,
      shippingCents: shipping,
      discountCents: discount,
      paymentMethod: payment,
      status: payment === "whatsapp" ? "aguardando_contato" : "aguardando_pagamento",
      customerName: String(c.name).trim(),
      email: String(c.email).trim().toLowerCase(),
      phone: String(c.phone).trim(),
      city: String(c.city).trim(),
      state: String(c.state).trim().toUpperCase().slice(0, 2),
      items: items.map((i) => ({
        name: i.name,
        qty: i.qty,
        priceCents: i.priceCents,
      })),
      pixPayload,
    });

    return NextResponse.json({
      code: inserted.code,
      totalCents: total,
      subtotalCents: subtotal,
      shippingCents: shipping,
      discountCents: discount,
      pixPayload,
      token: signOrderCode(inserted.code),
    });
  } catch (error) {
    console.error("[api/orders]", error);
    return NextResponse.json(
      { error: "Não foi possível finalizar o pedido. Tente novamente." },
      { status: 500 },
    );
  }
}
