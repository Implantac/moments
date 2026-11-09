import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./index";
import { products } from "./schema";

async function seed() {
  const [{ value }] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(products);

  if (value > 0) {
    console.log("Banco já populado — nada a fazer.");
    return;
  }

  const inserted = await db
    .insert(products)
    .values([
      {
        slug: "good-girl-carolina-herrera",
        name: "Good Girl",
        brand: "Carolina Herrera",
        category: "feminino",
        family: "Oriental Floral",
        description:
          "Um ícone da perfumaria moderna, Good Girl celebra a dualidade da mulher: poderosa e doce, ousada e elegante. O frasco em formato de scarpin esconde uma fragrância envolvente de amêndoas e café que evolui para um coração floral luminoso e um fundo quente de fava tonka e cacau. Perfeito para noites inesquecíveis.",
        notesTop: "Amêndoa, Café, Bergamota, Limão",
        notesHeart: "Jasmim Sambac, Tuberosa, Raiz de Íris, Flor de Laranjeira",
        notesBase: "Fava Tonka, Cacau, Baunilha, Sândalo, Almíscar",
        sizeMl: 80,
        concentration: "Eau de Parfum",
        priceCents: 64900,
        compareAtCents: 78900,
        stock: 18,
        image: "/products/good-girl.jpg",
        badge: "Mais vendido",
        featured: true,
      },
      {
        slug: "la-vie-est-belle-lancome",
        name: "La Vie Est Belle",
        brand: "Lancôme",
        category: "feminino",
        family: "Floral Frutal Gourmand",
        description:
          "Uma declaração universal de felicidade. La Vie Est Belle combina a nobreza da íris com a doçura do pralinê, criando uma assinatura gourmand sofisticada que ilumina qualquer dia. O sorriso gravado no frasco é um convite para viver a vida com leveza e elegância.",
        notesTop: "Cassis, Pera",
        notesHeart: "Íris, Jasmim, Flor de Laranjeira",
        notesBase: "Pralinê, Baunilha, Patchouli, Fava Tonka",
        sizeMl: 75,
        concentration: "Eau de Parfum",
        priceCents: 58900,
        compareAtCents: 68900,
        stock: 22,
        image: "/products/la-vie-est-belle.jpg",
        badge: "Favorito",
        featured: true,
      },
      {
        slug: "libre-yves-saint-laurent",
        name: "Libre",
        brand: "Yves Saint Laurent",
        category: "feminino",
        family: "Floral Lavanda",
        description:
          "A liberdade traduzida em perfume. Libre reinventa o floral feminino com a audácia da lavanda francesa e a sensualidade da flor de laranjeira marroquina. Uma fragrência couture para quem vive segundo as próprias regras — intensa, elegante e absolutamente inesquecível.",
        notesTop: "Lavanda, Mandarina, Cassis, Petitgrain",
        notesHeart: "Flor de Laranjeira, Jasmim, Lavanda",
        notesBase: "Baunilha de Madagáscar, Almíscar, Cedro, Âmbar Cinzento",
        sizeMl: 90,
        concentration: "Eau de Parfum",
        priceCents: 61900,
        compareAtCents: 72900,
        stock: 14,
        image: "/products/libre.jpg",
        badge: null,
        featured: true,
      },
      {
        slug: "coco-mademoiselle-chanel",
        name: "Coco Mademoiselle",
        brand: "Chanel",
        category: "feminino",
        family: "Chipre Floral",
        description:
          "O retrato olfativo de uma mulher livre e audaciosa. Coco Mademoiselle é um chipre fresco e sensual: a vivacidade da laranja encontra a elegância da rosa de maio e o acorde inconfundível do patchouli. Um clássico absoluto que atravessa gerações com graça parisiense.",
        notesTop: "Laranja, Mandarina, Bergamota, Flor de Laranjeira",
        notesHeart: "Rosa Turca, Jasmim, Mimosa, Ylang-Ylang",
        notesBase: "Patchouli, Almíscar Branco, Baunilha, Vetiver, Fava Tonka",
        sizeMl: 100,
        concentration: "Eau de Parfum",
        priceCents: 89900,
        compareAtCents: 104900,
        stock: 9,
        image: "/products/coco-mademoiselle.jpg",
        badge: "Luxo",
        featured: true,
      },
      {
        slug: "si-giorgio-armani",
        name: "Sì",
        brand: "Giorgio Armani",
        category: "feminino",
        family: "Chipre Frutal",
        description:
          "Sì é o sim italiano à vida, ao amor e à liberdade. O néctar de cassis abre caminho para um coração de rosa de maio e frésia, sobre um fundo amadeirado quente de patchouli e baunilha. Chique sem esforço — a essência da feminilidade contemporânea segundo Armani.",
        notesTop: "Néctar de Cassis, Mandarina",
        notesHeart: "Rosa de Maio, Frésia, Flor de Laranjeira",
        notesBase: "Patchouli, Baunilha, Almíscar, Notas Amadeiradas",
        sizeMl: 100,
        concentration: "Eau de Parfum",
        priceCents: 54900,
        compareAtCents: 62900,
        stock: 16,
        image: "/products/si.jpg",
        badge: null,
        featured: false,
      },
      {
        slug: "sauvage-dior",
        name: "Sauvage",
        brand: "Dior",
        category: "masculino",
        family: "Amadeirado Aromático",
        description:
          "Inspirado em paisagens selvagens sob o céu azul-escuro do deserto, Sauvage é uma composição radicalmente fresca e nobre. A bergamota da Calábria explode em um rastro magnético de ambroxan e madeiras. O perfume masculino mais desejado do mundo — e dos nossos clientes também.",
        notesTop: "Bergamota da Calábria, Pimenta",
        notesHeart: "Lavanda, Pimenta Sichuan, Gerânio, Patchouli",
        notesBase: "Ambroxan, Cedro, Ládano",
        sizeMl: 100,
        concentration: "Eau de Toilette",
        priceCents: 69900,
        compareAtCents: 79900,
        stock: 20,
        image: "/products/sauvage.jpg",
        badge: "Mais vendido",
        featured: true,
      },
      {
        slug: "one-million-paco-rabanne",
        name: "1 Million",
        brand: "Paco Rabanne",
        category: "masculino",
        family: "Amadeirado Especiado",
        description:
          "O lingote de ouro mais famoso da perfumaria. 1 Million é extravagância assumida: canela especiada, couro masculino e um brilho cítrico de mandarina sanguínea. Para quem entra na festa e vira assunto. Sedução em estado bruto, com assinatura espanhola de audácia.",
        notesTop: "Mandarina Sanguínea, Grapefruit, Menta",
        notesHeart: "Canela, Rosa, Notas Especiadas",
        notesBase: "Couro, Âmbar, Patchouli, Notas Amadeiradas",
        sizeMl: 100,
        concentration: "Eau de Toilette",
        priceCents: 48900,
        compareAtCents: 56900,
        stock: 25,
        image: "/products/one-million.jpg",
        badge: null,
        featured: true,
      },
      {
        slug: "le-male-jean-paul-gaultier",
        name: "Le Male",
        brand: "Jean Paul Gaultier",
        category: "masculino",
        family: "Oriental Fougère",
        description:
          "O marinheiro mais sedutor de Paris. Le Male quebra convenções ao unir a frescura da lavanda e da menta com a ternura da baunilha e da canela. Um fougère oriental que se tornou lenda — viril, acolhedor e com uma estela que ninguém esquece.",
        notesTop: "Lavanda, Menta, Cardamomo, Bergamota",
        notesHeart: "Canela, Flor de Laranjeira, Cominho",
        notesBase: "Baunilha, Fava Tonka, Sândalo, Cedro",
        sizeMl: 125,
        concentration: "Eau de Toilette",
        priceCents: 51900,
        compareAtCents: 59900,
        stock: 13,
        image: "/products/le-male.jpg",
        badge: null,
        featured: false,
      },
      {
        slug: "eros-versace",
        name: "Eros",
        brand: "Versace",
        category: "masculino",
        family: "Aromático Verde",
        description:
          "Paixão, desejo e beleza — Eros é a mitologia grega engarrafada pela Maison Versace. Hortelã glacial, maçã verde e limão da Itália dançam sobre um coração de gerânio e um fundo doce de baunilha e cedro. Fresco e gourmand ao mesmo tempo: o equilíbrio que conquista.",
        notesTop: "Hortelã, Maçã Verde, Limão",
        notesHeart: "Fava Tonka, Gerânio, Ambroxan",
        notesBase: "Baunilha de Madagáscar, Vetiver, Cedro da Virgínia",
        sizeMl: 100,
        concentration: "Eau de Toilette",
        priceCents: 45900,
        compareAtCents: 52900,
        stock: 19,
        image: "/products/eros.jpg",
        badge: "Oferta",
        featured: false,
      },
      {
        slug: "azzaro-wanted",
        name: "Wanted",
        brand: "Azzaro",
        category: "masculino",
        family: "Amadeirado Cítrico",
        description:
          "Para o homem que joga para vencer. Wanted combina a energia vibrante do limão e do gengibre com um coração de cardamomo e um fundo viciante de fava tonka e vetiver. O frasco em forma de tambor de revólver já avisa: este perfume é para quem ousa.",
        notesTop: "Limão, Gengibre, Lavanda, Menta",
        notesHeart: "Maçã, Cardamomo, Zimbro, Gerânio",
        notesBase: "Fava Tonka, Vetiver do Haiti, Âmbar, Almíscar",
        sizeMl: 100,
        concentration: "Eau de Toilette",
        priceCents: 42900,
        compareAtCents: 49900,
        stock: 21,
        image: "/products/wanted.jpg",
        badge: "Oferta",
        featured: false,
      },
    ])
    .returning({ id: products.id, slug: products.slug });

  const idBySlug = new Map(inserted.map((r) => [r.slug, r.id]));
  const pid = (slug: string) => {
    const id = idBySlug.get(slug);
    if (!id) throw new Error(`slug ausente: ${slug}`);
    return id;
  };

  // ---------------------------------------------------------------
  // Avaliações NÃO são populadas de propósito.
  //
  // O seed antigo criava 34 avaliações fictícias ("Ana Elise M.",
  // "Camila R."...). Publicar depoimento inventado em loja real é
  // publicidade enganosa (CDC art. 37) e destrói a confiança da
  // categoria mais sensível do varejo: perfume importado.
  //
  // O banco começa vazio e as avaliações passam a vir de clientes reais.
  // Se quiser importar avaliações verdadeiras do Instagram/WhatsApp,
  // peça autorização por escrito e insira com `approved: true`.
  // ---------------------------------------------------------------


  console.log(`Seed concluído: ${inserted.length} produtos (sem avaliações fictícias).`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
