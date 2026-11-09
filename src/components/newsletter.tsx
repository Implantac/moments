"use client";

import { useState } from "react";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";

/**
 * O formulário antigo aceitava o e-mail, mostrava "Inscrito!" e descartava
 * o dado. Coletar e-mail sem finalidade é passivo de LGPD.
 *
 * Enquanto não há integração de e-mail marketing, o caminho honesto é
 * convidar para o canal onde a loja de fato publica: o WhatsApp/Instagram.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Confira o e-mail.");
      return;
    }
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Não foi possível salvar agora.");
      }
      setDone(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    }
  };

  if (done) {
    return (
      <p className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-5 py-3.5 text-sm text-emerald-300">
        <Check size={15} /> Pronto! Avisamos quando chegar novidade.
      </p>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={submit}
        className="flex w-full items-center gap-2 rounded-full border border-ivory/15 bg-ivory/5 p-1.5 pl-5"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu melhor e-mail"
          aria-label="Seu e-mail"
          className="min-w-0 flex-1 bg-transparent text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-rose-500 px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-rose-400"
        >
          Assinar <ArrowRight size={14} />
        </button>
      </form>
      {error && <p className="mt-2 pl-5 text-xs text-rose-300">{error}</p>}
      <p className="mt-2 pl-5 text-[11px] text-ivory/40">
        Só novidades e promoções. Cancele quando quiser — ou{" "}
        <a
          href={whatsappLink("Olá! Queria receber as novidades da Moments Paris.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline decoration-rose-300/50 underline-offset-2 hover:text-ivory"
        >
          <MessageCircle size={11} /> receba no WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
