import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface CategoryPromoBannerProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  bgColor?: string;
}

export function CategoryPromoBanner({ 
  title, 
  subtitle, 
  imageUrl, 
  href,
  bgColor = "bg-blue-50" 
}: CategoryPromoBannerProps) {
  return (
    <Link href={href} className={`block w-full rounded-xl overflow-hidden mb-6 ${bgColor}`}>
      <div className="flex items-center justify-between p-4 md:p-6 h-32 md:h-40 relative">
        <div className="z-10 flex flex-col justify-center h-full max-w-[60%]">
          <h2 className="text-lg md:text-2xl font-bold text-blue-900 leading-tight mb-1">
            {title}
          </h2>
          <p className="text-xs md:text-sm text-blue-800 font-medium mb-2">
            {subtitle}
          </p>
          <div className="flex items-center text-xs md:text-sm font-semibold text-blue-600 bg-white/80 w-max px-2 py-1 rounded-full">
            Explore <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
          </div>
        </div>
        
        {/* Absolute positioned image for the right side to overflow/blend nicely */}
        <div className="absolute right-0 top-0 bottom-0 w-[45%]">
           <Image 
             src={imageUrl} 
             alt={title} 
             fill 
             className="object-cover object-left"
           />
        </div>
      </div>
    </Link>
  );
}
