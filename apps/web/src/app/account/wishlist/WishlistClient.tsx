'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Trash2,
  Store,
  ShoppingBag,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useWishlistFlyoutStore, IWishlistFlyoutItem } from '@/stores/wishlistFlyoutStore';
import { AccountSidebar } from '@/components/account/AccountSidebar';

export function WishlistClient() {
  const router = useRouter();
  const { addItem: addToCart } = useCartStore();
  const { items: wishlistStoreItems, removeItem } = useWishlistFlyoutStore();
  const isLoading = false;

  // If user has items in their client wishlist store, use those.
  // Otherwise, if empty, we provide a clean discovery experience.
  const hasItems = wishlistStoreItems.length > 0;

  const handleAddToCart = (item: IWishlistFlyoutItem) => {
    addToCart({
      productId: item.productId || item.id,
      name: item.title,
      unitPrice: item.price || 0,
      storeId: 'store-1', // Default store ID since it's not in IWishlistFlyoutItem
      storeName: item.storeName || 'Verified Store Partner',
      imageUrl: item.imageUrl || '',
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans">
      <main className="max-w-[1680px] mx-auto px-2 lg:px-8 pt-4 pb-6 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ================= DESKTOP LEFT SIDEBAR ================= */}
        <AccountSidebar />

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <div className="flex-1 w-full flex flex-col min-h-screen bg-transparent lg:bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-surface-200/60 lg:p-6">
          
          {/* Header */}
          <div className="px-2 lg:px-0 w-full flex items-start gap-3 pt-2 pb-1">
            <button onClick={() => router.back()} className="shrink-0 lg:hidden mt-0.5">
              <ArrowLeft className="w-6 h-6 text-[#192168]" />
            </button>
            <div>
              <h1 className="text-[22px] lg:text-[28px] font-bold text-[#192168] leading-tight">My Wishlist</h1>
              <p className="text-[13px] font-medium text-surface-500 mt-1">Items you love, saved for quick ordering.</p>
            </div>
          </div>

          {/* Items Count Header */}
          <div className="flex items-center gap-2 mb-3 px-2 lg:px-0 mt-3 lg:mt-6">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="text-[12px] lg:text-[14px] font-bold text-[#192168]">
              {wishlistStoreItems.length} {wishlistStoreItems.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          {/* Items Grid */}
          <div className="flex-1 mt-1 px-1 lg:px-0">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2 text-surface-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#1668F6]" />
                <p className="text-xs font-semibold">Loading saved wishlist items...</p>
              </div>
            ) : !hasItems ? (
              /* Empty State */
              <div className="border border-dashed border-[#E5E7EB] bg-white rounded-2xl p-8 lg:p-14 text-center flex flex-col items-center justify-center my-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-[16px] lg:text-[18px] font-bold text-[#192168] mb-1">Your Wishlist is Empty</h3>
                <p className="text-[13px] text-surface-500 max-w-md mb-6 leading-relaxed">
                  Browse products from nearby stores and tap the heart icon on any card to save your favorite items here.
                </p>
                <Link 
                  href="/products" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1668F6] text-white text-[13px] font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" /> Explore Marketplace
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                {wishlistStoreItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="border border-[#E5E7EB] rounded-2xl bg-white p-3 lg:p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative"
                  >
                    <div>
                      {/* Top Banner / Store Info */}
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#192168] mb-2 pb-2 border-b border-surface-100">
                        <Store className="w-3.5 h-3.5 text-[#1668F6]" />
                        <span className="truncate">{item.storeName || 'Local Partner Store'}</span>
                      </div>

                      {/* Image & Product Info */}
                      <div className="flex gap-3 mb-3">
                        <div className="w-20 h-20 rounded-xl bg-surface-50 shrink-0 overflow-hidden border border-surface-100 flex items-center justify-center">
                          <img 
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=200&h=200'} 
                            alt={item.title} 
                            className="w-full h-full object-cover mix-blend-multiply" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] lg:text-[14px] font-bold text-[#192168] line-clamp-2 leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-[14px] lg:text-[16px] font-extrabold text-[#192168] mt-1">
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>
                          <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                            In Stock
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-surface-100">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="w-10 h-10 shrink-0 rounded-xl border border-rose-200 text-rose-500 flex items-center justify-center hover:bg-rose-50 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 h-10 rounded-xl bg-[#0F53FB] text-white text-[12px] font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-4 h-4" /> Move to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
