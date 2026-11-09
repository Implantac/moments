import type { Metadata } from "next";
import { AtSign, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Moments Paris pelo WhatsApp, Instagram ou e-mail.",
};

export default function ContactPage() {
  return (
    <LegalPage overline="Institucional" title="Fale com a gente">
      <p>
        Atendimento direto, com quem embala e envia o seu perfume. Sem robô e sem
        fila de SAC.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <a
          href={whatsappLink("Olá! Vim pelo site da Moments Paris.")}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl border border-noir-900/10 bg-white p-5 transition-colors hover:border-emerald-500"
        >
          <MessageCircle size={20} className="text-emerald-600" />
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-noir-900/45">
            WhatsApp
          </p>
          <p className="mt-1 font-display text-xl">{SITE.whatsappDisplay}</p>
          <p className="mt-1 text-xs text-noir-900/50">
            Resposta em horário comercial · canal principal
          </p>
        </a>

        <a
          href={SITE.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl border border-noir-900/10 bg-white p-5 transition-colors hover:border-rose-400"
        >
          <AtSign size={20} className="text-rose-500" />
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-noir-900/45">
            Instagram
          </p>
          <p className="mt-1 font-display text-xl">{SITE.instagramHandle}</p>
          <p className="mt-1 text-xs text-noir-900/50">
            Novidades, promoções e bastidores
          </p>
        </a>

        {SITE.email && (
          <a
            href={`mailto:${SITE.email}`}
            className="group rounded-2xl border border-noir-900/10 bg-white p-5 transition-colors hover:border-rose-400"
          >
            <Mail size={20} className="text-rose-500" />
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-noir-900/45">
              E-mail
            </p>
            <p className="mt-1 break-all font-display text-lg">{SITE.email}</p>
          </a>
        )}

        <div className="rounded-2xl border border-noir-900/10 bg-white p-5">
          <MapPin size={20} className="text-rose-500" />
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-noir-900/45">
            Onde estamos
          </p>
          <p className="mt-1 font-display text-xl">{SITE.city}</p>
          <p className="mt-1 text-xs text-noir-900/50">
            Enviamos para todo o Brasil
          </p>
        </div>
      </div>

      <LegalSection title="Horário de atendimento">
        <p className="flex items-start gap-2">
          <Clock size={16} className="mt-0.5 shrink-0 text-rose-500" />
          Segunda a sexta, 9h às 18h · sábado, 9h às 13h. Mensagens fora desse
          horário são respondidas no próximo dia útil.
        </p>
      </LegalSection>

      <LegalSection title="Informações da loja">
        <p>
          {SITE.name}
          {SITE.cnpj ? ` · CNPJ ${SITE.cnpj}` : ""}
          <br />
          Responsável: {SITE.representative}
          <br />
          {SITE.city}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
