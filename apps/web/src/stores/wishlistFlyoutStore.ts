import { create } from 'zustand';

export interface IWishlistFlyoutItem {
  id: string;
  productId: string;
  title: string;
  storeName: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  selectedVariant?: string;
  availableVariants?: string[];
}

interface WishlistFlyoutState {
  items: IWishlistFlyoutItem[];
  addItem: (item: IWishlistFlyoutItem) => void;
  removeItem: (id: string) => void;
  updateVariant: (id: string, variant: string) => void;
  clearWishlist: () => void;
  setItems: (items: IWishlistFlyoutItem[]) => void;
}

export const useWishlistFlyoutStore = create<WishlistFlyoutState>((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    // Check if already in wishlist
    if (state.items.find((i) => i.id === item.id)) {
      return state;
    }
    return { items: [item, ...state.items] };
  }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  updateVariant: (id, variant) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, selectedVariant: variant } : item
      ),
    })),
  clearWishlist: () => set({ items: [] }),
  setItems: (items) => set({ items }),
}));
