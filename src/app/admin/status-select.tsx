"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";

const STATUS = [
  { value: "aguardando_pagamento", label: "Aguardando PIX" },
  { value: "aguardando_contato", label: "Aguardando contato" },
  { value: "pago", label: "Pago" },
  { value: "enviado", label: "Enviado" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelado", label: "Cancelado" },
];

export function StatusSelect({
  code,
  current,
  updateStatusAction,
}: {
  code: string;
  current: string;
  updateStatusAction: (formData: FormData) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(() => {
          void updateStatusAction(formData);
        });
      }}
      className="inline-flex items-center gap-2"
    >
      <input type="hidden" name="code" value={code} />
      <label className="sr-only" htmlFor={`status-${code}`}>
        Status do pedido {code}
      </label>
      <select
        id={`status-${code}`}
        name="status"
        defaultValue={current}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        disabled={pending}
        className="rounded-full border border-noir-900/15 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-noir-900 focus:border-rose-400 focus:outline-none disabled:opacity-50"
      >
        {STATUS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {pending && <Loader2 size={13} className="animate-spin text-rose-500" />}
    </form>
  );
}
