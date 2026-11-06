import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion";
import { ProductCard } from "@/components/product-card";
import type { ProductListItem } from "@/lib/types";

export function FeaturedProducts({ products }: { products: ProductListItem[] }) {
  return (
    <section className="relative overflow-hidden bg-blush-50 py-24">
      <div
        aria-hidden
        className="text-outline-noir pointer-events-none absolute -top-8 left-0 select-none whitespace-nowrap font-display text-[9rem] leading-none"
      >
        most loved — most loved —
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            overline="Os mais desejados"
            title={
              <>
                Queridinhos <em className="text-rose-500">da estação</em>
              </>
            }
          />
          <Reveal delay={0.15}>
            <Link
              href="/produtos"
              className="group inline-flex items-center gap-2 rounded-full bg-noir-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-rose-600"
            >
              Ver todos os perfumes
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.1}>
              <ProductCard product={p} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
