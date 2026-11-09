"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  LockKeyhole,
  MessageCircle,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { cx, formatBRL, maskCep, maskPhone } from "@/lib/format";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  PIX_DISCOUNT_RATE,
  SHIPPING_FLAT_CENTS,
} from "@/lib/site";
import { useCart } from "@/store/cart";

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR",
  "PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

type PaymentMethod = "pix" | "whatsapp";

type FormState = {
  name: string;
  email: string;
  phone: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  city: string;
  state: string;
};

type OrderResponse = {
  code: string;
  token: string;
  totalCents: number;
  error?: string;
};

const STEPS = [
  { label: "Identificação", icon: MessageCircle },
  { label: "Entrega", icon: Truck },
  { label: "Pagamento", icon: ShieldCheck },
];

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cx("block", className)}>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-noir-900/55">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-2xl border border-noir-900/12 bg-white px-4 py-3 text-sm placeholder:text-noir-900/35 focus:border-rose-400 focus:outline-none transition-colors";

export function CheckoutClient() {
  const router = useRouter();
  const { items, hasHydrated, clear } = useCart();

  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod>("pix");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    cep: "",
    address: "",
    number: "",
    complement: "",
    city: "",
    state: "PR",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, i) => acc + i.priceCents * i.qty, 0);
    const shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD_CENTS
        ? 0
        : SHIPPING_FLAT_CENTS;
    const discount =
      payment === "pix" ? Math.round(subtotal * PIX_DISCOUNT_RATE) : 0;
    return { subtotal, shipping, discount, total: subtotal + shipping - discount };
  }, [items, payment]);

  const set = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (form.name.trim().length < 5) e.name = "Informe seu nome completo";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
        e.email = "E-mail inválido";
      if (form.phone.replace(/\D/g, "").length < 10)
        e.phone = "Informe um telefone válido";
    }
    if (s === 1) {
      if (form.cep.replace(/\D/g, "").length !== 8) e.cep = "CEP inválido";
      if (form.address.trim().length < 4) e.address = "Informe o endereço";
      if (!form.number.trim()) e.number = "Nº";
      if (form.city.trim().length < 2) e.city = "Informe a cidade";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(2, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!validateStep(2) || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          // O servidor recalcula preço, frete e desconto a partir do banco.
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
          paymentMethod: payment,
        }),
      });
      const data = (await res.json()) as OrderResponse;
      if (!res.ok) throw new Error(data.error ?? "Erro ao finalizar");
      clear();
      router.push(`/pedido/${data.code}?t=${data.token}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Erro ao finalizar o pedido.",
      );
      setSubmitting(false);
    }
  };

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-[111px]">
        <Loader2 className="animate-spin text-rose-500" size={28} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 pt-[111px] text-center">
        <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-blush-100 text-rose-400">
          <ShoppingBag size={38} strokeWidth={1.4} />
        </span>
        <h1 className="mt-8 font-display text-4xl">Sua sacola está vazia</h1>
        <p className="mt-3 text-noir-900/55">
          Adicione seus perfumes favoritos antes de finalizar a compra.
        </p>
        <Link
          href="/produtos"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-noir-900 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-rose-600"
        >
          Explorar perfumes <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush-50 pt-[111px]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Title */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-rose-600">
              Moments Paris
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">
              Finalizar compra
            </h1>
          </div>
          <p className="inline-flex items-center gap-2 text-xs text-noir-900/55">
            <LockKeyhole size={14} className="text-emerald-600" />
            Conexão segura · dados usados apenas para a entrega
          </p>
        </div>

        {/* Stepper */}
        <ol className="mt-10 flex items-center gap-2 sm:gap-4">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={s.label} className="flex flex-1 items-center gap-3">
                <span
                  className={cx(
                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm transition-all",
                    done
                      ? "border-rose-500 bg-rose-500 text-white"
                      : active
                        ? "border-noir-900 bg-noir-900 text-ivory"
                        : "border-noir-900/15 bg-white text-noir-900/40",
                  )}
                >
                  {done ? <Check size={16} /> : i + 1}
                </span>
                <span
                  className={cx(
                    "hidden text-[11px] font-semibold uppercase tracking-[0.18em] sm:block",
                    active ? "text-noir-900" : "text-noir-900/40",
                  )}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    className={cx(
                      "h-px flex-1",
                      done ? "bg-rose-500" : "bg-noir-900/12",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Form column */}
          <div className="rounded-[28px] border border-noir-900/8 bg-white p-6 sm:p-9">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-2xl">Seus dados</h2>
                  <p className="mt-1 text-sm text-noir-900/55">
                    Usamos para confirmar o pedido e combinar a entrega.
                  </p>
                  <div className="mt-6 grid gap-5">
                    <Field label="Nome completo*" error={errors.name}>
                      <input
                        className={inputCls}
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Ex.: Maria Silva"
                        autoComplete="name"
                      />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="E-mail*" error={errors.email}>
                        <input
                          type="email"
                          className={inputCls}
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder="voce@email.com"
                          autoComplete="email"
                        />
                      </Field>
                      <Field label="WhatsApp / Telefone*" error={errors.phone}>
                        <input
                          inputMode="tel"
                          className={inputCls}
                          value={form.phone}
                          onChange={(e) => set("phone", maskPhone(e.target.value))}
                          placeholder="(43) 99999-0000"
                          autoComplete="tel"
                        />
                      </Field>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-2xl">Entrega</h2>
                  <p className="mt-1 text-sm text-noir-900/55">
                    Enviamos para todo o Brasil com rastreio.
                  </p>
                  <div className="mt-6 grid gap-5">
                    <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
                      <Field label="CEP*" error={errors.cep}>
                        <input
                          inputMode="numeric"
                          className={inputCls}
                          value={form.cep}
                          onChange={(e) => set("cep", maskCep(e.target.value))}
                          placeholder="00000-000"
                          autoComplete="postal-code"
                        />
                      </Field>
                      <Field label="Endereço*" error={errors.address}>
                        <input
                          className={inputCls}
                          value={form.address}
                          onChange={(e) => set("address", e.target.value)}
                          placeholder="Rua, avenida..."
                          autoComplete="street-address"
                        />
                      </Field>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
                      <Field label="Número*" error={errors.number}>
                        <input
                          className={inputCls}
                          value={form.number}
                          onChange={(e) => set("number", e.target.value)}
                          placeholder="123"
                        />
                      </Field>
                      <Field label="Complemento">
                        <input
                          className={inputCls}
                          value={form.complement}
                          onChange={(e) => set("complement", e.target.value)}
                          placeholder="Apto, bloco, referência"
                        />
                      </Field>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-[1fr_120px]">
                      <Field label="Cidade*" error={errors.city}>
                        <input
                          className={inputCls}
                          value={form.city}
                          onChange={(e) => set("city", e.target.value)}
                          placeholder="Londrina"
                          autoComplete="address-level2"
                        />
                      </Field>
                      <Field label="UF*">
                        <select
                          className={inputCls}
                          value={form.state}
                          onChange={(e) => set("state", e.target.value)}
                        >
                          {UFS.map((uf) => (
                            <option key={uf} value={uf}>
                              {uf}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-2xl">Pagamento</h2>
                  <p className="mt-1 text-sm text-noir-900/55">
                    Escolha como prefere pagar. As instruções aparecem na
                    confirmação do pedido.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setPayment("pix")}
                      className={cx(
                        "relative rounded-2xl border p-4 text-left transition-all",
                        payment === "pix"
                          ? "border-rose-500 bg-blush-50 ring-2 ring-rose-200"
                          : "border-noir-900/12 bg-white hover:border-noir-900/30",
                      )}
                    >
                      <span className="absolute -top-2.5 right-3 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                        −{Math.round(PIX_DISCOUNT_RATE * 100)}%
                      </span>
                      <QrCode
                        size={20}
                        className={payment === "pix" ? "text-rose-600" : "text-noir-900/50"}
                      />
                      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em]">
                        PIX
                      </p>
                      <p className="mt-0.5 text-xs text-noir-900/50">
                        QR Code na hora · aprovação instantânea
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayment("whatsapp")}
                      className={cx(
                        "rounded-2xl border p-4 text-left transition-all",
                        payment === "whatsapp"
                          ? "border-rose-500 bg-blush-50 ring-2 ring-rose-200"
                          : "border-noir-900/12 bg-white hover:border-noir-900/30",
                      )}
                    >
                      <MessageCircle
                        size={20}
                        className={payment === "whatsapp" ? "text-rose-600" : "text-noir-900/50"}
                      />
                      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em]">
                        WhatsApp
                      </p>
                      <p className="mt-0.5 text-xs text-noir-900/50">
                        combine com a Neusa
                      </p>
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {payment === "pix" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5 flex items-start gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-xs leading-relaxed text-emerald-800"
                      >
                        <QrCode size={15} className="mt-0.5 shrink-0" />
                        Ao confirmar, você recebe o QR Code PIX já com o valor e
                        o número do pedido preenchidos. Seu pedido é separado
                        assim que o pagamento é identificado.
                      </motion.div>
                    )}

                    {payment === "whatsapp" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5 flex items-start gap-2 rounded-2xl bg-blush-100 px-4 py-3 text-xs leading-relaxed text-noir-900/70"
                      >
                        <MessageCircle size={15} className="mt-0.5 shrink-0 text-rose-500" />
                        Ao confirmar, abrimos uma conversa no WhatsApp com o
                        resumo do seu pedido para combinar pagamento e entrega
                        diretamente com a Neusa.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="mt-5 flex items-start gap-2 rounded-2xl bg-ivory px-4 py-3 text-[11px] leading-relaxed text-noir-900/50">
                    <LockKeyhole size={13} className="mt-0.5 shrink-0" />
                    Não pedimos dados de cartão neste site. Pagamentos com
                    cartão são combinados diretamente com a loja no WhatsApp.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-noir-900/8 pt-6">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-noir-900/55 transition-colors hover:text-noir-900"
                >
                  <ArrowLeft size={14} /> Voltar
                </button>
              ) : (
                <Link
                  href="/produtos"
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-noir-900/55 transition-colors hover:text-noir-900"
                >
                  <ArrowLeft size={14} /> Continuar comprando
                </Link>
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full bg-noir-900 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-all hover:bg-rose-600 active:scale-[0.98]"
                >
                  Continuar <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2.5 rounded-full bg-noir-900 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-all hover:bg-rose-600 active:scale-[0.98] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Processando…
                    </>
                  ) : (
                    <>
                      <LockKeyhole size={14} /> Confirmar pedido ·{" "}
                      {formatBRL(totals.total)}
                    </>
                  )}
                </button>
              )}
            </div>
            {submitError && (
              <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {submitError}
              </p>
            )}
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-[28px] border border-noir-900/8 bg-white p-6 sm:p-7 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl">Resumo do pedido</h2>
            <ul className="mt-5 space-y-4">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-3">
                  <span className="relative h-16 w-[52px] shrink-0 overflow-hidden rounded-xl bg-blush-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="52px"
                      className="object-cover"
                    />
                    <span className="absolute -right-0 -top-0 inline-flex h-5 min-w-5 items-center justify-center rounded-bl-lg bg-noir-900 px-1 text-[10px] font-bold text-ivory">
                      {item.qty}
                    </span>
                  </span>
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-600">
                        {item.brand}
                      </p>
                      <p className="text-sm font-medium leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-noir-900/45">
                        {item.sizeMl}ml
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatBRL(item.priceCents * item.qty)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2.5 border-t border-noir-900/8 pt-5 text-sm">
              <div className="flex justify-between text-noir-900/60">
                <dt>Subtotal</dt>
                <dd>{formatBRL(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-noir-900/60">
                <dt>Frete</dt>
                <dd>
                  {totals.shipping === 0 ? (
                    <span className="font-semibold text-emerald-600">Grátis</span>
                  ) : (
                    formatBRL(totals.shipping)
                  )}
                </dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <dt>Desconto PIX ({Math.round(PIX_DISCOUNT_RATE * 100)}%)</dt>
                  <dd>−{formatBRL(totals.discount)}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-noir-900/8 pt-3">
                <dt className="font-semibold uppercase tracking-[0.14em]">
                  Total
                </dt>
                <dd className="font-display text-3xl font-medium">
                  {formatBRL(totals.total)}
                </dd>
              </div>
            </dl>

            {totals.shipping > 0 && (
              <p className="mt-3 rounded-xl bg-blush-50 px-3 py-2 text-[11px] text-noir-900/60">
                Faltam{" "}
                <strong>
                  {formatBRL(FREE_SHIPPING_THRESHOLD_CENTS - totals.subtotal)}
                </strong>{" "}
                para o frete grátis.
              </p>
            )}

            <div className="mt-6 space-y-2 rounded-2xl bg-blush-50 p-4 text-xs text-noir-900/60">
              <p className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-rose-500" />
                Produtos originais, lacrados e com nota
              </p>
              <p className="flex items-center gap-2">
                <Truck size={14} className="text-rose-500" />
                Postagem em até 24h úteis com rastreio
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
