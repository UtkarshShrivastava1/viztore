'use client';

import React, { useState } from 'react';
import { Heart, Share2, MapPin, Clock, Truck, RotateCcw, ShieldCheck, Headset, CheckCircle2, Star, Zap, Check } from 'lucide-react';
import type { IStore } from '@repo/shared-types';
import { useLocationStore } from '@/stores/location.store';
import { calculateHaversineDistanceKm, formatDistance } from '@/lib/location/distance';
import { useWishlistFlyoutStore } from '@/stores/wishlistFlyoutStore';

export function StoreHeroCard({ store }: { store: IStore }) {
  const { lat: userLat, lng: userLng, city: userCity, address: userAddress } = useLocationStore();
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistFlyoutStore();
  const [copied, setCopied] = useState(false);

  const isWishlisted = wishlistItems.some((i) => i.id === store._id || i.productId === store._id);

  // Compute dynamic distance
  let computedDistanceKm = store.distanceKm;
  if (computedDistanceKm === undefined && store.location?.coordinates && userLat && userLng) {
    const [storeLng, storeLat] = store.location.coordinates;
    if (storeLat && storeLng) {
      computedDistanceKm = calculateHaversineDistanceKm(userLat, userLng, storeLat, storeLng);
    }
  }
  const formattedDistance = formatDistance(computedDistanceKm || 0.2);

  const userState = userAddress ? userAddress.split(',')[1]?.trim() || 'Bihar' : 'Bihar';

  const formattedAddress = [
    store.address?.street || 'Boring Road',
    store.address?.city || userCity || 'Patna',
    store.address?.state || userState || 'Bihar',
  ]
    .filter(Boolean)
    .join(', ');

  const ratingStr = store.rating ? Number(store.rating).toFixed(1) : '4.5';
  const reviewsCount = store.reviewCount || 1200;
  const reviewsStr = reviewsCount >= 1000 ? `${(reviewsCount / 1000).toFixed(1)}K` : `${reviewsCount}`;

  const bannerImg = store.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200';
  const isOpen = store.isActive !== false;

  const handleHeartClick = () => {
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

  const handleShareClick = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy store link:', err);
      }
    }
  };

  return (
    <div className="w-full">
      {/* -----------------------------------------------------------------
          MOBILE VIEW (Mob 3.1)
          ----------------------------------------------------------------- */}
      <div className="block lg:hidden space-y-3 mb-6">
        {/* Store Card (Image + Info) */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200/80 dark:border-surface-800 p-3 shadow-2xs">
          {/* Showcase Cover Photo */}
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-surface-100">
            <img
              src={bannerImg}
              alt={store.name}
              className="w-full h-full object-cover"
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
              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-surface-700 hover:text-rose-500 shadow flex items-center justify-center transition-colors"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Store Details Below Photo */}
          <div className="pt-3">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xl font-extrabold text-[#061842] dark:text-white truncate">
                {store.name}
              </h1>
              <button
                type="button"
                onClick={handleShareClick}
                aria-label="Share store"
                className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#1668F6] flex items-center justify-center hover:bg-blue-100 transition-colors shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-1 text-xs">
              <span className="font-extrabold text-[#061842] dark:text-white">{ratingStr}</span>
              <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 inline -mt-0.5" />
              <span className="text-surface-400 font-normal">({reviewsStr})</span>
            </div>

            {/* Category */}
            <p className="text-[12px] text-surface-500 font-medium mt-1 truncate">
              {store.category || store.description || 'Clothing, Accessories, Footwear & more'}
            </p>

            {/* Location & Distance */}
            <p className="text-[12px] text-surface-500 font-medium mt-1 flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#1668F6] shrink-0 inline" />
              <span>{formattedDistance} • {formattedAddress}</span>
            </p>

            {/* Trust Pills */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1668F6] text-xs font-semibold">
                <Zap className="w-3 h-3 fill-[#1668F6]" />
                Fast Delivery
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1668F6] text-xs font-semibold">
                <RotateCcw className="w-3 h-3" />
                Easy Returns
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal Trust Features Rail (Mob 3.1) */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200/80 dark:border-surface-800 p-3 shadow-2xs">
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1668F6] flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#061842] dark:text-white leading-tight">Fast Delivery</p>
                <p className="text-[10px] text-surface-400 font-medium truncate">On orders above ₹199</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1668F6] flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#061842] dark:text-white leading-tight">Easy Returns</p>
                <p className="text-[10px] text-surface-400 font-medium truncate">7 days return policy</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1668F6] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#061842] dark:text-white leading-tight">Secure Payments</p>
                <p className="text-[10px] text-surface-400 font-medium truncate">100% secure payments</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1668F6] flex items-center justify-center shrink-0">
                <Headset className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#061842] dark:text-white leading-tight">Support</p>
                <p className="text-[10px] text-surface-400 font-medium truncate">24x7 assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          DESKTOP VIEW (Web 3.1)
          ------------------------------------------------------------- */}
      <div className="hidden lg:block bg-white dark:bg-surface-900 rounded-3xl border border-surface-200/80 dark:border-surface-800 p-6 xl:p-8 shadow-xs mb-8">
        {/* Top Profile Matrix + Interior Cover Banner */}
        <div className="flex items-center justify-between gap-8 pb-6 border-b border-surface-100 dark:border-surface-800">
          {/* Left: Avatar & Identity Details */}
          <div className="flex items-center gap-6 flex-1 min-w-0">
            {/* Store Avatar Logo */}
            <div className="w-28 h-28 rounded-full bg-[#061842] text-white flex items-center justify-center font-extrabold text-2xl text-center leading-none border-4 border-white dark:border-surface-800 shadow-md overflow-hidden shrink-0">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <span className="px-2">{store.name}</span>
              )}
            </div>

            {/* Store Info */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-3xl font-extrabold text-[#061842] dark:text-white">
                  {store.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1668F6] dark:bg-blue-950/40 dark:text-blue-400 text-xs font-bold border border-blue-100/60">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-[#1668F6] text-white" />
                  Verified Store
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span className="font-extrabold text-[#061842] dark:text-white">{ratingStr}</span>
                <span className="text-surface-400 font-medium">({reviewsStr} ratings)</span>
              </div>

              {/* Timing, Distance & Address */}
              <div className="flex items-center gap-3 text-xs font-semibold text-surface-600 dark:text-surface-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1668F6]" />
                  {formattedDistance} away
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1668F6]" />
                  Open till 9:00 PM ▾
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 truncate max-w-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#1668F6]" />
                  {formattedAddress}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-surface-500 font-medium max-w-2xl line-clamp-2 pt-0.5">
                {store.description || 'Trendsetting fashion for every you. Explore a wide range of clothing, accessories, footwear and more.'}
              </p>
            </div>
          </div>

          {/* Right: Interior Cover Banner with Floating Actions */}
          <div className="w-[420px] xl:w-[460px] h-48 rounded-2xl overflow-hidden relative shadow-sm shrink-0 bg-surface-100">
            <img
              src={bannerImg}
              alt={store.name}
              className="w-full h-full object-cover"
            />
            {/* Top-Right Floating Heart & Share buttons */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleHeartClick}
                aria-label="Wishlist store"
                className="w-9 h-9 rounded-full bg-white/95 text-surface-700 hover:text-rose-500 shadow-md flex items-center justify-center transition-colors"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              <button
                type="button"
                onClick={handleShareClick}
                aria-label="Share store"
                className="w-9 h-9 rounded-full bg-white/95 text-surface-700 hover:text-[#1668F6] shadow-md flex items-center justify-center transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Trust Features Bar (Web 3.1) */}
        <div className="pt-5 grid grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1668F6] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#061842] dark:text-white">Fast Delivery</h4>
              <p className="text-[11px] text-surface-400 font-medium">On orders above ₹199</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1668F6] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#061842] dark:text-white">Easy Returns</h4>
              <p className="text-[11px] text-surface-400 font-medium">7 days return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1668F6] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#061842] dark:text-white">Secure Payments</h4>
              <p className="text-[11px] text-surface-400 font-medium">100% secure payments</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1668F6] flex items-center justify-center shrink-0">
              <Headset className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#061842] dark:text-white">Support</h4>
              <p className="text-[11px] text-surface-400 font-medium">24x7 assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
