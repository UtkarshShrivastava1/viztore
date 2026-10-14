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

export interface StoreConflict {
  pendingItem: Omit<CartItem, 'quantity'>;
  pendingQuantity: number;
  existingStoreName: string;
  newStoreName: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  storeConflict: StoreConflict | null;

  // Drawer Controls
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Single-Store Conflict Resolution
  resolveStoreConflict: (confirmClear: boolean) => void;
  clearStoreConflict: () => void;

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
      storeConflict: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      resolveStoreConflict: (confirmClear: boolean) => {
        const { storeConflict } = get();
        if (!storeConflict) return;

        if (confirmClear) {
          // Replace cart with the new store's item
          set({
            items: [{ ...storeConflict.pendingItem, quantity: storeConflict.pendingQuantity }],
            storeConflict: null,
            isOpen: true,
          });
        } else {
          // Retain existing cart
          set({ storeConflict: null });
        }
      },

      clearStoreConflict: () => set({ storeConflict: null }),

      addItem: (item, quantity = 1) => {
        const { items } = get();

        // Enforce Single-Store Cart Invariant:
        // A customer's cart may contain items from exactly one store at a time.
        if (items.length > 0 && items[0].storeId !== item.storeId) {
          set({
            storeConflict: {
              pendingItem: item,
              pendingQuantity: quantity,
              existingStoreName: items[0].storeName || 'another store',
              newStoreName: item.storeName || 'this store',
            },
          });
          return false;
        }

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
          set({ items: updated, storeConflict: null });
        } else {
          // New item from the same store
          set({
            items: [...items, { ...item, quantity }],
            storeConflict: null,
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
