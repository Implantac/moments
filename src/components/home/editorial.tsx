"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BadgeCheck, QrCode, ShieldCheck, Truck } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion";
import { SITE } from "@/lib/site";

const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: "100% originais",
    text: "Produtos lacrados, com nota e procedência garantida.",
  },
  {
    icon: Truck,
    title: "Envio para todo o Brasil",
    text: "Postagem em até 24h úteis e frete grátis acima de R$ 599.",
  },
  {
    icon: BadgeCheck,
    title: "Atendimento personalizado",
    text: `A ${SITE.representative} te ajuda a escolher pelo WhatsApp.`,
  },
  {
    icon: QrCode,
    title: "3% OFF no PIX",
    text: "Pagamento instantâneo com desconto aplicado no checkout.",
  },
];

/**
 * Só entra aqui número que a loja consegue provar.
 * As métricas antigas ("2.5k+ clientes", "4.9 de avaliação") eram
 * afirmações sem lastro — em loja real isso é publicidade enganosa.
 */
const STATS = [
  { value: "24h", label: "prazo de postagem" },
  { value: "7 dias", label: "direito de devolução" },
  { value: "100%", label: "produtos originais" },
];

export function Editorial() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6" ref={ref}>
      <div className="grid min-w-0 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative min-w-0">
          <motion.div
            style={{ y }}
            className="relative h-[520px] overflow-hidden rounded-[32px]"
          >
            <Image
              src="/editorial/8797910.jpg"
              alt="Rua de Paris ao entardecer com a Torre Eiffel ao fundo"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir-950/50 to-transparent" />
            <div className="absolute bottom-7 left-7 text-ivory">
              <p className="font-display text-2xl italic">avec amour,</p>
              <p className="text-[11px] uppercase tracking-[0.3em] text-rose-200">
                de Paris para Londrina
              </p>
            </div>
          </motion.div>
          <div
            aria-hidden
            className="absolute -bottom-6 -right-4 -z-10 h-40 w-40 rounded-full bg-rose-300/50 blur-2xl"
          />
        </div>

        <div>
          <SectionHeading
            overline="Nossa essência"
            title={
              <>
                Curadoria com cheiro de <em className="text-rose-500">Paris</em>
              </>
            }
          />
          <Reveal delay={0.15}>
            <p className="mt-6 leading-relaxed text-noir-900/65">
              A Moments Paris nasceu da paixão da {SITE.representative} por
              perfumaria de nicho e grandes maisons. Cada frasco é escolhido a
              dedo entre os lançamentos mais desejados do mundo — e chega até
              você original, lacrado e pronto para transformar dias comuns em
              momentos memoráveis.
            </p>
          </Reveal>

          <div className="mt-9 grid gap-6 sm:grid-cols-2">
            {GUARANTEES.map((g, i) => (
              <Reveal key={g.title} delay={0.1 + i * 0.08}>
                <div className="flex gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blush-100 text-rose-600">
                    <g.icon size={19} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em]">
                      {g.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-noir-900/55">
                      {g.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-noir-900/10 pt-8 sm:gap-6">
              {STATS.map((s) => (
                <div key={s.label} className="min-w-0">
                  <p className="font-display text-3xl text-rose-600 sm:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1 break-words text-[10px] uppercase tracking-[0.12em] text-noir-900/50 sm:text-xs sm:tracking-[0.18em]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
