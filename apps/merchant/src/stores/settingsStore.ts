import { create } from 'zustand';
import { storesApi } from '../lib/api.js';
import { useAuthStore } from './authStore.js';

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

// Section 4 Specification Interfaces
export interface StoreProfileSettings {
  storeDisplayName: string;
  primaryCategory: string;
  storeBio: string;
  logoUrl?: string;
  webBannerUrl?: string;
  mobileBannerUrl?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface BusinessTaxSettings {
  legalEntityName: string;
  panNumber: string;
  gstin: string;
  isGstinVerified: boolean;
  fssaiNumber?: string;
}

export interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface TimingsDeliverySettings {
  schedule: DaySchedule[];
  deliveryRadiusKm: number; // 3-4 km default
  minimumOrderValue: number;
  deliveryFee: number;
  freeDeliveryAbove?: number;
}

export interface BillingPreferencesSettings {
  invoicePrefix: string; // e.g. "INV-"
  nextInvoiceNumber: number;
  quotePrefix: string;   // e.g. "Q-"
  thermalFormat: '80mm' | '58mm' | 'a4';
  receiptFooterNote: string;
  termsAndConditions: string;
}

export interface TaxGstSettings {
  isTaxInclusive: boolean;
  defaultHsnCode: string;
  applicableGstSlabs: number[]; // [0, 5, 12, 18, 28]
  showTaxBreakdownOnBill: boolean;
}

export interface PaymentWalletSettings {
  autoSweepDaily: boolean;
  settlementAccount: {
    bankName: string;
    accountNumberMasked: string;
    ifscCode: string;
    isVerified: boolean;
  };
  settlementCycle: 'T+1' | 'T+2';
  upiId: string;
}

export interface ShippingReturnsSettings {
  acceptReturns: boolean;
  returnWindowHours: number; // 24, 48, 168
  conditions: string[];
}

export interface NotificationSettings {
  whatsappCustomerUpdates: boolean;
  merchantSmsAlerts: boolean;
  audioChimeEnabled: boolean;
  lowStockEmailThreshold: number;
  dailySalesEmail: boolean;
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

  // Unsaved changes tracking & backend persistence (AUDIT-057)
  isDirty: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  setIsDirty: (dirty: boolean) => void;
  markDirty: () => void;
  markClean: () => void;
  loadSettings: (storeId?: string) => Promise<void>;
  saveAllChanges: () => Promise<boolean>;
  discardAllChanges: () => void;
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

export const useSettingsStore = create<SettingsState>((set, get) => ({
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
    invoicePrefix: 'INV-',
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
    gstin: '22AAAAA0000A1Z5',
    isVerified: true,
    businessLegalName: 'Urban Vogue Studio Retail',
    tradeName: 'Urban Vogue Studio',
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
    nextPayoutDate: '03 Nov 2026',
    nextPayoutAmount: 18230,
    recentTransactions: [
      { id: 'tx-1', title: 'Order Payment Received', date: '31 Oct 2026, 10:24 AM', amount: 2450, type: 'credit' },
      { id: 'tx-2', title: 'Payout to Bank', date: '28 Oct 2026, 06:12 PM', amount: -18230, type: 'debit' },
      { id: 'tx-3', title: 'Order Payment Received', date: '26 Oct 2026, 03:40 PM', amount: 1980, type: 'credit' },
      { id: 'tx-4', title: 'Refund Processed', date: '24 Oct 2026, 11:20 AM', amount: -899, type: 'refund' },
      { id: 'tx-5', title: 'Order Payment Received', date: '22 Oct 2026, 09:15 AM', amount: 3299, type: 'credit' },
    ],
  },
  updatePaymentsWallet: (data) =>
    set((state) => ({ paymentsWallet: { ...state.paymentsWallet, ...data } })),

  shippingReturns: {
    serviceArea: 'Bhilai, Durg (Selected Areas)',
    deliveryPartner: 'Platform Fleet Delivery',
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
    email: 'merchant@example.com',
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

  // Unsaved changes tracking & live backend persistence (AUDIT-057)
  isDirty: false,
  isSaving: false,
  saveSuccess: false,
  saveError: null,
  setIsDirty: (dirty) => set({ isDirty: dirty }),
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),

  loadSettings: async (storeId?: string) => {
    try {
      const activeStore = useAuthStore.getState().currentStore;
      const activeUser = useAuthStore.getState().user;
      const targetId = storeId || activeStore?._id || activeStore?.id;
      if (!targetId) return;

      const res = await storesApi.getStoreSettings(targetId);
      if (res?.data) {
        const s = res.data;
        const defaultDayMap: Record<string, string> = {
          Monday: 'monday',
          Tuesday: 'tuesday',
          Wednesday: 'wednesday',
          Thursday: 'thursday',
          Friday: 'friday',
          Saturday: 'saturday',
          Sunday: 'sunday',
        };

        set((state) => ({
          storeProfile: {
            ...state.storeProfile,
            displayName: s.name || state.storeProfile.displayName,
            description: s.description || state.storeProfile.description,
            phone: s.phone || activeUser?.phone || state.storeProfile.phone,
            email: s.email || activeUser?.email || state.storeProfile.email,
            logoUrl: s.logoUrl || state.storeProfile.logoUrl,
            address: s.address?.street || state.storeProfile.address,
            city: s.address?.city || state.storeProfile.city,
            state: s.address?.state || state.storeProfile.state,
            pinCode: s.address?.pincode || state.storeProfile.pinCode,
          },
          businessInfo: {
            ...state.businessInfo,
            businessName: s.name || state.businessInfo.businessName,
            gstin: s.legalDetails?.gstin || state.businessInfo.gstin,
            isGstinVerified: Boolean(s.legalDetails?.isGstVerified ?? true),
            panNumber: s.legalDetails?.pan || state.businessInfo.panNumber,
            isPanVerified: Boolean(s.legalDetails?.pan),
            legalBusinessName: s.legalDetails?.legalBusinessName || s.name || state.businessInfo.legalBusinessName,
            city: s.address?.city || state.businessInfo.city,
            state: s.address?.state || state.businessInfo.state,
            pinCode: s.address?.pincode || state.businessInfo.pinCode,
          },
          taxGst: {
            ...state.taxGst,
            gstin: s.legalDetails?.gstin || state.businessInfo.gstin || state.taxGst.gstin,
            isVerified: Boolean(s.legalDetails?.isGstVerified ?? true),
            businessLegalName: s.legalDetails?.legalBusinessName || s.name || state.taxGst.businessLegalName,
            tradeName: s.name || state.taxGst.tradeName,
            registeredAddress: s.address
              ? `${s.address.street}, ${s.address.city}, ${s.address.state} - ${s.address.pincode}`
              : state.taxGst.registeredAddress,
            priceDisplay: s.settings?.tax?.isTaxInclusive ? 'including_tax' : 'excluding_tax',
            applyGstOnOrders: s.settings?.tax?.isTaxInclusive ?? true,
          },
          billingInvoicing: {
            ...state.billingInvoicing,
            invoicePrefix: s.settings?.billing?.invoicePrefix || state.billingInvoicing.invoicePrefix,
            startingNumber: String(s.settings?.billing?.nextInvoiceNumber || state.billingInvoicing.startingNumber || '1001'),
            invoiceFormat: s.settings?.billing?.thermalFormat === '58mm' ? 'simplified' : 'standard',
            invoiceNotes: s.settings?.billing?.termsAndConditions || state.billingInvoicing.invoiceNotes,
          },
          storeTimings: {
            hours: s.operatingHours
              ? defaultHours.map((dh) => {
                  const key = defaultDayMap[dh.day];
                  const backendDay = key ? (s.operatingHours as any)[key] : null;
                  if (backendDay) {
                    return {
                      day: dh.day,
                      isOpen: backendDay.isOpen ?? dh.isOpen,
                      openTime: backendDay.open || dh.openTime,
                      closeTime: backendDay.close || dh.closeTime,
                    };
                  }
                  return dh;
                })
              : state.storeTimings.hours,
            inStorePickup: true,
            localDelivery: true,
          },
          shippingReturns: {
            ...state.shippingReturns,
            allowReturns: s.settings?.shipping?.acceptReturns ?? true,
            returnWindow: s.settings?.shipping?.returnWindowHours === 168 ? '7 days' : s.settings?.shipping?.returnWindowHours === 360 ? '15 days' : '3 days',
          },
          notifications: {
            ...state.notifications,
            orderStatusUpdates: s.settings?.notifications?.whatsappCustomerUpdates ?? true,
            newOrderReceived: s.settings?.notifications?.merchantSmsAlerts ?? true,
            importantAnnouncements: s.settings?.notifications?.dailySalesEmail ?? true,
          },
          securityLogin: {
            ...state.securityLogin,
            email: activeUser?.email || state.securityLogin.email,
            phone: activeUser?.phone || state.securityLogin.phone,
          },
          storeInfo: {
            ...state.storeInfo,
            storeName: s.name || state.storeInfo.storeName,
            description: s.description || state.storeInfo.description,
            phone: s.phone || activeUser?.phone || state.storeInfo.phone,
            email: s.email || activeUser?.email || state.storeInfo.email,
            logoUrl: s.logoUrl || state.storeInfo.logoUrl,
            address: s.address
              ? `${s.address.street}, ${s.address.city}, ${s.address.state} - ${s.address.pincode}`
              : state.storeInfo.address,
          },
          isDirty: false,
        }));
      }
    } catch (err) {
      console.warn('Failed to load store settings from API, using cached state:', err);
    }
  },

  saveAllChanges: async () => {
    const state = get();
    set({ isSaving: true, saveError: null });

    try {
      const store = useAuthStore.getState().currentStore;
      const storeId = store?._id || store?.id;
      if (!storeId) {
        set({ isSaving: false, isDirty: false, saveSuccess: true });
        setTimeout(() => set({ saveSuccess: false }), 3000);
        return true;
      }

      const defaultDayMap: Record<string, string> = {
        Monday: 'monday',
        Tuesday: 'tuesday',
        Wednesday: 'wednesday',
        Thursday: 'thursday',
        Friday: 'friday',
        Saturday: 'saturday',
        Sunday: 'sunday',
      };

      const operatingHours: any = {};
      state.storeTimings.hours.forEach((h) => {
        const key = defaultDayMap[h.day];
        if (key) {
          operatingHours[key] = {
            isOpen: h.isOpen,
            open: h.openTime,
            close: h.closeTime,
          };
        }
      });

      const payload = {
        name: state.storeProfile.displayName || state.storeInfo.storeName,
        description: state.storeProfile.description || state.storeInfo.description,
        phone: state.storeProfile.phone || state.storeInfo.phone,
        email: state.storeProfile.email || state.storeInfo.email,
        logoUrl: state.storeProfile.logoUrl || state.storeInfo.logoUrl,
        bannerUrl: state.bannerImage.url,
        operatingHours,
        address: {
          street: state.storeProfile.address || state.storeInfo.address,
          city: state.storeProfile.city || state.businessInfo.city || 'Bhilai',
          state: state.storeProfile.state || state.businessInfo.state || 'Chhattisgarh',
          pincode: state.storeProfile.pinCode || state.businessInfo.pinCode || '490023',
        },
        legalDetails: {
          gstin: state.businessInfo.gstin || state.taxGst.gstin,
          pan: state.businessInfo.panNumber,
          legalBusinessName: state.businessInfo.legalBusinessName || state.taxGst.businessLegalName || state.businessInfo.businessName,
          isGstVerified: state.businessInfo.isGstinVerified || state.taxGst.isVerified,
        },
        bankDetails: {
          accountNumber: state.paymentsWallet.bankAccount,
          isVerified: true,
        },
        settings: {
          billing: {
            invoicePrefix: state.billingInvoicing.invoicePrefix,
            nextInvoiceNumber: parseInt(state.billingInvoicing.startingNumber || '1001', 10),
            thermalFormat: state.billingInvoicing.invoiceFormat === 'simplified' ? '58mm' : '80mm',
            termsAndConditions: state.billingInvoicing.invoiceNotes,
          },
          tax: {
            isTaxInclusive: state.taxGst.priceDisplay === 'including_tax',
            applicableGstSlabs: [0, 5, 12, 18, 28],
            showTaxBreakdownOnBill: true,
          },
          payments: {
            settlementCycle: state.paymentsWallet.payoutFrequency.includes('Daily') ? 'T+1' : 'T+2',
            upiId: state.paymentsWallet.acceptUpi ? 'merchant@upi' : '',
          },
          shipping: {
            acceptReturns: state.shippingReturns.allowReturns,
            returnWindowHours: state.shippingReturns.returnWindow.includes('7') ? 168 : state.shippingReturns.returnWindow.includes('15') ? 360 : 48,
          },
          notifications: {
            whatsappCustomerUpdates: state.notifications.orderStatusUpdates,
            merchantSmsAlerts: state.notifications.newOrderReceived,
            audioChimeEnabled: true,
            dailySalesEmail: state.notifications.importantAnnouncements,
          },
        },
      };

      const res = await storesApi.updateStoreSettings(storeId, payload);
      if (res?.data) {
        useAuthStore.getState().setCurrentStore({
          ...store,
          ...res.data,
        });
      }

      set({ isSaving: false, isDirty: false, saveSuccess: true });
      setTimeout(() => {
        set({ saveSuccess: false });
      }, 3000);
      return true;
    } catch (err: any) {
      set({
        isSaving: false,
        saveError: err?.message || 'Failed to save settings',
      });
      return false;
    }
  },

  discardAllChanges: () => {
    const store = useAuthStore.getState().currentStore;
    if (store) {
      set((state) => ({
        storeProfile: {
          ...state.storeProfile,
          displayName: store.name || state.storeProfile.displayName,
          description: store.description || state.storeProfile.description,
          phone: store.phone || state.storeProfile.phone,
          email: store.email || state.storeProfile.email,
        },
        isDirty: false,
        saveSuccess: false,
        saveError: null,
      }));
    } else {
      set({ isDirty: false, saveSuccess: false, saveError: null });
    }
  },
}));
