# Moments Paris — Perfumes Importados

Storefront e-commerce completo em **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + PostgreSQL (Drizzle ORM)**, com sacola persistente, catálogo filtrável, páginas de produto ricas em avaliações e checkout em 3 passos com pagamento via PIX, cartão ou WhatsApp.

🔗 Repositório: https://github.com/Implantac/moments

---

## 🚀 Hospedando na Vercel (passo a passo)

### 1. Banco de dados PostgreSQL

A loja precisa de um Postgres acessível pela internet. Duas opções fáceis:

- **Vercel Postgres** (recomendado): no dashboard do projeto → aba **Storage** → **Create Database** → *Postgres*. Depois conecte o banco ao projeto.
- **Neon** (gratuito): crie um projeto em [neon.tech](https://neon.tech) e copie a *connection string*.

> A string precisa terminar com `?sslmode=require` (ex.: `postgres://user:pass@host/db?sslmode=require`).

### 2. Variáveis de ambiente

No dashboard da Vercel: **Project → Settings → Environment Variables** e adicione (marcando Production, Preview e Development):

| Variável | Valor |
|---|---|
| `DATABASE_URL` | connection string do Postgres (passo 1) |

É a **única** variável obrigatória — o app lê `process.env.DATABASE_URL` em `src/db/index.ts`. Nunca commite o `.env` (já está no `.gitignore`).

Dica: com o CLI da Vercel, dá para puxar as variáveis localmente:

```bash
npm i -g vercel
vercel login
vercel link          # vincula à pasta ao projeto
vercel env pull .env.local
```

### 3. Importar e fazer o deploy

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório `Implantac/moments`.
2. Framework detectado: **Next.js** — mantenha as configurações padrão (build command `next build`, output `.next`).
3. Com a `DATABASE_URL` já configurada, clique em **Deploy**.
4. Todo push na branch `main` gera um novo deploy de produção automaticamente.

Alternative via CLI:

```bash
vercel --prod
```

### 4. Aplicar o schema e popular o banco (uma única vez)

Páginas são `force-dynamic`, então o build **não** precisa do banco. Depois do primeiro deploy, rode na sua máquina local apontando para o banco de produção:

```bash
# cria as tabelas (products, reviews, orders)
DATABASE_URL="postgres://...?sslmode=require" npx drizzle-kit push

# insere os 10 perfumes e as 34 avaliações de demonstração
DATABASE_URL="postgres://...?sslmode=require" npx tsx src/db/seed.ts
```

Pronto — a loja já abre "pronta para vender".

### 5. Extras opcionais

- **Domínio próprio**: Project → Settings → Domains → adicione `lojinha.seudominio.com` (o DNS é orientado pelo assistente da Vercel).
- **Imagens**: todas as fotos já estão em `public/` e são otimizadas automaticamente pelo `next/image`.
- **APIs**: `/api/orders` e `/api/reviews` viram Serverless Functions automaticamente; `/api/health` serve para healthchecks.
- **Contato comercial**: WhatsApp, Instagram e chave PIX estão centralizados em `src/lib/site.ts` — basta editar lá.

---

## 💻 Rodando localmente

```bash
# 1. dependências
npm install

# 2. banco local (Postgres em 127.0.0.1:5432, banco app_db) + .env com DATABASE_URL
# 3. schema + dados de demonstração
npx drizzle-kit push
npx tsx src/db/seed.ts

# 4. servidor de desenvolvimento
npm run dev
```

Abra http://localhost:3000

## 🗂️ Estrutura

```
src/
├── app/                  # rotas (home, /produtos, /produto/[slug], /checkout, /pedido/[code], /api/*)
├── components/           # header, sacola (cart drawer), cards, home sections, checkout, produto
├── db/                   # schema Drizzle (products, reviews, orders) + seed
├── lib/                  # data access, formatadores (BRL, máscaras), constantes do site
└── store/cart.ts         # sacola persistente (Zustand + localStorage)
public/
├── products/             # fotos dos perfumes (geradas)
└── editorial/            # imagens de coleções, hero e lifestyle
```

## 🛠️ Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | desenvolvimento |
| `npm run build` | build de produção |
| `npm run start` | servidor de produção local |
| `npx drizzle-kit push` | aplica o schema no banco |
| `npx tsx src/db/seed.ts` | popula produtos e avaliações |
