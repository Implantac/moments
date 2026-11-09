import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";
import { Jost, Playfair_Display } from "next/font/google";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { SITE } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Moments Paris — Perfumes Importados Originais",
    template: "%s · Moments Paris",
  },
  description:
    "Perfumes importados originais, lacrados e com nota fiscal. Carolina Herrera, Dior, Chanel, Lancôme e mais. Atendimento direto com a Neusa, em Londrina. PIX com desconto e frete grátis acima de R$ 599.",
  keywords: [
    "perfumes importados",
    "perfumes originais",
    "Moments Paris",
    "perfumes femininos",
    "perfumes masculinos",
    "perfume importado Londrina",
  ],
  applicationName: SITE.name,
  authors: [{ name: SITE.representative }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    title: "Moments Paris — Perfumes Importados Originais",
    description:
      "Perfumes importados originais com atendimento direto da loja. PIX com desconto, frete grátis acima de R$ 599 e postagem em 24h úteis.",
    images: [{ url: "/products/good-girl.jpg", width: 800, height: 1000, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moments Paris — Perfumes Importados Originais",
    description: "Perfumes importados originais com atendimento direto da loja.",
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: { telephone: false },
  // Atalho na tela de início do celular: ícone + nome curto (manifest.ts).
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${jost.variable}`}>
      <body className="min-h-screen font-sans">
        <Header />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        {/* Analytics sem cookie: conta visitas e conversão sem banner de LGPD. */}
        <Analytics />
      </body>
    </html>
  );
}
