import { create } from 'zustand';
import { api, catalogApi } from '../lib/api.js';
import { useAuthStore } from './authStore.js';

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

  saveDraftAsProduct: () => Promise<ProductItem>;
  duplicateProduct: (id: string) => void;
  toggleProductStatus: (id: string) => Promise<void>;
  updateStock: (id: string, newStock: number, lowStockThreshold?: number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

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
      let activeStoreId =
        storeId ||
        useAuthStore.getState().currentStore?._id ||
        useAuthStore.getState().currentStore?.id;

      if (!activeStoreId) {
        try {
          const stores = await api.get<any[]>('/stores/mine');
          if (Array.isArray(stores) && stores.length > 0) {
            activeStoreId = stores[0]._id || stores[0].id;
            useAuthStore.getState().setCurrentStore(stores[0]);
          }
        } catch {
          // Fallback to public products if not logged in
        }
      }

      const endpoint = activeStoreId
        ? `/catalog/stores/${activeStoreId}/products`
        : '/catalog/products?limit=100';

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

  saveDraftAsProduct: async () => {
    const { draftProduct, products } = get();

    // 1. Resolve storeId
    let storeId =
      useAuthStore.getState().currentStore?._id ||
      useAuthStore.getState().currentStore?.id;

    if (!storeId) {
      try {
        const stores = await api.get<any[]>('/stores/mine');
        if (Array.isArray(stores) && stores.length > 0) {
          storeId = stores[0]._id || stores[0].id;
          useAuthStore.getState().setCurrentStore(stores[0]);
        }
      } catch (e) {
        console.warn('Could not fetch merchant store for product creation:', e);
      }
    }

    // 2. Prepare attributes array
    const attributesArray = Object.entries(draftProduct.attributes || {})
      .filter(([k, v]) => k && v)
      .map(([key, value]) => ({
        key: String(key).trim(),
        value: String(value).trim(),
      }));

    // 3. Fallback sample image if none provided
    const defaultImage =
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';
    const images =
      draftProduct.images && draftProduct.images.length > 0
        ? draftProduct.images
        : [defaultImage];

    // 4. Construct variant
    const variant = {
      sku: (draftProduct.sku || `PRD-${Date.now()}`).toUpperCase(),
      size: draftProduct.attributes?.size || 'Standard',
      color: draftProduct.attributes?.color || 'Standard',
      price: Number(draftProduct.price ?? 599),
      mrp: Number(draftProduct.mrp ?? draftProduct.price ?? 699),
      stock: Number(draftProduct.stock ?? 10),
      images,
      isActive: draftProduct.status !== 'inactive',
    };

    const payload = {
      storeId,
      name: draftProduct.name || 'Untitled Product',
      description: draftProduct.description || '',
      category: (draftProduct.category || 'fashion').toLowerCase().trim().replace(/[\s-]+/g, '_'),
      subCategory: draftProduct.subCategory || 'Apparel',
      subType: draftProduct.productType
        ? draftProduct.productType.toLowerCase().trim().replace(/[\s-]+/g, '_')
        : undefined,
      brand: draftProduct.brand || 'Generic',
      tags: draftProduct.tags || [],
      attributes: attributesArray,
      variants: [variant],
      isFeatured: false,
    };

    let finalizedProduct: ProductItem;
    try {
      if (draftProduct.id && /^[0-9a-fA-F]{24}$/.test(draftProduct.id)) {
        const updated = await catalogApi.updateProduct(draftProduct.id, payload);
        finalizedProduct = mapApiProductToProductItem(updated);
      } else {
        const created = await catalogApi.createProduct(payload);
        finalizedProduct = mapApiProductToProductItem(created);
      }
    } catch (err: any) {
      console.warn('Could not persist product to backend API, using local fallback:', err?.message || err);
      const nowStr = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(new Date());

      finalizedProduct = {
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
        images,
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
    }

    const existingIndex = products.findIndex((p) => p.id === finalizedProduct.id);
    let updatedList: ProductItem[];
    if (existingIndex >= 0) {
      updatedList = [...products];
      updatedList[existingIndex] = finalizedProduct;
    } else {
      updatedList = [finalizedProduct, ...products];
    }
    set({
      products: updatedList,
      kpis: calculateKPIs(updatedList),
      activeView: 'list',
      draftProduct: initialDefaultDraft,
    });

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

  toggleProductStatus: async (id) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    try {
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        await catalogApi.updateProduct(id, { isActive: newStatus === 'active' });
      }
    } catch (err) {
      console.warn('Failed to toggle product status on server:', err);
    }
    set((state) => {
      const updatedList = state.products.map((p) =>
        p.id === id ? { ...p, status: newStatus as any } : p
      );
      return { products: updatedList, kpis: calculateKPIs(updatedList) };
    });
  },

  updateStock: async (id, newStock, lowStockThreshold) => {
    try {
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        const product = get().products.find((p) => p.id === id);
        if (product) {
          const updatedVariants = [
            {
              sku: product.sku,
              price: product.price,
              mrp: product.mrp || product.price,
              stock: newStock,
              images: product.images,
              isActive: product.status !== 'inactive',
            },
          ];
          await catalogApi.updateProduct(id, { variants: updatedVariants });
        }
      }
    } catch (err) {
      console.warn('Failed to update product stock on server:', err);
    }
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
    });
  },

  deleteProduct: async (id) => {
    try {
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        await catalogApi.deleteProduct(id);
      }
    } catch (err) {
      console.warn('Failed to delete product from server:', err);
    }
    set((state) => {
      const updatedList = state.products.filter((p) => p.id !== id);
      return {
        products: updatedList,
        kpis: calculateKPIs(updatedList),
        selectedProductIds: state.selectedProductIds.filter((item) => item !== id),
      };
    });
  },

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
