'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { TrustValuePropsBar } from '@/features/home/components/TrustValuePropsBar';
import { ExploreStoresGrid } from '@/features/home/components/ExploreStoresGrid';
import { StoresNearYouRail } from '@/features/home/components/StoresNearYouRail';
import { BestDealsGrid } from '@/features/home/components/BestDealsGrid';
import { useLocationStore } from '@/stores/location.store';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';
import HomeHeroBanner from '@/features/home/components/HomeHeroBanner';

export default function HomePage() {
  const { address } = useLocationStore();
  const [activeCategory, setActiveCategory] = useState('all');


  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto space-y-6 sm:space-y-8 pb-24 md:pb-12 bg-surface-50 min-h-screen">
       

        {/* ── HERO SECTION (Carousel + TrustBar) ─────────────────────── */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 mt-4 md:mt-6 space-y-4 md:space-y-6">
        
          <HomeHeroBanner/>
          <div className="lg:hidden">
            <TrustValuePropsBar />
          </div>
        </div>

        {/* ── Explore Stores Showcase ─────────────────────────────────── */}
        <section className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <ExploreStoresGrid />
        </section>

        {/* ── Stores Near You ────────────────────────────────────────── */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <StoresNearYouRail />
        </div>

        {/* ── Best Deals For You ─────────────────────────────────────── */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <BestDealsGrid />
        </div>

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
