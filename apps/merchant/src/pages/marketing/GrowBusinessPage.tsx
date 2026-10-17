import React from 'react';
import {
  ArrowRight,
  TrendingUp,
  Users,
  ShoppingCart,
  Star,
  Store,
  Megaphone,
  Crown,
  Check,
  MapPin,
  Crosshair,
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
      <section className="py-12 sm:py-16 bg-[#f8fbff] border-b border-slate-100 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#0052ff] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>&gt;</span>
            <span className="text-[#0052ff] font-bold">Grow Business</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0c1427] tracking-tight leading-tight">
                Grow Your Retail Business with{' '}
                <span className="text-[#0052ff]">{branding.appName}</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-lg">
                Get more customers, more store visits and more orders. Use {branding.appName}'s
                tools, visibility and delivery to grow your business — online and offline.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-7 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0043d9] text-white font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Start Growing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Hero Visual (Authentic Mockup from 4.0.png) */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full max-w-[620px]">
                <img
                  src="/images/grow-business-hero.png"
                  alt="Store Performance Analytics and Online Storefront"
                  className="w-full h-auto object-contain drop-shadow-xl rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 Growth Value Pills matching 4.0.png */}
      <div className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0c1427]">Reach More Customers</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0c1427]">Increase Store Visits</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0c1427]">Get More Orders</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0c1427]">Build a Stronger Brand</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. How {branding.appName} Helps You Grow (4 Pillars from 4.0.png) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
              How {branding.appName} Helps You Grow
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Powerful tools to bring more customers to your store and increase your sales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0052ff] flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0c1427]">Get Discovered Locally</h3>
              <p className="text-xs text-slate-500 leading-relaxed min-h-[48px]">
                Your products are visible to nearby customers who are actively searching for what
                you sell.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Appear in local search</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Showcase your best products</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Get featured in category listings</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0c1427]">Attract More Customers</h3>
              <p className="text-xs text-slate-500 leading-relaxed min-h-[48px]">
                Reach new customers through our discovery platform, promotions and offers.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Appear in trending sections</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Run offers and discounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Get more store visits</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0c1427]">Increase Orders with Delivery</h3>
              <p className="text-xs text-slate-500 leading-relaxed min-h-[48px]">
                Accept online orders from nearby customers with fair and transparent delivery
                pricing.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Easy order management</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Delivery by {branding.appName}</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Focus on your business</span>
                </li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0c1427]">Build a Stronger Brand</h3>
              <p className="text-xs text-slate-500 leading-relaxed min-h-[48px]">
                Create a professional store presence and build long-term customer trust.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Custom store profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Beautiful product catalog</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Customer reviews and ratings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Reach the Right Customers in Your Area (Mockup 4.0.png) */}
      <section className="py-16 sm:py-20 bg-[#f8fbff] border-y border-slate-100 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left side: Heading, copy, bullets, button */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0c1427] tracking-tight leading-tight">
                Reach the Right Customers in Your Area
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                Customers near your store can easily find your products on {branding.appName} based
                on location, category and relevance.
              </p>

              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100/70 text-[#0052ff] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    Show in nearby search results
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100/70 text-[#0052ff] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    Attract customers who are ready to buy
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100/70 text-[#0052ff] flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    Get featured in trending categories
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100/70 text-[#0052ff] flex items-center justify-center shrink-0">
                    <Crosshair className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    Turn online visibility into store visits and orders
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/grow-business/localdiscovery')}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-blue-50 border border-[#0052ff] text-[#0052ff] font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Learn About Local Discovery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right side: Panoramic graphic matching 4.0.png */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[560px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/60 bg-white">
                <img
                  src="/images/grow-business-radar.png"
                  alt="Customer discovery radar and local shopper"
                  className="w-full h-auto object-cover block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Tools to Grow Your Business Faster (Mockup 4.0.png) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
              Tools to Grow Your Business Faster
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Everything you need in one place — from product listing to marketing and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tool 1 */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="w-full bg-[#f8fbff] border-b border-slate-100 flex items-center justify-center p-3">
                <img
                  src="/images/grow-tool-product.png"
                  alt="Beautiful Product Listings preview"
                  className="w-full h-[150px] object-contain rounded-xl"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Beautiful Product Listings</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                    Add clear images, categories and details to attract more customers.
                  </p>
                </div>
              </div>
            </div>

            {/* Tool 2 */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="w-full bg-[#f8fbff] border-b border-slate-100 flex items-center justify-center p-3">
                <img
                  src="/images/grow-tool-profile.png"
                  alt="Custom Store Profile preview"
                  className="w-full h-[150px] object-contain rounded-xl"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Custom Store Profile</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                    Create a professional store profile with your branding, photos and store details.
                  </p>
                </div>
              </div>
            </div>

            {/* Tool 3 */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="w-full bg-[#f8fbff] border-b border-slate-100 flex items-center justify-center p-3">
                <img
                  src="/images/grow-tool-offers.png"
                  alt="Run Offers & Promotions preview"
                  className="w-full h-[150px] object-contain rounded-xl"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Run Offers &amp; Promotions</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                    Attract more customers with special offers, discounts and seasonal promotions.
                  </p>
                </div>
              </div>
            </div>

            {/* Tool 4 */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="w-full bg-[#f8fbff] border-b border-slate-100 flex items-center justify-center p-3">
                <img
                  src="/images/grow-tool-analytics.png"
                  alt="Track Growth with Analytics preview"
                  className="w-full h-[150px] object-contain rounded-xl"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Track Growth with Analytics</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                    See product views, orders, customer insights and more to make better business decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pre-Footer Banner matching 4.0.png */}
      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0052ff] to-[#0038ed] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="space-y-2 text-center md:text-left z-10">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                READY TO GROW?
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">
                Start Your 12-Month Plan Today
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                Get more customers, more orders and grow your business with {branding.appName}.
              </p>
            </div>

            <button
              type="button"
              onClick={onStartSelling}
              className="px-6 py-3.5 rounded-xl bg-white text-[#0052ff] hover:bg-slate-50 font-bold text-sm shadow-md transition-all cursor-pointer shrink-0 z-10"
            >
              Start Selling &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
