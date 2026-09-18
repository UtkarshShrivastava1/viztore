import React from 'react';
import Link from 'next/link';
import { Star, ChevronRight, Zap, Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

const trustItems = [
  { icon: Truck, label: 'Fast Delivery', description: 'On orders above ₹199' },
  { icon: RotateCcw, label: 'Easy Returns', description: '7 days return policy' },
  { icon: ShieldCheck, label: 'Secure Payments', description: '100% secure payments' },
  { icon: Headphones, label: 'Support', description: '24x7 assistance' },
];

interface ExploreStore {
  id: string;
  name: string;
  rating: number;
  reviewCount: string;
  categories: string;
  imageUrl: string;
  hasFastDelivery: boolean;
}

const mockStores: ExploreStore[] = [
  {
    id: '1',
    name: 'Fashion Hub',
    rating: 4.5,
    reviewCount: '1.2K',
    categories: 'Clothing, Accessories, Footwear & more',
    imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800',
    hasFastDelivery: true,
  },
  {
    id: '2',
    name: 'Sharma Electronics',
    rating: 4.3,
    reviewCount: '890',
    categories: 'Mobiles, Accessories, Gadgets & more',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9effb6197316?auto=format&fit=crop&q=80&w=800',
    hasFastDelivery: true,
  },
  {
    id: '3',
    name: 'Beauty Corner',
    rating: 4.6,
    reviewCount: '1.5K',
    categories: 'Skincare, Haircare, Makeup & more',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800',
    hasFastDelivery: true,
  },
  {
    id: '4',
    name: 'Home Needs',
    rating: 4.2,
    reviewCount: '760',
    categories: 'Home Decor, Kitchen, Furniture & more',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    hasFastDelivery: true,
  },
  {
    id: '5',
    name: 'Gadget Store',
    rating: 4.4,
    reviewCount: '540',
    categories: 'Smartwatches, Accessories, Audio & more',
    imageUrl: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?auto=format&fit=crop&q=80&w=800',
    hasFastDelivery: true,
  },
  {
    id: '6',
    name: 'Shoe World',
    rating: 4.3,
    reviewCount: '980',
    categories: 'Men, Women & Kids Footwear',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    hasFastDelivery: true,
  },
];

export function ExploreStoresGrid() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#192168]">Explore Stores</h2>
          <p className="text-gray-500 mt-1">Shop from top local stores near you</p>
        </div>
        <Link
          href="/stores"
          className="flex items-center gap-1 text-sm font-semibold text-[#1668F6] hover:text-[#0f4bba] transition-colors"
        >
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStores.map((store) => (
          <Link href={`/stores/${store.id}`} key={store.id} className="group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-brand-300 transition-all duration-300">
            {/* 16:9 Banner Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100 border-b border-gray-100">
              <img 
                src={store.imageUrl} 
                alt={store.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Details */}
            <div className="p-4 sm:p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">{store.name}</h3>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-600 transition-colors shrink-0" />
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 text-base font-bold text-gray-900">
                  {store.rating} <Star className="w-4 h-4 fill-[#00B56A] text-[#00B56A]" />
                </div>
                <span className="text-base text-gray-500">({store.reviewCount})</span>
              </div>
              
              <p className="text-base text-gray-600 line-clamp-1 mb-4">{store.categories}</p>
              
              <div className="mt-auto pt-2">
                {store.hasFastDelivery && (
                  <div className="inline-flex items-center gap-1.5 bg-[#F5F8FF] text-brand-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                    <Zap className="w-3.5 h-3.5 fill-current" /> Fast Delivery
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Trust Bar */}
      <div className="mt-12 bg-[#F5F8FF] rounded-2xl p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/60">
          {trustItems.map((item, index) => (
            <div key={item.label} className={`flex items-center gap-5 ${index !== 0 ? 'pt-6 sm:pt-0 sm:pl-6 lg:pl-10' : 'sm:pl-4'}`}>
              <div className="shrink-0 text-[#1668F6] p-3.5 bg-white rounded-2xl shadow-sm">
                <item.icon strokeWidth={1.5} className="w-10 h-10" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-base font-bold text-gray-900 leading-[1.5] mb-1">{item.label}</h4>
                <p className="text-sm text-gray-600 leading-[1.5]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
