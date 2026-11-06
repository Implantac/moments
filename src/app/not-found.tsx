import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EiffelMark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 pt-[101px] text-center">
      <EiffelMark className="h-16 w-16 text-rose-500" />
      <p className="mt-6 text-outline-noir select-none font-display text-[8rem] leading-none sm:text-[12rem]">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl">
        Esta página evaporou no ar
      </h1>
      <p className="mt-3 max-w-sm text-sm text-noir-900/55">
        Como uma nota de topo, ela durou pouco. Volte para a loja e encontre
        seu próximo perfume favorito.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-noir-900 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-rose-600"
      >
        <ArrowLeft size={15} /> Voltar ao início
      </Link>
    </div>
  );
}
