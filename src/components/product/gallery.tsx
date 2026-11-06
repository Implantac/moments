"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cx } from "@/lib/format";

type GalleryImage = { src: string; alt: string; badge?: string };

export function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const active = images[index];

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[28px] bg-blush-100"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * 100;
          const y = ((e.clientY - r.top) / r.height) * 100;
          setOrigin(`${x}% ${y}%`);
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={active.src}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-transform duration-500"
              style={{
                transformOrigin: origin,
                transform: zoom ? "scale(1.75)" : "scale(1)",
              }}
            />
          </motion.div>
        </AnimatePresence>
        {active.badge && (
          <span className="absolute left-5 top-5 rounded-full bg-noir-900 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory">
            {active.badge}
          </span>
        )}
        <span className="absolute bottom-5 right-5 rounded-full bg-noir-950/50 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ivory backdrop-blur-sm">
          Passe o mouse para zoom
        </span>
      </div>

      <div className="flex gap-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ver imagem ${i + 1}`}
            className={cx(
              "relative h-24 w-20 overflow-hidden rounded-2xl bg-blush-100 transition-all",
              i === index
                ? "ring-2 ring-rose-500 ring-offset-2 ring-offset-ivory"
                : "opacity-60 hover:opacity-100",
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
