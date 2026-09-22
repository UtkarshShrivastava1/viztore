import { create } from 'zustand';

export interface BusinessHours {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface DeliverySettings {
  estimatedTimeMin: number;
  estimatedTimeMax: number;
  minOrderValue: number;
  freeDeliveryThreshold: number;
  maxDeliveryRadiusKm: number;
  deliveryAreas: string[];
}

export interface StoreInfo {
  storeName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  address: string;
}

export interface StoreFeature {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  isActive: boolean;
}

export interface StoreVisibility {
  isOnline: boolean;
  pauseDuration?: string;
  pauseReason?: string;
}

export interface StorePageLayout {
  theme: 'modern' | 'classic' | 'grid';
  showCategoryTabs: boolean;
  showFeaturedBanner: boolean;
}

interface SettingsState {
  storeInfo: StoreInfo;
  bannerImage: {
    url: string;
    title: string;
    isActive: boolean;
  };
  storeFeatures: StoreFeature[];
  businessHours: BusinessHours[];
  deliverySettings: DeliverySettings;
  storeVisibility: StoreVisibility;
  storePageLayout: StorePageLayout;

  // Modals
  isBusinessHoursModalOpen: boolean;
  isDeliverySettingsModalOpen: boolean;
  isStoreVisibilityModalOpen: boolean;
  isStoreInfoModalOpen: boolean;

  // Actions
  updateStoreInfo: (info: Partial<StoreInfo>) => void;
  updateBannerImage: (banner: Partial<SettingsState['bannerImage']>) => void;
  updateBusinessHours: (hours: BusinessHours[]) => void;
  updateDeliverySettings: (delivery: Partial<DeliverySettings>) => void;
  updateStoreVisibility: (visibility: Partial<StoreVisibility>) => void;
  updateStoreFeatures: (features: StoreFeature[]) => void;
  updateStorePageLayout: (layout: Partial<StorePageLayout>) => void;

  openBusinessHoursModal: () => void;
  closeBusinessHoursModal: () => void;
  openDeliverySettingsModal: () => void;
  closeDeliverySettingsModal: () => void;
  openStoreVisibilityModal: () => void;
  closeStoreVisibilityModal: () => void;
  openStoreInfoModal: () => void;
  closeStoreInfoModal: () => void;
}

const initialBusinessHours: BusinessHours[] = [
  { day: 'Monday', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'Tuesday', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'Wednesday', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'Thursday', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'Friday', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'Saturday', isOpen: true, openTime: '09:00 AM', closeTime: '11:00 PM' },
  { day: 'Sunday', isOpen: true, openTime: '10:00 AM', closeTime: '11:00 PM' },
];

const initialStoreFeatures: StoreFeature[] = [
  {
    id: 'feat-1',
    title: 'Free Delivery',
    subtitle: 'Above ₹499',
    icon: 'truck',
    isActive: true,
  },
  {
    id: 'feat-2',
    title: 'Fast Delivery',
    subtitle: '30–40 mins',
    icon: 'zap',
    isActive: true,
  },
  {
    id: 'feat-3',
    title: 'Easy Returns',
    subtitle: '7 days return',
    icon: 'rotate-ccw',
    isActive: true,
  },
];

export const useSettingsStore = create<SettingsState>((set) => ({
  storeInfo: {
    storeName: 'Fashion Hub',
    tagline: 'Your style, your store',
    description: 'Premier apparel, footwear and accessories curated for modern lifestyles.',
    logoUrl: '',
    coverUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    phone: '+91 98765 43210',
    email: 'contact@fashionhub.com',
    rating: 4.6,
    reviewCount: 1245,
    address: '123, MG Road, Pune, Maharashtra - 411001',
  },

  bannerImage: {
    url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80',
    title: 'Summer Fashion Sale - Up to 50% Off',
    isActive: true,
  },

  storeFeatures: initialStoreFeatures,
  businessHours: initialBusinessHours,

  deliverySettings: {
    estimatedTimeMin: 30,
    estimatedTimeMax: 40,
    minOrderValue: 199,
    freeDeliveryThreshold: 499,
    maxDeliveryRadiusKm: 5,
    deliveryAreas: ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'C-Scheme'],
  },

  storeVisibility: {
    isOnline: true,
  },

  storePageLayout: {
    theme: 'modern',
    showCategoryTabs: true,
    showFeaturedBanner: true,
  },

  isBusinessHoursModalOpen: false,
  isDeliverySettingsModalOpen: false,
  isStoreVisibilityModalOpen: false,
  isStoreInfoModalOpen: false,

  updateStoreInfo: (info) =>
    set((state) => ({ storeInfo: { ...state.storeInfo, ...info } })),

  updateBannerImage: (banner) =>
    set((state) => ({ bannerImage: { ...state.bannerImage, ...banner } })),

  updateBusinessHours: (hours) => set({ businessHours: hours }),

  updateDeliverySettings: (delivery) =>
    set((state) => ({ deliverySettings: { ...state.deliverySettings, ...delivery } })),

  updateStoreVisibility: (visibility) =>
    set((state) => ({ storeVisibility: { ...state.storeVisibility, ...visibility } })),

  updateStoreFeatures: (features) => set({ storeFeatures: features }),

  updateStorePageLayout: (layout) =>
    set((state) => ({ storePageLayout: { ...state.storePageLayout, ...layout } })),

  openBusinessHoursModal: () => set({ isBusinessHoursModalOpen: true }),
  closeBusinessHoursModal: () => set({ isBusinessHoursModalOpen: false }),

  openDeliverySettingsModal: () => set({ isDeliverySettingsModalOpen: true }),
  closeDeliverySettingsModal: () => set({ isDeliverySettingsModalOpen: false }),

  openStoreVisibilityModal: () => set({ isStoreVisibilityModalOpen: true }),
  closeStoreVisibilityModal: () => set({ isStoreVisibilityModalOpen: false }),

  openStoreInfoModal: () => set({ isStoreInfoModalOpen: true }),
  closeStoreInfoModal: () => set({ isStoreInfoModalOpen: false }),
}));
