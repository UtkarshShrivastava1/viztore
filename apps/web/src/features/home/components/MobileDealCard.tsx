'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Store, Star } from 'lucide-react';
import type { IProduct } from '@repo/shared-types';

interface MobileDealCardProps {
  product: IProduct;
  index?: number;
}

const fallbackDealImages = [
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400', // Men Shirt
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400', // Earbuds
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400', // Face Wash / Skincare
  'https://images.unsplash.com/photo-1584990347449-3974d6c7e2b1?auto=format&fit=crop&q=80&w=400', // Cookware
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400', // Running Shoes
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400', // Backpack
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400', // Table Lamp
  'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&q=80&w=400', // Air Fryer
];

const fallbackRatings = [
  { rating: '4.3', count: '2.1K' },
  { rating: '4.4', count: '3.2K' },
  { rating: '4.5', count: '3.2K' },
  { rating: '4.3', count: '900' },
  { rating: '4.6', count: '1.8K' },
  { rating: '4.4', count: '2.5K' },
  { rating: '4.5', count: '1.1K' },
  { rating: '4.3', count: '1.4K' },
];

export function MobileDealCard({ product, index = 0 }: MobileDealCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = product.baseMrp > product.basePrice
    ? Math.round(((product.baseMrp - product.basePrice) / product.baseMrp) * 100)
    : (index % 4 === 0 ? 20 : index % 4 === 1 ? 25 : index % 4 === 2 ? 20 : 25);

  const productImage = product.variants?.[0]?.images?.[0] || fallbackDealImages[index % fallbackDealImages.length];
  const { rating, count: reviewCount } = fallbackRatings[index % fallbackRatings.length];

  const rawStoreId = product.storeId;
  const storeName = product.storeName || (typeof rawStoreId === 'object' && (rawStoreId as { name?: string })?.name) || 'Official Store';

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link
      href={`/products/${product.slug || product._id}`}
      className="w-[155px] sm:w-[170px] shrink-0 snap-start bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md transition-all p-2.5 flex flex-col justify-between group"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-[#F8FAFC] rounded-xl flex items-center justify-center p-2 mb-2 overflow-hidden border border-gray-50">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackDealImages[index % fallbackDealImages.length];
          }}
        />

        {/* Discount Badge (Matching Mob 1.0.png) */}
        {discount > 0 && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-[#1668F6] text-white text-[9px] font-extrabold uppercase shadow-2xs leading-none">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute top-1.5 right-1.5 p-1 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-blue-600 text-blue-600' : 'text-blue-600'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-semibold text-[#0B1538] line-clamp-1 group-hover:text-[#1668F6] transition-colors leading-tight">
          {product.name}
        </h3>

        {/* Price & MRP */}
        <div className="flex items-baseline gap-1.5 leading-none mt-0.5">
          <span className="text-sm font-extrabold text-[#0B1538]">
            ₹{product.basePrice.toLocaleString('en-IN')}
          </span>
          {product.baseMrp > product.basePrice && (
            <span className="text-[10px] text-gray-400 line-through">
              ₹{product.baseMrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-[11px] leading-none mt-0.5">
          <span className="font-bold text-gray-800">{rating}</span>
          <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
          <span className="text-gray-400 font-normal text-[10px]">({reviewCount})</span>
        </div>

        {/* Store */}
        <div className="flex items-center gap-1 min-w-0 pt-1 mt-0.5 border-t border-gray-50">
          <Store className="w-3 h-3 text-[#1668F6] shrink-0" />
          <span className="text-[10px] text-gray-600 font-medium truncate">
            {storeName}
          </span>
        </div>
      </div>
    </Link>
  );
}
