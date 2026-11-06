import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion";

const COLLECTIONS = [
  {
    href: "/produtos?categoria=feminino",
    eyebrow: "Coleção",
    title: "Para Ela",
    description: "Florais, orientais e gourmands que viram assinatura.",
    image:
      "/editorial/28606748.jpg",
  },
  {
    href: "/produtos?categoria=masculino",
    eyebrow: "Coleção",
    title: "Para Ele",
    description: "Amadeirados, especiados e frescos de presença marcante.",
    image:
      "/editorial/28557815.jpg",
  },
  {
    href: "/produtos?promo=1",
    eyebrow: "Seleção",
    title: "Em Oferta",
    description: "Importados originais com descontos especiais por tempo limitado.",
    image:
      "/editorial/11678207.jpg",
    gold: true,
  },
];

export function Collections() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          overline="Coleções em destaque"
          title={
            <>
              Escolha seu <em className="text-rose-500">mood</em>
            </>
          }
        />
        <Reveal delay={0.15}>
          <Link
            href="/produtos"
            className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.25em] text-noir-900/70 transition-colors hover:text-rose-600"
          >
            Ver todos
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.12} className="h-full">
            <Link
              href={c.href}
              className="group relative block h-[440px] overflow-hidden rounded-[28px] bg-noir-900"
            >
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover opacity-90 transition-all duration-[900ms] ease-out group-hover:scale-[1.07] group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-noir-950/20 to-transparent" />
              {c.gold && (
                <span className="absolute right-5 top-5 rounded-full bg-gold-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  até −20%
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-7 text-ivory">
                <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-rose-300">
                  {c.eyebrow}
                </p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <h3 className="font-display text-4xl">{c.title}</h3>
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ivory/25 transition-all duration-300 group-hover:border-rose-400 group-hover:bg-rose-500">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
                <p className="mt-2 max-w-[260px] text-sm text-ivory/65">
                  {c.description}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
