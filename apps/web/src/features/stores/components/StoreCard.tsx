'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Heart, MapPin } from 'lucide-react';
import type { IStore } from '@repo/shared-types';
import { useFavoriteStoresStore } from '@/stores/favoriteStoresStore';

interface StoreCardProps {
  store: IStore;
  className?: string;
}

export function StoreCard({ store, className }: StoreCardProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStoresStore();
  const storeId = store._id || (store as any).id || store.slug;
  const isFav = isFavorite(storeId);

  const dist = typeof store.distanceKm === 'number' && !isNaN(store.distanceKm) ? store.distanceKm : null;
  const distanceStr = dist !== null ? `${dist.toFixed(1)} km` : null;
  const etaMins = dist !== null ? Math.max(8, Math.round(5 + dist * 3.5)) : null;

  return (
    <Link
      href={`/stores/${store.slug || store._id}`}
      className={`group bg-white overflow-hidden rounded-2xl border border-gray-100 hover:border-blue-100 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col relative ${className ? className : 'w-full'}`}
    >
      {/* Banner Image - Wide panoramic view */}
      <div className="relative w-full aspect-[16/7] sm:h-44 md:h-48 overflow-hidden bg-surface-100">
        {store.bannerUrl ? (
          <img
            src={store.bannerUrl}
            alt={store.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center p-4">
            <span className="text-white/60 font-black text-xl tracking-wider uppercase">
              {store.name}
            </span>
          </div>
        )}

        {/* Distance / ETA Pill */}
        {distanceStr && etaMins && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-bold text-gray-800 shadow-2xs flex items-center gap-1 border border-gray-100/80 leading-none z-10">
            <MapPin className="w-3 h-3 text-emerald-600" /> {distanceStr} • {etaMins}m
          </span>
        )}

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

        {/* Subtle bottom gradient to make text on dark backgrounds pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full inline-block mb-1">
                {store.category || 'Local Retail'}
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {store.name}
              </h3>
            </div>
            {store.rating && (
              <span className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md shrink-0">
                ★ {store.rating.toFixed(1)}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
            {store.description || 'Visit store to explore fresh collections, daily deals, and quick delivery to your doorstep.'}
          </p>
        </div>

        <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span className="truncate max-w-[200px]">
            {store.address?.street ? `${store.address.street}, ${store.address.city}` : 'Hyperlocal Store'}
          </span>
          <span className="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
            Visit <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
