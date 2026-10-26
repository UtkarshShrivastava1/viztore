'use client';

import React, { useState } from 'react';
import { ShieldCheck, RotateCcw, Truck, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { PincodeChecker } from './PincodeChecker';
import type { IProduct } from '@repo/shared-types';

interface ProductSpecsProps {
  product: IProduct;
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(true);

  // Derive specs from product attributes or provide authentic fallbacks
  const specs = [
    { label: 'Material / Fabric', value: product.attributes?.find(a => a.key.toLowerCase().includes('fabric') || a.key.toLowerCase().includes('material'))?.value || '100% Combed Cotton' },
    { label: 'Fit', value: product.attributes?.find(a => a.key.toLowerCase().includes('fit'))?.value || 'Regular Fit' },
    { label: 'Sleeve Length', value: product.attributes?.find(a => a.key.toLowerCase().includes('sleeve'))?.value || 'Short Sleeves' },
    { label: 'Neck / Collar', value: product.attributes?.find(a => a.key.toLowerCase().includes('neck'))?.value || 'Round Neck' },
    { label: 'Pattern', value: product.attributes?.find(a => a.key.toLowerCase().includes('pattern'))?.value || 'Solid / Minimalist' },
    { label: 'Wash Care', value: product.attributes?.find(a => a.key.toLowerCase().includes('wash'))?.value || 'Machine wash cold, gentle cycle' },
    { label: 'Country of Origin', value: 'India' },
    { label: 'Style / Product Code', value: `PRD-${product._id.slice(-5).toUpperCase() || '10245'}` },
  ];

  return (
    <div className="space-y-8">
      {/* Specifications Matrix */}
      <div className="bg-white rounded-2xl border border-surface-200 p-5 sm:p-6 shadow-xs">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="flex items-center justify-between w-full md:cursor-default"
        >
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#061842]">
              Product Specifications
            </h2>
            <p className="text-xs text-surface-500 font-medium mt-0.5 text-left">
              Key dimensions, material composition & care guide
            </p>
          </div>
          <span className="md:hidden p-1 rounded-lg bg-surface-100 text-[#061842]">
            {isOpenMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        <div className={`mt-5 ${isOpenMobile ? 'block' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 border-t border-surface-100 pt-4">
            {specs.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-surface-100/80 text-xs sm:text-sm"
              >
                <span className="font-semibold text-surface-500">{item.label}</span>
                <span className="font-extrabold text-[#061842] text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hyperlocal Pincode Checker Card */}
      <PincodeChecker />

      {/* 4 Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Genuine */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-surface-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1668F6] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-xs font-black text-[#061842] leading-tight">100% Genuine</p>
            <p className="text-[11px] font-medium text-surface-500 mt-0.5 leading-tight">Direct from verified store</p>
          </div>
        </div>

        {/* 7-Day Returns */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-surface-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-xs font-black text-[#061842] leading-tight">7-Day Returns</p>
            <p className="text-[11px] font-medium text-surface-500 mt-0.5 leading-tight">Hassle-free doorstep pickup</p>
          </div>
        </div>

        {/* Fast Delivery */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-surface-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-xs font-black text-[#061842] leading-tight">Free Delivery</p>
            <p className="text-[11px] font-medium text-surface-500 mt-0.5 leading-tight">On all orders above ₹499</p>
          </div>
        </div>

        {/* Secure Payment */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-surface-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-xs font-black text-[#061842] leading-tight">Secure Payment</p>
            <p className="text-[11px] font-medium text-surface-500 mt-0.5 leading-tight">UPI, Cards & Cash on Delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
}
