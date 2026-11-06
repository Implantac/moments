import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, type OrderItem } from "@/db/schema";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  PIX_DISCOUNT_RATE,
  SHIPPING_FLAT_CENTS,
} from "@/lib/site";

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
  items?: OrderItem[];
  paymentMethod?: string;
};

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 5; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
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

    const items = (payload.items ?? [])
      .filter((i) => i && i.qty > 0 && i.priceCents > 0 && i.slug)
      .map((i) => ({
        slug: String(i.slug),
        name: String(i.name),
        brand: String(i.brand),
        sizeMl: Number(i.sizeMl) || 0,
        priceCents: Math.round(Number(i.priceCents)),
        image: String(i.image),
        qty: Math.min(10, Math.round(Number(i.qty))),
      }));

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Sua sacola está vazia." },
        { status: 400 },
      );
    }

    const payment = ["pix", "card", "whatsapp"].includes(
      String(payload.paymentMethod),
    )
      ? String(payload.paymentMethod)
      : "pix";

    const subtotal = items.reduce((acc, i) => acc + i.priceCents * i.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
    const discount =
      payment === "pix" ? Math.round(subtotal * PIX_DISCOUNT_RATE) : 0;
    const total = subtotal + shipping - discount;

    let code = makeCode();
    let inserted = null;
    for (let attempt = 0; attempt < 3 && !inserted; attempt++) {
      try {
        [inserted] = await db
          .insert(orders)
          .values({
            code,
            customerName: String(c.name).trim(),
            email: String(c.email).trim().toLowerCase(),
            phone: String(c.phone).trim(),
            cep: String(c.cep).trim(),
            address: String(c.address).trim(),
            number: String(c.number).trim(),
            complement: c.complement ? String(c.complement).trim() : null,
            city: String(c.city).trim(),
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

    return NextResponse.json({ code: inserted.code, totalCents: total });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível finalizar o pedido. Tente novamente." },
      { status: 500 },
    );
  }
}
