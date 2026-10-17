import React from 'react';
import {
  ArrowRight,
  Eye,
  Users,
  TrendingUp,
  MapPin,
  Check,
  Search,
  ShoppingCart,
  Store,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';

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
      {/* 1. Hero Section (Mockup 2.1.png) */}
      <section className="pt-6 pb-12 sm:pb-16 bg-gradient-to-b from-[#f5f9ff] via-white to-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#0052ff] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>&gt;</span>
            <button
              onClick={() => onNavigate('/how-it-works')}
              className="hover:text-[#0052ff] transition-colors cursor-pointer"
            >
              How it Works
            </button>
            <span>&gt;</span>
            <span className="text-[#0052ff] font-semibold">Local Discovery</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0052ff] font-bold text-xs uppercase tracking-wider">
                LOCAL DISCOVERY
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0c1427] tracking-tight leading-[1.15]">
                Get Discovered by Nearby Customers on{' '}
                <span className="text-[#0052ff]">{branding.appName}</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                Once your store is live, customers in your area can easily find your products while
                searching on {branding.appName}. Increase your visibility, get more store visits and
                online orders.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-6 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0043d9] text-white font-bold text-sm shadow-sm hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Start Selling</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: High-Fidelity Hero Device Mockup from 2.1.png */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[620px]">
                <img
                  src="/images/local-discovery-hero.png"
                  alt="Customer App Local Discovery & Radar Pins"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Value Pills (Mockup 2.1.png) */}
      <section className="py-6 bg-white border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0c1427]">More Visibility</div>
                <div className="text-xs text-slate-500">
                  Your products are visible to nearby customers searching for what they need.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0c1427]">Bring Local Customers</div>
                <div className="text-xs text-slate-500">
                  Get discovered by people in your area and turn product views into visits.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0c1427]">Increase Sales</div>
                <div className="text-xs text-slate-500">
                  More visibility leads to more customer engagement and repeat orders.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0c1427]">Build a Strong Presence</div>
                <div className="text-xs text-slate-500">
                  Be part of the largest local retail catalog and grow your brand in your city.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How Local Discovery Works (5-Step Sequence) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
              How Local Discovery Works
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Your store products become visible to nearby customers in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <Store className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">01</div>
              <h4 className="text-sm font-bold text-[#0c1427]">List Your Products</h4>
              <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                Add your products with clear images and details.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">02</div>
              <h4 className="text-sm font-bold text-[#0c1427]">Set Your Store Location</h4>
              <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                Your store becomes visible to nearby customers in your area.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <Search className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">03</div>
              <h4 className="text-sm font-bold text-[#0c1427]">Customers Search</h4>
              <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                Shoppers in your area search for products they want on {branding.appName}.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <Eye className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">04</div>
              <h4 className="text-sm font-bold text-[#0c1427]">Your Products Appear</h4>
              <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                Your store and products are shown in nearby search results.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">05</div>
              <h4 className="text-sm font-bold text-[#0c1427]">Get More Orders</h4>
              <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                Customers can view your products, visit your store or place orders for pickup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Appear in Nearby Search Results (Mockup 2.1.png) */}
      <section className="py-16 sm:py-20 bg-[#f8fbff] border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0c1427] tracking-tight leading-tight">
                Appear in Nearby Search Results
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                When customers in your area search for products on {branding.appName}, your store
                and products are shown based on location, category and relevance.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    Showcase your products with clear images and prices
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    Appear in local search results for relevant categories
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    Attract nearby customers looking for what you sell
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    Increase product views, store visits and orders
                  </span>
                </div>
              </div>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-6 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0043d9] text-white font-bold text-sm shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Listing Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-[500px]">
                <img
                  src="/images/local-discovery-search.png"
                  alt="Nearby Search Results & Customer Location Map"
                  className="w-full h-auto object-contain rounded-2xl shadow-xl border border-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Drive More Store Visits & Orders (Mockup 2.1.png) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
              Drive More Store Visits &amp; Orders
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Local discovery helps you reach the right customers at the right time — people who are
              nearby and actively looking for products like yours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center mb-3">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0c1427]">Nearby Customer Reach</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                  Get in front of customers in your city who are ready to buy.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0c1427]">Online Orders &amp; Pickups</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                  Receive orders for pickup or local delivery from nearby customers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0c1427]">Grow Your Local Business</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                  Build a strong presence in your area and increase repeat customers.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-[340px] rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 bg-white">
                <img
                  src="/images/local-discovery-shopkeeper.png"
                  alt="Shopkeeper in Clothing Boutique with New Order Alert"
                  className="w-full h-auto object-contain block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pre-Footer Banner (Mockup 2.1.png) */}
      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0052ff] to-[#0038ed] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                READY TO GET DISCOVERED?
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">List Your Products Today</h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                Make your store visible to nearby customers and start receiving orders on{' '}
                {branding.appName}.
              </p>
            </div>
            <button
              type="button"
              onClick={onStartSelling}
              className="px-6 py-3.5 rounded-xl bg-white text-[#0052ff] hover:bg-slate-50 font-bold text-sm shadow-md transition-all cursor-pointer shrink-0"
            >
              Start Selling &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
