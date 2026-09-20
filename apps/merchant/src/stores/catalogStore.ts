import { create } from 'zustand';
import { api } from '../lib/api.js';

export interface StorageLocation {
  warehouse: string;
  room?: string;
  rack?: string;
  shelf?: string;
  bin?: string;
  description?: string;
}

export interface TaxConfig {
  category: string;
  rate: number;
  inclusive: boolean;
  amount?: number;
}

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  subCategory: string;
  productType: string;
  brand: string;
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock';
  price: number;
  costPrice?: number;
  mrp?: number;
  images: string[];
  attributes: Record<string, string>;
  storageLocation: StorageLocation;
  tax: TaxConfig;
  updatedAt: string;
  // Step 1-3 extended fields
  productIdentification?: 'new' | 'existing';
  existingSearchTerm?: string;
  hsnCode?: string;
  description?: string;
  tags?: string[];
  trackInventory?: boolean;
  countryOfOrigin?: string;
  warranty?: string;
  isReturnable?: boolean;
  weight?: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  material?: string;
  careInstructions?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CatalogKPIs {
  totalProducts: number;
  activeProducts: number;
  lowStock: number;
  outOfStock: number;
  draft: number;
  totalChangePct: number;
  activeChangePct: number;
  lowStockChangePct: number;
  outOfStockChangePct: number;
}

export type CatalogViewMode = 'list' | 'wizard' | 'preview';
export type WizardStep = 1 | 2 | 3;

interface CatalogStoreState {
  products: ProductItem[];
  kpis: CatalogKPIs;
  isLoading: boolean;
  error: string | null;

  // Table filtering & search
  searchQuery: string;
  categoryFilter: string;
  subCategoryFilter: string;
  productTypeFilter: string;
  brandFilter: string;
  statusFilter: string;

  // Table Selection & Pagination
  selectedProductIds: string[];
  currentPage: number;
  pageSize: number;

  // View state
  activeView: CatalogViewMode;
  wizardStep: WizardStep;
  draftProduct: Partial<ProductItem>;

  // Modals
  isStockModalOpen: boolean;
  selectedProductForStock: ProductItem | null;
  isPrintLabelModalOpen: boolean;
  selectedProductForLabel: ProductItem | null;
  isDeleteModalOpen: boolean;
  selectedProductForDelete: ProductItem | null;

  // Actions
  fetchProducts: (storeId?: string) => Promise<void>;
  setSearchQuery: (q: string) => void;
  setCategoryFilter: (c: string) => void;
  setSubCategoryFilter: (sc: string) => void;
  setProductTypeFilter: (pt: string) => void;
  setBrandFilter: (b: string) => void;
  setStatusFilter: (s: string) => void;
  clearFilters: () => void;

  setSelectedProductIds: (ids: string[]) => void;
  toggleSelectProduct: (id: string) => void;
  toggleSelectAll: () => void;
  setCurrentPage: (page: number) => void;

  setActiveView: (view: CatalogViewMode) => void;
  setWizardStep: (step: WizardStep) => void;
  updateDraftProduct: (updates: Partial<ProductItem>) => void;
  resetDraftProduct: () => void;
  loadProductIntoDraft: (product: ProductItem) => void;

  saveDraftAsProduct: () => ProductItem;
  duplicateProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  updateStock: (id: string, newStock: number, lowStockThreshold?: number) => void;
  deleteProduct: (id: string) => void;

  // Modal controls
  openStockModal: (product: ProductItem) => void;
  closeStockModal: () => void;
  openPrintLabelModal: (product: ProductItem) => void;
  closePrintLabelModal: () => void;
  openDeleteModal: (product: ProductItem) => void;
  closeDeleteModal: () => void;
}

export function calculateKPIs(products: ProductItem[]): CatalogKPIs {
  const total = products.length;
  const active = products.filter((p) => p.status === 'active').length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStock = products.filter((p) => p.stock <= 0 || p.status === 'out_of_stock').length;
  const draft = products.filter((p) => p.status === 'draft').length;

  return {
    totalProducts: total,
    activeProducts: active,
    lowStock,
    outOfStock,
    draft,
    totalChangePct: 0,
    activeChangePct: 0,
    lowStockChangePct: 0,
    outOfStockChangePct: 0,
  };
}

export function mapApiProductToProductItem(p: any): ProductItem {
  const primaryVariant = p.variants?.[0] || {};
  const images: string[] = [];
  if (Array.isArray(p.variants)) {
    p.variants.forEach((v: any) => {
      if (Array.isArray(v.images)) images.push(...v.images);
    });
  }
  if (images.length === 0 && Array.isArray(p.images)) {
    images.push(...p.images);
  }
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80');
  }

  const stock = typeof p.totalStock === 'number' ? p.totalStock : primaryVariant.stock || 0;
  const status: 'active' | 'inactive' | 'draft' | 'out_of_stock' =
    stock <= 0 ? 'out_of_stock' : p.status || (p.isActive === false ? 'inactive' : 'active');

  const attributesMap: Record<string, string> = {};
  if (Array.isArray(p.attributes)) {
    p.attributes.forEach((attr: any) => {
      if (attr.key && attr.value) attributesMap[attr.key] = attr.value;
    });
  }

  return {
    id: p._id || p.id,
    name: p.name || 'Product',
    sku: primaryVariant.sku || `SKU-${(p._id || '').slice(-6)}`,
    barcode: p.barcode || primaryVariant.barcode || '8901234567890',
    category: p.category || 'General',
    subCategory: p.subCategory || 'General',
    productType: p.subType || p.subCategory || 'Standard',
    brand: p.brand || 'Generic',
    stock: stock,
    lowStockThreshold: p.lowStockThreshold || 10,
    status: status,
    price: p.basePrice || primaryVariant.price || 0,
    costPrice: Math.round((p.basePrice || primaryVariant.price || 0) * 0.6),
    mrp: p.baseMrp || primaryVariant.mrp || p.basePrice || 0,
    images: images,
    attributes: attributesMap,
    storageLocation: p.storageLocation || {
      warehouse: 'Main Warehouse',
      room: 'Room 101',
      rack: 'R-05',
      shelf: 'S-02',
      bin: 'B-03',
      description: 'Standard storage location',
    },
    tax: p.tax || {
      category: 'GST Standard (18%)',
      rate: 18,
      inclusive: true,
      amount: Math.round((p.basePrice || 0) * 0.18),
    },
    updatedAt: p.updatedAt
      ? new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(new Date(p.updatedAt))
      : 'Recent',
    productIdentification: 'new',
    hsnCode: p.hsnCode || '61091000',
    description: p.description || '',
    tags: p.tags || [],
    trackInventory: true,
    countryOfOrigin: 'India',
    warranty: 'Standard Manufacturer Warranty',
    isReturnable: true,
    weight: '0.250',
    dimensions: { length: '30', width: '20', height: '2' },
    material: 'Standard Material',
    careInstructions: 'Handle with care',
    metaTitle: p.name,
    metaDescription: p.description,
  };
}

const initialDefaultDraft: Partial<ProductItem> = {
  id: '',
  name: '',
  sku: `PRD-${new Date().toISOString().slice(0, 10)}-${Math.floor(100000 + Math.random() * 900000)}`,
  barcode: '8901234567890',
  category: 'Fashion',
  subCategory: 'Apparel',
  productType: 'Clothing',
  brand: 'Brand',
  stock: 10,
  lowStockThreshold: 5,
  status: 'active',
  price: 499,
  costPrice: 250,
  mrp: 699,
  images: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
  ],
  attributes: {},
  storageLocation: {
    warehouse: 'Main Warehouse',
    room: 'Room 101',
    rack: 'R-01',
    shelf: 'S-01',
    bin: 'B-01',
    description: 'Standard shelf',
  },
  tax: {
    category: 'GST (18%)',
    rate: 18,
    inclusive: true,
    amount: 90,
  },
  productIdentification: 'new',
  hsnCode: '61091000',
  description: '',
  tags: [],
  trackInventory: true,
  countryOfOrigin: 'India',
  warranty: 'No Warranty',
  isReturnable: true,
  weight: '0.250',
  dimensions: { length: '30', width: '20', height: '2' },
  material: 'Cotton',
  careInstructions: 'Hand wash cold',
  metaTitle: '',
  metaDescription: '',
};

export const useCatalogStore = create<CatalogStoreState>((set, get) => ({
  products: [],
  kpis: {
    totalProducts: 0,
    activeProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    draft: 0,
    totalChangePct: 0,
    activeChangePct: 0,
    lowStockChangePct: 0,
    outOfStockChangePct: 0,
  },
  isLoading: false,
  error: null,

  // Table filtering & search
  searchQuery: '',
  categoryFilter: 'All Categories',
  subCategoryFilter: 'All Sub-categories',
  productTypeFilter: 'All Product Types',
  brandFilter: 'All Brands',
  statusFilter: 'All Status',

  // Table Selection & Pagination
  selectedProductIds: [],
  currentPage: 1,
  pageSize: 8,

  // View state
  activeView: 'list',
  wizardStep: 1,
  draftProduct: initialDefaultDraft,

  // Modals
  isStockModalOpen: false,
  selectedProductForStock: null,
  isPrintLabelModalOpen: false,
  selectedProductForLabel: null,
  isDeleteModalOpen: false,
  selectedProductForDelete: null,

  fetchProducts: async (storeId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const endpoint = storeId ? `/catalog/stores/${storeId}/products` : '/catalog/products?limit=100';
      const rawData = await api.get<any>(endpoint);
      const productList = Array.isArray(rawData) ? rawData : rawData?.products || rawData?.data || [];
      const mapped = productList.map(mapApiProductToProductItem);
      const computedKpis = calculateKPIs(mapped);
      set({ products: mapped, kpis: computedKpis, isLoading: false });
    } catch (err: any) {
      console.warn('Could not fetch products from API:', err?.message || err);
      set({ products: [], kpis: calculateKPIs([]), isLoading: false, error: err?.message || 'Failed to fetch products' });
    }
  },

  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter, currentPage: 1 }),
  setSubCategoryFilter: (subCategoryFilter) => set({ subCategoryFilter, currentPage: 1 }),
  setProductTypeFilter: (productTypeFilter) => set({ productTypeFilter, currentPage: 1 }),
  setBrandFilter: (brandFilter) => set({ brandFilter, currentPage: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, currentPage: 1 }),
  clearFilters: () =>
    set({
      searchQuery: '',
      categoryFilter: 'All Categories',
      subCategoryFilter: 'All Sub-categories',
      productTypeFilter: 'All Product Types',
      brandFilter: 'All Brands',
      statusFilter: 'All Status',
      currentPage: 1,
    }),

  setSelectedProductIds: (selectedProductIds) => set({ selectedProductIds }),
  toggleSelectProduct: (id) =>
    set((state) => {
      const exists = state.selectedProductIds.includes(id);
      return {
        selectedProductIds: exists
          ? state.selectedProductIds.filter((item) => item !== id)
          : [...state.selectedProductIds, id],
      };
    }),
  toggleSelectAll: () =>
    set((state) => {
      if (state.selectedProductIds.length === state.products.length) {
        return { selectedProductIds: [] };
      }
      return { selectedProductIds: state.products.map((p) => p.id) };
    }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  setActiveView: (activeView) => set({ activeView }),
  setWizardStep: (wizardStep) => set({ wizardStep }),
  updateDraftProduct: (updates) =>
    set((state) => ({
      draftProduct: { ...state.draftProduct, ...updates },
    })),
  resetDraftProduct: () =>
    set({
      draftProduct: {
        ...initialDefaultDraft,
        id: '',
        sku: `PRD-${new Date().toISOString().slice(0, 10)}-${Math.floor(100000 + Math.random() * 900000)}`,
        name: '',
        barcode: String(Math.floor(8900000000000 + Math.random() * 99999999999)),
      },
      wizardStep: 1,
    }),
  loadProductIntoDraft: (product) =>
    set({
      draftProduct: { ...product },
      wizardStep: 1,
      activeView: 'wizard',
    }),

  saveDraftAsProduct: () => {
    const { draftProduct, products } = get();
    const existingIndex = products.findIndex((p) => p.id === draftProduct.id);

    const nowStr = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());

    const finalizedProduct: ProductItem = {
      id: draftProduct.id || `prd-${Date.now()}`,
      name: draftProduct.name || 'Untitled Product',
      sku: draftProduct.sku || `PRD-${Date.now()}`,
      barcode: draftProduct.barcode || '8901234567890',
      category: draftProduct.category || 'Fashion',
      subCategory: draftProduct.subCategory || 'Apparel',
      productType: draftProduct.productType || 'Clothing',
      brand: draftProduct.brand || 'Generic',
      stock: Number(draftProduct.stock ?? 100),
      lowStockThreshold: Number(draftProduct.lowStockThreshold ?? 10),
      status: draftProduct.status || 'active',
      price: Number(draftProduct.price ?? 599),
      costPrice: Number(draftProduct.costPrice ?? 350),
      mrp: Number(draftProduct.mrp ?? 899),
      images: draftProduct.images?.length
        ? draftProduct.images
        : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'],
      attributes: draftProduct.attributes || {
        fit: 'Regular',
        color: 'Black',
        size: 'M',
      },
      storageLocation: draftProduct.storageLocation || {
        warehouse: 'Main Warehouse',
        room: 'Room 101',
        rack: 'R-05',
        shelf: 'S-02',
        bin: 'B-03',
      },
      tax: draftProduct.tax || {
        category: 'GST (18%)',
        rate: 18,
        inclusive: true,
        amount: 28.52,
      },
      updatedAt: nowStr,
      hsnCode: draftProduct.hsnCode || '61091000',
      description: draftProduct.description || '',
      tags: draftProduct.tags || [],
      countryOfOrigin: draftProduct.countryOfOrigin || 'India',
      warranty: draftProduct.warranty || 'Standard Warranty',
      isReturnable: draftProduct.isReturnable ?? true,
      weight: draftProduct.weight || '0.250',
      dimensions: draftProduct.dimensions || { length: '30', width: '20', height: '2' },
      material: draftProduct.material || 'Cotton',
      careInstructions: draftProduct.careInstructions || 'Standard care',
      metaTitle: draftProduct.metaTitle || draftProduct.name,
      metaDescription: draftProduct.metaDescription || draftProduct.description,
    };

    let updatedList: ProductItem[];
    if (existingIndex >= 0) {
      updatedList = [...products];
      updatedList[existingIndex] = finalizedProduct;
    } else {
      updatedList = [finalizedProduct, ...products];
    }
    set({ products: updatedList, kpis: calculateKPIs(updatedList), activeView: 'list' });

    return finalizedProduct;
  },

  duplicateProduct: (id) =>
    set((state) => {
      const target = state.products.find((p) => p.id === id);
      if (!target) return {};
      const newSku = `${target.sku.replace(/-copy.*$/, '')}-copy-${Math.floor(100 + Math.random() * 900)}`;
      const duplicated: ProductItem = {
        ...target,
        id: `prd-${Date.now()}`,
        name: `${target.name} (Copy)`,
        sku: newSku,
        status: 'draft',
        barcode: String(Math.floor(8900000000000 + Math.random() * 99999999999)),
        updatedAt: 'Just now',
      };
      const updatedList = [duplicated, ...state.products];
      return { products: updatedList, kpis: calculateKPIs(updatedList) };
    }),

  toggleProductStatus: (id) =>
    set((state) => {
      const updatedList = state.products.map((p) =>
        p.id === id ? { ...p, status: (p.status === 'active' ? 'inactive' : 'active') as any } : p
      );
      return { products: updatedList, kpis: calculateKPIs(updatedList) };
    }),

  updateStock: (id, newStock, lowStockThreshold) =>
    set((state) => {
      const updatedList = state.products.map((p) =>
        p.id === id
          ? {
              ...p,
              stock: newStock,
              status: (newStock <= 0 ? 'out_of_stock' : p.status === 'out_of_stock' ? 'active' : p.status) as any,
              lowStockThreshold: lowStockThreshold !== undefined ? lowStockThreshold : p.lowStockThreshold,
              updatedAt: 'Just now',
            }
          : p
      );
      return { products: updatedList, kpis: calculateKPIs(updatedList) };
    }),

  deleteProduct: (id) =>
    set((state) => {
      const updatedList = state.products.filter((p) => p.id !== id);
      return {
        products: updatedList,
        kpis: calculateKPIs(updatedList),
        selectedProductIds: state.selectedProductIds.filter((item) => item !== id),
      };
    }),

  openStockModal: (product) =>
    set({ isStockModalOpen: true, selectedProductForStock: product }),
  closeStockModal: () =>
    set({ isStockModalOpen: false, selectedProductForStock: null }),

  openPrintLabelModal: (product) =>
    set({ isPrintLabelModalOpen: true, selectedProductForLabel: product }),
  closePrintLabelModal: () =>
    set({ isPrintLabelModalOpen: false, selectedProductForLabel: null }),

  openDeleteModal: (product) =>
    set({ isDeleteModalOpen: true, selectedProductForDelete: product }),
  closeDeleteModal: () =>
    set({ isDeleteModalOpen: false, selectedProductForDelete: null }),
}));
