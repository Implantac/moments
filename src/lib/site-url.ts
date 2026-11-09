/**
 * URL canônica do site, resolvida em ordem de prioridade:
 *   1. NEXT_PUBLIC_SITE_URL (configurar na Vercel com o domínio final)
 *   2. VERCEL_PROJECT_PRODUCTION_URL (domínio de produção do projeto)
 *   3. VERCEL_URL (deploy atual — preview)
 *   4. localhost
 *
 * Usado por metadataBase, sitemap, robots e dados estruturados.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;

  const current = process.env.VERCEL_URL;
  if (current) return `https://${current}`;

  return "http://localhost:3000";
}
