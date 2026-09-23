import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  sku?: string;
  name: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  storeId: string;
  storeName: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Drawer Controls
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Cart Operations
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearStoreCart: (storeId: string) => void;

  // Computed Totals
  getSubtotal: (storeId?: string) => number;
  getTax: (storeId?: string) => number;
  getShippingFee: (storeId?: string) => number;
  getGrandTotal: (storeId?: string) => number;
  getItemCount: (storeId?: string) => number;
}

const TAX_RATE = 0.05; // 5% GST
const STANDARD_SHIPPING_FEE = 49;
const FREE_SHIPPING_THRESHOLD = 499;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (item, quantity = 1) => {
        const { items } = get();

        // Existing item in cart -> increment quantity
        const existingIndex = items.findIndex((i) => i.productId === item.productId);
        if (existingIndex > -1) {
          const updated = [...items];
          const currentItem = updated[existingIndex];
          if (currentItem) {
            updated[existingIndex] = {
              ...currentItem,
              quantity: currentItem.quantity + quantity,
            };
          }
          set({ items: updated });
        } else {
          // New item
          set({
            items: [...items, { ...item, quantity }],
          });
        }

        return true;
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((i) => i.productId !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const updated = get().items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        );
        set({ items: updated });
      },

      clearCart: () => {
        set({ items: [] });
      },

      clearStoreCart: (storeId: string) => {
        set({ items: get().items.filter((i) => i.storeId !== storeId) });
      },

      getSubtotal: (storeId?: string) => {
        const itemsToCalculate = storeId 
          ? get().items.filter(i => i.storeId === storeId) 
          : get().items;
        return Number(
          itemsToCalculate.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0).toFixed(2),
        );
      },

      getTax: (storeId?: string) => {
        return Number((get().getSubtotal(storeId) * TAX_RATE).toFixed(2));
      },

      getShippingFee: (storeId?: string) => {
        const subtotal = get().getSubtotal(storeId);
        if (subtotal === 0) return 0;
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
      },

      getGrandTotal: (storeId?: string) => {
        return Number(
          (get().getSubtotal(storeId) + get().getTax(storeId) + get().getShippingFee(storeId)).toFixed(2),
        );
      },

      getItemCount: (storeId?: string) => {
        const itemsToCalculate = storeId 
          ? get().items.filter(i => i.storeId === storeId) 
          : get().items;
        return itemsToCalculate.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'platform-cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);
