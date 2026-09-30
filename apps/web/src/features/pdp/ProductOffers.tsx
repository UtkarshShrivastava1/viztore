import React from 'react';
import { ShieldCheck, Package, Truck, TrendingUp } from 'lucide-react';

export function ProductOffers() {
  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      
      {/* Secure Payments */}
      <div className="flex items-center gap-2 bg-[#f4f5f9] rounded-lg p-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" strokeWidth={2} />
        <div className="flex flex-col leading-tight overflow-hidden">
          <span className="text-[10px] font-extrabold text-[#192168] truncate">Secure Payments</span>
          <span className="text-[9px] font-medium text-surface-500 truncate">100% Secure</span>
        </div>
      </div>

      {/* Easy Returns */}
      <div className="flex items-center gap-2 bg-[#f4f5f9] rounded-lg p-2.5">
        {/* Using rotate-ccw or similar icon for easy returns */}
        <svg className="w-5 h-5 text-[#1668F6] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"></polyline>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
        <div className="flex flex-col leading-tight overflow-hidden">
          <span className="text-[10px] font-extrabold text-[#192168] truncate">Easy Returns</span>
          <span className="text-[9px] font-medium text-surface-500 truncate">7 Days Return</span>
        </div>
      </div>

      {/* Top Quality */}
      <div className="flex items-center gap-2 bg-[#f4f5f9] rounded-lg p-2.5">
        <svg className="w-5 h-5 text-[#1668F6] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15l-3.09 1.63.59-3.45L7 10.7l3.46-.5L12 7l1.54 3.2 3.46.5-2.5 2.48.59 3.45L12 15z"></path>
          <path d="M21.5 12a9.5 9.5 0 1 1-19 0 9.5 9.5 0 0 1 19 0z"></path>
        </svg>
        <div className="flex flex-col leading-tight overflow-hidden">
          <span className="text-[10px] font-extrabold text-[#192168] truncate">Top Quality</span>
          <span className="text-[9px] font-medium text-surface-500 truncate">Trusted Products</span>
        </div>
      </div>

    </div>
  );
}
