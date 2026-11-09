import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/data";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  // trailingSlash está ativo: toda rota sem barra responde 308 antes de
  // servir a página. O sitemap aponta direto para a versão final, para o
  // Google não gastar rastreamento em redirecionamentos.
  const url = (path: string) => `${base}${path}`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: url("/produtos/"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/produtos/?categoria=feminino"), lastModified: now, priority: 0.7 },
    { url: url("/produtos/?categoria=masculino"), lastModified: now, priority: 0.7 },
    { url: url("/produtos/?promo=1"), lastModified: now, priority: 0.7 },
    { url: url("/sobre/"), lastModified: now, priority: 0.5 },
    { url: url("/contato/"), lastModified: now, priority: 0.5 },
    { url: url("/trocas/"), lastModified: now, priority: 0.4 },
    { url: url("/termos/"), lastModified: now, priority: 0.3 },
    { url: url("/politica-de-privacidade/"), lastModified: now, priority: 0.3 },
    // Site institucional (página única de apresentação).
    { url: url("/site/"), lastModified: now, priority: 0.6 },
  ];

  try {
    const products = await listProducts();
    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: url(`/produto/${p.slug}/`),
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
