"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  MessageCircle,
  Plus,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import { whatsappLink } from "@/lib/site";
import { useCart } from "@/store/cart";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ highlight }: { highlight: ProductListItem | null }) {
  const ref = useRef<HTMLElement>(null);
  const addItem = useCart((s) => s.addItem);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-noir-950 text-ivory"
    >
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Image
          src="https://images.pexels.com/photos/30618765/pexels-photo-30618765.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Perfume importado sobre pétalas de rosas"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-55"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/45 to-noir-950/30" />
      <div
        aria-hidden
        className="absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-rose-500/25 blur-[140px]"
      />

      {/* Watermark */}
      <motion.p
        aria-hidden
        style={{ opacity: fade }}
        className="text-outline-ivory pointer-events-none absolute -right-6 top-24 hidden select-none font-display text-[11rem] leading-none tracking-[0.08em] lg:block"
      >
        PARIS
      </motion.p>

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-44 sm:px-6"
      >
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [...EASE] }}
            className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.4em] text-rose-300"
          >
            <span className="h-px w-10 bg-rose-300" />
            Perfumes importados · 100% originais
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: [...EASE] }}
            className="mt-6 font-display text-5xl leading-[1.02] sm:text-7xl lg:text-[5.5rem]"
          >
            O perfume que marca
            <em className="block text-rose-300">o seu momento</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.42, ease: [...EASE] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-ivory/70 sm:text-lg"
          >
            As fragrâncias mais desejadas do mundo — Carolina Herrera, Dior,
            Chanel, Lancôme — lacradas, com nota e aquele atendimento que só a
            Moments Paris entrega.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [...EASE] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/produtos"
              className="group inline-flex items-center gap-3 rounded-full bg-rose-500 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-rose-400 hover:shadow-[0_16px_40px_-12px_rgba(201,111,146,0.7)] active:scale-[0.98]"
            >
              Explorar a coleção
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <a
              href={whatsappLink(
                "Olá! Vim pelo site da Moments Paris e quero uma indicação de perfume.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-ivory/25 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-ivory transition-all duration-300 hover:border-rose-300 hover:text-rose-300"
            >
              <MessageCircle size={16} />
              Pedir indicação
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[12px] text-ivory/60"
          >
            <li className="inline-flex items-center gap-2">
              <ShieldCheck size={15} className="text-rose-300" /> Originais e
              lacrados
            </li>
            <li className="inline-flex items-center gap-2">
              <Truck size={15} className="text-rose-300" /> Envio para todo o
              Brasil
            </li>
            <li className="inline-flex items-center gap-2">
              <Star size={15} className="fill-current text-gold-400" /> 4.9 de
              avaliação média
            </li>
          </motion.ul>
        </div>

        {/* Floating product card */}
        {highlight && (
          <motion.button
            type="button"
            onClick={() =>
              addItem({
                slug: highlight.slug,
                name: highlight.name,
                brand: highlight.brand,
                sizeMl: highlight.sizeMl,
                priceCents: highlight.priceCents,
                image: highlight.image,
              })
            }
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [...EASE] }}
            className="group absolute bottom-24 right-6 hidden w-64 items-center gap-4 rounded-3xl border border-ivory/15 bg-ivory/8 p-4 text-left backdrop-blur-xl transition-colors hover:border-rose-300/50 lg:flex"
            aria-label={`Adicionar ${highlight.name} à sacola`}
          >
            <motion.span
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 -z-10"
            />
            <span className="relative block h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-blush-100">
              <Image
                src={highlight.image}
                alt={highlight.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </span>
            <span className="min-w-0">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-rose-300">
                {highlight.badge ?? "Destaque"}
              </span>
              <span className="block truncate font-display text-lg leading-tight">
                {highlight.name}
              </span>
              <span className="mt-0.5 flex items-center justify-between text-sm">
                <span className="text-ivory/80">
                  {formatBRL(highlight.priceCents)}
                </span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white transition-transform group-hover:scale-110">
                  <Plus size={14} />
                </span>
              </span>
            </span>
          </motion.button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-ivory/50"
        >
          <ChevronDown size={22} />
        </motion.div>
      </motion.div>
    </section>
  );
}
