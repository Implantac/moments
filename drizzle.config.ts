import { defineConfig } from "drizzle-kit";

// Em produção (Vercel), basta definir DATABASE_URL no ambiente:
//   DATABASE_URL="postgres://...?sslmode=require" npx drizzle-kit push
// Localmente, cai no banco padrão do sandbox.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});
