import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

export function StickyBottomBar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-surface-100 z-50 flex items-center gap-3">
      <button className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-surface-200 text-[#192168] font-bold text-[15px] bg-white">
        <Heart className="w-[18px] h-[18px]" />
        Save to Wishlist
      </button>
      <button className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#0457F4] text-white font-bold text-[15px] shadow-lg shadow-blue-500/20">
        <ShoppingBag className="w-[18px] h-[18px] fill-white" />
        Add to Bag
      </button>
    </div>
  );
}
