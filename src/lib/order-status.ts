/**
 * Rótulos e etapas do pedido, compartilhados entre o painel (/admin) e a
 * página do cliente (/pedido/[code]).
 *
 * Antes o painel prometia "o cliente vê o status na página dele", mas a página
 * do pedido mostrava sempre o QR do PIX — inclusive depois de pago ou enviado.
 * Centralizar aqui garante que os dois lados falem a mesma língua.
 */

export const STATUS_LABEL: Record<string, string> = {
  aguardando_pagamento: "Aguardando PIX",
  aguardando_contato: "Aguardando contato",
  pago: "Pago",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export const STATUS_ORDER = [
  "aguardando_pagamento",
  "aguardando_contato",
  "pago",
  "enviado",
  "entregue",
  "cancelado",
] as const;

/** Texto curto que o cliente lê logo abaixo do título do pedido. */
export const STATUS_CUSTOMER_HINT: Record<string, string> = {
  aguardando_pagamento:
    "Assim que o PIX cair, sua compra é separada e postada em até 24h úteis.",
  aguardando_contato:
    "Recebemos seu pedido! A Neusa vai te chamar no WhatsApp para combinar o pagamento.",
  pago: "Pagamento confirmado. Seu perfume está sendo separado para postagem.",
  enviado: "Pedido postado! O código de rastreio chega no seu WhatsApp.",
  entregue: "Pedido entregue. Obrigada pela confiança na Moments Paris.",
  cancelado:
    "Este pedido foi cancelado. Se tiver dúvidas, fale com a loja no WhatsApp.",
};

/**
 * Etapas da linha do tempo do cliente (cancelado fica fora).
 * Pedido por PIX começa em "Aguardando PIX"; pedido combinado no WhatsApp
 * começa em "Aguardando contato" — antes a página mostrava "Aguardando PIX"
 * também para quem tinha escolhido WhatsApp.
 */
export function timelineFor(paymentMethod: string): readonly string[] {
  const first = paymentMethod === "whatsapp" ? "aguardando_contato" : "aguardando_pagamento";
  return [first, "pago", "enviado", "entregue"];
}

export function statusLabel(status: string): string {
  return STATUS_LABEL[status] ?? status;
}
