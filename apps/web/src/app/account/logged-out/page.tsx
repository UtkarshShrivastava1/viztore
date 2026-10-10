'use client';

import React from 'react';
import { Store, Tag, Grid, Heart, ShieldCheck, Check } from 'lucide-react';
import { branding } from '@repo/shared-types';

import { useAuthStore } from '@/stores/auth.store';

export default function LoggedOutPage() {
  const openAuthModal = useAuthStore((state) => state.openAuthModal);

  return (
    <main className="min-h-screen bg-[#ffffff] pb-24 pt-10 flex flex-col items-center font-sans">
      <div className="mx-auto w-full px-4">
        
        {/* Success Graphic */}
        <div className="flex flex-col items-center justify-center text-center mb-8 relative">
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            
            <div className="relative z-10 w-32 h-32 bg-white rounded-full flex items-center justify-center border-[3px] border-emerald-500 shadow-sm">
               <Check className="w-16 h-16 text-emerald-500" strokeWidth={3} />
            </div>
            
            {/* Sparkles */}
            <div className="absolute top-8 left-4 text-emerald-300 font-bold">✦</div>
            <div className="absolute bottom-12 left-2 w-2 h-2 rounded-full bg-emerald-200"></div>
            <div className="absolute top-16 right-4 text-emerald-300 font-bold">✦</div>
            <div className="absolute bottom-8 right-6 w-1.5 h-1.5 rounded-full bg-emerald-200"></div>
            <div className="absolute top-2 left-[50%] text-emerald-200 font-bold text-lg">✦</div>
          </div>
          
          <h1 className="text-[22px] font-extrabold text-[#192168] mb-2 leading-tight">You have been logged out</h1>
          <p className="text-[14px] text-surface-500 max-w-[240px] leading-relaxed">
            You have successfully logged out of your account.
          </p>
        </div>

        {/* Login Button */}
        <div className="flex justify-center mb-8">
          <button 
            onClick={() => openAuthModal('login')}
            className="w-full max-w-[280px] rounded-xl bg-[#1668F6] py-3.5 text-[15px] font-bold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
          >
            Login / Sign Up
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-8 max-w-[280px] mx-auto">
          <div className="absolute inset-x-0 h-px bg-surface-200"></div>
          <span className="relative bg-white px-3 text-[11px] font-medium text-surface-400">or</span>
        </div>

        {/* Explore */}
        <div className="mb-6 w-full">
          <h3 className="text-[16px] font-bold text-[#192168] mb-4 text-left">Explore {branding.appName}</h3>
          
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4">
            <ExploreCard 
              icon={<Store className="h-5 w-5 text-emerald-500" />}
              bg="bg-emerald-50"
              title="Local Stores"
              desc="Find and explore trusted local stores"
            />
            <ExploreCard 
              icon={<Tag className="h-5 w-5 text-orange-500" />}
              bg="bg-orange-50"
              title="Best Deals"
              desc="Discover amazing offers and discounts"
            />
            <ExploreCard 
              icon={<Grid className="h-5 w-5 text-purple-500" />}
              bg="bg-purple-50"
              title="Categories"
              desc="Browse products across categories"
            />
            <ExploreCard 
              icon={<Heart className="h-5 w-5 text-rose-500" />}
              bg="bg-rose-50"
              title="Wishlist"
              desc="Save your favorite products"
            />
          </div>
        </div>

        {/* Thank You Banner */}
        <div className="flex items-center gap-3 rounded-xl bg-[#E8F0FE] p-4 relative overflow-hidden mt-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-emerald-500 z-10 border border-emerald-100 shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="z-10">
            <h4 className="font-extrabold text-[#192168] text-[13px] mb-0.5">Thank you for using {branding.appName}</h4>
            <p className="text-[10px] text-surface-600">We hope to see you again soon!</p>
          </div>
        </div>

      </div>
    </main>
  );
}

function ExploreCard({ icon, bg, title, desc }: { icon: React.ReactNode; bg: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center rounded-2xl border border-surface-200 bg-white p-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:border-[#1668F6] transition-all cursor-pointer w-[140px] shrink-0">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${bg}`}>
        {icon}
      </div>
      <h4 className="text-[12px] font-extrabold text-[#192168] mb-1 leading-tight">{title}</h4>
      <p className="text-[10px] text-surface-500 leading-snug">{desc}</p>
    </div>
  );
}
