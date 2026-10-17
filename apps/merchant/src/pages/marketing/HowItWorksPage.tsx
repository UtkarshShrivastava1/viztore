import React from 'react';
import {
  ArrowRight,
  Play,
  Check,
  Box,
  ShoppingCart,
  Layers,
  Users,
  FileText,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { useVideoModal } from '../../components/marketing/MerchantPublicLayout.js';

interface HowItWorksPageProps {
  onNavigate: (route: string) => void;
  onStartSelling: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onNavigate,
  onStartSelling,
}) => {
  const { openVideoModal } = useVideoModal();

  const handleWatchVideo = () => {
    openVideoModal({
      id: 'how-it-works-video',
      title: `How It Works: Selling on ${branding.appName}`,
      duration: '3:15',
      category: 'Tutorial',
      description: 'Comprehensive walkthrough from merchant signup to doorstep delivery fulfillment.',
    });
  };

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Hero Section (Mockup 2.0.png) */}
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
            <span className="text-[#0052ff] font-semibold">How it Works</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0052ff] font-bold text-xs uppercase tracking-wider">
                FOR LOCAL RETAILERS
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0c1427] tracking-tight leading-[1.15]">
                How It Works on{' '}
                <span className="text-[#0052ff]">{branding.appName}</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                Get your online store live and start receiving orders in just a few simple steps. No
                technical skills required.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-6 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0043d9] text-white font-bold text-sm shadow-sm hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Start Selling</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleWatchVideo}
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200/90 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 fill-[#0052ff] ml-0.5" />
                  </div>
                  <span>Watch Video</span>
                </button>
              </div>
            </div>

            {/* Right Column: Authentic Laptop & Phone Devices from 2.0.png */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[620px]">
                <img
                  src="/images/homepage-hero-devices.png"
                  alt="Laptop Dashboard and Customer Storefront Devices"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Start Your Online Store in 5 Simple Steps (Mockup 2.0.png) */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
              Start Your Online Store in 5 Simple Steps
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Set up your store, add products, and start receiving orders from nearby customers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">01</div>
              <h4 className="text-sm font-bold text-[#0c1427]">Create Seller Account</h4>
              <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                Sign up and verify your details.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <Box className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">02</div>
              <h4 className="text-sm font-bold text-[#0c1427]">Set Up Your Store</h4>
              <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                Add your store profile, logo and basic details.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">03</div>
              <h4 className="text-sm font-bold text-[#0c1427]">Add Products</h4>
              <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                Upload images, set prices and organize your catalog.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">04</div>
              <h4 className="text-sm font-bold text-[#0c1427]">Start Receiving Orders</h4>
              <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                Get orders from nearby customers.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#0052ff] mb-1">05</div>
              <h4 className="text-sm font-bold text-[#0c1427]">Fulfil &amp; Grow</h4>
              <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                Manage your store and use insights to grow your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Everything You Need in One Platform (Mockup 2.0.png) */}
      <section className="py-16 sm:py-20 bg-[#f8fbff]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
              Everything You Need in One Platform
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Powerful tools to manage your products, orders, customers and business — all in one
              place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {/* 1. Product Management */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center mb-3">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0c1427]">Product Management</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Add products with images, prices, categories and variants.
              </p>
            </div>

            {/* 2. Orders & Delivery */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0c1427]">Orders &amp; Delivery</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Manage orders with pickup or local delivery options.
              </p>
            </div>

            {/* 3. Inventory Management */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0c1427]">Inventory Management</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Track stock and get low stock alerts in real-time.
              </p>
            </div>

            {/* 4. Customer Management */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0c1427]">Customer Management</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Keep customer details and order history.
              </p>
            </div>

            {/* 5. Billing & Invoicing */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0c1427]">Billing &amp; Invoicing</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Create GST bills and invoices easily.
              </p>
            </div>

            {/* 6. Reports & Analytics */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0c1427]">Reports &amp; Analytics</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Get insights on sales, popular products and customer trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Take Your Store to More Customers (Mockup 2.0.png) */}
      <section className="py-14 sm:py-16 bg-[#f0f6ff] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left side: Heading, copy, horizontal checkmarks, button */}
            <div className="lg:col-span-7 space-y-5">
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#0c1427] tracking-tight leading-snug">
                Take Your Store to More Customers
              </h2>
              <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed max-w-2xl">
                Once your store is live on {branding.appName}, customers in your area can discover
                your products, check availability and place orders for pickup or local delivery.
              </p>

              {/* Horizontal 3 Checkmarks matching 2.0.png */}
              <div className="flex flex-wrap items-center gap-5 sm:gap-7 pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-[13.5px] font-medium text-slate-700">
                    More visibility for your store
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-[13.5px] font-medium text-slate-700">
                    Reach nearby customers
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-[13.5px] font-medium text-slate-700">
                    Increase sales and repeat orders
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/how-it-works/localdiscovery')}
                  className="px-5 py-2.5 rounded-lg bg-white hover:bg-blue-50/80 border border-[#0052ff] text-[#0052ff] font-semibold text-sm shadow-2xs inline-flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Learn About Local Discovery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right side: Panoramic graphic matching 2.0.png */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[560px] rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 bg-white">
                <img
                  src="/images/how-it-works-split.png"
                  alt="Shopkeeper and Hyperlocal Discovery Radar"
                  className="w-full h-auto object-cover block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pre-Footer Banner (Mockup 2.0.png) */}
      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0052ff] to-[#0038ed] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                READY TO GET STARTED?
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">
                Start Selling on {branding.appName} Today
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                Create your seller account, list your products and start receiving orders from
                nearby customers.
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
