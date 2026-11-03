'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNearbyStores } from '@/lib/api/stores';
import type { StoreCategory } from '@repo/shared-types';

export function useNearbyStores(
  lng: number,
  lat: number,
  radiusKm = 50,
  category?: StoreCategory,
  city?: string,
) {
  return useQuery({
    queryKey: ['stores', 'nearby', lng, lat, radiusKm, category, city],
    queryFn: () => fetchNearbyStores(lng, lat, radiusKm, category, city),
    staleTime: 5 * 60 * 1000,
    enabled: !!lng && !!lat,
  });
}
