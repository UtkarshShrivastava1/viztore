import React from 'react';
import {
  ArrowRight,
  Play,
  Users,
  Store,
  Package,
  ShoppingBag,
  BarChart3,
  Layers,
  FileText,
  Truck,
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
            <span className="text-[#0038ed] font-bold">How it Works</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0038ed] font-bold text-xs uppercase tracking-wider">
                FOR LOCAL RETAILERS
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                How It Works on{' '}
                <span className="text-[#0038ed]">{branding.appName}</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-lg">
                Get your online store live and start receiving orders in just a few simple steps. No
                technical skills required.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-7 py-3.5 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Selling</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleWatchVideo}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0038ed] flex items-center justify-center">
                    <Play className="w-3 h-3 fill-[#0038ed] ml-0.5" />
                  </div>
                  <span>Watch Video</span>
                </button>
              </div>
            </div>

            {/* Right Graphic Preview */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="w-full max-w-lg bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-blue-300">Simple 5-Step Process</span>
                  <span className="text-[11px] text-emerald-400 font-bold">100% Digital</span>
                </div>
                <div className="space-y-3 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-[#0038ed] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </span>
                    <span>Sign up with mobile &amp; complete KYC</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-[#0038ed] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </span>
                    <span>Add products or bulk upload via spreadsheet</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-[#0038ed] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </span>
                    <span>Receive instant chime alerts for nearby orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Start Your Online Store in 5 Simple Steps */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Start Your Online Store in 5 Simple Steps
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Set up your store, add products, and start receiving orders from nearby customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 text-center">
            <div className="p-6 bg-[#f8fbff] rounded-3xl border border-blue-100 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0038ed] flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] mb-1">01</div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Create Seller Account</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sign up and verify your basic details and mobile number.
              </p>
            </div>

            <div className="p-6 bg-[#f8fbff] rounded-3xl border border-blue-100 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0038ed] flex items-center justify-center mb-3">
                <Store className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] mb-1">02</div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Set Up Your Store</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add your store profile, logo, address and working hours.
              </p>
            </div>

            <div className="p-6 bg-[#f8fbff] rounded-3xl border border-blue-100 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0038ed] flex items-center justify-center mb-3">
                <Package className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] mb-1">03</div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Add Products</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload images, set prices and organize catalog collections.
              </p>
            </div>

            <div className="p-6 bg-[#f8fbff] rounded-3xl border border-blue-100 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0038ed] flex items-center justify-center mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] mb-1">04</div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Start Receiving Orders</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get real-time alerts from local neighborhood shoppers.
              </p>
            </div>

            <div className="p-6 bg-[#f8fbff] rounded-3xl border border-blue-100 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0038ed] flex items-center justify-center mb-3">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0038ed] mb-1">05</div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Fulfil &amp; Grow</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manage your store and reach more customers in your area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Everything You Need in One Platform */}
      <section className="py-16 sm:py-20 bg-[#f8fbff] border-t border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Everything You Need in One Platform
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Powerful tools to manage your products, orders, customers and business — all in one
              place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
              <Package className="w-8 h-8 text-[#0038ed] mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">Product Management</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add products with images, prices, categories and variants.
              </p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
              <Truck className="w-8 h-8 text-rose-600 mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">Orders &amp; Delivery</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manage orders with pickup or local delivery options.
              </p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
              <Layers className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">Inventory Management</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Track stock and get low stock alerts in real-time.
              </p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
              <Users className="w-8 h-8 text-indigo-600 mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">Customer Management</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Keep customer details and order history easily accessible.
              </p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
              <FileText className="w-8 h-8 text-amber-600 mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">Billing &amp; Invoicing</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Create GST bills and invoices easily for walk-in and delivery sales.
              </p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
              <BarChart3 className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">Reports &amp; Analytics</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get insights on sales, popular products and customer trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pre-Footer Banner */}
      <section className="bg-[#0038ed] text-white py-12 select-none">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black">
              Start Selling on {branding.appName} Today
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              Create your seller account, list your products and start receiving orders from nearby
              customers.
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
