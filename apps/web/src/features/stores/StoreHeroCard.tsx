'use client';

import React, { useState } from 'react';
import {
  Heart,
  Share2,
  MapPin,
  Clock,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headset,
  CheckCircle2,
  Check,
  Star,
  Store as StoreIcon,
} from 'lucide-react';
import { IStore } from '@repo/shared-types';
import { useLocationStore } from '@/stores/location.store';
import { useFavoriteStoresStore } from '@/stores/favoriteStoresStore';
import {
  calculateHaversineDistanceKm,
  formatDistance,
  isWithinDeliveryZone,
} from '@/lib/location/distance';

export function StoreHeroCard({ store }: { store: IStore }) {
  const { lat: userLat, lng: userLng } = useLocationStore();
  const { isFavorite, toggleFavorite } = useFavoriteStoresStore();
  const [copied, setCopied] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [bannerFailed, setBannerFailed] = useState(false);

  const storeId = store._id || (store as any).id || store.slug;
  const isFav = isFavorite(storeId);

  // Dynamic Haversine distance calculation between customer GPS and store coordinates
  let computedDistanceKm = store.distanceKm;
  if (computedDistanceKm === undefined && store.location?.coordinates && userLat && userLng) {
    const [storeLng, storeLat] = store.location.coordinates;
    if (storeLat && storeLng) {
      computedDistanceKm = calculateHaversineDistanceKm(userLat, userLng, storeLat, storeLng);
    }
  }

  const deliveryRadius = store.deliveryRadiusKm || 4;
  const inZone = isWithinDeliveryZone(computedDistanceKm, deliveryRadius);
  const formattedDistance = formatDistance(computedDistanceKm);

  const formattedAddress = [
    store.address?.street,
    store.address?.landmark,
    store.address?.city,
    store.address?.state,
    store.address?.pincode ? `- ${store.address.pincode}` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: store.name,
          text: store.description || `Check out ${store.name} on our platform!`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // user cancelled or share failed, fallback to clipboard
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasLogo = Boolean(store.logoUrl && !logoFailed);

  return (
    <div className="w-full mb-8 space-y-4">
      {/* 1. Main Cover & Store Profile Card */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm bg-white overflow-hidden">
        {/* Cover Banner Area */}
        <div className="relative w-full h-44 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-950 overflow-hidden">
          {store.bannerUrl && !bannerFailed ? (
            <>
              {/* Desktop banner */}
              <img
                src={store.bannerUrl}
                alt={`${store.name} Banner`}
                className="hidden sm:block w-full h-full object-cover object-center"
                onError={() => setBannerFailed(true)}
              />
              {/* Mobile banner */}
              <img
                src={(store as any).mobileBannerUrl || store.bannerUrl}
                alt={`${store.name} Mobile Banner`}
                className="block sm:hidden w-full h-full object-cover object-center"
                onError={() => setBannerFailed(true)}
              />
              {/* Subtle bottom vignette gradient so banner transitions cleanly into card */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 flex items-center justify-center">
              <StoreIcon className="w-16 h-16 text-white/20" />
            </div>
          )}

          {/* Floating Action Buttons on Banner (Heart + Share) */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(store)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-90 ${
                isFav
                  ? 'bg-rose-500 text-white ring-2 ring-white/80'
                  : 'bg-white/85 text-slate-800 hover:bg-white hover:text-rose-500'
              }`}
              title={isFav ? 'Remove from saved stores' : 'Save store to favorites'}
              aria-label={isFav ? 'Remove from saved stores' : 'Save store to favorites'}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFav ? 'fill-white' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-800 shadow-md active:scale-90 transition-all"
              title={copied ? 'Link copied!' : 'Share store'}
              aria-label="Share store"
            >
              {copied ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Store Profile Identity Section */}
        <div className="relative px-4 sm:px-6 md:px-8 pb-6 pt-0">
          {/* Logo & Core Info Row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
            {/* Logo Avatar */}
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl bg-white border-4 border-white shadow-xl overflow-hidden shrink-0 flex items-center justify-center">
              {hasLogo ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="w-full h-full object-cover"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white font-black text-xl sm:text-2xl text-center px-2">
                  {store.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Quick Status Pill (Open / Closed) */}
            <div className="sm:mb-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  store.isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${store.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}
                />
                {store.isActive ? 'Store Open • Delivers in 20-40 min' : 'Store Currently Closed'}
              </span>
            </div>
          </div>

          {/* Store Name & Badges */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                {store.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Verified Store
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {store.rating ? store.rating.toFixed(1) : '4.8'}
                <span className="text-amber-700/70 font-normal">({store.reviewCount || 42})</span>
              </span>
            </div>

            {/* Metadata Chips: Distance, Timing, Address */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className={`w-4 h-4 shrink-0 ${inZone ? 'text-blue-600' : 'text-amber-600'}`} />
                <span className={inZone ? 'font-semibold text-slate-800' : 'font-bold text-amber-700'}>
                  {formattedDistance}
                </span>
                {!inZone && computedDistanceKm !== undefined && (
                  <span className="text-[11px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                    Outside delivery zone ({deliveryRadius} km max)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{store.isActive ? 'Open till 9:00 PM' : 'Opens tomorrow 10:00 AM'}</span>
              </div>

              {formattedAddress && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate max-w-md" title={formattedAddress}>
                    {formattedAddress}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {store.description && (
              <p className="text-xs sm:text-sm text-slate-600 pt-1 leading-relaxed max-w-3xl">
                {store.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Value Props Bar (4-Column Responsive Strip) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 sm:p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Fast Delivery</h4>
            <p className="text-[10px] sm:text-xs text-slate-500 truncate">On orders above ₹199</p>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Easy Returns</h4>
            <p className="text-[10px] sm:text-xs text-slate-500 truncate">7 days return policy</p>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Secure Pay</h4>
            <p className="text-[10px] sm:text-xs text-slate-500 truncate">100% safe & verified</p>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Headset className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Store Support</h4>
            <p className="text-[10px] sm:text-xs text-slate-500 truncate">Direct store assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
