import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  CreditCard,
  MapPin,
  MessageCircle,
  QrCode,
} from "lucide-react";
import { CopyPixKey } from "@/components/order/copy-pix";
import { formatBRL, formatDatePtBr } from "@/lib/format";
import { getOrderByCode } from "@/lib/data";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pedido confirmado",
};

export const dynamic = "force-dynamic";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const order = await getOrderByCode(code);
  if (!order) notFound();

  const firstName = order.customerName.split(" ")[0];
  const waMessage = `Olá! Acabei de fazer o pedido ${order.code} no site da Moments Paris (${formatBRL(order.totalCents)}). Itens: ${order.items
    .map((i) => `${i.qty}x ${i.name}`)
    .join(", ")}. Podemos confirmar?`;

  return (
    <div className="min-h-screen bg-blush-50 pt-[101px]">
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
            Seu pedido foi recebido em {formatDatePtBr(order.createdAt)} e uma
            cópia foi enviada para <strong>{order.email}</strong>.
          </p>
        </div>

        {/* Payment instructions */}
        <div className="mt-10 rounded-[28px] border border-noir-900/8 bg-white p-7 sm:p-9">
          {order.paymentMethod === "pix" && (
            <div className="text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <QrCode size={22} />
              </span>
              <h2 className="mt-4 font-display text-2xl">
                Pague com PIX para confirmar
              </h2>
              <p className="mt-2 text-sm text-noir-900/55">
                Chave PIX (CPF):
              </p>
              <p className="mt-1 font-display text-3xl tracking-wide text-noir-900">
                {SITE.pixKey}
              </p>
              <p className="mt-1 text-xs text-noir-900/50">
                {SITE.pixHolder} · Moments Paris
              </p>
              <div className="mt-4 inline-flex items-baseline gap-2 rounded-2xl bg-blush-50 px-6 py-3">
                <span className="text-xs uppercase tracking-[0.2em] text-noir-900/50">
                  Valor com 5% OFF
                </span>
                <span className="font-display text-2xl font-semibold text-rose-600">
                  {formatBRL(order.totalCents)}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <CopyPixKey />
                <a
                  href={whatsappLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-noir-900/12 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-noir-900 transition-colors hover:border-emerald-500 hover:text-emerald-700"
                >
                  <MessageCircle size={14} /> Enviar comprovante
                </a>
              </div>
              <p className="mt-5 text-xs text-noir-900/45">
                Assim que identificarmos o pagamento, seu pedido é separado e
                postado em até 24h úteis.
              </p>
            </div>
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

          {order.paymentMethod === "card" && (
            <div className="text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blush-100 text-rose-500">
                <CreditCard size={22} />
              </span>
              <h2 className="mt-4 font-display text-2xl">
                Estamos processando seu pagamento
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-noir-900/55">
                Você receberá a confirmação por e-mail e pelo WhatsApp em
                instantes. Qualquer dúvida, fale com a gente.
              </p>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="mt-8 rounded-[28px] border border-noir-900/8 bg-white p-7 sm:p-9">
          <h2 className="font-display text-2xl">Resumo do pedido</h2>
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
      </div>
    </div>
  );
}
