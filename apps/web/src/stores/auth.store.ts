import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUserProfile } from '@repo/shared-types';

interface AuthState {
  user: IUserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'register';
  
  // Actions
  setAuth: (user: IUserProfile, token: string) => void;
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
      isAuthenticated: false,
      isAuthModalOpen: false,
      authModalView: 'login',

      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        set({
          user,
          token,
          isAuthenticated: true,
          isAuthModalOpen: false,
        });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
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
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
