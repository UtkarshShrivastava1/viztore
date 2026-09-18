import { type IProduct, type IProductListResponse, type ProductQueryDto } from '@repo/shared-types';
import { api } from './client';

export async function fetchProducts(
  query: Partial<ProductQueryDto>,
): Promise<IProductListResponse> {
  try {
    const res = await api.get<IProduct[]>('catalog/products', query as any);
    return {
      products: res.data || [],
      facets: (res as any).facets || { sizes: [], colors: [], brands: [], priceRange: { min: 0, max: 0 }, categories: [], totalCount: 0 },
      meta: res.meta as IProductListResponse['meta'],
    };
  } catch (err) {
    console.error('Error fetching products:', err);
    return {
      products: [],
      facets: { sizes: [], colors: [], brands: [], priceRange: { min: 0, max: 0 }, categories: [], totalCount: 0 },
      meta: { page: 1, limit: query.limit || 20, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false },
    };
  }
}

export async function fetchFeaturedProducts(limit = 12): Promise<IProduct[]> {
  try {
    const res = await api.get<IProduct[]>('catalog/products/featured', { limit });
    return res.data;
  } catch (err) {
    console.error('Error fetching featured products:', err);
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<IProduct> {
  const res = await api.get<IProduct>(`catalog/products/${slug}`);
  return res.data;
}

export async function fetchStoreProducts(
  storeId: string,
  query?: Partial<ProductQueryDto>,
): Promise<IProductListResponse> {
  try {
    const res = await api.get<IProduct[]>(`catalog/stores/${storeId}/products`, query as any);
    return {
      products: res.data || [],
      facets: (res as any).facets || { sizes: [], colors: [], brands: [], priceRange: { min: 0, max: 0 }, categories: [], totalCount: 0 },
      meta: res.meta as IProductListResponse['meta'],
    };
  } catch (err) {
    console.error('Error fetching store products:', err);
    return {
      products: [],
      facets: { sizes: [], colors: [], brands: [], priceRange: { min: 0, max: 0 }, categories: [], totalCount: 0 },
      meta: { page: 1, limit: query?.limit || 20, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false },
    };
  }
}
