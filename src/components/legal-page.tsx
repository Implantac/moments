import type { ReactNode } from "react";

/**
 * Layout único para páginas institucionais/legais.
 * Tipografia confortável para leitura longa e âncoras no sumário.
 */
export function LegalPage({
  title,
  overline,
  updatedAt,
  children,
}: {
  title: string;
  overline: string;
  updatedAt?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ivory pt-[111px]">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-rose-600">
          {overline}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
          {title}
        </h1>
        {updatedAt && (
          <p className="mt-3 text-xs text-noir-900/40">
            Última atualização: {updatedAt}
          </p>
        )}
        <div className="legal-prose mt-10 space-y-6 text-[15px] leading-relaxed text-noir-900/75">
          {children}
        </div>
      </div>
    </div>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <h2 className="font-display text-2xl text-noir-900">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
