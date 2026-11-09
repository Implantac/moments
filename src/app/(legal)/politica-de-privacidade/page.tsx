import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Moments Paris coleta, usa e protege seus dados pessoais, conforme a LGPD (Lei 13.709/2018).",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      overline="Institucional"
      title="Política de Privacidade"
      updatedAt="06 de novembro de 2026"
    >
      <p>
        Esta política explica, de forma direta, quais dados a{" "}
        <strong>{SITE.name}</strong> coleta, por quê, por quanto tempo guarda e
        como você pode pedir acesso, correção ou exclusão. Seguimos a Lei Geral
        de Proteção de Dados (Lei nº 13.709/2018).
      </p>

      <LegalSection title="1. Quais dados coletamos">
        <p>
          <strong>Ao finalizar um pedido:</strong> nome completo, e-mail,
          telefone/WhatsApp, CEP, endereço, número, complemento, cidade e estado.
          Esses dados são necessários para emitir a nota, postar o produto e
          falar com você sobre a entrega.
        </p>
        <p>
          <strong>Ao avaliar um produto:</strong> nome (ou apelido), cidade,
          nota e comentário. A avaliação é publicada no site.
        </p>
        <p>
          <strong>Automaticamente:</strong> dados técnicos de acesso (página
          visitada, tipo de dispositivo e navegador) para segurança e melhoria do
          site.
        </p>
        <p className="rounded-2xl bg-blush-50 p-4 text-sm">
          <strong>Não pedimos e não armazenamos dados de cartão de crédito.</strong>{" "}
          Este site não possui formulário de cartão. Pagamentos com cartão são
          combinados diretamente com a loja, fora do site.
        </p>
      </LegalSection>

      <LegalSection title="2. Para que usamos">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Processar, separar e enviar o seu pedido;</li>
          <li>Entrar em contato sobre pagamento, entrega e pós-venda;</li>
          <li>Emitir documento fiscal;</li>
          <li>Cumprir obrigações legais e fiscais;</li>
          <li>Prevenir fraude e uso indevido do site;</li>
          <li>Melhorar o catálogo e o atendimento (dados agregados).</li>
        </ul>
        <p>
          <strong>Base legal:</strong> execução de contrato (art. 7º, V) para os
          dados do pedido; cumprimento de obrigação legal (art. 7º, II) para nota
          fiscal; legítimo interesse (art. 7º, IX) para segurança e melhoria;
          consentimento (art. 7º, I) para comunicações de marketing, que você
          pode revogar a qualquer momento.
        </p>
      </LegalSection>

      <LegalSection title="3. Com quem compartilhamos">
        <p>
          Apenas com quem é indispensável para entregar o seu pedido:
          transportadora/Correios (nome e endereço), emissor de nota fiscal e
          provedores de infraestrutura do site e do banco de dados. Não vendemos,
          alugamos nem cedemos seus dados para terceiros com finalidade
          publicitária.
        </p>
      </LegalSection>

      <LegalSection title="4. Por quanto tempo guardamos">
        <p>
          Dados de pedidos são mantidos por <strong>5 anos</strong>, prazo
          necessário para cumprir obrigações fiscais e exercer direitos em
          eventual disputa. Dados de marketing são mantidos até você pedir a
          exclusão. Depois desses prazos, os dados são eliminados ou
          anonimizados.
        </p>
      </LegalSection>

      <LegalSection title="5. Seus direitos">
        <p>Você pode, a qualquer momento, solicitar:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>confirmação de que tratamos seus dados;</li>
          <li>acesso aos dados que temos sobre você;</li>
          <li>correção de dados incompletos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>portabilidade dos dados;</li>
          <li>informação sobre compartilhamentos;</li>
          <li>revogação do consentimento.</li>
        </ul>
        <p>
          Para exercer qualquer um deles, fale com a gente pelo WhatsApp{" "}
          <strong>{SITE.whatsappDisplay}</strong>. Respondemos em até 15 dias.
        </p>
      </LegalSection>

      <LegalSection title="6. Segurança">
        <p>
          O site usa conexão criptografada (HTTPS). O acesso ao banco de dados é
          restrito e as senhas e chaves ficam em variáveis de ambiente, nunca no
          código. O link de acompanhamento do pedido é protegido por um código
          de acesso individual — não compartilhe esse link, ele mostra seus dados
          de entrega.
        </p>
        <p>
          Nenhum sistema é 100% imune. Em caso de incidente de segurança que
          possa causar risco relevante aos titulares, comunicaremos os afetados e
          a ANPD, conforme o art. 48 da LGPD.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookies">
        <p>
          Usamos apenas o armazenamento local do navegador para manter a sua
          sacola de compras entre as páginas. Não usamos cookies de rastreamento
          publicitário sem o seu consentimento.
        </p>
      </LegalSection>

      <LegalSection title="8. Contato do responsável">
        <p>
          Encarregado pelo tratamento de dados: <strong>{SITE.representative}</strong>
          {SITE.cnpj ? (
            <>
              {" "}
              — {SITE.name}, CNPJ {SITE.cnpj}
            </>
          ) : (
            <> — {SITE.name}</>
          )}
          , {SITE.city}. WhatsApp: <strong>{SITE.whatsappDisplay}</strong>.
        </p>
        <p className="text-sm text-noir-900/50">
          Esta política pode ser atualizada. A data de revisão no topo sempre
          indica a última versão. Veja também os{" "}
          <Link href="/termos" className="underline decoration-rose-300 underline-offset-4 hover:text-rose-600">
            Termos de Uso
          </Link>{" "}
          e a{" "}
          <Link href="/trocas" className="underline decoration-rose-300 underline-offset-4 hover:text-rose-600">
            Política de Trocas e Devoluções
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
