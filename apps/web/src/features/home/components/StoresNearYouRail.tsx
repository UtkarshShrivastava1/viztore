'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Store as StoreIcon } from 'lucide-react';
import { HomeStoreCard } from './HomeStoreCard';
import { useNearbyStores } from '@/hooks/useNearbyStores';
import { useAllStores } from '@/hooks/useAllStores';
import { useLocationStore } from '@/stores/location.store';
import { type IStore } from '@repo/shared-types';

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function calculateDistanceKm(coord1: [number, number], coord2: [number, number]): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function StoresNearYouRail() {
  const { lng, lat, city, locality } = useLocationStore();
  const { data: nearbyStores, isLoading: nearbyLoading } = useNearbyStores(lng, lat, 50, undefined, city);
  const { data: allStoresResponse, isLoading: allLoading } = useAllStores({ limit: 10, city });

  const storesLoading = nearbyLoading || (allLoading && (!nearbyStores || nearbyStores.length === 0));
  const liveStores = (nearbyStores && nearbyStores.length > 0)
    ? nearbyStores
    : (allStoresResponse?.stores && allStoresResponse.stores.length > 0)
      ? allStoresResponse.stores
      : [];

  // Sort stores in strictly increasing order of distance from customer location (nearer to far)
  const displayStores: IStore[] = useMemo(() => {
    return [...liveStores]
      .map((store) => {
        let dist = store.distanceKm;
        if (typeof dist !== 'number' || isNaN(dist)) {
          const coords = (store as any).location?.coordinates;
          if (Array.isArray(coords) && coords.length === 2 && lat && lng) {
            dist = calculateDistanceKm([lng, lat], [coords[0], coords[1]]);
          }
        }
        return { ...store, distanceKm: dist };
      })
      .sort((a, b) => {
        const distA = typeof a.distanceKm === 'number' && !isNaN(a.distanceKm) ? a.distanceKm : 9999;
        const distB = typeof b.distanceKm === 'number' && !isNaN(b.distanceKm) ? b.distanceKm : 9999;
        return distA - distB;
      });
  }, [liveStores, lng, lat]);

  const locationLabel = locality || city || 'Bhilai-Durg';

  return (
    <section className="space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1538]">
            Stores Near You
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Neighborhood retailers near {locationLabel} sorted by nearest distance
          </p>
        </div>
        <Link
          href="/stores"
          className="flex items-center gap-1 text-sm font-semibold text-[#1668F6] hover:text-[#0f4bba] transition-colors"
        >
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 5-Column Compact Grid on Desktop, Horizontal Scroll Rail on Mobile */}
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
        {storesLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[165px] sm:w-auto shrink-0 snap-start aspect-[16/14] rounded-2xl bg-surface-100 animate-pulse" />
          ))
        ) : displayStores.length > 0 ? (
          displayStores.slice(0, 5).map((store, i) => (
            <div key={store._id || i} className="w-[165px] sm:w-auto shrink-0 snap-start">
              <HomeStoreCard store={store} index={i} />
            </div>
          ))
        ) : (
          <div className="col-span-full w-full py-8 text-center bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center">
            <StoreIcon className="w-10 h-10 text-slate-300 mb-2" />
            <h3 className="text-sm font-bold text-slate-700">Expanding to more stores in {locationLabel}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">We are actively onboarding verified local retailers in your immediate neighborhood.</p>
            <Link href="/stores" className="mt-3 text-xs font-bold text-[#1668F6] hover:underline">
              Browse all regional stores →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
