'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Store, Plus, Minus, Zap } from 'lucide-react';
import type { IProduct } from '@repo/shared-types';
import { useCartStore } from '@/stores/cart.store';
import { useWishlistFlyoutStore } from '@/stores/wishlistFlyoutStore';

interface ProductCardProps {
  product: IProduct;
  badge?: 'NEW' | 'DISCOUNT' | string;
}

export function ProductCard({ product, badge }: ProductCardProps) {
  const { items, addItem, updateQuantity, removeItem, openCart } = useCartStore();
  const isWishlisted = useWishlistFlyoutStore((state) =>
    state.items.some((item) => item.productId === product._id || item.id === product._id)
  );
  const toggleWishlist = useWishlistFlyoutStore((state) => state.toggleItem);
  const [isHovered, setIsHovered] = useState(false);

  const discount =
    product.baseMrp > 0
      ? Math.round(((product.baseMrp - product.basePrice) / product.baseMrp) * 100)
      : 0;

  // Variant images for secondary image swap on hover
  const allImages = product.variants?.flatMap((v) => v.images).filter(Boolean) || [];
  const primaryImage = allImages[0] || '';
  const secondaryImage = allImages[1] || primaryImage;

  // Available size preview tags
  const sizePreviews = Array.from(
    new Set(product.variants?.filter((v) => v.size).map((v) => v.size!) || [])
  ).slice(0, 4);

  const rawStoreId = product.storeId;
  const storeId =
    typeof rawStoreId === 'object' && rawStoreId !== null
      ? (rawStoreId as { _id?: string })._id || String(rawStoreId)
      : String(rawStoreId || 'store-main');
  const storeName =
    product.storeName ||
    (typeof rawStoreId === 'object' && (rawStoreId as { name?: string })?.name) ||
    'Official Store';

  const firstVariant = product.variants?.[0];

  // Find if product is already in cart to display stepper
  const cartItem = items.find((i) => i.productId === product._id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      {
        productId: product._id,
        sku: firstVariant?.sku || `${product._id}-0`,
        name: product.name,
        imageUrl: primaryImage,
        unitPrice: firstVariant?.price || product.basePrice,
        storeId,
        storeName,
      },
      1
    );
    openCart();
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartQty > 0) {
      updateQuantity(product._id, cartQty + 1);
    } else {
      handleQuickAdd(e);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartQty > 1) {
      updateQuantity(product._id, cartQty - 1);
    } else if (cartQty === 1) {
      removeItem(product._id);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white flex flex-col rounded-2xl border border-surface-200 p-2 sm:p-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300/60"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col flex-1">
        {/* ── 1:1 SQUARE PHOTO WITH HOVER SECONDARY SWAP (Mob 2.1 / Web 2.1) ── */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-100">
          {primaryImage ? (
            <img
              src={isHovered && secondaryImage ? secondaryImage : primaryImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-100">
              <Store className="w-10 h-10 text-surface-300" />
            </div>
          )}

          {/* Badges: Discount or Custom */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {badge && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#1668F6] text-white shadow-xs">
                {badge}
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Floating Wishlist Heart */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist({
                id: product._id,
                productId: product._id,
                title: product.name,
                storeName,
                storeId,
                price: firstVariant?.price || product.basePrice,
                originalPrice: product.baseMrp || undefined,
                imageUrl: primaryImage,
                selectedVariant: firstVariant?.size || firstVariant?.color || undefined,
                availableVariants: sizePreviews.length > 0 ? sizePreviews : undefined,
              });
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-2xs z-10 ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/85 text-surface-600 hover:text-rose-500 hover:bg-white'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>

          {/* Size Pill Previews on Hover (Desktop Web 2.1) */}
          {sizePreviews.length > 0 && (
            <div className="hidden lg:flex absolute bottom-2 left-2 right-2 justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              {sizePreviews.map((size) => (
                <span
                  key={size}
                  className="px-1.5 py-0.5 rounded bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-[#061842] shadow-2xs border border-surface-200"
                >
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="pt-2.5 pb-1 px-1 flex flex-col flex-1">
          {/* Store Distance Pill (Mob 2.1: ⚡ 15 mins • 1.2 km) */}
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-md w-fit border border-amber-200/60">
            <Zap className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
            <span>15 mins • 1.2 km</span>
          </div>

          {/* 2-Line Clamped Title */}
          <h3 className="text-xs sm:text-[13px] font-extrabold text-[#061842] line-clamp-2 leading-snug group-hover:text-[#1668F6] transition-colors">
            {product.name}
          </h3>

          {/* Pricing: Current + Strikethrough MRP */}
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-sm sm:text-base font-black text-[#061842]">
              ₹{product.basePrice.toLocaleString('en-IN')}
            </span>
            {discount > 0 && (
              <span className="text-[11px] font-semibold text-surface-400 line-through">
                ₹{product.baseMrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* ── FOOTER: STORE + INSTANT ADD / STEPPER (Mob 2.1 / Web 2.1) ── */}
      <div className="flex items-center justify-between pt-2 border-t border-surface-100 px-1 mt-auto">
        <div className="flex items-center gap-1 min-w-0 pr-1">
          <Store className="w-3 h-3 text-surface-400 shrink-0" />
          <span className="text-[11px] font-medium text-surface-500 truncate max-w-[80px] sm:max-w-[100px]">
            {storeName}
          </span>
        </div>

        {/* Instant Add or Quantity Stepper */}
        {cartQty > 0 ? (
          <div className="flex items-center bg-[#1668F6] text-white rounded-lg h-7 px-1 shadow-sm">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-5 h-full flex items-center justify-center hover:bg-blue-700 rounded active:scale-90"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3 stroke-[3]" />
            </button>
            <span className="px-1.5 text-xs font-black select-none">{cartQty}</span>
            <button
              type="button"
              onClick={handleIncrement}
              className="w-5 h-full flex items-center justify-center hover:bg-blue-700 rounded active:scale-90"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-[#1668F6] hover:bg-blue-700 text-white text-[11px] font-black transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-3 h-3 stroke-[3]" />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
}
