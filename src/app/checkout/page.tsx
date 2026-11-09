import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Finalizar compra",
  description:
    "Finalize seu pedido na Moments Paris: pague com PIX (QR Code na hora) ou combine com a loja pelo WhatsApp.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
