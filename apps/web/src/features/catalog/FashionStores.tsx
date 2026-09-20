'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Store as StoreIcon, Loader2 } from 'lucide-react';
import { StoreCard } from '@/features/stores/components/StoreCard';
import { fetchAllStores } from '@/lib/api/stores';
import { StoreCategory, type IStore } from '@repo/shared-types';

export function FashionStores() {
  const [stores, setStores] = useState<IStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadStores() {
      try {
        setIsLoading(true);
        const res = await fetchAllStores({ category: StoreCategory.FASHION });
        if (isMounted) {
          if (res.stores.length > 0) {
            setStores(res.stores);
          } else {
            const allRes = await fetchAllStores();
            setStores(allRes.stores);
          }
        }
      } catch (err) {
        console.warn('Failed to load stores:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadStores();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mt-8 pt-4">
      {/* Title and Sort Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#061842] mb-1">Fashion Stores</h2>
          <p className="text-[14px] font-bold text-[#061842]">Discover top fashion stores near you</p>
        </div>

        <div className="flex items-center gap-2 text-[13px] font-bold mt-4 lg:mt-0">
          <span className="text-[#061842]">Sort By:</span>
          <button className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 transition-colors">
            <span className="text-gray-700 font-medium">Relevance</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Discovering stores...</span>
        </div>
      ) : stores.length === 0 ? (
        <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <StoreIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No stores found nearby</p>
          <p className="text-xs text-slate-400 mt-0.5">Check back soon as more local stores onboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {stores.map((store) => (
            <StoreCard
              key={store._id || (store as any).id}
              store={store}
              className="w-full flex-shrink-1"
            />
          ))}
        </div>
      )}
    </div>
  );
}
