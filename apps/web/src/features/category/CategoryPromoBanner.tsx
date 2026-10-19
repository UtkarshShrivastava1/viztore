import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CategoryPromoBannerProps {
  title: string;
  storeName?: string;
  subtitle?: string;
  imageUrl: string;
  href: string;
  bgColor?: string;
}

export function CategoryPromoBanner({
  title,
  storeName = 'Fashion Store',
  imageUrl,
  href,
  bgColor = 'bg-gradient-to-r from-[#EBF2FE] via-[#E2EDFC] to-[#D5E6FB]',
}: CategoryPromoBannerProps) {
  return (
    <div
      className={`relative w-full rounded-2xl ${bgColor} overflow-hidden px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between mb-5 shadow-2xs border border-blue-100/60`}
    >
      {/* Left Text */}
      <div className="z-10 flex flex-col justify-center max-w-[55%]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B2562] leading-tight">
          {title}
        </h2>
        <span className="text-xl sm:text-2xl font-black text-[#0B2562] leading-tight mt-0.5">
          {storeName}
        </span>
      </div>

      {/* Right Image + Circular Arrow Button */}
      <div className="flex items-center gap-2">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 -my-2 -mr-1">
          <img
            src={imageUrl}
            alt={`${title} ${storeName}`}
            className="w-full h-full object-contain object-bottom drop-shadow-md rounded-xl"
            loading="lazy"
          />
        </div>
        <Link
          href={href}
          aria-label={`Explore ${title} ${storeName}`}
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md text-slate-700 hover:text-[#1668F6] hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}

export default CategoryPromoBanner;
