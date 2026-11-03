import React from 'react';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelectSize }: SizeSelectorProps) {
  if (sizes.length === 0) return null;

  const activeSize = selectedSize || sizes[0];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-[13px] font-extrabold text-[#192168]">
          Size / Specs: <span className="font-bold text-surface-500 ml-1">{activeSize}</span>
        </h3>
        <button type="button" className="text-[11px] font-extrabold text-[#1668F6] flex items-center gap-0.5 hover:underline">
          Size Guide {'>'}
        </button>
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
