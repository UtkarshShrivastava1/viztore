'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { HomeStoreCard } from './HomeStoreCard';
import { useNearbyStores } from '@/hooks/useNearbyStores';
import { useAllStores } from '@/hooks/useAllStores';
import { useLocationStore } from '@/stores/location.store';
import { type IStore } from '@repo/shared-types';

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

  const displayStores: IStore[] = liveStores;

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

      {/* 5-Column Compact Grid on Desktop, Horizontal Scroll Rail on Mobile (Matching Mob 1.0.png) */}
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-1 snap-x snap-mandatory">
        {storesLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[155px] sm:w-auto shrink-0 snap-start aspect-[16/14] rounded-2xl bg-surface-100 animate-pulse" />
          ))
        ) : (
          displayStores.slice(0, 5).map((store, i) => (
            <div key={store._id || i} className="w-[155px] sm:w-auto shrink-0 snap-start">
              <HomeStoreCard store={store} index={i} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
