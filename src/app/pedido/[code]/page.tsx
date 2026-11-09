import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  MapPin,
  MessageCircle,
  ShieldAlert,
  Truck,
} from "lucide-react";
import { CopyButton } from "@/components/order/copy-pix";
import { PixPayment } from "@/components/order/pix-payment";
import { formatBRL, formatDatePtBr } from "@/lib/format";
import { getOrderByCode } from "@/lib/data";
import { buildPixPayload } from "@/lib/pix";
import { verifyOrderToken } from "@/lib/order-token";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { code } = await params;
  const { t } = await searchParams;

  const order = await getOrderByCode(code);

  // O link carrega dados pessoais (nome, e-mail, endereço). Sem o token
  // assinado, o pedido não é exibido — nem se o código for adivinhado.
  if (!order || !verifyOrderToken(code, t)) {
    if (!order) notFound();
    return <AccessDenied code={code} />;
  }

  const firstName = order.customerName.split(" ")[0];
  const waMessage = `Olá! Acabei de fazer o pedido ${order.code} no site da Moments Paris (${formatBRL(order.totalCents)}). Itens: ${order.items
    .map((i) => `${i.qty}x ${i.name}`)
    .join(", ")}. Podemos confirmar?`;

  const pixPayload =
    order.paymentMethod === "pix"
      ? buildPixPayload({
          key: SITE.pixKey,
          merchantName: SITE.pixHolder,
          merchantCity: SITE.pixCity,
          amount: order.totalCents / 100,
          txid: order.code.replace("-", ""),
        })
      : null;

  return (
    <div className="min-h-screen bg-blush-50 pt-[111px]">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        {/* Hero */}
        <div className="text-center">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={42} strokeWidth={1.6} />
          </span>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.35em] text-rose-600">
            Pedido {order.code}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            Obrigada, <em className="text-rose-500">{firstName}</em>!
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-noir-900/60">
            Seu pedido foi registrado em {formatDatePtBr(order.createdAt)}.
            Guarde este link — ele é a sua via de acompanhamento.
          </p>
        </div>

        {/* Payment */}
        <div className="mt-10 rounded-[28px] border border-noir-900/8 bg-white p-7 sm:p-9">
          {pixPayload && (
            <PixPayment
              payload={pixPayload}
              amountCents={order.totalCents}
              code={order.code}
            />
          )}

          {order.paymentMethod === "whatsapp" && (
            <div className="text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <MessageCircle size={22} />
              </span>
              <h2 className="mt-4 font-display text-2xl">
                Último passo: fale com a Neusa
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-noir-900/55">
                Envie o resumo do seu pedido pelo WhatsApp para combinar
                pagamento e entrega. Já deixamos tudo prontinho — é só clicar.
              </p>
              <a
                href={whatsappLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                <MessageCircle size={16} /> Enviar pedido no WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="mt-8 rounded-[28px] border border-noir-900/8 bg-white p-7 sm:p-9">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl">Resumo do pedido</h2>
            <CopyButton
              value={order.code}
              label="Copiar nº"
              copiedLabel="Copiado!"
              variant="outline"
            />
          </div>
          <ul className="mt-5 space-y-4">
            {order.items.map((item) => (
              <li key={item.slug} className="flex items-center gap-4">
                <span className="relative h-16 w-[52px] shrink-0 overflow-hidden rounded-xl bg-blush-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="52px"
                    className="object-cover"
                  />
                </span>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-600">
                    {item.brand}
                  </p>
                  <p className="text-sm font-medium">
                    {item.name} · {item.sizeMl}ml
                  </p>
                  <p className="text-xs text-noir-900/45">Qtd: {item.qty}</p>
                </div>
                <p className="text-sm font-semibold">
                  {formatBRL(item.priceCents * item.qty)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-noir-900/8 pt-5 text-sm">
            <div className="flex justify-between text-noir-900/60">
              <dt>Subtotal</dt>
              <dd>{formatBRL(order.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between text-noir-900/60">
              <dt>Frete</dt>
              <dd>
                {order.shippingCents === 0
                  ? "Grátis"
                  : formatBRL(order.shippingCents)}
              </dd>
            </div>
            {order.discountCents > 0 && (
              <div className="flex justify-between text-emerald-700">
                <dt>Desconto PIX</dt>
                <dd>−{formatBRL(order.discountCents)}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between border-t border-noir-900/8 pt-3">
              <dt className="font-semibold uppercase tracking-[0.14em]">Total</dt>
              <dd className="font-display text-2xl font-medium">
                {formatBRL(order.totalCents)}
              </dd>
            </div>
          </dl>
          <p className="mt-5 flex items-start gap-2.5 rounded-2xl bg-blush-50 p-4 text-xs text-noir-900/60">
            <MapPin size={15} className="mt-0.5 shrink-0 text-rose-500" />
            Entrega em: {order.address}, {order.number}
            {order.complement ? ` — ${order.complement}` : ""}, {order.city}/
            {order.state} · CEP {order.cep}
          </p>
          <p className="mt-3 flex items-start gap-2.5 rounded-2xl bg-blush-50 p-4 text-xs text-noir-900/60">
            <Truck size={15} className="mt-0.5 shrink-0 text-rose-500" />
            Prazo: postagem em até 24h úteis após a confirmação do pagamento.
            Você recebe o código de rastreio no WhatsApp.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 rounded-full bg-noir-900 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-rose-600"
          >
            Voltar à loja
          </Link>
          <a
            href={whatsappLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-noir-900/12 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-noir-900 transition-colors hover:border-emerald-600 hover:text-emerald-700"
          >
            <MessageCircle size={15} /> Falar no WhatsApp
          </a>
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-[11px] text-noir-900/35">
          <Copy size={11} /> Este link é pessoal e intransferível — não
          compartilhe para proteger seus dados.
        </p>
      </div>
    </div>
  );
}

function AccessDenied({ code }: { code: string }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 pt-[111px] text-center">
      <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <ShieldAlert size={38} strokeWidth={1.6} />
      </span>
      <h1 className="mt-6 font-display text-3xl">Link incompleto</h1>
      <p className="mt-3 text-sm text-noir-900/55">
        O pedido <strong>{code}</strong> existe, mas o link que você usou não
        contém o código de acesso. Por segurança, não mostramos nome, endereço e
        e-mail sem essa confirmação. Use o link completo que você recebeu ao
        finalizar a compra, ou fale com a loja no WhatsApp.
      </p>
      <a
        href={whatsappLink(`Olá! Preciso de ajuda com o pedido ${code}.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-noir-900 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-rose-600"
      >
        <MessageCircle size={15} /> Falar com a loja
      </a>
    </div>
  );
}
