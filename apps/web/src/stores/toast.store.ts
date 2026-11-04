import { create } from 'zustand';

export interface ToastItem {
  id: string;
  type: 'welcome' | 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  userName?: string;
  avatarInitial?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  showWelcomeToast: (params: {
    userName: string;
    email?: string;
    isNewUser?: boolean;
    onViewAccount?: () => void;
  }) => string;
  dismissToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  showToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastItem = {
      ...toast,
      id,
      duration: toast.duration ?? 4500,
    };

    set((state) => ({
      toasts: [...state.toasts.slice(-2), newToast], // Keep max 3 toasts at once
    }));

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().dismissToast(id);
      }, newToast.duration);
    }

    return id;
  },

  showWelcomeToast: ({ userName, email: _email, isNewUser, onViewAccount }) => {
    const cleanName = (userName || 'Shopper').trim();
    const firstName = cleanName.split(' ')[0] || cleanName;
    const initial = firstName.charAt(0).toUpperCase();

    return get().showToast({
      type: 'welcome',
      title: isNewUser
        ? `Welcome to the community, ${firstName}! 🎉`
        : `Welcome back, ${firstName}! 👋`,
      message: isNewUser
        ? 'Your account is ready. Discover fresh products & local stores near you!'
        : 'Signed in successfully. Explore verified shops and instant 3–4 km delivery.',
      userName: cleanName,
      avatarInitial: initial,
      duration: 5500,
      action: onViewAccount
        ? {
            label: 'My Account',
            onClick: onViewAccount,
          }
        : undefined,
    });
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },
}));
