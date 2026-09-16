import React from 'react';
import { ShieldCheck, Package, Truck, TrendingUp } from 'lucide-react';

export function ProductOffers() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
      
      {/* 100% Original */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50/50">
          <ShieldCheck className="w-5 h-5 text-[#1668F6]" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-extrabold text-[#192168]">100% Original</span>
          <span className="text-[10px] font-medium text-surface-500">Products</span>
        </div>
      </div>

      {/* Easy Returns */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50/50">
          <Package className="w-5 h-5 text-[#1668F6]" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-extrabold text-[#192168]">Easy Returns</span>
          <span className="text-[10px] font-medium text-surface-500">7 Days</span>
        </div>
      </div>

      {/* Free Delivery */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50/50">
          <Truck className="w-5 h-5 text-[#1668F6]" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-extrabold text-[#192168]">Free Delivery</span>
          <span className="text-[10px] font-medium text-surface-500">on orders above ₹499</span>
        </div>
      </div>

      {/* Top Brands */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50/50">
          <TrendingUp className="w-5 h-5 text-[#1668F6]" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-extrabold text-[#192168]">Top Brands</span>
          <span className="text-[10px] font-medium text-surface-500">Great Prices</span>
        </div>
      </div>

    </div>
  );
}
