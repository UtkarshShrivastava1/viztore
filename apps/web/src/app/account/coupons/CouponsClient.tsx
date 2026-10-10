'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Ticket, Search, ChevronDown, Clock, ArrowLeft
} from 'lucide-react';
import { AccountSidebar } from '@/components/account/AccountSidebar';

const TABS = [
  { id: 'all', label: 'All', count: 8 },
  { id: 'coupons', label: 'Coupons', count: 5 },
  { id: 'banks', label: 'Bank Offers', count: 3 },
];

const AVAILABLE_COUPONS = [
  {
    id: 1,
    code: 'VIZ200',
    title: 'Get flat ₹200 off on orders above ₹1499',
    validity: 'Valid till 30 Jun 2024',
    tag: 'Best Deal',
    amount: '₹200',
    type: 'FLAT',
    bgClass: 'bg-[#E8F8F1] text-[#10B981]',
    borderClass: 'border-[#10B981]/20',
  },
  {
    id: 2,
    code: 'SAVE100',
    title: 'Get flat ₹100 off on orders above ₹999',
    validity: 'Valid till 25 May 2024',
    tag: null,
    amount: '₹100',
    type: 'FLAT',
    bgClass: 'bg-[#EFF6FF] text-[#1D4ED8]',
    borderClass: 'border-[#1D4ED8]/20',
  },
  {
    id: 3,
    code: 'EXTRA5',
    title: 'Get extra 5% off on all prepaid orders',
    validity: 'Valid till 20 May 2024',
    tag: null,
    amount: '5%',
    type: 'EXTRA',
    bgClass: 'bg-[#FFF7ED] text-[#EA580C]',
    borderClass: 'border-[#EA580C]/20',
  },
  {
    id: 4,
    code: 'NEW50',
    title: 'Flat ₹50 off for new users on orders above ₹499',
    validity: 'Valid till 31 May 2024',
    tag: 'New User',
    amount: '₹50',
    type: 'FLAT',
    bgClass: 'bg-[#FDF4FF] text-[#9333EA]',
    borderClass: 'border-[#9333EA]/20',
  },
  {
    id: 5,
    code: 'WEEKEND10',
    title: 'Extra 10% off on minimum order of ₹1999',
    validity: 'Valid till 19 May 2024',
    tag: null,
    amount: '10%',
    type: 'EXTRA',
    bgClass: 'bg-[#E8F8F1] text-[#10B981]',
    borderClass: 'border-[#10B981]/20',
  },
];

const BANK_OFFERS = [
  {
    id: 1,
    bank: 'SBI Card',
    logoColor: 'text-[#1668F6]',
    title: '10% Instant Discount*',
    desc: 'on SBI Credit Cards',
  },
  {
    id: 2,
    bank: 'HDFC BANK',
    logoColor: 'text-[#1D4ED8]',
    title: '₹750 Instant Discount*',
    desc: 'on HDFC Credit Cards',
  },
  {
    id: 3,
    bank: 'ICICI Bank',
    logoColor: 'text-[#EA580C]',
    title: '10% Instant Discount*',
    desc: 'on ICICI Credit Cards',
  },
  {
    id: 4,
    bank: 'AXIS BANK',
    logoColor: 'text-[#BE123C]',
    title: '₹500 Instant Discount*',
    desc: 'on Axis Credit Cards',
  },
];

export function CouponsClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#ffffff] font-sans relative pb-24">
      <main className="max-w-[1680px] mx-auto px-4 lg:px-8 py-4 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ================= DESKTOP LEFT SIDEBAR ================= */}
        <AccountSidebar />

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-4">
          
          {/* Header */}
          <div className="px-0 w-full pt-2">
            <div className="flex items-start gap-3">
              <button onClick={() => router.back()} className="mt-1.5 shrink-0 lg:hidden">
                <ArrowLeft className="w-6 h-6 text-[#192168]" />
              </button>
              <div>
                <h1 className="text-[22px] lg:text-[28px] font-extrabold text-[#192168] leading-tight">Coupons & Offers</h1>
                <p className="text-[12px] lg:text-[14px] text-surface-600 mt-1">Save more on your favourite products</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center border-b border-surface-200 mt-2 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 lg:px-6 py-3 text-[13px] font-bold transition-colors border-b-2 whitespace-nowrap flex-1 text-center ${
                  activeTab === tab.id 
                    ? 'border-[#1668F6] text-[#1668F6]' 
                    : 'border-transparent text-surface-500 hover:text-surface-800'
                }`}
              >
                {tab.label} <span className="text-[11px] font-medium ml-0.5">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative mt-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Ticket className="w-5 h-5 text-[#192168]" />
            </div>
            <input 
              type="text"
              placeholder="Search coupon code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-[90px] py-3.5 bg-white border border-surface-200 rounded-xl focus:outline-none focus:border-[#1668F6] text-[13px] text-[#192168] placeholder:text-surface-400"
            />
            <div className="absolute inset-y-1.5 right-1.5">
              <button className="flex items-center justify-center gap-1.5 px-4 py-2 h-full bg-[#1668F6] text-white rounded-lg text-[13px] font-bold hover:bg-blue-700 transition-colors">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </div>

          {/* Available Coupons */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-extrabold text-[#192168]">Available Coupons</h3>
              <button className="text-[12px] font-bold text-[#1668F6] hover:underline">View T&C</button>
            </div>

            <div className="flex flex-col gap-4">
              {AVAILABLE_COUPONS.map((coupon) => (
                <div key={coupon.id} className="flex border border-surface-200 rounded-xl overflow-hidden bg-white">
                  {/* Left Ticket Stub */}
                  <div className={`w-[90px] sm:w-[110px] flex flex-col items-center justify-center shrink-0 border-r border-dashed border-surface-200 relative ${coupon.bgClass}`}>
                    {/* Semi-circle cutouts to mimic ticket */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white border border-surface-200 border-t-transparent border-l-transparent transform -rotate-45" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white border border-surface-200 border-b-transparent border-l-transparent transform rotate-45" />
                    
                    <span className="text-[10px] font-bold opacity-80 mb-0.5">{coupon.type}</span>
                    <span className="text-[20px] font-black leading-none">{coupon.amount}</span>
                    <span className="text-[11px] font-bold opacity-80 mt-1">OFF</span>
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 p-3.5 flex flex-row items-center justify-between gap-2 min-w-0">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[15px] font-extrabold text-[#192168] tracking-wide">{coupon.code}</span>
                        {coupon.tag && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            coupon.tag === 'Best Deal' ? 'bg-[#E8F8F1] text-[#10B981]' : 'bg-[#FDF4FF] text-[#9333EA]'
                          }`}>
                            {coupon.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-surface-600 line-clamp-2 leading-snug mb-2">
                        {coupon.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-surface-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{coupon.validity}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                      <button className="w-full px-5 py-2 bg-[#1668F6] text-white rounded-lg text-[12px] font-bold hover:bg-blue-700 transition-colors">
                        Copy
                      </button>
                      <button className="flex items-center justify-center gap-0.5 text-[10px] font-bold text-[#1668F6]">
                        View Details <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Offers */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-extrabold text-[#192168]">Bank Offers</h3>
              <button className="text-[12px] font-bold text-[#1668F6] hover:underline">View All</button>
            </div>

            <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
              {BANK_OFFERS.map((offer) => (
                <div key={offer.id} className="w-[160px] shrink-0 border border-surface-200 rounded-xl p-4 bg-white flex flex-col items-center text-center">
                  <div className="font-black italic text-sm tracking-tight flex items-center justify-center gap-1 mb-3 h-6">
                    {offer.id === 1 && <span className="text-[#1668F6] flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#1668F6] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div> SBI Card</span>}
                    {offer.id === 2 && <span className="text-[#004b8d] flex items-center gap-1"><div className="w-3 h-3 bg-red-600"></div> HDFC BANK</span>}
                    {offer.id === 3 && <span className="text-[#EA580C] flex items-center gap-1"><i>i</i>ICICI Bank</span>}
                    {offer.id === 4 && <span className="text-[#BE123C] flex items-center gap-1"><div className="border-b-[8px] border-l-[8px] border-b-[#BE123C] border-l-transparent"></div> AXIS BANK</span>}
                  </div>
                  <h4 className="text-[12px] font-extrabold text-[#192168] leading-tight mb-1">{offer.title}</h4>
                  <p className="text-[10px] text-surface-500 mb-3">{offer.desc}</p>
                  <span className="text-[9px] text-surface-400 mt-auto">T&C Apply</span>
                </div>
              ))}
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="mt-4 rounded-[14px] overflow-hidden relative bg-[#E8F0FE] p-5 flex flex-col items-start justify-center min-h-[160px]">
            <span className="text-[#192168] text-[9px] font-bold uppercase tracking-wider mb-1">Super Saver Deal!</span>
            <h3 className="text-[26px] font-black text-[#1668F6] leading-none mb-1">Upto 80% Off</h3>
            <p className="text-[11px] text-[#192168] mb-4">Big savings on top categories</p>
            <button className="px-5 py-2 bg-[#1668F6] text-white rounded-lg text-[12px] font-bold hover:bg-blue-700 transition-colors z-10 shadow-sm">
              Shop Now
            </button>

            {/* Shopping bag graphic approximation */}
            <div className="absolute right-0 bottom-0 w-32 h-32 pointer-events-none overflow-hidden">
              <div className="absolute bottom-[-10px] right-2 w-20 h-24 bg-[#1668F6] rounded-md transform border-t-[3px] border-[#3B82F6] flex items-center justify-center">
                <span className="text-yellow-400 font-black text-4xl italic">V</span>
              </div>
              <div className="absolute bottom-16 right-7 w-10 h-10 border-[3px] border-[#1668F6] rounded-t-full border-b-transparent"></div>
              
              <div className="absolute bottom-2 right-1 w-6 h-6 bg-rose-500 rounded-sm z-20"><div className="w-full h-1 bg-yellow-400 absolute top-1/2 -translate-y-1/2"></div><div className="h-full w-1 bg-yellow-400 absolute left-1/2 -translate-x-1/2"></div></div>
              <div className="absolute bottom-0 right-16 w-8 h-8 bg-yellow-400 rounded-sm z-20"><div className="w-full h-1.5 bg-rose-500 absolute top-1/2 -translate-y-1/2"></div><div className="h-full w-1.5 bg-rose-500 absolute left-1/2 -translate-x-1/2"></div></div>
              
              <div className="absolute top-8 right-20 w-5 h-5 bg-yellow-400 rounded-sm flex items-center justify-center text-[#192168] text-[10px] font-bold transform -rotate-12">%</div>
            </div>
            {/* Confetti dots */}
            <div className="absolute top-4 right-10 w-1.5 h-1.5 bg-rose-400 rounded-full"></div>
            <div className="absolute bottom-8 right-24 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <div className="absolute top-10 right-28 w-1 h-1 bg-yellow-400 rounded-full"></div>
          </div>

        </div>
      </main>
    </div>
  );
}

