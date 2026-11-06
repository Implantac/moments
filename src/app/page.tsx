import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { BrandMarquee } from "@/components/home/marquee";
import { Collections } from "@/components/home/collections";
import { Editorial } from "@/components/home/editorial";
import { FeaturedProducts } from "@/components/home/featured";
import { Hero } from "@/components/home/hero";
import { Testimonials } from "@/components/home/testimonials";
import { Reveal } from "@/components/motion";
import { listFeatured } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await listFeatured();
  const highlight =
    featured.find((p) => p.badge === "Mais vendido") ?? featured[0] ?? null;

  return (
    <>
      <Hero highlight={highlight} />
      <BrandMarquee />
      <Collections />
      <FeaturedProducts products={featured} />
      <Editorial />
      <Testimonials />

      {/* CTA Band */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-rose-400 to-rose-500 py-20 text-center text-white">
        <div
          aria-hidden
          className="text-outline-ivory pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-display text-[10rem] opacity-40"
        >
          moments · moments
        </div>
        <div className="relative mx-auto max-w-2xl px-4">
          <Reveal>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">
              Não sabe qual perfume escolher?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-white/85">
              Conte pra gente o seu estilo e a ocasião — a Neusa monta uma
              seleção personalizada pra você, sem compromisso.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={whatsappLink(
                  "Olá! Quero ajuda para escolher um perfume. Podem me indicar?",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-noir-950 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-ivory transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                <MessageCircle size={16} />
                Falar com a Neusa
              </a>
              <Link
                href="/produtos"
                className="inline-flex items-center gap-3 rounded-full border border-white/40 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-white/10"
              >
                Explorar a coleção
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
