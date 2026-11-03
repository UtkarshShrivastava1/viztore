'use client';

import React from 'react';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
  category?: string;
  subCategory?: string;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
  category,
  subCategory,
}: SizeSelectorProps) {
  if (sizes.length === 0) return null;

  const activeSize = selectedSize || sizes[0];

  const catStr = (category || '').toLowerCase();
  const subStr = (subCategory || '').toLowerCase();
  const isFashionOrFootwear =
    /fashion|cloth|apparel|shoe|footwear|wear|shirt|pant|dress|t-shirt|kurta|jeans/i.test(catStr) ||
    /fashion|cloth|apparel|shoe|footwear|wear|shirt|pant|dress|t-shirt|kurta|jeans/i.test(subStr);

  const isFootwear = /footwear|shoe/i.test(catStr) || /footwear|shoe/i.test(subStr);
  const isGrocery = /grocery|food|staples|vegetable|fruit/i.test(catStr) || /grocery|food|staples/i.test(subStr);
  const isElectronics = /electronic|mobile|phone|laptop|appliance|gadget|audio|tv/i.test(catStr) || /electronic|mobile|phone|laptop|appliance|gadget/i.test(subStr);

  const labelTitle = isFootwear
    ? 'Shoe Size (UK)'
    : isGrocery
    ? 'Pack Size'
    : isElectronics
    ? 'Storage / Specs'
    : isFashionOrFootwear
    ? 'Size'
    : 'Size / Option';

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-[13px] font-extrabold text-[#192168]">
          {labelTitle}: <span className="font-bold text-surface-500 ml-1">{activeSize}</span>
        </h3>
        {isFashionOrFootwear && (
          <button
            type="button"
            className="text-[11px] font-extrabold text-[#1668F6] flex items-center gap-0.5 hover:underline"
          >
            Size Guide {'>'}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {sizes.map((s) => {
          const isSelected = s === activeSize;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onSelectSize?.(s)}
              className={`h-10 min-w-[3.5rem] px-3.5 rounded-xl font-extrabold text-sm border-2 transition-all ${
                isSelected
                  ? 'border-[#1668F6] text-[#1668F6] bg-blue-50/50 shadow-xs'
                  : 'bg-white border-surface-200 text-surface-600 hover:border-[#192168] hover:text-[#192168]'
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
