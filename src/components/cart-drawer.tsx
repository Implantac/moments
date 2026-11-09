"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { formatBRL } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD_CENTS, PIX_DISCOUNT_RATE } from "@/lib/site";
import { useCart, useCartTotals } from "@/store/cart";

export function CartDrawer() {
  const { items, isOpen, closeCart, setQty, removeItem } = useCart();
  const { subtotal, count } = useCartTotals();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotal);
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD_CENTS);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-55 bg-noir-950/55 backdrop-blur-sm"
            style={{ zIndex: 55 }}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed inset-y-0 right-0 z-60 flex w-full max-w-md flex-col bg-ivory shadow-2xl"
            style={{ zIndex: 60 }}
            role="dialog"
            aria-label="Sacola de compras"
          >
            <div className="flex items-center justify-between border-b border-noir-900/8 px-6 py-5">
              <h2 className="flex items-center gap-3 font-display text-2xl">
                <ShoppingBag size={20} className="text-rose-500" />
                Sacola
                {count > 0 && (
                  <span className="text-sm font-sans text-noir-900/50">
                    ({count} {count === 1 ? "item" : "itens"})
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Fechar sacola"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-blush-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free shipping progress */}
            <div className="border-b border-noir-900/8 px-6 py-4">
              {remaining > 0 ? (
                <p className="text-xs text-noir-900/70">
                  Faltam{" "}
                  <strong className="text-rose-600">
                    {formatBRL(remaining)}
                  </strong>{" "}
                  para <strong>frete grátis</strong>
                </p>
              ) : (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Você ganhou frete grátis!
                </p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blush-200">
                <motion.div
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600"
                />
              </div>
            </div>

            {/* Items */}
            <div className="nice-scroll flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blush-100 text-rose-400">
                    <ShoppingBag size={32} strokeWidth={1.5} />
                  </span>
                  <p className="mt-5 font-display text-2xl">Sua sacola está vazia</p>
                  <p className="mt-2 max-w-[240px] text-sm text-noir-900/55">
                    Descubra perfumes importados originais com os melhores
                    preços do Brasil.
                  </p>
                  <Link
                    href="/produtos"
                    onClick={closeCart}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-noir-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-rose-600"
                  >
                    Explorar perfumes <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.slug}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-4"
                      >
                        <Link
                          href={`/produto/${item.slug}`}
                          onClick={closeCart}
                          className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-blush-100"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-600">
                                {item.brand}
                              </p>
                              <Link
                                href={`/produto/${item.slug}`}
                                onClick={closeCart}
                                className="font-display text-lg leading-tight hover:text-rose-600"
                              >
                                {item.name}
                              </Link>
                              <p className="text-[11px] text-noir-900/45">
                                {item.sizeMl}ml
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.slug)}
                              aria-label={`Remover ${item.name}`}
                              className="rounded-full p-1.5 text-noir-900/35 transition-colors hover:bg-blush-100 hover:text-rose-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="inline-flex items-center rounded-full border border-noir-900/12">
                              <button
                                type="button"
                                aria-label="Diminuir quantidade"
                                onClick={() => setQty(item.slug, item.qty - 1)}
                                className="p-2 text-noir-900/60 transition-colors hover:text-rose-600"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-7 text-center text-sm font-medium">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                aria-label="Aumentar quantidade"
                                onClick={() => setQty(item.slug, item.qty + 1)}
                                className="p-2 text-noir-900/60 transition-colors hover:text-rose-600"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <p className="text-sm font-semibold">
                              {formatBRL(item.priceCents * item.qty)}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-noir-900/8 bg-blush-50 px-6 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-noir-900/60">Subtotal</span>
                  <span className="font-display text-2xl font-semibold">
                    {formatBRL(subtotal)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-noir-900/50">
                  {Math.round(PIX_DISCOUNT_RATE * 100)}% OFF no PIX aplicado no checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-noir-900 py-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-ivory transition-all hover:bg-rose-600 active:scale-[0.99]"
                >
                  Finalizar compra <ArrowRight size={15} />
                </Link>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-2 w-full py-2 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-noir-900/60 transition-colors hover:text-noir-900"
                >
                  Continuar comprando
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
