# Moments Paris

Loja de perfumes importados — Next.js 16 (App Router) + PostgreSQL + Drizzle ORM.

**Modelo de venda:** PIX por QR Code (sem gateway, sem taxa de cartão) + atendimento
direto pelo WhatsApp. A loja não coleta dados de cartão.

---

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- PostgreSQL + Drizzle ORM
- Zustand (sacola persistida)
- Framer Motion · QR Code gerado no servidor (`qrcode`)

## O que está implementado

| Área | Recurso |
| --- | --- |
| Vitrine | Home editorial, catálogo com busca/filtros, página de produto com galeria |
| Pagamento | **PIX com QR Code (BR Code) já com valor e identificador do pedido** + copia-e-cola |
| Checkout | 3 passos, frete e desconto calculados **no servidor**, sem dado de cartão |
| Pedidos | Link assinado por token, PIX reutilizável, resumo, prazo e endereço |
| Admin | `/admin` protegido: lista de pedidos, KPIs, troca de status, atalho WhatsApp |
| Notificação | Telegram e/ou e-mail (Resend) a cada pedido novo |
| Conteúdo | Quem somos, contato, termos, privacidade (LGPD), trocas e devoluções |
| SEO | `sitemap.xml`, `robots.txt`, `metadataBase`, JSON-LD de produto |
| Segurança | Preços do banco, token em PII, headers, `/admin` no middleware, `error.tsx` |

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local     # preencha DATABASE_URL
npx drizzle-kit push           # cria as tabelas
npx tsx src/db/seed.ts         # 10 produtos (sem avaliações fictícias)
npm run dev
```

> A loja sobe mesmo sem `DATABASE_URL` — o erro aparece na primeira query, não no build.

## Área da loja (`/admin`)

1. Defina `ADMIN_PASSWORD` (mín. 8 caracteres) e `ORDER_SECRET`.
2. Acesse `/admin` → tela de login.
3. Ali você vê pedidos, valores, dados de entrega, muda o status
   (`aguardando PIX → pago → enviado → entregue`) e abre o WhatsApp do cliente
   com a mensagem pronta.

**Em produção (uma pessoa opera):** senha forte em variável de ambiente é
suficiente. Não há cadastro de usuários de propósito.

## Deploy na Vercel

### Passo 1 — banco (antes do deploy)

Crie um PostgreSQL (Neon via **Storage → Marketplace** é o caminho mais rápido).
A integração injeta `DATABASE_URL` automaticamente. Se for manual, use a
connection string **pooled**.

> ⚠️ O primeiro deploy do repositório **falhou** justamente porque a variável não
> existia no ambiente de build. Não pule este passo.

### Passo 2 — variáveis

Em **Settings → Environment Variables**, para **Production e Preview**:

| Variável | Obrigatória | Para que serve |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | banco (pooled) |
| `ORDER_SECRET` | ✅ | assina link do pedido e cookie do admin |
| `ADMIN_PASSWORD` | ✅ | acesso a `/admin` |
| `PIX_KEY` / `PIX_HOLDER` / `PIX_CITY` | ✅ | recebedor do QR Code |
| `NEXT_PUBLIC_SITE_URL` | recomendada | domínio canônico (sitemap/OG) |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | recomendada | alerta de pedido no celular |
| `RESEND_API_KEY` + `STORE_EMAIL` | opcional | e-mail de pedido |
| `NEXT_PUBLIC_CNPJ` / `NEXT_PUBLIC_STORE_EMAIL` | opcional | exibição legal no rodapé |

Gere o segredo com `openssl rand -base64 32`.

### Passo 3 — deploy

Framework **Next.js**, Root Directory `./`. Região `gru1` (São Paulo) já definida
em `vercel.json`.

**Plano:** loja que vende é uso comercial — a Vercel exige **Pro** (US$ 20/mês).
Hobby é só para projeto pessoal.

### Passo 4 — criar o schema no banco de produção

```bash
DATABASE_URL="<connection string pooled>" npx drizzle-kit push
DATABASE_URL="<connection string pooled>" npx tsx src/db/seed.ts
```

### Passo 5 — testar

- `/api/health` → `{"ok":true}`
- `/produtos` → catálogo carregando do banco
- um pedido de teste → QR Code aparece e o `MP-XXXXX` entra em `/admin`

---

## Segurança — o que foi corrigido

| Antes | Agora |
| --- | --- |
| Preço vinha do navegador (pedido a R$ 0,01) | Servidor recalcula tudo a partir do banco |
| `/pedido/[code]` expunha nome, e-mail e endereço | Exige token HMAC assinado |
| `CVV` e número de cartão coletados no site | Removidos — pagamento de cartão só no WhatsApp |
| `X-Frame-Options: ALLOWALL` | Headers de segurança reais (HSTS, nosniff, Permissions-Policy) |
| Build quebrava sem `DATABASE_URL` | Pool lazy: o build passa, o erro é tratado |
| Tela branca em falha de banco | `error.tsx` + `global-error.tsx` com contato |
| Nenhuma página legal | Termos, LGPD, trocas, contato, quem somos |
| 34 avaliações fictícias no seed | Seed sem avaliações; nota "4.9" removida do hero |
| Newsletter descartava o e-mail | Tabela `subscribers` com consentimento registrado |
| Desconto PIX 5% (custa 5× a taxa do PIX) | 3% — incentivo mantido, margem preservada |
| Frete grátis acima de R$ 399 (100% dos pedidos) | Acima de R$ 599 |

## O que ainda falta (Roadmap)

- [ ] Gateway de cartão **hospedado** (Mercado Pago/Pagar.me) — nunca coletar CVV
- [ ] Migrations versionadas (`drizzle-kit generate`) rodando no build
- [ ] Baixa de estoque na confirmação do pagamento
- [ ] Rate limit em `/api/orders` e `/api/reviews`
- [ ] Moderação de avaliações antes de publicar
- [ ] Analytics (GA4 ou Vercel Analytics) + funil de conversão

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção |
| `npm run start` | servidor de produção |
| `npm run lint` | ESLint (limpo) |
| `npm run typecheck` | TypeScript (limpo) |
