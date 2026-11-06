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
  CreditCard,
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
  SHIPPING_FLAT_CENTS,
} from "@/lib/site";
import { useCart } from "@/store/cart";

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR",
  "PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

type PaymentMethod = "pix" | "card" | "whatsapp";

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

type CardState = {
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
  installments: number;
};

const STEPS = [
  { label: "Identificação", icon: MessageCircle },
  { label: "Entrega", icon: Truck },
  { label: "Pagamento", icon: CreditCard },
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

function maskCardNumber(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function maskExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

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
  const [card, setCard] = useState<CardState>({
    number: "",
    holder: "",
    expiry: "",
    cvv: "",
    installments: 10,
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
      payment === "pix" ? Math.round(subtotal * 0.05) : 0;
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
    if (s === 2 && payment === "card") {
      if (card.number.replace(/\D/g, "").length !== 16)
        e.cardNumber = "Número de cartão inválido";
      if (card.holder.trim().length < 5) e.holder = "Nome impresso no cartão";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = "MM/AA";
      if (card.cvv.replace(/\D/g, "").length < 3) e.cvv = "CVV";
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
          items,
          paymentMethod: payment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao finalizar");
      clear();
      router.push(`/pedido/${data.code}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Erro ao finalizar o pedido.",
      );
      setSubmitting(false);
    }
  };

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-[101px]">
        <Loader2 className="animate-spin text-rose-500" size={28} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 pt-[101px] text-center">
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
    <div className="min-h-screen bg-blush-50 pt-[101px]">
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
            Ambiente seguro · dados protegidos
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
                    Usaremos para confirmar seu pedido e enviar novidades.
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
                  <h2 className="font-display text-2xl">Endereço de entrega</h2>
                  <p className="mt-1 text-sm text-noir-900/55">
                    Enviamos para todo o Brasil com código de rastreio.
                  </p>
                  <div className="mt-6 grid gap-5">
                    <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
                      <Field label="CEP*" error={errors.cep}>
                        <input
                          inputMode="numeric"
                          className={inputCls}
                          value={form.cep}
                          onChange={(e) => set("cep", maskCep(e.target.value))}
                          placeholder="86000-000"
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
                    <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
                      <Field label="Endereço*" error={errors.address}>
                        <input
                          className={inputCls}
                          value={form.address}
                          onChange={(e) => set("address", e.target.value)}
                          placeholder="Rua, avenida…"
                          autoComplete="street-address"
                        />
                      </Field>
                      <Field label="Número*" error={errors.number}>
                        <input
                          className={inputCls}
                          value={form.number}
                          onChange={(e) => set("number", e.target.value)}
                          placeholder="123"
                        />
                      </Field>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Complemento">
                        <input
                          className={inputCls}
                          value={form.complement}
                          onChange={(e) => set("complement", e.target.value)}
                          placeholder="Apto, bloco (opcional)"
                        />
                      </Field>
                      <Field label="Cidade*" error={errors.city}>
                        <input
                          className={inputCls}
                          value={form.city}
                          onChange={(e) => set("city", e.target.value)}
                          placeholder="Londrina"
                        />
                      </Field>
                    </div>
                    <p className="flex items-center gap-2 rounded-2xl bg-blush-50 px-4 py-3 text-xs text-noir-900/60">
                      <Truck size={15} className="text-rose-500" />
                      {totals.subtotal >= FREE_SHIPPING_THRESHOLD_CENTS
                        ? "Seu pedido tem frete grátis!"
                        : `Frete fixo de ${formatBRL(SHIPPING_FLAT_CENTS)} — grátis acima de ${formatBRL(FREE_SHIPPING_THRESHOLD_CENTS)}`}
                    </p>
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

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {(
                      [
                        {
                          id: "pix",
                          icon: QrCode,
                          title: "PIX",
                          desc: "5% OFF · aprovação instantânea",
                          highlight: true,
                        },
                        {
                          id: "card",
                          icon: CreditCard,
                          title: "Cartão",
                          desc: "em até 10x sem juros",
                        },
                        {
                          id: "whatsapp",
                          icon: MessageCircle,
                          title: "WhatsApp",
                          desc: "combine com a Neusa",
                        },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPayment(m.id)}
                        className={cx(
                          "relative rounded-2xl border p-4 text-left transition-all",
                          payment === m.id
                            ? "border-rose-500 bg-blush-50 ring-2 ring-rose-200"
                            : "border-noir-900/12 bg-white hover:border-noir-900/30",
                        )}
                      >
                        {m.id === "pix" && (
                          <span className="absolute -top-2.5 right-3 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                            −5%
                          </span>
                        )}
                        <m.icon
                          size={20}
                          className={cx(
                            payment === m.id ? "text-rose-600" : "text-noir-900/50",
                          )}
                        />
                        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em]">
                          {m.title}
                        </p>
                        <p className="mt-0.5 text-xs text-noir-900/50">{m.desc}</p>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence initial={false}>
                    {payment === "card" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 grid gap-5 rounded-2xl border border-noir-900/8 bg-ivory/60 p-5">
                          <Field label="Número do cartão*" error={errors.cardNumber}>
                            <input
                              inputMode="numeric"
                              className={inputCls}
                              value={card.number}
                              onChange={(e) =>
                                setCard((c) => ({
                                  ...c,
                                  number: maskCardNumber(e.target.value),
                                }))
                              }
                              placeholder="0000 0000 0000 0000"
                            />
                          </Field>
                          <Field label="Nome impresso no cartão*" error={errors.holder}>
                            <input
                              className={inputCls}
                              value={card.holder}
                              onChange={(e) =>
                                setCard((c) => ({ ...c, holder: e.target.value.toUpperCase() }))
                              }
                              placeholder="MARIA SILVA"
                            />
                          </Field>
                          <div className="grid gap-5 sm:grid-cols-3">
                            <Field label="Validade*" error={errors.expiry}>
                              <input
                                inputMode="numeric"
                                className={inputCls}
                                value={card.expiry}
                                onChange={(e) =>
                                  setCard((c) => ({ ...c, expiry: maskExpiry(e.target.value) }))
                                }
                                placeholder="MM/AA"
                              />
                            </Field>
                            <Field label="CVV*" error={errors.cvv}>
                              <input
                                inputMode="numeric"
                                className={inputCls}
                                value={card.cvv}
                                onChange={(e) =>
                                  setCard((c) => ({
                                    ...c,
                                    cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                                  }))
                                }
                                placeholder="123"
                              />
                            </Field>
                            <Field label="Parcelas">
                              <select
                                className={inputCls}
                                value={card.installments}
                                onChange={(e) =>
                                  setCard((c) => ({
                                    ...c,
                                    installments: Number(e.target.value),
                                  }))
                                }
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                  <option key={n} value={n}>
                                    {n}x de{" "}
                                    {formatBRL(
                                      Math.round(
                                        (totals.subtotal + totals.shipping) / n,
                                      ),
                                    )}
                                  </option>
                                ))}
                              </select>
                            </Field>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {payment === "pix" && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5 flex items-start gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-xs leading-relaxed text-emerald-800"
                      >
                        <QrCode size={15} className="mt-0.5 shrink-0" />
                        Após confirmar o pedido, você recebe a chave PIX e o valor
                        com desconto. Seu pedido é separado assim que o pagamento
                        é identificado.
                      </motion.p>
                    )}

                    {payment === "whatsapp" && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5 flex items-start gap-2 rounded-2xl bg-blush-100 px-4 py-3 text-xs leading-relaxed text-noir-900/70"
                      >
                        <MessageCircle size={15} className="mt-0.5 shrink-0 text-rose-500" />
                        Ao confirmar, abrimos uma conversa no WhatsApp com o
                        resumo do seu pedido para combinar pagamento e entrega
                        diretamente com a Neusa.
                      </motion.p>
                    )}
                  </AnimatePresence>
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
          <aside className="lg:sticky lg:top-28 h-fit rounded-[28px] border border-noir-900/8 bg-white p-6 sm:p-7">
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
                  <dt>Desconto PIX (5%)</dt>
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

            <div className="mt-6 space-y-2 rounded-2xl bg-blush-50 p-4 text-xs text-noir-900/60">
              <p className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-rose-500" />
                Produtos 100% originais e lacrados
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
