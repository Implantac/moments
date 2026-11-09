import { BadgeCheck, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion";
import { SITE, whatsappLink } from "@/lib/site";

/**
 * Substitui a seção de depoimentos fictícios.
 *
 * Publicar depoimentos inventados em uma loja real é publicidade enganosa
 * (CDC, art. 37) — e num mercado onde o cliente teme falsificação, é a
 * reivindicação que mais destrói confiança quando descoberta.
 *
 * Enquanto não houver depoimentos reais com autorização, mostramos o que
 * podemos provar: quem atende, como embala e o que garante a compra.
 */
const PROMISES = [
  {
    icon: BadgeCheck,
    title: "Original e lacrado",
    text: "Todo perfume é importado, com nota fiscal e conferência de lote antes de sair.",
  },
  {
    icon: Truck,
    title: "Postagem em 24h úteis",
    text: "Código de rastreio enviado no WhatsApp assim que o pacote é postado.",
  },
  {
    icon: ShieldCheck,
    title: "7 dias para desistir",
    text: "Direito de arrependimento do CDC: recebeu e não era o que esperava, devolvemos.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-noir-950 py-24 text-ivory">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          light
          center
          overline="Por que comprar aqui"
          title={
            <>
              Quem atende, <em className="text-rose-300">se responsabiliza</em>
            </>
          }
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PROMISES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <div className="flex h-full flex-col rounded-[26px] border border-ivory/10 bg-ivory/[0.04] p-7 backdrop-blur-sm transition-colors hover:border-rose-400/30">
                <p.icon size={26} className="text-rose-300" strokeWidth={1.5} />
                <h3 className="mt-5 font-display text-xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/60">
                  {p.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Rosto e nome de quem atende: mais convincente que qualquer selo */}
        <Reveal delay={0.2}>
          <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-6 rounded-[26px] border border-ivory/10 bg-ivory/[0.04] p-7 text-center sm:flex-row sm:text-left">
            <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-rose-500/15 font-display text-2xl text-rose-300">
              {SITE.representative.charAt(0)}
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-rose-300">
                Quem responde no WhatsApp
              </p>
              <h3 className="mt-2 font-display text-xl">
                {SITE.representative}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ivory/60">
                Atende em {SITE.city}, tira dúvidas sobre fixação, família
                olfativa e indica o perfume certo para cada ocasião.
              </p>
              <a
                href={whatsappLink(
                  "Olá! Vim pelo site e queria uma indicação de perfume.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-ivory/20 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:border-rose-400 hover:text-rose-300"
              >
                <MessageCircle size={14} /> Falar com a Neusa
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
