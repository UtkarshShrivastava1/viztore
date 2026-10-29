import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IStore } from '@repo/shared-types';
import { api } from '@/lib/api';

interface FavoriteStoresState {
  favoriteStoreIds: string[];
  favoriteStores: IStore[];
  isLoading: boolean;
  isFavorite: (storeId: string) => boolean;
  toggleFavorite: (store: IStore) => Promise<boolean>;
  fetchFavorites: () => Promise<void>;
  setFavorites: (stores: IStore[]) => void;
}

export const useFavoriteStoresStore = create<FavoriteStoresState>()(
  persist(
    (set, get) => ({
      favoriteStoreIds: [],
      favoriteStores: [],
      isLoading: false,

      isFavorite: (storeId: string) => {
        if (!storeId) return false;
        return get().favoriteStoreIds.includes(storeId);
      },

      toggleFavorite: async (store: IStore) => {
        const storeId = store._id || (store as any).id || store.slug;
        if (!storeId) return false;

        const currentIds = get().favoriteStoreIds;
        const currentStores = get().favoriteStores;
        const exists = currentIds.includes(storeId);

        let newIds: string[];
        let newStores: IStore[];

        if (exists) {
          newIds = currentIds.filter((id) => id !== storeId && id !== store.slug && id !== store._id);
          newStores = currentStores.filter((s) => (s._id || (s as any).id || s.slug) !== storeId);
        } else {
          newIds = [storeId, ...currentIds];
          newStores = [store, ...currentStores];
        }

        set({ favoriteStoreIds: newIds, favoriteStores: newStores });

        // Sync with backend if token exists
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
          if (token && store._id) {
            await api.post(`/auth/favorite-stores/${store._id}/toggle`);
          }
        } catch (err) {
          console.warn('Backend sync for favorite store failed (local state retained):', err);
        }

        return !exists;
      },

      fetchFavorites: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (!token) return;

        set({ isLoading: true });
        try {
          const res = await api.get<IStore[]>('/auth/favorite-stores');
          if (Array.isArray(res)) {
            const ids = res.map((s) => s._id || (s as any).id || s.slug).filter(Boolean);
            set({ favoriteStores: res, favoriteStoreIds: ids, isLoading: false });
          } else if (res && Array.isArray((res as any).data)) {
            const list = (res as any).data;
            const ids = list.map((s: any) => s._id || s.id || s.slug).filter(Boolean);
            set({ favoriteStores: list, favoriteStoreIds: ids, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      setFavorites: (stores: IStore[]) => {
        const ids = stores.map((s) => s._id || (s as any).id || s.slug).filter(Boolean);
        set({ favoriteStores: stores, favoriteStoreIds: ids });
      },
    }),
    {
      name: 'platform_favorite_stores',
      partialize: (state) => ({
        favoriteStoreIds: state.favoriteStoreIds,
        favoriteStores: state.favoriteStores,
      }),
    }
  )
);

