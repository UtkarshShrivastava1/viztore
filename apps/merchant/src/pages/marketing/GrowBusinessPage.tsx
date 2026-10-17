import React from 'react';
import {
  ArrowRight,
  TrendingUp,
  Users,
  ShoppingBag,
  Award,
  Store,
  Megaphone,
  Truck,
  Crown,
  Check,
  Tag,
  BarChart3,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';

interface GrowBusinessPageProps {
  onNavigate: (route: string) => void;
  onStartSelling: () => void;
}

export const GrowBusinessPage: React.FC<GrowBusinessPageProps> = ({
  onNavigate,
  onStartSelling,
}) => {
  return (
    <div className="w-full bg-white select-none">
      {/* 1. Hero Section (Mockup 4.0.png) */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f0f6ff] to-white border-b border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#0038ed] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>&gt;</span>
            <span className="text-[#0038ed] font-bold">Grow Business</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Grow Your Retail Business with{' '}
                <span className="text-[#0038ed]">{branding.appName}</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-lg">
                Get more customers, more store visits and more orders. Use {branding.appName}'s
                tools, visibility and delivery to grow your business — online and offline.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-7 py-3.5 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Growing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Hero Visual (Performance Analytics Mockup) */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-blue-200/90 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-800">Store Performance</div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Last 30 Days ▲ +42%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400">Store Views</div>
                    <div className="text-sm font-bold text-slate-900">2,480</div>
                    <div className="text-[9px] text-emerald-600 font-semibold">↑ 58%</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400">Orders</div>
                    <div className="text-sm font-bold text-[#0038ed]">186</div>
                    <div className="text-[9px] text-emerald-600 font-semibold">↑ 42%</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400">New Buyers</div>
                    <div className="text-sm font-bold text-slate-900">122</div>
                    <div className="text-[9px] text-emerald-600 font-semibold">↑ 60%</div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 rounded-xl flex items-center justify-between border border-blue-100 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <ShoppingBag className="w-4 h-4 text-[#0038ed]" />
                    <span>Women's Kurti (3 items)</span>
                  </div>
                  <span className="text-emerald-700 font-bold">Delivered • ₹2,199</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 Growth Value Pills */}
      <div className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
            <Users className="w-5 h-5 text-[#0038ed]" />
            <div>
              <div className="text-xs font-bold text-slate-900">Reach More Customers</div>
              <div className="text-[11px] text-slate-500">Connect with nearby shoppers.</div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#0038ed]" />
            <div>
              <div className="text-xs font-bold text-slate-900">Increase Store Visits</div>
              <div className="text-[11px] text-slate-500">Turn searches into footfall.</div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#0038ed]" />
            <div>
              <div className="text-xs font-bold text-slate-900">Get More Orders</div>
              <div className="text-[11px] text-slate-500">Pickup and fast home delivery.</div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
            <Award className="w-5 h-5 text-[#0038ed]" />
            <div>
              <div className="text-xs font-bold text-slate-900">Build a Stronger Brand</div>
              <div className="text-[11px] text-slate-500">Trusted local commerce identity.</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. How {branding.appName} Helps You Grow (4 Growth Pillars) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How {branding.appName} Helps You Grow
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Powerful tools to bring more customers to your store and increase your sales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 bg-[#f0f6ff] rounded-3xl border border-blue-100 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0038ed] flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Get Discovered Locally</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your products are visible to nearby customers who are actively searching for what
                you sell.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-blue-200/50">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0038ed]" />
                  <span>Appear in local search</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0038ed]" />
                  <span>Showcase your best products</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0038ed]" />
                  <span>Get featured in category listings</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-[#fff5f7] rounded-3xl border border-rose-100 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Attract More Customers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reach new customers through our discovery platform, promotions and seasonal
                offers.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-rose-200/50">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-600" />
                  <span>Appear in trending sections</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-600" />
                  <span>Run offers and discounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-600" />
                  <span>Get more store visits</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-[#f4fbf7] rounded-3xl border border-emerald-100 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Increase Orders with Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accept online orders from nearby customers with fair and transparent delivery
                pricing.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-emerald-200/50">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Easy order management</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Delivery by {branding.appName}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Focus on your business</span>
                </li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 bg-[#fffbf0] rounded-3xl border border-amber-100 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Build a Stronger Brand</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Create a professional store presence and build long-term local customer trust.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-amber-200/50">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>Custom store profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>Beautiful product catalog</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>Customer reviews and ratings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tools to Grow Your Business Faster (4 Tool Previews) */}
      <section className="py-16 sm:py-20 bg-[#f8fbff] border-t border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Tools to Grow Your Business Faster
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Everything you need in one place — from product listing to marketing and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <ShoppingBag className="w-6 h-6 text-[#0038ed] mb-1" />
              <h4 className="text-sm font-bold text-slate-900">Beautiful Product Listings</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add clear images, categories and details to attract more customers.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <Store className="w-6 h-6 text-purple-600 mb-1" />
              <h4 className="text-sm font-bold text-slate-900">Custom Store Profile</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Create a professional store profile with your branding, photos and store details.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <Tag className="w-6 h-6 text-rose-600 mb-1" />
              <h4 className="text-sm font-bold text-slate-900">Run Offers &amp; Promotions</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Attract more customers with special offers, discounts and seasonal promotions.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <BarChart3 className="w-6 h-6 text-emerald-600 mb-1" />
              <h4 className="text-sm font-bold text-slate-900">Track Growth with Analytics</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                See product views, orders, and customer insights to make better decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pre-Footer Banner */}
      <section className="bg-[#0038ed] text-white py-12 select-none">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black">
              Start Your 12-Month Plan Today
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              Get more customers, more orders and grow your business with {branding.appName}.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartSelling}
            className="px-6 py-3 rounded-xl bg-white text-[#0038ed] font-bold text-sm shadow-md hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            Start Selling &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};
