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
  | 'Banner Advertisement';

export type AdStatus = 'Active' | 'Scheduled' | 'Completed' | 'Inactive';

export interface AdvertisementItem {
  id: string;
  name: string;
  subtitle: string;
  type: AdType;
  duration: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: AdStatus;
  views: number | null;
  clicks: number | null;
  imageUrl: string;
}

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
}

export type CouponType = 'Percentage' | 'Free Shipping' | 'Fixed Amount' | 'BOGO';
export type CouponStatus = 'Active' | 'Scheduled' | 'Completed' | 'Expired';

export interface CouponItem {
  id: string;
  code: string;
  title: string;
  type: CouponType;
  benefit: string;
  applicableOn: string;
  startDate: string;
  endDate: string;
  usedCount: number;
  totalLimit: number;
  status: CouponStatus;
  // Legacy aliases
  name?: string;
  couponType?: any;
  discountBenefit?: string;
  validity?: string;
}

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
export type Coupon = CouponItem;
export type DiscountOffer = any;
export type OfferType = any;

// Initial Advertisements matching 12.1.png
export const initialAds: AdvertisementItem[] = [
  {
    id: 'AD-001',
    name: 'Men Solid Cotton Shirt',
    subtitle: 'Product: Blue, M',
    type: 'Sponsored Product',
    duration: '7 Days',
    amount: 1499,
    startDate: '10 May 2024',
    endDate: '17 May 2024',
    status: 'Active',
    views: 1245,
    clicks: 98,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'AD-002',
    name: 'Fashion Hub Store',
    subtitle: 'Store Promotion',
    type: 'Sponsored Store',
    duration: '15 Days',
    amount: 2999,
    startDate: '08 May 2024',
    endDate: '23 May 2024',
    status: 'Active',
    views: 2430,
    clicks: 210,
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'AD-003',
    name: "Men's Fashion",
    subtitle: 'Category: Men',
    type: 'Category Promotion',
    duration: '7 Days',
    amount: 1999,
    startDate: '12 May 2024',
    endDate: '19 May 2024',
    status: 'Scheduled',
    views: null,
    clicks: null,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'AD-004',
    name: 'Weekend Sale',
    subtitle: 'Offer Promotion',
    type: 'Best Deals',
    duration: '3 Days',
    amount: 999,
    startDate: '15 May 2024',
    endDate: '18 May 2024',
    status: 'Active',
    views: 986,
    clicks: 76,
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'AD-005',
    name: 'Summer Banner',
    subtitle: 'Homepage Banner',
    type: 'Banner Advertisement',
    duration: '15 Days',
    amount: 2499,
    startDate: '05 May 2024',
    endDate: '20 May 2024',
    status: 'Completed',
    views: 3210,
    clicks: 340,
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'AD-006',
    name: 'Running Shoes',
    subtitle: 'Product: Red, 8',
    type: 'Sponsored Product',
    duration: '7 Days',
    amount: 1299,
    startDate: '18 May 2024',
    endDate: '25 May 2024',
    status: 'Active',
    views: 1876,
    clicks: 164,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'AD-007',
    name: 'Kids World Store',
    subtitle: 'Store Promotion',
    type: 'Sponsored Store',
    duration: '15 Days',
    amount: 2999,
    startDate: '20 May 2024',
    endDate: '04 Jun 2024',
    status: 'Scheduled',
    views: null,
    clicks: null,
    imageUrl: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=120&auto=format&fit=crop&q=80',
  },
];

// Initial Coupons matching 12.7.png
export const initialCoupons: CouponItem[] = [
  {
    id: 'CPN-001',
    code: 'SUMMER20',
    title: 'Summer Sale - 20% Off',
    type: 'Percentage',
    benefit: '20% OFF Max ₹1,000',
    applicableOn: 'All Products',
    startDate: '10 May 2024',
    endDate: '20 May 2024',
    usedCount: 320,
    totalLimit: 1000,
    status: 'Active',
  },
  {
    id: 'CPN-002',
    code: 'WEEKEND100',
    title: 'Weekend Special',
    type: 'Fixed Amount',
    benefit: '₹100 OFF Min. order ₹999',
    applicableOn: 'All Products',
    startDate: '11 May 2024',
    endDate: '12 May 2024',
    usedCount: 560,
    totalLimit: 2000,
    status: 'Active',
  },
  {
    id: 'CPN-003',
    code: 'FREDEL499',
    title: 'Free Delivery Offer',
    type: 'Free Shipping',
    benefit: 'Free Shipping Min. order ₹499',
    applicableOn: 'All Products',
    startDate: '18 May 2024',
    endDate: '25 May 2024',
    usedCount: 185,
    totalLimit: 500,
    status: 'Active',
  },
  {
    id: 'CPN-004',
    code: 'WELCOME15',
    title: 'New User Offer',
    type: 'Percentage',
    benefit: '15% OFF Max ₹750',
    applicableOn: 'New Users',
    startDate: '06 May 2024',
    endDate: '07 May 2024',
    usedCount: 210,
    totalLimit: 1000,
    status: 'Completed',
  },
  {
    id: 'CPN-005',
    code: 'FASHION50',
    title: 'Fashion Festival',
    type: 'Percentage',
    benefit: '50% OFF Max ₹2,000',
    applicableOn: 'Selected Products',
    startDate: '01 May 2024',
    endDate: '31 May 2024',
    usedCount: 98,
    totalLimit: 500,
    status: 'Active',
  },
  {
    id: 'CPN-006',
    code: 'MENS100',
    title: "Men's Collection Offer",
    type: 'Fixed Amount',
    benefit: '₹100 OFF Min. order ₹799',
    applicableOn: 'Men Category',
    startDate: '12 May 2024',
    endDate: '22 May 2024',
    usedCount: 46,
    totalLimit: 300,
    status: 'Active',
  },
  {
    id: 'CPN-007',
    code: 'BOGO',
    title: 'Buy 1 Get 1 Free',
    type: 'BOGO',
    benefit: 'Buy 1 Get 1 Free',
    applicableOn: 'Selected Products',
    startDate: '20 May 2024',
    endDate: '30 May 2024',
    usedCount: 12,
    totalLimit: 200,
    status: 'Scheduled',
  },
  {
    id: 'CPN-008',
    code: 'CLEARANCE30',
    title: 'Clearance Sale',
    type: 'Percentage',
    benefit: '30% OFF Max ₹1,500',
    applicableOn: 'All Products',
    startDate: '15 May 2024',
    endDate: '31 May 2024',
    usedCount: 75,
    totalLimit: 400,
    status: 'Active',
  },
];

const initialDraftAd: DraftAd = {
  type: 'Sponsored Product',
  productId: 'PRD-TS001',
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
  selectedProductIds: ['p1', 'p2', 'p3', 'p4', 'p5'],
  selectedCategoryIds: ['c1', 'c2'],
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

  // Modals for Coupon Creation
  isSelectProductsModalOpen: boolean;
  setIsSelectProductsModalOpen: (open: boolean) => void;
  isSelectCategoriesModalOpen: boolean;
  setIsSelectCategoriesModalOpen: (open: boolean) => void;

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
  setActiveSubTab: (tab) => set({ activeSubTab: tab, adView: 'list', couponView: 'list', isCreateAdWizardOpen: false, isCreateCouponWizardOpen: false }),

  ads: initialAds,
  advertisements: initialAds,
  adView: 'list',
  setAdView: (view) => set({ adView: view, isCreateAdWizardOpen: view === 'create', adWizardStep: 1 }),
  isCreateAdWizardOpen: false,
  openCreateAdWizard: () => set({ isCreateAdWizardOpen: true, adView: 'create' }),
  closeCreateAdWizard: () => set({ isCreateAdWizardOpen: false, adView: 'list' }),
  adWizardStep: 1,
  setAdWizardStep: (step) => set({ adWizardStep: step }),
  draftAd: initialDraftAd,
  updateDraftAd: (partial) => set((s) => ({ draftAd: { ...s.draftAd, ...partial } })),
  resetDraftAd: () => set({ draftAd: initialDraftAd, adWizardStep: 1, adView: 'list', isCreateAdWizardOpen: false }),
  addAdvertisement: (ad) => {
    const newAd: AdvertisementItem = {
      id: `AD-${Date.now().toString().slice(-3)}`,
      name: ad.name || 'New Ad',
      subtitle: ad.subtitle || 'Promotion',
      type: (ad.type as AdType) || 'Sponsored Product',
      duration: ad.duration || '7 Days',
      amount: ad.amount || 1299,
      startDate: ad.startDate || '20 May 2024',
      endDate: ad.endDate || '26 May 2024',
      status: (ad.status as AdStatus) || 'Active',
      views: 0,
      clicks: 0,
      imageUrl: ad.imageUrl || (initialAds[0]?.imageUrl ?? ''),
    };
    set((s) => ({
      ads: [newAd, ...s.ads],
      advertisements: [newAd, ...s.advertisements],
      isCreateAdWizardOpen: false,
      adView: 'list',
    }));
  },
  launchDraftAd: () => {
    const d = get().draftAd;
    get().addAdvertisement({
      name: d.productName,
      subtitle: `Product: ${d.productName}`,
      type: d.type,
      duration: d.planDuration,
      amount: d.totalAmount,
      startDate: d.startDate,
      endDate: d.endDate,
      imageUrl: d.productImage,
    });
  },

  coupons: initialCoupons,
  couponView: 'list',
  setCouponView: (view) => set({ couponView: view, isCreateCouponWizardOpen: view === 'create', couponWizardStep: 1 }),
  isCreateCouponWizardOpen: false,
  openCreateCouponWizard: () => set({ isCreateCouponWizardOpen: true, couponView: 'create' }),
  closeCreateCouponWizard: () => set({ isCreateCouponWizardOpen: false, couponView: 'list' }),
  couponWizardStep: 1,
  setCouponWizardStep: (step) => set({ couponWizardStep: step }),
  draftCoupon: initialDraftCoupon,
  updateDraftCoupon: (partial) => set((s) => ({ draftCoupon: { ...s.draftCoupon, ...partial } })),
  resetDraftCoupon: () => set({ draftCoupon: initialDraftCoupon, couponWizardStep: 1, couponView: 'list', isCreateCouponWizardOpen: false }),
  addCoupon: (c) =>
    set((s) => {
      const newCoupon: CouponItem = {
        id: c.id || `CPN-${Date.now().toString().slice(-3)}`,
        code: c.code || 'COUPON',
        title: c.title || c.name || 'Special Offer',
        type: c.type || c.couponType || 'Percentage',
        benefit: c.benefit || c.discountBenefit || '10% OFF',
        applicableOn: c.applicableOn || 'All Products',
        startDate: c.startDate || '20 May 2024',
        endDate: c.endDate || '20 Jun 2024',
        usedCount: c.usedCount || 0,
        totalLimit: c.totalLimit || 1000,
        status: c.status || 'Active',
        name: c.name || c.title,
        couponType: c.type || c.couponType,
        discountBenefit: c.benefit || c.discountBenefit,
        validity: c.validity || `${c.startDate || '20 May'} - ${c.endDate || '20 Jun'}`,
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
      type: d.discountType,
      benefit: d.discountType === 'Percentage' ? `${d.discountValue}% OFF Max ₹${d.maxDiscount}` : `₹${d.discountValue} OFF Min. order ₹${d.minOrderValue}`,
      applicableOn: d.applicableOn,
      startDate: d.startDate,
      endDate: d.endDate,
      totalLimit: d.maxUsage,
    });
  },

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
  deleteCampaign: (id) => set((s) => ({ ads: s.ads.filter((a) => a.id !== id), advertisements: s.advertisements.filter((a) => a.id !== id) })),
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
