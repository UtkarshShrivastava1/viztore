import React from 'react';
import {
  ShoppingBag,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Rocket,
  Shield,
  Headphones,
} from 'lucide-react';
import { SellerNavbar } from '../components/layout/SellerNavbar.js';
import { branding } from '../lib/branding.js';

interface SellerLandingPageProps {
  onStartSelling: () => void;
  onLogin: () => void;
}

export const SellerLandingPage: React.FC<SellerLandingPageProps> = ({
  onStartSelling,
  onLogin,
}) => {
  return (
    <div className="min-h-screen bg-[#edf4ff] flex flex-col justify-between font-sans selection:bg-[#0038ed] selection:text-white">
      {/* Top Navigation Bar */}
      <SellerNavbar onGoToLogin={onLogin} onGoToSignup={onStartSelling} />

      {/* Main Hero Section with full-bleed right scene */}
      <div className="relative flex-1 flex flex-col justify-between overflow-hidden">
        {/* Background Graphic: The full scene anchored to the right */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[62%] xl:w-[58%] pointer-events-none overflow-hidden flex items-center justify-end [mask-image:linear-gradient(to_right,transparent_0%,black_15%)]">
          <img
            src="/seller-hero-scene.png"
            alt={`${branding.appName} Seller Portal 3D Artwork`}
            className="h-full w-auto max-w-none object-contain object-right select-none pointer-events-none"
          />
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 max-w-[1300px] w-full mx-auto px-6 sm:px-10 lg:px-14 py-8 sm:py-10 flex-1 flex items-center">
          <div className="max-w-xl space-y-6">
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-black text-slate-900 tracking-tight leading-[1.16]">
              Sell online to Crores of<br />
              Customers with <span className="text-[#0038ed]">{branding.appName}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-[15px] text-slate-600 max-w-md leading-relaxed">
              List your products, manage orders and grow your business with India's local commerce
              platform.
            </p>

            {/* 3 Value Pillars in a horizontal row */}
            <div className="grid grid-cols-3 gap-3.5 pt-1 max-w-md">
              <div className="space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-[#0038ed] text-white flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h4 className="text-[13px] font-bold text-slate-900 leading-tight">
                  List Products
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Create your digital catalog in minutes.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-[#0038ed] text-white flex items-center justify-center shadow-xs">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <h4 className="text-[13px] font-bold text-slate-900 leading-tight">
                  Get Orders
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Receive orders from local customers.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-[#0038ed] text-white flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-[13px] font-bold text-slate-900 leading-tight">
                  Grow Business
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Manage, fulfill and scale with ease.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-6 pt-2">
              <button
                type="button"
                onClick={onStartSelling}
                className="px-6 py-2.5 rounded-lg bg-[#0038ed] hover:bg-[#002fcf] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
              >
                Start Selling Now
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('trust-bar');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm font-bold text-slate-900 hover:text-[#0038ed] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Learn How it Works</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Trust Bar (4 Cards matching Screen 1.png) */}
        <div
          id="trust-bar"
          className="relative z-10 w-[94%] max-w-[1240px] mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 my-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[13px] font-bold text-slate-900">
                  Trusted by Sellers Across India
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Thousands of local businesses trust {branding.appName}.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                <Rocket className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[13px] font-bold text-slate-900">Easy to Start</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Get your store online in just a few minutes.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[13px] font-bold text-slate-900">Secure &amp; Reliable</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your business and customer data is always safe.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[13px] font-bold text-slate-900">Always Here to Help</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Our support team is ready to assist you anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
