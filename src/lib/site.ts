export const SITE = {
  name: "Moments Paris",
  tagline: "Perfumes Importados",
  city: "Londrina · Paraná",
  state: "PR",
  representative: "Neusa Buscarini",

  // Dados de contato. Podem ser sobrescritos por ambiente — o repositório é
  // público, então CPF/telefone não deveriam viver no código em produção.
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP ?? "5543999542246",
  whatsappDisplay: "(43) 99954-2246",
  instagramHandle: "@buscarinineusa",
  instagramUrl: "https://instagram.com/buscarinineusa",

  // Recebedor do PIX. Configure no ambiente antes de vender.
  pixKey: process.env.PIX_KEY ?? "",
  pixHolder: process.env.PIX_HOLDER ?? "",
  pixCity: process.env.PIX_CITY ?? "LONDRINA",

  /** CNPJ/razão social — obrigatório exibir em loja (CDC). */
  cnpj: process.env.NEXT_PUBLIC_CNPJ ?? null,
  email: process.env.NEXT_PUBLIC_STORE_EMAIL ?? null,
} as const;

/**
 * Política comercial — os três números que definem a margem de cada venda.
 * Alterar aqui afeta site, checkout e API (o servidor é a fonte da verdade).
 */

/**
 * Frete grátis a partir de R$ 599.
 * O produto mais barato custa R$ 429 e o ticket médio é ~R$ 590: a régua
 * premia quem leva 2 itens sem transformar frete grátis em prejuízo em 100%
 * dos pedidos (como acontecia com o limite de R$ 399).
 */
export const FREE_SHIPPING_THRESHOLD_CENTS = 59900;

/** Custo do frete repassado quando o pedido fica abaixo da régua. */
export const SHIPPING_FLAT_CENTS = 2990;

/**
 * Desconto no PIX: 3%.
 * O PIX custa ~0,99% ao lojista — um desconto de 5% custava 5× mais que a
 * economia real. 3% mantém o incentivo sem doar margem.
 */
export const PIX_DISCOUNT_RATE = 0.03;

/** Parcelamento no cartão (exibido na página de produto). */
export const CARD_INSTALLMENTS = {
  interestFree: 6,
  max: 12,
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const BRANDS_MARQUEE = [
  "Carolina Herrera",
  "Dior",
  "Chanel",
  "Lancôme",
  "Yves Saint Laurent",
  "Paco Rabanne",
  "Giorgio Armani",
  "Jean Paul Gaultier",
  "Versace",
  "Azzaro",
];
