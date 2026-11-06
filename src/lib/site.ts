export const SITE = {
  name: "Moments Paris",
  tagline: "Perfumes Importados",
  city: "Londrina · Paraná",
  representative: "Neusa Buscarini",
  whatsappNumber: "5543999542246",
  whatsappDisplay: "(43) 99954-2246",
  instagramHandle: "@buscarinineusa",
  instagramUrl: "https://instagram.com/buscarinineusa",
  pixKey: "205.355.549-15",
  pixHolder: "João Mateus Buscarini",
};

export const FREE_SHIPPING_THRESHOLD_CENTS = 39900;
export const SHIPPING_FLAT_CENTS = 2990;
export const PIX_DISCOUNT_RATE = 0.05;

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
