import type { Metadata } from "next";
import { listProducts } from "@/lib/data";
import { ShopClient } from "@/components/shop/shop-client";

export const metadata: Metadata = {
  title: "Perfumes",
  description:
    "Todos os perfumes importados da Moments Paris: femininos, masculinos, promoções e lançamentos. Originais, lacrados e com frete grátis acima de R$ 599.",
};

export const dynamic = "force-dynamic";

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const products = await listProducts();

  const q = typeof sp.q === "string" ? sp.q : "";
  const categoria = typeof sp.categoria === "string" ? sp.categoria : null;
  const promo = sp.promo === "1" || sp.promo === "true";

  return (
    <ShopClient
      key={JSON.stringify({ q, categoria, promo })}
      products={products}
      initialQuery={q}
      initialCategory={categoria}
      initialPromo={promo}
    />
  );
}
