'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Heart, ShieldCheck } from 'lucide-react';
import type { IStore } from '@repo/shared-types';
import { useFavoriteStoresStore } from '@/stores/favoriteStoresStore';

const fallbackRatings = ['4.8', '4.9', '4.7', '4.6'];
const fallbackEtas = ['10-15m', '15-20m', '10-20m', '12-18m'];

const storeFallbackImages = [
  'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
];

interface HomeStoreCardProps {
  store: IStore;
  index?: number;
}

export function HomeStoreCard({ store, index = 0 }: HomeStoreCardProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStoresStore();
  const storeId = store._id || (store as any).id || store.slug;
  const isFav = isFavorite(storeId);

  const bannerImage = store.bannerUrl || storeFallbackImages[index % storeFallbackImages.length];
  const rating = store.rating ? Number(store.rating).toFixed(1) : fallbackRatings[index % fallbackRatings.length];

  // Dynamic distance and ETA
  const dist = typeof store.distanceKm === 'number' && !isNaN(store.distanceKm) ? store.distanceKm : null;
  const distanceStr = dist !== null ? `${dist.toFixed(1)} km` : null;
  const etaMins = dist !== null ? Math.max(8, Math.round(5 + dist * 3.5)) : null;
  const badgeText = distanceStr && etaMins ? `${distanceStr} • ${etaMins}m` : fallbackEtas[index % fallbackEtas.length];

  return (
    <Link
      href={`/stores/${store.slug || store._id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-lg hover:border-blue-100 transition-all duration-300 overflow-hidden flex flex-col w-full shrink-0 relative hover:-translate-y-1"
    >
      {/* 16:10 Store Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-100">
        <img
          src={bannerImage}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = storeFallbackImages[index % storeFallbackImages.length];
          }}
        />

        {/* Distance / ETA Pill */}
        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-extrabold text-gray-800 shadow-2xs flex items-center gap-1 border border-gray-100/80 leading-none z-10">
          <MapPin className="w-3 h-3 text-emerald-600" /> {badgeText}
        </span>

        {/* Bookmark / Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(store);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-2xs ${
            isFav
              ? 'bg-rose-50 text-rose-500 ring-2 ring-rose-300'
              : 'bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white'
          }`}
          title={isFav ? 'Remove from saved stores' : 'Save store'}
          aria-label={isFav ? 'Remove from saved stores' : 'Save store'}
        >
          <Heart className={`w-4 h-4 transition-transform duration-150 active:scale-75 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info Container */}
      <div className="p-3.5 flex flex-col gap-1.5 flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-extrabold text-sm sm:text-[15px] text-[#0B1538] group-hover:text-[#1668F6] transition-colors line-clamp-1 leading-snug">
              {store.name}
            </h3>
            <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {rating}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
            {store.description || `${store.category || 'Retail'} • Fresh & Local`}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-medium border-t border-gray-50">
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </span>
          {store.address?.city && (
            <span className="truncate max-w-[100px] text-right">
              {store.address.city}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
