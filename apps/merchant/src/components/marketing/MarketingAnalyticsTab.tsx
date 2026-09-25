import React from 'react';
import { BarChart3, TrendingUp, IndianRupee, Users, ShoppingCart, ArrowUpRight } from 'lucide-react';

export const MarketingAnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Marketing ROI & Funnel Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Detailed metrics on promotional spend, conversion efficiency, and customer acquisition costs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Ad Spend</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹ 6,250.00</div>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> 8.4x Return on Ad Spend (ROAS)
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Customer Acq. Cost (CAC)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹ 14.80</div>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> -12% vs last month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">New Customer Orders</span>
          <div className="text-2xl font-black text-slate-900 mt-1">422</div>
          <span className="text-[11px] text-slate-500 mt-1 block">33.9% of total redemptions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Net Generated Revenue</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹ 48,750.00</div>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +22% vs last 30 days
          </span>
        </div>
      </div>

      {/* Funnel Visualisation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Campaign Conversion Funnel</h3>
        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
              <span>1. Banner Impressions / Push Reach</span>
              <span>18,450 (100%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
              <span>2. Product / Offer Clicks</span>
              <span>4,620 (25.0%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
              <span>3. Added to Cart with Promo</span>
              <span>2,180 (11.8%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: '11.8%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
              <span>4. Completed Checkout & Redeemed</span>
              <span>1,245 (6.75%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '6.75%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
