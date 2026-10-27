import { create } from 'zustand';

export type MarketingSubTab =
  | 'overview'
  | 'advertisements'
  | 'discounts_coupons'
  | 'campaigns'
  | 'discounts'
  | 'coupons'
  | 'push'
  | 'email_sms'
  | 'loyalty'
  | 'social'
  | 'analytics';

export type AdType =
  | 'Sponsored Product'
  | 'Sponsored Store'
  | 'Category Promotion'
  | 'Best Deals'
  | 'Best Deals Promotion'
  | 'Banner Advertisement'
  | 'Banner Ad';

export type AdStatus = 'Active' | 'Paused' | 'Scheduled' | 'Completed' | 'Ended' | 'Inactive';

export interface AdvertisementItem {
  id: string;
  name: string;
  subtitle: string;
  type: AdType;
  duration: string;
  amount: number;
  budgetDaily: number;
  totalSpend: number;
  revenueGenerated: number;
  impressions: number;
  clicks: number;
  ctr: number;
  roas: number;
  startDate: string;
  endDate: string;
  status: AdStatus;
  views: number | null;
  imageUrl: string;
  targetId?: string;
  targetName?: string;
}

export type Advertisement = AdvertisementItem;

export interface DraftAd {
  type: AdType;
  productId: string;
  productName: string;
  productSku: string;
  productPrice: number;
  productRating: number;
  productReviews: number;
  productCategory: string;
  productSubcategory: string;
  productType: string;
  productImage: string;
  planDuration: '3 Days' | '7 Days' | '15 Days' | '30 Days';
  pricePerDay: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
  message: string;
  paymentMethod: 'wallet' | 'upi' | 'card';
  agreeTerms: boolean;
  biddingMode?: 'auto' | 'manual';
  cpcBid?: number;
  targetEntityName?: string;
}

export type CouponType = 'Percentage' | 'Free Shipping' | 'Fixed Amount' | 'BOGO';
export type CouponStatus = 'Active' | 'Paused' | 'Scheduled' | 'Completed' | 'Expired';

export interface CouponItem {
  id: string;
  code: string;
  title: string;
  name: string;
  description: string;
  type: CouponType;
  discountType: 'percentage' | 'fixed' | 'free_shipping' | 'bogo';
  discountValue: number;
  maxDiscount: number;
  minOrderValue: number;
  benefit: string;
  applicableOn: string;
  applicableIds?: string[];
  startDate: string;
  endDate: string;
  usedCount: number;
  usageCount: number;
  totalLimit: number;
  usageLimit: number;
  status: CouponStatus;
  isActive: boolean;
  // Legacy aliases
  couponType?: any;
  discountBenefit?: string;
  validity?: string;
}

export type Coupon = CouponItem;

export interface DraftCoupon {
  code: string;
  name: string;
  description: string;
  discountType: 'Percentage' | 'Fixed Amount' | 'Free Shipping';
  discountValue: number;
  maxDiscount: number;
  minOrderValue: number;
  usageLimit: 'Limited' | 'Unlimited';
  maxUsage: number;
  applicableOn: 'All Products' | 'Selected Products' | 'Selected Categories';
  selectedProductIds: string[];
  selectedCategoryIds: string[];
  startDate: string;
  endDate: string;
  showOnStore: boolean;
  multiplePerCustomer: boolean;
  combineOffers: boolean;
  confirmed: boolean;
}

// Legacy types for compatibility
export type Campaign = any;
export type DiscountOffer = any;
export type OfferType = any;

// Initial Advertisements matching 12.0.png & 12.1.png
export const initialAds: AdvertisementItem[] = [
  {
    id: 'CMP-2024-001',
    name: 'Men Solid Cotton Shirt',
    subtitle: 'Product: Blue, M',
    type: 'Sponsored Product',
    duration: '7 Days',
    amount: 1499,
    budgetDaily: 214,
    totalSpend: 1499,
    revenueGenerated: 5840,
    impressions: 12450,
    clicks: 498,
    ctr: 4.0,
    roas: 3.9,
    startDate: '10 May 2024',
    endDate: '17 May 2024',
    status: 'Active',
    views: 12450,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80',
    targetId: 'PRD-10245',
    targetName: 'Men Solid Cotton Shirt',
  },
  {
    id: 'CMP-2024-002',
    name: 'Fashion Hub Store',
    subtitle: 'Store Promotion',
    type: 'Sponsored Store',
    duration: '15 Days',
    amount: 2999,
    budgetDaily: 200,
    totalSpend: 2999,
    revenueGenerated: 11400,
    impressions: 24300,
    clicks: 910,
    ctr: 3.74,
    roas: 3.8,
    startDate: '08 May 2024',
    endDate: '23 May 2024',
    status: 'Active',
    views: 24300,
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&auto=format&fit=crop&q=80',
    targetId: 'STR-001',
    targetName: 'Fashion Hub Store',
  },
  {
    id: 'CMP-2024-003',
    name: "Men's Fashion",
    subtitle: 'Category: Men',
    type: 'Category Promotion',
    duration: '7 Days',
    amount: 1999,
    budgetDaily: 285,
    totalSpend: 0,
    revenueGenerated: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    roas: 0,
    startDate: '12 May 2024',
    endDate: '19 May 2024',
    status: 'Scheduled',
    views: null,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
    targetId: 'CAT-MEN',
    targetName: "Men's Fashion",
  },
  {
    id: 'CMP-2024-004',
    name: 'Weekend Sale',
    subtitle: 'Offer Promotion',
    type: 'Best Deals',
    duration: '3 Days',
    amount: 999,
    budgetDaily: 333,
    totalSpend: 999,
    revenueGenerated: 3490,
    impressions: 9860,
    clicks: 376,
    ctr: 3.81,
    roas: 3.5,
    startDate: '15 May 2024',
    endDate: '18 May 2024',
    status: 'Active',
    views: 9860,
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&auto=format&fit=crop&q=80',
    targetId: 'OFR-WEEKEND',
    targetName: 'Weekend Sale',
  },
  {
    id: 'CMP-2024-005',
    name: 'Summer Banner',
    subtitle: 'Homepage Banner',
    type: 'Banner Advertisement',
    duration: '15 Days',
    amount: 2499,
    budgetDaily: 166,
    totalSpend: 2499,
    revenueGenerated: 8950,
    impressions: 32100,
    clicks: 1240,
    ctr: 3.86,
    roas: 3.58,
    startDate: '05 May 2024',
    endDate: '20 May 2024',
    status: 'Completed',
    views: 32100,
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=120&auto=format&fit=crop&q=80',
    targetId: 'BNR-SUMMER',
    targetName: 'Summer Banner',
  },
  {
    id: 'CMP-2024-006',
    name: 'Running Shoes',
    subtitle: 'Product: Red, 8',
    type: 'Sponsored Product',
    duration: '7 Days',
    amount: 1299,
    budgetDaily: 185,
    totalSpend: 1299,
    revenueGenerated: 4800,
    impressions: 18760,
    clicks: 664,
    ctr: 3.54,
    roas: 3.7,
    startDate: '18 May 2024',
    endDate: '25 May 2024',
    status: 'Active',
    views: 18760,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80',
    targetId: 'PRD-10289',
    targetName: 'Running Shoes',
  },
  {
    id: 'CMP-2024-007',
    name: 'Kids World Store',
    subtitle: 'Store Promotion',
    type: 'Sponsored Store',
    duration: '15 Days',
    amount: 2999,
    budgetDaily: 200,
    totalSpend: 0,
    revenueGenerated: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    roas: 0,
    startDate: '20 May 2024',
    endDate: '04 Jun 2024',
    status: 'Scheduled',
    views: null,
    imageUrl: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=120&auto=format&fit=crop&q=80',
    targetId: 'STR-002',
    targetName: 'Kids World Store',
  },
];

// Initial Coupons matching 12.0.png & 12.7.png
export const initialCoupons: CouponItem[] = [
  {
    id: 'CPN-001',
    code: 'SUMMER20',
    title: 'Summer Sale - 20% Off',
    name: 'Summer Sale - 20% Off',
    description: 'Get 20% off on your favorite fashion styles this summer!',
    type: 'Percentage',
    discountType: 'percentage',
    discountValue: 20,
    maxDiscount: 1000,
    minOrderValue: 999,
    benefit: '20% OFF Max ₹1,000',
    applicableOn: 'All Products',
    startDate: '10 May 2024',
    endDate: '20 May 2024',
    usedCount: 320,
    usageCount: 320,
    totalLimit: 1000,
    usageLimit: 1000,
    status: 'Active',
    isActive: true,
  },
  {
    id: 'CPN-002',
    code: 'WEEKEND100',
    title: 'Weekend Special',
    name: 'Weekend Special',
    description: 'Special flat ₹100 discount on weekend orders above ₹999.',
    type: 'Fixed Amount',
    discountType: 'fixed',
    discountValue: 100,
    maxDiscount: 100,
    minOrderValue: 999,
    benefit: '₹100 OFF Min. order ₹999',
    applicableOn: 'All Products',
    startDate: '11 May 2024',
    endDate: '12 May 2024',
    usedCount: 560,
    usageCount: 560,
    totalLimit: 2000,
    usageLimit: 2000,
    status: 'Active',
    isActive: true,
  },
  {
    id: 'CPN-003',
    code: 'FREDEL499',
    title: 'Free Delivery Offer',
    name: 'Free Delivery Offer',
    description: 'Enjoy zero delivery fees on all orders exceeding ₹499.',
    type: 'Free Shipping',
    discountType: 'free_shipping',
    discountValue: 0,
    maxDiscount: 100,
    minOrderValue: 499,
    benefit: 'Free Shipping Min. order ₹499',
    applicableOn: 'All Products',
    startDate: '18 May 2024',
    endDate: '25 May 2024',
    usedCount: 185,
    usageCount: 185,
    totalLimit: 500,
    usageLimit: 500,
    status: 'Active',
    isActive: true,
  },
  {
    id: 'CPN-004',
    code: 'WELCOME15',
    title: 'New User Offer',
    name: 'New User Offer',
    description: 'Welcome discount for new shoppers signing up this week.',
    type: 'Percentage',
    discountType: 'percentage',
    discountValue: 15,
    maxDiscount: 750,
    minOrderValue: 499,
    benefit: '15% OFF Max ₹750',
    applicableOn: 'New Users',
    startDate: '06 May 2024',
    endDate: '07 May 2024',
    usedCount: 210,
    usageCount: 210,
    totalLimit: 1000,
    usageLimit: 1000,
    status: 'Completed',
    isActive: false,
  },
  {
    id: 'CPN-005',
    code: 'FASHION50',
    title: 'Fashion Festival',
    name: 'Fashion Festival',
    description: 'Mega festival savings up to ₹2,000 across trending apparel.',
    type: 'Percentage',
    discountType: 'percentage',
    discountValue: 50,
    maxDiscount: 2000,
    minOrderValue: 1499,
    benefit: '50% OFF Max ₹2,000',
    applicableOn: 'Selected Products',
    startDate: '01 May 2024',
    endDate: '31 May 2024',
    usedCount: 98,
    usageCount: 98,
    totalLimit: 500,
    usageLimit: 500,
    status: 'Active',
    isActive: true,
  },
  {
    id: 'CPN-006',
    code: 'MENS100',
    title: "Men's Collection Offer",
    name: "Men's Collection Offer",
    description: 'Exclusive ₹100 off on our fresh spring men collection.',
    type: 'Fixed Amount',
    discountType: 'fixed',
    discountValue: 100,
    maxDiscount: 100,
    minOrderValue: 799,
    benefit: '₹100 OFF Min. order ₹799',
    applicableOn: 'Men Category',
    startDate: '12 May 2024',
    endDate: '22 May 2024',
    usedCount: 46,
    usageCount: 46,
    totalLimit: 300,
    usageLimit: 300,
    status: 'Active',
    isActive: true,
  },
  {
    id: 'CPN-007',
    code: 'BOGO',
    title: 'Buy 1 Get 1 Free',
    name: 'Buy 1 Get 1 Free',
    description: 'Buy one eligible item and receive the second one free.',
    type: 'BOGO',
    discountType: 'bogo',
    discountValue: 100,
    maxDiscount: 1500,
    minOrderValue: 0,
    benefit: 'Buy 1 Get 1 Free',
    applicableOn: 'Selected Products',
    startDate: '20 May 2024',
    endDate: '30 May 2024',
    usedCount: 12,
    usageCount: 12,
    totalLimit: 200,
    usageLimit: 200,
    status: 'Scheduled',
    isActive: false,
  },
  {
    id: 'CPN-008',
    code: 'CLEARANCE30',
    title: 'Clearance Sale',
    name: 'Clearance Sale',
    description: 'End-of-season clearance blowout discount.',
    type: 'Percentage',
    discountType: 'percentage',
    discountValue: 30,
    maxDiscount: 1500,
    minOrderValue: 999,
    benefit: '30% OFF Max ₹1,500',
    applicableOn: 'All Products',
    startDate: '15 May 2024',
    endDate: '31 May 2024',
    usedCount: 75,
    usageCount: 75,
    totalLimit: 400,
    usageLimit: 400,
    status: 'Active',
    isActive: true,
  },
];

const initialDraftAd: DraftAd = {
  type: 'Sponsored Product',
  productId: 'PRD-10245',
  productName: 'Men Checked Shirt',
  productSku: '#P54321',
  productPrice: 699,
  productRating: 4.5,
  productReviews: 120,
  productCategory: 'Men',
  productSubcategory: 'Top Wear',
  productType: 'T-Shirt',
  productImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=80',
  planDuration: '7 Days',
  pricePerDay: 185,
  totalAmount: 1299,
  startDate: '20 May 2024',
  endDate: '26 May 2024',
  message: 'Stylish Checked Shirt – Premium Quality at Best Price!',
  paymentMethod: 'wallet',
  agreeTerms: true,
  biddingMode: 'auto',
  cpcBid: 12.5,
  targetEntityName: 'Men Checked Shirt',
};

const initialDraftCoupon: DraftCoupon = {
  code: 'SUMMER20',
  name: 'Summer Sale - 20% Off',
  description: 'Get 20% off on your favorite fashion styles this summer!',
  discountType: 'Percentage',
  discountValue: 20,
  maxDiscount: 1000,
  minOrderValue: 999,
  usageLimit: 'Limited',
  maxUsage: 1000,
  applicableOn: 'All Products',
  selectedProductIds: ['PRD-001', 'PRD-002', 'PRD-003', 'PRD-004', 'PRD-005'],
  selectedCategoryIds: ['CAT-001', 'CAT-002'],
  startDate: '20 May 2024',
  endDate: '20 Jun 2024',
  showOnStore: true,
  multiplePerCustomer: true,
  combineOffers: false,
  confirmed: true,
};

interface MarketingState {
  activeSubTab: MarketingSubTab;
  setActiveSubTab: (tab: MarketingSubTab) => void;

  // Advertisements
  ads: AdvertisementItem[];
  advertisements: AdvertisementItem[];
  adView: 'list' | 'create';
  setAdView: (view: 'list' | 'create') => void;
  isCreateAdWizardOpen: boolean;
  openCreateAdWizard: () => void;
  closeCreateAdWizard: () => void;
  adWizardStep: number;
  setAdWizardStep: (step: number) => void;
  draftAd: DraftAd;
  updateDraftAd: (partial: Partial<DraftAd>) => void;
  resetDraftAd: () => void;
  launchDraftAd: () => void;
  addAdvertisement: (ad: Partial<AdvertisementItem>) => void;
  toggleAdStatus: (id: string) => void;
  updateAd: (id: string, partial: Partial<AdvertisementItem>) => void;
  topUpAdBudget: (id: string, amount: number) => void;

  // Analytics Drawer
  selectedAdForAnalytics: AdvertisementItem | null;
  isAdAnalyticsDrawerOpen: boolean;
  openAdAnalytics: (ad: AdvertisementItem) => void;
  closeAdAnalytics: () => void;

  // Discounts & Coupons
  coupons: CouponItem[];
  couponView: 'list' | 'create';
  setCouponView: (view: 'list' | 'create') => void;
  isCreateCouponWizardOpen: boolean;
  openCreateCouponWizard: () => void;
  closeCreateCouponWizard: () => void;
  couponWizardStep: number;
  setCouponWizardStep: (step: number) => void;
  draftCoupon: DraftCoupon;
  updateDraftCoupon: (partial: Partial<DraftCoupon>) => void;
  resetDraftCoupon: () => void;
  createDraftCoupon: () => void;
  toggleCouponStatus: (id: string) => void;

  // Modals for Coupon Creation
  isSelectProductsModalOpen: boolean;
  setIsSelectProductsModalOpen: (open: boolean) => void;
  isSelectCategoriesModalOpen: boolean;
  setIsSelectCategoriesModalOpen: (open: boolean) => void;

  // Financial State
  walletBalance: number;

  // Backward compatibility helpers
  activeCampaignView: 'list' | 'create';
  setActiveCampaignView: (v: 'list' | 'create') => void;
  campaigns: any[];
  offers: any[];
  wizardStep: number;
  setWizardStep: (s: number) => void;
  deleteCampaign: (id: string) => void;
  deleteOffer: (id: string) => void;
  deleteCoupon: (id: string) => void;
  addCoupon: (c: any) => void;
  addOffer: (o: any) => void;

  // Legacy state filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
  draftCampaign: any;
  updateDraftCampaign: (u: any) => void;
  launchDraftCampaign: () => void;
  saveDraftCampaign: () => void;
  resetDraftCampaign: () => void;
}

export const useMarketingStore = create<MarketingState>((set, get) => ({
  activeSubTab: 'overview',
  setActiveSubTab: (tab) =>
    set({
      activeSubTab: tab,
      adView: 'list',
      couponView: 'list',
      isCreateAdWizardOpen: false,
      isCreateCouponWizardOpen: false,
    }),

  walletBalance: 32450,

  ads: initialAds,
  advertisements: initialAds,
  adView: 'list',
  setAdView: (view) =>
    set({ adView: view, isCreateAdWizardOpen: view === 'create', adWizardStep: 1 }),
  isCreateAdWizardOpen: false,
  openCreateAdWizard: () => set({ isCreateAdWizardOpen: true, adView: 'create', adWizardStep: 1 }),
  closeCreateAdWizard: () => set({ isCreateAdWizardOpen: false, adView: 'list' }),
  adWizardStep: 1,
  setAdWizardStep: (step) => set({ adWizardStep: step }),
  draftAd: initialDraftAd,
  updateDraftAd: (partial) => set((s) => ({ draftAd: { ...s.draftAd, ...partial } })),
  resetDraftAd: () =>
    set({ draftAd: initialDraftAd, adWizardStep: 1, adView: 'list', isCreateAdWizardOpen: false }),

  addAdvertisement: (ad) => {
    const newAd: AdvertisementItem = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      name: ad.name || 'New Ad Campaign',
      subtitle: ad.subtitle || 'Active Promotion',
      type: (ad.type as AdType) || 'Sponsored Product',
      duration: ad.duration || '7 Days',
      amount: ad.amount || 1299,
      budgetDaily: ad.budgetDaily || 185,
      totalSpend: ad.totalSpend || 0,
      revenueGenerated: ad.revenueGenerated || 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      roas: 0,
      startDate: ad.startDate || '20 May 2024',
      endDate: ad.endDate || '26 May 2024',
      status: (ad.status as AdStatus) || 'Active',
      views: 0,
      imageUrl: ad.imageUrl || (initialAds[0]?.imageUrl ?? ''),
      targetId: ad.targetId || 'PRD-10245',
      targetName: ad.targetName || ad.name || 'Promoted Item',
    };
    set((s) => {
      const remainingWallet =
        ad.amount && s.walletBalance >= ad.amount ? s.walletBalance - ad.amount : s.walletBalance;
      return {
        ads: [newAd, ...s.ads],
        advertisements: [newAd, ...s.advertisements],
        isCreateAdWizardOpen: false,
        adView: 'list',
        walletBalance: remainingWallet,
      };
    });
  },

  launchDraftAd: () => {
    const d = get().draftAd;
    get().addAdvertisement({
      name: d.productName,
      subtitle: `Product: ${d.productName}`,
      type: d.type,
      duration: d.planDuration,
      amount: d.totalAmount,
      budgetDaily: d.pricePerDay,
      startDate: d.startDate,
      endDate: d.endDate,
      imageUrl: d.productImage,
      targetId: d.productSku,
      targetName: d.productName,
    });
  },

  toggleAdStatus: (id) =>
    set((s) => {
      const updateList = (list: AdvertisementItem[]) =>
        list.map((item) => {
          if (item.id === id) {
            const nextStatus: AdStatus =
              item.status === 'Active' ? 'Paused' : 'Active';
            return { ...item, status: nextStatus };
          }
          return item;
        });
      const updatedAds = updateList(s.ads);
      const updatedAdvertisements = updateList(s.advertisements);
      const currentSelected =
        s.selectedAdForAnalytics && s.selectedAdForAnalytics.id === id
          ? updatedAds.find((a) => a.id === id) || null
          : s.selectedAdForAnalytics;

      return {
        ads: updatedAds,
        advertisements: updatedAdvertisements,
        selectedAdForAnalytics: currentSelected,
      };
    }),

  updateAd: (id, partial) =>
    set((s) => {
      const updateList = (list: AdvertisementItem[]) =>
        list.map((item) => (item.id === id ? { ...item, ...partial } : item));
      const updatedAds = updateList(s.ads);
      return {
        ads: updatedAds,
        advertisements: updateList(s.advertisements),
        selectedAdForAnalytics:
          s.selectedAdForAnalytics && s.selectedAdForAnalytics.id === id
            ? { ...s.selectedAdForAnalytics, ...partial }
            : s.selectedAdForAnalytics,
      };
    }),

  topUpAdBudget: (id, amount) =>
    set((s) => {
      if (s.walletBalance < amount) return s;
      const updateList = (list: AdvertisementItem[]) =>
        list.map((item) =>
          item.id === id
            ? {
                ...item,
                amount: item.amount + amount,
                totalSpend: item.totalSpend + amount,
              }
            : item
        );
      const updatedAds = updateList(s.ads);
      return {
        walletBalance: s.walletBalance - amount,
        ads: updatedAds,
        advertisements: updateList(s.advertisements),
        selectedAdForAnalytics:
          s.selectedAdForAnalytics && s.selectedAdForAnalytics.id === id
            ? {
                ...s.selectedAdForAnalytics,
                amount: s.selectedAdForAnalytics.amount + amount,
                totalSpend: s.selectedAdForAnalytics.totalSpend + amount,
              }
            : s.selectedAdForAnalytics,
      };
    }),

  // Analytics Drawer
  selectedAdForAnalytics: null,
  isAdAnalyticsDrawerOpen: false,
  openAdAnalytics: (ad) => set({ selectedAdForAnalytics: ad, isAdAnalyticsDrawerOpen: true }),
  closeAdAnalytics: () => set({ isAdAnalyticsDrawerOpen: false, selectedAdForAnalytics: null }),

  // Discounts & Coupons
  coupons: initialCoupons,
  couponView: 'list',
  setCouponView: (view) =>
    set({ couponView: view, isCreateCouponWizardOpen: view === 'create', couponWizardStep: 1 }),
  isCreateCouponWizardOpen: false,
  openCreateCouponWizard: () => set({ isCreateCouponWizardOpen: true, couponView: 'create', couponWizardStep: 1 }),
  closeCreateCouponWizard: () => set({ isCreateCouponWizardOpen: false, couponView: 'list' }),
  couponWizardStep: 1,
  setCouponWizardStep: (step) => set({ couponWizardStep: step }),
  draftCoupon: initialDraftCoupon,
  updateDraftCoupon: (partial) => set((s) => ({ draftCoupon: { ...s.draftCoupon, ...partial } })),
  resetDraftCoupon: () =>
    set({
      draftCoupon: initialDraftCoupon,
      couponWizardStep: 1,
      couponView: 'list',
      isCreateCouponWizardOpen: false,
    }),

  addCoupon: (c) =>
    set((s) => {
      const newCoupon: CouponItem = {
        id: c.id || `CPN-${Date.now().toString().slice(-4)}`,
        code: c.code || 'COUPON',
        title: c.title || c.name || 'Special Offer',
        name: c.name || c.title || 'Special Offer',
        description: c.description || 'Special savings applied at checkout.',
        type: c.type || c.couponType || 'Percentage',
        discountType: c.discountType || (c.type === 'Fixed Amount' ? 'fixed' : c.type === 'Free Shipping' ? 'free_shipping' : 'percentage'),
        discountValue: c.discountValue ?? (c.type === 'Percentage' ? 20 : 100),
        maxDiscount: c.maxDiscount ?? 1000,
        minOrderValue: c.minOrderValue ?? 499,
        benefit:
          c.benefit ||
          c.discountBenefit ||
          (c.type === 'Percentage' ? `${c.discountValue || 20}% OFF` : `₹${c.discountValue || 100} OFF`),
        applicableOn: c.applicableOn || 'All Products',
        startDate: c.startDate || '20 May 2024',
        endDate: c.endDate || '20 Jun 2024',
        usedCount: c.usedCount || 0,
        usageCount: c.usedCount || 0,
        totalLimit: c.totalLimit || 1000,
        usageLimit: c.totalLimit || 1000,
        status: c.status || 'Active',
        isActive: c.status ? c.status === 'Active' : true,
      };
      return {
        coupons: [newCoupon, ...s.coupons],
        isCreateCouponWizardOpen: false,
        couponView: 'list',
      };
    }),

  createDraftCoupon: () => {
    const d = get().draftCoupon;
    get().addCoupon({
      code: d.code,
      title: d.name,
      name: d.name,
      description: d.description,
      type: d.discountType,
      discountValue: d.discountValue,
      maxDiscount: d.maxDiscount,
      minOrderValue: d.minOrderValue,
      benefit:
        d.discountType === 'Percentage'
          ? `${d.discountValue}% OFF Max ₹${d.maxDiscount}`
          : d.discountType === 'Fixed Amount'
          ? `₹${d.discountValue} OFF Min. order ₹${d.minOrderValue}`
          : 'Free Shipping',
      applicableOn: d.applicableOn,
      startDate: d.startDate,
      endDate: d.endDate,
      totalLimit: d.usageLimit === 'Limited' ? d.maxUsage : 9999,
    });
  },

  toggleCouponStatus: (id) =>
    set((s) => {
      const updatedCoupons = s.coupons.map((c) => {
        if (c.id === id) {
          const nextActive = !c.isActive;
          const nextStatus: CouponStatus = nextActive ? 'Active' : 'Completed';
          return {
            ...c,
            isActive: nextActive,
            status: nextStatus,
          };
        }
        return c;
      });
      return { coupons: updatedCoupons };
    }),

  isSelectProductsModalOpen: false,
  setIsSelectProductsModalOpen: (open) => set({ isSelectProductsModalOpen: open }),
  isSelectCategoriesModalOpen: false,
  setIsSelectCategoriesModalOpen: (open) => set({ isSelectCategoriesModalOpen: open }),

  // Backward compatibility helpers
  activeCampaignView: 'list',
  setActiveCampaignView: (v) => set({ activeCampaignView: v, isCreateAdWizardOpen: v === 'create' }),
  campaigns: [],
  offers: [],
  wizardStep: 1,
  setWizardStep: (s) => set({ wizardStep: s }),
  deleteCampaign: (id) =>
    set((s) => ({
      ads: s.ads.filter((a) => a.id !== id),
      advertisements: s.advertisements.filter((a) => a.id !== id),
    })),
  deleteOffer: (id) => set((s) => ({ coupons: s.coupons.filter((c) => c.id !== id) })),
  deleteCoupon: (id) => set((s) => ({ coupons: s.coupons.filter((c) => c.id !== id) })),
  addOffer: () => {},

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  statusFilter: 'all',
  setStatusFilter: (s) => set({ statusFilter: s }),
  typeFilter: 'all',
  setTypeFilter: (t) => set({ typeFilter: t }),
  draftCampaign: {},
  updateDraftCampaign: () => {},
  launchDraftCampaign: () => {},
  saveDraftCampaign: () => {},
  resetDraftCampaign: () => {},
}));
