'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Ticket, Search, ChevronDown, ChevronUp, Clock, ArrowLeft, Check, Sparkles, ShoppingBag
} from 'lucide-react';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { couponsApi } from '@/lib/api/coupons';
import { branding } from '@repo/shared-types';
import type { ICoupon } from '@repo/shared-types';

const BANK_OFFERS = [
  {
    id: 1,
    bank: 'SBI Card',
    logoColor: 'text-[#1668F6]',
    title: '10% Instant Discount*',
    desc: 'on SBI Credit Cards on orders above ₹1,999',
    terms: 'Valid once per card per month. Maximum discount ₹500.',
  },
  {
    id: 2,
    bank: 'HDFC Bank',
    logoColor: 'text-[#1D4ED8]',
    title: '₹750 Instant Discount*',
    desc: 'on HDFC Credit Cards on orders above ₹3,499',
    terms: 'Valid on EMI & non-EMI transactions. Maximum discount ₹750.',
  },
  {
    id: 3,
    bank: 'ICICI Bank',
    logoColor: 'text-[#EA580C]',
    title: '10% Instant Discount*',
    desc: 'on ICICI Credit Cards on orders above ₹1,499',
    terms: 'Valid on prepaid transactions only. Maximum discount ₹300.',
  },
  {
    id: 4,
    bank: 'Axis Bank',
    logoColor: 'text-[#BE123C]',
    title: '₹500 Instant Discount*',
    desc: 'on Axis Credit Cards on orders above ₹2,499',
    terms: 'Valid across all participating local stores.',
  },
];

export function CouponsClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'coupons' | 'banks'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedCouponId, setExpandedCouponId] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    couponsApi.getActiveCoupons()
      .then((data) => {
        setCoupons(data);
      })
      .catch((err) => {
        console.error('Failed to fetch coupons:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => {
        setCopiedCode((curr) => (curr === code ? null : curr));
      }, 2000);
    } catch {
      // Fallback
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    });
  }, [coupons, searchQuery]);

  const filteredBankOffers = useMemo(() => {
    return BANK_OFFERS.filter((b) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.bank.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.desc.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const totalCouponsCount = coupons.length;
  const totalBanksCount = BANK_OFFERS.length;
  const totalAllCount = totalCouponsCount + totalBanksCount;

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
              <button 
                type="button" 
                onClick={() => router.back()} 
                className="mt-1.5 shrink-0 lg:hidden cursor-pointer"
              >
                <ArrowLeft className="w-6 h-6 text-[#192168]" />
              </button>
              <div>
                <h1 className="text-[22px] lg:text-[28px] font-extrabold text-[#192168] leading-tight">
                  Coupons & Offers
                </h1>
                <p className="text-[12px] lg:text-[14px] text-surface-600 mt-1">
                  Save more on your favourite neighbourhood retail stores with {branding.appName}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center border-b border-surface-200 mt-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 lg:px-6 py-3 text-[13px] font-bold transition-colors border-b-2 whitespace-nowrap flex-1 text-center cursor-pointer ${
                activeTab === 'all' 
                  ? 'border-[#1668F6] text-[#1668F6]' 
                  : 'border-transparent text-surface-500 hover:text-surface-800'
              }`}
            >
              All <span className="text-[11px] font-medium ml-0.5">({totalAllCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('coupons')}
              className={`px-4 lg:px-6 py-3 text-[13px] font-bold transition-colors border-b-2 whitespace-nowrap flex-1 text-center cursor-pointer ${
                activeTab === 'coupons' 
                  ? 'border-[#1668F6] text-[#1668F6]' 
                  : 'border-transparent text-surface-500 hover:text-surface-800'
              }`}
            >
              Coupons <span className="text-[11px] font-medium ml-0.5">({totalCouponsCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('banks')}
              className={`px-4 lg:px-6 py-3 text-[13px] font-bold transition-colors border-b-2 whitespace-nowrap flex-1 text-center cursor-pointer ${
                activeTab === 'banks' 
                  ? 'border-[#1668F6] text-[#1668F6]' 
                  : 'border-transparent text-surface-500 hover:text-surface-800'
              }`}
            >
              Bank Offers <span className="text-[11px] font-medium ml-0.5">({totalBanksCount})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mt-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Ticket className="w-5 h-5 text-[#192168]" />
            </div>
            <input 
              type="text"
              placeholder="Search coupon code or bank offer"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-[90px] py-3.5 bg-white border border-surface-200 rounded-xl focus:outline-none focus:border-[#1668F6] text-[13px] text-[#192168] placeholder:text-surface-400"
            />
            <div className="absolute inset-y-1.5 right-1.5">
              <button 
                type="button"
                className="flex items-center justify-center gap-1.5 px-4 py-2 h-full bg-[#1668F6] text-white rounded-lg text-[13px] font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </div>

          {/* Available Coupons */}
          {(activeTab === 'all' || activeTab === 'coupons') && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-extrabold text-[#192168]">Available Store Coupons</h3>
                <span className="text-[12px] font-bold text-slate-500">{filteredCoupons.length} Available</span>
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading coupons...</div>
              ) : filteredCoupons.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                  No coupons found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredCoupons.map((coupon) => {
                    const isCopied = copiedCode === coupon.code;
                    const isExpanded = expandedCouponId === coupon.id;
                    const discountDisplay = coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`;

                    return (
                      <div 
                        key={coupon.id || coupon.code} 
                        className="flex flex-col border border-surface-200 rounded-2xl overflow-hidden bg-white shadow-2xs hover:border-blue-200 transition-all"
                      >
                        <div className="flex min-h-[96px]">
                          {/* Left Ticket Stub */}
                          <div className="w-[90px] sm:w-[110px] flex flex-col items-center justify-center shrink-0 border-r border-dashed border-surface-200 relative bg-[#EFF6FF] text-[#1D4ED8]">
                            {/* Semi-circle cutouts */}
                            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white border border-surface-200 border-t-transparent border-l-transparent transform -rotate-45" />
                            <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white border border-surface-200 border-b-transparent border-l-transparent transform rotate-45" />
                            
                            <span className="text-[10px] font-bold uppercase opacity-80 mb-0.5">
                              {coupon.discountType === 'percentage' ? 'PERCENT' : 'FLAT'}
                            </span>
                            <span className="text-[20px] font-black leading-none">{discountDisplay}</span>
                            <span className="text-[11px] font-bold opacity-80 mt-1">OFF</span>
                          </div>

                          {/* Right Content */}
                          <div className="flex-1 p-3.5 flex flex-row items-center justify-between gap-2 min-w-0">
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[15px] font-extrabold text-[#192168] tracking-wide font-mono">
                                  {coupon.code}
                                </span>
                                {coupon.tag && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E8F8F1] text-[#10B981]">
                                    {coupon.tag}
                                  </span>
                                )}
                              </div>
                              <p className="text-[12px] font-medium text-surface-800 line-clamp-2 leading-snug mb-1">
                                {coupon.title}
                              </p>
                              {coupon.description && (
                                <p className="text-[11px] text-surface-500 line-clamp-1 mb-1.5">
                                  {coupon.description}
                                </p>
                              )}
                              <div className="flex items-center gap-1.5 text-surface-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-[10px]">
                                  {coupon.endDate ? `Valid till ${coupon.endDate}` : 'Limited period offer'}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                              <button 
                                type="button"
                                onClick={() => handleCopyCode(coupon.code)}
                                className={`w-full min-w-[80px] px-4 py-2 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                  isCopied 
                                    ? 'bg-emerald-600 text-white' 
                                    : 'bg-[#1668F6] hover:bg-blue-700 text-white shadow-2xs'
                                }`}
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <span>Copy</span>
                                )}
                              </button>

                              <button 
                                type="button"
                                onClick={() => setExpandedCouponId(isExpanded ? null : coupon.id)}
                                className="flex items-center justify-center gap-0.5 text-[11px] font-bold text-[#1668F6] hover:underline cursor-pointer"
                              >
                                <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Details Accordion */}
                        {isExpanded && (
                          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 space-y-1 animate-in fade-in duration-150">
                            <p className="font-bold text-slate-800">Terms & Conditions:</p>
                            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                              <li>Minimum order value of ₹{coupon.minOrderValue.toLocaleString('en-IN')} required.</li>
                              {coupon.maxDiscount && (
                                <li>Maximum discount capped at ₹{coupon.maxDiscount.toLocaleString('en-IN')}.</li>
                              )}
                              <li>Valid on all eligible store products unless specified otherwise.</li>
                              <li>Applicable during checkout in the &ldquo;Apply Coupon&rdquo; price details drawer.</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Bank Offers */}
          {(activeTab === 'all' || activeTab === 'banks') && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-extrabold text-[#192168]">Instant Bank & Payment Offers</h3>
                <span className="text-[12px] font-bold text-slate-500">{filteredBankOffers.length} Offers</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pb-2">
                {filteredBankOffers.map((offer) => (
                  <div key={offer.id} className="border border-surface-200 rounded-2xl p-4 bg-white flex flex-col justify-between shadow-2xs hover:border-blue-200 transition-all">
                    <div>
                      <div className="font-black italic text-sm tracking-tight flex items-center gap-1.5 mb-2.5">
                        <span className={`${offer.logoColor} font-bold`}>{offer.bank}</span>
                      </div>
                      <h4 className="text-[13px] font-extrabold text-[#192168] leading-tight mb-1">
                        {offer.title}
                      </h4>
                      <p className="text-[11px] text-surface-600 mb-2">{offer.desc}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{offer.terms}</span>
                      <span className="font-bold text-blue-600">T&C</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promotional White-Label Banner */}
          <div className="mt-4 rounded-2xl overflow-hidden relative bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative z-10 max-w-md">
              <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Super Saver Neighbourhood Deal</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-[#192168] leading-tight mb-1">
                Shop Local & Save Big
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Discover exclusive discounts, rapid 30-minute doorstep delivery, and authentic neighbourhood inventory across local stores.
              </p>
              <button 
                type="button"
                onClick={() => router.push('/stores')}
                className="px-6 py-2.5 bg-[#1668F6] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Nearby Stores</span>
              </button>
            </div>

            <div className="w-24 h-24 rounded-2xl bg-blue-100/60 border border-blue-200 flex items-center justify-center shrink-0 text-blue-600">
              <Ticket className="w-12 h-12" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
