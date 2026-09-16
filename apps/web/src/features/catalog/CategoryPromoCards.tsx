import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const PROMO_CARDS = [
  {
    id: 'mobiles',
    title: 'Mobiles & Accessories',
    subtitle: 'Latest smartphones at best prices',
    bgClass: 'bg-[#EBF3FF]',
    titleColor: 'text-[#061842]',
    subtitleColor: 'text-[#061842]/70',
    btnClass: 'bg-white text-[#1668F6] border border-blue-100 hover:bg-blue-50',
    imageSrc: 'https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=300&q=80&fm=png&bg=transparent',
  },
  {
    id: 'home',
    title: 'Home Essentials',
    subtitle: 'Make every space feel like home',
    bgClass: 'bg-[#FFF3E6]',
    titleColor: 'text-[#9A4B1A]',
    subtitleColor: 'text-[#9A4B1A]/80',
    btnClass: 'bg-white text-[#9A4B1A] border border-orange-100 hover:bg-orange-50',
    imageSrc: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80&fm=png&bg=transparent',
  },
  {
    id: 'beauty',
    title: 'Beauty & Personal Care',
    subtitle: 'Care for a brighter you',
    bgClass: 'bg-[#FFEBF4]',
    titleColor: 'text-[#9D2364]',
    subtitleColor: 'text-[#9D2364]/80',
    btnClass: 'bg-white text-[#9D2364] border border-pink-100 hover:bg-pink-50',
    imageSrc: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80&fm=png&bg=transparent',
  },
  {
    id: 'appliances',
    title: 'Appliances',
    subtitle: 'Upgrade to a smarter home',
    bgClass: 'bg-[#EBF8FF]',
    titleColor: 'text-[#061842]',
    subtitleColor: 'text-[#061842]/70',
    btnClass: 'bg-white text-[#1668F6] border border-blue-100 hover:bg-blue-50',
    imageSrc: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80&fm=png&bg=transparent',
  },
];

export function CategoryPromoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 py-8">
      {PROMO_CARDS.map((card) => (
        <div key={card.id} className={`relative rounded-3xl p-6 overflow-hidden ${card.bgClass} shadow-sm group`}>
          <div className="relative z-10 w-2/3 space-y-3">
            <h3 className={`text-xl font-extrabold ${card.titleColor} leading-tight`}>{card.title}</h3>
            <p className={`text-[13px] font-semibold ${card.subtitleColor} leading-snug`}>{card.subtitle}</p>
            <div className="pt-2">
              <Link
                href={`/category/${card.id}`}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all ${card.btnClass}`}
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="absolute right-0 bottom-0 w-1/2 h-full flex items-end justify-end pointer-events-none">
            <div className="relative w-full h-[110%] transform translate-x-4 translate-y-4 group-hover:scale-105 transition-transform duration-500">
               <Image 
                 src={card.imageSrc} 
                 alt={card.title} 
                 fill 
                 className="object-contain object-bottom mix-blend-multiply drop-shadow-xl" 
               />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
