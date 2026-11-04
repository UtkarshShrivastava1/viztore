import { StoreCategory, type IStore } from "@repo/shared-types";
import { api } from "./client";

export async function fetchNearbyStores(
  lng: number,
  lat: number,
  radiusKm = 50,
  category?: StoreCategory,
  city?: string,
): Promise<IStore[]> {
  try {
    const res = await api.get<IStore[]>('stores/nearby', { lng, lat, radiusKm, category, city });
    return res.data;
  } catch (err) {
    console.error('Error fetching nearby stores:', err);
    return [];
  }
}

export async function fetchStoreBySlug(slug: string): Promise<IStore> {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
  try {
    const endpoint = isObjectId ? `stores/${slug}` : `stores/slug/${slug}`;
    const res = await api.get<IStore>(endpoint);
    return res.data;
  } catch (err) {
    // Graceful fallback to alternate endpoint if slug format differs
    const fallbackEndpoint = isObjectId ? `stores/slug/${slug}` : `stores/${slug}`;
    const res = await api.get<IStore>(fallbackEndpoint);
    return res.data;
  }
}

export async function fetchStoreById(id: string): Promise<IStore> {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  try {
    const endpoint = isObjectId ? `stores/${id}` : `stores/slug/${id}`;
    const res = await api.get<IStore>(endpoint);
    return res.data;
  } catch (err) {
    const fallbackEndpoint = isObjectId ? `stores/slug/${id}` : `stores/${id}`;
    const res = await api.get<IStore>(fallbackEndpoint);
    return res.data;
  }
}

export async function fetchAllStores(params?: {
  page?: number;
  limit?: number;
  category?: StoreCategory;
  search?: string;
  city?: string;
}): Promise<{
  stores: IStore[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> {
  try {
    const res = await api.get<IStore[]>('stores', params as Record<string, string | number | boolean | string[] | undefined>);
    return {
      stores: res.data,
      meta: (res.meta || { page: 1, limit: 20, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false }) as {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      },
    };
  } catch (err) {
    return {
      stores: [],
      meta: {
        page: 1,
        limit: params?.limit || 20,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }
    };
  }
}
