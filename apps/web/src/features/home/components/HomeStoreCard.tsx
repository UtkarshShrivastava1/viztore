'use client';

import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { IStore } from '@repo/shared-types';

const storeFallbackImages = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600', // Fashion Boutique
  'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=600', // Electronics & Audio
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600', // Beauty & Cosmetics
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600', // Home & Living
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600', // Gadget Store
  'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=600', // Supermarket / Grocery
];

const fallbackRatings = ['4.5', '4.3', '4.6', '4.2', '4.4', '4.7'];

interface HomeStoreCardProps {
  store: IStore;
  index?: number;
}

export function HomeStoreCard({ store, index = 0 }: HomeStoreCardProps) {
  const bannerImage = store.bannerUrl || storeFallbackImages[index % storeFallbackImages.length];
  const rating = store.rating ? Number(store.rating).toFixed(1) : fallbackRatings[index % fallbackRatings.length];

  return (
    <Link
      href={`/stores/${store.slug || store._id}`}
      className="group bg-white rounded-2xl border border-gray-100/90 shadow-2xs hover:shadow-md hover:border-blue-100 transition-all duration-300 overflow-hidden flex flex-col w-full"
    >
      {/* 16:10 Store Banner */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-100">
        <img
          src={bannerImage}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = storeFallbackImages[index % storeFallbackImages.length];
          }}
        />
      </div>

      {/* Compact Bottom Bar */}
      <div className="px-3 py-2.5 flex items-center justify-between bg-white border-t border-gray-50/80">
        <h3 className="text-xs sm:text-sm font-bold text-[#0B1538] truncate group-hover:text-[#1668F6] transition-colors pr-2">
          {store.name}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs font-bold text-gray-800">{rating}</span>
          <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
        </div>
      </div>
    </Link>
  );
}
