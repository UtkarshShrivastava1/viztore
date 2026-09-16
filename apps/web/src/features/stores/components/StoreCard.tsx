'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Clock, Truck, ChevronRight, ShieldCheck } from 'lucide-react';
import type { IStore } from '@repo/shared-types';

interface StoreCardProps {
  store: IStore;
  className?: string;
}

export function StoreCard({ store, className }: StoreCardProps) {
  return (
    <Link
      href={`/stores/${store.slug}`}
      className={`group bg-white overflow-hidden hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/5 border rounded-2xl ${className ? className : 'flex-shrink-0 w-[200px] sm:w-[280px]'}`}
    >
      {/* Banner Image */}
      <div className="relative h-32 overflow-hidden bg-surface-100">
        {store.bannerUrl ? (
          <img
            src={store.bannerUrl}
            alt={store.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full gradient-brand opacity-40" />
        )}

        {/* ETA Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm">
          <Clock className="w-3 h-3 text-emerald-500" />
          <span className="text-xs font-bold text-surface-600">
            {store.distanceKm ? `${store.distanceKm.toFixed(1)} km` : '~2 km'}
          </span>
        </div>

        {/* Circular Logo */}
        <div className="absolute -bottom-4 left-3 w-12 h-12 rounded-full border-2 border-white bg-white shadow-sm overflow-hidden flex items-center justify-center">
           {store.logoUrl ? (
             <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full bg-black text-white flex items-center justify-center text-lg font-extrabold">
                {store.name.substring(0, 2).toUpperCase()}
             </div>
           )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 pt-5">
        <div className="flex items-start justify-between mb-1">
           <div className="flex flex-col">
              <h3 className="text-[15px] font-extrabold text-[#061842] truncate group-hover:text-[#1668F6] transition-colors">
                {store.name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[12px] font-bold text-[#061842]">{store.rating.toFixed(1)}</span>
                <Star className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                <span className="text-[12px] text-gray-500 font-medium">({store.reviewCount >= 1000 ? (store.reviewCount/1000).toFixed(1) + 'K' : store.reviewCount})</span>
              </div>
           </div>
           <ChevronRight className="w-5 h-5 text-[#061842]" />
        </div>

        <p className="text-[12px] font-medium text-gray-500 mb-3 line-clamp-1">{store.category || store.description}</p>

        <div className="flex items-center gap-4 pt-3 mt-1">
           <div className="flex items-center gap-1.5 text-[#061842]">
             <Truck className="w-3.5 h-3.5 text-[#1668F6]" />
             <span className="text-[11px] font-bold">Fast Delivery</span>
           </div>
           <div className="flex items-center gap-1.5 text-[#061842]">
             <ShieldCheck className="w-3.5 h-3.5 text-[#1668F6]" />
             <span className="text-[11px] font-bold">Great Offers</span>
           </div>
        </div>
      </div>
    </Link>
  );
}
