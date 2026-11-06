import { BadgeCheck, Quote } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion";
import { RatingStars } from "@/components/rating-stars";

const TESTIMONIALS = [
  {
    name: "Natália V.",
    city: "Londrina, PR",
    rating: 5,
    text: "Comprei o La Vie Est Belle e chegou em 2 dias, lacrado e cheirando maravilha. O atendimento da Neusa é impecável — ela me mandou até vídeo do produto antes de enviar.",
  },
  {
    name: "João Pedro H.",
    city: "Curitiba, PR",
    rating: 5,
    text: "Sauvage original pelo melhor preço que achei no Brasil. Pedi pelo WhatsApp, paguei no PIX e recebi com nota e código de rastreio. Confiança total.",
  },
  {
    name: "Adriana S.",
    city: "Maringá, PR",
    rating: 5,
    text: "Já é a quarta compra na Moments Paris. Sempre um brinde fofo na embalagem e os perfumes são sempre originais. Recomendo pra todo mundo da família.",
  },
  {
    name: "Fernando C.",
    city: "São Paulo, SP",
    rating: 5,
    text: "Presenteei minha mãe com o Coco Mademoiselle. A embalagem para presente é tão bonita que ela quase não quis abrir. Virei cliente.",
  },
  {
    name: "Beatriz M.",
    city: "Cambé, PR",
    rating: 4.9,
    text: "O Libre era meu sonho de consumo e aqui estava bem mais em conta. Entrega rápida e perfume com fixação absurda. Só elogios onde eu passo.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-noir-950 py-24 text-ivory">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          light
          center
          overline="Depoimentos"
          title={
            <>
              Quem comprou, <em className="text-rose-300">amou</em>
            </>
          }
        />

        <div className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 0.07}
              className="w-[320px] shrink-0 snap-start sm:w-[380px]"
            >
              <figure className="flex h-full flex-col rounded-[26px] border border-ivory/10 bg-ivory/[0.04] p-7 backdrop-blur-sm transition-colors hover:border-rose-400/30">
                <Quote size={26} className="text-rose-400" strokeWidth={1.4} />
                <div className="mt-4">
                  <RatingStars rating={t.rating} size={15} />
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ivory/75">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-between border-t border-ivory/10 pt-4">
                  <div>
                    <p className="font-display text-lg">{t.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-ivory/45">
                      {t.city}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-300">
                    <BadgeCheck size={12} />
                    Verificada
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
