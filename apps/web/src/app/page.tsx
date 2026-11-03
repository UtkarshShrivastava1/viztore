import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Store } from 'lucide-react';
import { branding } from '@repo/shared-types';
import { WebSiteJsonLd } from '@/components/seo';
import { HeroBannerCarousel } from '@/features/home/components/HeroBannerCarousel';
import { TrustValuePropsBar } from '@/features/home/components/TrustValuePropsBar';
import { StoresNearYouRail } from '@/features/home/components/StoresNearYouRail';
import { BestDealsGrid } from '@/features/home/components/BestDealsGrid';
import { ExploreStoresGrid } from '@/features/home/components/ExploreStoresGrid';

export const metadata: Metadata = {
  title: `${branding.appName} — Fast Local Store Delivery & Deals Near You`,
  description: `Shop online from local stores in your neighbourhood. Find groceries, fashion, electronics, and daily essentials with fast local delivery. ${branding.tagline}`,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${branding.appName} — Fast Local Store Delivery & Deals Near You`,
    description: `Shop online from local stores in your neighbourhood. Find groceries, fashion, electronics, and daily essentials with fast local delivery.`,
    url: '/',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Search Engine Rich Snippet JSON-LD */}
      <WebSiteJsonLd />

      <main className="mx-auto space-y-8 sm:space-y-12 md:space-y-14 pb-20 md:pb-16 min-h-screen">
        {/* ── 1. HERO SECTION (Seamless Carousel + Trust Value Props) ── */}
        <section className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 pt-3 sm:pt-6 space-y-3 sm:space-y-4">
          <HeroBannerCarousel />
          {/* Mobile Trust Bar */}
          <div className="lg:hidden">
            <TrustValuePropsBar />
          </div>
        </section>

        {/* ── 2. STORES NEAR YOU (Distance-Sorted Local Retailers) ───── */}
        <section className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <StoresNearYouRail />
        </section>

        {/* ── 3. BEST DEALS FOR YOU (Verified Live Deals Grid) ───────── */}
        <section className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <BestDealsGrid />
        </section>

        {/* ── 4. EXPLORE STORES & ECOSYSTEM SHOWCASE ─────────────────── */}
        <section className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <ExploreStoresGrid />
        </section>

        {/* ── MOBILE ONLY: Explore Stores Highlight Banner ──────────── */}
        <section className="md:hidden max-w-[1920px] mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1668F6] via-[#1052c9] to-[#0B1538] p-6 text-white shadow-lg shadow-blue-500/10">
            <div className="relative z-10 space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-blue-100">
                <Store className="w-3.5 h-3.5" /> Hyperlocal Directory
              </span>
              <h2 className="text-xl font-extrabold tracking-tight">
                Explore All Local Stores
              </h2>
              <p className="text-blue-100/80 text-xs max-w-sm leading-relaxed">
                Discover verified local retailers in your city. Browse active deals, local inventory, and get 30-minute doorstep delivery.
              </p>
              <Link
                href="/stores"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0B1538] font-extrabold text-xs hover:bg-white/95 transition-all shadow-md active:scale-95 mt-1"
              >
                Browse Stores <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none blur-sm" />
          </div>
        </section>
      </main>
    </div>
  );
}
