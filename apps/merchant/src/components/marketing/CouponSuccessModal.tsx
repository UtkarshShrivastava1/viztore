import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Share2, Sparkles, X, MessageCircle } from 'lucide-react';
import { LiveVoucherTicketPreview } from './LiveVoucherTicketPreview.js';
import { CouponItem } from '../../stores/marketingStore.js';

interface CouponSuccessModalProps {
  coupon: Partial<CouponItem>;
  isOpen: boolean;
  onClose: () => void;
}

export const CouponSuccessModal: React.FC<CouponSuccessModalProps> = ({
  coupon,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎉 Special Offer! Use coupon code *${coupon.code}* to get ${coupon.benefit || 'special discount'} on your next order! Shop now!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-[11px] font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Activation</span>
          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Coupon Created Successfully!
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Your promotional coupon code is now live. Share it with your customers to drive more sales.
          </p>
        </div>

        {/* Live Ticket Card */}
        <div className="mt-5">
          <LiveVoucherTicketPreview
            code={coupon.code || 'COUPON'}
            name={coupon.name || coupon.title || 'Special Promotion'}
            description={coupon.description || 'Valid on upcoming purchases.'}
            discountType={coupon.type || coupon.discountType || 'Percentage'}
            discountValue={coupon.discountValue || 20}
            maxDiscount={coupon.maxDiscount || 1000}
            minOrderValue={coupon.minOrderValue || 999}
          />
        </div>

        {/* Quick Action Rail */}
        <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Coupon Code
            </span>
            <span className="font-mono text-base font-black text-slate-900 tracking-wider">
              {coupon.code}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Button Options */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share to WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Coupons Table</span>
          </button>
        </div>
      </div>
    </div>
  );
};
