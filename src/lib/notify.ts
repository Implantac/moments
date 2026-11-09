/**
 * Notificações de pedido novo.
 *
 * O painel /admin só avisa quem já está olhando a tela. Este módulo leva o
 * pedido até o celular da loja — três saídas independentes e opcionais:
 *
 *  1. TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID → alerta instantâneo no celular
 *  2. WHATSAPP_TOKEN + WHATSAPP_PHONE_ID + WHATSAPP_TO → mensagem via API
 *     oficial do WhatsApp (Meta), se a loja tiver conta no WhatsApp Business
 *  3. RESEND_API_KEY (+ STORE_EMAIL) → e-mail
 *
 * Sem nenhuma delas o sistema funciona normalmente: apenas não notifica.
 * Todas as chamadas são "best effort" — nunca derrubam o checkout.
 */

export type OrderNotification = {
  code: string;
  totalCents: number;
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  paymentMethod: string;
  status: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  items: { name: string; qty: number; priceCents: number }[];
  pixPayload?: string | null;
  /** Link assinado da página do pedido, para abrir direto do aviso. */
  orderUrl?: string;
};

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const PAYMENT_LABEL: Record<string, string> = {
  pix: "PIX",
  card: "Cartão",
  whatsapp: "WhatsApp",
};

function orderSummary(o: OrderNotification): string {
  const lines = o.items
    .map((i) => `• ${i.qty}x ${i.name} — ${formatBRL(i.priceCents * i.qty)}`)
    .join("\n");

  return [
    `*Pedido ${o.code}*`,
    `Total: *${formatBRL(o.totalCents)}* (${PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod})`,
    o.discountCents > 0 ? `Desconto: -${formatBRL(o.discountCents)}` : null,
    o.shippingCents === 0 ? "Frete: grátis" : `Frete: ${formatBRL(o.shippingCents)}`,
    "",
    lines,
    "",
    `*${o.customerName}*`,
    `${o.phone} · ${o.email}`,
    `${o.city}/${o.state}`,
    o.orderUrl ? `\nAbrir no painel: ${o.orderUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

async function notifyTelegram(o: OrderNotification): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: orderSummary(o),
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    throw new Error(`Telegram respondeu ${res.status}: ${await res.text()}`);
  }
}

/**
 * WhatsApp Cloud API (Meta). Exige conta no WhatsApp Business:
 *   WHATSAPP_TOKEN     token permanente do app
 *   WHATSAPP_PHONE_ID  id do número que envia
 *   WHATSAPP_TO        número que recebe o aviso (ex.: 5543999542246)
 */
async function notifyWhatsApp(o: OrderNotification): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const to = process.env.WHATSAPP_TO;
  if (!token || !phoneId || !to) return;

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${phoneId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: orderSummary(o).replace(/\*/g, "") },
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`WhatsApp respondeu ${res.status}: ${await res.text()}`);
  }
}

function orderEmailHtml(o: OrderNotification): string {
  const rows = o.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0">${i.qty}× ${i.name}</td>
         <td align="right" style="padding:8px 0">${formatBRL(i.priceCents * i.qty)}</td></tr>`,
    )
    .join("");

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
    <h1 style="font-size:22px;margin:0 0 4px">Pedido ${o.code}</h1>
    <p style="color:#666;margin:0 0 24px">
      ${PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod} · ${formatBRL(o.totalCents)}
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows}
      <tr><td style="padding-top:12px;border-top:1px solid #eee">Total</td>
          <td align="right" style="padding-top:12px;border-top:1px solid #eee;font-weight:700">
            ${formatBRL(o.totalCents)}</td></tr>
    </table>
    <h2 style="font-size:14px;margin:28px 0 6px;text-transform:uppercase;letter-spacing:.1em;color:#999">Entrega</h2>
    <p style="margin:0;font-size:14px;line-height:1.6">
      ${o.customerName}<br>${o.phone} · ${o.email}<br>${o.city}/${o.state}
    </p>
    ${
      o.pixPayload
        ? `<h2 style="font-size:14px;margin:28px 0 6px;text-transform:uppercase;letter-spacing:.1em;color:#999">PIX copia e cola</h2>
           <p style="font-family:ui-monospace,monospace;font-size:11px;word-break:break-all;background:#f6f6f6;padding:12px;border-radius:8px">${o.pixPayload}</p>`
        : ""
    }
    ${
      o.orderUrl
        ? `<p style="margin:24px 0 0"><a href="${o.orderUrl}" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:13px">Ver pedido</a></p>`
        : ""
    }
  </div>`;
}

async function notifyEmail(o: OrderNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM ?? "Moments Paris <onboarding@resend.dev>";
  const storeEmail = process.env.STORE_EMAIL;
  const recipients = [storeEmail, process.env.NOTIFY_CUSTOMER === "true" ? o.email : null]
    .filter(Boolean) as string[];

  if (recipients.length === 0) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject: `Pedido ${o.code} — ${formatBRL(o.totalCents)}`,
      html: orderEmailHtml(o),
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend respondeu ${res.status}: ${await res.text()}`);
  }
}

/**
 * Dispara todas as notificações em paralelo.
 * Erros são apenas logados — o pedido já está gravado no banco.
 */
export async function notifyNewOrder(o: OrderNotification): Promise<void> {
  const results = await Promise.allSettled([
    notifyTelegram(o),
    notifyWhatsApp(o),
    notifyEmail(o),
  ]);
  for (const r of results) {
    if (r.status === "rejected") {
      console.error("[notify] falha ao notificar pedido:", r.reason);
    }
  }
}
