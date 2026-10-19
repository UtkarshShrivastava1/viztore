'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Footer } from '@/components/layout/Footer';
import { StoreCard } from '@/features/stores/components/StoreCard';
import { fetchAllStores } from '@/lib/api/stores';
import { StoreCategory, type IStore } from '@repo/shared-types';

const FASHION_STORES_MOCK: IStore[] = [
  {
    _id: 'store-style-hub',
    name: 'Style Hub',
    slug: 'style-hub',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    rating: 4.5,
    reviewCount: 1200,
    category: "Men's, Women's & Kids Fashion",
    description: "Men's, Women's & Kids Fashion",
    isVerified: true,
  } as unknown as IStore,
  {
    _id: 'store-trendy-looks',
    name: 'Trendy Looks',
    slug: 'trendy-looks',
    bannerUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
    rating: 4.3,
    reviewCount: 980,
    category: "Women's Fashion & Accessories",
    description: "Women's Fashion & Accessories",
    isVerified: true,
  } as unknown as IStore,
  {
    _id: 'store-urban-wear',
    name: 'Urban Wear',
    slug: 'urban-wear',
    bannerUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
    rating: 4.6,
    reviewCount: 1500,
    category: "Men's Fashion & Casual Wear",
    description: "Men's Fashion & Casual Wear",
    isVerified: true,
  } as unknown as IStore,
];

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
            const fashionList = allRes.stores.filter(s => s.category?.toLowerCase().includes('fashion'));
            setStores(fashionList.length > 0 ? fashionList : FASHION_STORES_MOCK);
          }
        }
      } catch (err) {
        console.warn('Failed to load fashion stores:', err);
        if (isMounted) setStores(FASHION_STORES_MOCK);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadStores();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayStores = stores.length > 0 ? stores : FASHION_STORES_MOCK;

  return (
    <div className="min-h-screen bg-transparent pb-16 lg:pb-0">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' }, 
            { label: 'Stores', href: '/stores' }, 
            { label: 'Fashion Stores' }
          ]} 
        />

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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayStores.map((store) => (
              <StoreCard
                key={store._id || (store as { id?: string }).id}
                store={store}
                className="w-full"
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
