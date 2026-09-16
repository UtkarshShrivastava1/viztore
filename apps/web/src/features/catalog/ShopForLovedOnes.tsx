"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function ShopForLovedOnes() {
  return (
    <div className="mb-10">
      <h2 className="text-[22px] font-extrabold text-[#061842] mb-4">Shop for loved ones</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* For Him */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#D7E9F9] to-[#E3F2FD] aspect-[2/1] group">
          <div className="absolute right-0 bottom-0 h-full w-[60%] flex items-end justify-end">
            <img 
              src="https://images.unsplash.com/photo-1516826957135-700ede19c6ce?q=80&w=400&auto=format&fit=crop" 
              alt="For Him" 
              className="object-cover h-[120%] w-[120%] object-top mix-blend-multiply opacity-90 transition-transform duration-500 group-hover:scale-105 origin-bottom"
            />
          </div>
          <div className="absolute inset-0 z-10 p-6 flex flex-col justify-center">
            <h3 className="text-[28px] font-extrabold text-[#061842] mb-2">For Him</h3>
            <p className="text-[13px] font-bold text-[#475569] mb-6 max-w-[140px] leading-snug">
              Everyday fashion for every occasion
            </p>
            <Link href="/category/mens-fashion" className="inline-flex w-fit items-center gap-1 bg-[#1668F6] text-white px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-[#1155cc] transition-colors shadow-sm">
              Shop Men's <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {/* Faded text background */}
          <div className="absolute top-4 right-4 text-[40px] font-extrabold text-[#061842]/5 leading-none text-right pointer-events-none">
            STYLE<br/>CONFIDENCE<br/>YOU
          </div>
        </div>

        {/* For Her */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFE4E1] to-[#FFF0F5] aspect-[2/1] group">
          <div className="absolute right-0 bottom-0 h-full w-[60%] flex items-end justify-end">
            <img 
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=400&auto=format&fit=crop" 
              alt="For Her" 
              className="object-cover h-[120%] w-[120%] object-top mix-blend-multiply opacity-90 transition-transform duration-500 group-hover:scale-105 origin-bottom"
            />
          </div>
          <div className="absolute inset-0 z-10 p-6 flex flex-col justify-center">
            <h3 className="text-[28px] font-extrabold text-[#8B0000] mb-2">For Her</h3>
            <p className="text-[13px] font-bold text-[#8B0000]/70 mb-6 max-w-[140px] leading-snug">
              Trendy styles for every mood
            </p>
            <Link href="/category/womens-fashion" className="inline-flex w-fit items-center gap-1 bg-[#061842] text-white px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-[#041130] transition-colors shadow-sm">
              Shop Women's <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {/* Faded text background */}
          <div className="absolute top-4 right-4 text-[40px] font-extrabold text-[#8B0000]/5 leading-none text-right pointer-events-none">
            FASHION<br/>BEAUTY<br/>YOU
          </div>
        </div>

        {/* For Gen Z */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#E6E6FA] to-[#F8F8FF] aspect-[2/1] group">
          <div className="absolute right-0 bottom-0 h-full w-[60%] flex items-end justify-end">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop" 
              alt="For Gen Z" 
              className="object-cover h-[120%] w-[120%] object-top mix-blend-multiply opacity-90 transition-transform duration-500 group-hover:scale-105 origin-bottom"
            />
          </div>
          <div className="absolute inset-0 z-10 p-6 flex flex-col justify-center">
            <h3 className="text-[28px] font-extrabold text-[#4B0082] mb-2">For Gen Z</h3>
            <p className="text-[13px] font-bold text-[#4B0082]/70 mb-6 max-w-[140px] leading-snug">
              Bold styles. Bigger vibes.
            </p>
            <Link href="/category/gen-z" className="inline-flex w-fit items-center gap-1 bg-[#1668F6] text-white px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-[#1155cc] transition-colors shadow-sm">
              Shop Gen Z <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {/* Faded text background */}
          <div className="absolute top-4 right-4 text-[40px] font-extrabold text-[#4B0082]/5 leading-none text-right pointer-events-none">
            BOLDER<br/>BRIGHTER<br/>BRAVER
          </div>
        </div>
      </div>
    </div>
  );
}
