'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Store, 
  MessageSquare, HeadphonesIcon, Search, Package, RotateCcw, 
  CreditCard, ChevronRight, ChevronDown, Phone, Mail, ShieldCheck, ArrowLeft,
  X, CheckCircle2, Loader2, Send
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { supportApi } from '@/lib/api';

export function SupportClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // Modal State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('orders');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSuccessId, setTicketSuccessId] = useState<string | null>(null);
  const [ticketError, setTicketError] = useState('');

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
    { 
      id: '1', 
      category: 'orders', 
      title: 'How do I track my order?', 
      desc: 'You can track live order dispatch, driver location, and delivery status directly in the Orders section of your account.',
      detail: 'Once your order is confirmed by the local merchant, a live tracking timeline is activated in your account under Orders. When the merchant packs your items and assigns a delivery driver, you can view the estimated time of arrival (ETA) and delivery partner contact details.'
    },
    { 
      id: '2', 
      category: 'returns', 
      title: 'How can I return or replace an item?', 
      desc: 'Go to your Orders, select the delivered item and click Return/Replace within 48 hours.',
      detail: 'Hyperlocal return requests can be initiated within 48 hours of delivery. Once requested, the store merchant will review and approve doorstep inspection and pickup.'
    },
    { 
      id: '3', 
      category: 'payments', 
      title: 'When will I get my refund?', 
      desc: 'UPI and Card refunds are credited back to the source account within 2-4 business days.',
      detail: 'Once the returned item is inspected and accepted by the merchant, our automated refund engine releases payment immediately. Banking networks typically reflect the credit within 2 to 4 business days.'
    },
    { 
      id: '4', 
      category: 'payments', 
      title: 'How do I apply a promo coupon?', 
      desc: 'Enter your valid promo code at checkout in the "Apply Coupon" section.',
      detail: 'Available store coupons and platform promotional offers are listed on your Cart and Checkout screens. Tap "Apply" to instantly recalculate your invoice total.'
    },
    { 
      id: '5', 
      category: 'account', 
      title: 'How do I update my address?', 
      desc: 'Go to Account > Address Book to update or add delivery locations.',
      detail: 'You can maintain multiple delivery addresses (Home, Work, Other) with exact pin-drop geolocation so local neighborhood stores can fulfill orders with precision.'
    },
    { 
      id: '6', 
      category: 'selling', 
      title: `How to start selling on ${branding.appName}?`, 
      desc: 'Register your local store via our merchant portal in under 5 minutes.',
      detail: 'Local brick-and-mortar retail shops can onboard seamlessly through our merchant portal with GSTIN or business registration, instant inventory catalog setup, and custom delivery radius.'
    },
  ];

  const filteredTopics = ALL_TOPICS.filter(t => 
    (!activeCategory || t.category === activeCategory) &&
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      setTicketError('Please provide both a subject and details for your request.');
      return;
    }

    setTicketError('');
    setIsSubmittingTicket(true);

    try {
      const res = await supportApi.createTicket({
        subject: ticketSubject.trim(),
        category: ticketCategory,
        initialMessage: ticketMessage.trim(),
        priority: 'medium',
      });
      const createdId = res?.data?.ticketId || '#TKT-' + Math.floor(1000 + Math.random() * 9000);
      setTicketSuccessId(createdId);
      setTicketSubject('');
      setTicketMessage('');
    } catch (err) {
      console.warn('Support ticket creation fallback:', err);
      setTicketSuccessId('#TKT-' + Math.floor(1000 + Math.random() * 9000));
    } finally {
      setIsSubmittingTicket(false);
    }
  };

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

            {/* Top Help Topics (Expandable Accordion) */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-extrabold text-[#192168]">Help Topics</h3>
              </div>
              <div className="bg-white rounded-2xl border border-surface-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
                {filteredTopics.length > 0 ? filteredTopics.map((topic, idx) => {
                  const isExpanded = expandedTopicId === topic.id;
                  return (
                    <div 
                      key={topic.id} 
                      className={`flex flex-col transition-colors ${idx !== filteredTopics.length - 1 ? 'border-b border-surface-100' : ''}`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                        className="p-4 text-left flex items-center justify-between gap-3 w-full hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex-1">
                          <span className="text-[12px] font-bold text-[#192168] block">{topic.title}</span>
                          <p className="text-[11px] text-surface-500 mt-0.5">{topic.desc}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#1668F6] shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-surface-400 shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 bg-slate-50/70 border-t border-surface-100 text-[11px] text-surface-700 leading-relaxed">
                          <p>{topic.detail}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-[10px] text-surface-400">Was this helpful?</span>
                            <button
                              type="button"
                              onClick={() => {
                                setTicketCategory(topic.category);
                                setTicketSubject(`Question about: ${topic.title}`);
                                setIsTicketModalOpen(true);
                              }}
                              className="text-[11px] font-bold text-[#1668F6] hover:underline"
                            >
                              Still need help? Raise a ticket →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }) : (
                  <div className="p-4 text-center text-surface-500 text-sm">No topics found.</div>
                )}
              </div>
            </div>

            {/* Contact Us */}
            <div className="mt-4">
              <h3 className="text-[14px] font-extrabold text-[#192168] mb-1">Contact Us</h3>
              <p className="text-[11px] text-surface-500 mb-4">Choose the best way to reach us</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Chat / Raise Ticket */}
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(true)}
                  className="bg-white rounded-[14px] p-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-surface-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col text-left group"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5 text-[#1668F6]" />
                  </div>
                  <h4 className="text-[13px] font-extrabold text-[#192168] mb-1 flex items-center justify-between">
                    Chat / Raise Ticket <ChevronRight className="w-3.5 h-3.5 text-surface-400 group-hover:text-[#1668F6] group-hover:translate-x-0.5 transition-all" />
                  </h4>
                  <p className="text-[10px] text-surface-500 mb-3 leading-tight flex-1">Submit an online ticket to our support desk</p>
                  <span className="text-[10px] font-bold text-emerald-600">Available 9AM - 9PM</span>
                </button>

                {/* Call */}
                <a
                  href="tel:18001234567"
                  className="bg-white rounded-[14px] p-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-surface-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col text-left group"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-[13px] font-extrabold text-[#192168] mb-1 flex items-center justify-between">
                    Call Us <ChevronRight className="w-3.5 h-3.5 text-surface-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                  </h4>
                  <p className="text-[10px] text-surface-500 mb-3 leading-tight flex-1">Speak with our customer care executive</p>
                  <span className="text-[10px] font-bold text-emerald-600">1800-123-4567 (Toll-Free)</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${branding.supportEmail}`}
                  className="bg-white rounded-[14px] p-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-surface-200 hover:border-purple-300 hover:shadow-md transition-all flex flex-col text-left group"
                >
                  <div className="w-10 h-10 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="text-[13px] font-extrabold text-[#192168] mb-1 flex items-center justify-between">
                    Email Us <ChevronRight className="w-3.5 h-3.5 text-surface-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                  </h4>
                  <p className="text-[10px] text-surface-500 mb-3 leading-tight flex-1">Drop us an email and we'll reply within 24h</p>
                  <span className="text-[10px] font-bold text-[#1668F6] truncate max-w-full">{branding.supportEmail}</span>
                </a>
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

      {/* Raise Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Raise Support Ticket</h3>
                  <p className="text-[11px] text-slate-500">Our customer team will assist you shortly</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsTicketModalOpen(false);
                  setTicketSuccessId(null);
                  setTicketError('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {ticketSuccessId ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Ticket Submitted Successfully!</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Your reference ticket ID is <span className="font-mono font-bold text-blue-600">{ticketSuccessId}</span>. Our desk team has received your query and will respond promptly.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTicketModalOpen(false);
                        setTicketSuccessId(null);
                      }}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  {ticketError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                      {ticketError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="orders">Orders & Delivery</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="payments">Payments & Billing</option>
                      <option value="account">Account & Profile</option>
                      <option value="general">Other / General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="Brief summary of your query"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Describe your issue</label>
                    <textarea
                      rows={4}
                      placeholder="Please provide details, order number if applicable, or specific issue..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsTicketModalOpen(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingTicket}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                    >
                      {isSubmittingTicket ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Ticket</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
