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

export interface IProductVariant {
  sku: string;
  size?: string;
  color?: string;
  colorHex?: string;
  price: number;
  mrp: number;
  stock: number;
  images: string[];
  isActive: boolean;
}

export interface IProduct {
  _id: string;
  storeId: string;
  storeName: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  subCategory?: string;
  subType?: ProductSubType;
  brand?: string;
  tags: string[];
  attributes: IProductAttribute[];
  variants: IProductVariant[];
  basePrice: number;
  baseMrp: number;
  maxDiscount: number;    // % off (computed)
  totalStock: number;     // Sum of all variant stocks (computed)
  isFeatured: boolean;
  isActive: boolean;
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
  categories: { value: ProductCategory; count: number }[];
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
  sku: z.string().min(1, 'SKU is required').max(50),
  size: z.string().max(20).optional(),
  color: z.string().max(50).optional(),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color').optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  mrp: z.number().min(0, 'MRP must be non-negative'),
  stock: z.number().int().min(0, 'Stock must be non-negative').default(0),
  images: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
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
  subType: z.preprocess(
    (val) => (typeof val === 'string' ? val.toLowerCase().trim().replace(/[\s-]+/g, '_') : val),
    z.nativeEnum(ProductSubType).optional(),
  ).optional(),
  brand: z.string().max(100).optional(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  attributes: z.array(productAttributeSchema).max(30).default([]),
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
  category: z.nativeEnum(ProductCategory).optional(),
  subCategory: z.string().optional(),
  subType: z.nativeEnum(ProductSubType).optional(),
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
