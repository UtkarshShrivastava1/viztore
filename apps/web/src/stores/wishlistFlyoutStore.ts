import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IWishlistFlyoutItem {
  id: string;
  productId: string;
  title: string;
  storeName: string;
  storeId?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  selectedVariant?: string;
  availableVariants?: string[];
}

interface WishlistFlyoutState {
  items: IWishlistFlyoutItem[];
  addItem: (item: IWishlistFlyoutItem) => void;
  removeItem: (idOrProductId: string) => void;
  toggleItem: (item: IWishlistFlyoutItem) => void;
  isInWishlist: (idOrProductId: string) => boolean;
  updateVariant: (id: string, variant: string) => void;
  clearWishlist: () => void;
  setItems: (items: IWishlistFlyoutItem[]) => void;
}

export const useWishlistFlyoutStore = create<WishlistFlyoutState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          if (
            state.items.some(
              (i) =>
                i.id === item.id ||
                (item.productId && (i.productId === item.productId || i.id === item.productId))
            )
          ) {
            return state;
          }
          return { items: [item, ...state.items] };
        }),
      removeItem: (idOrProductId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== idOrProductId && item.productId !== idOrProductId
          ),
        })),
      toggleItem: (item) => {
        const current = get().items;
        const exists = current.some(
          (i) =>
            i.id === item.id ||
            (item.productId && (i.productId === item.productId || i.id === item.productId))
        );
        if (exists) {
          set({
            items: current.filter(
              (i) => i.id !== item.id && (!item.productId || i.productId !== item.productId)
            ),
          });
        } else {
          set({
            items: [item, ...current],
          });
        }
      },
      isInWishlist: (idOrProductId) => {
        return get().items.some(
          (item) => item.id === idOrProductId || item.productId === idOrProductId
        );
      },
      updateVariant: (id, variant) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, selectedVariant: variant } : item
          ),
        })),
      clearWishlist: () => set({ items: [] }),
      setItems: (items) => set({ items }),
    }),
    {
      name: 'viztore-wishlist-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
