import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const PROMO_CARDS = [
  {
    id: 'mobiles',
    title: 'Mobiles & Accessories',
    subtitle: 'Latest smartphones at best prices',
    bgClass: 'bg-[#EAF2FE] border-blue-100/60',
    titleColor: 'text-[#061842]',
    subtitleColor: 'text-[#061842]/70',
    btnClass: 'bg-white text-[#1668F6] border border-blue-100 hover:bg-blue-50',
    imageSrc: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80&fm=png&bg=transparent',
  },
  {
    id: 'home_living',
    title: 'Home Essentials',
    subtitle: 'Make every space feel like home',
    bgClass: 'bg-[#FFF4E6] border-amber-100/60',
    titleColor: 'text-[#9A4B1A]',
    subtitleColor: 'text-[#9A4B1A]/80',
    btnClass: 'bg-white text-[#9A4B1A] border border-amber-100 hover:bg-amber-50',
    imageSrc: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80&fm=png&bg=transparent',
  },
  {
    id: 'beauty',
    title: 'Beauty & Personal Care',
    subtitle: 'Care for a brighter you',
    bgClass: 'bg-[#FFEBF2] border-pink-100/60',
    titleColor: 'text-[#9D2364]',
    subtitleColor: 'text-[#9D2364]/80',
    btnClass: 'bg-white text-[#9D2364] border border-pink-100 hover:bg-pink-50',
    imageSrc: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80&fm=png&bg=transparent',
  },
  {
    id: 'appliances',
    title: 'Appliances',
    subtitle: 'Upgrade to a smarter home',
    bgClass: 'bg-[#EBF5FB] border-cyan-100/60',
    titleColor: 'text-[#061842]',
    subtitleColor: 'text-[#061842]/70',
    btnClass: 'bg-white text-[#1668F6] border border-blue-100 hover:bg-blue-50',
    imageSrc: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&q=80&fm=png&bg=transparent',
  },
];

export function CategoryPromoCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 py-2">
      {PROMO_CARDS.map((card) => (
        <div 
          key={card.id} 
          className={`relative rounded-[24px] p-5 md:p-6 overflow-hidden ${card.bgClass} border shadow-2xs group flex flex-col justify-between min-h-[175px]`}
        >
          {/* Left Text */}
          <div className="relative z-10 w-[58%] space-y-2">
            <h3 className={`text-base md:text-lg font-black ${card.titleColor} leading-tight`}>
              {card.title}
            </h3>
            <p className={`text-[12px] font-semibold ${card.subtitleColor} leading-snug`}>
              {card.subtitle}
            </p>
            <div className="pt-2">
              <Link
                href={`/category/${card.id}`}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs transition-all duration-200 active:scale-95 ${card.btnClass}`}
              >
                Shop Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          
          {/* Right Product Image */}
          <div className="absolute right-0 bottom-0 w-[46%] h-[95%] flex items-end justify-end pointer-events-none p-2">
            <div className="relative w-full h-full transform translate-x-1 translate-y-1 group-hover:scale-105 transition-transform duration-500">
              <img 
                src={card.imageSrc} 
                alt={card.title} 
                className="w-full h-full object-contain object-bottom filter drop-shadow-md" 
                loading="lazy"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

