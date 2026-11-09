"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, MessageCircle, RotateCcw } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";

/**
 * Antes deste arquivo, qualquer falha de banco virava a tela branca
 * "Application error" do Next. Agora o cliente vê uma saída clara.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 pt-[111px] text-center">
      <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <AlertTriangle size={36} strokeWidth={1.6} />
      </span>
      <h1 className="mt-6 font-display text-4xl">Algo saiu do lugar</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-noir-900/60">
        Tivemos uma instabilidade momentânea ao carregar esta página. Tente
        novamente — se persistir, fale com a gente no WhatsApp que resolvemos
        pelo lado de cá.
      </p>

      {error.digest && (
        <p className="mt-4 rounded-full bg-blush-50 px-4 py-1.5 font-mono text-[10px] text-noir-900/40">
          código do erro: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-noir-900 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-rose-600"
        >
          <RotateCcw size={14} /> Tentar de novo
        </button>
        <a
          href={whatsappLink("Olá! Tive um problema no site da Moments Paris.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-noir-900/15 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-noir-900 transition-colors hover:border-emerald-600 hover:text-emerald-700"
        >
          <MessageCircle size={14} /> WhatsApp {SITE.whatsappDisplay}
        </a>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-noir-900/55 transition-colors hover:text-noir-900"
        >
          Ir para a home
        </Link>
      </div>
    </div>
  );
}
