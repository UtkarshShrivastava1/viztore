'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingCart, Store } from 'lucide-react';
import type { IProduct } from '@repo/shared-types';
import { useCartStore } from '@/stores/cart.store';

interface DealProductCardProps {
  product: IProduct;
}

export function DealProductCard({ product }: DealProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const [isAdded, setIsAdded] = React.useState(false);

  const discount = product.baseMrp > 0
    ? Math.round(((product.baseMrp - product.basePrice) / product.baseMrp) * 100)
    : 0;

  const firstImage = product.variants?.[0]?.images?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rawStoreId = product.storeId;
    const storeId = typeof rawStoreId === 'object' && rawStoreId !== null
      ? (rawStoreId as any)._id || String(rawStoreId)
      : String(rawStoreId || 'store-main');
    const storeName = product.storeName || (typeof rawStoreId === 'object' && (rawStoreId as any)?.name) || 'Official Store';

    const success = addItem({
      productId: product._id,
      name: product.name,
      unitPrice: product.basePrice,
      imageUrl: firstImage || '',
      storeId,
      storeName,
    });

    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
      openCart();
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white flex flex-col hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/5 border border-surface-200 rounded-2xl p-3"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-surface-50 rounded-xl mb-3 flex items-center justify-center p-4">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-100">
            <Store className="w-12 h-12 text-surface-400" />
          </div>
        )}

        {/* Discount Ribbon */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-[#1668F6] text-white text-[10px] font-extrabold shadow-sm">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist Toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-rose-50 text-[#192168] hover:text-rose-500 transition-all shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-[#192168] line-clamp-2 leading-snug group-hover:text-[#1668F6] transition-colors mb-2">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-extrabold text-[#192168]">
            ₹{product.basePrice.toLocaleString('en-IN')}
          </span>
          {discount > 0 && (
            <span className="text-xs font-medium text-surface-400 line-through decoration-surface-300">
              ₹{product.baseMrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mb-3">
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-extrabold text-[#192168]">{product.rating.toFixed(1)}</span>
              <Star className="w-3.5 h-3.5 text-[#06B95F] fill-[#06B95F]" />
            </div>
          )}
          {product.reviewCount > 0 && (
            <span className="text-xs font-medium text-surface-500">({product.reviewCount})</span>
          )}
        </div>

        {/* Store Attribution */}
        <div className="flex items-center gap-1.5 mt-auto mb-3 text-xs text-surface-500 font-medium bg-surface-50 w-fit px-2 py-1 rounded-md">
          <Store className="w-3.5 h-3.5 text-brand-600" />
          <span className="truncate max-w-[120px]">{product.storeName}</span>
        </div>

        {/* Add to Cart CTA */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-98 ${
            isAdded
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-[#1668F6] text-[#1668F6] hover:bg-[#1668F6] hover:text-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4" /> {isAdded ? 'Added to Cart ✓' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
