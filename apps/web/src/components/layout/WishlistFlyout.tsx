'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, ArrowRight, ChevronDown, Trash2 } from 'lucide-react';
import { useWishlistFlyoutStore, IWishlistFlyoutItem } from '@/stores/wishlistFlyoutStore';
import { useCartStore } from '@/stores/cart.store';

const dummyWishlistItems: IWishlistFlyoutItem[] = [
  {
    id: 'w1',
    productId: 'p1',
    title: 'Men White Sneakers',
    storeName: 'Fashion Hub',
    price: 1299,
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=150&h=150',
    selectedVariant: 'Size: 9',
    availableVariants: ['Size: 8', 'Size: 9', 'Size: 10'],
  },
  {
    id: 'w2',
    productId: 'p2',
    title: 'boAt Wave Sigma 3 Smartwatch',
    storeName: 'Fashion Hub',
    price: 1799,
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=150&h=150',
    selectedVariant: 'Color: Black',
    availableVariants: ['Color: Black', 'Color: Blue'],
  },
  {
    id: 'w3',
    productId: 'p3',
    title: 'Men Casual Shirt',
    storeName: 'Fashion Hub',
    price: 699,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?auto=format&fit=crop&q=80&w=150&h=150',
    selectedVariant: 'Size: L',
    availableVariants: ['Size: M', 'Size: L', 'Size: XL'],
  },
  {
    id: 'w4',
    productId: 'p4',
    title: 'Laptop Backpack',
    storeName: 'Fashion Hub',
    price: 899,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=150&h=150',
    selectedVariant: 'Color: Black',
    availableVariants: ['Color: Black', 'Color: Grey'],
  },
  {
    id: 'w5',
    productId: 'p5',
    title: 'pTron Bassbuds Vista',
    storeName: 'Fashion Hub',
    price: 1099,
    imageUrl: 'https://images.unsplash.com/photo-1606220588913-b3eea4141151?auto=format&fit=crop&q=80&w=150&h=150',
    selectedVariant: 'Color: Mint Green',
    availableVariants: ['Color: Mint Green', 'Color: Black'],
  },
];

export function WishlistFlyout({ onClose }: { onClose: () => void }) {
  const { items, setItems, removeItem, updateVariant } = useWishlistFlyoutStore();
  const { addItem: addCartItem } = useCartStore();

  useEffect(() => {
    if (items.length === 0) {
      setItems(dummyWishlistItems);
    }
  }, [items.length, setItems]);

  const displayItems = items.length > 0 ? items : dummyWishlistItems;

  const handleAddToCart = (item: IWishlistFlyoutItem) => {
    addCartItem({
      productId: item.productId,
      name: item.title,
      unitPrice: item.price,
      imageUrl: item.imageUrl,
      storeId: 's1', // Mock store ID
      storeName: item.storeName,
    });
  };

  return (
    <div className="absolute right-0 top-14 w-[420px] rounded-2xl bg-white shadow-2xl border border-gray-100 p-4 z-50 flex flex-col max-h-[600px]">
      <div className="pb-3 mb-2 border-b border-gray-100">
        <h3 className="font-semibold text-lg text-gray-900">My Wishlist</h3>
      </div>
      
      <div className="overflow-y-auto flex-1 space-y-4 pr-1 scrollbar-hide pb-4">
        {displayItems.map((item) => (
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
                    {/* Simple Dropdown on hover for demo */}
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
      
      <div className="pt-3 border-t border-gray-100">
        <Link 
          href="/account/wishlist" 
          className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          onClick={onClose}
        >
          View All Wishlist <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
