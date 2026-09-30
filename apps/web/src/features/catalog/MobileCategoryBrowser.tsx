'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Shirt, ShoppingBag, Baby, Speaker, Heart, Search, ChevronRight } from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'trending', label: 'Trending Now', icon: <Flame className="w-5 h-5 text-[#FF5A00]" />, color: 'bg-orange-50' },
  { id: 'mens_fashion', label: "Men's Fashion", icon: <Shirt className="w-5 h-5" />, color: 'bg-blue-50' },
  { id: 'womens_fashion', label: "Women's Fashion", icon: <div className="w-5 h-5 flex items-center justify-center bg-pink-100 text-pink-500 rounded-full text-[10px] font-bold">W</div>, color: 'bg-pink-50' },
  { id: 'kids_fashion', label: 'Kids Fashion', icon: <Baby className="w-5 h-5 text-yellow-500" />, color: 'bg-yellow-50' },
  { id: 'footwear', label: 'Footwear', icon: <div className="w-5 h-5 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-[10px] font-bold">F</div>, color: 'bg-green-50' },
  { id: 'beauty', label: 'Beauty & Grooming', icon: <div className="w-5 h-5 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full text-[10px] font-bold">B</div>, color: 'bg-purple-50' },
  { id: 'home', label: 'Home & Living', icon: <div className="w-5 h-5 flex items-center justify-center bg-teal-100 text-teal-600 rounded-full text-[10px] font-bold">H</div>, color: 'bg-teal-50' },
  { id: 'electronics', label: 'Electronics', icon: <Speaker className="w-5 h-5 text-blue-400" />, color: 'bg-blue-50' },
];

const MENS_FASHION_SUB_CATEGORIES = [
  {
    title: 'Casual Wear',
    items: [
      { name: 'Shirts', image: '/categories/fashion_couple.png' },
      { name: 'T-Shirts', image: '/categories/fashion_couple.png' },
      { name: 'Jeans', image: '/categories/fashion_couple.png' },
      { name: 'Trousers', image: '/categories/fashion_couple.png' },
      { name: 'Shorts', image: '/categories/fashion_couple.png' },
      { name: 'Track Pants', image: '/categories/fashion_couple.png' },
      { name: 'Jackets', image: '/categories/fashion_couple.png' },
      { name: 'Sweatshirts', image: '/categories/fashion_couple.png' },
      { name: 'Sweaters', image: '/categories/fashion_couple.png' },
    ]
  },
  {
    title: 'Work Wear',
    items: [
      { name: 'Formal Shirts', image: '/categories/fashion_couple.png' },
      { name: 'Blazers', image: '/categories/fashion_couple.png' },
      { name: 'Formal Trousers', image: '/categories/fashion_couple.png' },
      { name: 'Coats', image: '/categories/fashion_couple.png' },
      { name: 'Ties', image: '/categories/fashion_couple.png' },
      { name: 'Formal Shoes', image: '/categories/fashion_couple.png' },
    ]
  },
  {
    title: 'Occasion Wear',
    items: [
      { name: 'Ethnic Sets', image: '/categories/fashion_couple.png' },
      { name: 'Kurtas', image: '/categories/fashion_couple.png' },
      { name: 'Sherwanis', image: '/categories/fashion_couple.png' },
    ]
  }
];

export function MobileCategoryBrowser() {
  const [activeTab, setActiveTab] = useState('mens_fashion');

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden w-full lg:hidden pb-16">
      {/* Header Area */}
      <div className="px-4 py-3 border-b border-surface-100 flex items-center justify-between">
         <Image src="/logo.png" alt="Viztore" width={90} height={30} className="object-contain" />
         <div className="flex items-center gap-4">
           <button className="text-[#1668F6]">
             <Heart className="w-6 h-6" />
           </button>
           <div className="relative text-[#1668F6]">
             <ShoppingBag className="w-6 h-6" />
             <span className="absolute -top-1 -right-1 bg-[#1668F6] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
               3
             </span>
           </div>
         </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-surface-100">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input 
            type="text" 
            placeholder="Search for products, categories and more..."
            className="w-full bg-[#F5F8FF] border border-surface-200 rounded-full py-2.5 pl-10 pr-10 text-sm focus:outline-none"
          />
          <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Categories List */}
        <div className="w-[90px] shrink-0 bg-white border-r border-surface-100 overflow-y-auto pb-20 scrollbar-hide">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex flex-col items-center justify-center py-4 px-1 gap-2 relative transition-colors ${
                  isActive ? 'bg-[#EEF4FF]' : 'bg-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1668F6] rounded-r-md" />
                )}
                <div className={`${isActive ? 'text-[#1668F6]' : 'text-surface-600'}`}>
                  {tab.icon}
                </div>
                <span className={`text-[10px] text-center font-bold leading-tight ${
                  isActive ? 'text-[#1668F6]' : 'text-[#192168]'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-[#F9FAFB] overflow-y-auto pb-20 p-4 scrollbar-hide">
           {/* Banner */}
           <Link href="/products" className="w-full bg-[#EEF4FF] rounded-xl flex items-center justify-between overflow-hidden relative h-[90px] mb-6 block">
              <div className="p-4 z-10 w-2/3">
                 <h3 className="text-[#192168] font-extrabold text-lg leading-tight">Men's<br/>Fashion Store</h3>
              </div>
              <div className="absolute right-0 bottom-0 h-full w-1/2">
                <Image src="/categories/fashion_couple.png" alt="Banner" layout="fill" objectFit="cover" className="object-top" />
              </div>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm z-10">
                 <ChevronRight className="w-4 h-4 text-[#192168]" />
              </button>
           </Link>

           {/* Subcategories */}
           <div className="space-y-6">
              {MENS_FASHION_SUB_CATEGORIES.map((section, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-extrabold text-[#192168] text-[15px]">{section.title}</h4>
                    <span className="text-[#1668F6] text-xs font-bold">View all</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-y-4 gap-x-2">
                    {section.items.map((item, itemIdx) => (
                      <Link href="/products" key={itemIdx} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                        <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center overflow-hidden">
                           <Image 
                             src={item.image} 
                             alt={item.name} 
                             width={60} 
                             height={60} 
                             className="object-cover w-full h-full"
                           />
                        </div>
                        <span className="text-[11px] font-bold text-center text-[#192168] leading-tight group-hover:text-[#1668F6]">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
