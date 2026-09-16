import { create } from 'zustand';

interface CatalogState {
  selectedCategory: string;
  selectedSubcategory: string | null;
  activeFilters: {
    sort: 'popularity' | 'nearest' | 'price_asc' | 'price_desc';
    size: string[];
    color: string[];
    brand: string[];
  };
  wishlistIds: string[];
  setSelectedCategory: (category: string) => void;
  setSelectedSubcategory: (sub: string | null) => void;
  toggleWishlist: (productId: string) => void;
  setSort: (sort: CatalogState['activeFilters']['sort']) => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  selectedCategory: 'mens-fashion',
  selectedSubcategory: null,
  activeFilters: {
    sort: 'popularity',
    size: [],
    color: [],
    brand: [],
  },
  wishlistIds: [],
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSelectedSubcategory: (sub) => set({ selectedSubcategory: sub }),
  toggleWishlist: (id) =>
    set((state) => ({
      wishlistIds: state.wishlistIds.includes(id)
        ? state.wishlistIds.filter((item) => item !== id)
        : [...state.wishlistIds, id],
    })),
  setSort: (sort) =>
    set((state) => ({ activeFilters: { ...state.activeFilters, sort } })),
}));
