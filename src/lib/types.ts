import type { Product, Review } from "@/db/schema";

export type ProductListItem = Omit<Product, "createdAt"> & {
  createdAt: string;
  ratingAvg: number;
  ratingCount: number;
};

export type ReviewItem = Omit<Review, "createdAt"> & {
  createdAt: string;
};

export type SortKey =
  | "destaques"
  | "menor-preco"
  | "maior-preco"
  | "avaliacao"
  | "az";
