import React from 'react';
import {
  ArrowRight,
  MapPin,
  Search,
  ShoppingBag,
  TrendingUp,
  Store,
  Users,
  Tag,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { MARKETING_DATA } from '../../data/marketingData.js';
import { TestimonialCard } from '../../components/marketing/TestimonialCard.js';

interface LocalDiscoveryPageProps {
  onNavigate: (route: string) => void;
  onStartSelling: () => void;
}

export const LocalDiscoveryPage: React.FC<LocalDiscoveryPageProps> = ({
  onNavigate,
  onStartSelling,
}) => {
  return (
    <div className="w-full bg-white select-none">
      {/* 1. Hero Section (Mockups 2.1.png / 4.1.png / 5.1.png) */}
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
            <button
              onClick={() => onNavigate('/how-it-works')}
              className="hover:text-[#0038ed] transition-colors cursor-pointer"
            >
              How it Works
            </button>
            <span>&gt;</span>
            <span className="text-[#0038ed] font-bold">Local Discovery</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0038ed] font-bold text-xs uppercase tracking-wider">
                LOCAL DISCOVERY
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Get Discovered by Customers{' '}
                <span className="text-[#0038ed]">Near You</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-lg">
                {branding.appName} helps nearby customers find your store and products through local
                search, categories and offers — so you get more store visits and more orders.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-7 py-3.5 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Selling</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Map Illustration & Discovery Mockup */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-blue-200/90 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <MapPin className="w-4 h-4 text-[#0038ed]" />
                    <span>Bhilai &bull; 490006 Radius: 2.0 km</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px]">
                    ● Active
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-blue-50/50 rounded-xl flex items-center justify-between border border-blue-100">
                    <div>
                      <div className="font-bold text-slate-900">Trendy Fashion Hub</div>
                      <div className="text-[11px] text-slate-500">0.8 km &bull; ★ 4.8 (230)</div>
                    </div>
                    <span className="text-[11px] font-bold text-[#0038ed]">Open Now</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                    <div>
                      <div className="font-bold text-slate-900">Sri Balaji Garments</div>
                      <div className="text-[11px] text-slate-500">1.2 km &bull; ★ 4.6 (140)</div>
                    </div>
                    <span className="text-[11px] font-bold text-[#0038ed]">Open Now</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                    <div>
                      <div className="font-bold text-slate-900">Style Studio</div>
                      <div className="text-[11px] text-slate-500">1.9 km &bull; ★ 4.5 (95)</div>
                    </div>
                    <span className="text-[11px] font-bold text-[#0038ed]">Open Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 Value Pills */}
      <div className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
            <Search className="w-5 h-5 text-[#0038ed]" />
            <div>
              <div className="text-xs font-bold text-slate-900">Visible in Local Search</div>
              <div className="text-[11px] text-slate-500">Found when buyers search near them.</div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
            <Users className="w-5 h-5 text-[#0038ed]" />
            <div>
              <div className="text-xs font-bold text-slate-900">Reach Nearby Customers</div>
              <div className="text-[11px] text-slate-500">Shoppers within 2-4 km radius.</div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
            <Tag className="w-5 h-5 text-[#0038ed]" />
            <div>
              <div className="text-xs font-bold text-slate-900">Showcase Offers</div>
              <div className="text-[11px] text-slate-500">Highlight deals &amp; seasonal arrivals.</div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
            <Store className="w-5 h-5 text-[#0038ed]" />
            <div>
              <div className="text-xs font-bold text-slate-900">Drive More Store Visits</div>
              <div className="text-[11px] text-slate-500">Footfall + online pickup orders.</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. How Local Discovery Works (4-Step Workflow) */}
      <section className="py-16 sm:py-20 bg-[#f8fbff]">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How Local Discovery Works
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              A simple way for nearby customers to find your store and products on {branding.appName}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] mb-1">01</div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Customers Search Nearby</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Customers search for products or stores in their area.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center mx-auto mb-4">
                <Store className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] mb-1">02</div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Your Store Appears</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your store is shown in local search results with products and distance.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] mb-1">03</div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Customers Explore Store</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                They view your catalog, check offers and review store details.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] mb-1">04</div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">More Visits &amp; Orders</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Customers visit your physical shop or place doorstep delivery orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Where Your Store Appears (4 Placements) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Where Your Store Appears
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Your store can be discovered by customers across multiple sections on {branding.appName}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl border border-slate-200/90 bg-[#f8fbff] space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Local Search Results</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Appear when customers search for specific products or stores near their location.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/90 bg-[#f8fbff] space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Category Pages</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get featured in relevant categories based on the products and collections you sell.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/90 bg-[#f8fbff] space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Nearby Stores Section</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Show your store to shoppers browsing neighborhood businesses near them.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/90 bg-[#f8fbff] space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Offers &amp; Promotions</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Attract more customers with your highlighted deals, coupons and seasonal campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. What Retailers Say (Mockup 5.1.png) */}
      <section className="py-16 sm:py-20 bg-[#f0f6ff] border-t border-blue-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              What Retailers Say
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Real stories and real results with {branding.appName} local discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MARKETING_DATA.testimonials.map((test, i) => (
              <TestimonialCard key={i} testimonial={test} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pre-Footer Banner */}
      <section className="bg-[#0038ed] text-white py-12 select-none">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black">
              Start Your 12-Month Plan Today
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              List your store, add your products and start reaching nearby customers on {branding.appName}.
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
