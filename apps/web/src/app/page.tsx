'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { HeroBannerCarousel } from '@/features/home/components/HeroBannerCarousel';
import { TrustValuePropsBar } from '@/features/home/components/TrustValuePropsBar';
import { StoresNearYouRail } from '@/features/home/components/StoresNearYouRail';
import { BestDealsGrid } from '@/features/home/components/BestDealsGrid';
import { ExploreStoresGrid } from '@/features/home/components/ExploreStoresGrid';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto space-y-6 sm:space-y-10 pb-20 md:pb-16 bg-[#FAFCFF] min-h-screen">
        {/* ── 1. HERO SECTION (Carousel + Side Trust Perks) ─────────── */}
        <section className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 pt-4 sm:pt-6 space-y-3 sm:space-y-4">
          <HeroBannerCarousel />
          {/* Mobile Trust Bar (Matching Mob 1.0.png) */}
          <div className="lg:hidden">
            <TrustValuePropsBar />
          </div>
        </section>

        {/* ── 2. STORES NEAR YOU (5-Column Compact Grid) ────────────── */}
        <section className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <StoresNearYouRail />
        </section>

        {/* ── 3. BEST DEALS FOR YOU (4-Column Horizontal Split Cards) ── */}
        <section className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <BestDealsGrid />
        </section>

        {/* ── 4. EXPLORE STORES (3-Column Showcase + Trust Bar) ──────── */}
        <section className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <ExploreStoresGrid />
        </section>

        {/* ── MOBILE ONLY: Explore Stores CTA ────────────────────────── */}
        <section className="md:hidden relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 mx-4 text-white shadow-md">
          <div className="relative z-10 space-y-2.5">
            <h2 className="text-xl font-bold">
              Explore All Local Stores
            </h2>
            <p className="text-white/80 text-xs max-w-sm leading-relaxed">
              Discover verified local retailers near you. Browse trending deals, seasonal discounts, and find your new favourite shop.
            </p>
            <Link
              href="/stores"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-[#0B1538] font-bold text-xs hover:bg-white/90 transition-colors shadow mt-2"
            >
              Browse Stores <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
