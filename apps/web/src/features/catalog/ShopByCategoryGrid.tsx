"use client";

import React from 'react';
import Link from 'next/link';

interface SubcategoryItem {
  id: string;
  name: string;
  imageUrl?: string;
  isMore?: boolean;
}

const PASTEL_GRADIENTS = [
  'bg-gradient-to-br from-rose-50 to-pink-100/60 border-pink-100/80',
  'bg-gradient-to-br from-sky-50 to-blue-100/60 border-blue-100/80',
  'bg-gradient-to-br from-emerald-50 to-teal-100/60 border-teal-100/80',
  'bg-gradient-to-br from-amber-50 to-orange-100/60 border-orange-100/80',
  'bg-gradient-to-br from-violet-50 to-purple-100/60 border-purple-100/80',
  'bg-gradient-to-br from-cyan-50 to-indigo-100/60 border-indigo-100/80',
];

const ITEMS: SubcategoryItem[] = [
  { id: 'mens-fashion', name: "Men's Fashion", imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=200&auto=format&fit=crop' },
  { id: 'womens-fashion', name: "Women's Fashion", imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c400a86?q=80&w=200&auto=format&fit=crop' },
  { id: 'kids-fashion', name: "Kids Fashion", imageUrl: 'https://images.unsplash.com/photo-1519238263530-99abad67b299?q=80&w=200&auto=format&fit=crop' },
  { id: 't-shirts', name: "T-shirts", imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop' },
  { id: 'shirts', name: "Shirts", imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=200&auto=format&fit=crop' },
  { id: 'jeans', name: "Jeans", imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=200&auto=format&fit=crop' },
  { id: 'trousers', name: "Trousers", imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=200&auto=format&fit=crop' },
  { id: 'kurtis', name: "Kurtis", imageUrl: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?q=80&w=200&auto=format&fit=crop' },
  { id: 'sarees', name: "Sarees", imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop' },
  { id: 'dresses', name: "Dresses", imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop' },
  { id: 'footwear', name: "Footwear", imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop' },
  { id: 'sports-wear', name: "Sports Wear", imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop' },
  { id: 'innerwear', name: "Innerwear", imageUrl: 'https://images.unsplash.com/photo-1588265008544-716d80ff525e?q=80&w=200&auto=format&fit=crop' },
  { id: 'jackets', name: "Jackets", imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=200&auto=format&fit=crop' },
  { id: 'sweatshirts', name: "Sweatshirts", imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200&auto=format&fit=crop' },
  { id: 'ethnic-wear', name: "Ethnic Wear", imageUrl: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=200&auto=format&fit=crop' },
  { id: 'activewear', name: "Activewear", imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=200&auto=format&fit=crop' },
  { id: 'watches', name: "Watches", imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=200&auto=format&fit=crop' },
  { id: 'sunglasses', name: "Sunglasses", imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=200&auto=format&fit=crop' },
  { id: 'jewellery', name: "Jewellery", imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop' },
  { id: 'bags', name: "Bags & Wallets", imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=200&auto=format&fit=crop' },
  { id: 'caps', name: "Caps & Hats", imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=200&auto=format&fit=crop' },
  { id: 'more', name: "More Categories", isMore: true },
];

export function ShopByCategoryGrid() {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[20px] sm:text-[22px] font-extrabold text-[#061842] tracking-tight">Shop by Category</h2>
          <p className="text-xs text-gray-500 mt-0.5">Explore curated styles and collections</p>
        </div>
        <Link 
          href="/category" 
          className="text-[13px] font-bold text-[#1668F6] hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors"
        >
          View all <span>&rarr;</span>
        </Link>
      </div>

      <div className="flex gap-3.5 overflow-x-auto scrollbar-hide pb-4 snap-x select-none">
        {ITEMS.map((item, idx) => {
          const gradientClass = PASTEL_GRADIENTS[idx % PASTEL_GRADIENTS.length];

          if (item.isMore) {
            return (
              <Link 
                key={item.id} 
                href="/category" 
                className="flex flex-col items-center group shrink-0 snap-start w-[88px] transition-transform duration-200"
              >
                <div className="w-[88px] h-[106px] bg-slate-100/80 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md mb-2 border border-slate-200/80 shadow-2xs">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1668F6] animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1668F6] animate-pulse delay-75"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1668F6] animate-pulse delay-150"></div>
                  </div>
                </div>
                <span className="text-[11.5px] font-bold text-[#061842] text-center px-1 leading-tight group-hover:text-[#1668F6] transition-colors">{item.name}</span>
              </Link>
            );
          }

          return (
            <Link 
              key={item.id} 
              href={`/category/${item.id}`} 
              className="flex flex-col items-center group shrink-0 snap-start w-[88px] transition-transform duration-200"
            >
              <div className={`w-[88px] h-[106px] ${gradientClass} rounded-2xl overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md mb-2 shadow-2xs border flex items-end justify-center pt-2 relative`}>
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-[90%] h-[90%] object-contain object-bottom drop-shadow-sm mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <span className="text-[11.5px] font-bold text-[#061842] text-center px-1 leading-tight group-hover:text-[#1668F6] transition-colors">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
