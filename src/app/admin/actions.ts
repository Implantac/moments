"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { ADMIN_COOKIE, adminToken, checkPassword, verifyAdminCookie } from "@/lib/admin-auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!(await checkPassword(password))) {
    redirect("/admin/login?erro=1");
  }
  const token = await adminToken();
  if (!token) redirect("/admin/login?erro=2");

  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12, // 12h
  });
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function updateStatusAction(formData: FormData) {
  const store = await cookies();
  if (!(await verifyAdminCookie(store.get(ADMIN_COOKIE)?.value))) {
    redirect("/admin/login");
  }

  const code = String(formData.get("code") ?? "");
  const status = String(formData.get("status") ?? "");
  const allowed = [
    "aguardando_pagamento",
    "pago",
    "enviado",
    "entregue",
    "cancelado",
    "aguardando_contato",
  ];
  if (!code || !allowed.includes(status)) return;

  const [order] = await db
    .select({ items: orders.items, status: orders.status })
    .from(orders)
    .where(eq(orders.code, code));

  if (!order) return;

  // Cancelar devolve as peças ao estoque (ele é debitado na criação do
  // pedido); reabrir um pedido cancelado reserva de novo.
  if (status === "cancelado" && order.status !== "cancelado") {
    for (const item of order.items) {
      await db
        .update(products)
        .set({ stock: sql`${products.stock} + ${item.qty}` })
        .where(eq(products.slug, item.slug));
    }
  } else if (status !== "cancelado" && order.status === "cancelado") {
    for (const item of order.items) {
      await db
        .update(products)
        .set({ stock: sql`GREATEST(${products.stock} - ${item.qty}, 0)` })
        .where(eq(products.slug, item.slug));
    }
  }

  await db.update(orders).set({ status }).where(eq(orders.code, code));
  revalidatePath("/admin");
}
