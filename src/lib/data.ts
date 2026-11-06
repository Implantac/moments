import { cache } from "react";
import { and, avg, count, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, reviews, type Product } from "@/db/schema";
import type { ProductListItem, ReviewItem } from "@/lib/types";

function toListItem(
  p: Product,
  rating?: { avg: number; count: number },
): ProductListItem {
  return {
    ...p,
    createdAt: p.createdAt.toISOString(),
    ratingAvg: rating ? Math.round(rating.avg * 10) / 10 : 0,
    ratingCount: rating?.count ?? 0,
  };
}

async function ratingMap() {
  const rows = await db
    .select({
      productId: reviews.productId,
      ratingAvg: avg(reviews.rating),
      ratingCount: count(reviews.id),
    })
    .from(reviews)
    .groupBy(reviews.productId);
  return new Map(
    rows.map((r) => [
      r.productId,
      { avg: Number(r.ratingAvg ?? 0), count: r.ratingCount },
    ]),
  );
}

export const listProducts = cache(async (): Promise<ProductListItem[]> => {
  const [rows, ratings] = await Promise.all([
    db.select().from(products),
    ratingMap(),
  ]);
  return rows
    .map((p) => toListItem(p, ratings.get(p.id)))
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.ratingCount - a.ratingCount;
    });
});

export const listFeatured = cache(async (): Promise<ProductListItem[]> => {
  const all = await listProducts();
  return all.filter((p) => p.featured).slice(0, 6);
});

export const getProductBySlug = cache(
  async (slug: string): Promise<ProductListItem | null> => {
    const [row] = await db.select().from(products).where(eq(products.slug, slug));
    if (!row) return null;
    const ratings = await ratingMap();
    return toListItem(row, ratings.get(row.id));
  },
);

export const getRelatedProducts = cache(
  async (slug: string, category: string): Promise<ProductListItem[]> => {
    const [rows, ratings] = await Promise.all([
      db
        .select()
        .from(products)
        .where(and(eq(products.category, category), ne(products.slug, slug)))
        .limit(4),
      ratingMap(),
    ]);
    return rows.map((p) => toListItem(p, ratings.get(p.id)));
  },
);

export const getProductReviews = cache(
  async (productId: number): Promise<ReviewItem[]> => {
    const rows = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
    return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
  },
);

export async function getOrderByCode(code: string) {
  const [row] = await db.select().from(orders).where(eq(orders.code, code));
  if (!row) return null;
  return { ...row, createdAt: row.createdAt.toISOString() };
}
