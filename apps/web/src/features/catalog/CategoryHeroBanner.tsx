"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function CategoryHeroBanner() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#D7E9F9] to-[#E3F2FD] mb-8">
      {/* Background Image / Pattern would go here */}
      <div className="absolute right-0 top-0 h-full w-1/2">
         {/* Placeholder for the model image */}
         <img 
            src="https://images.unsplash.com/photo-1516826957135-700ede19c6ce?q=80&w=800&auto=format&fit=crop" 
            alt="Men's Fashion" 
            className="object-cover h-full w-full opacity-90 object-top"
         />
         <div className="absolute inset-0 bg-gradient-to-r from-[#D7E9F9] via-[#D7E9F9]/80 to-transparent"></div>
      </div>

      <div className="relative z-10 px-12 py-14 flex items-center justify-between">
        <div className="max-w-md">
          <p className="text-sm font-bold text-[#061842] tracking-wider mb-2">NEW SEASON. NEW STYLE.</p>
          <h2 className="text-5xl font-extrabold text-[#061842] mb-3 leading-tight">
            Men's Fashion
          </h2>
          <p className="text-2xl font-bold text-[#061842] mb-8">
            Look Good. Do More.
          </p>
          <Link href="/category/mens-fashion" className="inline-flex items-center gap-2 bg-[#061842] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#041130] transition-colors">
            Shop Now <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Right side floating elements (Logos) */}
        <div className="hidden md:block text-right self-start mt-4">
           <p className="text-sm font-bold text-[#061842] mb-1">Top Brands</p>
           <p className="text-sm font-bold text-[#061842] mb-1">Latest Styles</p>
           <p className="text-sm font-bold text-[#061842] mb-4">Best Deals</p>
           
           <div className="flex items-center justify-end gap-6 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-sm">
             {/* Mock logos */}
             <div className="font-extrabold text-red-600 text-xl tracking-tighter">LEVI'S</div>
             <div className="font-extrabold text-black text-xl italic">PUMA</div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-[#061842] uppercase tracking-tighter">U.S. Polo Assn.</span>
             </div>
             <span className="text-sm font-bold text-[#061842]">& More</span>
           </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-[#061842] hover:bg-gray-50 z-20">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-[#061842] hover:bg-gray-50 z-20">
        <ChevronRight className="w-6 h-6" />
      </button>
      
      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-y-1/2 flex gap-2 z-20">
         <div className="w-2 h-2 rounded-full bg-[#061842]"></div>
         <div className="w-2 h-2 rounded-full bg-black/20"></div>
         <div className="w-2 h-2 rounded-full bg-black/20"></div>
         <div className="w-2 h-2 rounded-full bg-black/20"></div>
      </div>
    </div>
  );
}
