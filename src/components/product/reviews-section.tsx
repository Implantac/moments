import { BadgeCheck } from "lucide-react";
import { RatingStars } from "@/components/rating-stars";
import { ReviewForm } from "@/components/product/review-form";
import { Reveal, SectionHeading } from "@/components/motion";
import { formatDatePtBr } from "@/lib/format";
import type { ProductListItem, ReviewItem } from "@/lib/types";

export function ReviewsSection({
  product,
  reviews,
}: {
  product: ProductListItem;
  reviews: ReviewItem[];
}) {
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) *
          100
        : 0,
  }));

  return (
    <section id="avaliacoes" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        overline="Avaliações de clientes"
        title={
          <>
            Quem sentiu, <em className="text-rose-500">conta</em>
          </>
        }
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[340px_1fr]">
        {/* Summary + form */}
        <div className="space-y-8">
          <div className="rounded-[26px] border border-noir-900/8 bg-white p-7 text-center">
            <p className="font-display text-7xl leading-none">
              {product.ratingAvg > 0 ? product.ratingAvg.toFixed(1) : "—"}
            </p>
            <div className="mt-3 flex justify-center">
              <RatingStars rating={product.ratingAvg} size={17} />
            </div>
            <p className="mt-2 text-sm text-noir-900/55">
              {product.ratingCount}{" "}
              {product.ratingCount === 1 ? "avaliação" : "avaliações"}
            </p>
            <div className="mt-6 space-y-2">
              {dist.map((d) => (
                <div key={d.star} className="flex items-center gap-3 text-xs">
                  <span className="w-3 font-medium text-noir-900/60">
                    {d.star}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-blush-100">
                    <div
                      className="h-full rounded-full bg-gold-500"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-noir-900/45">
                    {d.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <ReviewForm productId={product.id} />
        </div>

        {/* Reviews list */}
        <div className="space-y-5">
          {reviews.length === 0 && (
            <p className="rounded-[24px] border border-dashed border-noir-900/15 p-10 text-center text-sm text-noir-900/50">
              Seja a primeira pessoa a avaliar este perfume.
            </p>
          )}
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={Math.min(i * 0.06, 0.3)}>
              <article className="rounded-[24px] border border-noir-900/8 bg-white p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blush-100 font-display text-lg text-rose-600">
                      {r.author.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        {r.author}
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                          <BadgeCheck size={11} /> Compra verificada
                        </span>
                      </p>
                      <p className="text-xs text-noir-900/45">
                        {[r.city, formatDatePtBr(r.createdAt)]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  </div>
                  <RatingStars rating={r.rating} />
                </div>
                {r.title && (
                  <h3 className="mt-4 font-display text-xl">{r.title}</h3>
                )}
                <p className="mt-2 text-sm leading-relaxed text-noir-900/65">
                  {r.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
