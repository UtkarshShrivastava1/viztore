import { create } from 'zustand';
import { api, catalogApi } from '../lib/api.js';
import { useAuthStore } from './authStore.js';
import { recordCustomCategory, recordCustomBrand } from '../lib/customTaxonomyStorage.js';
import { isElectronicsCategory, isFootwearCategory, isGroceryCategory, getPreloadedAttributes } from '../lib/taxonomyHelper.js';
import { toast } from './toastStore.js';

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

export interface ProductVariantItem {
  id: string;
  sku: string;
  barcode?: string;
  color?: string;
  colorHex?: string;
  size?: string;
  price: number;
  costPrice?: number;
  mrp: number;
  stock: number;
  isActive: boolean;
  image?: string;
  isCustomPrice?: boolean;
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
  shelfLocation?: string;
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
  variants?: ProductVariantItem[];
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
  setPageSize: (size: number) => void;

  setActiveView: (view: CatalogViewMode) => void;
  setWizardStep: (step: WizardStep) => void;
  updateDraftProduct: (updates: Partial<ProductItem>) => void;
  resetDraftProduct: () => void;
  loadProductIntoDraft: (product: ProductItem) => void;

  saveDraftAsProduct: () => Promise<ProductItem>;
  bulkImportProducts: (productsData: any[]) => Promise<{ created: number; errors: any[] }>;
  duplicateProduct: (id: string) => void;
  toggleProductStatus: (id: string) => Promise<void>;
  updateStock: (id: string, newStock: number, lowStockThreshold?: number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  bulkDeleteSelectedProducts: () => Promise<void>;
  clearSelectedProducts: () => void;

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

export function getColorHex(colorName?: string): string {
  if (!colorName) return '#64748b';
  const name = colorName.toLowerCase().trim();
  const map: Record<string, string> = {
    'space black': '#1c1b1f',
    'black': '#0f172a',
    'natural titanium': '#8e8a84',
    'titanium': '#8e8a84',
    'silver': '#e2e8f0',
    'white': '#ffffff',
    'midnight': '#191f28',
    'starlight': '#f0ece1',
    'deep blue': '#1e3a8a',
    'blue': '#2563eb',
    'navy': '#1e3a8a',
    'navy blue': '#1e3a8a',
    'royal blue': '#2563eb',
    'desert titanium': '#d4bba2',
    'gold': '#ffd700',
    'rose gold': '#b76e79',
    'green': '#15803d',
    'dark green': '#14532d',
    'olive green': '#4d7c0f',
    'red': '#dc2626',
    'crimson red': '#dc2626',
    'maroon': '#800000',
    'yellow': '#eab308',
    'mustard yellow': '#d97706',
    'grey': '#64748b',
    'gray': '#64748b',
    'heather grey': '#64748b',
    'beige': '#f5f5dc',
    'purple': '#9333ea',
    'pink': '#ec4899',
    'orange': '#ea580c',
  };
  return map[name] || '#64748b';
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
    variants: Array.isArray(p.variants)
      ? p.variants.map((v: any, idx: number) => ({
          id: v._id || v.id || `var-${idx}`,
          sku: v.sku || `${p.sku || 'SKU'}-${idx}`,
          size: v.size || '',
          color: v.color || '',
          colorHex: v.colorHex || getColorHex(v.color),
          price: typeof v.price === 'number' ? v.price : (p.basePrice || 0),
          mrp: typeof v.mrp === 'number' ? v.mrp : (p.baseMrp || v.price || p.basePrice || 0),
          stock: typeof v.stock === 'number' ? v.stock : 0,
          isActive: v.isActive !== false,
          image: v.images?.[0] || v.image || images[0],
          barcode: v.barcode || p.barcode,
        }))
      : [],
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
  barcode: '',
  category: '',
  subCategory: '',
  productType: '',
  brand: '',
  stock: 0,
  lowStockThreshold: 5,
  status: 'active',
  price: undefined,
  costPrice: undefined,
  mrp: undefined,
  images: [],
  attributes: {},
  storageLocation: {
    warehouse: '',
    room: '',
    rack: '',
    shelf: '',
    bin: '',
    description: '',
  },
  tax: {
    category: 'Standard (18%)',
    rate: 18,
    inclusive: true,
    amount: 0,
  },
  productIdentification: 'new',
  hsnCode: '',
  description: '',
  tags: [],
  trackInventory: true,
  countryOfOrigin: 'India',
  warranty: '',
  isReturnable: true,
  weight: '',
  dimensions: { length: '', width: '', height: '' },
  material: '',
  careInstructions: '',
  metaTitle: '',
  metaDescription: '',
};

export const initialCatalogMockupProducts: ProductItem[] = [
  {
    id: 'prd-mock-01',
    name: 'Men Black Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-BLK-M',
    barcode: '8901234567890',
    category: "Men's Fashion",
    subCategory: 'T-Shirts',
    productType: 'Round Neck T-Shirt',
    brand: 'Roadster',
    stock: 120,
    lowStockThreshold: 15,
    status: 'active',
    price: 599,
    costPrice: 350,
    mrp: 699,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
    ],
    attributes: {
      size: 'M',
      color: 'Black',
      fit: 'Regular',
      fabric: 'Cotton',
      sleeve: 'Half Sleeve',
      neck: 'Round Neck',
    },
    storageLocation: {
      warehouse: 'Main Warehouse',
      room: 'Room 101',
      rack: 'R-05',
      shelf: 'S-02',
      bin: 'B-03',
      description: 'Near window side, second rack',
    },
    tax: {
      category: 'Apparel (5%)',
      rate: 5,
      inclusive: false,
      amount: 28.52,
    },
    updatedAt: '10 May 2024 10:30 AM',
    productIdentification: 'new',
    hsnCode: '61091000',
    description: 'Premium quality cotton round neck t-shirt for men.',
    tags: ['men t-shirt', 'round neck t-shirt', 'black t-shirt', 'summer wear', 'casual wear'],
    trackInventory: true,
    countryOfOrigin: 'India',
    warranty: 'No Warranty',
    isReturnable: true,
    weight: '0.250',
    dimensions: { length: '30', width: '20', height: '2' },
    material: '100% Cotton',
    careInstructions: 'Machine wash cold, tumble dry low.',
    metaTitle: 'Men Black Round Neck T-Shirt - Cotton Casual Wear',
    metaDescription: 'Buy premium quality men black round neck t-shirt made with 100% cotton. Perfect for summer.',
  },
  {
    id: 'prd-mock-02',
    name: 'Men White Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-WHT-M',
    barcode: '8901234567891',
    category: "Men's Fashion",
    subCategory: 'T-Shirts',
    productType: 'Round Neck T-Shirt',
    brand: 'Roadster',
    stock: 80,
    lowStockThreshold: 15,
    status: 'active',
    price: 599,
    costPrice: 350,
    mrp: 699,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80',
    ],
    attributes: {
      size: 'M',
      color: 'White',
      fit: 'Regular',
      fabric: 'Cotton',
      sleeve: 'Half Sleeve',
      neck: 'Round Neck',
    },
    storageLocation: {
      warehouse: 'Main Warehouse',
      room: 'Room 101',
      rack: 'R-05',
      shelf: 'S-03',
      bin: 'B-04',
    },
    tax: {
      category: 'Apparel (5%)',
      rate: 5,
      inclusive: false,
      amount: 28.52,
    },
    updatedAt: '10 May 2024 10:15 AM',
    productIdentification: 'new',
    hsnCode: '61091000',
    description: 'Crisp white breathable round neck t-shirt for casual everyday styling.',
    tags: ['men t-shirt', 'white t-shirt', 'summer wear'],
    trackInventory: true,
    countryOfOrigin: 'India',
  },
  {
    id: 'prd-mock-03',
    name: 'Men Navy Blue Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-NVY-L',
    barcode: '8901234567892',
    category: "Men's Fashion",
    subCategory: 'T-Shirts',
    productType: 'Round Neck T-Shirt',
    brand: 'Roadster',
    stock: 60,
    lowStockThreshold: 15,
    status: 'active',
    price: 599,
    costPrice: 350,
    mrp: 699,
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
    ],
    attributes: {
      size: 'L',
      color: 'Navy Blue',
      fit: 'Slim Fit',
      fabric: 'Cotton',
      sleeve: 'Half Sleeve',
      neck: 'Round Neck',
    },
    storageLocation: {
      warehouse: 'Main Warehouse',
      rack: 'R-06',
      shelf: 'S-01',
    },
    tax: {
      category: 'Apparel (5%)',
      rate: 5,
      inclusive: false,
      amount: 28.52,
    },
    updatedAt: '09 May 2024 05:45 PM',
    productIdentification: 'new',
    hsnCode: '61091000',
    description: 'Deep navy blue solid t-shirt with ribbed neck finish.',
    tags: ['men t-shirt', 'navy blue', 'casual wear'],
    trackInventory: true,
    countryOfOrigin: 'India',
  },
  {
    id: 'prd-mock-04',
    name: 'Men Grey Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-GRY-M',
    barcode: '8901234567893',
    category: "Men's Fashion",
    subCategory: 'T-Shirts',
    productType: 'Round Neck T-Shirt',
    brand: 'Roadster',
    stock: 45,
    lowStockThreshold: 15,
    status: 'active',
    price: 599,
    costPrice: 350,
    mrp: 699,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    ],
    attributes: {
      size: 'M',
      color: 'Grey',
      fit: 'Regular',
      fabric: 'Cotton Blend',
      sleeve: 'Half Sleeve',
      neck: 'Round Neck',
    },
    storageLocation: {
      warehouse: 'Main Warehouse',
      rack: 'R-06',
      shelf: 'S-02',
    },
    tax: {
      category: 'Apparel (5%)',
      rate: 5,
      inclusive: false,
      amount: 28.52,
    },
    updatedAt: '09 May 2024 04:20 PM',
    productIdentification: 'new',
    hsnCode: '61091000',
    description: 'Melange heather grey crew neck t-shirt.',
    tags: ['men t-shirt', 'grey t-shirt'],
    trackInventory: true,
    countryOfOrigin: 'India',
  },
  {
    id: 'prd-mock-05',
    name: 'Men Black Polo T-Shirt',
    sku: 'PRD-POLO-BLK-M',
    barcode: '8901234567894',
    category: "Men's Fashion",
    subCategory: 'T-Shirts',
    productType: 'Polo T-Shirt',
    brand: 'Roadster',
    stock: 30,
    lowStockThreshold: 15,
    status: 'inactive',
    price: 649,
    costPrice: 390,
    mrp: 799,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    ],
    attributes: {
      size: 'M',
      color: 'Black',
      fit: 'Slim Fit',
      fabric: 'Pique Cotton',
      sleeve: 'Half Sleeve',
      neck: 'Polo Neck',
    },
    storageLocation: {
      warehouse: 'Main Warehouse',
      rack: 'R-07',
      shelf: 'S-01',
    },
    tax: {
      category: 'Apparel (5%)',
      rate: 5,
      inclusive: false,
      amount: 30.9,
    },
    updatedAt: '08 May 2024 11:10 AM',
    productIdentification: 'new',
    hsnCode: '61091000',
    description: 'Classic polo collar t-shirt with two-button placket.',
    tags: ['polo', 'black polo', 'men t-shirt'],
    trackInventory: true,
    countryOfOrigin: 'India',
  },
  {
    id: 'prd-mock-06',
    name: 'Men Maroon Polo T-Shirt',
    sku: 'PRD-POLO-MRN-L',
    barcode: '8901234567895',
    category: "Men's Fashion",
    subCategory: 'T-Shirts',
    productType: 'Polo T-Shirt',
    brand: 'Roadster',
    stock: 25,
    lowStockThreshold: 10,
    status: 'active',
    price: 649,
    costPrice: 390,
    mrp: 799,
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
    ],
    attributes: {
      size: 'L',
      color: 'Maroon',
      fit: 'Regular',
      fabric: 'Pique Cotton',
      sleeve: 'Half Sleeve',
      neck: 'Polo Neck',
    },
    storageLocation: {
      warehouse: 'Main Warehouse',
      rack: 'R-07',
      shelf: 'S-02',
    },
    tax: {
      category: 'Apparel (5%)',
      rate: 5,
      inclusive: false,
      amount: 30.9,
    },
    updatedAt: '08 May 2024 10:05 AM',
    productIdentification: 'new',
    hsnCode: '61091000',
    description: 'Rich maroon pique cotton polo shirt.',
    tags: ['polo', 'maroon', 'men apparel'],
    trackInventory: true,
    countryOfOrigin: 'India',
  },
  {
    id: 'prd-mock-07',
    name: 'Men Blue Henley T-Shirt',
    sku: 'PRD-HENLEY-BLU-M',
    barcode: '8901234567896',
    category: "Men's Fashion",
    subCategory: 'T-Shirts',
    productType: 'Henley T-Shirt',
    brand: 'Roadster',
    stock: 20,
    lowStockThreshold: 10,
    status: 'active',
    price: 699,
    costPrice: 420,
    mrp: 899,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    ],
    attributes: {
      size: 'M',
      color: 'Blue',
      fit: 'Regular',
      fabric: 'Slub Cotton',
      sleeve: 'Half Sleeve',
      neck: 'Henley Neck',
    },
    storageLocation: {
      warehouse: 'Main Warehouse',
      rack: 'R-08',
      shelf: 'S-01',
    },
    tax: {
      category: 'Apparel (5%)',
      rate: 5,
      inclusive: false,
      amount: 33.28,
    },
    updatedAt: '07 May 2024 03:30 PM',
    productIdentification: 'new',
    hsnCode: '61091000',
    description: 'Button placket casual henley tee.',
    tags: ['henley', 'blue t-shirt'],
    trackInventory: true,
    countryOfOrigin: 'India',
  },
  {
    id: 'prd-mock-08',
    name: 'Men Striped Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-STP-M',
    barcode: '8901234567897',
    category: "Men's Fashion",
    subCategory: 'T-Shirts',
    productType: 'Round Neck T-Shirt',
    brand: 'Roadster',
    stock: 15,
    lowStockThreshold: 10,
    status: 'inactive',
    price: 599,
    costPrice: 350,
    mrp: 699,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80',
    ],
    attributes: {
      size: 'M',
      color: 'White/Black',
      fit: 'Regular',
      fabric: 'Cotton',
      sleeve: 'Half Sleeve',
      neck: 'Round Neck',
    },
    storageLocation: {
      warehouse: 'Main Warehouse',
      rack: 'R-08',
      shelf: 'S-02',
    },
    tax: {
      category: 'Apparel (5%)',
      rate: 5,
      inclusive: false,
      amount: 28.52,
    },
    updatedAt: '07 May 2024 02:15 PM',
    productIdentification: 'new',
    hsnCode: '61091000',
    description: 'Breton horizontal striped monochrome t-shirt.',
    tags: ['striped', 'men t-shirt'],
    trackInventory: true,
    countryOfOrigin: 'India',
  },
];

export const initialDefaultKpis: CatalogKPIs = {
  totalProducts: 0,
  activeProducts: 0,
  lowStock: 0,
  outOfStock: 0,
  draft: 0,
  totalChangePct: 0,
  activeChangePct: 0,
  lowStockChangePct: 0,
  outOfStockChangePct: 0,
};

export const useCatalogStore = create<CatalogStoreState>((set, get) => ({
  products: [],
  kpis: initialDefaultKpis,
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

      if (!activeStoreId) {
        set({ products: [], kpis: initialDefaultKpis, isLoading: false });
        return;
      }

      const endpoint = `/catalog/stores/${activeStoreId}/products`;
      const rawData = await api.get<any>(endpoint);
      const productList = Array.isArray(rawData) ? rawData : rawData?.products || rawData?.data || [];
      const mapped = productList.map(mapApiProductToProductItem);
      const computedKpis = calculateKPIs(mapped);
      set({ products: mapped, kpis: computedKpis, isLoading: false });
    } catch (err: any) {
      console.warn('Could not fetch products from API:', err?.message || err);
      set({ products: [], kpis: initialDefaultKpis, isLoading: false, error: null });
    }
  },

  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setCategoryFilter: (categoryFilter) =>
    set({
      categoryFilter,
      subCategoryFilter: 'All Sub-categories',
      productTypeFilter: 'All Product Types',
      currentPage: 1,
    }),
  setSubCategoryFilter: (subCategoryFilter) =>
    set({
      subCategoryFilter,
      productTypeFilter: 'All Product Types',
      currentPage: 1,
    }),
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
  setPageSize: (pageSize) => set({ pageSize, currentPage: 1 }),

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
  loadProductIntoDraft: (product) => {
    const rawImages = Array.isArray(product.images) && product.images.length > 0
      ? [...product.images]
      : ((product as any).imageUrl ? [(product as any).imageUrl] : []);

    const normalizedAttributes: Record<string, string> = {};
    if (product.attributes && typeof product.attributes === 'object') {
      if (Array.isArray(product.attributes)) {
        (product.attributes as any[]).forEach((attr: any) => {
          if (attr.key && attr.value) normalizedAttributes[attr.key] = String(attr.value);
        });
      } else {
        Object.entries(product.attributes).forEach(([k, v]) => {
          normalizedAttributes[k] = String(v);
        });
      }
    }

    set({
      draftProduct: {
        ...product,
        price: product.price ?? 0,
        mrp: product.mrp ?? product.price ?? 0,
        costPrice: product.costPrice ?? Math.round(Number(product.price || 0) * 0.7),
        stock: product.stock ?? 0,
        lowStockThreshold: product.lowStockThreshold ?? 10,
        images: rawImages,
        tags: Array.isArray(product.tags) ? [...product.tags] : [],
        attributes: normalizedAttributes,
        hsnCode: product.hsnCode || '',
        barcode: product.barcode || '',
        sku: product.sku || '',
        name: product.name || '',
        category: product.category || 'fashion',
        subCategory: product.subCategory || '',
        productType: product.productType || '',
        brand: product.brand || '',
      },
      wizardStep: 1,
      activeView: 'wizard',
    });
  },

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

    // 4. Construct variants (single or multi-variant matrix)
    const baseSku = (draftProduct.sku || `PRD-${Date.now()}`).toUpperCase();
    const hasVariants = draftProduct.attributes?.hasVariants === 'true';
    const effectiveBasePrice = Number(draftProduct.price || 0);
    const effectiveBaseMrp = Number(draftProduct.mrp || draftProduct.price || 0);
    let variants = [];

    if (hasVariants && Array.isArray(draftProduct.variants) && draftProduct.variants.length > 0) {
      // Use existing user-configured variants from VariantMatrixBuilder
      variants = draftProduct.variants.map((v, i) => {
        // Authoritative resolution:
        // If variant has an explicit custom price, use it;
        // If effectiveBasePrice is set (> 0) and variant does not have custom override, use effectiveBasePrice!
        const vPrice = (v.isCustomPrice && typeof v.price === 'number' && v.price > 0)
          ? Number(v.price)
          : (effectiveBasePrice > 0 ? effectiveBasePrice : Number(v.price || 0));

        const vMrp = (v.isCustomPrice && typeof v.mrp === 'number' && v.mrp > 0)
          ? Number(v.mrp)
          : (effectiveBaseMrp > 0 ? effectiveBaseMrp : Number(v.mrp || vPrice || 0));

        const hex = v.colorHex || getColorHex(v.color);
        return {
          id: v.id || `var-${Date.now()}-${i}`,
          sku: (v.sku || `${baseSku}-${v.size || v.color || 'VAR'}`).toUpperCase(),
          size: v.size || 'Standard',
          color: v.color || 'Standard',
          ...(hex ? { colorHex: hex } : {}),
          price: vPrice,
          mrp: vMrp,
          stock: Number(v.stock ?? 10),
          images: v.image ? [v.image] : images,
          image: v.image || images[0],
          isActive: v.isActive !== false,
          isCustomPrice: v.isCustomPrice,
        };
      });
    } else if (hasVariants) {
      // Intelligent category-aware fallback if rows were not generated
      const isElect = isElectronicsCategory(draftProduct.category, draftProduct.subCategory);
      const isFoot = isFootwearCategory(draftProduct.category, draftProduct.subCategory);
      const isGroc = isGroceryCategory(draftProduct.category, draftProduct.subCategory);

      const primaryOptions = isElect
        ? ['128 GB', '256 GB', '512 GB']
        : isFoot
          ? ['UK 7', 'UK 8', 'UK 9']
          : isGroc
            ? ['500g', '1 kg', '2 kg']
            : ['S', 'M', 'L', 'XL'];

      const fallbackColor = draftProduct.attributes?.color || (isElect ? 'Space Black' : 'Black');
      const hex = getColorHex(fallbackColor);

      variants = primaryOptions.map((opt, i) => ({
        id: `var-${Date.now()}-${i}`,
        sku: `${baseSku}-${opt.replace(/[^a-zA-Z0-9]/g, '')}`,
        size: opt,
        color: fallbackColor,
        ...(hex ? { colorHex: hex } : {}),
        price: effectiveBasePrice,
        mrp: effectiveBaseMrp,
        stock: Math.max(1, Math.floor(Number(draftProduct.stock ?? 10) / primaryOptions.length)),
        images,
        image: images[0],
        isActive: draftProduct.status !== 'inactive',
      }));
    } else {
      const hex = getColorHex(draftProduct.attributes?.color);
      variants = [
        {
          id: `var-${Date.now()}-0`,
          sku: baseSku,
          size: draftProduct.attributes?.size || 'Standard',
          color: draftProduct.attributes?.color || 'Standard',
          ...(hex ? { colorHex: hex } : {}),
          price: effectiveBasePrice,
          mrp: effectiveBaseMrp,
          stock: Number(draftProduct.stock ?? 10),
          images,
          image: images[0],
          isActive: draftProduct.status !== 'inactive',
        },
      ];
    }

    const resolvedBrand = (draftProduct.brand && draftProduct.brand.trim() && draftProduct.brand !== 'Generic / Unbranded')
      ? draftProduct.brand.trim()
      : 'Generic';

    const payload = {
      storeId,
      name: draftProduct.name || 'Untitled Product',
      description: draftProduct.description || '',
      category: (draftProduct.category || 'fashion').toLowerCase().trim().replace(/[\s-]+/g, '_'),
      subCategory: draftProduct.subCategory || 'Apparel',
      subType: draftProduct.productType
        ? draftProduct.productType.toLowerCase().trim().replace(/[\s-]+/g, '_')
        : undefined,
      brand: resolvedBrand,
      hsnCode: draftProduct.hsnCode || undefined,
      gstRate: draftProduct.tax?.rate ?? 18,
      tags: draftProduct.tags || [],
      attributes: attributesArray,
      variants,
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
        category: draftProduct.category || 'General',
        subCategory: draftProduct.subCategory || 'General',
        productType: draftProduct.productType || 'Standard',
        brand: resolvedBrand,
        stock: Number(draftProduct.stock ?? 100),
        lowStockThreshold: Number(draftProduct.lowStockThreshold ?? 10),
        status: draftProduct.status || 'active',
        price: effectiveBasePrice,
        costPrice: Number(draftProduct.costPrice || 0),
        mrp: effectiveBaseMrp,
        images,
        variants,
        attributes: draftProduct.attributes || {},
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
        hsnCode: draftProduct.hsnCode || '85171300',
        description: draftProduct.description || '',
        tags: draftProduct.tags || [],
        countryOfOrigin: draftProduct.countryOfOrigin || 'India',
        warranty: draftProduct.warranty || 'Standard Warranty',
        isReturnable: draftProduct.isReturnable ?? true,
        weight: draftProduct.weight || '0.250',
        dimensions: draftProduct.dimensions || { length: '30', width: '20', height: '2' },
        material: draftProduct.material || draftProduct.attributes?.Material || draftProduct.attributes?.fabric || '',
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

    // Step 3 Persistence: Ensure category and brand are recorded for future products
    try {
      if (finalizedProduct.category) {
        recordCustomCategory(
          storeId,
          finalizedProduct.category,
          finalizedProduct.subCategory,
          finalizedProduct.productType,
        );
      }
      if (finalizedProduct.brand) {
        recordCustomBrand(storeId, finalizedProduct.brand);
      }
    } catch (e) {
      console.warn('[CatalogStore] Failed to persist custom taxonomy on product save:', e);
    }

    return finalizedProduct;
  },

  bulkImportProducts: async (productsData: any[]) => {
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
        console.warn('Could not resolve store for bulk import:', e);
      }
    }

    if (!storeId) {
      throw new Error('No active merchant store found for bulk product import');
    }

    const defaultImage =
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';

    const formattedPayloads = productsData.map((item, idx) => {
      const price = Number(item.price || 499);
      const mrp = Number(item.mrp || item.price || 699);
      const stock = Number(item.stock || 20);
      const sku = (item.sku || `PRD-BLK-${Date.now()}-${idx + 1}`).toUpperCase();
      const cat = (item.category || 'fashion').toLowerCase().trim().replace(/[\s-]+/g, '_');
      const images = Array.isArray(item.images) && item.images.length > 0
        ? item.images
        : [item.image || defaultImage];

      return {
        storeId,
        name: item.name || `Imported Product ${idx + 1}`,
        description: item.description || '',
        category: cat,
        subCategory: item.subCategory || 'General',
        brand: item.brand || 'Generic',
        tags: Array.isArray(item.tags)
          ? item.tags
          : item.tags
            ? String(item.tags).split(',').map((t: string) => t.trim())
            : [],
        attributes: [
          { key: 'Source', value: 'Bulk CSV Import' },
          ...(item.size ? [{ key: 'Size', value: String(item.size) }] : []),
        ],
        variants: [
          {
            sku,
            size: item.size || 'Standard',
            color: item.color || 'Standard',
            price,
            mrp,
            stock,
            images,
            isActive: true,
          },
        ],
        isFeatured: false,
      };
    });

    const result = await catalogApi.bulkCreateProducts(storeId, formattedPayloads);
    await get().fetchProducts(storeId);
    return result;
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
      toast.success("Product Duplicated", `Created duplicate of "${target.name}".`);
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
      toast.success("Status Updated", `"${product.name}" is now ${newStatus === "active" ? "Active" : "Inactive"}.`);
      return { products: updatedList, kpis: calculateKPIs(updatedList) };
    });
  },

  updateStock: async (id, newStock, lowStockThreshold) => {
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
      toast.success("Stock Updated", `Stock updated to ${newStock} units.`);
      return { products: updatedList, kpis: calculateKPIs(updatedList) };
    });

    try {
      const { useInventoryStore } = await import('./inventoryStore.js');
      useInventoryStore.getState().syncProductStock(id, newStock, {
        reason: 'Catalog stock update',
        lowStockThreshold,
      });
    } catch {
      // safe fallback if inventoryStore not loaded
    }
  },

  
  bulkDeleteSelectedProducts: async () => {
    const { selectedProductIds, products } = get();
    if (selectedProductIds.length === 0) return;

    try {
      const validBackendIds = selectedProductIds.filter((id) => /^[0-9a-fA-F]{24}$/.test(id));
      if (validBackendIds.length > 0) {
        await catalogApi.bulkDeleteProducts(validBackendIds);
      }
    } catch (err) {
      console.warn('Failed to bulk delete products on backend:', err);
    }

    set((state) => {
      const updatedList = state.products.filter((p) => !state.selectedProductIds.includes(p.id));
      return {
        products: updatedList,
        kpis: calculateKPIs(updatedList),
        selectedProductIds: [],
      };
    });
  },
  clearSelectedProducts: () => set({ selectedProductIds: [] }),

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
    toast.success("Product Deleted", "Product removed from catalog.");
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
