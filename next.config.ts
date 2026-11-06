import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
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
