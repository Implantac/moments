"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { SITE } from "@/lib/site";

/**
 * Botão de copiar. Aceita qualquer valor — chave PIX, código copia-e-cola
 * do BR Code, código de rastreio.
 */
export function CopyButton({
  value,
  label = "Copiar",
  copiedLabel = "Copiado!",
  variant = "solid",
  className = "",
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const base =
    "inline-flex items-center gap-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] transition-all";
  const styles = {
    solid: copied
      ? "bg-emerald-600 text-white"
      : "bg-noir-900 text-ivory hover:bg-rose-600",
    outline: copied
      ? "border border-emerald-600 bg-emerald-50 text-emerald-700"
      : "border border-noir-900/15 text-noir-900 hover:border-rose-400 hover:text-rose-600",
    ghost: copied
      ? "text-emerald-600"
      : "text-noir-900/60 hover:text-noir-900",
  }[variant];

  const padding = variant === "ghost" ? "px-2 py-1" : "px-5 py-2.5";

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          /* clipboard indisponível — o valor continua visível na tela */
        }
      }}
      className={`${base} ${styles} ${padding} ${className}`}
      aria-live="polite"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? copiedLabel : label}
    </button>
  );
}

/** Mantido por compatibilidade: copia a chave PIX da loja. */
export function CopyPixKey() {
  return <CopyButton value={SITE.pixKey} label="Copiar chave PIX" copiedLabel="Chave copiada!" />;
}
