import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { BuyPanel } from "@/components/product/buy-panel";
import { ProductAccordions } from "@/components/product/accordions";
import { ProductGallery } from "@/components/product/gallery";
import { ReviewsSection } from "@/components/product/reviews-section";
import { ProductCard } from "@/components/product-card";
import { RatingStars } from "@/components/rating-stars";
import { Reveal, SectionHeading } from "@/components/motion";
import {
  getProductBySlug,
  getProductReviews,
  getRelatedProducts,
} from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

const LIFESTYLE: Record<string, { src: string; alt: string }[]> = {
  feminino: [
    {
      src: "https://images.pexels.com/photos/8450339/pexels-photo-8450339.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960",
      alt: "Mulher elegante escolhendo perfume entre flores",
    },
    {
      src: "https://images.pexels.com/photos/9790391/pexels-photo-9790391.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960",
      alt: "Aplicação de perfume em frasco clássico",
    },
  ],
  masculino: [
    {
      src: "https://images.pexels.com/photos/29133442/pexels-photo-29133442.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960",
      alt: "Homem elegante de terno ajustando o laço",
    },
    {
      src: "https://images.pexels.com/photos/40521620/pexels-photo-40521620.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960",
      alt: "Homem aplicando perfume ao ar livre",
    },
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: `${product.name} — ${product.brand}`,
    description: product.description.slice(0, 160),
    openGraph: { images: [product.image] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product.slug, product.category),
  ]);

  const lifestyle = LIFESTYLE[product.category] ?? LIFESTYLE.feminino;
  const gallery = [
    { src: product.image, alt: `${product.name} — ${product.brand}`, badge: product.badge ?? undefined },
    ...lifestyle,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} — ${product.brand}`,
    image: product.image,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: (product.priceCents / 100).toFixed(2),
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      product.ratingCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.ratingAvg,
            reviewCount: product.ratingCount,
          }
        : undefined,
  };

  return (
    <div className="pt-[101px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Trilha de navegação"
        className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 pt-8 text-xs text-noir-900/50 sm:px-6"
      >
        <Link href="/" className="hover:text-rose-600">
          Início
        </Link>
        <ChevronRight size={12} />
        <Link href="/produtos" className="hover:text-rose-600">
          Perfumes
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/produtos?categoria=${product.category}`}
          className="capitalize hover:text-rose-600"
        >
          {product.category}
        </Link>
        <ChevronRight size={12} />
        <span className="font-medium text-noir-900">{product.name}</span>
      </nav>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[52%_1fr]">
          <ProductGallery images={gallery} />

          <div>
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-rose-600">
                  {product.brand}
                </p>
                <h1 className="mt-2 font-display text-4xl leading-[1.05] sm:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-2 text-sm text-noir-900/55">
                  {product.concentration} · {product.sizeMl}ml ·{" "}
                  {product.family}
                </p>

                <a
                  href="#avaliacoes"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-noir-900/60 transition-colors hover:text-rose-600"
                >
                  <RatingStars rating={product.ratingAvg} size={16} />
                  <span>
                    {product.ratingAvg.toFixed(1)} · {product.ratingCount}{" "}
                    {product.ratingCount === 1 ? "avaliação" : "avaliações"}
                  </span>
                </a>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-6">
                  <BuyPanel product={product} />
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <ProductAccordions
                  description={product.description}
                  notesTop={product.notesTop}
                  notesHeart={product.notesHeart}
                  notesBase={product.notesBase}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection product={product} reviews={reviews} />

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-noir-900/8 bg-blush-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              overline="Continue explorando"
              title={
                <>
                  Você também vai <em className="text-rose-500">amar</em>
                </>
              }
            />
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
