/**
 * Busca de produtos tolerante a acento, número por extenso e erro de digitação.
 *
 * Antes era só `haystack.includes(token)` sobre o texto cru, e por isso:
 *   • "si"  não achava "Sì"          (acento)
 *   • "one million" não achava "1 Million" (número)
 *   • "savage" não achava "Sauvage"  (uma letra errada)
 *
 * Agora o texto é normalizado (sem acento, sem pontuação, números escritos
 * por extenso) e cada termo pode casar por prefixo ou por proximidade.
 * Tudo roda no cliente — 10 produtos hoje, e escala bem até algumas centenas.
 */

/** Números presentes nos nomes dos perfumes, escritos por extenso. */
const NUMBER_WORDS: Record<string, string> = {
  "1": "um one",
  "2": "dois two",
  "3": "tres three",
  "4": "quatro four",
  "5": "cinco five",
  "6": "seis six",
  "7": "sete seven",
  "8": "oito eight",
  "9": "nove nine",
  "10": "dez ten",
};

/** Apelidos que o cliente digita e não aparecem no nome do produto. */
const ALIASES: Record<string, string[]> = {
  chanel: ["coco"],
  "jean paul gaultier": ["jpg"],
  "yves saint laurent": ["ysl"],
  "paco rabanne": ["paco"],
  "giorgio armani": ["armani"],
  "carolina herrera": ["ch"],
  "azzaro": ["wanted"],
};

/** Minúsculas, sem acento, sem pontuação, espaços simples. */
export function normalizeSearch(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Expande números em palavras ("1 million" → "1 um one million"). */
function expandNumbers(text: string): string {
  const tokens = text.split(" ").flatMap((token) => {
    const words = NUMBER_WORDS[token];
    return words ? [token, ...words.split(" ")] : [token];
  });
  return tokens.join(" ");
}

/** Texto pesquisável de um produto: nome, marca, família, categoria e apelidos. */
export function searchHaystack(parts: (string | null | undefined)[]): string {
  const base = normalizeSearch(parts.filter(Boolean).join(" "));
  const withNumbers = expandNumbers(base);
  const extra = Object.entries(ALIASES)
    .filter(([key]) => base.includes(normalizeSearch(key)))
    .flatMap(([, alias]) => alias)
    .map(normalizeSearch);
  return [withNumbers, ...extra].join(" ");
}

/** Distância de Levenshtein — quantas edições separam duas palavras. */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 3) return 99;

  const prev = new Array(b.length + 1);
  const cur = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = cur[j];
  }
  return prev[b.length];
}

/**
 * Um termo casa com o texto quando aparece inteiro, no começo de alguma
 * palavra, ou quando alguma palavra está a poucas letras de distância.
 * Termos com 3 letras ou menos só casam por prefixo (evita falso positivo).
 */
function tokenMatches(token: string, haystack: string): boolean {
  if (haystack.includes(token)) return true;

  for (const word of haystack.split(" ")) {
    if (!word) continue;
    if (word.startsWith(token)) return true;
  }

  if (token.length < 4) return false;

  const tolerance = token.length >= 6 ? 2 : 1;
  return haystack.split(" ").some(
    (word) => word.length >= 3 && editDistance(token, word) <= tolerance,
  );
}

/** Verdadeiro quando todos os termos digitados casam com o texto do produto. */
export function matchesSearch(query: string, haystack: string): boolean {
  const tokens = normalizeSearch(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return true;

  // "one million" digitado → também testa "1"; "1 million" → também "um"/"one".
  return tokens.every((token) => {
    const alternatives = [token, ...(NUMBER_WORDS[token]?.split(" ") ?? [])];
    return alternatives.some((alt) => tokenMatches(alt, haystack));
  });
}
