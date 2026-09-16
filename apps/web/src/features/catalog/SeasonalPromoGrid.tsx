import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function SeasonalPromoGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-4">
      {/* Promo 1 */}
      <Link href="/campaigns/trending" className="block relative rounded-2xl overflow-hidden bg-[#F8F9FA] h-32 md:h-40 group">
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-transparent z-10" />
        <div className="relative z-20 flex flex-col justify-center h-full p-4 w-[70%]">
          <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Autumn Winter'26
          </p>
          <h3 className="text-sm md:text-lg font-extrabold text-[#192168] leading-tight mb-2">
            TRENDING T-SHIRTS
          </h3>
          <div className="flex items-center text-[10px] md:text-xs font-bold text-[#192168] group-hover:text-blue-600">
            Explore Now <ArrowRight className="w-3 h-3 ml-1" />
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[55%] z-0">
          <Image
            src="https://images.unsplash.com/photo-1516826957135-700ede19c6ce?q=80&w=300&auto=format&fit=crop"
            alt="Trending T-Shirts"
            fill
            className="object-cover object-top"
          />
        </div>
      </Link>

      {/* Promo 2 */}
      <Link href="/campaigns/classic" className="block relative rounded-2xl overflow-hidden bg-[#FAF6F0] h-32 md:h-40 group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/90 to-transparent z-10" />
        <div className="relative z-20 flex flex-col justify-center h-full p-4 w-[70%]">
          <h3 className="text-sm md:text-lg font-extrabold text-[#192168] leading-tight mb-1">
            CLASSIC T-SHIRTS
          </h3>
          <p className="text-[10px] md:text-xs font-medium text-gray-600 leading-tight mb-3">
            Button Up For The Season
          </p>
          <div className="flex items-center text-[10px] md:text-xs font-bold text-[#192168] group-hover:text-blue-600">
            Explore Now <ArrowRight className="w-3 h-3 ml-1" />
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[55%] z-0">
          <Image
            src="https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=300&auto=format&fit=crop"
            alt="Classic T-Shirts"
            fill
            className="object-cover object-top"
          />
        </div>
      </Link>
    </div>
  );
}
