'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, MapPin } from 'lucide-react';
import { StoreCard } from '@/features/stores/components/StoreCard';
import { StoreCardSkeleton } from '@/components/ui/Skeleton';
import { useNearbyStores } from '@/hooks/useNearbyStores';
import { useAllStores } from '@/hooks/useAllStores';
import { useLocationStore } from '@/stores/location.store';

export function StoresNearYouRail() {
  const { lng, lat } = useLocationStore();
  const { data: nearbyStores, isLoading: nearbyLoading } = useNearbyStores(lng, lat);
  const { data: allStoresResponse, isLoading: allLoading } = useAllStores({ limit: 5 });

  const storesLoading = nearbyLoading || (allLoading && (!nearbyStores || nearbyStores.length === 0));
  const hasNearby = nearbyStores && nearbyStores.length > 0;
  const displayStores = hasNearby ? nearbyStores.slice(0, 5) : allStoresResponse?.stores?.slice(0, 5) || [];

  return (
    <section className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-400" />
          <h2 className="text-lg sm:text-2xl font-bold text-[#192168]">
            {hasNearby ? 'Stores Near You' : 'Partner Stores'}
          </h2>
          {!hasNearby && !storesLoading && displayStores.length > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              <MapPin className="w-3 h-3" /> Showing top stores
            </span>
          )}
        </div>
        <Link
          href="/stores"
          className="flex items-center gap-1 text-sm font-medium sm:font-semibold text-[#192168] sm:text-[#1668F6] hover:text-brand-300 sm:hover:text-[#0f4bba] transition-colors"
        >
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
        {storesLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="min-w-[280px] lg:min-w-0 shrink-0 snap-start">
              <StoreCardSkeleton />
            </div>
          ))
        ) : displayStores.length > 0 ? (
          displayStores.map((store) => (
            <div key={store._id} className="min-w-[260px] lg:min-w-0 shrink-0 snap-start">
              <StoreCard store={store} />
            </div>
          ))
        ) : (
          <div className="w-full py-12 text-center text-surface-500 col-span-full">
            <p className="text-sm">No stores found nearby. Try changing your location.</p>
          </div>
        )}
      </div>
    </section>
  );
}
