import React from 'react';

interface SizeSelectorProps {
  sizes: string[];
}

export function SizeSelector({ sizes }: SizeSelectorProps) {
  if (sizes.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-[13px] font-extrabold text-[#192168]">
          Size: <span className="font-bold text-surface-500 ml-1">{sizes[0]}</span>
        </h3>
        <button className="text-[11px] font-extrabold text-[#1668F6] flex items-center gap-0.5">
          Size Chart {'>'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {sizes.map((s, idx) => (
          <button
            key={s}
            className={`h-10 min-w-[3rem] px-3 rounded-xl font-extrabold text-sm border-2 transition-colors ${
              idx === 0
                ? 'border-[#1668F6] text-[#1668F6] bg-blue-50/50'
                : 'bg-white border-surface-200 text-surface-600 hover:border-[#192168] hover:text-[#192168]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
