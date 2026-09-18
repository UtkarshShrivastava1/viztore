'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Share2, 
  PenLine, 
  Heart, 
  MoreVertical,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const mockWishlist = [
  {
    id: 1,
    title: 'Men White Sneakers',
    store: 'fashion hub',
    size: '9',
    price: 1299,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 2,
    title: 'boAt Wave Sigma 3 Smartwatch',
    store: 'fashion hub',
    color: 'Black',
    price: 1799,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 3,
    title: 'Men Casual Shirt',
    store: 'fashion hub',
    size: 'L',
    color: 'Navy Blue',
    price: 699,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 4,
    title: 'Laptop Backpack',
    store: 'fashion hub',
    color: 'Black',
    price: 899,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 5,
    title: 'pTron Bassbuds Vista',
    store: 'fashion hub',
    color: 'Mint Green',
    price: 1099,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 6,
    title: 'Wild Stone Blue Eau De Parfum',
    store: 'fashion hub',
    size: '100 ml',
    price: 499,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1588265008544-716d80ff525e?auto=format&fit=crop&q=80&w=200',
  }
];

export function WishlistClient() {
  return (
    <div className="min-h-screen bg-white md:bg-[#f4f5f9] pb-24 relative">
      {/* Background Gradient matching header */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none md:hidden" />

      <main className="max-w-3xl mx-auto px-4 pt-6 pb-6 relative z-10 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[22px] font-bold text-[#192168]">My Wishlist</h1>
          <p className="text-[12px] font-medium text-surface-500 mt-0.5">Items you love, saved for later.</p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-100">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="text-[12px] font-bold text-[#192168]">{mockWishlist.length} Items</span>
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
        <div className="space-y-4">
          {mockWishlist.map((item) => (
            <div key={item.id} className="bg-white md:rounded-2xl md:shadow-sm md:border md:border-surface-200/50 flex gap-4 md:p-4">
              {/* Product Image */}
              <div className="w-[100px] h-[100px] bg-[#f4f5f9] rounded-xl overflow-hidden flex-shrink-0 relative">
                <Image 
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover mix-blend-multiply"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 relative">
                <div className="pr-8">
                  <h3 className="text-[14px] font-bold text-[#192168] line-clamp-1">{item.title}</h3>
                  <p className="text-[10px] font-bold text-[#1668F6] mt-0.5 lowercase">{item.store}</p>
                  
                  {/* Selectors */}
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {(item.size || item.color) && (
                      <button className="flex items-center gap-1.5 px-2 py-1 rounded border border-surface-200 bg-white hover:bg-surface-50 transition-colors">
                        <span className="text-[9px] font-semibold text-surface-600">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && '  •  '}
                          {item.color && `Color: ${item.color}`}
                        </span>
                        <ChevronDown className="w-3 h-3 text-surface-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Price and Action */}
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[16px] font-extrabold text-[#192168]">₹{item.price.toLocaleString('en-IN')}</span>
                    {item.inStock && (
                      <p className="text-[10px] font-bold text-[#06B95F] mt-0.5">In Stock</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-1.5 rounded border border-[#1668F6] text-[#1668F6] text-[11px] font-bold hover:bg-[#1668F6]/5 transition-colors">
                      Move to Cart
                    </button>
                    <button className="text-surface-400 p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Heart Button */}
                <button className="absolute top-0 right-0 p-1 text-rose-500">
                  <Heart className="w-4 h-4 fill-rose-500" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Price Drop Alerts */}
        <div className="bg-[#f8faff] border border-blue-100 rounded-xl p-4 flex items-center justify-between mt-8 mb-4">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-[#1668F6] fill-[#1668F6]" />
            <div>
              <h4 className="text-[12px] font-bold text-[#192168]">Price Drop Alerts</h4>
              <p className="text-[10px] font-medium text-surface-500 mt-0.5">We'll notify you when prices drop on your wishlist items.</p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-[11px] font-bold text-[#1668F6]">
            Enable Alerts <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </main>
    </div>
  );
}
