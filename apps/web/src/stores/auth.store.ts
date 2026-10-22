import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUserProfile } from '@repo/shared-types';

interface AuthState {
  user: IUserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'register';
  
  // Actions
  setAuth: (user: IUserProfile, token: string, refreshToken?: string) => void;
  setTokens: (token: string, refreshToken?: string) => void;
  logout: () => void;
  openAuthModal: (view?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  updateUser: (data: Partial<IUserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      authModalView: 'login',

      setAuth: (user, token, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
        }
        set({
          user,
          token,
          refreshToken: refreshToken || null,
          isAuthenticated: true,
          isAuthModalOpen: false,
        });
      },

      setTokens: (token, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
        }
        set((state) => ({
          token,
          refreshToken: refreshToken || state.refreshToken,
        }));
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('customer-auth-storage');
        }
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isAuthModalOpen: false,
        });
      },

      openAuthModal: (view = 'login') => {
        set({
          isAuthModalOpen: true,
          authModalView: view,
        });
      },

      closeAuthModal: () => {
        set({ isAuthModalOpen: false });
      },

      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'customer-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

