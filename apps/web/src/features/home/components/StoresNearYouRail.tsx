'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { HomeStoreCard } from './HomeStoreCard';
import { useNearbyStores } from '@/hooks/useNearbyStores';
import { useAllStores } from '@/hooks/useAllStores';
import { useLocationStore } from '@/stores/location.store';
import { StoreCategory, type IStore } from '@repo/shared-types';

const defaultStores: Partial<IStore>[] = [
  { _id: 'store-1', name: 'Fashion Hub', slug: 'fashion-hub', category: StoreCategory.FASHION },
  { _id: 'store-2', name: 'Sharma Electronics', slug: 'sharma-electronics', category: StoreCategory.ELECTRONICS },
  { _id: 'store-3', name: 'Beauty Corner', slug: 'beauty-corner', category: StoreCategory.BEAUTY_CARE },
  { _id: 'store-4', name: 'Home Needs', slug: 'home-needs', category: StoreCategory.HOME_LIVING },
  { _id: 'store-5', name: 'Gadget Store', slug: 'gadget-store', category: StoreCategory.ELECTRONICS },
];

export function StoresNearYouRail() {
  const { lng, lat } = useLocationStore();
  const { data: nearbyStores, isLoading: nearbyLoading } = useNearbyStores(lng, lat);
  const { data: allStoresResponse, isLoading: allLoading } = useAllStores({ limit: 5 });

  const storesLoading = nearbyLoading || (allLoading && (!nearbyStores || nearbyStores.length === 0));
  const liveStores = (nearbyStores && nearbyStores.length > 0)
    ? nearbyStores
    : (allStoresResponse?.stores && allStoresResponse.stores.length > 0)
      ? allStoresResponse.stores
      : [];

  // Combine live stores with sample stores if fewer than 5
  const displayStores: IStore[] = [...liveStores];
  if (displayStores.length < 5) {
    for (const def of defaultStores) {
      if (displayStores.length >= 5) break;
      if (!displayStores.some((s) => s.name.toLowerCase() === def.name?.toLowerCase())) {
        displayStores.push(def as IStore);
      }
    }
  }

  return (
    <section className="space-y-3.5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B1538]">
          Stores Near You
        </h2>
        <Link
          href="/stores"
          className="flex items-center gap-1 text-sm font-semibold text-[#1668F6] hover:text-[#0f4bba] transition-colors"
        >
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 5-Column Compact Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {storesLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[16/14] rounded-2xl bg-surface-100 animate-pulse" />
          ))
        ) : (
          displayStores.slice(0, 5).map((store, i) => (
            <HomeStoreCard key={store._id || i} store={store} index={i} />
          ))
        )}
      </div>
    </section>
  );
}
