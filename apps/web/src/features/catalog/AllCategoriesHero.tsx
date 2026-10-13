'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Tag, Truck } from 'lucide-react';
import { branding } from '@repo/shared-types';

export function AllCategoriesHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#CDE2FD] via-[#DFECFF] to-[#F0F6FF] rounded-[28px] md:rounded-[32px] px-6 py-8 md:px-12 md:py-10 mb-8 shadow-sm border border-blue-100/60">
      {/* Left Carousel Arrow */}
      <button
        type="button"
        onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 4))}
        aria-label="Previous slide"
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-[#1668F6] flex items-center justify-center shadow-md border border-white transition-all hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {/* Right Carousel Arrow */}
      <button
        type="button"
        onClick={() => setCurrentSlide((prev) => (prev < 4 ? prev + 1 : 0))}
        aria-label="Next slide"
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-[#1668F6] flex items-center justify-center shadow-md border border-white transition-all hover:scale-105 active:scale-95"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between h-full gap-6 md:gap-8 px-4 sm:px-6">
        
        {/* Left Content */}
        <div className="flex-1 space-y-4 max-w-xl text-left">
          <div className="inline-block px-3.5 py-1 bg-white/70 backdrop-blur-sm rounded-full text-[11px] font-extrabold text-[#1668F6] uppercase tracking-wider shadow-2xs">
            Everything You Need
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#061842] leading-[1.12] tracking-tight">
            Great Products <br />
            For A Better Everyday
          </h1>
          <p className="text-[#061842]/75 font-semibold text-base md:text-lg max-w-md">
            Top brands. Best deals. Local stores. Only on {branding.appName}.
          </p>
          <div className="pt-2">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-[#1668F6] hover:bg-[#0f4bba] transition-all duration-200 text-white px-7 py-3 rounded-full font-bold shadow-lg shadow-blue-500/25 active:scale-95"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Center Product Showcase (Sneaker, Phone, Headphones, Smartwatch on Pedestal) */}
        <div className="hidden lg:flex flex-1 relative h-64 md:h-72 items-center justify-center pointer-events-none select-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* White pedestal base */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-white/60 backdrop-blur-md rounded-[100%] shadow-[0_15px_30px_rgba(30,70,160,0.12)] border border-white/80" />

            {/* Main Running Sneaker */}
            <div className="absolute z-30 -left-6 bottom-4 w-56 h-40 drop-shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80&fm=png&bg=transparent"
                alt="Nike Running Sneaker"
                className="w-full h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)]"
              />
            </div>

            {/* Smartphone with glowing screen */}
            <div className="absolute z-20 left-28 bottom-8 w-32 h-48 drop-shadow-xl transform -rotate-3">
              <img
                src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80&fm=png&bg=transparent"
                alt="Smartphone"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]"
              />
            </div>

            {/* Over-ear Headphones */}
            <div className="absolute z-25 right-12 bottom-6 w-44 h-44 drop-shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80&fm=png&bg=transparent"
                alt="Blue Headphones"
                className="w-full h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)]"
              />
            </div>

            {/* Smartwatch on mini pedestal */}
            <div className="absolute z-35 right-4 bottom-2 w-20 h-24 drop-shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80&fm=png&bg=transparent"
                alt="Smartwatch"
                className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)]"
              />
            </div>
          </div>
        </div>

        {/* Right Badges & Tagline */}
        <div className="hidden md:flex flex-col justify-between items-end gap-3 min-w-[240px]">
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-3.5 bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xs border border-white hover:bg-white transition-all">
              <div className="w-9 h-9 rounded-full bg-[#1668F6]/10 flex items-center justify-center text-[#1668F6] shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-extrabold text-[#061842] leading-tight">Top Brands</p>
                <p className="text-[11.5px] font-medium text-gray-500 leading-tight">Great Prices</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3.5 bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xs border border-white hover:bg-white transition-all">
              <div className="w-9 h-9 rounded-full bg-[#1668F6]/10 flex items-center justify-center text-[#1668F6] shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-extrabold text-[#061842] leading-tight">Fast Delivery</p>
                <p className="text-[11.5px] font-medium text-gray-500 leading-tight">Across Chhattisgarh</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xs border border-white hover:bg-white transition-all">
              <div className="w-9 h-9 rounded-full bg-[#1668F6]/10 flex items-center justify-center text-[#1668F6] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-extrabold text-[#061842] leading-tight">Safe & Secure</p>
                <p className="text-[11.5px] font-medium text-gray-500 leading-tight">Shopping</p>
              </div>
            </div>
          </div>

          {/* Cursive tagline: Shop More Live Better */}
          <div className="pt-2 text-right pr-2">
            <div className="inline-block transform -rotate-3 select-none">
              <p className="font-serif italic text-2xl md:text-3xl text-[#0B2562] font-semibold tracking-wide drop-shadow-xs leading-none">
                Shop
              </p>
              <p className="font-serif italic text-3xl md:text-4xl text-[#0B2562] font-bold tracking-tight drop-shadow-xs leading-tight">
                More <span className="text-[#1668F6]">Live Better</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Indicator Dots */}
      <div className="relative z-10 flex items-center justify-center gap-2 mt-4 pt-2">
        {[0, 1, 2, 3, 4].map((dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            onClick={() => setCurrentSlide(dotIndex)}
            aria-label={`Go to slide ${dotIndex + 1}`}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === dotIndex
                ? 'w-7 h-2 bg-[#1668F6]'
                : 'w-2 h-2 bg-blue-300/80 hover:bg-blue-400'
            }`}
          />
        ))}
      </div>

      {/* Background Decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
    </div>
  );
}

