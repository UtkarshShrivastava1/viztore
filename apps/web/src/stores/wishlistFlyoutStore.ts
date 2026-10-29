import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api/client.js';

export interface IWishlistFlyoutItem {
  id: string;
  productId: string;
  title: string;
  storeName: string;
  storeId?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  slug?: string;
  selectedVariant?: string;
  availableVariants?: string[];
  addedAt?: string;
}

interface WishlistFlyoutState {
  items: IWishlistFlyoutItem[];
  addItem: (item: IWishlistFlyoutItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: IWishlistFlyoutItem) => boolean;
  isInWishlist: (id: string) => boolean;
  updateVariant: (id: string, variant: string) => void;
  clearWishlist: () => void;
  setItems: (items: IWishlistFlyoutItem[]) => void;
}

export const useWishlistFlyoutStore = create<WishlistFlyoutState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const { items } = get();
        if (items.some((i) => i.id === item.id || i.productId === item.productId)) {
          return;
        }
        set({ items: [item, ...items] });

        // Best-effort asynchronous backend sync
        api.post(`/auth/wishlist/${item.productId || item.id}/toggle`).catch(() => {});
      },
      removeItem: (id) => {
        const { items } = get();
        const target = items.find((i) => i.id === id || i.productId === id);
        set({
          items: items.filter((item) => item.id !== id && item.productId !== id),
        });

        if (target) {
          api.post(`/auth/wishlist/${target.productId || target.id}/toggle`).catch(() => {});
        }
      },
      toggleItem: (item) => {
        const { items } = get();
        const exists = items.some((i) => i.id === item.id || i.productId === item.productId);
        if (exists) {
          set({
            items: items.filter((i) => i.id !== item.id && i.productId !== item.productId),
          });
          api.post(`/auth/wishlist/${item.productId || item.id}/toggle`).catch(() => {});
          return false;
        } else {
          set({ items: [item, ...items] });
          api.post(`/auth/wishlist/${item.productId || item.id}/toggle`).catch(() => {});
          return true;
        }
      },
      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id || i.productId === id);
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
      name: 'platform_user_wishlist',
    }
  )
);
