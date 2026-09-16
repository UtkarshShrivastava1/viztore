import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Tag, Truck } from 'lucide-react';
import { branding } from '@repo/shared-types';

export function AllCategoriesHero() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#D0E6FF] via-[#E6F0FE] to-[#F1F6FF] rounded-[32px] p-8 md:p-12 mb-8 shadow-sm">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full gap-8">
        
        {/* Left Content */}
        <div className="flex-1 space-y-4 max-w-xl">
          <div className="inline-block px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-[11px] font-extrabold text-[#192168] uppercase tracking-wider mb-2">
            Everything You Need
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#061842] leading-[1.1] tracking-tight">
            Great Products <br className="hidden md:block" />
            For A Better Everyday
          </h1>
          <p className="text-[#061842]/70 font-semibold text-lg max-w-md">
            Top brands. Best deals. Local stores. Only on {branding.appName}.
          </p>
          <div className="pt-4">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-[#1668F6] hover:bg-[#0f4bba] transition-colors text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-blue-500/30"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Center Images (Mockup of products) */}
        <div className="hidden lg:flex flex-1 relative h-64 items-center justify-center pointer-events-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Main Shoe */}
            <div className="absolute z-30 transform -translate-x-12 -translate-y-4 rotate-[-15deg] w-64 h-64 drop-shadow-2xl">
               <Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&fm=png&bg=transparent" alt="Shoe" width={256} height={256} className="object-contain mix-blend-multiply" />
            </div>
            {/* Headphones */}
            <div className="absolute z-20 transform translate-x-24 -translate-y-8 w-48 h-48 drop-shadow-xl">
               <Image src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&q=80&fm=png&bg=transparent" alt="Headphones" width={192} height={192} className="object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>

        {/* Right Badges */}
        <div className="hidden md:flex flex-col gap-4 min-w-[240px]">
          <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-sm border border-white">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1668F6] shadow-sm">
               <Tag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold text-[#061842] leading-tight">Top Brands</p>
              <p className="text-[12px] font-medium text-gray-600 leading-tight">Great Prices</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-sm border border-white">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1668F6] shadow-sm">
               <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold text-[#061842] leading-tight">Fast Delivery</p>
              <p className="text-[12px] font-medium text-gray-600 leading-tight">Across Chhattisgarh</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-sm border border-white">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1668F6] shadow-sm">
               <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold text-[#061842] leading-tight">Safe & Secure</p>
              <p className="text-[12px] font-medium text-gray-600 leading-tight">Shopping</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Decorative elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
    </div>
  );
}
