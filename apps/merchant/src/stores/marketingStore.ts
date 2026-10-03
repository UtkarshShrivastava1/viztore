import { create } from 'zustand';

export type MarketingSubTab =
  | 'overview'
  | 'campaigns'
  | 'discounts'
  | 'coupons'
  | 'push'
  | 'email_sms'
  | 'loyalty'
  | 'social'
  | 'analytics';

export type CampaignType =
  | 'Discount'
  | 'Offer'
  | 'Delivery'
  | 'Referral'
  | 'Awareness'
  | 'Loyalty'
  | 'Others';

export type CampaignStatus = 'Active' | 'Scheduled' | 'Completed' | 'Inactive';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  banner: string;
  bannerImageUrl: string;
  bannerPosition: 'Top Banner' | 'Below Search Bar' | 'Middle Banner' | 'Bottom Banner';
  bannerPlacement: 'Homepage Banner' | 'Category Page' | 'Product Page' | 'Offer Page' | 'Others';
  startDate: string;
  endDate: string;
  reach: number;
  redemptions: number;
  revenue: number;
  goal: string;
  description: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAction: string;
  selectedOffer?: string;
  audienceType: 'All Customers' | 'Specific Segment' | 'Custom Audience';
  audienceLocation: string;
  audienceGroup: string;
  audienceGender: string;
  audienceAge: string;
  displayFrequency: string;
  allowDismiss: boolean;
  autoRotate: boolean;
  rotationInterval: string;
  cost: number;
}

export type OfferType = 'Discount' | 'Offer' | 'Free Delivery' | 'BOGO';
export type OfferStatus = 'Active' | 'Scheduled' | 'Completed' | 'Inactive';

export interface DiscountOffer {
  id: string;
  name: string;
  subtitle: string;
  type: OfferType;
  code: string;
  applicableOn: string;
  discountBenefit: string;
  status: OfferStatus;
  validity: string;
  redemptions: number;
  revenueImpact: number;
}

export type CouponType = 'Percentage' | 'Free Shipping' | 'Fixed Amount' | 'BOGO';
export type CouponStatus = 'Active' | 'Scheduled' | 'Completed' | 'Inactive';

export interface Coupon {
  id: string;
  code: string;
  name: string;
  couponType: CouponType;
  discountBenefit: string;
  applicableOn: string;
  usedCount: number;
  totalLimit: number;
  validity: string;
  status: CouponStatus;
}

export interface DraftCampaign {
  name: string;
  goal: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  bannerImageUrl: string;
  bannerAltText: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAction: string;
  selectedOffer: string;
  audienceType: 'All Customers' | 'Specific Segment' | 'Custom Audience';
  audienceLocation: string;
  audienceGroup: string;
  audienceGender: string;
  audienceAge: string;
  audienceLastOrder: string;
  audienceOrderCount: string;
  audienceTotalSpent: string;
  audienceTags: string;
  estimatedReach: number;
  placement: 'Homepage Banner' | 'Category Page' | 'Product Page' | 'Offer Page' | 'Others';
  bannerPosition: 'Top Banner' | 'Below Search Bar' | 'Middle Banner' | 'Bottom Banner';
  displayFrequency: string;
  allowDismiss: boolean;
  autoRotate: boolean;
  rotationInterval: string;
  baseCost: number;
  reachCost: number;
  platformFee: number;
}

const initialDraftCampaign: DraftCampaign = {
  name: 'Summer Sale - Get 20% Off',
  goal: 'Increase Sales',
  description: "Flat 20% off on all Men's Wear products.",
  startDate: '2024-05-10',
  startTime: '10:00 AM',
  endDate: '2024-05-20',
  endTime: '11:59 PM',
  bannerImageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
  bannerAltText: 'Summer Sale Banner',
  title: 'SUMMER SALE',
  subtitle: 'GET 20% OFF',
  buttonText: 'SHOP NOW',
  buttonAction: 'Go to Offer Page',
  selectedOffer: 'Summer Sale - 20% Off',
  audienceType: 'All Customers',
  audienceLocation: 'All Locations',
  audienceGroup: 'All Groups',
  audienceGender: 'All',
  audienceAge: 'All Ages',
  audienceLastOrder: 'Anytime',
  audienceOrderCount: 'Any',
  audienceTotalSpent: 'Any Amount',
  audienceTags: 'All Tags',
  estimatedReach: 12450,
  placement: 'Homepage Banner',
  bannerPosition: 'Top Banner',
  displayFrequency: 'Show every time',
  allowDismiss: true,
  autoRotate: true,
  rotationInterval: '5 seconds',
  baseCost: 1000,
  reachCost: 200,
  platformFee: 50,
};

const initialCampaigns: Campaign[] = [
  {
    id: 'CMP-101',
    name: 'Summer Sale - Get 20% Off',
    type: 'Discount',
    status: 'Active',
    banner: 'Homepage Top Banner',
    bannerImageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
    bannerPosition: 'Top Banner',
    bannerPlacement: 'Homepage Banner',
    startDate: '10 May 2024',
    endDate: '20 May 2024',
    reach: 5450,
    redemptions: 320,
    revenue: 12450,
    goal: 'Increase Sales',
    description: "Flat 20% off on all Men's Wear",
    title: 'SUMMER SALE',
    subtitle: 'GET 20% OFF',
    buttonText: 'SHOP NOW',
    buttonAction: 'Go to Offer Page',
    selectedOffer: 'Summer Sale - 20% Off',
    audienceType: 'All Customers',
    audienceLocation: 'All Locations',
    audienceGroup: 'All Groups',
    audienceGender: 'All',
    audienceAge: 'All Ages',
    displayFrequency: 'Show every time',
    allowDismiss: true,
    autoRotate: true,
    rotationInterval: '5 seconds',
    cost: 1250,
  },
  {
    id: 'CMP-102',
    name: 'Weekend Special Offer',
    type: 'Offer',
    status: 'Active',
    banner: 'Category Page Banner',
    bannerImageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&auto=format&fit=crop&q=80',
    bannerPosition: 'Below Search Bar',
    bannerPlacement: 'Category Page',
    startDate: '11 May 2024',
    endDate: '12 May 2024',
    reach: 3210,
    redemptions: 210,
    revenue: 6750,
    goal: 'Boost Weekend Traffic',
    description: 'Upto 30% off on selected items',
    title: 'WEEKEND SPECIAL',
    subtitle: 'UP TO 30% OFF',
    buttonText: 'EXPLORE',
    buttonAction: 'Open Category',
    audienceType: 'All Customers',
    audienceLocation: 'All Locations',
    audienceGroup: 'All Groups',
    audienceGender: 'All',
    audienceAge: 'All Ages',
    displayFrequency: 'Show every time',
    allowDismiss: true,
    autoRotate: true,
    rotationInterval: '5 seconds',
    cost: 850,
  },
  {
    id: 'CMP-103',
    name: 'Free Delivery Campaign',
    type: 'Delivery',
    status: 'Scheduled',
    banner: 'Cart Page Banner',
    bannerImageUrl: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&auto=format&fit=crop&q=80',
    bannerPosition: 'Middle Banner',
    bannerPlacement: 'Offer Page',
    startDate: '18 May 2024',
    endDate: '25 May 2024',
    reach: 2850,
    redemptions: 0,
    revenue: 0,
    goal: 'Increase Average Order Value',
    description: 'Free delivery on orders above ₹499',
    title: 'FREE DELIVERY',
    subtitle: 'ON ORDERS ABOVE ₹499',
    buttonText: 'SHOP NOW',
    buttonAction: 'Go to Offer Page',
    audienceType: 'All Customers',
    audienceLocation: 'All Locations',
    audienceGroup: 'All Groups',
    audienceGender: 'All',
    audienceAge: 'All Ages',
    displayFrequency: 'Show every time',
    allowDismiss: false,
    autoRotate: false,
    rotationInterval: '5 seconds',
    cost: 950,
  },
  {
    id: 'CMP-104',
    name: 'New User Welcome Offer',
    type: 'Discount',
    status: 'Completed',
    banner: 'Homepage Middle Banner',
    bannerImageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
    bannerPosition: 'Middle Banner',
    bannerPlacement: 'Homepage Banner',
    startDate: '06 May 2024',
    endDate: '07 May 2024',
    reach: 4600,
    redemptions: 185,
    revenue: 4600,
    goal: 'Customer Acquisition',
    description: 'Flat 15% off for new users',
    title: 'WELCOME OFFER',
    subtitle: 'FLAT 15% OFF',
    buttonText: 'CLAIM NOW',
    buttonAction: 'Go to Offer Page',
    audienceType: 'Specific Segment',
    audienceLocation: 'All Locations',
    audienceGroup: 'New Customers',
    audienceGender: 'All',
    audienceAge: 'All Ages',
    displayFrequency: 'Once per session',
    allowDismiss: true,
    autoRotate: true,
    rotationInterval: '10 seconds',
    cost: 1100,
  },
  {
    id: 'CMP-105',
    name: 'Refer & Earn',
    type: 'Referral',
    status: 'Completed',
    banner: 'Account Page Banner',
    bannerImageUrl: 'https://images.unsplash.com/photo-1556742049-0a67e55722c3?w=600&auto=format&fit=crop&q=80',
    bannerPosition: 'Bottom Banner',
    bannerPlacement: 'Others',
    startDate: '20 Apr 2024',
    endDate: '30 Apr 2024',
    reach: 1980,
    redemptions: 130,
    revenue: 3250,
    goal: 'Viral Growth',
    description: 'Refer a friend & earn ₹100',
    title: 'REFER & EARN',
    subtitle: 'EARN ₹100 PER REFERRAL',
    buttonText: 'INVITE',
    buttonAction: 'External URL',
    audienceType: 'All Customers',
    audienceLocation: 'All Locations',
    audienceGroup: 'All Groups',
    audienceGender: 'All',
    audienceAge: 'All Ages',
    displayFrequency: 'Show every time',
    allowDismiss: true,
    autoRotate: false,
    rotationInterval: '5 seconds',
    cost: 750,
  },
  {
    id: 'CMP-106',
    name: 'Flash Sale - Today Only',
    type: 'Discount',
    status: 'Inactive',
    banner: 'Homepage Bottom Banner',
    bannerImageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80',
    bannerPosition: 'Bottom Banner',
    bannerPlacement: 'Homepage Banner',
    startDate: '08 May 2024',
    endDate: '08 May 2024',
    reach: 980,
    redemptions: 98,
    revenue: 2150,
    goal: 'Urgency Sales',
    description: 'Flat 10% off on storewide items',
    title: 'FLASH SALE',
    subtitle: 'FLAT 10% OFF STOREWIDE',
    buttonText: 'SHOP NOW',
    buttonAction: 'Go to Offer Page',
    audienceType: 'All Customers',
    audienceLocation: 'All Locations',
    audienceGroup: 'All Groups',
    audienceGender: 'All',
    audienceAge: 'All Ages',
    displayFrequency: 'Show every time',
    allowDismiss: true,
    autoRotate: true,
    rotationInterval: '5 seconds',
    cost: 500,
  },
  {
    id: 'CMP-107',
    name: 'New Arrivals Showcase',
    type: 'Awareness',
    status: 'Completed',
    banner: 'Homepage Top Banner',
    bannerImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
    bannerPosition: 'Top Banner',
    bannerPlacement: 'Homepage Banner',
    startDate: '01 May 2024',
    endDate: '01 May 2024',
    reach: 2430,
    redemptions: 102,
    revenue: 2350,
    goal: 'Product Discovery',
    description: 'Check out our latest collection',
    title: 'NEW ARRIVALS',
    subtitle: 'SUMMER FASHION LINE',
    buttonText: 'VIEW COLLECTION',
    buttonAction: 'Open Category',
    audienceType: 'All Customers',
    audienceLocation: 'All Locations',
    audienceGroup: 'All Groups',
    audienceGender: 'All',
    audienceAge: 'All Ages',
    displayFrequency: 'Show every time',
    allowDismiss: true,
    autoRotate: true,
    rotationInterval: '5 seconds',
    cost: 800,
  },
  {
    id: 'CMP-108',
    name: 'Loyalty Bonus Campaign',
    type: 'Loyalty',
    status: 'Active',
    banner: 'Homepage Middle Banner',
    bannerImageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    bannerPosition: 'Middle Banner',
    bannerPlacement: 'Homepage Banner',
    startDate: '12 May 2024',
    endDate: '22 May 2024',
    reach: 1430,
    redemptions: 78,
    revenue: 1200,
    goal: 'Retention & Loyalty',
    description: 'Double points on every purchase',
    title: '2X REWARD POINTS',
    subtitle: 'EXCLUSIVE MEMBER REWARDS',
    buttonText: 'START SHOPPING',
    buttonAction: 'Go to Offer Page',
    audienceType: 'Specific Segment',
    audienceLocation: 'All Locations',
    audienceGroup: 'VIP Members',
    audienceGender: 'All',
    audienceAge: 'All Ages',
    displayFrequency: 'Show every time',
    allowDismiss: true,
    autoRotate: true,
    rotationInterval: '5 seconds',
    cost: 650,
  },
];

const initialOffers: DiscountOffer[] = [
  {
    id: 'OFF-201',
    name: 'Summer Sale - 20% Off',
    subtitle: "Flat 20% off on all Men's Wear",
    type: 'Discount',
    code: 'SUMMER20',
    applicableOn: 'All Products',
    discountBenefit: '20% OFF Max ₹1,000',
    status: 'Active',
    validity: '10 May 2024 - 20 May 2024',
    redemptions: 320,
    revenueImpact: 12450,
  },
  {
    id: 'OFF-202',
    name: 'Weekend Special - ₹100 Off',
    subtitle: '₹100 off on orders above ₹999',
    type: 'Discount',
    code: 'WEEKEND100',
    applicableOn: 'All Products',
    discountBenefit: '₹100 OFF Min. order ₹999',
    status: 'Active',
    validity: '11 May 2024 - 12 May 2024',
    redemptions: 210,
    revenueImpact: 6750,
  },
  {
    id: 'OFF-203',
    name: 'Free Delivery',
    subtitle: 'Free delivery on orders above ₹499',
    type: 'Offer',
    code: 'FREDEL499',
    applicableOn: 'All Products',
    discountBenefit: 'Free Delivery Min. order ₹499',
    status: 'Active',
    validity: '18 May 2024 - 25 May 2024',
    redemptions: 560,
    revenueImpact: 8450,
  },
  {
    id: 'OFF-204',
    name: 'New User Welcome Offer',
    subtitle: 'Flat 15% off for new users',
    type: 'Discount',
    code: 'WELCOME15',
    applicableOn: 'New Users',
    discountBenefit: '15% OFF Max ₹750',
    status: 'Completed',
    validity: '06 May 2024 - 07 May 2024',
    redemptions: 185,
    revenueImpact: 4600,
  },
  {
    id: 'OFF-205',
    name: 'Flash Sale - Today Only',
    subtitle: 'Flat 10% off on storewide',
    type: 'Discount',
    code: 'FLASH10',
    applicableOn: 'All Products',
    discountBenefit: '10% OFF Max ₹500',
    status: 'Inactive',
    validity: '08 May 2024 - 08 May 2024',
    redemptions: 98,
    revenueImpact: 2150,
  },
  {
    id: 'OFF-206',
    name: 'Buy 1 Get 1 Free',
    subtitle: 'Buy 1 product get 1 free',
    type: 'Offer',
    code: 'BOGO',
    applicableOn: 'Selected Products',
    discountBenefit: 'Buy 1 Get 1 Free',
    status: 'Scheduled',
    validity: '22 May 2024 - 29 May 2024',
    redemptions: 0,
    revenueImpact: 0,
  },
];

const initialCoupons: Coupon[] = [
  {
    id: 'CPN-301',
    code: 'SUMMER20',
    name: 'Summer Sale - 20% Off',
    couponType: 'Percentage',
    discountBenefit: '20% OFF Max ₹1,000',
    applicableOn: 'All Products',
    usedCount: 320,
    totalLimit: 1000,
    validity: '10 May 2024 - 20 May 2024',
    status: 'Active',
  },
  {
    id: 'CPN-302',
    code: 'FREDEL499',
    name: 'Free Delivery',
    couponType: 'Free Shipping',
    discountBenefit: 'Free Delivery Min. order ₹499',
    applicableOn: 'All Products',
    usedCount: 560,
    totalLimit: 2000,
    validity: '18 May 2024 - 25 May 2024',
    status: 'Active',
  },
  {
    id: 'CPN-303',
    code: 'WELCOME15',
    name: 'New User Welcome Offer',
    couponType: 'Percentage',
    discountBenefit: '15% OFF Max ₹750',
    applicableOn: 'New Users',
    usedCount: 185,
    totalLimit: 500,
    validity: '06 May 2024 - 07 May 2024',
    status: 'Completed',
  },
  {
    id: 'CPN-304',
    code: 'WEEKEND100',
    name: 'Weekend Special - ₹100 Off',
    couponType: 'Fixed Amount',
    discountBenefit: '₹100 OFF Min. order ₹999',
    applicableOn: 'All Products',
    usedCount: 210,
    totalLimit: 1000,
    validity: '11 May 2024 - 12 May 2024',
    status: 'Active',
  },
  {
    id: 'CPN-305',
    code: 'FLASH10',
    name: 'Flash Sale - Today Only',
    couponType: 'Percentage',
    discountBenefit: '10% OFF Max ₹500',
    applicableOn: 'All Products',
    usedCount: 98,
    totalLimit: 500,
    validity: '08 May 2024 - 08 May 2024',
    status: 'Inactive',
  },
  {
    id: 'CPN-306',
    code: 'BOGO',
    name: 'Buy 1 Get 1 Free',
    couponType: 'BOGO',
    discountBenefit: 'Buy 1 Get 1 Free',
    applicableOn: 'Selected Products',
    usedCount: 0,
    totalLimit: 500,
    validity: '22 May 2024 - 29 May 2024',
    status: 'Scheduled',
  },
];

interface MarketingState {
  activeSubTab: MarketingSubTab;
  activeCampaignView: 'list' | 'create';
  wizardStep: number;
  draftCampaign: DraftCampaign;
  campaigns: Campaign[];
  offers: DiscountOffer[];
  coupons: Coupon[];
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;

  // Actions
  setActiveSubTab: (tab: MarketingSubTab) => void;
  setActiveCampaignView: (view: 'list' | 'create') => void;
  setWizardStep: (step: number) => void;
  updateDraftCampaign: (partial: Partial<DraftCampaign>) => void;
  resetDraftCampaign: () => void;
  launchDraftCampaign: () => void;
  saveDraftCampaign: () => void;
  addCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  addOffer: (offer: DiscountOffer) => void;
  deleteOffer: (id: string) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setTypeFilter: (type: string) => void;
}

export const useMarketingStore = create<MarketingState>((set, get) => ({
  activeSubTab: 'overview',
  activeCampaignView: 'list',
  wizardStep: 1,
  draftCampaign: initialDraftCampaign,
  campaigns: initialCampaigns,
  offers: initialOffers,
  coupons: initialCoupons,
  searchQuery: '',
  statusFilter: 'all',
  typeFilter: 'all',

  setActiveSubTab: (tab) => set({ activeSubTab: tab, activeCampaignView: 'list' }),
  setActiveCampaignView: (view) => set({ activeCampaignView: view, wizardStep: 1 }),
  setWizardStep: (step) => set({ wizardStep: Math.min(Math.max(step, 1), 5) }),

  updateDraftCampaign: (partial) =>
    set((state) => ({
      draftCampaign: { ...state.draftCampaign, ...partial },
    })),

  resetDraftCampaign: () =>
    set({
      draftCampaign: initialDraftCampaign,
      wizardStep: 1,
      activeCampaignView: 'list',
    }),

  launchDraftCampaign: () => {
    const draft = get().draftCampaign;
    const newCampaign: Campaign = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      name: draft.name,
      type: 'Discount',
      status: 'Active',
      banner: `${draft.placement} ${draft.bannerPosition}`,
      bannerImageUrl: draft.bannerImageUrl,
      bannerPosition: draft.bannerPosition,
      bannerPlacement: draft.placement,
      startDate: draft.startDate,
      endDate: draft.endDate,
      reach: draft.estimatedReach,
      redemptions: 0,
      revenue: 0,
      goal: draft.goal,
      description: draft.description,
      title: draft.title,
      subtitle: draft.subtitle,
      buttonText: draft.buttonText,
      buttonAction: draft.buttonAction,
      selectedOffer: draft.selectedOffer,
      audienceType: draft.audienceType,
      audienceLocation: draft.audienceLocation,
      audienceGroup: draft.audienceGroup,
      audienceGender: draft.audienceGender,
      audienceAge: draft.audienceAge,
      displayFrequency: draft.displayFrequency,
      allowDismiss: draft.allowDismiss,
      autoRotate: draft.autoRotate,
      rotationInterval: draft.rotationInterval,
      cost: draft.baseCost + draft.reachCost + draft.platformFee,
    };

    set((state) => ({
      campaigns: [newCampaign, ...state.campaigns],
      activeCampaignView: 'list',
      activeSubTab: 'campaigns',
      draftCampaign: initialDraftCampaign,
      wizardStep: 1,
    }));
  },

  saveDraftCampaign: () => {
    const draft = get().draftCampaign;
    const newCampaign: Campaign = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      name: draft.name,
      type: 'Discount',
      status: 'Scheduled',
      banner: `${draft.placement} ${draft.bannerPosition}`,
      bannerImageUrl: draft.bannerImageUrl,
      bannerPosition: draft.bannerPosition,
      bannerPlacement: draft.placement,
      startDate: draft.startDate,
      endDate: draft.endDate,
      reach: draft.estimatedReach,
      redemptions: 0,
      revenue: 0,
      goal: draft.goal,
      description: draft.description,
      title: draft.title,
      subtitle: draft.subtitle,
      buttonText: draft.buttonText,
      buttonAction: draft.buttonAction,
      selectedOffer: draft.selectedOffer,
      audienceType: draft.audienceType,
      audienceLocation: draft.audienceLocation,
      audienceGroup: draft.audienceGroup,
      audienceGender: draft.audienceGender,
      audienceAge: draft.audienceAge,
      displayFrequency: draft.displayFrequency,
      allowDismiss: draft.allowDismiss,
      autoRotate: draft.autoRotate,
      rotationInterval: draft.rotationInterval,
      cost: draft.baseCost + draft.reachCost + draft.platformFee,
    };

    set((state) => ({
      campaigns: [newCampaign, ...state.campaigns],
      activeCampaignView: 'list',
      activeSubTab: 'campaigns',
      draftCampaign: initialDraftCampaign,
      wizardStep: 1,
    }));
  },

  addCampaign: (campaign) =>
    set((state) => ({ campaigns: [campaign, ...state.campaigns] })),

  deleteCampaign: (id) =>
    set((state) => ({ campaigns: state.campaigns.filter((c) => c.id !== id) })),

  addOffer: (offer) =>
    set((state) => ({ offers: [offer, ...state.offers] })),

  deleteOffer: (id) =>
    set((state) => ({ offers: state.offers.filter((o) => o.id !== id) })),

  addCoupon: (coupon) =>
    set((state) => ({ coupons: [coupon, ...state.coupons] })),

  deleteCoupon: (id) =>
    set((state) => ({ coupons: state.coupons.filter((c) => c.id !== id) })),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTypeFilter: (type) => set({ typeFilter: type }),
}));
