import { ProductCategory, ProductSortOption, type IProduct, type IProductListResponse, type ProductQueryDto } from '@repo/shared-types';
import { api } from './client';

const DUMMY_JSON_URL = "https://dummyjson.com";

async function getDummyProducts(limit = 20): Promise<IProduct[]> {
  try {
    const res = await fetch(`${DUMMY_JSON_URL}/products/category/mens-shirts?limit=${limit}`);
    const data = await res.json();
    return (data.products || []).map((p: any) => ({
      _id: `dummy-prod-${p.id}`,
      storeId: `dummy-store-${p.id}`,
      storeName: 'Local Store',
      name: p.title,
      slug: `prod-${p.id}-${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      description: p.description,
      category: ProductCategory.OTHER,
      tags: p.tags || [],
      attributes: [],
      variants: [
        {
          sku: `SKU-${p.id}`,
          price: p.price,
          mrp: p.price * 1.2, // Fake 20% discount
          stock: p.stock,
          images: [p.thumbnail, ...(p.images || [])],
          isActive: true
        }
      ],
      basePrice: p.price,
      baseMrp: p.price * 1.2,
      maxDiscount: 20,
      totalStock: p.stock,
      isFeatured: true,
      isActive: true,
      rating: p.rating,
      reviewCount: Math.floor(p.rating * 10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  } catch (err) {
    return [];
  }
}

export async function fetchProducts(
  query: Partial<ProductQueryDto>,
): Promise<IProductListResponse> {
  try {
    // Attempt real API call first
    const res = await api.get<IProduct[]>('catalog/products', query as any);
    return {
      products: res.data,
      facets: { sizes: [], colors: [], brands: [], priceRange: { min: 0, max: 0 }, categories: [], totalCount: 0 },
      meta: res.meta as IProductListResponse['meta'],
    };
  } catch (err) {
    // Fallback to dummy data
    const limit = query.limit || 20;
    const dummy = await getDummyProducts(limit);
    return {
      products: dummy,
      facets: { sizes: [], colors: [], brands: [], priceRange: { min: 0, max: 0 }, categories: [], totalCount: 0 },
      meta: { page: 1, limit, total: dummy.length, totalPages: 1, hasNextPage: false, hasPrevPage: false },
    };
  }
}

export async function fetchFeaturedProducts(limit = 12): Promise<IProduct[]> {
  try {
    const res = await api.get<IProduct[]>('catalog/products/featured', { limit });
    return res.data;
  } catch (err) {
    return getDummyProducts(limit);
  }
}

export async function fetchProductBySlug(slug: string): Promise<IProduct> {
  try {
    const res = await api.get<IProduct>(`catalog/products/${slug}`);
    return res.data;
  } catch (err) {
    const dummy = await getDummyProducts(1);
    if (dummy.length > 0) return dummy[0];
    throw new Error('Product not found');
  }
}

export async function fetchStoreProducts(
  storeId: string,
  query?: Partial<ProductQueryDto>,
): Promise<IProductListResponse> {
  try {
    const res = await api.get<IProduct[]>(`catalog/stores/${storeId}/products`, query as any);
    return {
      products: res.data,
      facets: { sizes: [], colors: [], brands: [], priceRange: { min: 0, max: 0 }, categories: [], totalCount: 0 },
      meta: res.meta as IProductListResponse['meta'],
    };
  } catch (err) {
    const limit = query?.limit || 20;
    const dummy = await getDummyProducts(limit);
    return {
      products: dummy,
      facets: { sizes: [], colors: [], brands: [], priceRange: { min: 0, max: 0 }, categories: [], totalCount: 0 },
      meta: { page: 1, limit, total: dummy.length, totalPages: 1, hasNextPage: false, hasPrevPage: false },
    };
  }
}
