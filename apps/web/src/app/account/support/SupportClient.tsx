'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Store, 
  MessageSquare, HeadphonesIcon, Search, Package, RotateCcw, 
  CreditCard, ChevronRight, Phone, Mail, ShieldCheck, ArrowLeft
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';

export function SupportClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');


  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const QUICK_HELP = [
    { id: 'orders', icon: <Package className="w-5 h-5 text-[#1668F6]" />, title: 'Orders &\nDelivery' },
    { id: 'returns', icon: <RotateCcw className="w-5 h-5 text-amber-500" />, title: 'Returns &\nRefunds' },
    { id: 'payments', icon: <CreditCard className="w-5 h-5 text-emerald-500" />, title: 'Payments &\nOffers' },
    { id: 'account', icon: <User className="w-5 h-5 text-purple-500" />, title: 'Account &\nProfile' },
    { id: 'selling', icon: <Store className="w-5 h-5 text-rose-500" />, title: `Selling on\n${branding.appName}` },
  ];

  const ALL_TOPICS = [
    { id: '1', category: 'orders', title: 'How do I track my order?', desc: 'You can track your order in the Orders section.' },
    { id: '2', category: 'returns', title: 'How can I return or replace an item?', desc: 'Go to your Orders, select the item and click Return/Replace.' },
    { id: '3', category: 'payments', title: 'When will I get my refund?', desc: 'Refunds are processed within 5-7 business days.' },
    { id: '4', category: 'payments', title: 'How do I apply a coupon?', desc: 'You can apply coupons at the checkout page.' },
    { id: '5', category: 'account', title: 'How do I update my address?', desc: 'Go to Account > Address Book to update.' },
    { id: '6', category: 'selling', title: `How to start selling on ${branding.appName}?`, desc: 'Visit our seller portal to register your store.' },
  ];

  const filteredTopics = ALL_TOPICS.filter(t => 
    (!activeCategory || t.category === activeCategory) &&
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#ffffff] font-sans relative pb-24">
      <main className="max-w-[1680px] mx-auto px-4 lg:px-8 py-4 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Sidebar */}
        <AccountSidebar />

        <div className="flex-1 w-full min-w-0 flex flex-col pt-2">
          
          <div className="flex flex-col gap-5 relative z-10">
            
            {/* Header Area */}
            <div className="flex items-start justify-between relative">
              <div className="flex-1 min-w-0 z-10">
                <div className="flex items-center gap-2 mb-4">
                  <button type="button" onClick={() => router.back()} className="shrink-0 lg:hidden">
                    <ArrowLeft className="w-6 h-6 text-[#192168]" />
                  </button>
                  <h1 className="text-[24px] md:text-[32px] font-extrabold text-[#192168] leading-tight">Help & Support</h1>
                </div>
                <h3 className="text-[15px] font-extrabold text-[#192168] mb-1">We're here to help you!</h3>
                <p className="text-[12px] text-surface-500 leading-relaxed max-w-[200px]">Find answers to your questions or contact our support team.</p>
              </div>

              {/* Decorative Graphic */}
              <div className="relative shrink-0 w-[120px] h-[100px] pointer-events-none z-0">
                <div className="absolute right-0 top-0 w-24 h-24 flex items-center justify-center">
                  <HeadphonesIcon className="w-full h-full text-[#1668F6]" strokeWidth={1.5} />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-7 bg-[#E8F0FE] rounded-full flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-[#1668F6] rounded-full"></div>
                      <div className="w-1 h-1 bg-[#1668F6] rounded-full"></div>
                      <div className="w-1 h-1 bg-[#1668F6] rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-8 left-0 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center transform -rotate-12 shadow-sm">
                  <span className="text-white font-black text-sm">?</span>
                </div>
                <div className="absolute bottom-4 right-1 text-[#10B981] text-xs">✦</div>
                <div className="absolute top-10 right-24 text-[#1668F6] text-xs">✦</div>
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="w-full mt-2">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-surface-400" />
                </div>
                <input 
                  type="text"
                  placeholder="Search for help topics, e.g., order, refund, payment"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-surface-200 rounded-xl focus:outline-none focus:border-[#1668F6] text-[12px] text-[#192168] placeholder:text-surface-400 shadow-[0_2px_8px_rgb(0,0,0,0.04)]"
                />
              </div>
            </form>

            <div className="mt-4">
              <h3 className="text-[14px] font-extrabold text-[#192168] mb-4">Quick Help</h3>
              <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="flex flex-col items-center text-center group shrink-0 w-[60px]"
                >
                  <div className={`w-12 h-12 rounded-full border shadow-sm flex items-center justify-center mb-2 transition-transform group-hover:scale-105 ${!activeCategory ? 'bg-[#1668F6] border-[#1668F6] text-white' : 'bg-white border-surface-200'}`}>
                    <Search className={`w-5 h-5 ${!activeCategory ? 'text-white' : 'text-surface-400'}`} />
                  </div>
                  <span className={`text-[9px] font-extrabold whitespace-pre-line leading-tight ${!activeCategory ? 'text-[#1668F6]' : 'text-[#192168]'}`}>All Topics</span>
                </button>
                {QUICK_HELP.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveCategory(activeCategory === item.id ? null : item.id)}
                    className="flex flex-col items-center text-center group shrink-0 w-[60px]"
                  >
                    <div className={`w-12 h-12 rounded-full border shadow-sm flex items-center justify-center mb-2 transition-transform group-hover:scale-105 ${activeCategory === item.id ? 'bg-surface-50 border-[#1668F6]' : 'bg-white border-surface-200'}`}>
                      {item.icon}
                    </div>
                    <span className={`text-[9px] font-extrabold whitespace-pre-line leading-tight ${activeCategory === item.id ? 'text-[#1668F6]' : 'text-[#192168]'}`}>{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top Help Topics */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-extrabold text-[#192168]">Help Topics</h3>
              </div>
              <div className="bg-white rounded-2xl border border-surface-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
                {filteredTopics.length > 0 ? filteredTopics.map((topic, idx) => (
                  <div key={topic.id} className={`flex flex-col p-4 text-left ${idx !== filteredTopics.length - 1 ? 'border-b border-surface-100' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-semibold text-[#192168]">{topic.title}</span>
                      <ChevronRight className="w-4 h-4 text-surface-400" />
                    </div>
                    <p className="text-[10px] text-surface-500">{topic.desc}</p>
                  </div>
                )) : (
                  <div className="p-4 text-center text-surface-500 text-sm">No topics found.</div>
                )}
              </div>
            </div>

            {/* Contact Us */}
            <div className="mt-4">
              <h3 className="text-[14px] font-extrabold text-[#192168] mb-1">Contact Us</h3>
              <p className="text-[11px] text-surface-500 mb-4">Choose the best way to reach us</p>
              
              <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
                {/* Chat */}
                <div className="bg-white rounded-[14px] p-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-surface-200 flex flex-col w-[160px] shrink-0">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5 text-[#1668F6]" />
                  </div>
                  <h4 className="text-[13px] font-extrabold text-[#192168] mb-1 flex items-center justify-between">
                    Chat with Us <ChevronRight className="w-3.5 h-3.5 text-surface-400" />
                  </h4>
                  <p className="text-[10px] text-surface-500 mb-3 leading-tight flex-1">Chat instantly with our support team</p>
                  <span className="text-[10px] font-bold text-emerald-600">Available 9AM - 9PM</span>
                </div>

                {/* Call */}
                <div className="bg-white rounded-[14px] p-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-surface-200 flex flex-col w-[160px] shrink-0">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-center mb-3">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-[13px] font-extrabold text-[#192168] mb-1 flex items-center justify-between">
                    Call Us <ChevronRight className="w-3.5 h-3.5 text-surface-400" />
                  </h4>
                  <p className="text-[10px] text-surface-500 mb-3 leading-tight flex-1">Speak with our customer care executive</p>
                  <span className="text-[10px] font-bold text-emerald-600">1800-123-4567</span>
                </div>

                {/* Email */}
                <div className="bg-white rounded-[14px] p-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-surface-200 flex flex-col w-[160px] shrink-0">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-center mb-3">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="text-[13px] font-extrabold text-[#192168] mb-1 flex items-center justify-between">
                    Email Us <ChevronRight className="w-3.5 h-3.5 text-surface-400" />
                  </h4>
                  <p className="text-[10px] text-surface-500 mb-3 leading-tight flex-1">Drop us an email and we'll get back to you</p>
                  <span className="text-[10px] font-bold text-[#1668F6]">{branding.supportEmail}</span>
                </div>
              </div>
            </div>

            {/* Safe & Secure Banner */}
            <div className="bg-[#E8F0FE] rounded-[14px] p-4 flex items-center justify-between gap-3 relative overflow-hidden mt-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 border border-blue-100 z-10">
                <ShieldCheck className="w-5 h-5 text-[#1668F6]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 z-10">
                <h3 className="text-[13px] font-extrabold text-[#192168] mb-0.5">Safe & Secure</h3>
                <p className="text-[10px] text-surface-600 leading-tight">Your information is safe with us. We never share your data with anyone.</p>
              </div>
              
              <div className="absolute right-[-10px] bottom-[-20px] opacity-10 pointer-events-none">
                <ShieldCheck className="w-24 h-24 text-blue-600" />
              </div>
              <div className="absolute top-2 right-12 w-2 h-2 bg-blue-400 rounded-full opacity-40"></div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

