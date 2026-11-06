"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  slug: string;
  name: string;
  brand: string;
  sizeMl: number;
  priceCents: number;
  image: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  setHydrated: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,
      addItem: (item, qty = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.slug === item.slug);
        if (existing) {
          set({
            items: items.map((i) =>
              i.slug === item.slug ? { ...i, qty: i.qty + qty } : i,
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...items, { ...item, qty }], isOpen: true });
        }
      },
      removeItem: (slug) =>
        set({ items: get().items.filter((i) => i.slug !== slug) }),
      setQty: (slug, qty) => {
        if (qty <= 0) {
          get().removeItem(slug);
          return;
        }
        set({
          items: get().items.map((i) => (i.slug === slug ? { ...i, qty } : i)),
        });
      },
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "moments-paris-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export function useCartTotals() {
  const items = useCart((s) => s.items);
  const subtotal = items.reduce((acc, i) => acc + i.priceCents * i.qty, 0);
  const count = items.reduce((acc, i) => acc + i.qty, 0);
  return { subtotal, count };
}
