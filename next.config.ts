import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Todas as imagens agora são servidas de /public — sem remotePatterns.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Permite que a plataforma de preview incorpore o site em iframe.
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
          // Marcar explicitamente como permitido para proxies que inspecionam XFO.
          { key: "X-Frame-Options", value: "ALLOWALL" },
        ],
      },
    ];
  },
};

export default nextConfig;
