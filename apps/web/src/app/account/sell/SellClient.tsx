'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  HeadphonesIcon, Rocket, ArrowLeft,
  Users, TrendingUp, Tag, PieChart, Wallet, ChevronRight, Shield, Calendar
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';

export function SellClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#ffffff] font-sans relative pb-24">
      <main className="max-w-[1680px] mx-auto px-4 lg:px-8 py-4 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Sidebar */}
        <AccountSidebar />

        <div className="flex-1 w-full min-w-0 flex flex-col gap-5 pt-2">
          
          <div className="flex items-start gap-3">
            <button onClick={() => router.back()} className="mt-1.5 shrink-0 lg:hidden">
              <ArrowLeft className="w-6 h-6 text-[#192168]" />
            </button>
            <div className="relative z-10 w-full mb-2">
              <h1 className="text-[28px] md:text-[36px] font-extrabold text-[#192168] leading-tight mb-2">Sell on {branding.appName}</h1>
              <p className="text-[13px] md:text-[15px] text-surface-600 max-w-[260px] leading-relaxed">Start selling and grow your business with India's trusted local marketplace</p>
            </div>
          </div>

          {/* Graphic Area (Mobile Adjusted) */}
          <div className="relative w-full h-[180px] -mt-8 pointer-events-none overflow-hidden flex justify-end items-end pr-2">
            <div className="relative w-[220px] h-full flex items-end justify-end">
              {/* Storefront / Screen */}
              <div className="absolute right-0 bottom-0 w-28 h-32 bg-blue-500 rounded-t-xl border-[3px] border-blue-600 flex flex-col items-center justify-center overflow-hidden z-0">
                <div className="absolute top-0 w-full flex">
                  <div className="h-3 flex-1 bg-blue-400 rounded-b-full mx-px"></div>
                  <div className="h-3 flex-1 bg-white rounded-b-full mx-px"></div>
                  <div className="h-3 flex-1 bg-blue-400 rounded-b-full mx-px"></div>
                  <div className="h-3 flex-1 bg-white rounded-b-full mx-px"></div>
                </div>
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mt-3">
                  <span className="text-yellow-500 font-black text-xl italic">V</span>
                </div>
              </div>
              
              {/* Boxes */}
              <div className="absolute right-[90px] bottom-0 flex flex-col items-center z-20">
                <div className="w-10 h-10 bg-[#D4A373] rounded-sm border border-[#C69363] flex items-center justify-center translate-x-5 z-20 shadow-md">
                  <div className="w-3 h-3 border-b border-r border-[#A37343] opacity-50"></div>
                </div>
                <div className="flex z-10">
                  <div className="w-10 h-10 bg-[#D4A373] rounded-sm border border-[#C69363] flex items-center justify-center shadow-md">
                    <div className="w-3 h-3 border-b border-r border-[#A37343] opacity-50"></div>
                  </div>
                  <div className="w-10 h-10 bg-[#D4A373] rounded-sm border border-[#C69363] flex items-center justify-center shadow-md">
                    <div className="w-3 h-3 border-b border-r border-[#A37343] opacity-50"></div>
                  </div>
                </div>
              </div>

              {/* Plant */}
              <div className="absolute right-0 bottom-0 translate-x-6 z-20 flex flex-col items-center">
                 <div className="w-6 h-8 text-green-500">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" className="hidden"/>
                      <path d="M17 8C15 8 13.5 9.5 13.5 11.5C13.5 12.5 13.9 13.4 14.5 14L12 16L9.5 14C10.1 13.4 10.5 12.5 10.5 11.5C10.5 9.5 9 8 7 8C5 8 3.5 9.5 3.5 11.5C3.5 13.5 5 15 7 15C8 15 8.9 14.6 9.5 14L12 16.5L14.5 14C15.1 14.6 16 15 17 15C19 15 20.5 13.5 20.5 11.5C20.5 9.5 19 8 17 8Z"/>
                    </svg>
                 </div>
                 <div className="w-8 h-6 bg-white border border-gray-200 rounded-b-lg rounded-t-sm shadow-sm"></div>
              </div>

              {/* Graph bars and arrow */}
              <div className="absolute right-[120px] top-6 flex items-end gap-1 opacity-50">
                <div className="w-1.5 h-4 bg-gray-300 rounded-sm"></div>
                <div className="w-1.5 h-8 bg-gray-300 rounded-sm"></div>
                <div className="w-1.5 h-12 bg-gray-300 rounded-sm"></div>
              </div>
              <div className="absolute right-[-10px] top-[40px] w-8 h-8 transform -rotate-[20deg]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-blue-600 w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 7h7v7" />
                </svg>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-[#E8F8F1] rounded-[14px] p-4 flex flex-row items-center justify-between gap-3 relative overflow-hidden mb-1">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm z-10">
              <Rocket className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="flex-1 min-w-0 z-10">
              <h3 className="text-[13px] font-bold text-[#192168] leading-tight">Grow your business with {branding.appName}</h3>
              <p className="text-[10px] text-surface-600 mt-0.5">Reach more local customers and boost your sales</p>
            </div>
            <button className="px-3.5 py-2 bg-[#10B981] text-white rounded-lg text-[11px] font-bold hover:bg-emerald-600 transition-colors shadow-sm flex items-center justify-center gap-1 z-10 shrink-0">
              Get Started <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Why Sell On */}
          <div className="mb-2">
            <h3 className="text-[16px] font-extrabold text-[#192168] mb-4">Why sell on {branding.appName}?</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center p-4 rounded-[14px] bg-white border border-surface-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-[#1668F6]" />
                </div>
                <h4 className="text-[13px] font-bold text-[#192168] mb-1">Local Customers</h4>
                <p className="text-[11px] text-surface-500 leading-snug">Reach thousands of local buyers near you</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-[14px] bg-white border border-surface-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-[#10B981]" />
                </div>
                <h4 className="text-[13px] font-bold text-[#192168] mb-1">Grow Your Business</h4>
                <p className="text-[11px] text-surface-500 leading-snug">Increase sales and expand your brand</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-[14px] bg-white border border-surface-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="text-[13px] font-bold text-[#192168] mb-1">Secure & Reliable</h4>
                <p className="text-[11px] text-surface-500 leading-snug">Safe payments and seller protection</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-[14px] bg-white border border-surface-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-3">
                  <HeadphonesIcon className="w-5 h-5 text-orange-500" />
                </div>
                <h4 className="text-[13px] font-bold text-[#192168] mb-1">Dedicated Support</h4>
                <p className="text-[11px] text-surface-500 leading-snug">Get help at every step of your journey</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="mb-2">
            <h3 className="text-[16px] font-extrabold text-[#192168] mb-6">Start Selling in 3 Simple Steps</h3>
            
            <div className="relative border border-surface-200 rounded-[14px] bg-white p-5 shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
              {/* Connecting line */}
              <div className="absolute top-[38px] left-[15%] right-[15%] h-px border-t border-dashed border-surface-300" />
              
              <div className="grid grid-cols-3 gap-2 relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-9 h-9 bg-blue-50 text-[#1668F6] font-bold text-sm rounded-full flex items-center justify-center mb-3 bg-white border-2 border-white ring-1 ring-surface-200 shadow-sm">
                    1
                  </div>
                  <h4 className="text-[11px] font-extrabold text-[#192168] mb-1">Register</h4>
                  <p className="text-[9px] text-surface-500 leading-tight">Sign up and provide your business details</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-9 h-9 bg-blue-50 text-[#1668F6] font-bold text-sm rounded-full flex items-center justify-center mb-3 bg-white border-2 border-white ring-1 ring-surface-200 shadow-sm">
                    2
                  </div>
                  <h4 className="text-[11px] font-extrabold text-[#192168] mb-1">Verify & Setup</h4>
                  <p className="text-[9px] text-surface-500 leading-tight">Verify your documents and set up your store</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-9 h-9 bg-blue-50 text-[#1668F6] font-bold text-sm rounded-full flex items-center justify-center mb-3 bg-white border-2 border-white ring-1 ring-surface-200 shadow-sm">
                    3
                  </div>
                  <h4 className="text-[11px] font-extrabold text-[#192168] mb-1">List & Sell</h4>
                  <p className="text-[9px] text-surface-500 leading-tight">List your products and start selling instantly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="mb-2">
            <h3 className="text-[16px] font-extrabold text-[#192168] mb-4">Tools to Grow Your Business</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-[14px] p-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-surface-200 flex flex-col items-start text-left gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5 text-[#1668F6]" />
                </div>
                <div>
                  <h4 className="text-[12px] font-extrabold text-[#192168] mb-0.5">Promotions & Ads</h4>
                  <p className="text-[10px] text-surface-500 leading-tight">Increase visibility and boost sales</p>
                </div>
              </div>
              
              <div className="bg-white rounded-[14px] p-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-surface-200 flex flex-col items-start text-left gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                  <PieChart className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-[12px] font-extrabold text-[#192168] mb-0.5">Business Insights</h4>
                  <p className="text-[10px] text-surface-500 leading-tight">Track performance and growth</p>
                </div>
              </div>

              <div className="bg-white rounded-[14px] p-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-surface-200 flex flex-col items-start text-left gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-[12px] font-extrabold text-[#192168] mb-0.5">Inventory Manager</h4>
                  <p className="text-[10px] text-surface-500 leading-tight">Manage stock and orders easily</p>
                </div>
              </div>

              <div className="bg-white rounded-[14px] p-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-surface-200 flex flex-col items-start text-left gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-[12px] font-extrabold text-[#192168] mb-0.5">Payouts</h4>
                  <p className="text-[10px] text-surface-500 leading-tight">Easy withdrawals and settlements</p>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help CTA */}
          <div className="bg-white border-t border-surface-200 -mx-4 px-4 py-4 mt-2 mb-[-96px]">
            <div className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <HeadphonesIcon className="w-6 h-6 text-[#192168]" />
                <div>
                  <h4 className="text-[13px] font-extrabold text-[#192168]">Need Help?</h4>
                  <p className="text-[11px] text-surface-500">Our team is here to help you at every step.</p>
                </div>
              </div>
              <div className="flex items-center text-[#192168] text-[12px] font-bold">
                Contact Support <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

