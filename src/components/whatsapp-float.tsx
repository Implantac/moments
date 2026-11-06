import { MessageCircle } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(
        `Olá ${SITE.representative}! Vim pelo site da Moments Paris e quero conhecer os perfumes.`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-emerald-900/25 transition-transform duration-300 hover:scale-110 sm:bottom-6 sm:right-6"
      style={{ height: 52, width: 52 }}
    >
      <MessageCircle size={24} strokeWidth={2.2} />
    </a>
  );
}
