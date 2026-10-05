import { create } from 'zustand';

export type SettingsSubTab =
  | 'store_profile'
  | 'business_info'
  | 'timings_pickup'
  | 'billing_invoicing'
  | 'tax_gst'
  | 'payments_wallet'
  | 'shipping_returns'
  | 'notifications'
  | 'security_login';

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

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  time: string;
  isCurrent: boolean;
}

export interface AccountActivity {
  id: string;
  dateTime: string;
  device: string;
  location: string;
  status: 'Success' | 'Failed';
}

export interface RecentTransaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit' | 'refund';
}

export interface SettingsState {
  activeSubTab: SettingsSubTab;
  setActiveSubTab: (tab: SettingsSubTab) => void;

  // 14.0 Store Profile
  storeProfile: {
    displayName: string;
    description: string;
    phone: string;
    isPhoneVerified: boolean;
    email: string;
    isEmailVerified: boolean;
    websiteUrl: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    logoUrl: string;
  };
  updateStoreProfile: (data: Partial<SettingsState['storeProfile']>) => void;

  // 14.1 Business Information
  businessInfo: {
    businessName: string;
    businessType: string;
    gstin: string;
    isGstinVerified: boolean;
    panNumber: string;
    isPanVerified: boolean;
    legalBusinessName: string;
    primaryCategory: string;
    subCategory: string;
    shopBuildingFloor: string;
    roadAreaColony: string;
    landmark: string;
    city: string;
    state: string;
    pinCode: string;
  };
  updateBusinessInfo: (data: Partial<SettingsState['businessInfo']>) => void;

  // 14.2 Store Timings & Pickup
  storeTimings: {
    hours: BusinessHours[];
    inStorePickup: boolean;
    localDelivery: boolean;
  };
  updateStoreTimings: (data: Partial<SettingsState['storeTimings']>) => void;

  // 14.3 Billing & Invoicing
  billingInvoicing: {
    invoicePrefix: string;
    startingNumber: string;
    invoiceFormat: 'standard' | 'simplified';
    invoiceLanguage: string;
    currency: string;
    autoGenerateInvoice: boolean;
    sendViaEmail: boolean;
    sendViaWhatsApp: boolean;
    invoiceNotes: string;
  };
  updateBillingInvoicing: (data: Partial<SettingsState['billingInvoicing']>) => void;

  // 14.4 Tax & GST
  taxGst: {
    gstin: string;
    isVerified: boolean;
    businessLegalName: string;
    tradeName: string;
    registrationType: string;
    registeredAddress: string;
    applyGstOnOrders: boolean;
    priceDisplay: 'excluding_tax' | 'including_tax';
    defaultGstRate: string;
    applyDifferentGstRates: boolean;
  };
  updateTaxGst: (data: Partial<SettingsState['taxGst']>) => void;

  // 14.5 Payments & Wallet
  paymentsWallet: {
    acceptCards: boolean;
    acceptUpi: boolean;
    acceptWallet: boolean;
    bankAccount: string;
    payoutFrequency: string;
    notifyPaymentReceived: boolean;
    notifyPayoutUpdates: boolean;
    walletBalance: number;
    nextPayoutDate: string;
    nextPayoutAmount: number;
    recentTransactions: RecentTransaction[];
  };
  updatePaymentsWallet: (data: Partial<SettingsState['paymentsWallet']>) => void;

  // 14.6 Shipping & Returns
  shippingReturns: {
    serviceArea: string;
    deliveryPartner: string;
    estimatedDeliveryTime: string;
    enableDelivery: boolean;
    allowReturns: boolean;
    returnWindow: string;
  };
  updateShippingReturns: (data: Partial<SettingsState['shippingReturns']>) => void;

  // 14.7 Notifications
  notifications: {
    newOrderReceived: boolean;
    orderStatusUpdates: boolean;
    orderCancellations: boolean;
    paymentReceived: boolean;
    payoutUpdates: boolean;
    refundProcessed: boolean;
    productUpdates: boolean;
    importantAnnouncements: boolean;
  };
  updateNotifications: (data: Partial<SettingsState['notifications']>) => void;

  // 14.8 Security & Login
  securityLogin: {
    email: string;
    isEmailVerified: boolean;
    phone: string;
    isPhoneVerified: boolean;
    sessions: ActiveSession[];
    activities: AccountActivity[];
  };
  updateSecurityLogin: (data: Partial<SettingsState['securityLogin']>) => void;
  terminateSession: (id: string) => void;

  // Legacy / Modal compatibility
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
  isBusinessHoursModalOpen: boolean;
  isDeliverySettingsModalOpen: boolean;
  isStoreVisibilityModalOpen: boolean;
  isStoreInfoModalOpen: boolean;

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

const defaultHours: BusinessHours[] = [
  { day: 'Monday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
  { day: 'Tuesday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
  { day: 'Wednesday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
  { day: 'Thursday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
  { day: 'Friday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
  { day: 'Saturday', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'Sunday', isOpen: false, openTime: 'Closed', closeTime: 'Closed' },
];

export const useSettingsStore = create<SettingsState>((set) => ({
  activeSubTab: 'store_profile',
  setActiveSubTab: (tab) => set({ activeSubTab: tab }),

  storeProfile: {
    displayName: 'Fashion Hub',
    description: 'Trendy fashion for everyday style. Explore our latest collection of apparel, footwear, accessories and more.',
    phone: '+91 98765 43210',
    isPhoneVerified: true,
    email: 'fashionhub@gmail.com',
    isEmailVerified: true,
    websiteUrl: 'https://www.instagram.com/fashionhub',
    address: 'Shop No. 12, City Mall, Supela, Bhilai',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pinCode: '490023',
    logoUrl: '',
  },
  updateStoreProfile: (data) =>
    set((state) => ({ storeProfile: { ...state.storeProfile, ...data } })),

  businessInfo: {
    businessName: 'Fashion Hub',
    businessType: 'Proprietorship',
    gstin: '22AAAAA0000A1Z5',
    isGstinVerified: true,
    panNumber: 'AAAAA0000A',
    isPanVerified: true,
    legalBusinessName: 'Fashion Hub Enterprises',
    primaryCategory: 'Apparel & Fashion',
    subCategory: "Men's Fashion",
    shopBuildingFloor: 'Shop No. 12, City Mall, 2nd Floor',
    roadAreaColony: 'Supela Main Road, Supela',
    landmark: 'Opp. City Mall',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pinCode: '490023',
  },
  updateBusinessInfo: (data) =>
    set((state) => ({ businessInfo: { ...state.businessInfo, ...data } })),

  storeTimings: {
    hours: defaultHours,
    inStorePickup: true,
    localDelivery: false,
  },
  updateStoreTimings: (data) =>
    set((state) => ({ storeTimings: { ...state.storeTimings, ...data } })),

  billingInvoicing: {
    invoicePrefix: 'VZ',
    startingNumber: '1001',
    invoiceFormat: 'standard',
    invoiceLanguage: 'English',
    currency: 'INR (₹)',
    autoGenerateInvoice: true,
    sendViaEmail: true,
    sendViaWhatsApp: true,
    invoiceNotes: 'Thank you for shopping with us!',
  },
  updateBillingInvoicing: (data) =>
    set((state) => ({ billingInvoicing: { ...state.billingInvoicing, ...data } })),

  taxGst: {
    gstin: '22ABCDE1234F1Z5',
    isVerified: true,
    businessLegalName: 'Fashion Hub',
    tradeName: 'Fashion Hub',
    registrationType: 'Regular',
    registeredAddress: 'Shop No. 12, City Mall, Supela, Bhilai, Chhattisgarh - 490023',
    applyGstOnOrders: true,
    priceDisplay: 'excluding_tax',
    defaultGstRate: '18% (Standard Rate)',
    applyDifferentGstRates: false,
  },
  updateTaxGst: (data) =>
    set((state) => ({ taxGst: { ...state.taxGst, ...data } })),

  paymentsWallet: {
    acceptCards: true,
    acceptUpi: true,
    acceptWallet: true,
    bankAccount: 'HDFC Bank - 1234',
    payoutFrequency: 'Weekly (Every Monday)',
    notifyPaymentReceived: true,
    notifyPayoutUpdates: true,
    walletBalance: 32450,
    nextPayoutDate: '25 May 2024',
    nextPayoutAmount: 18230,
    recentTransactions: [
      { id: 'tx-1', title: 'Order Payment Received', date: '18 May 2024, 10:24 AM', amount: 2450, type: 'credit' },
      { id: 'tx-2', title: 'Payout to Bank', date: '15 May 2024, 06:12 PM', amount: -18230, type: 'debit' },
      { id: 'tx-3', title: 'Order Payment Received', date: '14 May 2024, 03:40 PM', amount: 1980, type: 'credit' },
      { id: 'tx-4', title: 'Refund Processed', date: '12 May 2024, 11:20 AM', amount: -899, type: 'refund' },
      { id: 'tx-5', title: 'Order Payment Received', date: '10 May 2024, 09:15 AM', amount: 3299, type: 'credit' },
    ],
  },
  updatePaymentsWallet: (data) =>
    set((state) => ({ paymentsWallet: { ...state.paymentsWallet, ...data } })),

  shippingReturns: {
    serviceArea: 'Bhilai, Durg (Selected Areas)',
    deliveryPartner: 'Viztore Delivery',
    estimatedDeliveryTime: '30 - 45 minutes',
    enableDelivery: true,
    allowReturns: true,
    returnWindow: '7 days',
  },
  updateShippingReturns: (data) =>
    set((state) => ({ shippingReturns: { ...state.shippingReturns, ...data } })),

  notifications: {
    newOrderReceived: true,
    orderStatusUpdates: true,
    orderCancellations: true,
    paymentReceived: true,
    payoutUpdates: true,
    refundProcessed: true,
    productUpdates: true,
    importantAnnouncements: true,
  },
  updateNotifications: (data) =>
    set((state) => ({ notifications: { ...state.notifications, ...data } })),

  securityLogin: {
    email: 'harish@viztore.com',
    isEmailVerified: true,
    phone: '+91 98765 43210',
    isPhoneVerified: true,
    sessions: [
      { id: 'sess-1', device: 'Windows · Chrome', location: 'Bhilai, Chhattisgarh, India', time: '12 Sep 2026, 11:45 AM', isCurrent: true },
      { id: 'sess-2', device: 'iPhone · Safari', location: 'Raipur, Chhattisgarh, India', time: '10 Sep 2026, 09:20 PM', isCurrent: false },
    ],
    activities: [
      { id: 'act-1', dateTime: '12 Sep 2026, 11:45 AM', device: 'Windows · Chrome', location: 'Bhilai, Chhattisgarh', status: 'Success' },
      { id: 'act-2', dateTime: '10 Sep 2026, 09:20 PM', device: 'iPhone · Safari', location: 'Raipur, Chhattisgarh', status: 'Success' },
    ],
  },
  updateSecurityLogin: (data) =>
    set((state) => ({ securityLogin: { ...state.securityLogin, ...data } })),
  terminateSession: (id) =>
    set((state) => ({
      securityLogin: {
        ...state.securityLogin,
        sessions: state.securityLogin.sessions.filter((s) => s.id !== id),
      },
    })),

  // Legacy compatibility
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
    address: 'Shop No. 12, City Mall, Supela, Bhilai, Chhattisgarh - 490023',
  },
  bannerImage: {
    url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80',
    title: 'Summer Fashion Sale - Up to 50% Off',
    isActive: true,
  },
  storeFeatures: [
    { id: 'feat-1', title: 'Free Delivery', subtitle: 'Above ₹499', icon: 'truck', isActive: true },
    { id: 'feat-2', title: 'Fast Delivery', subtitle: '30–40 mins', icon: 'zap', isActive: true },
    { id: 'feat-3', title: 'Easy Returns', subtitle: '7 days return', icon: 'rotate-ccw', isActive: true },
  ],
  businessHours: defaultHours,
  deliverySettings: {
    estimatedTimeMin: 30,
    estimatedTimeMax: 45,
    minOrderValue: 199,
    freeDeliveryThreshold: 499,
    maxDeliveryRadiusKm: 5,
    deliveryAreas: ['Bhilai', 'Durg', 'Supela', 'Nehru Nagar'],
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
