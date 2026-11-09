import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { ADMIN_COOKIE, verifyAdminCookie } from "@/lib/admin-auth";
import { loginAction } from "../actions";

export const metadata: Metadata = {
  title: "Área da loja",
  robots: { index: false, follow: false },
};

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const store = await cookies();
  if (await verifyAdminCookie(store.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin");
  }

  const { erro } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 pt-[111px]">
      <div className="w-full max-w-sm rounded-[28px] border border-noir-900/8 bg-white p-8">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blush-100 text-rose-500">
          <LockKeyhole size={20} />
        </span>
        <h1 className="mt-5 font-display text-2xl">Área da loja</h1>
        <p className="mt-1 text-sm text-noir-900/55">
          Acesso restrito à administração dos pedidos.
        </p>

        <form action={loginAction} className="mt-6 grid gap-3">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-noir-900/55">
              Senha
            </span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              autoComplete="current-password"
              className="w-full rounded-2xl border border-noir-900/12 px-4 py-3 text-sm focus:border-rose-400 focus:outline-none"
            />
          </label>
          <button className="mt-1 rounded-full bg-noir-900 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-rose-600">
            Entrar
          </button>
        </form>

        {erro === "1" && (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-xs text-rose-700">
            Senha incorreta.
          </p>
        )}
        {erro === "2" && (
          <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
            ADMIN_PASSWORD não configurada (mínimo 8 caracteres). Configure a
            variável de ambiente para habilitar o acesso.
          </p>
        )}
      </div>
    </div>
  );
}
