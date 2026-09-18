'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { DealProductCard } from '@/features/deals/components/DealProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';

export function BestDealsGrid() {
  const { data: featuredProducts, isLoading: productsLoading } = useFeaturedProducts(12);

  return (
    <section className="space-y-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg sm:text-2xl font-bold text-[#192168]">Best Deals For You</h2>
        </div>
        <Link
          href="/deals"
          className="flex items-center gap-1 text-sm font-medium sm:font-semibold text-[#192168] sm:text-[#1668F6] hover:text-brand-300 sm:hover:text-[#0f4bba] transition-colors"
        >
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {productsLoading ? (
        <ProductGridSkeleton count={8} />
      ) : featuredProducts && featuredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {featuredProducts.slice(0, 8).map((product) => (
            <DealProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="w-full py-16 text-center bg-white rounded-2xl border border-gray-100">
          <TrendingUp className="w-10 h-10 mx-auto text-surface-400 mb-3" />
          <p className="text-sm text-surface-500">No deals available right now. Check back soon!</p>
        </div>
      )}
    </section>
  );
}
