import type { MetadataRoute } from "next";

/**
 * Manifesto da web app: permite "Adicionar à tela de início" no celular com
 * o ícone certo e o nome curto. Sem service worker — não é um app offline,
 * só evita que o atalho abra como uma aba anônima do navegador.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Moments Paris — Perfumes Importados",
    short_name: "Moments",
    description:
      "Perfumes importados originais com atendimento direto da loja. PIX com desconto e frete grátis acima de R$ 599.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF7F5",
    theme_color: "#1A1A1A",
    lang: "pt-BR",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
