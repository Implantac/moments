import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./index";
import { products, reviews } from "./schema";

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

  await db.insert(reviews).values([
    // Good Girl
    { productId: pid("good-girl-carolina-herrera"), author: "Ana Elise M.", city: "Londrina, PR", rating: 5, title: "Simplesmente perfeito", body: "Chegou super rápido, lacrado e com nota. O cheiro é marcante sem ser enjoativo — recebo elogios o dia inteiro. A Neusa foi muito atenciosa no WhatsApp.", createdAt: new Date("2026-01-18T14:22:00-03:00") },
    { productId: pid("good-girl-carolina-herrera"), author: "Camila R.", city: "Maringá, PR", rating: 5, title: "Meu perfume favorito", body: "Segunda vez que compro na Moments Paris. Produto original, bem embalado e ainda veio com uma amostrinha de brinde. Recomendo de olhos fechados.", createdAt: new Date("2025-12-30T09:10:00-03:00") },
    { productId: pid("good-girl-carolina-herrera"), author: "Jéssica T.", city: "Curitiba, PR", rating: 4, title: "Muito bom", body: "Fixação excelente, dura o dia todo na pele. Só achei a caixa um pouco amassada no transporte, mas o frasco estava intacto e protegido.", createdAt: new Date("2025-11-05T18:47:00-03:00") },
    { productId: pid("good-girl-carolina-herrera"), author: "Renata S.", city: "São Paulo, SP", rating: 5, title: "Compra certa", body: "Preço melhor que nas lojas de shopping e chegou antes do prazo. Virei cliente fiel.", createdAt: new Date("2025-09-21T11:03:00-03:00") },

    // La Vie Est Belle
    { productId: pid("la-vie-est-belle-lancome"), author: "Patrícia G.", city: "Cambé, PR", rating: 5, title: "Doce na medida certa", body: "É docinho mas elegante, nada enjoativo. Uso para trabalhar e para sair. A projeção é ótima e o frasco é lindo demais.", createdAt: new Date("2026-01-09T16:35:00-03:00") },
    { productId: pid("la-vie-est-belle-lancome"), author: "Fernanda L.", city: "Belo Horizonte, MG", rating: 5, title: "Cheiro de felicidade", body: "O nome faz jus. Toda vez que uso, me perguntam qual é. Fixou mais de 10 horas em mim.", createdAt: new Date("2025-12-12T20:14:00-03:00") },
    { productId: pid("la-vie-est-belle-lancome"), author: "Marcos V.", city: "Londrina, PR", rating: 5, title: "Presente perfeito", body: "Comprei de presente para minha esposa no nosso aniversário. Veio embalado para presente, lindo. Ela amou e eu virei herói.", createdAt: new Date("2025-10-28T13:56:00-03:00") },
    { productId: pid("la-vie-est-belle-lancome"), author: "Bruna C.", city: "Ribeirão Preto, SP", rating: 4, title: "Muito satisfeita", body: "Original, lacrado, entrega rápida para o interior de SP. Tiraria 5 estrelas se tivesse opção de refil.", createdAt: new Date("2025-08-19T08:40:00-03:00") },

    // Libre
    { productId: pid("libre-yves-saint-laurent"), author: "Aline P.", city: "Londrina, PR", rating: 5, title: "Elegância em frasco", body: "A lavanda com a flor de laranjeira é uma combinação surreal de sofisticada. Me sinto poderosa usando. Entrega impecável.", createdAt: new Date("2026-02-02T10:05:00-03:00") },
    { productId: pid("libre-yves-saint-laurent"), author: "Débora F.", city: "Apucarana, PR", rating: 5, title: "Virou minha assinatura", body: "Comprei amostra primeiro pelo WhatsApp e depois fechei o 90ml. Atendimento nota dez da Neusa.", createdAt: new Date("2025-12-05T15:27:00-03:00") },
    { productId: pid("libre-yves-saint-laurent"), author: "Tatiane O.", city: "Curitiba, PR", rating: 4, title: "Fortinho, do jeito que eu gosto", body: "Projeta bastante nas duas primeiras horas, depois assenta e fica elegante. Só não borrife demais!", createdAt: new Date("2025-11-16T19:33:00-03:00") },
    { productId: pid("libre-yves-saint-laurent"), author: "Mariana H.", city: "Porto Alegre, RS", rating: 5, title: "Original e lindo", body: "Conferi o lote no site da marca: produto 100% original. Chegou em 4 dias no RS. Pode confiar.", createdAt: new Date("2025-09-08T12:12:00-03:00") },

    // Coco Mademoiselle
    { productId: pid("coco-mademoiselle-chanel"), author: "Cristina A.", city: "Londrina, PR", rating: 5, title: "Clássico atemporal", body: "É Chanel, né? O cítrico com patchouli é inconfundível. Investimento que vale cada centavo — e aqui estava mais barato que no duty free.", createdAt: new Date("2026-01-25T17:48:00-03:00") },
    { productId: pid("coco-mademoiselle-chanel"), author: "Luciana B.", city: "São Paulo, SP", rating: 4, title: "Sofisticação pura", body: "Perfume de presença, ideal para eventos à noite. A entrega foi rápida e o cuidado com a embalagem impressionou.", createdAt: new Date("2025-11-29T14:19:00-03:00") },
    { productId: pid("coco-mademoiselle-chanel"), author: "Valéria N.", city: "Londrina, PR", rating: 5, title: "Presente da Neusa", body: "A Neusa me ajudou a escolher pelo perfil que eu descrevi. Acertou em cheio. Retoco nem preciso, fixa o dia todo.", createdAt: new Date("2025-10-11T09:52:00-03:00") },

    // Sì
    { productId: pid("si-giorgio-armani"), author: "Roberta N.", city: "Maringá, PR", rating: 5, title: "Meu segundo frasco", body: "O cassis com a rosa é viciante. Já é meu segundo frasco comprado aqui e o lote é sempre recente.", createdAt: new Date("2026-01-14T13:08:00-03:00") },
    { productId: pid("si-giorgio-armani"), author: "Juliana E.", city: "Curitiba, PR", rating: 4, title: "Delicado e marcante", body: "Mais discreto que o Good Girl, perfeito para o dia a dia no escritório. Chegou tudo certinho.", createdAt: new Date("2025-12-19T16:44:00-03:00") },
    { productId: pid("si-giorgio-armani"), author: "Simone R.", city: "Londrina, PR", rating: 5, title: "Amor à primeira borrifada", body: "Cheiro de mulher elegante. Comprei no PIX e ainda ganhei o desconto. Experiência perfeita.", createdAt: new Date("2025-09-27T11:37:00-03:00") },

    // Sauvage
    { productId: pid("sauvage-dior"), author: "Rafael C.", city: "Londrina, PR", rating: 5, title: "Monstro de fixação", body: "Borrifo de manhã e à noite ainda sinto. O ambroxan é surreal de bom. Melhor custo-benefício que encontrei, inclusive com frete grátis.", createdAt: new Date("2026-02-06T08:55:00-03:00") },
    { productId: pid("sauvage-dior"), author: "Diego M.", city: "Curitiba, PR", rating: 5, title: "Original, lacrado", body: "Tinha receio de comprar online, mas veio com nota e selo de importação. Atendimento pelo WhatsApp respondeu na hora.", createdAt: new Date("2026-01-07T19:26:00-03:00") },
    { productId: pid("sauvage-dior"), author: "Bruno F.", city: "Rolandia, PR", rating: 4, title: "Muito versátil", body: "Serve para trabalho e para balada. A projeção é forte nas primeiras horas. Recomendo o EDT para o clima do Paraná.", createdAt: new Date("2025-11-23T12:41:00-03:00") },
    { productId: pid("sauvage-dior"), author: "Carla H.", city: "Londrina, PR", rating: 5, title: "Presente certeiro", body: "Comprei para o meu marido de Dia dos Namorados e ele não troca por nada. O cheiro é hipnotizante.", createdAt: new Date("2025-06-10T15:02:00-03:00") },

    // 1 Million
    { productId: pid("one-million-paco-rabanne"), author: "Thiago R.", city: "Londrina, PR", rating: 4, title: "O rei da noite", body: "Doce e potente, perfeito para festas. Uso no frio e a estela é enorme. Só cuidado para não exagerar nas borrifadas.", createdAt: new Date("2026-01-21T22:13:00-03:00") },
    { productId: pid("one-million-paco-rabanne"), author: "Lucas B.", city: "Maringá, PR", rating: 5, title: "Chegou voando", body: "Pedido na segunda, chegou quinta. Frasco de ouro é lindo demais, dá até dó de usar. Perfume original com nota.", createdAt: new Date("2025-12-27T10:31:00-03:00") },
    { productId: pid("one-million-paco-rabanne"), author: "André P.", city: "São Paulo, SP", rating: 5, title: "Clássico que não erra", body: "Canela com couro na medida. Recebo elogio toda vez que uso. Preço aqui está ótimo comparado com as grandes redes.", createdAt: new Date("2025-10-03T18:59:00-03:00") },

    // Le Male
    { productId: pid("le-male-jean-paul-gaultier"), author: "Eduardo K.", city: "Londrina, PR", rating: 5, title: "Nostalgia boa", body: "Usei nos anos 2000 e continua impecável. A baunilha com lavanda é única. Entrega rápida e produto original.", createdAt: new Date("2026-01-11T09:44:00-03:00") },
    { productId: pid("le-male-jean-paul-gaultier"), author: "Gustavo L.", city: "Curitiba, PR", rating: 4, title: "Confortável e sedutor", body: "É doce mas masculino, ótimo para encontros. No frio ele brilha. O frasco de torso é puro design.", createdAt: new Date("2025-11-08T20:21:00-03:00") },
    { productId: pid("le-male-jean-paul-gaultier"), author: "Vinícius A.", city: "Arapongas, PR", rating: 5, title: "Vale cada centavo", body: "125ml por esse preço é achado. Fixação de 8h tranquilo na minha pele. Recomendo demais.", createdAt: new Date("2025-09-14T14:37:00-03:00") },

    // Eros
    { productId: pid("eros-versace"), author: "Matheus D.", city: "Londrina, PR", rating: 5, title: "Fresco e doce ao mesmo tempo", body: "A maçã com a baunilha é uma combinação viciante. Uso para faculdade e para sair à noite. Versátil demais.", createdAt: new Date("2026-02-09T13:26:00-03:00") },
    { productId: pid("eros-versace"), author: "Henrique T.", city: "Cornélio Procópio, PR", rating: 4, title: "Ótimo custo-benefício", body: "Na promoção valeu muito. Projeção forte nas duas primeiras horas, depois fica rente à pele de um jeito agradável.", createdAt: new Date("2025-12-02T17:53:00-03:00") },
    { productId: pid("eros-versace"), author: "Ígor S.", city: "Curitiba, PR", rating: 5, title: "Impecável", body: "Produto original, lote recente, entrega rápida e ainda tirei dúvidas pelo WhatsApp antes de comprar. Nota dez.", createdAt: new Date("2025-10-19T11:18:00-03:00") },

    // Wanted
    { productId: pid("azzaro-wanted"), author: "Rodrigo P.", city: "Londrina, PR", rating: 4, title: "Cítrico com personalidade", body: "O gengibre com o limão refresca muito, ideal para o calor. No verão não saio de casa sem ele.", createdAt: new Date("2026-01-28T16:09:00-03:00") },
    { productId: pid("azzaro-wanted"), author: "Caio M.", city: "Maringá, PR", rating: 5, title: "Meu xodó do dia a dia", body: "Assinatura perfeita para o escritório: fresco, elegante e com boa fixação. Paguei no PIX com desconto, melhor negócio impossível.", createdAt: new Date("2025-12-15T09:34:00-03:00") },
    { productId: pid("azzaro-wanted"), author: "Leonardo F.", city: "Londrina, PR", rating: 5, title: "Primeira compra de muitas", body: "Conheci a loja pelo Instagram da Neusa e já virei cliente. Frasco lindo, perfume melhor ainda.", createdAt: new Date("2025-11-26T18:05:00-03:00") },
  ]);

  console.log(`Seed concluído: ${inserted.length} produtos e avaliações inseridas.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
