'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Share2,
  PenLine,
  Trash2,
  ShoppingBag,
} from 'lucide-react';
import { useWishlistFlyoutStore } from '@/stores/wishlistFlyoutStore';
import { useCartStore } from '@/stores/cart.store';

export function WishlistClient() {
  const { items, removeItem } = useWishlistFlyoutStore();
  const { addItem: addToCart } = useCartStore();

  return (
    <div className="min-h-screen bg-white md:bg-[#f4f5f9] pb-24 relative">
      {/* Background Gradient matching header */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none md:hidden" />

      <main className="max-w-3xl mx-auto px-4 pt-6 pb-6 relative z-10 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[22px] font-bold text-[#192168]">My Wishlist</h1>
          <p className="text-[12px] font-medium text-surface-500 mt-0.5">
            Items you love, saved for later.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-100">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="text-[12px] font-bold text-[#192168]">{items.length} Items</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-[#1668F6]">
              <Share2 className="w-4 h-4" />
              <span className="text-[11px] font-bold">Share Wishlist</span>
            </button>
            <div className="w-[1px] h-4 bg-surface-200"></div>
            <button className="flex items-center gap-1.5 text-[#192168]">
              <PenLine className="w-4 h-4" />
              <span className="text-[11px] font-bold">Manage</span>
            </button>
          </div>
        </div>

        {/* Wishlist Items */}
        {items.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl p-8 border border-slate-100">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 mt-1">
              Explore local stores and products to save items you love.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-surface-200/50 flex gap-4 p-4"
              >
                {/* Product Image */}
                <div className="w-[100px] h-[100px] bg-[#f4f5f9] rounded-xl overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover mix-blend-multiply"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 relative">
                  <div className="pr-8">
                    <h3 className="text-[14px] font-bold text-[#192168] line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[10px] font-bold text-[#1668F6] mt-0.5 lowercase">
                      {item.storeName}
                    </p>
                    {item.selectedVariant && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        Variant: {item.selectedVariant}
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-0 right-0 p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[15px] font-extrabold text-[#192168]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-[12px] text-surface-400 line-through">
                          ₹{item.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        addToCart({
                          productId: item.productId,
                          name: item.title,
                          unitPrice: item.price,
                          storeId: 'store-1',
                          storeName: item.storeName || 'Local Store',
                          imageUrl: item.imageUrl,
                        });
                        removeItem(item.id);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1668F6] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
