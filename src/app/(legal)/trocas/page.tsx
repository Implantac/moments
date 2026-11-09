import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trocas e Devoluções",
  description:
    "Como trocar ou devolver um perfume comprado na Moments Paris, com prazo de 7 dias do CDC.",
};

export default function ReturnsPage() {
  return (
    <LegalPage
      overline="Institucional"
      title="Trocas e Devoluções"
      updatedAt="06 de novembro de 2026"
    >
      <p>
        Comprar perfume sem sentir é um voto de confiança. Se não der certo, a
        gente resolve — e a regra é simples.
      </p>

      <LegalSection title="Desistência em até 7 dias">
        <p>
          Conforme o <strong>artigo 49 do Código de Defesa do Consumidor</strong>,
          você pode desistir da compra em até <strong>7 dias corridos</strong> a
          partir do recebimento, sem precisar justificar. Devolvemos{" "}
          <strong>100% do valor pago</strong>, incluindo o frete, pelo mesmo meio
          de pagamento.
        </p>
        <p>
          Para isso, o produto precisa estar <strong>lacrado</strong>, sem sinais
          de uso, com todos os selos, caixa e acessórios. Perfume violado não
          pode ser revendido — e não podemos aceitá-lo de volta, salvo se houver
          defeito.
        </p>
      </LegalSection>

      <LegalSection title="Como pedir">
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>
            Chame no WhatsApp <strong>{SITE.whatsappDisplay}</strong> com o número
            do pedido (formato MP-XXXXX).
          </li>
          <li>Envie uma foto do produto e da embalagem.</li>
          <li>Combinamos a postagem de retorno — enviamos a etiqueta ou reembolsamos o frete.</li>
          <li>
            Assim que o produto chegar e for conferido, o reembolso é feito em até{" "}
            <strong>7 dias úteis</strong>.
          </li>
        </ol>
      </LegalSection>

      <LegalSection title="Produto com defeito ou avaria">
        <p>
          Recebeu com frasco quebrado, vazando, sem selo ou com o perfume
          errado? Nos avise <strong>em até 72 horas</strong> com fotos ou vídeo do
          pacote ainda fechado. Nesse caso:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>o frete de retorno é por nossa conta;</li>
          <li>você escolhe entre produto igual (se houver estoque), crédito ou reembolso total;</li>
          <li>resolvemos em até 30 dias, conforme o art. 18 do CDC.</li>
        </ul>
      </LegalSection>

      <LegalSection title="O que não cobre">
        <p>
          Não cobrimos: preferência olfativa (perfume é subjetivo — se quiser
          testar antes, peça uma amostra pelo WhatsApp), perfume já aberto ou
          usado, danos por mau armazenamento do cliente (calor, sol direto) e
          devolução depois dos prazos acima.
        </p>
      </LegalSection>

      <LegalSection title="Reembolso">
        <p>
          PIX: devolvemos para a mesma chave que fez o pagamento. Cartão:
          estornamos na fatura — o prazo de aparecer é do banco emissor, em regra
          até duas faturas. Sempre confirmamos o estorno por mensagem.
        </p>
        <p className="rounded-2xl bg-blush-50 p-4">
          <strong>Antes de enviar qualquer devolução</strong>, aguarde nossa
          confirmação e instruções pelo WhatsApp. Postagens sem aviso prévio não
          conseguem ser identificadas e podem atrasar o reembolso.
        </p>
        <a
          href={whatsappLink("Olá! Preciso de orientação sobre troca ou devolução.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-noir-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-rose-600"
        >
          Falar no WhatsApp
        </a>
      </LegalSection>
    </LegalPage>
  );
}
