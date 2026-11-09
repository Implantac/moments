import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Assina o código do pedido para que o link `/pedido/[code]?t=...`
 * não exponha nome, e-mail e endereço do cliente a quem adivinhar o código.
 *
 * Usa ORDER_SECRET do ambiente. Se não estiver configurado, cai para um
 * segredo derivado de DATABASE_URL + salt fixo — pior, mas nunca "sem segredo"
 * (um link público com PII é pior que um token fraco).
 */
function secret(): string {
  const explicit = process.env.ORDER_SECRET;
  if (explicit && explicit.length >= 16) return explicit;

  const fallback = process.env.DATABASE_URL ?? "moments-local-dev";
  return `fallback:${fallback}`;
}

export function signOrderCode(code: string): string {
  return createHmac("sha256", secret())
    .update(code)
    .digest("base64url")
    .slice(0, 24);
}

export function verifyOrderToken(code: string, token: string | undefined): boolean {
  if (!token) return false;
  const expected = signOrderCode(code);
  if (token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

/** Monta a URL interna do pedido já com o token. */
export function orderPath(code: string, token?: string): string {
  const t = token ?? signOrderCode(code);
  return `/pedido/${encodeURIComponent(code)}?t=${t}`;
}
