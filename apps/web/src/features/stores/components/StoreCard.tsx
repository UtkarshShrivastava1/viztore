'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Star, Heart, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import type { IStore } from '@repo/shared-types';
import { useWishlistFlyoutStore } from '@/stores/wishlistFlyoutStore';
import { useLocationStore } from '@/stores/location.store';
import { calculateHaversineDistanceKm, formatDistance } from '@/lib/location/distance';

export interface StoreCardProps {
  store: IStore & {
    promoBadge?: string;
    gstVerified?: boolean;
    timingText?: string;
  };
  variant?: 'grid' | 'row';
  className?: string;
}

export function StoreCard({ store, variant = 'grid', className }: StoreCardProps) {
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistFlyoutStore();
  const { lat: userLat, lng: userLng, locality: userLocality } = useLocationStore();

  const isWishlisted = wishlistItems.some((i) => i.id === store._id || i.productId === store._id);

  // Compute distance
  let computedDistanceKm = store.distanceKm;
  if (computedDistanceKm === undefined && store.location?.coordinates && userLat && userLng) {
    const [storeLng, storeLat] = store.location.coordinates;
    if (storeLat && storeLng) {
      computedDistanceKm = calculateHaversineDistanceKm(userLat, userLng, storeLat, storeLng);
    }
  }
  const formattedDistance = formatDistance(computedDistanceKm || 0.8);

  const ratingStr = store.rating ? Number(store.rating).toFixed(1) : '4.5';
  const reviewsCount = store.reviewCount || 320;
  const reviewsStr = reviewsCount >= 1000 ? `${(reviewsCount / 1000).toFixed(1)}K` : `${reviewsCount}`;

  const bannerImg = store.bannerUrl || store.logoUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600';
  const isOpen = store.isActive !== false;
  const timing = store.timingText || (isOpen ? 'Open till 9:00 PM' : 'Closing Soon');
  const locality = store.address?.street || store.address?.city || userLocality || 'Boring Road';
  const promo = store.promoBadge || (Number(ratingStr) >= 4.5 ? 'Top Rated' : 'Popular');

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeWishlist(store._id);
    } else {
      addWishlist({
        id: store._id,
        productId: store._id,
        title: store.name,
        storeName: store.name,
        price: 0,
        imageUrl: bannerImg,
      });
    }
  };

  /* -------------------------------------------------------------
   * 1. ROW VARIANT (Mobile Stores Directory - Mob 3.0)
   * ------------------------------------------------------------- */
  if (variant === 'row') {
    return (
      <Link
        href={`/stores/${store.slug || store._id}`}
        className={`group bg-white dark:bg-surface-900 rounded-2xl p-3 border border-surface-200/80 dark:border-surface-800 shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5 ${className || ''}`}
      >
        {/* Left Thumbnail (Mob 3.0) */}
        <div className="w-28 h-24 sm:w-32 sm:h-24 rounded-xl overflow-hidden relative shrink-0 bg-surface-100">
          <img
            src={bannerImg}
            alt={store.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Open / Closing Soon status badge */}
          <span
            className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white shadow-2xs ${
              isOpen ? 'bg-[#06B95F]' : 'bg-[#F59E0B]'
            }`}
          >
            {isOpen ? 'Open' : 'Closing Soon'}
          </span>

          {/* Heart button */}
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label="Wishlist store"
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/30 backdrop-blur-xs flex items-center justify-center text-white hover:text-rose-400 transition-colors"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Center Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-[15px] font-extrabold text-[#061842] dark:text-white truncate group-hover:text-[#1668F6] transition-colors leading-tight">
            {store.name}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-xs">
            <span className="font-extrabold text-[#061842] dark:text-white">{ratingStr}</span>
            <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 inline -mt-0.5" />
            <span className="text-surface-400 text-xs font-normal">({reviewsStr})</span>
          </div>

          <p className="text-[11px] text-surface-500 font-medium truncate mt-0.5">
            {store.category || store.description || "Clothing, Accessories, Footwear & more"}
          </p>

          <p className="text-[11px] text-surface-500 font-medium truncate mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#1668F6] shrink-0 inline" />
            <span>{formattedDistance} • {locality}</span>
          </p>

          <span className="bg-blue-50 text-[#1668F6] dark:bg-blue-950/40 dark:text-blue-400 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5 inline-block w-fit">
            Fast Delivery
          </span>
        </div>

        {/* Right Chevron */}
        <div className="shrink-0 flex items-center pl-1">
          <ChevronRight className="w-5 h-5 text-surface-400 group-hover:translate-x-1 group-hover:text-[#1668F6] transition-all" />
        </div>
      </Link>
    );
  }

  /* -------------------------------------------------------------
   * 2. GRID VARIANT (Desktop Stores Directory - Web 1.4)
   * ------------------------------------------------------------- */
  return (
    <Link
      href={`/stores/${store.slug || store._id}`}
      className={`group bg-white dark:bg-surface-900 rounded-2xl border border-surface-200/80 dark:border-surface-800 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col ${className || 'w-full'}`}
    >
      {/* 16:10 Banner Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-100">
        <img
          src={bannerImg}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top-Left Open Badge */}
        <span
          className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold text-white shadow-2xs ${
            isOpen ? 'bg-[#06B95F]' : 'bg-[#F59E0B]'
          }`}
        >
          {isOpen ? 'Open' : 'Closing Soon'}
        </span>

        {/* Top-Right Heart Wishlist Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label="Wishlist store"
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white text-surface-700 hover:text-rose-500 shadow-md flex items-center justify-center transition-colors"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Bottom-Right Distance Badge (Web 1.4) */}
        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3 text-white" />
          {formattedDistance}
        </span>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex flex-col gap-1.5 flex-1 justify-between bg-white dark:bg-surface-900">
        <div>
          <h3 className="text-[16px] font-extrabold text-[#061842] dark:text-white truncate group-hover:text-[#1668F6] transition-colors leading-tight">
            {store.name}
          </h3>

          <p className="text-[12px] text-surface-500 font-medium truncate mt-1">
            {store.category || store.description || "Men's Fashion • Women's Fashion • Kids Wear"}
          </p>

          <div className="flex items-center gap-1.5 mt-1.5 text-xs">
            <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 inline" />
            <span className="font-extrabold text-[#061842] dark:text-white">{ratingStr}</span>
            <span className="text-surface-400 font-normal">({reviewsCount})</span>
          </div>

          {/* Badges row: GST Verified + Promo chip */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1668F6] dark:bg-blue-950/40 dark:text-blue-400">
              <CheckCircle2 className="w-3 h-3 text-[#1668F6]" />
              GST Verified
            </span>

            {promo && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/60">
                {promo.includes('%') ? promo : `★ ${promo}`}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Timing row */}
        <div className="flex items-center gap-1 text-[11px] text-surface-500 font-medium pt-2 border-t border-surface-100 dark:border-surface-800 mt-2">
          <Clock className="w-3 h-3 text-surface-400 shrink-0" />
          <span>{timing}</span>
        </div>
      </div>
    </Link>
  );
}
