'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { StoreCardSkeleton } from '@/components/ui/Skeleton';
import { useNearbyStores } from '@/hooks/useNearbyStores';
import { useLocationStore } from '@/stores/location.store';
import { MapPin, Search, Grid, List, CheckCircle2, Navigation, TrendingUp, Star, Clock, Tag, LayoutGrid, Truck, ShieldCheck, BadgePercent } from 'lucide-react';
import { StoreCategory } from '@repo/shared-types';
import { StoreCard } from '@/features/stores/components/StoreCard';

const filters = [
  { label: 'Categories', icon: LayoutGrid },
  { label: 'Distance', icon: MapPin },
  { label: 'Ratings', icon: Star },
  { label: 'Open Now', icon: Clock },
  { label: 'Offers', icon: Tag },
];

export interface StoresNearYouHeroProps {
  city?: string;
  state?: string;
}

export default function StoresPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const city = searchParams?.city as string || "Bhilai";
  const state = searchParams?.state as string || "Chhattisgarh";
  const { lng, lat, address } = useLocationStore();
  const [activeCategory, setActiveCategory] = useState<StoreCategory | undefined>(undefined);
  const { data: stores, isLoading } = useNearbyStores(lng, lat, 10, activeCategory);
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');

  return (
    <div className="min-h-screen bg-transparent pt-6 pb-20 md:pb-0">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-2 space-y-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-surface-500">
          <Link href="/" className="hover:text-[#1668F6] transition-colors">Home</Link>
          <span className="text-surface-300">›</span>
          <span className="text-surface-500">Stores <span className="text-[#1668F6]">Near You</span></span>
        </div>

        {/* Hero Banner */}
        <div className="flex flex-col lg:flex-row gap-6 relative">
          
          {/* Main Hero Area (Text + Map) */}
          <div className="flex-1 flex flex-col md:flex-row items-center 
          justify-between bg-gradient-to-r from-white via-blue-50/30 to-blue-100/40 
           rounded-[24px] overflow-hidden relative border border-blue-100/50">
            {/* Map background pattern overlay */}
            <div className="absolute inset-0 left-1/3 opacity-30  mix-blend-multiply pointer-events-none" />
            
            {/* Left Text Area */}
            <div className="p-8 md:p-10 z-10 w-full md:w-auto">
              <h1 className="text-3xl md:text-[40px] leading-tight font-extrabold text-[#0A0F56] mb-3 tracking-tight">Stores Near You</h1>
              <p className="text-[17px] font-bold text-[#0A0F56] mb-1.5">Discover trusted local stores around you.</p>
              <p className="text-[14px] font-medium text-surface-500">Shop from nearby stores and support your local community.</p>
            </div>
            
            {/* Center Map Pill */}
           <div className="relative min-h-[170px] flex-1 overflow-hidden " >
          <MapBackground />

          <div className="absolute inset-0 flex items-center justify-center gap-3">
            <div className="drop-shadow-md">
              <svg viewBox="0 0 24 30" className="h-11 w-11 text-[#2554FF]" fill="currentColor">
                <path d="M12 29S1 18 1 11.5A11 11 0 0 1 23 11.5C23 18 12 29 12 29Z" />
                <circle cx="12" cy="11" r="4.2" fill="white" />
              </svg>
            </div>

            <div className="rounded-2xl bg-white px-5 py-3 shadow-lg">
              <p className="text-[13px] font-medium text-[#2F6BFF]">Near you</p>
              <p className="text-[15px] font-bold text-[#1D3FE0]">
                {city}, {state}
              </p>
            </div>
          </div>
        </div>

        
          </div>
          
          {/* Right Trust Badges */}
          <div className="w-full lg:w-[320px] bg-[#F1F7FE] rounded-[24px] p-6 flex flex-col justify-center gap-5 border  shrink-0">
            <div className="flex items-center gap-4">
              <div className="text-[#1668F6] shrink-0">
                <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <p className="font-extrabold text-[13px] text-[#061842] leading-tight">Support Local Businesses</p>
                <p className="text-[11px] text-surface-500 font-medium">Stronger communities</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-[#1668F6] shrink-0">
                <Truck className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <p className="font-extrabold text-[13px] text-[#061842] leading-tight">Same Day Pickup</p>
                <p className="text-[11px] text-surface-500 font-medium">Convenient & Fast</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-[#1668F6] shrink-0">
                <ShieldCheck className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <p className="font-extrabold text-[13px] text-[#061842] leading-tight">Trusted Stores</p>
                <p className="text-[11px] text-surface-500 font-medium">Verified & Reliable</p>
              </div>
            </div>
          </div>
        </div>

   

        {/* Filter Bar */}
        <div className="flex flex-col xl:flex-row items-center gap-4 pt-4">
           {/* Search */}
           <div className="relative w-full xl:w-[320px] shrink-0">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
             <input 
               type="text" 
               placeholder="Search stores or products..." 
               className="w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-surface-200 text-[13px] font-semibold text-[#061842] placeholder:text-surface-400 focus:outline-none focus:border-[#1668F6] focus:ring-1 focus:ring-[#1668F6] shadow-sm transition-all"
             />
           </div>
           
           {/* Filters */}
           <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 xl:pb-0 w-full">
              {filters.map(filter => {
                const Icon = filter.icon;
                return (
                  <button key={filter.label} className="px-4 py-2.5 rounded-xl bg-white border border-surface-200 text-[13px] font-bold text-[#061842] whitespace-nowrap hover:bg-surface-50 hover:border-surface-300 transition-all flex items-center gap-2 shadow-sm shrink-0">
                    {Icon && <Icon className="w-4 h-4 text-[#061842]" strokeWidth={2} />}
                    {filter.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1 opacity-60">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                );
              })}
           </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 mb-2">
           <h2 className="text-[16px] font-medium text-[#061842]">
             <span className="font-extrabold">{isLoading ? 'Loading...' : `${stores?.length || 124} Stores`}</span> found near you
           </h2>
           
           {/* View Toggle */}
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all border ${
                  viewMode === 'grid' 
                    ? 'bg-[#1668F6] border-[#1668F6] text-white shadow-sm' 
                    : 'bg-white border-surface-200 text-surface-600 hover:text-[#061842] hover:bg-surface-50'
                }`}
              >
                <Grid className="w-4 h-4" strokeWidth={2.5} /> Grid
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all border ${
                  viewMode === 'list' 
                    ? 'bg-[#1668F6] border-[#1668F6] text-white shadow-sm' 
                    : 'bg-white border-surface-200 text-surface-600 hover:text-[#061842] hover:bg-surface-50'
                }`}
              >
                <List className="w-4 h-4" strokeWidth={2.5} /> List
              </button>
           </div>
        </div>

        {/* Store Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-full sm:w-auto"><StoreCardSkeleton /></div>
            ))}
          </div>
        ) : stores && stores.length > 0 ? (
          <div className={`grid gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {stores.map((store) => (
              <StoreCard key={store._id} store={store} className="w-full h-full" />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-surface-200 rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <Search className="w-8 h-8 text-surface-400" />
            </div>
            <p className="text-[#061842] text-lg font-extrabold">No stores found in this area.</p>
            <p className="text-surface-500 text-sm mt-1 font-medium max-w-md mx-auto">Try expanding your search radius or changing your location to find more stores.</p>
          </div>
        )}
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}

/** Feathered watercolor-style map: dense streets, a river, and two park patches. */
function MapBackground() {
  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 700 220"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="mapFade" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#D6E6FB" stopOpacity="1" />
            <stop offset="70%" stopColor="#E7F0FC" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="700" height="220" fill="url(#mapFade)" />

        <g stroke="#FFFFFF" strokeWidth="2.2" opacity="0.85">
          <path d="M0 20 L700 35" />
          <path d="M0 55 L700 45" />
          <path d="M0 85 L700 100" />
          <path d="M0 120 L700 108" />
          <path d="M0 150 L700 165" />
          <path d="M0 185 L700 175" />
          <path d="M40 0 L60 220" />
          <path d="M120 0 L100 220" />
          <path d="M200 0 L230 220" />
          <path d="M300 0 L280 220" />
          <path d="M400 0 L430 220" />
          <path d="M500 0 L470 220" />
          <path d="M580 0 L610 220" />
          <path d="M650 0 L630 220" />
        </g>

        <path
          d="M-10 160 C 120 120, 220 190, 340 140 S 560 90, 710 130"
          stroke="#C7DCF7"
          strokeWidth="10"
          fill="none"
          opacity="0.7"
        />

        <ellipse cx="120" cy="60" rx="46" ry="26" fill="#D9EFDC" opacity="0.9" />
        <ellipse cx="600" cy="170" rx="38" ry="22" fill="#D9EFDC" opacity="0.85" />
      </svg>
    </div>
  );
}
