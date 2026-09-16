'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PromoCarousel } from '@/features/home/components/PromoCarousel';
import { TrustBar } from '@/features/home/components/TrustBar';
import { ProductCard } from '@/features/products/components/ProductCard';
import { StoreCard } from '@/features/stores/components/StoreCard';
import { ProductGridSkeleton, StoreCardSkeleton } from '@/components/ui/Skeleton';
import { CategoryStrip } from '@/features/home/components/CategoryStrip';
import { useNearbyStores } from '@/hooks/useNearbyStores';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';
import { useLocationStore } from '@/stores/location.store';

export default function HomePage() {
  const { lng, lat, address } = useLocationStore();
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: nearbyStores, isLoading: storesLoading } = useNearbyStores(lng, lat);
  const { data: featuredProducts, isLoading: productsLoading } = useFeaturedProducts(12);


  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto space-y-6 sm:space-y-8 pb-24 md:pb-12 bg-surface-50 min-h-screen">
        {/* ── DESKTOP CATEGORY STRIP ───────────────────────────────────── */}
        <div className="hidden md:block w-full">
          <CategoryStrip activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        </div>

        {/* ── HERO SECTION (Carousel + TrustBar) ─────────────────────── */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 mt-6 md:mt-8 space-y-4 md:space-y-6">
          <PromoCarousel />
          <TrustBar />
        </div>

        {/* ── Stores Near You ────────────────────────────────────────── */}
        <section className="space-y-4 max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <h2 className="text-lg sm:text-2xl font-bold text-[#192168]">Stores Near You</h2>
            </div>
            <Link
              href="/stores"
              className="flex items-center gap-1 text-sm font-medium sm:font-semibold text-[#192168] sm:text-[#1668F6] hover:text-brand-300 sm:hover:text-[#0f4bba] transition-colors"
            >
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-2">
            {storesLoading ? (
              Array.from({ length: 4 }).map((_, i) => <StoreCardSkeleton key={i} />)
            ) : nearbyStores && nearbyStores.length > 0 ? (
              nearbyStores.slice(0, 8).map((store) => (
                <StoreCard key={store._id} store={store} />
              ))
            ) : (
              <div className="w-full py-12 text-center text-surface-500">
                <p className="text-sm">No stores found nearby. Try changing your location.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Best Deals For You ─────────────────────────────────────── */}
        <section className="space-y-4 max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg sm:text-2xl font-bold text-[#192168]">Best Deals For You</h2>
            </div>
            <Link
              href="/products?sort=discount"
              className="flex items-center gap-1 text-sm font-medium sm:font-semibold text-[#192168] sm:text-[#1668F6] hover:text-brand-300 sm:hover:text-[#0f4bba] transition-colors"
            >
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {productsLoading ? (
            <ProductGridSkeleton count={8} />
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="w-full py-16 text-center glass-card">
              <TrendingUp className="w-10 h-10 mx-auto text-surface-600 mb-3" />
              <p className="text-sm text-surface-500">No products available yet. Check back soon!</p>
            </div>
          )}
        </section>

        {/* ── MOBILE ONLY: Explore Stores CTA ────────────────────────── */}
        <section className="md:hidden relative overflow-hidden rounded-2xl gradient-brand p-8 mx-4">
          <div className="relative z-10 space-y-3">
            <h2 className="text-2xl font-extrabold text-white">
              Explore All Local Stores
            </h2>
            <p className="text-white/80 text-sm max-w-lg">
              Discover amazing products from verified local retailers near you. Filter by category, sort by rating, and find your new favourite shop.
            </p>
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-surface-900 font-semibold text-sm hover:bg-white/90 transition-colors shadow-lg mt-2"
            >
              Browse Stores <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 animate-pulse-soft" />
          <div className="absolute right-20 -top-10 w-24 h-24 rounded-full bg-white/5" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
