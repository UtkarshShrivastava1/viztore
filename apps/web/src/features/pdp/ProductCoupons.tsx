'use client';

import React, { useState } from 'react';
import { Tag, Copy, Check } from 'lucide-react';

interface CouponItem {
  code: string;
  title: string;
  description: string;
}

const AVAILABLE_COUPONS: CouponItem[] = [
  {
    code: 'WELCOME50',
    title: 'Flat ₹50 OFF',
    description: 'On your first order above ₹499. Apply at checkout.',
  },
  {
    code: 'FLAT100',
    title: 'Flat ₹100 OFF',
    description: 'Special instant discount on orders above ₹999.',
  },
];

export function ProductCoupons() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-[#1668F6]" />
        <h3 className="text-sm font-extrabold text-[#061842]">Best Offers & Coupons</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {AVAILABLE_COUPONS.map((coupon) => {
          const isCopied = copiedCode === coupon.code;
          return (
            <div
              key={coupon.code}
              className="relative p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 border border-blue-100 hover:border-[#1668F6]/40 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[#1668F6]/10 text-[#1668F6] font-mono text-xs font-black tracking-wider uppercase border border-[#1668F6]/20">
                    {coupon.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(coupon.code)}
                    className={`flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition-all ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white hover:bg-[#1668F6] text-[#1668F6] hover:text-white border border-[#1668F6]/30 shadow-2xs'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <h4 className="text-xs font-extrabold text-[#061842] mt-1">
                  {coupon.title}
                </h4>
                <p className="text-[11px] text-surface-500 font-medium leading-relaxed mt-0.5">
                  {coupon.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
