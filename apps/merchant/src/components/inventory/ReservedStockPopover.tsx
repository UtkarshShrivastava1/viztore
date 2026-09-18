import React, { useState, useRef, useEffect } from 'react';
import { Info, ExternalLink } from 'lucide-react';

interface ReservedStockPopoverProps {
  count?: number;
  showIconOnly?: boolean;
}

export const ReservedStockPopover: React.FC<ReservedStockPopoverProps> = ({
  count,
  showIconOnly = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (showIconOnly) {
    return (
      <div className="relative inline-flex items-center" ref={popoverRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
          title="What is reserved stock?"
        >
          <Info className="w-3 h-3" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-slate-900 text-white rounded-xl p-3 shadow-xl z-50 text-left text-xs space-y-1.5 border border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Reserved Stock</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Stock held for pending customer orders, payment verifications, or scheduled pickups. Not available for new orders.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center" ref={popoverRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`font-medium text-xs tabular-nums cursor-pointer transition-colors ${
          (count ?? 0) > 0
            ? 'text-slate-800 hover:text-blue-600 underline decoration-dotted decoration-slate-300 hover:decoration-blue-500 underline-offset-4'
            : 'text-slate-400'
        }`}
        title="Click to view order reservations"
      >
        {count ?? 0}
      </button>

      {isOpen && (count ?? 0) > 0 && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white rounded-xl p-3 shadow-xl z-50 text-left text-xs space-y-2 border border-slate-700 animate-in fade-in zoom-in-95 duration-150">
          <div className="font-bold text-white flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Reserved Stock</span>
            </div>
            <span className="text-[11px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full">
              {count} units
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Units allocated to active buyer checkouts and confirmed orders pending dispatch:
          </p>

          <div className="bg-slate-800/80 rounded-lg p-2 space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center text-slate-300">
              <span>Order #ORD-4567</span>
              <span className="font-semibold text-white">5 units</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Order #ORD-4589</span>
              <span className="font-semibold text-white">{(count ?? 0) - 5 > 0 ? (count ?? 0) - 5 : count} units</span>
            </div>
          </div>

          <div className="pt-1 border-t border-slate-800 flex justify-between items-center">
            <span className="text-[10px] text-slate-400">Order Allocation</span>
            <button
              type="button"
              onClick={() => alert('Navigate to Orders tab to view allocated order reserves.')}
              className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              <span>View Orders</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
