'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Zap } from 'lucide-react';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';

export function TrendingDeals() {
  const { data: featuredProducts, isLoading: productsLoading } = useFeaturedProducts(8);

  return (
    <section className="space-y-6 max-w-[1920px] mx-auto py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#061842]">Trending Deals</h2>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider">Limited Time Offers</span>
          </div>
        </div>
        <Link
          href="/products?sort=discount"
          className="flex items-center gap-1 text-sm font-bold text-[#1668F6] hover:text-[#0f4bba] transition-colors"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex sm:hidden items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100 w-max mb-4">
        <Zap className="w-4 h-4 fill-current" />
        <span className="text-[11px] font-bold uppercase tracking-wider">Limited Time Offers</span>
      </div>

      {productsLoading ? (
        <ProductGridSkeleton count={8} />
      ) : featuredProducts && featuredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              // We simulate a discount badge for all trending deals
              badge={Math.random() > 0.3 ? `${Math.floor(Math.random() * 30 + 10)}% OFF` : 'DEAL'} 
            />
          ))}
        </div>
      ) : (
        <div className="w-full py-16 text-center bg-gray-50 rounded-2xl border border-gray-100">
          <Zap className="w-10 h-10 mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">No trending deals available right now. Check back soon!</p>
        </div>
      )}
    </section>
  );
}
