'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { StoreCardSkeleton } from '@/components/ui/Skeleton';
import { useNearbyStores } from '@/hooks/useNearbyStores';
import { useAllStores } from '@/hooks/useAllStores';
import { useLocationStore } from '@/stores/location.store';
import {
  MapPin,
  Search,
  Grid,
  List,
  CheckCircle2,
  Clock,
  Tag,
  Truck,
  ShieldCheck,
  Store,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { StoreCategory, StoreApprovalStatus, type IStore } from '@repo/shared-types';
import { StoreCard } from '@/features/stores/components/StoreCard';
import { StoreDirectoryCard } from '@/features/stores/StoreDirectoryCard';
import { LocationModal } from '@/components/layout/LocationModal';

const CATEGORY_TABS = [
  { label: 'All Stores', value: 'ALL' },
  { label: 'Fashion', value: StoreCategory.FASHION },
  { label: 'Footwear', value: StoreCategory.FOOTWEAR },
  { label: 'Electronics', value: StoreCategory.ELECTRONICS },
  { label: 'Beauty', value: StoreCategory.BEAUTY_CARE },
  { label: 'Home & Living', value: StoreCategory.HOME_LIVING },
];

const FALLBACK_STORES: (IStore & { promoBadge?: string; gstVerified?: boolean; timingText?: string })[] = [
  {
    _id: 'str-fashion-hub',
    ownerId: 'owner-1',
    name: 'Fashion Hub',
    slug: 'fashion-hub',
    category: StoreCategory.FASHION,
    description: 'Clothing, Accessories, Footwear & more',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=200',
    rating: 4.5,
    reviewCount: 1200,
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
    distanceKm: 0.2,
    deliveryRadiusKm: 4,
    promoBadge: 'Top Rated',
    gstVerified: true,
    timingText: 'Open till 9:00 PM',
    address: {
      street: 'Boring Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
    },
    location: { type: 'Point', coordinates: [85.1234, 25.6123] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as (IStore & { promoBadge?: string; gstVerified?: boolean; timingText?: string }),
  {
    _id: 'str-sharma-electronics',
    ownerId: 'owner-2',
    name: 'Sharma Electronics',
    slug: 'sharma-electronics',
    category: StoreCategory.ELECTRONICS,
    description: 'Mobiles, Accessories, Gadgets & more',
    bannerUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800',
    logoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=200',
    rating: 4.3,
    reviewCount: 890,
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
    distanceKm: 0.4,
    deliveryRadiusKm: 4,
    promoBadge: '10% OFF',
    gstVerified: true,
    timingText: 'Open till 8:30 PM',
    address: {
      street: 'Boring Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
    },
    location: { type: 'Point', coordinates: [85.1254, 25.6143] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as (IStore & { promoBadge?: string; gstVerified?: boolean; timingText?: string }),
  {
    _id: 'str-beauty-corner',
    ownerId: 'owner-3',
    name: 'Beauty Corner',
    slug: 'beauty-corner',
    category: StoreCategory.BEAUTY_CARE,
    description: 'Skincare, Haircare, Makeup & more',
    bannerUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
    logoUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=200',
    rating: 4.6,
    reviewCount: 1500,
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
    distanceKm: 0.5,
    deliveryRadiusKm: 4,
    promoBadge: 'Popular',
    gstVerified: true,
    timingText: 'Open till 9:00 PM',
    address: {
      street: 'Boring Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
    },
    location: { type: 'Point', coordinates: [85.1274, 25.6163] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as (IStore & { promoBadge?: string; gstVerified?: boolean; timingText?: string }),
  {
    _id: 'str-home-needs',
    ownerId: 'owner-4',
    name: 'Home Needs',
    slug: 'home-needs',
    category: StoreCategory.HOME_LIVING,
    description: 'Home Decor, Kitchen, Furniture & more',
    bannerUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
    logoUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=200',
    rating: 4.2,
    reviewCount: 760,
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
    distanceKm: 0.7,
    deliveryRadiusKm: 4,
    promoBadge: '5% OFF',
    gstVerified: true,
    timingText: 'Open till 8:00 PM',
    address: {
      street: 'Boring Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
    },
    location: { type: 'Point', coordinates: [85.1294, 25.6183] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as (IStore & { promoBadge?: string; gstVerified?: boolean; timingText?: string }),
  {
    _id: 'str-gadget-store',
    ownerId: 'owner-5',
    name: 'Gadget Store',
    slug: 'gadget-store',
    category: StoreCategory.ELECTRONICS,
    description: 'Smartwatches, Accessories, Audio & more',
    bannerUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
    logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=200',
    rating: 4.4,
    reviewCount: 540,
    isActive: false, // Closing Soon
    approvalStatus: StoreApprovalStatus.APPROVED,
    distanceKm: 0.8,
    deliveryRadiusKm: 4,
    promoBadge: 'Closing Soon',
    gstVerified: true,
    timingText: 'Closing Soon',
    address: {
      street: 'Boring Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
    },
    location: { type: 'Point', coordinates: [85.1314, 25.6203] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as (IStore & { promoBadge?: string; gstVerified?: boolean; timingText?: string }),
  {
    _id: 'str-shoe-world',
    ownerId: 'owner-6',
    name: 'Shoe World',
    slug: 'shoe-world',
    category: StoreCategory.FOOTWEAR,
    description: 'Men, Women & Kids Footwear',
    bannerUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
    logoUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200',
    rating: 4.3,
    reviewCount: 980,
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
    distanceKm: 1.0,
    deliveryRadiusKm: 4,
    promoBadge: 'Top Rated',
    gstVerified: true,
    timingText: 'Open till 9:00 PM',
    address: {
      street: 'Boring Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
    },
    location: { type: 'Point', coordinates: [85.1334, 25.6223] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as (IStore & { promoBadge?: string; gstVerified?: boolean; timingText?: string }),
  {
    _id: 'str-freshmart',
    ownerId: 'owner-7',
    name: 'FreshMart',
    slug: 'freshmart',
    category: StoreCategory.GROCERY_STAPLES,
    description: 'Grocery, Fruits & Vegetables, Daily Needs',
    bannerUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800',
    logoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=200',
    rating: 4.4,
    reviewCount: 276,
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
    distanceKm: 2.3,
    deliveryRadiusKm: 4,
    promoBadge: 'Same Day Pickup',
    gstVerified: true,
    timingText: 'Open till 10:00 PM',
    address: {
      street: 'Station Road',
      city: 'Bhilai',
      state: 'Chhattisgarh',
      pincode: '490001',
    },
    location: { type: 'Point', coordinates: [81.3800, 21.1938] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as (IStore & { promoBadge?: string; gstVerified?: boolean; timingText?: string }),
  {
    _id: 'str-autoride',
    ownerId: 'owner-8',
    name: 'AutoRide',
    slug: 'autoride',
    category: StoreCategory.OTHER,
    description: 'Car Accessories, Bike Accessories, Spare Parts',
    bannerUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    logoUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200',
    rating: 4.1,
    reviewCount: 124,
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
    distanceKm: 3.0,
    deliveryRadiusKm: 5,
    promoBadge: 'Verified',
    gstVerified: true,
    timingText: 'Open till 7:30 PM',
    address: {
      street: 'Ring Road',
      city: 'Bhilai',
      state: 'Chhattisgarh',
      pincode: '490020',
    },
    location: { type: 'Point', coordinates: [81.3900, 21.2000] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as (IStore & { promoBadge?: string; gstVerified?: boolean; timingText?: string }),
  {
    _id: 'str-playzone',
    ownerId: 'owner-9',
    name: 'PlayZone',
    slug: 'playzone',
    category: StoreCategory.SPORTS_FITNESS,
    description: 'Sports Gear, Fitness, Outdoor',
    bannerUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=800',
    logoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=200',
    rating: 4.3,
    reviewCount: 96,
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
    distanceKm: 3.2,
    deliveryRadiusKm: 5,
    promoBadge: 'Top Rated',
    gstVerified: true,
    timingText: 'Open till 9:00 PM',
    address: {
      street: 'Civic Centre',
      city: 'Bhilai',
      state: 'Chhattisgarh',
      pincode: '490006',
    },
    location: { type: 'Point', coordinates: [81.3850, 21.1960] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as (IStore & { promoBadge?: string; gstVerified?: boolean; timingText?: string }),
  {
    _id: 'str-booknest',
    ownerId: 'owner-10',
    name: 'BookNest',
    slug: 'booknest',
    category: StoreCategory.BOOKS_STATIONERY,
    description: 'Books, Stationery, Learning',
    bannerUrl: 'https://images.unsplash.com/photo-1507842229452-78d103b6224e?auto=format&fit=crop&q=80&w=800',
    logoUrl: 'https://images.unsplash.com/photo-1507842229452-78d103b6224e?auto=format&fit=crop&q=80&w=200',
    rating: 4.5,
    reviewCount: 143,
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
    distanceKm: 3.5,
    deliveryRadiusKm: 5,
    promoBadge: 'New Arrivals',
    gstVerified: true,
    timingText: 'Open till 8:30 PM',
    address: {
      street: 'Sector 5 Market',
      city: 'Bhilai',
      state: 'Chhattisgarh',
      pincode: '490006',
    },
    location: { type: 'Point', coordinates: [81.3780, 21.1920] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as (IStore & { promoBadge?: string; gstVerified?: boolean; timingText?: string }),
];

export default function StoresPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { lng, lat, address, locality, city: userCity } = useLocationStore();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Fallback defaults for city/state presentation
  const detectedCity = userCity || 'Patna';
  const detectedState = address ? address.split(',')[1]?.trim() || 'Bihar' : 'Bihar';
  const city = (searchParams?.city as string) || detectedCity;
  const state = (searchParams?.state as string) || detectedState;
  const currentAddressLabel = address || `${locality || 'Boring Road'}, ${city}, ${state}`;

  // Interactive UI state
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'nearest' | 'rating' | 'fastest'>('nearest');
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [maxRadius, setMaxRadius] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Backend queries
  const apiCategory = activeCategory === 'ALL' ? undefined : (activeCategory as StoreCategory);
  const { data: nearbyStores, isLoading: nearbyLoading } = useNearbyStores(lng, lat, 10, apiCategory);
  const { data: allStoresResponse, isLoading: allLoading } = useAllStores({ category: apiCategory });

  const rawStores = useMemo(() => {
    const serverStores = (nearbyStores && nearbyStores.length > 0)
      ? nearbyStores
      : (allStoresResponse?.stores && allStoresResponse.stores.length > 0)
        ? allStoresResponse.stores
        : [];

    if (serverStores.length > 0) {
      return serverStores;
    }
    return FALLBACK_STORES;
  }, [nearbyStores, allStoresResponse]);

  const isLoading = nearbyLoading || (allLoading && rawStores.length === 0);

  // Filter & Sort Pipeline
  const filteredStores = useMemo(() => {
    let list = [...rawStores];

    // 1. Category Filter
    if (activeCategory !== 'ALL') {
      list = list.filter((s) => {
        const cat = String(s.category || '').toLowerCase();
        return cat.includes(activeCategory.toLowerCase()) || activeCategory.toLowerCase().includes(cat);
      });
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        (s.category && String(s.category).toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q))
      );
    }

    // 3. Open Now Filter
    if (openNowOnly) {
      list = list.filter((s) => s.isActive !== false);
    }

    // 4. Radius Filter
    if (maxRadius !== null) {
      list = list.filter((s) => (s.distanceKm || 0) <= maxRadius);
    }

    // 5. Sorting
    if (sortBy === 'nearest') {
      list.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'fastest') {
      list.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }

    return list;
  }, [rawStores, activeCategory, searchQuery, openNowOnly, maxRadius, sortBy]);

  return (
    <div className="min-h-screen bg-transparent pt-4 pb-20 lg:pb-12">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 space-y-4">

        {/* -------------------------------------------------------------
            MOBILE SECTION (Mob 3.0: Stores Directory)
            ------------------------------------------------------------- */}
        <div className="block lg:hidden space-y-4">
          {/* Location Context Header (Mob 3.0) */}
          <div className="flex items-center gap-3.5 bg-white dark:bg-surface-900 p-3 rounded-2xl border border-surface-200/80 dark:border-surface-800 shadow-2xs">
            {/* Storefront Icon in Light-Blue Circle */}
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
              <Store className="w-6 h-6 text-[#1668F6]" strokeWidth={2} />
            </div>

            {/* Title, Subtitle & Location */}
            <div className="flex-1 min-w-0">
              <h1 className="text-[17px] font-extrabold text-[#061842] dark:text-white leading-tight">
                Stores Near Me
              </h1>
              <p className="text-[11px] text-surface-500 font-medium">
                Showing stores near your current location
              </p>
              <div className="flex items-center gap-1 text-[11px] text-surface-600 dark:text-surface-400 mt-0.5 truncate">
                <MapPin className="w-3 h-3 text-[#1668F6] shrink-0" />
                <span className="truncate">{currentAddressLabel}</span>
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="text-[#1668F6] font-bold hover:underline shrink-0 ml-1"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Category Pill Rail (Mob 3.0) */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveCategory(tab.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#1668F6] text-white shadow-xs'
                      : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:bg-surface-50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}

            {/* Filter Pill */}
            <button
              type="button"
              onClick={() => setOpenNowOnly((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${
                openNowOnly
                  ? 'bg-blue-50 border-[#1668F6] text-[#1668F6]'
                  : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{openNowOnly ? 'Open Now ✓' : 'Filter'}</span>
            </button>
          </div>

          {/* Sort Header (Mob 3.0) */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-bold text-surface-500">
              {filteredStores.length} stores nearby
            </span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-surface-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'nearest' | 'rating' | 'fastest')}
                aria-label="Sort stores"
                className="bg-transparent text-xs font-extrabold text-[#061842] dark:text-white cursor-pointer focus:outline-none"
              >
                <option value="nearest">Nearest First</option>
                <option value="rating">Highest Rated</option>
                <option value="fastest">Fastest Delivery</option>
              </select>
            </div>
          </div>

          {/* Store List Stack (Mob 3.0) */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-surface-100 animate-pulse" />
              ))}
            </div>
          ) : filteredStores.length > 0 ? (
            <div className="space-y-3">
              {filteredStores.map((store) => (
                <StoreCard key={store._id} store={store} variant="row" />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white dark:bg-surface-900 border border-surface-200 rounded-2xl">
              <Store className="w-12 h-12 text-surface-400 mx-auto mb-3" />
              <p className="text-[#061842] dark:text-white font-extrabold text-base">No stores found</p>
              <p className="text-surface-500 text-xs mt-1">Try clearing filters or changing your location</p>
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------
            DESKTOP SECTION (Web 1.4: Stores Near You)
            ------------------------------------------------------------- */}
        <div className="hidden lg:block space-y-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-surface-500">
            <Link href="/" className="hover:text-[#1668F6] transition-colors">Home</Link>
            <span className="text-surface-300">›</span>
            <span className="text-surface-500">Stores <span className="text-[#1668F6]">Near You</span></span>
          </div>

          {/* Hero Banner (Web 1.4) */}
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 relative">
            {/* Main Hero Area (Text + Map) */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-white via-blue-50/40 to-blue-100/50 rounded-[24px] overflow-hidden relative border border-blue-100/60 shadow-xs">
              {/* Left Text Area */}
              <div className="p-6 md:p-8 lg:p-9 z-10 w-full md:w-auto">
                <h1 className="text-2xl md:text-3xl lg:text-[38px] leading-tight font-extrabold text-[#061842] mb-2 tracking-tight">
                  Stores Near You
                </h1>
                <p className="text-[15px] lg:text-[17px] font-bold text-[#061842] mb-1">
                  Discover trusted local stores around you.
                </p>
                <p className="text-[13px] lg:text-[14px] font-medium text-surface-500">
                  Shop from nearby stores and support your local community.
                </p>
              </div>

              {/* Center Map Pill */}
              <div className="relative min-h-[170px] lg:min-h-[190px] flex-1 overflow-hidden w-full md:w-auto">
                <MapBackground />

                <div className="absolute inset-0 flex items-center justify-center gap-3">
                  <div className="drop-shadow-md">
                    <svg viewBox="0 0 24 30" className="h-11 w-11 text-[#2554FF]" fill="currentColor">
                      <path d="M12 29S1 18 1 11.5A11 11 0 0 1 23 11.5C23 18 12 29 12 29Z" />
                      <circle cx="12" cy="11" r="4.2" fill="white" />
                    </svg>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="rounded-2xl bg-white px-5 py-3 shadow-lg hover:shadow-xl transition-shadow text-left group"
                  >
                    <p className="text-[12px] font-semibold text-[#2F6BFF] flex items-center gap-1">
                      <span>Near you</span>
                      <span className="text-[10px] text-surface-400 group-hover:text-blue-600">(Change)</span>
                    </p>
                    <p className="text-[15px] font-extrabold text-[#1D3FE0] truncate max-w-[200px]">
                      {city}, {state}
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Trust Badges (Web 1.4) */}
            <div className="w-full hidden lg:flex lg:w-[280px] xl:w-[320px] bg-[#F1F7FE] rounded-[24px] p-5 lg:p-6 flex-col justify-center gap-4 lg:gap-5 border border-blue-100/60 shrink-0 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="text-[#1668F6] shrink-0">
                  <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <p className="font-extrabold text-[13px] text-[#061842] leading-tight">Support Local Businesses</p>
                  <p className="text-[11px] text-surface-500 font-medium mt-0.5">Stronger communities</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="text-[#1668F6] shrink-0">
                  <Truck className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <p className="font-extrabold text-[13px] text-[#061842] leading-tight">Same Day Pickup</p>
                  <p className="text-[11px] text-surface-500 font-medium mt-0.5">Convenient & Fast</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="text-[#1668F6] shrink-0">
                  <ShieldCheck className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <p className="font-extrabold text-[13px] text-[#061842] leading-tight">Trusted Stores</p>
                  <p className="text-[11px] text-surface-500 font-medium mt-0.5">Verified & Reliable</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Toolbar (Web 1.4) */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {/* Search Input */}
            <div className="relative w-[300px] xl:w-[340px] shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stores or products..."
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-surface-200 text-[13px] font-semibold text-[#061842] placeholder:text-surface-400 focus:outline-none focus:border-[#1668F6] focus:ring-1 focus:ring-[#1668F6] shadow-2xs transition-all"
              />
            </div>

            {/* Filter Dropdown Buttons */}
            <div className="flex-1 flex items-center gap-2.5 overflow-x-auto scrollbar-hide">
              {/* Categories Filter */}
              <div className="relative">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  aria-label="Filter by category"
                  className="h-11 px-3.5 pr-8 rounded-xl bg-white border border-surface-200 text-[13px] font-bold text-[#061842] appearance-none cursor-pointer hover:bg-surface-50 shadow-2xs focus:outline-none"
                >
                  <option value="ALL">Categories</option>
                  <option value={StoreCategory.FASHION}>Fashion</option>
                  <option value={StoreCategory.FOOTWEAR}>Footwear</option>
                  <option value={StoreCategory.ELECTRONICS}>Electronics</option>
                  <option value={StoreCategory.BEAUTY_CARE}>Beauty</option>
                  <option value={StoreCategory.HOME_LIVING}>Home & Living</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-surface-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Distance Filter */}
              <div className="relative">
                <select
                  value={maxRadius ?? ''}
                  onChange={(e) => setMaxRadius(e.target.value ? Number(e.target.value) : null)}
                  aria-label="Filter by distance"
                  className="h-11 px-3.5 pr-8 rounded-xl bg-white border border-surface-200 text-[13px] font-bold text-[#061842] appearance-none cursor-pointer hover:bg-surface-50 shadow-2xs focus:outline-none"
                >
                  <option value="">Distance</option>
                  <option value="1">Within 1 km</option>
                  <option value="2">Within 2 km</option>
                  <option value="3">Within 3 km</option>
                  <option value="5">Within 5 km</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-surface-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Ratings Filter */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'nearest' | 'rating' | 'fastest')}
                  aria-label="Filter by rating"
                  className="h-11 px-3.5 pr-8 rounded-xl bg-white border border-surface-200 text-[13px] font-bold text-[#061842] appearance-none cursor-pointer hover:bg-surface-50 shadow-2xs focus:outline-none"
                >
                  <option value="nearest">Ratings (All)</option>
                  <option value="rating">★ 4.0+ Top Rated</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-surface-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Open Now Toggle */}
              <button
                type="button"
                onClick={() => setOpenNowOnly((prev) => !prev)}
                className={`h-11 px-4 rounded-xl border text-[13px] font-bold transition-all shadow-2xs flex items-center gap-1.5 ${
                  openNowOnly
                    ? 'bg-blue-50 border-[#1668F6] text-[#1668F6]'
                    : 'bg-white border-surface-200 text-[#061842] hover:bg-surface-50'
                }`}
              >
                <Clock className="w-4 h-4 text-surface-500" />
                <span>Open Now</span>
                <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
              </button>

              {/* Offers */}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery((prev) => (prev ? '' : 'OFF'));
                }}
                className={`h-11 px-4 rounded-xl border text-[13px] font-bold transition-all shadow-2xs flex items-center gap-1.5 ${
                  searchQuery === 'OFF'
                    ? 'bg-blue-50 border-[#1668F6] text-[#1668F6]'
                    : 'bg-white border-surface-200 text-[#061842] hover:bg-surface-50'
                }`}
              >
                <Tag className="w-4 h-4 text-surface-500" />
                <span>Offers</span>
                <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
              </button>
            </div>

            {/* View Mode Toggle (Web 1.4) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  viewMode === 'grid'
                    ? 'bg-[#1668F6] border-[#1668F6] text-white shadow-2xs'
                    : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50'
                }`}
              >
                <Grid className="w-4 h-4" /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  viewMode === 'list'
                    ? 'bg-[#1668F6] border-[#1668F6] text-white shadow-2xs'
                    : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50'
                }`}
              >
                <List className="w-4 h-4" /> List
              </button>
            </div>
          </div>

          {/* Results Count Heading (Web 1.4) */}
          <div className="pt-2">
            <h2 className="text-[17px] font-extrabold text-[#061842]">
              {isLoading ? 'Loading stores...' : `${filteredStores.length} Stores found near you`}
            </h2>
          </div>

          {/* Store Grid (4-Columns Web 1.4) */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-full"><StoreCardSkeleton /></div>
              ))}
            </div>
          ) : filteredStores.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {filteredStores.map((store) =>
                viewMode === 'grid' ? (
                  <StoreCard key={store._id} store={store} variant="grid" className="w-full h-full" />
                ) : (
                  <StoreDirectoryCard key={store._id} store={store} />
                )
              )}
            </div>
          ) : (
            <div className="py-20 text-center bg-white border border-surface-200 rounded-2xl shadow-2xs">
              <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-surface-400" />
              </div>
              <p className="text-[#061842] text-lg font-extrabold">No stores found matching your filters.</p>
              <p className="text-surface-500 text-sm mt-1 font-medium max-w-md mx-auto">
                Try expanding your search radius, resetting category or changing your location.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('ALL');
                  setSearchQuery('');
                  setOpenNowOnly(false);
                  setMaxRadius(null);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-50 text-[#1668F6] text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
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
