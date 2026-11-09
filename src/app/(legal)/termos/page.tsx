import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { FREE_SHIPPING_THRESHOLD_CENTS, PIX_DISCOUNT_RATE, SITE } from "@/lib/site";
import { formatBRL } from "@/lib/format";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Condições de compra, pagamento, entrega e garantia na Moments Paris.",
};

export default function TermsPage() {
  return (
    <LegalPage
      overline="Institucional"
      title="Termos de Uso"
      updatedAt="06 de novembro de 2026"
    >
      <p>
        Ao comprar na <strong>{SITE.name}</strong> você concorda com as condições
        abaixo. Escrevemos em linguagem simples, mas elas valem como contrato,
        junto com o Código de Defesa do Consumidor (Lei nº 8.078/1990).
      </p>

      <LegalSection title="1. Quem somos">
        <p>
          {SITE.name} — loja de perfumes importados de {SITE.city}.
          {SITE.cnpj ? ` CNPJ ${SITE.cnpj}.` : ""} Atendimento por{" "}
          {SITE.representative}, pelo WhatsApp {SITE.whatsappDisplay}.
        </p>
      </LegalSection>

      <LegalSection title="2. Produtos e preços">
        <p>
          Todos os perfumes são importados, originais e lacrados, acompanhados de
          nota fiscal. Trabalhamos com unidades limitadas: o estoque exibido no
          site é atualizado a cada venda e pode zerar durante a sua compra. Se
          isso acontecer, avisamos e devolvemos o valor integral em até 7 dias.
        </p>
        <p>
          Os preços são em reais (BRL) e já incluem tributos. Podem ser
          alterados sem aviso prévio, mas o preço que valeu é o que apareceu na
          confirmação do seu pedido.
        </p>
        <p>
          O pagamento no PIX tem <strong>{Math.round(PIX_DISCOUNT_RATE * 100)}% de desconto</strong>{" "}
          sobre o valor dos produtos. O frete é{" "}
          <strong>grátis</strong> para pedidos a partir de{" "}
          {formatBRL(FREE_SHIPPING_THRESHOLD_CENTS)}.
        </p>
      </LegalSection>

      <LegalSection title="3. Pagamento">
        <p>
          Aceitamos <strong>PIX</strong> (com QR Code gerado no site) e{" "}
          <strong>pagamento combinado pelo WhatsApp</strong>, incluindo cartão de
          crédito. Este site <strong>não solicita nem armazena dados de cartão</strong>:
          quando o pagamento é no cartão, a informação é passada diretamente à
          loja pelo WhatsApp e processada em terminal da maquininha ou link do
          gateway.
        </p>
        <p>
          O pedido só é separado e enviado após a confirmação do pagamento. PIX
          costuma compensar em segundos.
        </p>
      </LegalSection>

      <LegalSection title="4. Entrega">
        <p>
          Postamos em até <strong>24 horas úteis</strong> após a confirmação do
          pagamento. Enviamos o código de rastreio pelo WhatsApp. O prazo de
          transporte varia conforme a região e a transportadora e é informado no
          momento da postagem.
        </p>
        <p>
          O endereço é de responsabilidade do cliente. Se o pedido retornar por
          endereço incorreto ou ausência de recebedor, entraremos em contato para
          combinar o reenvio, que pode ter novo custo de frete.
        </p>
      </LegalSection>

      <LegalSection title="5. Trocas, devoluções e arrependimento">
        <p>
          Você tem direito de arrependimento em até <strong>7 dias corridos</strong>{" "}
          após o recebimento (CDC, art. 49). Basta nos chamar no WhatsApp. Veja o
          passo a passo na{" "}
          <Link
            href="/trocas"
            className="underline decoration-rose-300 underline-offset-4 hover:text-rose-600"
          >
            Política de Trocas e Devoluções
          </Link>
          .
        </p>
        <p>
          Produto com vício ou avaria é trocado sem custo, com frete pago pela
          loja.
        </p>
      </LegalSection>

      <LegalSection title="6. Uso do site">
        <p>
          Você se compromete a fornecer dados verdadeiros e a não usar o site
          para fins ilícitos, para sobrecarregar a infraestrutura ou para extrair
          dados de forma automatizada. Pedidos com indício de fraude podem ser
          cancelados, com aviso ao cliente.
        </p>
        <p>
          Textos, fotos, marca e identidade visual da {SITE.name} são de uso
          exclusivo da loja.
        </p>
      </LegalSection>

      <LegalSection title="7. Foro e legislação">
        <p>
          Aplica-se a legislação brasileira. Eventuais conflitos serão
          resolvidos, preferencialmente, por conversa direta — e, se necessário,
          no foro do domicílio do consumidor, conforme o CDC.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
