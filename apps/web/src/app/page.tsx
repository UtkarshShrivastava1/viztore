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
        <section className="hidden md:block max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
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

      </main>

      <Footer />
    </div>
  );
}
