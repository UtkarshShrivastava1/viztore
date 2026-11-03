'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Zap } from 'lucide-react';
import type { IProduct } from '@repo/shared-types';
import { useCartStore } from '@/stores/cart.store';
import { useWishlistFlyoutStore } from '@/stores/wishlistFlyoutStore';

interface HorizontalDealCardProps {
  product: IProduct;
  index?: number;
}

const fallbackDealImages = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400', // Running Shoes
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400', // Earbuds
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400', // Skincare
  'https://images.unsplash.com/photo-1584990347449-3974d6c7e2b1?auto=format&fit=crop&q=80&w=400', // Cookware
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400', // Men Shirt
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400', // Backpack
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400', // Table Lamp
  'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&q=80&w=400', // Air Fryer
];

export function HorizontalDealCard({ product, index = 0 }: HorizontalDealCardProps) {
  const { addItem, openCart } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = useWishlistFlyoutStore((state) =>
    state.items.some((i) => i.id === product._id || i.productId === product._id)
  );
  const toggleWishlistStore = useWishlistFlyoutStore((state) => state.toggleItem);

  const discount = product.baseMrp > product.basePrice
    ? Math.round(((product.baseMrp - product.basePrice) / product.baseMrp) * 100)
    : (index % 4 === 0 ? 10 : index % 4 === 1 ? 25 : index % 4 === 2 ? 15 : 20);

  const productImage =
    product.images?.[0] ||
    product.variants?.[0]?.images?.[0] ||
    (product.variants?.[0] as any)?.image ||
    fallbackDealImages[index % fallbackDealImages.length];

  // Deterministic rating calculation
  const charCodeSum = (product._id || product.name || 'D')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = product.rating ? Number(product.rating).toFixed(1) : (4.2 + (charCodeSum % 7) / 10).toFixed(1);
  const reviewCount = product.reviewCount || (800 + (charCodeSum % 1500));

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
    toggleWishlistStore({
      id: product._id,
      productId: product._id,
      title: product.name,
      storeId,
      storeName,
      price: product.basePrice,
      originalPrice: product.baseMrp,
      imageUrl: productImage,
      slug: product.slug,
    });
  };

  return (
    <Link
      href={`/products/${product.slug || product._id}`}
      className="group bg-white rounded-2xl border border-gray-100/90 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all duration-300 p-2.5 sm:p-3 flex items-center gap-3 relative w-full overflow-hidden hover:-translate-y-0.5"
    >
      {/* Left Image Thumbnail Container */}
      <div className="relative w-24 h-24 sm:w-26 sm:h-26 shrink-0 bg-[#F8FAFC] rounded-xl flex items-center justify-center p-1.5 overflow-hidden border border-gray-100/80">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackDealImages[index % fallbackDealImages.length];
          }}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-[#E53935] text-white text-[9px] font-extrabold uppercase shadow-2xs leading-none">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Right Details */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5 space-y-1">
        <div>
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-extrabold text-xs sm:text-sm text-[#0B1538] group-hover:text-[#1668F6] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
            
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={toggleWishlist}
              className={`p-1 rounded-full transition-colors ${
                isWishlisted
                  ? 'text-rose-500 hover:bg-rose-50'
                  : 'text-gray-400 hover:text-rose-500 hover:bg-gray-50'
              }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-3.5 h-3.5 transition-transform active:scale-125 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Social Proof Rating */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] font-bold text-gray-700 flex items-center gap-0.5">
              {rating} <Star className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
            </span>
            <span className="text-[10px] text-gray-400 font-medium">({reviewCount.toLocaleString()})</span>
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-sm sm:text-base font-extrabold text-[#0B1538]">
              ₹{product.basePrice.toLocaleString('en-IN')}
            </span>
            {product.baseMrp > product.basePrice && (
              <span className="text-[11px] text-gray-400 line-through font-medium">
                ₹{product.baseMrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center justify-center p-2 rounded-xl transition-all shadow-2xs ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-50 text-[#1668F6] hover:bg-[#1668F6] hover:text-white'
            }`}
            title="Add to cart"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Store Identifier */}
        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          <span className="truncate">{storeName}</span>
        </div>
      </div>
    </Link>
  );
}
