import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Jost, Playfair_Display } from "next/font/google";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: {
    default: "Moments Paris — Perfumes Importados",
    template: "%s · Moments Paris",
  },
  description:
    "Perfumes importados 100% originais com os melhores preços do Brasil. Carolina Herrera, Dior, Chanel, Lancôme e mais. Frete grátis acima de R$ 399 e 5% OFF no PIX.",
  keywords: [
    "perfumes importados",
    "perfumes originais",
    "Moments Paris",
    "perfumes femininos",
    "perfumes masculinos",
  ],
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
      </body>
    </html>
  );
}
