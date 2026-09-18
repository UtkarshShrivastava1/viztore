'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Store, Tag, Grid, Heart, ShieldCheck } from 'lucide-react';
import { branding } from '@repo/shared-types';

import { useAuthStore } from '@/stores/auth.store';

export default function LoggedOutPage() {
  const router = useRouter();
  const openAuthModal = useAuthStore((state) => state.openAuthModal);

  return (
    <main className="min-h-screen bg-white pb-24 pt-10 flex flex-col items-center">
      <div className="mx-auto max-w-3xl px-5 w-full">
        
        {/* Success Graphic */}
        <div className="flex flex-col items-center justify-center text-center mb-8 relative">
          <div className="w-32 h-32 rounded-full bg-emerald-50 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-20"></div>
            <CheckCircle2 className="w-16 h-16 text-emerald-500" strokeWidth={2.5} />
            {/* Sparkles mock */}
            <div className="absolute -top-2 left-4 text-emerald-200">✦</div>
            <div className="absolute top-4 -right-2 text-emerald-300">✦</div>
            <div className="absolute bottom-2 -left-2 text-emerald-200">✦</div>
            <div className="absolute -bottom-2 right-6 text-emerald-300">✦</div>
          </div>
          
          <h1 className="text-2xl font-black text-[#192168] mb-2">You have been logged out</h1>
          <p className="text-sm text-gray-500 max-w-[240px] leading-relaxed">
            You have successfully logged out of your account.
          </p>
        </div>

        {/* Login Button */}
        <button 
          onClick={() => openAuthModal('login')}
          className="w-full rounded-xl bg-[#1668F6] py-3.5 text-base font-bold text-white shadow-md hover:bg-blue-700 transition mb-8 cursor-pointer"
        >
          Login / Sign Up
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-x-0 h-px bg-gray-200"></div>
          <span className="relative bg-white px-4 text-xs font-medium text-gray-400">or</span>
        </div>

        {/* Explore */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-[#192168] mb-4">Explore {branding.appName}</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <ExploreCard 
              icon={<Store className="h-5 w-5 text-emerald-500" />}
              bg="bg-emerald-50"
              border="border-emerald-100"
              title="Local Stores"
              desc="Find and explore trusted local stores"
            />
            <ExploreCard 
              icon={<Tag className="h-5 w-5 text-orange-500" />}
              bg="bg-orange-50"
              border="border-orange-100"
              title="Best Deals"
              desc="Discover amazing offers and discounts"
            />
            <ExploreCard 
              icon={<Grid className="h-5 w-5 text-purple-500" />}
              bg="bg-purple-50"
              border="border-purple-100"
              title="Categories"
              desc="Browse products across categories"
            />
            <ExploreCard 
              icon={<Heart className="h-5 w-5 text-rose-500" />}
              bg="bg-rose-50"
              border="border-rose-100"
              title="Wishlist"
              desc="Save your favorite products"
            />
          </div>
        </div>

        {/* Thank You Banner */}
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50/50 p-4 border border-emerald-100">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#192168] text-sm">Thank you for using {branding.appName}</h4>
            <p className="mt-0.5 text-xs text-emerald-800/80">We hope to see you again soon!</p>
          </div>
        </div>

      </div>
    </main>
  );
}

function ExploreCard({ icon, bg, border, title, desc }: any) {
  return (
    <div className="flex flex-col items-center text-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:border-[#1668F6] transition-colors cursor-pointer">
      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${bg} ${border} border`}>
        {icon}
      </div>
      <h4 className="text-xs font-bold text-[#192168] mb-1">{title}</h4>
      <p className="text-[10px] text-gray-500 leading-snug">{desc}</p>
    </div>
  );
}
