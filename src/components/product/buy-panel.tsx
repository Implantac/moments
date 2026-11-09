"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  CreditCard,
  Minus,
  MessageCircle,
  Plus,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { formatBRL, installmentsLabel } from "@/lib/format";
import {
  CARD_INSTALLMENTS,
  FREE_SHIPPING_THRESHOLD_CENTS,
  PIX_DISCOUNT_RATE,
  whatsappLink,
} from "@/lib/site";
import { useCart } from "@/store/cart";

export function BuyPanel({ product }: { product: ProductListItem }) {
  const [qty, setQtyLocal] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);

  const pixPrice = Math.round(product.priceCents * (1 - PIX_DISCOUNT_RATE));
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 10;

  const handleAdd = () => {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        sizeMl: product.sizeMl,
        priceCents: product.priceCents,
        image: product.image,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div>
      {/* Price block */}
      <div className="rounded-[24px] border border-noir-900/8 bg-white p-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {product.compareAtCents && (
            <span className="text-sm text-noir-900/40 line-through">
              {formatBRL(product.compareAtCents)}
            </span>
          )}
          <span className="font-display text-5xl font-medium">
            {formatBRL(product.priceCents)}
          </span>
          {product.compareAtCents && (
            <span className="rounded-full bg-rose-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
              −
              {Math.round(
                (1 - product.priceCents / product.compareAtCents) * 100,
              )}
              %
            </span>
          )}
        </div>
        <p className="mt-2 flex items-center gap-2 text-sm text-noir-900/60">
          <CreditCard size={15} className="text-rose-500" />
          {installmentsLabel(
            product.priceCents,
            CARD_INSTALLMENTS.interestFree,
            CARD_INSTALLMENTS.max,
          )}
        </p>
        <p className="mt-1.5 flex items-center gap-2 text-sm">
          <QrCode size={15} className="text-emerald-600" />
          <span>
            <strong className="text-emerald-700">{formatBRL(pixPrice)}</strong>{" "}
            no PIX{" "}
            <span className="text-noir-900/50">
              ({Math.round(PIX_DISCOUNT_RATE * 100)}% OFF)
            </span>
          </span>
        </p>

        {/* Stock */}
        <p className="mt-4 flex items-center gap-2 text-sm">
          {inStock ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-noir-900/70">
                Em estoque · envio imediato
                {lowStock && (
                  <span className="text-rose-600">
                    {" "}
                    (últimas {product.stock} unidades)
                  </span>
                )}
              </span>
            </>
          ) : (
            <span className="text-rose-600">Esgotado — encomende no WhatsApp</span>
          )}
        </p>

        {/* Qty + Add */}
        <div className="mt-6 flex gap-3">
          <div className="inline-flex items-center rounded-full border border-noir-900/12">
            <button
              type="button"
              aria-label="Diminuir"
              onClick={() => setQtyLocal((q) => Math.max(1, q - 1))}
              className="px-4 py-3 text-noir-900/60 transition-colors hover:text-rose-600"
            >
              <Minus size={15} />
            </button>
            <span className="w-6 text-center font-medium">{qty}</span>
            <button
              type="button"
              aria-label="Aumentar"
              onClick={() =>
                setQtyLocal((q) => Math.min(product.stock, q + 1))
              }
              className="px-4 py-3 text-noir-900/60 transition-colors hover:text-rose-600"
            >
              <Plus size={15} />
            </button>
          </div>
          <motion.button
            type="button"
            onClick={handleAdd}
            disabled={!inStock}
            whileTap={{ scale: 0.97 }}
            className={`flex flex-1 items-center justify-center gap-2.5 rounded-full py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-ivory transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
              added ? "bg-emerald-600" : "bg-noir-900 hover:bg-rose-600"
            }`}
          >
            {added ? (
              <>
                <Check size={16} /> Adicionado!
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> Adicionar à sacola
              </>
            )}
          </motion.button>
        </div>

        <a
          href={whatsappLink(
            `Olá! Quero comprar o perfume ${product.name} (${product.brand}) ${product.sizeMl}ml — ${formatBRL(product.priceCents)}.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-full border border-noir-900/12 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-noir-900 transition-colors hover:border-emerald-500 hover:text-emerald-700"
        >
          <MessageCircle size={16} />
          Comprar pelo WhatsApp
        </a>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-noir-900/8 pt-5 text-xs text-noir-900/60">
          <p className="flex items-center gap-2">
            <Truck size={14} className="text-rose-500" />
            Frete grátis acima de {formatBRL(FREE_SHIPPING_THRESHOLD_CENTS)}
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-rose-500" />
            Original, lacrado e com nota
          </p>
        </div>
      </div>
    </div>
  );
}
