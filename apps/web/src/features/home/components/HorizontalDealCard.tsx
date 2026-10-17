'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Store, Star } from 'lucide-react';
import type { IProduct } from '@repo/shared-types';
import { useCartStore } from '@/stores/cart.store';

interface HorizontalDealCardProps {
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

export function HorizontalDealCard({ product, index = 0 }: HorizontalDealCardProps) {
  const { addItem, openCart } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const discount = product.baseMrp > product.basePrice
    ? Math.round(((product.baseMrp - product.basePrice) / product.baseMrp) * 100)
    : (index % 4 === 0 ? 10 : index % 4 === 1 ? 25 : index % 4 === 2 ? 15 : 20);

  const productImage = product.variants?.[0]?.images?.[0] || fallbackDealImages[index % fallbackDealImages.length];
  const { rating, count: reviewCount } = fallbackRatings[index % fallbackRatings.length];

  const rawStoreId = product.storeId;
  const storeId = typeof rawStoreId === 'object' && rawStoreId !== null
    ? (rawStoreId as { _id?: string })._id || String(rawStoreId)
    : String(rawStoreId || 'store-main');
  const storeName = product.storeName || (typeof rawStoreId === 'object' && (rawStoreId as { name?: string })?.name) || 'Official Store';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const success = addItem({
      productId: product._id,
      name: product.name,
      unitPrice: product.basePrice,
      imageUrl: productImage,
      storeId,
      storeName,
    });

    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
      openCart();
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link
      href={`/products/${product.slug || product._id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-blue-100 transition-all duration-300 p-2.5 sm:p-3 flex items-center gap-3 relative w-full overflow-hidden"
    >
      {/* Left Image Thumbnail Container */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-[#F8FAFC] rounded-xl flex items-center justify-center p-2 overflow-hidden border border-gray-50">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackDealImages[index % fallbackDealImages.length];
          }}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-[#E53935] text-white text-[9px] font-extrabold uppercase shadow-2xs leading-none">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Right Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-24 sm:h-28 py-0.5">
        {/* Row 1: Title & Wishlist */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-semibold text-[#0B1538] line-clamp-1 group-hover:text-[#1668F6] transition-colors leading-tight">
            {product.name}
          </h3>
          <button
            type="button"
            onClick={toggleWishlist}
            className="shrink-0 p-1 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Save to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-blue-600 text-blue-600' : 'text-blue-600'}`} />
          </button>
        </div>

        {/* Row 2: Price & MRP */}
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="text-sm sm:text-base font-extrabold text-[#0B1538]">
            ₹{product.basePrice.toLocaleString('en-IN')}
          </span>
          {product.baseMrp > product.basePrice && (
            <span className="text-[11px] sm:text-xs text-gray-400 line-through">
              ₹{product.baseMrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Row 3: Rating */}
        <div className="flex items-center gap-1 text-xs leading-none">
          <span className="font-bold text-gray-800">{rating}</span>
          <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
          <span className="text-gray-400 font-normal text-[11px] ml-0.5">({reviewCount})</span>
        </div>

        {/* Row 4: Store Attribution & Cart Action */}
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <div className="flex items-center gap-1 min-w-0">
            <Store className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1668F6] shrink-0" />
            <span className="text-[11px] sm:text-xs text-gray-600 font-medium truncate max-w-[95px] sm:max-w-[120px]">
              {storeName}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`shrink-0 p-1.5 rounded-lg border transition-all active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-blue-200 text-[#1668F6] bg-blue-50/50 hover:bg-[#1668F6] hover:text-white'
            }`}
            title="Add to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
