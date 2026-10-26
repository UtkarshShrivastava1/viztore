'use client';

import React from 'react';
import { ShoppingBag, Zap, Check } from 'lucide-react';

interface StickyBottomBarProps {
  price: number;
  mrp?: number;
  discount?: number;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  isAdded?: boolean;
}

export function StickyBottomBar({
  price,
  mrp,
  discount,
  onAddToCart,
  onBuyNow,
  isAdded,
}: StickyBottomBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-surface-200 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3">
      {/* Price Summary */}
      <div className="flex flex-col min-w-[90px] pl-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-black text-[#061842]">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {mrp && mrp > price && (
            <span className="text-[11px] font-bold text-surface-400 line-through">
              ₹{mrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        {discount && discount > 0 ? (
          <span className="text-[10px] font-black text-emerald-600 leading-tight">
            {discount}% OFF • FREE Delivery
          </span>
        ) : (
          <span className="text-[10px] font-bold text-surface-500 leading-tight">
            Inclusive of taxes
          </span>
        )}
      </div>

      {/* Dual CTAs */}
      <div className="flex items-center gap-2 flex-1">
        <button
          type="button"
          onClick={onAddToCart}
          className={`flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl border-2 font-black text-xs transition-all active:scale-95 ${
            isAdded
              ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
              : 'border-[#1668F6] text-[#1668F6] bg-white hover:bg-blue-50/50'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBuyNow}
          className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl bg-[#1668F6] hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
