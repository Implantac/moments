"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import { RatingStars } from "@/components/rating-stars";
import { useCart } from "@/store/cart";

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductListItem;
  priority?: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const discount = product.compareAtCents
    ? Math.round((1 - product.priceCents / product.compareAtCents) * 100)
    : 0;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="group relative flex flex-col"
    >
      <Link
        href={`/produto/${product.slug}`}
        className="relative block overflow-hidden rounded-[22px] bg-blush-100"
        aria-label={`Ver ${product.name} de ${product.brand}`}
      >
        <div className="relative aspect-[4/5]">
          <Image
            src={product.image}
            alt={`${product.name} — ${product.brand}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        </div>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                product.badge === "Oferta"
                  ? "bg-rose-500 text-white"
                  : "bg-noir-900 text-ivory"
              }`}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="w-fit rounded-full bg-gold-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
              −{discount}%
            </span>
          )}
        </div>

        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-noir-900/85 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-ivory backdrop-blur-sm transition-transform duration-500 group-hover:translate-y-0">
          Ver detalhes
        </span>
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose-600">
          {product.brand}
        </p>
        <Link href={`/produto/${product.slug}`}>
          <h3 className="mt-1 font-display text-xl leading-tight text-noir-900 transition-colors group-hover:text-rose-600">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-noir-900/50">
          {product.concentration} · {product.sizeMl}ml
        </p>

        <div className="mt-2 flex items-center gap-1.5">
          <RatingStars rating={product.ratingAvg} />
          <span className="text-[11px] text-noir-900/45">
            {product.ratingAvg > 0
              ? `${product.ratingAvg.toFixed(1)} (${product.ratingCount})`
              : "Novo"}
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          {product.compareAtCents && (
            <span className="text-xs text-noir-900/40 line-through">
              {formatBRL(product.compareAtCents)}
            </span>
          )}
          <span className="text-lg font-semibold text-noir-900">
            {formatBRL(product.priceCents)}
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            addItem({
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              sizeMl: product.sizeMl,
              priceCents: product.priceCents,
              image: product.image,
            })
          }
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-noir-900 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-all duration-300 hover:bg-rose-600 active:scale-[0.98]"
        >
          <ShoppingBag size={14} />
          Adicionar
        </button>
      </div>
    </motion.article>
  );
}
