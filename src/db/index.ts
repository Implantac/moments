import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Pool criado sob demanda (lazy).
 *
 * Antes, a ausência de DATABASE_URL derrubava o `next build` inteiro na fase
 * "Collecting page data", porque o throw acontecia no import do módulo.
 * Agora o erro só aparece na primeira query de verdade — o build passa e o
 * deploy sobe mesmo se a variável for configurada depois.
 */

const globalForDb = globalThis as typeof globalThis & {
  __momentsPool?: Pool;
};

function getPool(): Pool {
  if (globalForDb.__momentsPool) return globalForDb.__momentsPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL não configurada. Defina a variável de ambiente com a connection string do PostgreSQL.",
    );
  }

  // Em serverless cada instância precisa de um pool pequeno: a Vercel
  // compartilha ~1024 file descriptors entre todas as execuções.
  const isServerless = Boolean(process.env.VERCEL);
  const pool = new Pool({
    connectionString,
    max: isServerless ? 1 : 10,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 8_000,
    // Provedores gerenciados (Neon, Supabase, Railway) exigem TLS.
    ssl: /localhost|127\.0\.0\.1/.test(connectionString)
      ? undefined
      : { rejectUnauthorized: false },
  });

  // Uma query que falha não deve derrubar o processo inteiro.
  pool.on("error", (err) => {
    console.error("[db] erro inesperado no pool:", err.message);
  });

  globalForDb.__momentsPool = pool;
  return pool;
}

export const db = drizzle({
  client: new Proxy({} as Pool, {
    get(_target, prop) {
      const pool = getPool();
      const value = Reflect.get(pool, prop, pool);
      return typeof value === "function" ? value.bind(pool) : value;
    },
  }),
});

/** Fecha o pool (usado por scripts e pelo seed). */
export async function closeDb(): Promise<void> {
  if (globalForDb.__momentsPool) {
    await globalForDb.__momentsPool.end();
    globalForDb.__momentsPool = undefined;
  }
}
