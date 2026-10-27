import React from 'react';
import { Scissors, Percent, Ticket } from 'lucide-react';

export interface LiveVoucherTicketPreviewProps {
  code: string;
  name?: string;
  description?: string;
  discountType: 'Percentage' | 'Fixed Amount' | 'Free Shipping' | 'percentage' | 'fixed' | 'free_shipping' | 'bogo' | string;
  discountValue?: number;
  maxDiscount?: number;
  minOrderValue?: number;
  className?: string;
}

export const LiveVoucherTicketPreview: React.FC<LiveVoucherTicketPreviewProps> = ({
  code,
  name = 'Special Offer',
  description = 'Get instant savings on your order!',
  discountType = 'Percentage',
  discountValue = 20,
  maxDiscount = 1000,
  minOrderValue = 999,
  className = '',
}) => {
  const normalizedType = discountType.toLowerCase();

  const getDiscountDisplay = () => {
    if (normalizedType.includes('percent')) {
      return `${discountValue || 20}%`;
    }
    if (normalizedType.includes('fixed')) {
      return `₹${(discountValue || 100).toLocaleString('en-IN')}`;
    }
    if (normalizedType.includes('free')) {
      return 'FREE';
    }
    if (normalizedType.includes('bogo')) {
      return 'BOGO';
    }
    return `${discountValue}%`;
  };

  const getDiscountSubtext = () => {
    if (normalizedType.includes('free')) {
      return 'DELIVERY';
    }
    if (normalizedType.includes('bogo')) {
      return 'BUY 1 GET 1';
    }
    return 'OFF';
  };

  return (
    <div
      className={`relative border-2 border-dashed border-blue-300 rounded-2xl p-4 bg-gradient-to-r from-blue-50/90 via-sky-50/40 to-blue-50/70 shadow-2xs overflow-hidden flex items-stretch justify-between transition-all duration-200 select-none ${className}`}
    >
      {/* Background Watermark */}
      <div className="absolute -right-4 -bottom-4 text-blue-200/40 pointer-events-none select-none">
        <Percent className="w-28 h-28 stroke-[1.2]" />
      </div>

      {/* Left Rail: Code, Title, Description, Conditions */}
      <div className="space-y-1.5 min-w-0 pr-3 flex-1 relative z-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-base sm:text-lg font-black text-blue-700 tracking-wider bg-white/80 px-2 py-0.5 rounded-md border border-blue-200/70 shadow-3xs inline-block">
            {code ? code.toUpperCase() : 'COUPONCODE'}
          </span>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-100/60 px-1.5 py-0.5 rounded">
            Live Voucher
          </span>
        </div>

        <p className="text-xs font-bold text-slate-800 line-clamp-1">
          {name || 'Coupon Title'}
        </p>

        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
          {description || 'Special savings applied automatically at checkout on eligible items.'}
        </p>

        <div className="text-[10px] font-semibold text-slate-500 pt-1 flex items-center gap-1.5 flex-wrap">
          {minOrderValue ? (
            <span className="bg-white/70 px-1.5 py-0.5 rounded border border-slate-200/60 text-slate-600">
              Min. order ₹{minOrderValue.toLocaleString('en-IN')}
            </span>
          ) : null}
          {maxDiscount && normalizedType.includes('percent') ? (
            <span className="bg-white/70 px-1.5 py-0.5 rounded border border-slate-200/60 text-slate-600">
              Max. discount ₹{maxDiscount.toLocaleString('en-IN')}
            </span>
          ) : null}
        </div>
      </div>

      {/* Perforated Vertical Divider with Scissors & Circular Cutouts */}
      <div className="relative flex flex-col items-center justify-center px-2.5 shrink-0 z-10">
        {/* Top Perforation Notch */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border border-blue-200 shadow-inner" />

        {/* Dashed Line */}
        <div className="h-full border-l-2 border-dashed border-blue-300 relative flex items-center justify-center">
          <div className="absolute bg-white p-0.5 rounded-full border border-blue-200 text-blue-500 shadow-2xs">
            <Scissors className="w-3 h-3 rotate-90" />
          </div>
        </div>

        {/* Bottom Perforation Notch */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border border-blue-200 shadow-inner" />
      </div>

      {/* Right Rail: Discount Value & Benefit Badge */}
      <div className="pl-3.5 flex flex-col items-center justify-center shrink-0 min-w-[80px] text-center relative z-10">
        <span className="text-2xl sm:text-3xl font-black text-blue-700 leading-none tracking-tight">
          {getDiscountDisplay()}
        </span>
        <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest mt-1 bg-white/70 px-2 py-0.5 rounded-full border border-blue-200/60">
          {getDiscountSubtext()}
        </span>
      </div>
    </div>
  );
};
