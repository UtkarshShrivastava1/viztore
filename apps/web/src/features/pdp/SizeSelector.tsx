'use client';

import React from 'react';
import { usePdpStore } from '@/stores/pdp.store';

interface SizeSelectorProps {
  sizes: string[];
  colors?: string[];
  outOfStockSizes?: string[];
}

export function SizeSelector({
  sizes,
  colors = [],
  outOfStockSizes = [],
}: SizeSelectorProps) {
  const { selectedSize, setSelectedSize, selectedColor, setSelectedColor } = usePdpStore();

  const activeSize = selectedSize || sizes[0] || null;
  const activeColor = selectedColor || colors[0] || null;

  return (
    <div className="space-y-4">
      {/* Color Swatches if available */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-extrabold text-[#061842]">
              Select Color: <span className="font-semibold text-surface-500 capitalize">{activeColor || 'Default'}</span>
            </h3>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {colors.map((color) => {
              const isSelected = activeColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`relative w-8 h-8 rounded-full border border-surface-300 transition-all p-0.5 ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-[#1668F6] scale-105'
                      : 'hover:scale-105'
                  }`}
                  aria-label={`Select color ${color}`}
                >
                  <span
                    className="block w-full h-full rounded-full shadow-inner"
                    style={{ backgroundColor: color }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Pills */}
      {sizes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-extrabold text-[#061842]">
              Select Size: <span className="font-semibold text-surface-500">{activeSize || 'Choose Size'}</span>
            </h3>
            <button
              type="button"
              className="text-xs font-bold text-[#1668F6] hover:underline"
            >
              Size Guide 📏
            </button>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {sizes.map((s) => {
              const isOutOfStock = outOfStockSizes.includes(s);
              const isSelected = activeSize === s;

              return (
                <button
                  key={s}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => !isOutOfStock && setSelectedSize(s)}
                  className={`relative h-11 min-w-[3rem] px-3.5 rounded-xl font-extrabold text-xs sm:text-sm border-2 transition-all flex items-center justify-center overflow-hidden ${
                    isOutOfStock
                      ? 'border-surface-200 bg-surface-100/60 text-surface-400 cursor-not-allowed select-none'
                      : isSelected
                      ? 'border-[#1668F6] text-[#1668F6] bg-blue-50/60 shadow-xs'
                      : 'border-surface-200 bg-white text-[#061842] hover:border-surface-400 active:scale-95'
                  }`}
                >
                  <span>{s}</span>

                  {/* Diagonal slash for out-of-stock items */}
                  {isOutOfStock && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none before:absolute before:inset-0 before:border-t-2 before:border-rose-400 before:top-1/2 before:-rotate-45"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
