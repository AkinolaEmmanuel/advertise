import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";
import { canIncreaseQuantity } from "@/lib/stock";

interface CartState {
  brandId: string | null;
  items: CartItem[];
  setActiveBrand: (brandId: string) => void;
  addItem: (product: Product) => boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => boolean;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      brandId: null,
      items: [],

      setActiveBrand: (brandId) => {
        const current = get().brandId;
        if (current !== brandId) {
          set({ brandId, items: [] });
        } else {
          set({ brandId });
        }
      },

      addItem: (product) => {
        const { brandId, items } = get();
        if (!brandId) return false;

        const existing = items.find((item) => item.product.id === product.id);
        if (existing && !canIncreaseQuantity(product, existing.quantity)) {
          return false;
        }

        if (existing) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
        return true;
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return true;
        }

        const item = get().items.find((i) => i.product.id === productId);
        if (item && !canIncreaseQuantity(item.product, quantity)) {
          return false;
        }

        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
        return true;
      },

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "polowo-cart-v2",
      partialize: (state) => ({
        brandId: state.brandId,
        items: state.items,
      }),
    }
  )
);
