"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  MessageCircle,
  QrCode,
  Search,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cx } from "@/lib/format";
import { SITE, whatsappLink } from "@/lib/site";
import { useCart, useCartTotals } from "@/store/cart";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Perfumes" },
  { href: "/produtos?categoria=feminino", label: "Feminino" },
  { href: "/produtos?categoria=masculino", label: "Masculino" },
  { href: "/produtos?promo=1", label: "Promoções" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { count } = useCartTotals();
  const hasHydrated = useCart((s) => s.hasHydrated);
  const openCart = useCart((s) => s.openCart);
  const pathname = usePathname();
  const router = useRouter();
  const onDark = pathname === "/" && !scrolled && !searchOpen;
  const solidBackground = scrolled || searchOpen;
  const controlClass = onDark
    ? "text-ivory hover:bg-ivory/10 hover:text-rose-300"
    : "text-noir-900 hover:bg-blush-100 hover:text-rose-600";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        {/* Announcement bar */}
        <div className="bg-noir-950 px-3 py-2 text-ivory sm:px-4">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] sm:gap-8 sm:text-[10.5px] sm:tracking-[0.22em]">
            <span className="inline-flex items-center gap-2">
              <Truck size={13} className="text-rose-300" />
              Frete grátis acima de R$ 399
            </span>
            <span className="hidden items-center gap-2 sm:inline-flex">
              <QrCode size={13} className="text-rose-300" />
              5% OFF no PIX
            </span>
            <a
              href={whatsappLink("Olá! Vim pelo site da Moments Paris.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 transition-colors hover:text-rose-300 md:inline-flex"
            >
              <MessageCircle size={13} className="text-rose-300" />
              {SITE.whatsappDisplay}
            </a>
          </div>
        </div>

        {/* Main nav */}
        <div
          className={cx(
            "border-b transition-all duration-500",
            solidBackground
              ? "border-noir-900/8 bg-ivory/95 shadow-[0_8px_40px_-20px_rgba(23,17,20,0.25)] backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between gap-2 px-4 min-[380px]:gap-3 sm:gap-4 sm:px-6">
            <Logo light={onDark} />

            <nav className="hidden items-center gap-8 lg:flex">
              {LINKS.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href.split("?")[0]) &&
                      (link.href.includes("?")
                        ? false
                        : !link.href.includes("categoria") &&
                          pathname === link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cx(
                      "group relative text-[12px] font-medium uppercase tracking-[0.24em] transition-colors",
                      active
                        ? onDark
                          ? "text-rose-300"
                          : "text-rose-600"
                        : onDark
                          ? "text-ivory/75 hover:text-ivory"
                          : "text-noir-900/70 hover:text-noir-900",
                    )}
                  >
                    {link.label}
                    <span
                      className={cx(
                        "absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full",
                        onDark ? "bg-rose-300" : "bg-rose-500",
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                aria-label="Buscar perfumes"
                onClick={() => setSearchOpen((v) => !v)}
                className={cx(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                  controlClass,
                )}
              >
                {searchOpen ? <X size={19} /> : <Search size={19} />}
              </button>
              <button
                type="button"
                aria-label={`Abrir sacola (${count} itens)`}
                onClick={openCart}
                className={cx(
                  "relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                  controlClass,
                )}
              >
                <ShoppingBag size={19} />
                {hasHydrated && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </button>
              <button
                type="button"
                aria-label="Abrir menu"
                onClick={() => setMenuOpen(true)}
                className={cx(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden",
                  controlClass,
                )}
              >
                <Menu size={19} />
              </button>
            </div>
          </div>

          {/* Expanding search */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-t border-noir-900/5 bg-ivory/95 backdrop-blur-xl"
              >
                <form
                  className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!query.trim()) return;
                    router.push(`/produtos?q=${encodeURIComponent(query.trim())}`);
                    setSearchOpen(false);
                    setQuery("");
                  }}
                >
                  <Search size={18} className="shrink-0 text-rose-500" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Busque por perfume, marca ou família olfativa…"
                    className="w-full bg-transparent font-display text-xl italic text-noir-900 placeholder:text-noir-900/35 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-noir-900 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-rose-600"
                  >
                    Buscar
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-noir-950 text-ivory"
          >
            <div className="flex h-full flex-col px-6 py-6">
              <div className="flex items-center justify-between">
                <Logo light />
                <button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 text-ivory"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="mt-14 flex flex-col gap-2">
                {LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-baseline gap-4 py-2"
                    >
                      <span className="font-display text-sm italic text-rose-400">
                        0{i + 1}
                      </span>
                      <span className="font-display text-4xl transition-colors group-hover:text-rose-300">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto space-y-2 border-t border-ivory/10 pt-6 text-sm text-ivory/60">
                <p className="text-[11px] uppercase tracking-[0.3em] text-rose-300">
                  Fale com a Neusa
                </p>
                <p>{SITE.whatsappDisplay} · {SITE.instagramHandle}</p>
                <p>{SITE.city}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
