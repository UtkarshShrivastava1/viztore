import React, { useState } from 'react';
import {
  Rocket,
  ArrowLeft,
  CheckCircle2,
  Wallet,
  CreditCard,
  QrCode,
  Shield,
  Star,
  ExternalLink,
  Info,
} from 'lucide-react';
import { AdType, useMarketingStore } from '../../stores/marketingStore.js';

interface SelectedProductType {
  id: string;
  name: string;
  sku: string;
  price: number;
  rating: number;
  reviews: number;
  sizes: string;
  color: string;
  category: string;
  subcategory: string;
  image: string;
  stock: number;
}

interface Step4AdPreviewReviewProps {
  selectedType: AdType;
  selectedProduct: SelectedProductType;
  selectedDuration: '3 Days' | '7 Days' | '15 Days' | '30 Days';
  startDate: string;
  endDate: string;
  onLaunch: () => void;
  onBack: () => void;
}

export const Step4AdPreviewReview: React.FC<Step4AdPreviewReviewProps> = ({
  selectedType,
  selectedProduct,
  selectedDuration,
  startDate,
  endDate,
  onLaunch,
  onBack,
}) => {
  const { walletBalance } = useMarketingStore();

  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'upi' | 'card'>('wallet');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const durationPricing = {
    '3 Days': { price: 499, perDay: 166 },
    '7 Days': { price: 1299, perDay: 185 },
    '15 Days': { price: 2499, perDay: 167 },
    '30 Days': { price: 3999, perDay: 133 },
  };

  const currentPrice = durationPricing[selectedDuration].price;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          4. Review &amp; Launch Campaign
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Review your campaign parameters and complete payment to start promoting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Review Summary & Payment Selection (8 cols) (12.2c.png) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Campaign Details Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">Campaign Details</h3>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {selectedType}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Target Item</span>
                <span className="font-bold text-slate-900 block truncate mt-0.5">
                  {selectedProduct.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {selectedProduct.sku}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Plan Duration</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedDuration}
                </span>
                <span className="text-[10px] text-slate-500">
                  ₹{durationPricing[selectedDuration].perDay}/day
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Run Dates</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {startDate}
                </span>
                <span className="text-[10px] text-slate-500">to {endDate}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector (12.2c.png) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Payment Method</h3>
                <p className="text-[11px] text-slate-500">
                  Choose how you would like to pay for this campaign.
                </p>
              </div>
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="space-y-2.5">
              {/* Pay from Wallet */}
              <div
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'wallet'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Pay from Store Wallet
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Available Balance: ₹{walletBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    Instant Activation
                  </span>
                  <input
                    type="radio"
                    checked={paymentMethod === 'wallet'}
                    readOnly
                    className="text-blue-600"
                  />
                </div>
              </div>

              {/* UPI / QR */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'upi'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      UPI / Instant QR Code
                    </span>
                    <span className="text-[11px] text-slate-500">
                      GPay, PhonePe, Paytm, BHIM UPI
                    </span>
                  </div>
                </div>

                <input
                  type="radio"
                  checked={paymentMethod === 'upi'}
                  readOnly
                  className="text-blue-600"
                />
              </div>

              {/* Card / Net Banking */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Credit / Debit Card / Net Banking
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Visa, Mastercard, RuPay, All major banks
                    </span>
                  </div>
                </div>

                <input
                  type="radio"
                  checked={paymentMethod === 'card'}
                  readOnly
                  className="text-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Ad Card Preview & Cost Breakdown (4 cols) (12.2c.png, 12.4b.png) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Live Ad Card Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Live Ad Preview</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                Storefront View
              </span>
            </div>

            {/* Exact sponsored product card as seen by shoppers */}
            <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50/70 space-y-2 shadow-2xs">
              <div className="relative overflow-hidden rounded-xl bg-white border border-slate-200/70">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-44 object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider shadow-2xs">
                  Sponsored
                </span>
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-white/90 text-slate-800 text-[10px] font-bold shadow-2xs flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{selectedProduct.rating}</span>
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {selectedProduct.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base font-black text-slate-900">
                    ₹{selectedProduct.price}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedProduct.sku}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {selectedProduct.category} • {selectedProduct.color} • Sizes: {selectedProduct.sizes}
                </p>
              </div>
            </div>
          </div>

          {/* Cost Summary Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900">Cost Summary</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Ad Plan ({selectedDuration}):</span>
                <span className="font-semibold text-slate-900">₹{currentPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Convenience Fee:</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total Payable:</span>
                <span className="text-lg font-black text-blue-600">
                  ₹{currentPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Launch Button */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span>I agree to the Advertising Terms &amp; Policies.</span>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            disabled={!agreeTerms}
            onClick={onLaunch}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
          >
            <Rocket className="w-4 h-4" />
            <span>Pay &amp; Launch (₹{currentPrice.toLocaleString()})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
