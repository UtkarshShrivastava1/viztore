import React from 'react';
import { ShoppingBag, Zap, Check } from 'lucide-react';

export function StickyBottomBar({
  onAddToCart,
  onBuyNow,
  isAdded,
}: {
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  isAdded?: boolean;
}) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-surface-100 z-50 flex items-center gap-3">
      <button 
        type="button"
        onClick={onAddToCart}
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-[#1668F6] text-[#1668F6] font-extrabold text-[14px] bg-white active:scale-95 transition-transform"
      >
        {isAdded ? (
          <>
            <Check className="w-[18px] h-[18px] text-emerald-600" />
            <span className="text-emerald-600">Added to Cart</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={2.5} />
            <span>Add to Cart</span>
          </>
        )}
      </button>
      <button 
        type="button"
        onClick={onBuyNow}
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#1668F6] text-white font-extrabold text-[14px] shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
      >
        <Zap className="w-[18px] h-[18px] fill-white" />
        <span>Buy Now</span>
      </button>
    </div>
  );
}
