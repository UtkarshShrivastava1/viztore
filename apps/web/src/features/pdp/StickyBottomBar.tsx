import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

export function StickyBottomBar({
  onAddToCart,
  onSaveWishlist,
  isAdded,
}: {
  onAddToCart?: () => void;
  onSaveWishlist?: () => void;
  isAdded?: boolean;
}) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-surface-100 z-50 flex items-center gap-3">
      <button 
        type="button"
        onClick={onSaveWishlist}
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-surface-200 text-[#192168] font-bold text-[15px] bg-white active:scale-95 transition-transform"
      >
        <Heart className="w-[18px] h-[18px]" />
        Save to Wishlist
      </button>
      <button 
        type="button"
        onClick={onAddToCart}
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#0457F4] text-white font-bold text-[15px] shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
      >
        <ShoppingBag className="w-[18px] h-[18px] fill-white" />
        {isAdded ? 'Added to Bag ✓' : 'Add to Bag'}
      </button>
    </div>
  );
}
