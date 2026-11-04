import { z } from 'zod';

// ── Product Category Enum ──────────────────────────────────────────────
export enum ProductCategory {
  MEN = 'men',
  WOMEN = 'women',
  KIDS = 'kids',
  FASHION = 'fashion',
  BEAUTY = 'beauty',
  HOME_LIVING = 'home_living',
  FOOTWEAR = 'footwear',
  ELECTRONICS = 'electronics',
  ACCESSORIES = 'accessories',
  VALUE_STORE = 'value_store',
  GROCERY_STAPLES = 'grocery_staples',
  SPORTS_FITNESS = 'sports_fitness',
  TOYS_BABY = 'toys_baby',
  BOOKS_STATIONERY = 'books_stationery',
  AUTOMOTIVE = 'automotive',
  OTHER = 'other',
}

// ── Product Sub-Types (Filter Chips) ───────────────────────────────────
export enum ProductSubType {
  ROUND_NECK = 'round_neck',
  V_NECK = 'v_neck',
  POLO = 'polo',
  PRINTED = 'printed',
  STRIPED = 'striped',
  FULL_SLEEVE = 'full_sleeve',
  HALF_SLEEVE = 'half_sleeve',
  FORMAL = 'formal',
  CASUAL = 'casual',
  ETHNIC = 'ethnic',
  SPORTS = 'sports',
  OTHER = 'other',
}

// ── Product Sort Options ───────────────────────────────────────────────
export enum ProductSortOption {
  RELEVANCE = 'relevance',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  RATING = 'rating',
  NEWEST = 'newest',
  DISCOUNT = 'discount',
  POPULARITY = 'popularity',
}

// ── Interfaces ─────────────────────────────────────────────────────────

export interface IProductAttribute {
  key: string;   // e.g. "Weave Pattern", "Transparency", "Fit", "Fabric"
  value: string; // e.g. "Twill", "Opaque", "Slim Fit", "100% Cotton"
}

// ── Master Taxonomy & HSN Types ─────────────────────────────────────────

export interface ITaxonomyAttributeDefinition {
  name: string;
  values: string[];
  isMultiSelect?: boolean;
  isRequired?: boolean;
}

export interface ITaxonomyNode {
  _id?: string;
  category: string;
  subcategory: string;
  productType: string;
  slug?: string;
  hsnCode?: string;
  gstRate?: number;
  attributes: ITaxonomyAttributeDefinition[];
}

export interface IHSNLookupResult {
  hsnCode: string;
  gstRate: number;
  description: string;
  category: string;
}

export interface ITaxonomySearchMatch {
  category: string;
  subcategory: string;
  productType: string;
  attributeCount: number;
  hsnCode?: string;
  gstRate?: number;
}

export interface IProductVariant {
  id?: string;
  sku: string;
  size?: string;
  color?: string;
  colorHex?: string;
  price: number;
  mrp: number;
  costPrice?: number;
  stock: number;
  images: string[];
  image?: string;
  useOriginalImages?: boolean;
  isActive: boolean;
  isCustomPrice?: boolean;
  barcode?: string;
}

export interface IProductStorageLocation {
  warehouse?: string;
  room?: string;
  rack?: string;
  shelf?: string;
  bin?: string;
  description?: string;
}

export interface IProductDimensions {
  length?: string;
  width?: string;
  height?: string;
}

export interface IProduct {
  _id: string;
  storeId: string;
  storeName: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory | string;
  subCategory?: string;
  subType?: ProductSubType | string;
  brand?: string;
  barcode?: string;
  sku?: string;
  images?: string[];
  hsnCode?: string;
  gstRate?: number;
  costPrice?: number;
  lowStockThreshold?: number;
  storageLocation?: IProductStorageLocation;
  countryOfOrigin?: string;
  warranty?: string;
  isReturnable?: boolean;
  weight?: string;
  dimensions?: IProductDimensions;
  material?: string;
  careInstructions?: string;
  tags: string[];
  attributes: IProductAttribute[];
  variants: IProductVariant[];
  basePrice: number;
  baseMrp: number;
  maxDiscount: number;    // % off (computed)
  totalStock: number;     // Sum of all variant stocks (computed)
  isFeatured: boolean;
  isActive: boolean;
  status?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Facet counts returned alongside product listings
 */
export interface IProductFacets {
  sizes: { value: string; count: number }[];
  colors: { value: string; hex?: string; count: number }[];
  brands: { value: string; count: number }[];
  priceRange: { min: number; max: number };
  categories: { value: string; count: number }[];
  totalCount: number;
}

export interface IProductListResponse {
  products: IProduct[];
  facets: IProductFacets;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ── Zod Schemas ────────────────────────────────────────────────────────

export const productAttributeSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().min(1).max(500),
});

export const productVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1, 'SKU is required').max(100),
  size: z.string().max(100).optional(),
  color: z.string().max(100).optional(),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color').optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  mrp: z.number().min(0, 'MRP must be non-negative'),
  costPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0, 'Stock must be non-negative').default(0),
  images: z.array(z.string()).default([]),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  isCustomPrice: z.boolean().optional(),
  barcode: z.string().optional(),
});

export const storageLocationSchema = z.object({
  warehouse: z.string().optional(),
  room: z.string().optional(),
  rack: z.string().optional(),
  shelf: z.string().optional(),
  bin: z.string().optional(),
  description: z.string().optional(),
});

export const dimensionsSchema = z.object({
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
});

export const createProductSchema = z.object({
  storeId: z.string().optional(),
  name: z.string().min(2, 'Product name must be at least 2 characters').max(200),
  description: z.string().max(5000).default(''),
  category: z.preprocess(
    (val) => (typeof val === 'string' ? val.toLowerCase().trim().replace(/[\s-]+/g, '_') : val),
    z.nativeEnum(ProductCategory).or(z.string()),
  ),
  subCategory: z.string().max(100).optional(),
  subType: z.preprocess((val) => {
    if (!val || typeof val !== 'string') return undefined;
    return val.toLowerCase().trim().replace(/[\s-]+/g, '_');
  }, z.string().max(100).optional()),
  brand: z.string().max(100).optional(),
  barcode: z.string().max(100).optional(),
  sku: z.string().max(100).optional(),
  images: z.array(z.string()).default([]),
  hsnCode: z.string().max(20).optional(),
  gstRate: z.number().min(0).max(100).optional(),
  costPrice: z.number().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  storageLocation: storageLocationSchema.optional(),
  countryOfOrigin: z.string().max(100).optional(),
  warranty: z.string().max(200).optional(),
  isReturnable: z.boolean().optional(),
  weight: z.string().max(50).optional(),
  dimensions: dimensionsSchema.optional(),
  material: z.string().max(200).optional(),
  careInstructions: z.string().max(500).optional(),
  status: z.enum(['active', 'inactive', 'draft', 'out_of_stock']).optional(),
  tags: z.array(z.string().max(100)).max(50).default([]),
  attributes: z.array(productAttributeSchema).max(50).default([]),
  variants: z.array(productVariantSchema).min(1, 'At least one variant is required').max(100),
  isFeatured: z.boolean().default(false),
});

export const updateProductSchema = createProductSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const productQuerySchema = z.object({
  // Text search
  search: z.string().optional(),

  // Faceted filters
  category: z.string().optional(),
  subCategory: z.string().optional(),
  subType: z.string().optional(),
  sizes: z.union([z.string(), z.array(z.string())]).optional(),
  colors: z.union([z.string(), z.array(z.string())]).optional(),
  brands: z.union([z.string(), z.array(z.string())]).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),

  // Scope
  storeId: z.string().optional(),

  // Sort
  sort: z.nativeEnum(ProductSortOption).default(ProductSortOption.RELEVANCE),

  // Pagination
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(60).default(20),
});

export const bulkCreateProductsSchema = z.object({
  products: z.array(createProductSchema).min(1).max(500),
});

// ── DTO Types ──────────────────────────────────────────────────────────

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type ProductQueryDto = z.infer<typeof productQuerySchema>;
export type BulkCreateProductsDto = z.infer<typeof bulkCreateProductsSchema>;
