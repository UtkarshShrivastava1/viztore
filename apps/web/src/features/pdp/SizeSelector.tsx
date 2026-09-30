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
          Select Size
        </h3>
        <button className="text-[11px] font-semibold text-[#1668F6] flex items-center gap-1">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <path d="M7 6v4"></path>
            <path d="M11 6v4"></path>
            <path d="M15 6v4"></path>
          </svg>
          Size Chart
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s, idx) => (
          <button
            key={s}
            className={`h-10 min-w-[3.5rem] px-3 rounded-lg font-semibold text-sm border transition-colors ${
              idx === 1 // Assuming M is the second element like in screenshot
                ? 'border-[#1668F6] bg-[#1668F6] text-white'
                : 'bg-white border-surface-200 text-surface-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
