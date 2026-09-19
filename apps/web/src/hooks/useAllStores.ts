'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAllStores } from '@/lib/api/stores';
import type { StoreCategory } from '@repo/shared-types';

export function useAllStores(params?: {
  page?: number;
  limit?: number;
  category?: StoreCategory;
  search?: string;
  city?: string;
}) {
  return useQuery({
    queryKey: ['stores', 'all', params],
    queryFn: () => fetchAllStores(params),
    staleTime: 5 * 60 * 1000,
  });
}
