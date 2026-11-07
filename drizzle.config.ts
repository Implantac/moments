import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Para criar/alterar tabelas, prefira a conexão direta quando o provedor
// disponibilizar DATABASE_URL_UNPOOLED. A aplicação continua usando a pooled.
const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL é obrigatória. Configure o arquivo .env local ou a variável de ambiente antes de rodar o Drizzle Kit.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: databaseUrl,
  },
});
