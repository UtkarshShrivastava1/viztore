'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { IStore } from '@repo/shared-types';

interface StoreCardProps {
  store: IStore;
  className?: string;
}

export function StoreCard({ store, className }: StoreCardProps) {
  return (
    <Link
      href={`/stores/${store.slug}`}
      className={`group bg-white overflow-hidden rounded-2xl border border-gray-100 hover:border-blue-100 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col ${className ? className : 'w-full'}`}
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
      </div>

      {/* Content - Single horizontal row with Circular Logo, Info, and Chevron */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 bg-white">
        {/* Left: Circular Logo */}
        <div className="w-12 h-12 rounded-full border border-gray-100 shadow-2xs bg-white shrink-0 overflow-hidden flex items-center justify-center">
          {store.logoUrl ? (
            <img 
              src={store.logoUrl} 
              alt={store.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-black text-white flex items-center justify-center text-xs font-black tracking-tight px-1 text-center">
              {store.name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase() || 'SH'}
            </div>
          )}
        </div>

        {/* Middle: Store details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-[15px] font-black text-[#061842] truncate group-hover:text-[#1668F6] transition-colors leading-tight">
            {store.name}
          </h3>

          <p className="text-[12px] text-gray-500 font-medium truncate mt-0.5 leading-tight">
            {store.category || store.description || "Men's, Women's & Kids Fashion"}
          </p>
        </div>

        {/* Right: Blue Chevron */}
        <div className="shrink-0 flex items-center pl-1">
          <ChevronRight className="w-5 h-5 text-[#1668F6] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
