"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, Star } from "lucide-react";
import { cx } from "@/lib/format";

export function ReviewForm({ productId }: { productId: number }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [author, setAuthor] = useState("");
  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, author, city, title, body, rating }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setAuthor("");
      setCity("");
      setTitle("");
      setBody("");
      setRating(5);
      router.refresh();
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-[26px] border border-noir-900/8 bg-blush-50 p-6 sm:p-8"
    >
      <h3 className="font-display text-2xl">Escreva sua avaliação</h3>
      <p className="mt-1 text-sm text-noir-900/55">
        Conte como foi sua experiência com este perfume.
      </p>

      <div className="mt-5 flex items-center gap-1.5" role="radiogroup" aria-label="Sua nota">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${i} estrela${i > 1 ? "s" : ""}`}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              size={24}
              className={cx(
                "transition-colors",
                (hover || rating) >= i
                  ? "fill-gold-500 text-gold-500"
                  : "fill-none text-noir-900/25",
              )}
            />
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <input
          required
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Seu nome*"
          maxLength={60}
          className="rounded-2xl border border-noir-900/10 bg-white px-4 py-3 text-sm placeholder:text-noir-900/35 focus:border-rose-400 focus:outline-none"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Cidade (opcional)"
          maxLength={60}
          className="rounded-2xl border border-noir-900/10 bg-white px-4 py-3 text-sm placeholder:text-noir-900/35 focus:border-rose-400 focus:outline-none"
        />
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título da avaliação (opcional)"
        maxLength={80}
        className="mt-4 w-full rounded-2xl border border-noir-900/10 bg-white px-4 py-3 text-sm placeholder:text-noir-900/35 focus:border-rose-400 focus:outline-none"
      />
      <textarea
        required
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="O que você achou da fragrância, da fixação, da entrega…*"
        rows={4}
        maxLength={600}
        className="mt-4 w-full resize-none rounded-2xl border border-noir-900/10 bg-white px-4 py-3 text-sm placeholder:text-noir-900/35 focus:border-rose-400 focus:outline-none"
      />

      {status === "error" && (
        <p className="mt-3 text-sm text-rose-600">
          Não foi possível enviar. Tente novamente.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending" || status === "done"}
        className={cx(
          "mt-5 inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-all",
          status === "done"
            ? "bg-emerald-600"
            : "bg-noir-900 hover:bg-rose-600 disabled:opacity-60",
        )}
      >
        {status === "sending" && <Loader2 size={15} className="animate-spin" />}
        {status === "done" && <Check size={15} />}
        {status === "done"
          ? "Avaliação enviada!"
          : status === "sending"
            ? "Enviando…"
            : "Enviar avaliação"}
      </button>
    </form>
  );
}
