"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, SearchX, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { cx } from "@/lib/format";
import { PIX_DISCOUNT_RATE } from "@/lib/site";
import type { ProductListItem, SortKey } from "@/lib/types";

const PRICE_BUCKETS = [
  { id: "todos", label: "Todos os preços", min: 0, max: Infinity },
  { id: "ate-450", label: "Até R$ 450", min: 0, max: 45000 },
  { id: "450-600", label: "R$ 450 a R$ 600", min: 45000, max: 60000 },
  { id: "600-750", label: "R$ 600 a R$ 750", min: 60000, max: 75000 },
  { id: "acima-750", label: "Acima de R$ 750", min: 75000, max: Infinity },
];

const SORTS: { id: SortKey; label: string }[] = [
  { id: "destaques", label: "Destaques" },
  { id: "menor-preco", label: "Menor preço" },
  { id: "maior-preco", label: "Maior preço" },
  { id: "avaliacao", label: "Melhor avaliados" },
  { id: "az", label: "De A a Z" },
];

const CATEGORY_LABELS: Record<string, string> = {
  feminino: "Feminino",
  masculino: "Masculino",
  unissex: "Unissex",
};

function toggle(set: Set<string>, value: string) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-noir-900/8 py-5 last:border-none">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-noir-900/60">
        {title}
      </h3>
      <div className="mt-3.5 space-y-2.5">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center gap-3 text-sm text-noir-900/75 transition-colors hover:text-noir-900"
    >
      <span
        className={cx(
          "inline-flex h-4.5 w-4.5 items-center justify-center rounded-md border transition-all",
          checked
            ? "border-rose-500 bg-rose-500 text-white"
            : "border-noir-900/20 bg-transparent",
        )}
        style={{ height: 18, width: 18 }}
      >
        {checked && <Check size={11} strokeWidth={3} />}
      </span>
      <span className={cx(checked && "font-medium text-noir-900")}>{label}</span>
      {typeof count === "number" && (
        <span className="ml-auto text-xs text-noir-900/40">{count}</span>
      )}
    </button>
  );
}

export function ShopClient({
  products,
  initialQuery = "",
  initialCategory = null,
  initialPromo = false,
}: {
  products: ProductListItem[];
  initialQuery?: string;
  initialCategory?: string | null;
  initialPromo?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [cats, setCats] = useState<Set<string>>(
    () => new Set(initialCategory ? [initialCategory] : []),
  );
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [families, setFamilies] = useState<Set<string>>(new Set());
  const [bucket, setBucket] = useState("todos");
  const [promoOnly, setPromoOnly] = useState(initialPromo);
  const [sort, setSort] = useState<SortKey>("destaques");
  const [mobileFilters, setMobileFilters] = useState(false);

  const facets = useMemo(() => {
    const catCount = new Map<string, number>();
    const brandCount = new Map<string, number>();
    const familyCount = new Map<string, number>();
    for (const p of products) {
      catCount.set(p.category, (catCount.get(p.category) ?? 0) + 1);
      brandCount.set(p.brand, (brandCount.get(p.brand) ?? 0) + 1);
      familyCount.set(p.family, (familyCount.get(p.family) ?? 0) + 1);
    }
    return {
      cats: [...catCount.entries()].sort((a, b) => a[0].localeCompare(b[0])),
      brands: [...brandCount.entries()].sort((a, b) => a[0].localeCompare(b[0])),
      families: [...familyCount.entries()].sort((a, b) =>
        a[0].localeCompare(b[0]),
      ),
    };
  }, [products]);

  const filtered = useMemo(() => {
    const bucketData = PRICE_BUCKETS.find((b) => b.id === bucket)!;
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (cats.size > 0 && !cats.has(p.category)) return false;
      if (brands.size > 0 && !brands.has(p.brand)) return false;
      if (families.size > 0 && !families.has(p.family)) return false;
      if (promoOnly && !p.compareAtCents) return false;
      if (p.priceCents < bucketData.min || p.priceCents > bucketData.max)
        return false;
      if (q) {
        const haystack =
          `${p.name} ${p.brand} ${p.family} ${CATEGORY_LABELS[p.category] ?? p.category}`.toLowerCase();
        if (!q.split(/\s+/).every((token) => haystack.includes(token)))
          return false;
      }
      return true;
    });

    switch (sort) {
      case "menor-preco":
        return [...list].sort((a, b) => a.priceCents - b.priceCents);
      case "maior-preco":
        return [...list].sort((a, b) => b.priceCents - a.priceCents);
      case "avaliacao":
        return [...list].sort(
          (a, b) => b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount,
        );
      case "az":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, cats, brands, families, bucket, promoOnly, query, sort]);

  const activeChips: { label: string; remove: () => void }[] = [
    ...[...cats].map((c) => ({
      label: CATEGORY_LABELS[c] ?? c,
      remove: () => setCats((s) => toggle(s, c)),
    })),
    ...[...brands].map((b) => ({
      label: b,
      remove: () => setBrands((s) => toggle(s, b)),
    })),
    ...[...families].map((f) => ({
      label: f,
      remove: () => setFamilies((s) => toggle(s, f)),
    })),
    ...(bucket !== "todos"
      ? [
          {
            label: PRICE_BUCKETS.find((b) => b.id === bucket)!.label,
            remove: () => setBucket("todos"),
          },
        ]
      : []),
    ...(promoOnly ? [{ label: "Em promoção", remove: () => setPromoOnly(false) }] : []),
    ...(query.trim()
      ? [{ label: `“${query.trim()}”`, remove: () => setQuery("") }]
      : []),
  ];

  const clearAll = () => {
    setQuery("");
    setCats(new Set());
    setBrands(new Set());
    setFamilies(new Set());
    setBucket("todos");
    setPromoOnly(false);
  };

  const heading = (() => {
    if (query.trim()) return `Resultados para “${query.trim()}”`;
    if (cats.size === 1) {
      const c = [...cats][0];
      return `Perfumes ${CATEGORY_LABELS[c] ? `${CATEGORY_LABELS[c]}s` : c}`;
    }
    if (promoOnly) return "Promoções";
    return "Todos os perfumes";
  })();

  const filtersBody = (
    <>
      <FilterGroup title="Busca">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Perfume, marca, nota…"
          className="w-full rounded-full border border-noir-900/12 bg-white px-4 py-2.5 text-sm placeholder:text-noir-900/35 focus:border-rose-400 focus:outline-none"
        />
      </FilterGroup>

      <FilterGroup title="Categoria">
        {facets.cats.map(([cat, n]) => (
          <CheckRow
            key={cat}
            label={CATEGORY_LABELS[cat] ?? cat}
            count={n}
            checked={cats.has(cat)}
            onChange={() => setCats((s) => toggle(s, cat))}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Marca">
        {facets.brands.map(([brand, n]) => (
          <CheckRow
            key={brand}
            label={brand}
            count={n}
            checked={brands.has(brand)}
            onChange={() => setBrands((s) => toggle(s, brand))}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Família olfativa">
        {facets.families.map(([fam, n]) => (
          <CheckRow
            key={fam}
            label={fam}
            count={n}
            checked={families.has(fam)}
            onChange={() => setFamilies((s) => toggle(s, fam))}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Preço">
        {PRICE_BUCKETS.map((b) => (
          <CheckRow
            key={b.id}
            label={b.label}
            checked={bucket === b.id}
            onChange={() => setBucket(b.id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Ofertas">
        <CheckRow
          label="Somente promoções"
          checked={promoOnly}
          onChange={() => setPromoOnly((v) => !v)}
        />
      </FilterGroup>
    </>
  );

  return (
    <div className="pt-[111px]">
      {/* Page header */}
      <div className="border-b border-noir-900/8 bg-blush-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-rose-600">
            Moments Paris · Catálogo
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl">{heading}</h1>
          <p className="mt-3 max-w-xl text-sm text-noir-900/55 sm:text-base">
            {`Originais, lacrados e com nota. Pague no PIX com ${Math.round(
              PIX_DISCOUNT_RATE * 100,
            )}% de desconto ou combine o cartão no WhatsApp.`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="lg:grid lg:grid-cols-[250px_1fr] lg:gap-12">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 nice-scroll max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl">Filtros</h2>
                {activeChips.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[11px] font-medium uppercase tracking-[0.18em] text-rose-600 hover:underline"
                  >
                    Limpar
                  </button>
                )}
              </div>
              {filtersBody}
            </div>
          </aside>

          <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFilters((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-noir-900/12 bg-white px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] lg:hidden"
              >
                <SlidersHorizontal size={14} />
                Filtros
                {activeChips.length > 0 && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {activeChips.length}
                  </span>
                )}
              </button>

              <p className="text-sm text-noir-900/55">
                <span className="font-display text-lg font-semibold text-noir-900">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "perfume" : "perfumes"}
              </p>

              <div className="relative ml-auto">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  aria-label="Ordenar por"
                  className="appearance-none rounded-full border border-noir-900/12 bg-white py-2.5 pl-5 pr-10 text-[11px] font-semibold uppercase tracking-[0.14em] focus:border-rose-400 focus:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-noir-900/50"
                />
              </div>
            </div>

            {/* Mobile filters panel */}
            <AnimatePresence>
              {mobileFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden lg:hidden"
                >
                  <div className="mt-4 rounded-[24px] border border-noir-900/8 bg-white p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <h2 className="font-display text-xl">Filtros</h2>
                      <button
                        type="button"
                        onClick={clearAll}
                        className="text-[11px] font-medium uppercase tracking-[0.18em] text-rose-600"
                      >
                        Limpar tudo
                      </button>
                    </div>
                    {filtersBody}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active chips */}
            {activeChips.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {activeChips.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={chip.remove}
                    className="group inline-flex items-center gap-2 rounded-full bg-noir-900 px-4 py-1.5 text-[11px] font-medium text-ivory transition-colors hover:bg-rose-600"
                  >
                    {chip.label}
                    <X size={12} className="opacity-70 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 ? (
              <motion.div
                layout
                className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((p) => (
                    <motion.div
                      key={p.slug}
                      layout
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="mt-16 flex flex-col items-center py-16 text-center">
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blush-100 text-rose-400">
                  <SearchX size={30} strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 font-display text-3xl">
                  Nenhum perfume encontrado
                </h3>
                <p className="mt-2 max-w-sm text-sm text-noir-900/55">
                  Tente ajustar os filtros ou buscar por outro termo — ou fale
                  com a gente que encomendamos pra você.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-6 rounded-full bg-noir-900 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-rose-600"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
