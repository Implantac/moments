import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/data";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/produtos`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/produtos?categoria=feminino`, lastModified: now, priority: 0.7 },
    { url: `${base}/produtos?categoria=masculino`, lastModified: now, priority: 0.7 },
    { url: `${base}/sobre`, lastModified: now, priority: 0.5 },
    { url: `${base}/contato`, lastModified: now, priority: 0.5 },
    { url: `${base}/trocas`, lastModified: now, priority: 0.4 },
    { url: `${base}/termos`, lastModified: now, priority: 0.3 },
    { url: `${base}/politica-de-privacidade`, lastModified: now, priority: 0.3 },
  ];

  try {
    const products = await listProducts();
    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${base}/produto/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch {
    // Banco indisponível: o sitemap estático continua válido.
    return staticRoutes;
  }
}
