import React from 'react';
import {
  ArrowRight,
  Play,
  ShoppingBag,
  Store,
  Package,
  Truck,
  Layers,
  FileText,
  BarChart3,
  MapPin,
  Users,
  Smartphone,
  Headphones,
  GraduationCap,
  Sparkles,
  Shirt,
  Footprints,
  Gem,
  Armchair,
  Gift,
  Trophy,
  Check,
  Tag,
  Zap,
  BadgePercent,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { MARKETING_DATA } from '../../data/marketingData.js';
import { useVideoModal } from '../../components/marketing/MerchantPublicLayout.js';

interface MerchantHomePageProps {
  onNavigate: (route: string) => void;
  onStartSelling: () => void;
}

export const MerchantHomePage: React.FC<MerchantHomePageProps> = ({
  onNavigate,
  onStartSelling,
}) => {
  const { openVideoModal } = useVideoModal();

  const handleWatchVideo = () => {
    openVideoModal({
      id: 'intro-video',
      title: `Take Your Local Store Online with ${branding.appName}`,
      duration: '2:45',
      category: 'Overview',
      description: 'See how local retailers digitize their shops and start receiving neighborhood delivery orders.',
    });
  };

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Hero Section (Mockup 1.0.png) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f6ff] via-[#f7faff] to-white pt-10 sm:pt-16 pb-16 lg:pb-24 border-b border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Hero Copy & Actions */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0038ed] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#0038ed] animate-pulse" />
                <span>FOR LOCAL RETAILERS</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-black text-slate-900 tracking-tight leading-[1.12]">
                Take Your Local Store Online with{' '}
                <span className="text-[#0038ed]">{branding.appName}</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Create your online store, list your products, receive local orders, manage fulfillment
                and get discovered by nearby customers.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-7 py-3.5 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-sm sm:text-base shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Start Selling</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleWatchVideo}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0038ed] flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-[#0038ed] ml-0.5" />
                  </div>
                  <span>See How It Works</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Graphic Preview (Mockup Devices) */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-xl aspect-[4/3] bg-gradient-to-br from-blue-500/10 via-slate-100 to-indigo-500/10 rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xl flex items-center justify-center overflow-hidden">
                {/* Laptop Mockup Box */}
                <div className="w-[85%] bg-slate-900 rounded-xl p-2 shadow-2xl border border-slate-700 -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-slate-100 rounded-lg p-3 text-[11px] text-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-[#0038ed]">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{branding.appName} Merchant Hub</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        ● Store Active
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <div className="text-[9px] text-slate-400">Products</div>
                        <div className="text-xs font-bold text-slate-900">1,248</div>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <div className="text-[9px] text-slate-400">Orders Today</div>
                        <div className="text-xs font-bold text-[#0038ed]">28</div>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <div className="text-[9px] text-slate-400">Revenue</div>
                        <div className="text-xs font-bold text-slate-900">₹46,580</div>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <div className="text-[9px] text-slate-400">Rating</div>
                        <div className="text-xs font-bold text-amber-500">4.8 ★</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-6 bg-white rounded border border-slate-200 flex items-center justify-between px-2 text-[10px]">
                        <span>Handloom Cotton Kurta</span>
                        <span className="font-bold text-slate-900">₹899</span>
                      </div>
                      <div className="h-6 bg-white rounded border border-slate-200 flex items-center justify-between px-2 text-[10px]">
                        <span>Chanderi Silk Dupatta</span>
                        <span className="font-bold text-slate-900">₹499</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlaid Phone Mockup */}
                <div className="absolute right-2 -bottom-2 w-44 bg-slate-950 rounded-2xl p-1.5 shadow-2xl border border-slate-800 rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-white rounded-xl p-2.5 text-[10px] space-y-1.5">
                    <div className="flex items-center gap-1 font-bold text-slate-900 text-[11px] pb-1 border-b border-slate-100">
                      <MapPin className="w-3 h-3 text-[#0038ed]" />
                      <span>Stores Near You</span>
                    </div>
                    <div className="p-1.5 bg-blue-50/70 rounded border border-blue-100">
                      <div className="font-bold text-slate-900 text-[10px]">Bhilai Handloom</div>
                      <div className="text-[8px] text-slate-500">1.2 km • Open Now</div>
                      <div className="mt-1 font-bold text-[#0038ed] text-[9px]">Kurta • ₹899</div>
                    </div>
                    <div className="w-full py-1 bg-[#0038ed] text-white text-[9px] font-bold text-center rounded">
                      Order for Pickup
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Value Pills Bar (Mockup 1.0.png) */}
      <section className="py-6 sm:py-8 bg-white border-b border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MARKETING_DATA.heroValuePills.map((pill, i) => {
              const Icon =
                pill.icon === 'BadgePercent'
                  ? BadgePercent
                  : pill.icon === 'MapPin'
                  ? MapPin
                  : pill.icon === 'Zap'
                  ? Zap
                  : Truck;

              return (
                <div
                  key={i}
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#f8fbff] border border-blue-100/80 hover:border-blue-200 transition-colors"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${pill.badgeColor}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {pill.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight">
                      {pill.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Why Sell on {branding.appName}? Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Sell on {branding.appName}?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              All the tools you need to run and grow your retail business, designed specifically for
              local stores.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 4 Feature Cards (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Card 1: Local Customer Discovery */}
              <div className="p-6 rounded-3xl bg-[#f4fbf7] border border-emerald-100/90 space-y-3 hover:shadow-xs transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Local Customer Discovery</h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Get discovered by nearby customers who are actively looking for products in your
                  area.
                </p>
              </div>

              {/* Card 2: Your Digital Store */}
              <div className="p-6 rounded-3xl bg-[#f0f6ff] border border-blue-100/90 space-y-3 hover:shadow-xs transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0038ed] flex items-center justify-center">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Your Digital Store</h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Create a professional online store with your brand, products, images and store
                  details.
                </p>
              </div>

              {/* Card 3: Easy Product Listing */}
              <div className="p-6 rounded-3xl bg-[#fff5f5] border border-rose-100/90 space-y-3 hover:shadow-xs transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Easy Product Listing</h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Add products with images, prices, categories, sizes and variants in minutes.
                </p>
              </div>

              {/* Card 4: Orders & Delivery */}
              <div className="p-6 rounded-3xl bg-[#fff9ee] border border-amber-100/90 space-y-3 hover:shadow-xs transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Orders &amp; Delivery</h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Receive orders, manage fulfillment and offer pickup or local delivery to
                  customers.
                </p>
              </div>
            </div>

            {/* Right Card: Smiling Retailer with Order Toast (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950 p-6 sm:p-8 text-white shadow-xl min-h-[380px] flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                    Retailer Success Story
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    "We increased daily store footfall and home delivery by 40%."
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Local retailers in Bhilai, Durg, and Raipur are managing inventory and delivery
                    orders directly from their smartphones.
                  </p>
                </div>

                {/* Floating "New Order" Notification Card */}
                <div className="mt-6 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl border border-slate-200/90 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">New Order Received!</div>
                      <div className="text-[11px] text-slate-500">Men's Shirt (M) • Pickup Order</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('/sell-online/ordersdelivery')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0038ed] text-white text-xs font-bold hover:bg-[#002fcf] transition-colors cursor-pointer shrink-0"
                  >
                    View Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Everything You Need to Start Selling (6-Feature Grid) */}
      <section className="py-16 sm:py-20 bg-[#f8fbff] border-y border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Start Selling
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Powerful features to manage your store, products, orders and customers — all in one
              place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:border-[#0038ed]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center mb-4">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Create Your Store</h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Set up your store profile, logo, cover image, description, contact details and more.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:border-[#0038ed]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Add Products</h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Upload product images, add details, set categories, variants, and competitive
                pricing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:border-[#0038ed]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Manage Inventory</h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Keep your stock counts updated in real time and receive automatic low-stock alerts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:border-[#0038ed]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Billing &amp; Invoicing</h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Generate compliant GST invoices and thermal 80mm bills for counter and delivery
                sales.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:border-[#0038ed]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Orders &amp; Delivery</h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                View and manage incoming orders with flexible store pickup or doorstep delivery
                options.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:border-[#0038ed]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Business Insights</h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Gain deep insights into daily sales volume, popular items, repeat buyers and trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How Selling in {branding.appName} Works (5-Step Sequence) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              How Selling in {branding.appName} Works
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Get your online store live and start receiving orders in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 relative">
            {/* Step 1 */}
            <div className="text-center flex flex-col items-center group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038ed] shadow-2xs group-hover:scale-105 group-hover:bg-[#0038ed] group-hover:text-white transition-all mb-4">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] uppercase tracking-wider mb-1">
                01
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                Create Seller Account
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                Sign up and verify your basic details and store phone number.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center flex flex-col items-center group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038ed] shadow-2xs group-hover:scale-105 group-hover:bg-[#0038ed] group-hover:text-white transition-all mb-4">
                <Store className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] uppercase tracking-wider mb-1">
                02
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                Create Your Store
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                Set up your store profile, logo, banner and business hours.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center flex flex-col items-center group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038ed] shadow-2xs group-hover:scale-105 group-hover:bg-[#0038ed] group-hover:text-white transition-all mb-4">
                <Package className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] uppercase tracking-wider mb-1">
                03
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Add Products</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                Upload images, set prices and organize your digital catalog.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center flex flex-col items-center group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038ed] shadow-2xs group-hover:scale-105 group-hover:bg-[#0038ed] group-hover:text-white transition-all mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] uppercase tracking-wider mb-1">
                04
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                Start Receiving Orders
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                Get real-time order alerts from nearby customers.
              </p>
            </div>

            {/* Step 5 */}
            <div className="text-center flex flex-col items-center group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038ed] shadow-2xs group-hover:scale-105 group-hover:bg-[#0038ed] group-hover:text-white transition-all mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] uppercase tracking-wider mb-1">
                05
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Fulfil &amp; Grow</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                Manage fulfillment and use customer insights to grow sales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Make Your Local Store Discoverable */}
      <section className="py-16 sm:py-20 bg-[#edf4ff] border-y border-blue-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Make Your Local Store Discoverable
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Customers in your area can search for products, discover your store, check real-time
                availability and place orders for pickup or local delivery.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">
                    Showcase your products with clear images and pricing details.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">
                    Reach nearby customers actively searching for what you sell.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">
                    Get more footfall visibility and turn online views into orders.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/how-it-works/localdiscovery')}
                  className="px-6 py-3 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Learn About Local Discovery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Map Mockup */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-blue-200/80 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <MapPin className="w-4 h-4 text-[#0038ed]" />
                    <span>Hyperlocal Radius: 2.0 km</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[11px]">
                    Active Coverage
                  </span>
                </div>

                <div className="aspect-[16/10] bg-slate-50 rounded-2xl border border-slate-200/90 p-4 relative flex items-center justify-center overflow-hidden">
                  {/* Concentric radar rings */}
                  <div className="absolute w-64 h-64 rounded-full border border-blue-200/60" />
                  <div className="absolute w-44 h-44 rounded-full border border-blue-300/60 bg-blue-50/30" />
                  <div className="absolute w-24 h-24 rounded-full border border-blue-400/80 bg-blue-100/40" />

                  {/* Central Store Pin */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#0038ed] text-white flex items-center justify-center shadow-lg animate-bounce">
                      <Store className="w-5 h-5" />
                    </div>
                    <span className="mt-1 px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-xs">
                      Your Store
                    </span>
                  </div>

                  {/* Nearby shopper pins */}
                  <div className="absolute top-6 left-10 p-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs text-[10px] font-semibold text-slate-700">
                    Shopper (0.4 km)
                  </div>
                  <div className="absolute bottom-8 right-12 p-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs text-[10px] font-semibold text-slate-700">
                    Shopper (1.1 km)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Built for Local Retail (9 Categories) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Built for Local Retail
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Whether you run a single store or multiple outlets, {branding.appName} works for every
              type of retail business.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 sm:gap-4">
            {MARKETING_DATA.retailCategories.map((cat, i) => (
              <div
                key={i}
                className="bg-[#f8fafc] hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 rounded-2xl p-4 flex flex-col items-center text-center transition-all group cursor-pointer"
                onClick={() => onNavigate('/sell-online/listproducts')}
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 group-hover:border-blue-200 text-[#0038ed] flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                  {cat.icon === 'Shirt' ? (
                    <Shirt className="w-5 h-5" />
                  ) : cat.icon === 'Footprints' ? (
                    <Footprints className="w-5 h-5" />
                  ) : cat.icon === 'Headphones' ? (
                    <Headphones className="w-5 h-5" />
                  ) : cat.icon === 'Gem' ? (
                    <Gem className="w-5 h-5" />
                  ) : cat.icon === 'Sparkles' ? (
                    <Sparkles className="w-5 h-5" />
                  ) : cat.icon === 'Armchair' ? (
                    <Armchair className="w-5 h-5" />
                  ) : cat.icon === 'Gift' ? (
                    <Gift className="w-5 h-5" />
                  ) : cat.icon === 'Trophy' ? (
                    <Trophy className="w-5 h-5" />
                  ) : (
                    <ShoppingBag className="w-5 h-5" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-[#0038ed] transition-colors">
                  {cat.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Tools That Help You Grow */}
      <section className="py-16 sm:py-20 bg-[#f8fbff] border-t border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tools That Help You Grow
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              More features to run your store better, attract more customers and increase sales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tool 1: Promotions & Offers */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Promotions &amp; Offers
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Create discounts and special offers to attract more customers.
                </p>
              </div>
            </div>

            {/* Tool 2: Business Insights */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Business Insights</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Understand your sales, popular products and customer activity.
                </p>
              </div>
            </div>

            {/* Tool 3: Customer Management */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Customer Management
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Build and retain relationships with your local customer base.
                </p>
              </div>
            </div>

            {/* Tool 4: Mobile Access */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Mobile Access</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Manage your store anytime, anywhere with seamless mobile controls.
                </p>
              </div>
            </div>

            {/* Tool 5: Seller Support */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Seller Support</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Our regional team is here to help you with setup and operations.
                </p>
              </div>
            </div>

            {/* Tool 6: Learning Resources */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Learning Resources
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Guides and step-by-step tutorials to help you grow your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Pre-Footer Deep Blue Banner */}
      <section className="bg-[#0038ed] text-white py-14 sm:py-16 select-none relative overflow-hidden">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 shadow-inner">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-blue-200 uppercase tracking-widest">
                READY TO GET STARTED?
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Take Your Store Online with {branding.appName}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                Create your online store, list your products and start receiving orders from nearby
                customers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStartSelling}
            className="px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-[#0038ed] font-black text-sm sm:text-base shadow-xl transition-all cursor-pointer shrink-0"
          >
            Start Selling &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};
