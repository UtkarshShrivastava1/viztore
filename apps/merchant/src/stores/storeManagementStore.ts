import { create } from 'zustand';

export interface StoreSection {
  id: string;
  name: string;
  badge?: 'Special' | 'New' | 'Popular' | 'Category' | 'Brand';
  type: 'Automatic' | 'Manual';
  sectionType: 'product' | 'category' | 'banner' | 'brand';
  productCount: number;
  isActive: boolean;
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

export type StoreManagementSubTab = 'sections' | 'placement' | 'view_settings';

interface StoreManagementState {
  activeSubTab: StoreManagementSubTab;
  selectedPlacementSectionId: string;
  sections: StoreSection[];
  curatedProducts: CuratedProduct[];
  kpis: StoreKPIs;
  isAddSectionModalOpen: boolean;

  // Navigation
  setActiveSubTab: (tab: StoreManagementSubTab) => void;
  setSelectedPlacementSectionId: (id: string) => void;

  // Sections management
  toggleSectionStatus: (id: string) => void;
  updateSectionPriority: (id: string, newPriority: number) => void;
  moveSectionPriority: (id: string, direction: 'up' | 'down') => void;
  addSection: (section: {
    name: string;
    sectionType: 'product' | 'category' | 'banner' | 'brand';
    description?: string;
    isActive: boolean;
    badge?: 'Special' | 'New' | 'Popular' | 'Category' | 'Brand';
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
    priority: 6,
    description: 'Top brands in our store',
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
  activeSubTab: 'sections',
  selectedPlacementSectionId: 'sec-1',
  sections: initialSections,
  curatedProducts: initialCuratedProducts,
  isAddSectionModalOpen: false,

  kpis: {
    totalSections: 6,
    activeSections: 5,
    totalProducts: 110,
    impressions: 45230,
    impressionsGrowth: '↑ 18.6% vs last 30 days',
    clicks: 8450,
    clicksGrowth: '↑ 22.1% vs last 30 days',
  },

  setActiveSubTab: (tab) => set({ activeSubTab: tab }),

  setSelectedPlacementSectionId: (id) => set({ selectedPlacementSectionId: id }),

  toggleSectionStatus: (id) =>
    set((state) => {
      const updated = state.sections.map((sec) =>
        sec.id === id ? { ...sec, isActive: !sec.isActive } : sec
      );
      const activeCount = updated.filter((s) => s.isActive).length;
      return {
        sections: updated,
        kpis: {
          ...state.kpis,
          activeSections: activeCount,
        },
      };
    }),

  updateSectionPriority: (id, newPriority) =>
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
    }),

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

  addSection: ({ name, sectionType, description, isActive, badge }) =>
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
    }),

  updateSection: (id, updates) =>
    set((state) => ({
      sections: state.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),

  deleteSection: (id) =>
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
    }),

  addProductToSection: (sectionId, productIds) =>
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
    }),

  removeProductFromSection: (sectionId, productId) =>
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
    }),

  reorderProducts: (sectionId, productIds) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId ? { ...s, productIds, productCount: productIds.length } : s
      ),
    })),

  toggleProductStatus: (productId) =>
    set((state) => ({
      curatedProducts: state.curatedProducts.map((p) =>
        p.id === productId ? { ...p, isActive: !p.isActive } : p
      ),
    })),

  openAddSectionModal: () => set({ isAddSectionModalOpen: true }),
  closeAddSectionModal: () => set({ isAddSectionModalOpen: false }),
}));
