import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Páginas com dados pessoais e área administrativa nunca são indexadas.
        disallow: ["/pedido/", "/admin", "/api/", "/checkout"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
