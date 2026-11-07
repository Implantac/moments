# Moments Paris

Storefront de perfumes importados com Next.js App Router, PostgreSQL e Drizzle ORM.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- PostgreSQL + Drizzle ORM
- Zustand com sacola persistida
- Framer Motion

## Funcionalidades

- Home editorial com coleções em destaque
- Catálogo com busca, filtros e ordenação
- Página de produto com galeria, avaliações e relacionados
- Sacola lateral com estado persistente
- Checkout em etapas com PIX, cartão e WhatsApp
- APIs de pedidos e avaliações
- Logo vetorial e favicon próprios
- Imagens servidas localmente a partir de `public/`

## Desenvolvimento local

```bash
npm install
cp .env.example .env
npx drizzle-kit push
npx tsx src/db/seed.ts
npm run dev
```

O seed é idempotente: só insere produtos/avaliações demo quando o catálogo está vazio.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — servidor de produção
- `npm run lint` — ESLint
- `npm run typecheck` — checagem TypeScript

## Deploy na Vercel

O projeto já inclui `vercel.json` com framework Next.js e região `gru1` (São Paulo).

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório `Implantac/moments`.
2. Mantenha Framework Preset **Next.js** e Root Directory `./`.
3. Crie/conecte um PostgreSQL hospedado. Caminho recomendado: **Storage / Marketplace → Neon Postgres**, conectado ao projeto e aos ambientes desejados. A integração injeta `DATABASE_URL` automaticamente.
4. Se configurar manualmente, adicione em **Settings → Environment Variables** a variável `DATABASE_URL` com a connection string do banco. Não use prefixo `NEXT_PUBLIC_`.
5. Faça o deploy.
6. Crie as tabelas e popule o banco hospedado a partir da sua máquina:

```bash
DATABASE_URL="SUA_CONNECTION_STRING" npx drizzle-kit push
DATABASE_URL="SUA_CONNECTION_STRING" npx tsx src/db/seed.ts
```

No Windows PowerShell:

```powershell
$env:DATABASE_URL="SUA_CONNECTION_STRING"
npx drizzle-kit push
npx tsx src/db/seed.ts
```

7. Teste `/api/health`, `/produtos` e um pedido de teste.
8. Para domínio próprio, adicione em **Settings → Domains** e configure o DNS indicado pela Vercel.

## Observações importantes

- O GitHub não leva o banco de dados junto: depois do primeiro deploy, rode `drizzle-kit push` e o seed apontando para o banco hospedado.
- Nunca use `127.0.0.1` ou `localhost` como `DATABASE_URL` na Vercel.
- Nunca commite `.env`, tokens ou credenciais.
- Alterações em variáveis de ambiente exigem novo deployment.
- O Drizzle Kit prefere `DATABASE_URL_UNPOOLED` para schema; se ela não existir, usa `DATABASE_URL`.
- Para Neon/Supabase, use a connection string com SSL quando exigido pelo provedor.
- O checkout atual registra pedidos e oferece PIX manual/WhatsApp; para cobrança automática de cartão, integre um gateway como Mercado Pago, Stripe ou Pagar.me antes de vender em produção.
