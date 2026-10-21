import { create } from 'zustand';
import { api, storesApi, catalogApi } from '../lib/api.js';

export interface StoreSection {
  id: string;
  name: string;
  badge?: 'Special' | 'New' | 'Popular' | 'Category' | 'Brand' | 'Default';
  type: 'Automatic' | 'Manual';
  sectionType: 'product' | 'category' | 'banner' | 'brand';
  productCount: number;
  isActive: boolean;
  isAlwaysOn?: boolean;
  displayOn?: string;
  priority: number;
  productIds: string[];
  description?: string;
}

export interface CuratedProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  stock: number;
  isActive: boolean;
  image: string;
  category: string;
}

export interface StoreKPIs {
  totalSections: number;
  activeSections: number;
  totalProducts: number;
  impressions: number;
  impressionsGrowth: string;
  clicks: number;
  clicksGrowth: string;
}

export type StoreManagementSubTab =
  | 'overview'
  | 'sections'
  | 'banner_logo'
  | 'qr_link'
  | 'placement'
  | 'view_settings';

interface StoreManagementState {
  currentStoreId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  error: string | null;

  activeSubTab: StoreManagementSubTab;
  selectedPlacementSectionId: string;
  sections: StoreSection[];
  curatedProducts: CuratedProduct[];
  kpis: StoreKPIs;
  isAddSectionModalOpen: boolean;

  // Backend sync methods
  fetchStoreManagementData: () => Promise<void>;
  persistStoreData: () => Promise<boolean>;

  // Store Appearance
  storeLogo: string;
  storeBanner: string;
  storeDescription: string;
  storeSlug: string;
  setStoreLogo: (url: string) => void;
  setStoreBanner: (url: string) => void;
  setStoreDescription: (desc: string) => void;
  setStoreSlug: (slug: string) => void;

  // Navigation
  setActiveSubTab: (tab: StoreManagementSubTab) => void;
  setSelectedPlacementSectionId: (id: string) => void;

  // Sections management
  toggleSectionStatus: (id: string) => void;
  updateSectionPriority: (id: string, newPriority: number) => void;
  moveSectionPriority: (id: string, direction: 'up' | 'down') => void;
  reorderSections: (newSections: StoreSection[]) => void;
  addSection: (section: {
    name: string;
    sectionType: 'product' | 'category' | 'banner' | 'brand';
    description?: string;
    isActive: boolean;
    badge?: 'Special' | 'New' | 'Popular' | 'Category' | 'Brand' | 'Default';
  }) => void;
  updateSection: (id: string, updates: Partial<StoreSection>) => void;
  deleteSection: (id: string) => void;

  // Product placement
  addProductToSection: (sectionId: string, productIds: string[]) => void;
  removeProductFromSection: (sectionId: string, productId: string) => void;
  reorderProducts: (sectionId: string, productIds: string[]) => void;
  toggleProductStatus: (productId: string) => void;

  // Modals
  openAddSectionModal: () => void;
  closeAddSectionModal: () => void;
}

const initialSections: StoreSection[] = [
  {
    id: 'sec-1',
    name: "Today's Deal",
    badge: 'Special',
    type: 'Automatic',
    sectionType: 'product',
    productCount: 12,
    isActive: true,
    displayOn: 'Home',
    priority: 1,
    description: 'Limited time offers on top picks',
    productIds: ['prd-1', 'prd-2', 'prd-3', 'prd-4', 'prd-5'],
  },
  {
    id: 'sec-2',
    name: 'New Arrivals',
    badge: 'New',
    type: 'Manual',
    sectionType: 'product',
    productCount: 24,
    isActive: true,
    displayOn: 'Home',
    priority: 2,
    description: 'Check out the latest products',
    productIds: ['prd-6', 'prd-7', 'prd-8'],
  },
  {
    id: 'sec-3',
    name: 'Best Sellers',
    badge: 'Popular',
    type: 'Automatic',
    sectionType: 'product',
    productCount: 20,
    isActive: true,
    displayOn: 'Home',
    priority: 3,
    description: 'Most loved by our customers',
    productIds: ['prd-9', 'prd-10', 'prd-11'],
  },
  {
    id: 'sec-4',
    name: 'Categories',
    badge: 'Category',
    type: 'Manual',
    sectionType: 'category',
    productCount: 8,
    isActive: true,
    displayOn: 'Home',
    priority: 4,
    description: 'Shop by top categories',
    productIds: [],
  },
  {
    id: 'sec-5',
    name: 'Top Rated',
    badge: 'Popular',
    type: 'Automatic',
    sectionType: 'product',
    productCount: 16,
    isActive: true,
    displayOn: 'Home',
    priority: 5,
    description: 'Highly rated products',
    productIds: [],
  },
  {
    id: 'sec-6',
    name: 'Featured Brands',
    badge: 'Brand',
    type: 'Manual',
    sectionType: 'brand',
    productCount: 10,
    isActive: true,
    displayOn: 'Home',
    priority: 6,
    description: 'Top brands in our store',
    productIds: [],
  },
  {
    id: 'sec-7',
    name: 'All Products',
    badge: 'Default',
    type: 'Automatic',
    sectionType: 'product',
    productCount: 110,
    isActive: true,
    isAlwaysOn: true,
    displayOn: 'Home',
    priority: 7,
    description: 'Displays all products in your store',
    productIds: [],
  },
];

const initialCuratedProducts: CuratedProduct[] = [
  {
    id: 'prd-1',
    name: 'boAt Airdopes 131',
    sku: 'PRD-BAT131',
    price: 799,
    originalPrice: 1299,
    discount: '38% OFF',
    stock: 45,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
  },
  {
    id: 'prd-2',
    name: 'Noise ColorFit Pulse',
    sku: 'PRD-NCFPULSE',
    price: 1199,
    originalPrice: 1999,
    discount: '40% OFF',
    stock: 32,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    category: 'Wearables',
  },
  {
    id: 'prd-3',
    name: 'AGARO Hair Dryer',
    sku: 'PRD-AGHD001',
    price: 899,
    originalPrice: 1499,
    discount: '40% OFF',
    stock: 28,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    category: 'Personal Care',
  },
  {
    id: 'prd-4',
    name: 'boAt Stone 650',
    sku: 'PRD-BOAT650',
    price: 2299,
    originalPrice: 2999,
    discount: '23% OFF',
    stock: 16,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80',
    category: 'Audio',
  },
  {
    id: 'prd-5',
    name: 'Wild Stone Code',
    sku: 'PRD-WS001',
    price: 599,
    originalPrice: 749,
    discount: '20% OFF',
    stock: 60,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80',
    category: 'Fragrance',
  },
  {
    id: 'prd-6',
    name: 'Puma Sneakers',
    sku: 'PRD-PUMA001',
    price: 2499,
    originalPrice: 3499,
    discount: '28% OFF',
    stock: 18,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    category: 'Footwear',
  },
  {
    id: 'prd-7',
    name: 'Fastrack Watch',
    sku: 'PRD-FT1234',
    price: 1895,
    originalPrice: 2495,
    discount: '24% OFF',
    stock: 15,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80',
    category: 'Accessories',
  },
  {
    id: 'prd-8',
    name: 'Wildcraft Backpack',
    sku: 'PRD-WC001',
    price: 1599,
    originalPrice: 2199,
    discount: '27% OFF',
    stock: 30,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
    category: 'Bags',
  },
  {
    id: 'prd-9',
    name: 'boAt Rockerz 235',
    sku: 'PRD-BOAT235',
    price: 1399,
    originalPrice: 1899,
    discount: '26% OFF',
    stock: 24,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    category: 'Audio',
  },
  {
    id: 'prd-10',
    name: 'Wild Stone Perfume',
    sku: 'PRD-WSP001',
    price: 649,
    originalPrice: 899,
    discount: '27% OFF',
    stock: 40,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=400&q=80',
    category: 'Fragrance',
  },
  {
    id: 'prd-11',
    name: 'Realme Buds T300',
    sku: 'PRD-REALT300',
    price: 1499,
    originalPrice: 1999,
    discount: '25% OFF',
    stock: 22,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=400&q=80',
    category: 'Audio',
  },
];

export const useStoreManagementStore = create<StoreManagementState>((set, get) => ({
  currentStoreId: null,
  isLoading: false,
  isSaving: false,
  lastSavedAt: null,
  error: null,

  activeSubTab: 'overview',
  selectedPlacementSectionId: 'sec-1',
  sections: initialSections,
  curatedProducts: initialCuratedProducts,
  isAddSectionModalOpen: false,

  // Store Appearance
  storeLogo: '',
  storeBanner: '',
  storeDescription: '',
  storeSlug: '',

  fetchStoreManagementData: async () => {
    set({ isLoading: true, error: null });
    try {
      // 1. Load active merchant store
      let storeData: any = null;
      try {
        const res = await storesApi.getMyStore();
        if (Array.isArray(res) && res.length > 0) {
          storeData = res[0];
        } else if (res && typeof res === 'object') {
          storeData = res;
        }
      } catch {
        const stored = localStorage.getItem('current_store');
        if (stored) {
          try {
            storeData = JSON.parse(stored);
          } catch {}
        }
      }

      const storeId = storeData?._id || storeData?.id;
      let loadedSections = initialSections;

      if (storeData?.sections && Array.isArray(storeData.sections) && storeData.sections.length > 0) {
        loadedSections = storeData.sections;
      }

      // 2. Fetch catalog products to populate Curated Products
      let mappedProducts = initialCuratedProducts;
      if (storeId) {
        try {
          const prodRes = await catalogApi.getStoreCatalog(storeId);
          const prodList = Array.isArray(prodRes)
            ? prodRes
            : Array.isArray(prodRes?.products)
            ? prodRes.products
            : Array.isArray(prodRes?.data)
            ? prodRes.data
            : [];

          if (prodList.length > 0) {
            mappedProducts = prodList.map((p: any) => ({
              id: p._id || p.id,
              name: p.name,
              sku: p.sku || `PRD-${(p._id || '').slice(-6).toUpperCase()}`,
              price: p.pricing?.sellingPrice || p.price || 0,
              originalPrice: p.pricing?.mrp || p.originalPrice,
              discount:
                p.pricing?.mrp && p.pricing?.sellingPrice
                  ? `${Math.round(((p.pricing.mrp - p.pricing.sellingPrice) / p.pricing.mrp) * 100)}% OFF`
                  : undefined,
              stock: p.inventory?.stockOnHand ?? p.stock ?? 0,
              isActive: p.isActive ?? true,
              image:
                p.images?.[0]?.url ||
                p.image ||
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
              category: p.category || 'General',
            }));
          }
        } catch (err) {
          console.warn('Could not fetch store products for placement view:', err);
        }
      }

      const activeCount = loadedSections.filter((s) => s.isActive && !s.isAlwaysOn).length;

      set({
        currentStoreId: storeId || null,
        sections: loadedSections,
        curatedProducts: mappedProducts,
        storeLogo: storeData?.logoUrl || '',
        storeBanner: storeData?.bannerUrl || '',
        storeDescription: storeData?.description || '',
        storeSlug: storeData?.slug || '',
        kpis: {
          totalSections: loadedSections.length,
          activeSections: activeCount,
          totalProducts: mappedProducts.length,
          impressions: 12450,
          impressionsGrowth: '+18.4%',
          clicks: 3420,
          clicksGrowth: '+12.1%',
        },
        isLoading: false,
      });
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to load store management data' });
    }
  },

  persistStoreData: async () => {
    const { currentStoreId, sections, storeLogo, storeBanner, storeDescription, storeSlug } = get();
    let targetId = currentStoreId;
    if (!targetId) {
      const raw = localStorage.getItem('current_store');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          targetId = parsed._id || parsed.id;
        } catch {}
      }
    }
    if (!targetId) return false;

    set({ isSaving: true });
    try {
      await storesApi.updateStoreSettings(targetId, {
        sections,
        logoUrl: storeLogo,
        bannerUrl: storeBanner,
        description: storeDescription,
        slug: storeSlug,
      });
      set({ isSaving: false, lastSavedAt: new Date().toISOString() });
      return true;
    } catch (err: any) {
      console.error('Failed to sync store management settings to backend:', err);
      set({ isSaving: false, error: err.message || 'Failed to save store configurations' });
      return false;
    }
  },

  setStoreLogo: (url) => {
    set({ storeLogo: url });
    get().persistStoreData();
  },
  setStoreBanner: (url) => {
    set({ storeBanner: url });
    get().persistStoreData();
  },
  setStoreDescription: (desc) => {
    set({ storeDescription: desc });
    get().persistStoreData();
  },
  setStoreSlug: (slug) => {
    set({ storeSlug: slug });
    get().persistStoreData();
  },

  reorderSections: (newSections) => {
    set({ sections: newSections });
    get().persistStoreData();
  },

  kpis: {
    totalSections: 0,
    activeSections: 0,
    totalProducts: 0,
    impressions: 0,
    impressionsGrowth: '0%',
    clicks: 0,
    clicksGrowth: '0%',
  },

  setActiveSubTab: (tab) => set({ activeSubTab: tab }),

  setSelectedPlacementSectionId: (id) => set({ selectedPlacementSectionId: id }),

  toggleSectionStatus: (id) => {
    set((state) => {
      const updated = state.sections.map((sec) =>
        sec.id === id ? { ...sec, isActive: sec.isAlwaysOn ? true : !sec.isActive } : sec
      );
      const activeCount = updated.filter((s) => s.isActive && !s.isAlwaysOn).length;
      return {
        sections: updated,
        kpis: {
          ...state.kpis,
          activeSections: activeCount,
        },
      };
    });
    get().persistStoreData();
  },

  updateSectionPriority: (id, newPriority) => {
    set((state) => {
      const safePriority = Math.max(1, Math.min(state.sections.length, newPriority));
      const target = state.sections.find((s) => s.id === id);
      if (!target || target.priority === safePriority) return state;

      const oldPriority = target.priority;
      const updated = state.sections.map((sec) => {
        if (sec.id === id) return { ...sec, priority: safePriority };
        if (oldPriority < safePriority && sec.priority > oldPriority && sec.priority <= safePriority) {
          return { ...sec, priority: sec.priority - 1 };
        }
        if (oldPriority > safePriority && sec.priority < oldPriority && sec.priority >= safePriority) {
          return { ...sec, priority: sec.priority + 1 };
        }
        return sec;
      });

      return {
        sections: updated.sort((a, b) => a.priority - b.priority),
      };
    });
    get().persistStoreData();
  },

  moveSectionPriority: (id, direction) => {
    const { sections, updateSectionPriority } = get();
    const section = sections.find((s) => s.id === id);
    if (!section) return;

    if (direction === 'up' && section.priority > 1) {
      updateSectionPriority(id, section.priority - 1);
    } else if (direction === 'down' && section.priority < sections.length) {
      updateSectionPriority(id, section.priority + 1);
    }
  },

  addSection: ({ name, sectionType, description, isActive, badge }) => {
    set((state) => {
      const newPriority = state.sections.length + 1;
      const type: 'Automatic' | 'Manual' =
        sectionType === 'product' || sectionType === 'category' ? 'Manual' : 'Automatic';

      const inferredBadge =
        badge ||
        (sectionType === 'category'
          ? 'Category'
          : sectionType === 'brand'
          ? 'Brand'
          : 'New');

      const newSection: StoreSection = {
        id: `sec-${Date.now()}`,
        name: name.trim(),
        badge: inferredBadge,
        type,
        sectionType,
        productCount: 0,
        isActive,
        priority: newPriority,
        productIds: [],
        description: description?.trim() || '',
      };

      const updated = [...state.sections, newSection].sort((a, b) => a.priority - b.priority);
      return {
        sections: updated,
        isAddSectionModalOpen: false,
        kpis: {
          ...state.kpis,
          totalSections: updated.length,
          activeSections: updated.filter((s) => s.isActive).length,
        },
      };
    });
    get().persistStoreData();
  },

  updateSection: (id, updates) => {
    set((state) => ({
      sections: state.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
    get().persistStoreData();
  },

  deleteSection: (id) => {
    set((state) => {
      const filtered = state.sections
        .filter((s) => s.id !== id)
        .map((sec, idx) => ({ ...sec, priority: idx + 1 }));
      return {
        sections: filtered,
        kpis: {
          ...state.kpis,
          totalSections: filtered.length,
          activeSections: filtered.filter((s) => s.isActive).length,
        },
      };
    });
    get().persistStoreData();
  },

  addProductToSection: (sectionId, productIds) => {
    set((state) => {
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return state;

      const merged = Array.from(new Set([...section.productIds, ...productIds]));
      return {
        sections: state.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                productIds: merged,
                productCount: merged.length,
              }
            : s
        ),
      };
    });
    get().persistStoreData();
  },

  removeProductFromSection: (sectionId, productId) => {
    set((state) => {
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return state;

      const updatedIds = section.productIds.filter((pId) => pId !== productId);
      return {
        sections: state.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                productIds: updatedIds,
                productCount: updatedIds.length,
              }
            : s
        ),
      };
    });
    get().persistStoreData();
  },

  reorderProducts: (sectionId, productIds) => {
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId ? { ...s, productIds, productCount: productIds.length } : s
      ),
    }));
    get().persistStoreData();
  },

  toggleProductStatus: (productId) =>
    set((state) => ({
      curatedProducts: state.curatedProducts.map((p) =>
        p.id === productId ? { ...p, isActive: !p.isActive } : p
      ),
    })),

  openAddSectionModal: () => set({ isAddSectionModalOpen: true }),
  closeAddSectionModal: () => set({ isAddSectionModalOpen: false }),
}));
