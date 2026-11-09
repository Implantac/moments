import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

/**
 * Guarda o e-mail na lista de novidades com consentimento registrado.
 * Idempotente: repetir o mesmo e-mail não gera erro para o cliente.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { email?: string };
    const email = String(body.email ?? "").trim().toLowerCase().slice(0, 160);

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    await db
      .insert(subscribers)
      .values({ email, source: "site" })
      .onConflictDoNothing({ target: subscribers.email });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/newsletter]", error);
    return NextResponse.json(
      { error: "Não foi possível salvar seu e-mail agora." },
      { status: 500 },
    );
  }
}
