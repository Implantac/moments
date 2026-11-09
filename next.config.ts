import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Todas as imagens são locais (/public) — sem remotePatterns.
  poweredByHeader: false,

  // Cabeçalhos de segurança para produção.
  //
  // Os antigos X-Frame-Options: ALLOWALL e frame-ancestors * existiam apenas
  // para o preview em iframe e deixavam o site aberto a clickjacking em
  // produção (um invasor podia sobrepor o checkout real em outro site).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Área administrativa e páginas de pedido nunca no índice de busca.
        source: "/(admin|pedido)/(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

// A Vercel não inclui `public/` novo criado no buildCommand, então o site
// institucional (HTML puro, em /site) é servido direto do repositório por
// rewrite, sem passar pelo React nem pelo router do Next.
// Força a barra final: sem ela, os caminhos relativos do HTML
// (assets/site.css) apontariam para a raiz da loja.
nextConfig.trailingSlash = true;
nextConfig.rewrites = async () => [
  { source: "/site", destination: "/site/index.html" },
  { source: "/site/:path*", destination: "/site/:path*" },
];

export default nextConfig;
