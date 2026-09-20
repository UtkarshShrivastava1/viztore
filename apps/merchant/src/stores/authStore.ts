import { create } from 'zustand';
import { IUser } from '@repo/shared-types';
import { api } from '../lib/api.js';

interface AuthState {
  user: IUser | null;
  currentStore: any | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: IUser, token: string, refreshToken?: string) => Promise<void>;
  setCurrentStore: (store: any) => void;
  fetchCurrentStore: () => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  currentStore: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: async (user, token, refreshToken) => {
    localStorage.setItem('access_token', token);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user_session', JSON.stringify(user));
    set({ user, accessToken: token, isAuthenticated: true });

    // Automatically fetch and attach the merchant's real store
    await get().fetchCurrentStore();
  },

  setCurrentStore: (store) => {
    if (store) {
      localStorage.setItem('current_store', JSON.stringify(store));
    } else {
      localStorage.removeItem('current_store');
    }
    set({ currentStore: store });
  },

  fetchCurrentStore: async () => {
    try {
      const stores = await api.get<any[]>('/stores/mine');
      if (Array.isArray(stores) && stores.length > 0) {
        const primaryStore = stores[0];
        localStorage.setItem('current_store', JSON.stringify(primaryStore));
        set({ currentStore: primaryStore });
      }
    } catch (err) {
      console.warn('Could not fetch merchant store from API:', err);
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_session');
    localStorage.removeItem('current_store');
    localStorage.removeItem('merchant_active_order_tab');
    set({ user: null, currentStore: null, accessToken: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user_session');
    const storedStore = localStorage.getItem('current_store');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser) as IUser;
        let currentStore = null;
        if (storedStore) {
          try {
            currentStore = JSON.parse(storedStore);
          } catch {
            // ignore
          }
        }
        set({ user, currentStore, accessToken: token, isAuthenticated: true });
        // Background refresh active store
        get().fetchCurrentStore();
      } catch {
        localStorage.clear();
      }
    }
  },
}));
