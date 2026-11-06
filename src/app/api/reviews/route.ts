import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const productId = Number(body.productId);
    const author = String(body.author ?? "").trim().slice(0, 60);
    const city = String(body.city ?? "").trim().slice(0, 60);
    const title = String(body.title ?? "").trim().slice(0, 80);
    const text = String(body.body ?? "").trim().slice(0, 600);
    const rating = Math.max(1, Math.min(5, Math.round(Number(body.rating))));

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: "Produto inválido." }, { status: 400 });
    }
    if (!author || author.length < 2) {
      return NextResponse.json({ error: "Informe seu nome." }, { status: 400 });
    }
    if (!text || text.length < 5) {
      return NextResponse.json(
        { error: "Escreva um comentário." },
        { status: 400 },
      );
    }
    if (!Number.isFinite(rating)) {
      return NextResponse.json({ error: "Nota inválida." }, { status: 400 });
    }

    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, productId));
    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado." },
        { status: 404 },
      );
    }

    await db.insert(reviews).values({
      productId,
      author,
      city: city || null,
      title: title || null,
      body: text,
      rating,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao salvar avaliação." },
      { status: 500 },
    );
  }
}
