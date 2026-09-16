import React from 'react';
import Link from 'next/link';
import { IStore } from '@repo/shared-types';
import { Star, MapPin, Heart, ChevronRight } from 'lucide-react';

export function StoreDirectoryCard({ store }: { store: IStore }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
      <div className="flex h-[130px] md:h-[160px] relative">
        {/* Store Logo / Banner (Left) */}
        <div className="flex-shrink-0 w-[120px] md:w-[180px] relative bg-surface-100">
          {store.bannerUrl ? (
            <img src={store.bannerUrl} alt={store.name} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full bg-[#1668F6]/10 flex items-center justify-center" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
          
          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold ${store.isActive
              ? 'bg-[#06B95F] text-white'
              : 'bg-[#F59E0B] text-white'
              }`}>
              {store.isActive ? 'Open' : 'Closed'}
          </span>
          <button className="absolute top-2 right-2 flex items-center justify-center text-white/90 hover:text-rose-400">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Content (Right) */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <h3 className="text-[15px] font-extrabold text-[#192168] line-clamp-1">
              {store.name}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-[#192168]">{store.distanceKm ? `${store.distanceKm.toFixed(1)} km away` : '2.5 km away'}</span>
              <div className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1 rounded">
                <span className="text-[10px] font-extrabold">{store.rating.toFixed(1)}</span>
                <Star className="w-3 h-3 fill-emerald-600" />
              </div>
            </div>

            <p className="text-[11px] font-medium text-surface-500 mt-1 line-clamp-1">
              {store.description || 'Clothing, Accessories & more'}
            </p>
            
            <p className="text-[11px] font-bold text-surface-600 mt-1">
               Open: 10:00 AM - 9:00 PM
            </p>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 p-3 border-t border-surface-100 bg-surface-50">
        <button className="flex items-center justify-center h-9 rounded-xl border border-[#1668F6] text-[#1668F6] text-xs font-bold bg-white transition-colors hover:bg-blue-50">
          Get Directions
        </button>
        <Link href={`/stores/${store.slug}`} className="flex items-center justify-center h-9 rounded-xl bg-[#1668F6] text-white text-xs font-bold transition-colors hover:bg-blue-700 shadow-sm">
          Visit Store
        </Link>
      </div>
    </div>
  );
}
