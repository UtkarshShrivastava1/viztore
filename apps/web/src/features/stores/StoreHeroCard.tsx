import React from 'react';
import { Store, Heart, Share2, Star, MapPin, Clock, Truck, RotateCcw, ShieldCheck, Headset, CheckCircle2 } from 'lucide-react';
import { IStore } from '@repo/shared-types';

export function StoreHeroCard({ store }: { store: IStore }) {
  return (
    <div className="relative w-full rounded-[24px] overflow-hidden mb-12 shadow-sm bg-white">
      {/* Background Banner */}
      <div className="absolute inset-0 z-0">
        {store.bannerUrl ? (
          <img src={store.bannerUrl} alt={store.name} className="w-full h-full object-cover object-right" />
        ) : (
          <div className="w-full h-full bg-slate-200" />
        )}
        {/* Gradient overlay to make text readable on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-black/20" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Profile Picture */}
        <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-black flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
          <span className="text-white font-bold text-xl md:text-2xl text-center leading-tight px-2">{store.name}</span>
        </div>

        {/* Store Details */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#192168]">{store.name}</h1>
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
              <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white" /> Verified Store
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#192168] font-medium mb-3">
            <div className="flex items-center gap-1">
              <span className="font-bold text-[15px]">{store.rating.toFixed(1)}</span>
              <Star className="w-4 h-4 text-[#06B95F] fill-[#06B95F]" />
              <span className="text-surface-500">({store.reviewCount || '1.2K'} ratings)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#1668F6]" />
              <span>{store.distanceKm ? `${store.distanceKm.toFixed(1)} km away` : '0.2 km away'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#1668F6]" />
              <span>{store.isActive ? 'Open till 9:00 PM' : 'Closing Soon'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#1668F6]" />
              <span className="text-surface-500">{store.address?.street || 'Boring Road, Patna, Bihar'}</span>
            </div>
          </div>

          <p className="text-sm text-[#192168]/80 max-w-2xl">
            {store.description || 'Trendsetting fashion for every you. Explore a wide range of clothing, accessories, footwear and more.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 md:static md:flex-shrink-0 flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#192168] hover:bg-gray-50 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#192168] hover:bg-gray-50 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Features Banner (overlapping bottom) */}
      <div className="relative z-20 mx-6 md:mx-8 -mb-6 md:-mb-8 bg-white/95 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 translate-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1668F6]">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#192168]">Fast Delivery</h4>
            <p className="text-[11px] font-medium text-surface-500">On orders above ₹199</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-8 bg-surface-200" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1668F6]">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#192168]">Easy Returns</h4>
            <p className="text-[11px] font-medium text-surface-500">7 days return policy</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-8 bg-surface-200" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1668F6]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#192168]">Secure Payments</h4>
            <p className="text-[11px] font-medium text-surface-500">100% secure payments</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-8 bg-surface-200" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1668F6]">
            <Headset className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#192168]">Support</h4>
            <p className="text-[11px] font-medium text-surface-500">24x7 assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
