import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { desc, sql } from "drizzle-orm";
import {
  Banknote,
  ExternalLink,
  LogOut,
  MessageCircle,
  Package,
  QrCode,
  ShoppingBag,
} from "lucide-react";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { ADMIN_COOKIE, verifyAdminCookie } from "@/lib/admin-auth";
import { orderPath } from "@/lib/order-token";
import { formatBRL } from "@/lib/format";
import { logoutAction, updateStatusAction } from "./actions";
import { StatusSelect } from "./status-select";

export const metadata: Metadata = {
  title: "Pedidos",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  aguardando_pagamento: "Aguardando PIX",
  aguardando_contato: "Aguardando contato",
  pago: "Pago",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const store = await cookies();
  if (!(await verifyAdminCookie(store.get(ADMIN_COOKIE)?.value))) {
    redirect("/admin/login");
  }

  const { status: filter } = await searchParams;

  const rows = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(100);

  const visible = filter ? rows.filter((r) => r.status === filter) : rows;

  const totals = await db
    .select({
      count: sql<number>`count(*)::int`,
      paid: sql<number>`count(*) filter (where status in ('pago','enviado','entregue'))::int`,
      revenue: sql<number>`coalesce(sum(total_cents) filter (where status in ('pago','enviado','entregue')), 0)::int`,
      pending: sql<number>`count(*) filter (where status in ('aguardando_pagamento','aguardando_contato'))::int`,
    })
    .from(orders);

  const stats = totals[0] ?? { count: 0, paid: 0, revenue: 0, pending: 0 };

  return (
    <div className="min-h-screen bg-ivory pt-[111px]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-rose-600">
              Área da loja
            </p>
            <h1 className="mt-2 font-display text-4xl">Pedidos</h1>
            <p className="mt-1 text-sm text-noir-900/50">
              Atualize o status conforme cada pedido avança. O cliente vê o
              status na página dele.
            </p>
          </div>
          <form action={logoutAction}>
            <button className="inline-flex items-center gap-2 rounded-full border border-noir-900/15 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-noir-900/60 transition-colors hover:border-rose-400 hover:text-rose-600">
              <LogOut size={13} /> Sair
            </button>
          </form>
        </div>

        {/* KPIs */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={ShoppingBag} label="Pedidos" value={String(stats.count)} />
          <StatCard
            icon={Package}
            label="Aguardando pagamento"
            value={String(stats.pending)}
            highlight={stats.pending > 0}
          />
          <StatCard icon={Banknote} label="Pedidos pagos" value={String(stats.paid)} />
          <StatCard
            icon={QrCode}
            label="Receita confirmada"
            value={formatBRL(stats.revenue)}
          />
        </div>

        {/* Filtros */}
        <div className="mt-8 flex flex-wrap gap-2">
          <FilterChip href="/admin" label="Todos" active={!filter} />
          {Object.entries(STATUS_LABEL).map(([key, label]) => (
            <FilterChip
              key={key}
              href={`/admin?status=${key}`}
              label={label}
              active={filter === key}
            />
          ))}
        </div>

        {/* Lista */}
        {visible.length === 0 ? (
          <p className="mt-10 rounded-3xl border border-dashed border-noir-900/15 p-12 text-center text-sm text-noir-900/45">
            Nenhum pedido {filter ? `com status "${STATUS_LABEL[filter]}"` : "ainda"}.
            Quando alguém comprar, aparece aqui na hora.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {visible.map((o) => (
              <li
                key={o.code}
                className="rounded-3xl border border-noir-900/8 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold">
                        {o.code}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${
                          o.status === "pago"
                            ? "bg-emerald-100 text-emerald-700"
                            : o.status === "enviado" || o.status === "entregue"
                              ? "bg-sky-100 text-sky-700"
                              : o.status === "cancelado"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                      <span className="rounded-full bg-blush-100 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-noir-900/60">
                        {o.paymentMethod}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {o.customerName} · {o.city}/{o.state}
                    </p>
                    <p className="text-xs text-noir-900/50">
                      {o.phone} · {o.email}
                    </p>
                    <p className="mt-1 text-xs text-noir-900/45">
                      {o.items.map((i) => `${i.qty}× ${i.name}`).join(" · ")}
                    </p>
                    <p className="mt-0.5 text-xs text-noir-900/40">
                      {o.address}, {o.number} — CEP {o.cep}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="font-display text-2xl">{formatBRL(o.totalCents)}</p>
                    <p className="text-[11px] text-noir-900/40">
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                        timeZone: "America/Sao_Paulo",
                      }).format(o.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-noir-900/8 pt-4">
                  <StatusSelect
                    code={o.code}
                    current={o.status}
                    updateStatusAction={updateStatusAction}
                  />
                  <a
                    href={`https://wa.me/55${o.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Olá, ${o.customerName.split(" ")[0]}! Sobre o seu pedido ${o.code} na Moments Paris...`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700 transition-colors hover:bg-emerald-50"
                  >
                    <MessageCircle size={12} /> WhatsApp
                  </a>
                  <Link
                    href={orderPath(o.code)}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-full border border-noir-900/12 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-noir-900/60 transition-colors hover:border-noir-900/30 hover:text-noir-900"
                  >
                    <ExternalLink size={12} /> Ver pedido
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 ${
        highlight
          ? "border-amber-300 bg-amber-50"
          : "border-noir-900/8 bg-white"
      }`}
    >
      <Icon size={17} className="text-rose-500" />
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-noir-900/45">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
        active
          ? "bg-noir-900 text-ivory"
          : "border border-noir-900/12 text-noir-900/55 hover:border-noir-900/30 hover:text-noir-900"
      }`}
    >
      {label}
    </Link>
  );
}
