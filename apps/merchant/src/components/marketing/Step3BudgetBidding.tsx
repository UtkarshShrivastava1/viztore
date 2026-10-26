import React, { useState } from 'react';
import {
  Calendar,
  Wallet,
  ArrowRight,
  ArrowLeft,
  Check,
  TrendingUp,
  Zap,
  Sliders,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useMarketingStore } from '../../stores/marketingStore.js';

interface Step3BudgetBiddingProps {
  selectedDuration: '3 Days' | '7 Days' | '15 Days' | '30 Days';
  onSelectDuration: (duration: '3 Days' | '7 Days' | '15 Days' | '30 Days') => void;
  startDate: string;
  endDate: string;
  onSetDates: (start: string, end: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3BudgetBidding: React.FC<Step3BudgetBiddingProps> = ({
  selectedDuration,
  onSelectDuration,
  startDate,
  endDate,
  onSetDates,
  onNext,
  onBack,
}) => {
  const { walletBalance } = useMarketingStore();

  const [biddingMode, setBiddingMode] = useState<'auto' | 'manual'>('auto');
  const [cpcBid, setCpcBid] = useState<number>(12.5);

  const durationPricing: Record<
    '3 Days' | '7 Days' | '15 Days' | '30 Days',
    { price: number; perDay: number; reach: string; popular?: boolean }
  > = {
    '3 Days': { price: 499, perDay: 166, reach: '4,000 – 7,500' },
    '7 Days': { price: 1299, perDay: 185, reach: '12,000 – 22,000', popular: true },
    '15 Days': { price: 2499, perDay: 167, reach: '28,000 – 45,000' },
    '30 Days': { price: 3999, perDay: 133, reach: '65,000 – 110,000' },
  };

  const currentPrice = durationPricing[selectedDuration].price;
  const currentReach = durationPricing[selectedDuration].reach;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          3. Budget, Bidding &amp; Campaign Duration
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Select how long you want to run your campaign and configure your bidding strategy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Duration Options & Bidding (8 cols) (12.2b.png) */}
        <div className="lg:col-span-8 space-y-5">
          {/* 4 Duration Cards */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Select Campaign Duration</h3>
              <span className="text-[11px] font-semibold text-slate-500">
                Cancel or modify anytime
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(durationPricing) as Array<keyof typeof durationPricing>).map((key) => {
                const item = durationPricing[key];
                const isSelected = selectedDuration === key;
                return (
                  <div
                    key={key}
                    onClick={() => onSelectDuration(key)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-1 ring-blue-600'
                        : 'border-slate-200/90 bg-white hover:border-slate-300'
                    }`}
                  >
                    {item.popular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider shadow-2xs">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{key}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="mt-2.5">
                        <span className="text-lg font-black text-slate-900">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          ₹{item.perDay}/day
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                      <span>{item.reach} reach</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Automatic vs Manual CPC Bidding */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Bidding Strategy</h3>
                <p className="text-[11px] text-slate-500">
                  Control your cost per click (CPC) and auction placement.
                </p>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Smart Algorithm
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setBiddingMode('auto')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  biddingMode === 'auto'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span>Automatic Bidding (Recommended)</span>
                  </span>
                  <input type="radio" checked={biddingMode === 'auto'} readOnly className="text-blue-600" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Our algorithm automatically adjusts your bids in real time to capture maximum high-intent clicks within your budget.
                </p>
              </div>

              <div
                onClick={() => setBiddingMode('manual')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  biddingMode === 'manual'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    <span>Manual CPC Cap</span>
                  </span>
                  <input type="radio" checked={biddingMode === 'manual'} readOnly className="text-blue-600" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Set a hard maximum cost per click limit. Recommended for advanced advertisers.
                </p>
              </div>
            </div>

            {biddingMode === 'manual' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Maximum CPC Bid (₹)</label>
                  <span className="text-xs font-black text-blue-600">₹{cpcBid.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="0.5"
                  value={cpcBid}
                  onChange={(e) => setCpcBid(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">
                  Recommended benchmark bid for this category: ₹10.50 – ₹15.00
                </span>
              </div>
            )}
          </div>

          {/* Schedule Dates */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Schedule Run Dates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onSetDates(e.target.value, endDate)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => onSetDates(startDate, e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Estimated Reach & Wallet Check (4 cols) (12.2b.png) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Estimated Reach Meter */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Estimated Reach Meter</span>
            </h3>

            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-xl border border-blue-200 text-center space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold block">Target Impressions</span>
              <span className="text-xl sm:text-2xl font-black text-blue-700 block">
                {currentReach}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block">
                Based on historical store category traffic
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Selected Plan:</span>
                <span className="font-bold text-slate-900">{selectedDuration}</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Budget:</span>
                <span className="font-bold text-slate-900">
                  ₹{durationPricing[selectedDuration].perDay}/day
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Clicks:</span>
                <span className="font-bold text-indigo-600">
                  {Math.round(currentPrice * 0.42)} – {Math.round(currentPrice * 0.75)}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Balance Verification */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-blue-600" />
                <span>Wallet Balance</span>
              </h3>
              <span className="text-xs font-black text-slate-900">
                ₹{walletBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Sufficient funds available in wallet to activate this {selectedDuration} campaign (₹{currentPrice.toLocaleString()}).
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
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
          onClick={onNext}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
        >
          <span>Continue to Preview &amp; Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
