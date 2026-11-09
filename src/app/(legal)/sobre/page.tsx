import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quem somos",
  description:
    "A Moments Paris é uma loja de perfumes importados de Londrina, com atendimento direto da Neusa Buscarini.",
};

export default function AboutPage() {
  return (
    <LegalPage overline="Institucional" title="Quem está por trás">
      <p>
        A <strong>{SITE.name}</strong> nasceu em {SITE.city} de um hábito simples:
        indicar perfume para amigas, irmãs e vizinhas — e acertar quase sempre.
        O que começou em conversa de WhatsApp virou loja, mas o jeito continuou o
        mesmo: uma pessoa responde, orienta e se responsabiliza pelo que envia.
      </p>

      <div className="my-8 flex flex-col items-start gap-5 rounded-[26px] border border-noir-900/10 bg-white p-6 sm:flex-row sm:items-center">
        <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blush-100 font-display text-2xl text-rose-500">
          N
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-rose-600">
            Atendimento
          </p>
          <p className="mt-1 font-display text-2xl">{SITE.representative}</p>
          <p className="mt-1 text-sm text-noir-900/55">
            É ela quem responde as mensagens, escolhe as fragrâncias e embala cada
            pedido.
          </p>
        </div>
      </div>

      <LegalSection title="Por que comprar aqui">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Produto original com nota.</strong> Importado, lacrado e
            conferido antes de sair.
          </li>
          <li>
            <strong>Atendimento de gente.</strong> Você fala com a mesma pessoa
            que prepara o seu pedido — não com um robô.
          </li>
          <li>
            <strong>Indicação antes da compra.</strong> Conte a ocasião, o clima e
            o que a pessoa gosta: sugerimos sem empurrar.
          </li>
          <li>
            <strong>Direito de arrependimento respeitado.</strong> 7 dias do CDC,
            sem discussão.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Sobre perfume importado">
        <p>
          Perfume é o tipo de presente em que a procedência importa mais que o
          preço. Nossa regra é simples: se não temos certeza da origem, não
          vendemos. Por isso trabalhamos com lotes identificados e mantemos a
          nota fiscal de toda entrada.
        </p>
        <p>
          Quer conferir antes de comprar? Pedimos vídeo do frasco, mostramos o
          lote e respondemos qualquer dúvida sobre fixação, projeção e família
          olfativa. É só chamar.
        </p>
      </LegalSection>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={whatsappLink("Olá! Vim pelo site e queria conhecer melhor a loja.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-noir-900 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-rose-600"
        >
          <MessageCircle size={14} /> Falar no WhatsApp
        </a>
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 rounded-full border border-noir-900/15 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-noir-900 transition-colors hover:border-rose-400 hover:text-rose-600"
        >
          Ver o catálogo
        </Link>
      </div>
    </LegalPage>
  );
}
