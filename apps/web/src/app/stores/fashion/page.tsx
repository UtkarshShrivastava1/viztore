'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Store as StoreIcon, Loader2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { StoreCard } from '@/features/stores/components/StoreCard';
import { fetchAllStores } from '@/lib/api/stores';
import { StoreCategory, type IStore } from '@repo/shared-types';

export default function FashionStoresPage() {
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
        console.warn('Failed to load fashion stores:', err);
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
    <div className="min-h-screen bg-transparent pb-16 lg:pb-0">
      <main className="max-w-[1920px] mx-auto lg:px-6 lg:py-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Fashion Stores' }]} />

        {/* Title and Sort Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#061842] mb-1">Fashion Stores</h1>
            <p className="text-[14px] font-bold text-[#061842]">Discover top fashion stores near you</p>
          </div>

          <div className="flex items-center gap-2 text-[13px] font-bold mt-4 lg:mt-0">
            <span className="text-[#061842]">Sort By:</span>
            <button className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300">
              <span className="text-gray-700 font-medium">Relevance</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Stores Grid */}
        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm font-medium">Loading nearby fashion stores...</span>
          </div>
        ) : stores.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <StoreIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No stores found</h3>
            <p className="text-xs text-slate-500 mt-1">
              There are no stores available in this category yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stores.map((store) => (
              <StoreCard
                key={store._id || (store as any).id}
                store={store}
                className="w-full flex-shrink-1"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
