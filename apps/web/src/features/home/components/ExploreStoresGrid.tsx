'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Zap, Truck, RotateCcw, ShieldCheck, Headphones, Star } from 'lucide-react';
import { useAllStores } from '@/hooks/useAllStores';
import { type IStore } from '@repo/shared-types';

const trustItems = [
  { icon: Truck, label: 'Fast Delivery', description: 'On orders above ₹199' },
  { icon: RotateCcw, label: 'Easy Returns', description: '7 days return policy' },
  { icon: ShieldCheck, label: 'Secure Payments', description: '100% secure payments' },
  { icon: Headphones, label: 'Support', description: '24x7 assistance' },
];

const fallbackStoreImages = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800', // Fashion Hub
  'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800', // Sharma Electronics
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800', // Beauty Corner
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800', // Home Needs
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800', // Gadget Store
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', // Shoe World
];

const fallbackStoreMeta = [
  { category: 'Clothing, Accessories, Footwear & more', rating: '4.5', count: '1.2K' },
  { category: 'Mobiles, Accessories, Gadgets & more', rating: '4.3', count: '890' },
  { category: 'Skincare, Haircare, Makeup & more', rating: '4.6', count: '1.5K' },
  { category: 'Home Decor, Kitchen, Furniture & more', rating: '4.2', count: '760' },
  { category: 'Smartwatches, Accessories, Audio & more', rating: '4.4', count: '540' },
  { category: 'Men, Women & Kids Footwear', rating: '4.3', count: '980' },
];

export function ExploreStoresGrid() {
  const { data: storesResponse, isLoading } = useAllStores({ limit: 6 });
  const liveStores = storesResponse?.stores && storesResponse.stores.length > 0 ? storesResponse.stores : [];

  const displayStores: IStore[] = liveStores;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1538]">Explore Stores</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Shop from top local stores near you</p>
        </div>
        <Link
          href="/stores"
          className="flex items-center gap-1 text-sm font-semibold text-[#1668F6] hover:text-[#0f4bba] transition-colors"
        >
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3-Column Grid (6 stores total) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-surface-100 animate-pulse" />
          ))
        ) : (
          displayStores.slice(0, 6).map((store, index) => {
            const banner = store.bannerUrl || fallbackStoreImages[index % fallbackStoreImages.length];
            const meta = fallbackStoreMeta[index % fallbackStoreMeta.length];
            const categoryText = store.category
              ? (store.category.charAt(0).toUpperCase() + store.category.slice(1).replace('_', ' '))
              : meta.category;

            return (
              <Link
                href={`/stores/${store.slug || store._id}`}
                key={store._id || index}
                className="group flex flex-row sm:flex-col bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-lg hover:border-blue-100 transition-all duration-300 overflow-hidden"
              >
                {/* Banner Image (Compact split thumbnail on mobile matching Mob 1.1.png, 16:9 on desktop) */}
                <div className="relative w-32 sm:w-full h-28 sm:h-auto sm:aspect-[16/9] overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={banner}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackStoreImages[index % fallbackStoreImages.length];
                    }}
                  />
                </div>

                {/* Details */}
                <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between min-w-0">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-lg font-bold text-[#0B1538] group-hover:text-[#1668F6] transition-colors truncate">
                        {store.name}
                      </h3>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-[#1668F6] group-hover:translate-x-1 transition-all shrink-0" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                      <span className="text-xs sm:text-sm font-bold text-gray-800">{store.rating ? Number(store.rating).toFixed(1) : meta.rating}</span>
                      <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-emerald-500 text-emerald-500" />
                      <span className="text-[11px] sm:text-xs text-gray-400">({meta.count})</span>
                    </div>

                    {/* Description / Category */}
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 mt-1">
                      {categoryText}
                    </p>
                  </div>

                  {/* Fast Delivery Pill */}
                  <div className="pt-2 sm:pt-3">
                    <div className="inline-flex items-center gap-1 bg-[#F5F8FF] text-[#1668F6] text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md">
                      <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" /> Fast Delivery
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Trust Ecosystem Bar (Matching Web 1.1.png) */}
      <div className="mt-8 sm:mt-12 bg-[#F5F8FF] rounded-2xl p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/60">
          {trustItems.map((item, index) => (
            <div key={item.label} className={`flex items-center gap-4 ${index !== 0 ? 'pt-6 sm:pt-0 sm:pl-6 lg:pl-10' : 'sm:pl-4'}`}>
              <div className="shrink-0 text-[#1668F6] p-3 bg-white rounded-2xl shadow-2xs">
                <item.icon strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">{item.label}</h4>
                <p className="text-xs sm:text-sm text-gray-500 leading-snug mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
