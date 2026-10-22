'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { HorizontalDealCard } from './HorizontalDealCard';
import { MobileDealCard } from './MobileDealCard';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';
import { useProducts } from '@/hooks/useProducts';
import type { IProduct } from '@repo/shared-types';

export function BestDealsGrid() {
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts(8);
  const { data: allProductsResponse, isLoading: allLoading } = useProducts({ limit: 12 });

  const productsLoading = featuredLoading || allLoading;

  const liveFeatured = featuredProducts && featuredProducts.length > 0 ? featuredProducts : [];
  const liveAll = allProductsResponse?.products && allProductsResponse.products.length > 0 ? allProductsResponse.products : [];

  // Merge live products, starting with featured products then live catalog
  const displayProducts: IProduct[] = [...liveFeatured];
  for (const prod of liveAll) {
    if (displayProducts.length >= 8) break;
    if (!displayProducts.some((p) => p._id === prod._id)) {
      displayProducts.push(prod);
    }
  }

  return (
    <section className="space-y-3.5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B1538]">
          Best Deals for You
        </h2>
        <Link
          href="/deals"
          className="flex items-center gap-1 text-sm font-semibold text-[#1668F6] hover:text-[#0f4bba] transition-colors"
        >
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Mobile Viewport: Horizontal Scroll Rail (Matching Mob 1.0.png) */}
      <div className="flex md:hidden gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
        {productsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[155px] h-52 rounded-2xl bg-surface-100 animate-pulse shrink-0 snap-start" />
          ))
        ) : (
          displayProducts.slice(0, 8).map((product, i) => (
            <MobileDealCard key={product._id || i} product={product} index={i} />
          ))
        )}
      </div>

      {/* Desktop Viewport: 4-Column Grid of Horizontal Split Cards (Matching Web 1.0.png) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {productsLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface-100 animate-pulse" />
          ))
        ) : (
          displayProducts.slice(0, 8).map((product, i) => (
            <HorizontalDealCard key={product._id || i} product={product} index={i} />
          ))
        )}
      </div>
    </section>
  );
}
