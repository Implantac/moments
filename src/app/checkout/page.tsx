import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Finalizar compra",
  description:
    "Finalize seu pedido na Moments Paris: pague com PIX com 5% OFF, parcele em até 10x ou peça pelo WhatsApp.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
