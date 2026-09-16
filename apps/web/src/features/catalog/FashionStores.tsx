import React from 'react';
import { ChevronDown } from 'lucide-react';
import { StoreCard } from '@/features/stores/components/StoreCard';
import type { IStore } from '@repo/shared-types';

const MOCK_STORES = [
  {
    _id: '1',
    name: 'Style Hub',
    slug: 'style-hub',
    owner: 'user1',
    description: "Men's, Women's & Kids Fashion",
    logoUrl: '',
    bannerUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600&auto=format&fit=crop',
    category: "FASHION",
    status: 'ACTIVE',
    rating: 4.5,
    reviewCount: 1200,
    distanceKm: 1.2,
  },
  {
    _id: '2',
    name: 'Trendy Looks',
    slug: 'trendy-looks',
    owner: 'user2',
    description: "Women's Fashion & Accessories",
    logoUrl: '',
    bannerUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=600&auto=format&fit=crop',
    category: "FASHION",
    status: 'ACTIVE',
    rating: 4.3,
    reviewCount: 980,
    distanceKm: 2.5,
  },
  {
    _id: '3',
    name: 'Urban Wear',
    slug: 'urban-wear',
    owner: 'user3',
    description: "Men's Fashion & Casual Wear",
    logoUrl: '',
    bannerUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop',
    category: "FASHION",
    status: 'ACTIVE',
    rating: 4.6,
    reviewCount: 1500,
    distanceKm: 3.1,
  },
  {
    _id: '4',
    name: 'Little Threads',
    slug: 'little-threads',
    owner: 'user4',
    description: "Kids' Fashion & Accessories",
    logoUrl: '',
    bannerUrl: 'https://images.unsplash.com/photo-1519238263530-99abad67b299?q=80&w=600&auto=format&fit=crop',
    category: "FASHION",
    status: 'ACTIVE',
    rating: 4.4,
    reviewCount: 760,
    distanceKm: 1.8,
  },
  {
    _id: '5',
    name: 'Ethnic Vibes',
    slug: 'ethnic-vibes',
    owner: 'user5',
    description: "Ethnic Wear & Accessories",
    logoUrl: '',
    bannerUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop',
    category: "FASHION",
    status: 'ACTIVE',
    rating: 4.5,
    reviewCount: 890,
    distanceKm: 4.2,
  },
  {
    _id: '6',
    name: 'Sportify',
    slug: 'sportify',
    owner: 'user6',
    description: "Sportswear & Active Wear",
    logoUrl: '',
    bannerUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    category: "FASHION",
    status: 'ACTIVE',
    rating: 4.3,
    reviewCount: 640,
    distanceKm: 2.1,
  },
  {
    _id: '7',
    name: 'Shoe World',
    slug: 'shoe-world',
    owner: 'user7',
    description: "Footwear for Men, Women & Kids",
    logoUrl: '',
    bannerUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    category: "FASHION",
    status: 'ACTIVE',
    rating: 4.4,
    reviewCount: 1100,
    distanceKm: 1.5,
  },
  {
    _id: '8',
    name: 'Fashion Accessories',
    slug: 'fashion-accessories',
    owner: 'user8',
    description: "Bags, Watches, Belts & More",
    logoUrl: '',
    bannerUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop',
    category: "FASHION",
    status: 'ACTIVE',
    rating: 4.2,
    reviewCount: 520,
    distanceKm: 3.5,
  },
  {
    _id: '9',
    name: 'Denim District',
    slug: 'denim-district',
    owner: 'user9',
    description: "Jeans, Shirts & Casual Wear",
    logoUrl: '',
    bannerUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop',
    category: "FASHION",
    status: 'ACTIVE',
    rating: 4.3,
    reviewCount: 680,
    distanceKm: 2.8,
  }
] as unknown as IStore[];

export function FashionStores() {
  return (
    <div className="mt-8 pt-4">
      {/* Title and Sort Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#061842] mb-1">Fashion Stores</h2>
          <p className="text-[14px] font-bold text-[#061842]">Discover top fashion stores near you</p>
        </div>
        
        <div className="flex items-center gap-2 text-[13px] font-bold mt-4 lg:mt-0">
          <span className="text-[#061842]">Sort By:</span>
          <button className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 transition-colors">
            <span className="text-gray-700 font-medium">Relevance</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {MOCK_STORES.map((store) => (
           <StoreCard key={store._id} store={store} className="w-full flex-shrink-1" />
        ))}
      </div>
    </div>
  );
}
