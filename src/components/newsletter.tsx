"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
        setDone(true);
        setEmail("");
        setTimeout(() => setDone(false), 4000);
      }}
      className="flex w-full max-w-md items-center gap-2 rounded-full border border-ivory/15 bg-ivory/5 p-1.5 pl-5"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Seu melhor e-mail"
        className="min-w-0 flex-1 bg-transparent text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
      />
      <button
        type="submit"
        className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
          done
            ? "bg-emerald-500 text-white"
            : "bg-rose-500 text-white hover:bg-rose-400"
        }`}
      >
        {done ? (
          <>
            <Check size={14} /> Inscrito!
          </>
        ) : (
          <>
            Assinar <ArrowRight size={14} />
          </>
        )}
      </button>
    </form>
  );
}
