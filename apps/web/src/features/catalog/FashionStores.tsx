'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';
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
            const fashionList = allRes.stores.filter(s => s.category?.toLowerCase().includes('fashion'));
            setStores(fashionList.length > 0 ? fashionList : FASHION_STORES_MOCK);
          }
        }
      } catch (err) {
        console.warn('Failed to load stores:', err);
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
    <div className="mt-8 pt-4">
      {/* Title and View All Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#061842] mb-0.5">Fashion Stores</h2>
          <p className="text-[14px] font-semibold text-gray-500">Top fashion stores near you</p>
        </div>

        <Link
          href="/stores?category=fashion"
          className="flex items-center gap-1 text-sm font-bold text-[#1668F6] hover:text-[#0f4bba] transition-colors"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="py-12 flex items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Discovering stores...</span>
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
    </div>
  );
}

