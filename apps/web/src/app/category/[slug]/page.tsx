import React from 'react';
import Link from 'next/link';
import { ShieldCheck, RotateCcw, Award } from 'lucide-react';
import { CategoryHeroBanner } from '@/features/catalog/CategoryHeroBanner';
import { ShopByCategoryGrid } from '@/features/catalog/ShopByCategoryGrid';
import { ShopForLovedOnes } from '@/features/catalog/ShopForLovedOnes';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { branding } from '@repo/shared-types';

export default function FashionLandingPage() {
  return (
    <div className="min-h-screen bg-transparent pb-16 lg:pb-0">
      <main className="max-w-[1920px] mx-auto lg:px-6 lg:py-4">

        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Fashion' }]} />

        {/* Title and Top Badges Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#061842] mb-1">Fashion</h1>
            <p className="text-[14px] font-bold text-[#061842]">Style for Every You</p>
            <p className="text-[13px] font-medium text-gray-500">
              Trendy styles, top brands and great deals – only on {branding.appName}
            </p>
          </div>

          <div className="hidden lg:flex gap-4 mt-4 lg:mt-0">
            {/* 100% Authentic */}
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[#1668F6]" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#061842] leading-tight">100% Authentic</span>
                <span className="text-[11px] font-medium text-gray-500 leading-tight">Products</span>
              </div>
            </div>

            {/* Easy Returns */}
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
              <RotateCcw className="w-6 h-6 text-[#1668F6]" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#061842] leading-tight">Easy Returns</span>
                <span className="text-[11px] font-medium text-gray-500 leading-tight">7 Days</span>
              </div>
            </div>

            {/* Top Brands */}
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
              <Award className="w-6 h-6 text-[#1668F6]" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#061842] leading-tight">Top Brands</span>
                <span className="text-[11px] font-medium text-gray-500 leading-tight">Great Prices</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm mb-6">
          <CategoryHeroBanner />
          <ShopByCategoryGrid />
          <ShopForLovedOnes />
        </div>
      </main>
    </div>
  );
}
