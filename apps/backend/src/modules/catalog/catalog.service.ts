import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  IProduct,
  IProductListResponse,
  IProductFacets,
  ProductSortOption,
  ProductCategory,
} from '@repo/shared-types';
import { ProductModel } from './product.model.js';
import { AppError } from '../../shared/utils/AppError.js';
import { findStoreById } from '../stores/store.service.js';

// ── Helpers ────────────────────────────────────────────────────────────

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${base}-${randomSuffix}`;
}

function ensureArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Build sort object from ProductSortOption enum
 */
function buildSortStage(sort: ProductSortOption): Record<string, 1 | -1> {
  switch (sort) {
    case ProductSortOption.PRICE_ASC:
      return { basePrice: 1 };
    case ProductSortOption.PRICE_DESC:
      return { basePrice: -1 };
    case ProductSortOption.RATING:
      return { rating: -1, reviewCount: -1 };
    case ProductSortOption.NEWEST:
      return { createdAt: -1 };
    case ProductSortOption.DISCOUNT:
      return { maxDiscount: -1 };
    case ProductSortOption.POPULARITY:
      return { reviewCount: -1, rating: -1 };
    case ProductSortOption.RELEVANCE:
    default:
      return { isFeatured: -1, rating: -1, createdAt: -1 };
  }
}

// ── CRUD Operations ────────────────────────────────────────────────────

/**
 * Create a new product under a merchant's store
 */
export async function createProduct(
  storeId: string,
  ownerId: string,
  dto: CreateProductDto,
): Promise<IProduct> {
  // Validate store ownership
  const store = await findStoreById(storeId);
  if (!store) {
    throw AppError.notFound('Store not found', 'STORE_NOT_FOUND');
  }
  if (store.ownerId.toString() !== ownerId) {
    throw AppError.forbidden('You are not authorized to add products to this store', 'STORE_ACCESS_DENIED');
  }

  const slug = generateSlug(dto.name);

  const product = new ProductModel({
    ...dto,
    storeId,
    storeName: store.name,
    slug,
    isActive: true,
  });

  await product.save();
  return product.toJSON() as unknown as IProduct;
}

/**
 * Bulk create products for a store
 */
export async function bulkCreateProducts(
  storeId: string,
  ownerId: string,
  products: CreateProductDto[],
): Promise<{ created: number; errors: { index: number; error: string }[] }> {
  const store = await findStoreById(storeId);
  if (!store) {
    throw AppError.notFound('Store not found', 'STORE_NOT_FOUND');
  }
  if (store.ownerId.toString() !== ownerId) {
    throw AppError.forbidden('Not authorized', 'STORE_ACCESS_DENIED');
  }

  let created = 0;
  const errors: { index: number; error: string }[] = [];

  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    if (!item) continue;
    try {
      const slug = generateSlug(item.name);
      const product = new ProductModel({
        ...item,
        storeId,
        storeName: store.name,
        slug,
        isActive: true,
      });
      await product.save();
      created++;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      errors.push({ index: i, error: message });
    }
  }

  return { created, errors };
}

/**
 * Update an existing product (merchant owner only)
 */
export async function updateProduct(
  productId: string,
  ownerId: string,
  dto: UpdateProductDto,
): Promise<IProduct> {
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw AppError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
  }

  // Check ownership via store
  const store = await findStoreById(product.storeId.toString());
  if (!store || store.ownerId.toString() !== ownerId) {
    throw AppError.forbidden('Not authorized to update this product', 'PRODUCT_ACCESS_DENIED');
  }

  Object.assign(product, dto);
  await product.save(); // triggers pre-save hook to recompute derived fields
  return product.toJSON() as unknown as IProduct;
}

/**
 * Soft-delete a product
 */
export async function deleteProduct(productId: string, ownerId: string): Promise<void> {
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw AppError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
  }

  const store = await findStoreById(product.storeId.toString());
  if (!store || store.ownerId.toString() !== ownerId) {
    throw AppError.forbidden('Not authorized to delete this product', 'PRODUCT_ACCESS_DENIED');
  }

  product.isActive = false;
  await product.save();
}

// ── Read Operations ────────────────────────────────────────────────────

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<IProduct> {
  const product = await ProductModel.findOne({ _id: id, isActive: true }).lean();
  if (!product) {
    throw AppError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
  }
  return product as unknown as IProduct;
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<IProduct> {
  const product = await ProductModel.findOne({ slug, isActive: true }).lean();
  if (!product) {
    throw AppError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
  }
  return product as unknown as IProduct;
}

/**
 * Get a product by ID or slug (auto-detected)
 */
export async function getProductByIdOrSlug(idOrSlug: string): Promise<IProduct> {
  // MongoDB ObjectIDs are 24 hex chars
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  if (isObjectId) {
    return getProductById(idOrSlug);
  }
  return getProductBySlug(idOrSlug);
}

// ── Faceted Search Engine ──────────────────────────────────────────────

/**
 * Full faceted product listing with filters, sorting, and pagination
 */
export async function listProducts(query: ProductQueryDto): Promise<IProductListResponse> {
  const {
    search,
    category,
    subCategory,
    subType,
    sizes,
    colors,
    brands,
    minPrice,
    maxPrice,
    storeId,
    sort = ProductSortOption.RELEVANCE,
    page = 1,
    limit = 20,
  } = query;

  const skip = (page - 1) * limit;

  // Build filter
  const filter: Record<string, unknown> = { isActive: true };

  if (storeId) filter.storeId = storeId;
  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (subType) filter.subType = subType;

  // Text search
  if (search) {
    filter.$text = { $search: search };
  }

  // Faceted filters on variant fields
  const sizeArr = ensureArray(sizes);
  if (sizeArr.length > 0) {
    filter['variants.size'] = { $in: sizeArr };
  }

  const colorArr = ensureArray(colors);
  if (colorArr.length > 0) {
    filter['variants.color'] = { $in: colorArr.map((c) => new RegExp(`^${c}$`, 'i')) };
  }

  const brandArr = ensureArray(brands);
  if (brandArr.length > 0) {
    filter.brand = { $in: brandArr.map((b) => new RegExp(`^${b}$`, 'i')) };
  }

  // Price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.basePrice = {};
    if (minPrice !== undefined) (filter.basePrice as Record<string, number>).$gte = minPrice;
    if (maxPrice !== undefined) (filter.basePrice as Record<string, number>).$lte = maxPrice;
  }

  const sortStage = buildSortStage(sort);

  // Execute query + count in parallel
  const [products, total] = await Promise.all([
    ProductModel.find(filter).sort(sortStage).skip(skip).limit(limit).lean(),
    ProductModel.countDocuments(filter),
  ]);

  // Compute facets from the full filtered result set (not paginated)
  const facets = await computeFacets(filter);

  const totalPages = Math.ceil(total / limit);

  return {
    products: products as unknown as IProduct[],
    facets,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Compute facet counts using MongoDB aggregation pipeline
 */
async function computeFacets(
  baseFilter: Record<string, unknown>,
): Promise<IProductFacets> {
  const pipeline = [
    { $match: baseFilter },
    {
      $facet: {
        sizes: [
          { $unwind: '$variants' },
          { $match: { 'variants.isActive': true, 'variants.size': { $ne: null } } },
          { $group: { _id: '$variants.size', count: { $sum: 1 } } },
          { $sort: { count: -1 as const } },
          { $project: { _id: 0, value: '$_id', count: 1 } },
        ],
        colors: [
          { $unwind: '$variants' },
          { $match: { 'variants.isActive': true, 'variants.color': { $ne: null } } },
          { $group: { _id: '$variants.color', hex: { $first: '$variants.colorHex' }, count: { $sum: 1 } } },
          { $sort: { count: -1 as const } },
          { $project: { _id: 0, value: '$_id', hex: 1, count: 1 } },
        ],
        brands: [
          { $match: { brand: { $ne: null } } },
          { $group: { _id: '$brand', count: { $sum: 1 } } },
          { $sort: { count: -1 as const } },
          { $project: { _id: 0, value: '$_id', count: 1 } },
        ],
        priceRange: [
          {
            $group: {
              _id: null,
              min: { $min: '$basePrice' },
              max: { $max: '$basePrice' },
            },
          },
          { $project: { _id: 0 } },
        ],
        categories: [
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 as const } },
          { $project: { _id: 0, value: '$_id', count: 1 } },
        ],
        totalCount: [{ $count: 'count' }],
      },
    },
  ];

  const aggregateResults = await ProductModel.aggregate(pipeline);
  const result = aggregateResults[0] as {
    sizes?: { value: string; count: number }[];
    colors?: { value: string; hex?: string; count: number }[];
    brands?: { value: string; count: number }[];
    priceRange?: { min: number; max: number }[];
    categories?: { value: ProductCategory; count: number }[];
    totalCount?: { count: number }[];
  } | undefined;

  const firstPriceRange = result?.priceRange?.[0];
  const firstTotal = result?.totalCount?.[0];

  return {
    sizes: result?.sizes ?? [],
    colors: result?.colors ?? [],
    brands: result?.brands ?? [],
    priceRange: firstPriceRange ? { min: firstPriceRange.min, max: firstPriceRange.max } : { min: 0, max: 0 },
    categories: result?.categories ?? [],
    totalCount: firstTotal?.count ?? 0,
  };
}

// ── Scoped Queries ─────────────────────────────────────────────────────

/**
 * Products for a specific store's storefront
 */
export async function getStoreProducts(
  storeId: string,
  query: Partial<ProductQueryDto>,
): Promise<IProductListResponse> {
  return listProducts({ ...query, storeId, page: query.page || 1, limit: query.limit || 20, sort: query.sort || ProductSortOption.RELEVANCE });
}

/**
 * Featured products for the home feed
 */
export async function getFeaturedProducts(limit = 12): Promise<IProduct[]> {
  const products = await ProductModel.find({
    isActive: true,
    isFeatured: true,
  })
    .sort({ rating: -1, maxDiscount: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  // If not enough featured, fill with top-rated
  if (products.length < limit) {
    const existingIds = products.map((p) => p._id);
    const filler = await ProductModel.find({
      isActive: true,
      _id: { $nin: existingIds },
    })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit - products.length)
      .lean();
    products.push(...filler);
  }

  return products as unknown as IProduct[];
}

// ── Inter-Module Contract Functions ────────────────────────────────────

/**
 * Used by orders module (Phase 4) to fetch products by IDs
 */
export async function getProductsByIds(ids: string[]): Promise<IProduct[]> {
  const products = await ProductModel.find({
    _id: { $in: ids },
    isActive: true,
  }).lean();
  return products as unknown as IProduct[];
}

/**
 * Check if a product has sufficient stock for a given variant SKU
 */
export async function checkVariantStock(
  productId: string,
  sku: string,
  requestedQty: number,
): Promise<{ available: boolean; currentStock: number }> {
  const product = await ProductModel.findById(productId);
  if (!product) {
    return { available: false, currentStock: 0 };
  }

  const variant = product.variants.find((v) => v.sku === sku && v.isActive);
  if (!variant) {
    return { available: false, currentStock: 0 };
  }

  const currentStock = variant.stock ?? 0;
  return {
    available: currentStock >= requestedQty,
    currentStock,
  };
}

/**
 * Atomic stock deduction using conditional $gte to prevent overselling
 */
export async function deductStockAtomic(
  items: Array<{ productId: string; sku?: string; quantity: number }>,
): Promise<void> {
  for (const item of items) {
    if (item.sku) {
      const updated = await ProductModel.findOneAndUpdate(
        {
          _id: item.productId,
          'variants.sku': item.sku,
          'variants.stock': { $gte: item.quantity },
          isActive: true,
        },
        {
          $inc: {
            'variants.$.stock': -item.quantity,
            totalStock: -item.quantity,
          },
        },
        { new: true },
      );
      if (!updated) {
        throw AppError.badRequest(
          `Insufficient inventory for SKU ${item.sku}. Item may have sold out.`,
          'INSUFFICIENT_STOCK',
        );
      }
    } else {
      const updated = await ProductModel.findOneAndUpdate(
        {
          _id: item.productId,
          totalStock: { $gte: item.quantity },
          isActive: true,
        },
        {
          $inc: { totalStock: -item.quantity },
        },
        { new: true },
      );
      if (!updated) {
        throw AppError.badRequest(
          `Insufficient inventory for product ${item.productId}. Item may have sold out.`,
          'INSUFFICIENT_STOCK',
        );
      }
    }
  }
}
