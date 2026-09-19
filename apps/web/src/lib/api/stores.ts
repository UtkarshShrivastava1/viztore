import { StoreCategory, type IStore } from "@repo/shared-types";
import { api } from "./client";

export async function fetchNearbyStores(
  lng: number,
  lat: number,
  radiusKm = 4,
  category?: StoreCategory,
): Promise<IStore[]> {
  try {
    const res = await api.get<IStore[]>('stores/nearby', { lng, lat, radiusKm, category });
    return res.data;
  } catch (err) {
    console.error('Error fetching nearby stores:', err);
    return [];
  }
}

export async function fetchStoreBySlug(slug: string): Promise<IStore> {
  const res = await api.get<IStore>(`stores/slug/${slug}`);
  return res.data;
}

export async function fetchStoreById(id: string): Promise<IStore> {
  const res = await api.get<IStore>(`stores/${id}`);
  return res.data;
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
    const res = await api.get<IStore[]>('stores', params as any);
    return {
      stores: res.data,
      meta: res.meta as any,
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
