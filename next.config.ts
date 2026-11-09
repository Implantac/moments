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

export default nextConfig;
