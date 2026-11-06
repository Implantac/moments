"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { SITE } from "@/lib/site";

export function CopyPixKey() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(SITE.pixKey);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          /* clipboard indisponível */
        }
      }}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all ${
        copied
          ? "bg-emerald-600 text-white"
          : "bg-noir-900 text-ivory hover:bg-rose-600"
      }`}
    >
      {copied ? (
        <>
          <Check size={14} /> Copiada!
        </>
      ) : (
        <>
          <Copy size={14} /> Copiar chave PIX
        </>
      )}
    </button>
  );
}
