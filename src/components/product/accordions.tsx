"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Flower2, Gem, Leaf, Sparkles, Truck } from "lucide-react";
import { cx } from "@/lib/format";

export function ProductAccordions({
  description,
  notesTop,
  notesHeart,
  notesBase,
}: {
  description: string;
  notesTop: string;
  notesHeart: string;
  notesBase: string;
}) {
  const [open, setOpen] = useState(0);

  const sections = [
    {
      icon: Gem,
      title: "Sobre a fragrância",
      content: <p className="leading-relaxed">{description}</p>,
    },
    {
      icon: Flower2,
      title: "Pirâmide olfativa",
      content: (
        <ul className="space-y-4">
          <li className="flex gap-4">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blush-100 text-rose-500">
              <Sparkles size={16} />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-noir-900/50">
                Notas de topo
              </p>
              <p className="mt-0.5">{notesTop}</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blush-100 text-rose-500">
              <Flower2 size={16} />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-noir-900/50">
                Notas de coração
              </p>
              <p className="mt-0.5">{notesHeart}</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blush-100 text-rose-500">
              <Leaf size={16} />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-noir-900/50">
                Notas de fundo
              </p>
              <p className="mt-0.5">{notesBase}</p>
            </div>
          </li>
        </ul>
      ),
    },
    {
      icon: Truck,
      title: "Entrega & trocas",
      content: (
        <ul className="list-inside space-y-2 text-sm leading-relaxed">
          <li>· Postagem em até 24h úteis após a confirmação do pagamento.</li>
          <li>· Frete grátis em pedidos acima de R$ 399 (abaixo disso, R$ 29,90).</li>
          <li>· Prazo estimado de 3 a 10 dias úteis conforme a região.</li>
          <li>· Troca facilitada em até 7 dias para produtos lacrados.</li>
          <li>· Acompanhe seu pedido pelo WhatsApp com código de rastreio.</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="mt-8 divide-y divide-noir-900/8 rounded-[24px] border border-noir-900/8 bg-white">
      {sections.map((s, i) => {
        const isOpen = open === i;
        return (
          <div key={s.title}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3">
                <s.icon size={17} className="text-rose-500" />
                <span className="text-[13px] font-semibold uppercase tracking-[0.18em]">
                  {s.title}
                </span>
              </span>
              <ChevronDown
                size={17}
                className={cx(
                  "text-noir-900/40 transition-transform duration-300",
                  isOpen && "rotate-180 text-rose-500",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-sm text-noir-900/70">
                    {s.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
