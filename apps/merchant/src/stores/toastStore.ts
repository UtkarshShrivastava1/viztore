import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastStoreState {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStoreState>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const duration = toast.duration ?? 4000;

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}));

// Ergonomic helper API for components and services
export const toast = {
  success: (title: string, message?: string, duration = 4000) =>
    useToastStore.getState().addToast({ type: 'success', title, message, duration }),

  error: (title: string, message?: string, duration = 5000) =>
    useToastStore.getState().addToast({ type: 'error', title, message, duration }),

  info: (title: string, message?: string, duration = 4000) =>
    useToastStore.getState().addToast({ type: 'info', title, message, duration }),

  warning: (title: string, message?: string, duration = 4500) =>
    useToastStore.getState().addToast({ type: 'warning', title, message, duration }),

  dismiss: (id: string) => useToastStore.getState().removeToast(id),
  clear: () => useToastStore.getState().clearToasts(),
};

