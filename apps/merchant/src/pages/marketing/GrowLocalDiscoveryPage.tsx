import React from 'react';
import {
  ArrowRight,
  MapPin,
  Users,
  Star,
  Store,
  Search,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';

interface GrowLocalDiscoveryPageProps {
  onNavigate: (route: string) => void;
  onStartSelling: () => void;
}

export const GrowLocalDiscoveryPage: React.FC<GrowLocalDiscoveryPageProps> = ({
  onNavigate,
  onStartSelling,
}) => {
  return (
    <div className="w-full bg-white select-none">
      {/* 1. Hero Section (Mockup 4.1.png) */}
      <section className="py-12 sm:py-16 bg-[#f8fbff] border-b border-slate-100 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#0052ff] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>&gt;</span>
            <button
              onClick={() => onNavigate('/grow-business')}
              className="hover:text-[#0052ff] transition-colors cursor-pointer"
            >
              Grow Business
            </button>
            <span>&gt;</span>
            <span className="text-[#0052ff] font-bold">Local Discovery</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block text-[#0052ff] font-black text-xs uppercase tracking-wider">
                LOCAL DISCOVERY
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0c1427] tracking-tight leading-tight">
                Get Discovered by Customers{' '}
                <span className="text-[#0052ff]">Near You</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-lg">
                {branding.appName} helps nearby customers find your store and products through local search, categories and offers — so you get more store visits and more orders.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-7 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0043d9] text-white font-bold text-sm shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Start Selling</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Hero Graphic from 4.1.png */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[560px]">
                <img
                  src="/images/grow-discovery-hero.png"
                  alt="Customer App Map Search and Store Pins"
                  className="w-full h-auto object-contain rounded-2xl drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 Value Pills (Mockup 4.1.png) */}
      <div className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0c1427]">Visible in local search</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0c1427]">Reach nearby customers</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0c1427]">Showcase offers and new arrivals</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0c1427]">Drive more store visits &amp; orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. How Local Discovery Works (4-Step Sequence from 4.1.png) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
              How Local Discovery Works
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              A simple way for nearby customers to find your store and products on {branding.appName}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <Search className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">01</div>
              <h4 className="text-sm font-bold text-[#0c1427]">Customers Search Nearby</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[220px]">
                Customers search for products or stores in their area on {branding.appName}.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <Store className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">02</div>
              <h4 className="text-sm font-bold text-[#0c1427]">Your Store Appears</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[220px]">
                Your store is shown in local search results with products, rating and distance.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">03</div>
              <h4 className="text-sm font-bold text-[#0c1427]">Customers Explore Your Store</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[220px]">
                They view your catalog, check offers and see store details.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">04</div>
              <h4 className="text-sm font-bold text-[#0c1427]">More Store Visits and Orders</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[220px]">
                Customers visit your store or place orders for pickup or delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Where Your Store Appears (4 Cards from 4.1.png) */}
      <section className="py-16 sm:py-20 bg-[#f8fbff] border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
              Where Your Store Appears
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Your store can be discovered by customers across multiple sections on {branding.appName}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="w-full bg-[#f8fbff] border-b border-slate-100 flex items-center justify-center p-3">
                <img
                  src="/images/where-search.png"
                  alt="Local Search Results preview"
                  className="w-full h-[180px] object-contain rounded-xl"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Local Search Results</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                    Appear when customers search for products or stores near their location.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="w-full bg-[#f8fbff] border-b border-slate-100 flex items-center justify-center p-3">
                <img
                  src="/images/where-category.png"
                  alt="Category Pages preview"
                  className="w-full h-[180px] object-contain rounded-xl"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Category Pages</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                    Get featured in relevant categories based on the products you sell.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="w-full bg-[#f8fbff] border-b border-slate-100 flex items-center justify-center p-3">
                <img
                  src="/images/where-nearby.png"
                  alt="Nearby Stores Section preview"
                  className="w-full h-[180px] object-contain rounded-xl"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Nearby Stores Section</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                    Show your store to customers browsing stores near them.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="w-full bg-[#f8fbff] border-b border-slate-100 flex items-center justify-center p-3">
                <img
                  src="/images/where-offers.png"
                  alt="Offers & Promotions preview"
                  className="w-full h-[180px] object-contain rounded-xl"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Offers &amp; Promotions</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                    Attract more customers with your offers and seasonal promotions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Benefits for Your Business (4 Cards from 4.1.png) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
              Benefits for Your Business
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Local discovery helps you reach the right customers at the right time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0c1427]">More Visibility</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your store and products appear in local search results and category listings.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0c1427]">Targeted Customers</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Reach customers who are already nearby and ready to buy.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0c1427]">Higher Store Visits and Orders</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get more footfall to your store and more online orders.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0052ff] flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0c1427]">Build Long-term Growth</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Increase brand awareness and build a loyal customer base in your area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pre-Footer Banner matching 4.1.png */}
      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0052ff] to-[#0038ed] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="space-y-2 text-center md:text-left z-10">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                READY TO GET DISCOVERED?
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">
                Start Your 12-Month Plan Today
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                List your store, add your products and start reaching nearby customers on {branding.appName}.
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
