/**
 * Autenticação da área administrativa.
 *
 * Usa Web Crypto (HMAC-SHA256), que funciona tanto no runtime Node quanto no
 * Edge (middleware) — `node:crypto` não existe no Edge, e o middleware roda lá.
 * Nenhuma senha é armazenada: comparamos um HMAC derivado da senha do ambiente.
 */

export const ADMIN_COOKIE = "moments_admin";

const encoder = new TextEncoder();

function secretKey(): string | null {
  const secret = process.env.ORDER_SECRET ?? process.env.DATABASE_URL;
  return secret && secret.length >= 8 ? secret : null;
}

export function adminPassword(): string | null {
  const pwd = process.env.ADMIN_PASSWORD;
  return pwd && pwd.length >= 8 ? pwd : null;
}

async function hmacHex(message: string, key: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Token determinístico derivado da senha — o que vai no cookie. */
export async function adminToken(): Promise<string | null> {
  const pwd = adminPassword();
  const key = secretKey();
  if (!pwd || !key) return null;
  return (await hmacHex(`admin:${pwd}`, key)).slice(0, 43);
}

/** Comparação em tempo constante sobre strings hex. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyAdminCookie(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const expected = await adminToken();
  if (!expected) return false;
  return safeEqual(value, expected);
}

export async function checkPassword(input: string): Promise<boolean> {
  const expected = adminPassword();
  if (!expected) return false;
  // Compara HMACs em vez das senhas cruas: tempo constante sem depender de
  // timingSafeEqual do node.
  const key = secretKey() ?? "local";
  const [a, b] = await Promise.all([
    hmacHex(`pwd:${input}`, key),
    hmacHex(`pwd:${expected}`, key),
  ]);
  return safeEqual(a, b);
}
