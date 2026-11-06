# Moments Paris

Storefront de perfumes importados built with Next.js App Router, PostgreSQL and Drizzle ORM.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- PostgreSQL + Drizzle ORM
- Zustand with persisted cart
- Framer Motion

## Features

- Editorial home page with featured collections
- Product catalog with search, filters and sorting
- Product pages with gallery, reviews and related products
- Slide-out cart with persistent state
- Multi-step checkout with PIX, card and WhatsApp options
- Order confirmation and review submission APIs
- Custom vector logo and favicon
- All imagery served locally from `public/` (no external hotlinking)

## Local development

```bash
npm install
cp .env.example .env      # set DATABASE_URL (defaults to local postgres)
npx drizzle-kit push
npx tsx src/db/seed.ts
npm run dev
```

The seed script is idempotent: it only inserts demo products/reviews when the catalog is empty.

## 🚀 Deploying to Vercel

1. **PostgreSQL database** — in your Vercel project: **Storage → Create Database → Postgres** (or use [Neon](https://neon.tech)). Grab the connection string and make sure it ends with `?sslmode=require`.
2. **Environment variable** — **Project → Settings → Environment Variables** → add `DATABASE_URL` with that connection string (enable Production, Preview and Development). This is the only required secret; `src/db/index.ts` reads it server-side. Never commit `.env` (already gitignored).
3. **Deploy** — at [vercel.com/new](https://vercel.com/new), import the GitHub repo `Implantac/moments`. Next.js is auto-detected; keep the default build settings and deploy. Every push to `main` triggers a new production deployment. CLI alternative: `npm i -g vercel && vercel --prod`.
4. **Apply schema + seed (once)** — pages are `force-dynamic`, so the build does not need the database. From your machine, point at the production DB:

   ```bash
   DATABASE_URL="postgres://...?sslmode=require" npx drizzle-kit push
   DATABASE_URL="postgres://...?sslmode=require" npx tsx src/db/seed.ts
   ```

   `drizzle.config.ts` reads `process.env.DATABASE_URL` (falling back to the local sandbox DB), so the same commands work against production.
5. **Optional** — add a custom domain under **Settings → Domains**. `/api/health` is available for uptime checks; `/api/orders` and `/api/reviews` deploy as serverless functions automatically.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check

## Environment

Server-side database access reads `DATABASE_URL`. Do not commit `.env` files or credentials.
