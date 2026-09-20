'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, ArrowRight, ChevronDown } from 'lucide-react';
import { useWishlistFlyoutStore, IWishlistFlyoutItem } from '@/stores/wishlistFlyoutStore';
import { useCartStore } from '@/stores/cart.store';

export function WishlistFlyout({ onClose }: { onClose: () => void }) {
  const { items, removeItem, updateVariant } = useWishlistFlyoutStore();
  const { addItem: addCartItem } = useCartStore();

  const handleAddToCart = (item: IWishlistFlyoutItem) => {
    addCartItem({
      productId: item.productId,
      name: item.title,
      unitPrice: item.price,
      imageUrl: item.imageUrl,
      storeId: 's1',
      storeName: item.storeName,
    });
  };

  return (
    <div className="absolute right-0 top-14 w-[420px] rounded-2xl bg-white shadow-2xl border border-gray-100 p-4 z-50 flex flex-col max-h-[600px]">
      <div className="pb-3 mb-2 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-900">My Wishlist</h3>
        {items.length > 0 && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-3 border border-rose-100">
            <Heart className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1">Your wishlist is empty</p>
          <p className="text-xs text-gray-500 max-w-[240px] mb-4">
            Tap the heart icon on any product to save your favorite items here.
          </p>
          <Link
            href="/products"
            onClick={onClose}
            className="px-4 py-2 bg-[#1668F6] hover:bg-[#0f4bba] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1 space-y-4 pr-1 scrollbar-hide pb-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 group">
              {/* Thumbnail */}
              <div className="shrink-0 w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="text-sm font-semibold text-gray-900 truncate">{item.title}</h4>
                <p className="text-xs text-brand-600 mb-1">{item.storeName}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                  
                  {/* Variant Selector */}
                  {item.availableVariants && item.availableVariants.length > 0 && (
                    <div className="relative group/dropdown">
                      <button className="flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded border border-gray-200 transition-colors">
                        {item.selectedVariant} <ChevronDown className="w-3 h-3" />
                      </button>
                      <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-100 shadow-lg rounded-md py-1 hidden group-hover/dropdown:block z-10">
                        {item.availableVariants.map((variant) => (
                          <button 
                            key={variant}
                            className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-gray-50 text-gray-700"
                            onClick={() => updateVariant(item.id, variant)}
                          >
                            {variant}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="shrink-0 flex flex-col items-center justify-between py-0.5">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                
                <button 
                  onClick={() => handleAddToCart(item)}
                  className="text-brand-600 border border-brand-200 bg-brand-50 hover:bg-brand-100 p-1.5 rounded-lg transition-colors mt-2"
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="pt-3 border-t border-gray-100">
        <Link 
          href="/account/wishlist" 
          className="flex items-center gap-2 text-sm font-semibold text-[#1668F6] hover:text-[#0f4bba] transition-colors"
          onClick={onClose}
        >
          View All Wishlist <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
