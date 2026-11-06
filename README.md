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

## Local development

```bash
npm install
cp .env.example .env
npx drizzle-kit push
npx tsx src/db/seed.ts
npm run dev
```

The seed script is idempotent: it only inserts demo products/reviews when the catalog is empty.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check

## Environment

Server-side database access reads `DATABASE_URL`. Do not commit `.env` files or credentials.
