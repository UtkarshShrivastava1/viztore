'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Calendar, ShoppingBag, 
  Ticket, HelpCircle, FileText, Shield, 
  ChevronDown, ArrowLeft, Users, ShieldCheck, CheckCircle2,
  AlertCircle, Search, HeadphonesIcon
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';

const HIGHLIGHTS = [
  { icon: <Users className="w-5 h-5 text-blue-500" />, title: 'User Agreement', desc: `By using ${branding.appName}, you agree to these terms.` },
  { icon: <ShoppingBag className="w-5 h-5 text-emerald-500" />, title: 'Use of Services', desc: 'Use our app and services only for lawful purposes.' },
  { icon: <ShieldCheck className="w-5 h-5 text-purple-500" />, title: 'Your Responsibilities', desc: 'Provide accurate information and keep your account secure.' },
  { icon: <FileText className="w-5 h-5 text-orange-500" />, title: 'Policy Updates', desc: 'We may update these terms. Continued use means you accept changes.' },
];

const SECTIONS = [
  { 
    id: 1, 
    title: '1. Acceptance of Terms', 
    desc: `By accessing or using ${branding.appName}, you agree to be bound by these Terms and Conditions.`,
    body: `These Terms and Conditions constitute a legally binding agreement between you and ${branding.appName}. By accessing, browsing, or placing an order on our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these terms, you must refrain from using the platform immediately.`,
    icon: <FileText className="w-4 h-4 text-blue-500" /> 
  },
  { 
    id: 2, 
    title: `2. About ${branding.appName}`, 
    desc: `Learn about ${branding.appName}, our platform and the services we provide.`,
    body: `${branding.appName} operates as a hyperlocal multi-vendor marketplace connecting consumers with verified neighborhood retailers within a 3–4 kilometer radius. We facilitate product discovery, order transmission, payment processing, and local courier delivery. Individual stores maintain inventory accuracy and product quality.`,
    icon: <AlertCircle className="w-4 h-4 text-blue-500" /> 
  },
  { 
    id: 3, 
    title: '3. User Accounts & Security', 
    desc: 'Rules and responsibilities related to creating and managing your account.',
    body: `When creating an account, you must provide accurate, current, and complete information. You are solely responsible for maintaining the confidentiality of your credentials and for all activities conducted through your account. Please notify support immediately upon detecting any unauthorized access.`,
    icon: <User className="w-4 h-4 text-blue-500" /> 
  },
  { 
    id: 4, 
    title: '4. Ordering & Single-Store Rule', 
    desc: `Guidelines for placing orders, store separation, and fulfillment.`,
    body: `To ensure 30-minute delivery speed, your shopping cart can contain products from exactly one merchant at a time. Adding an item from a different store prompts confirmation to clear or complete your existing cart. Orders are subject to merchant acceptance and live inventory confirmation.`,
    icon: <ShoppingBag className="w-4 h-4 text-blue-500" /> 
  },
  { 
    id: 5, 
    title: '5. Pricing, GST & Payments', 
    desc: 'Information about item prices, applicable taxes, and payment gateways.',
    body: `All listed prices are in Indian Rupees (INR) and inclusive of applicable GST unless explicitly stated otherwise. Delivery fees and platform service fees are transparently itemized at checkout. We support UPI, credit/debit cards, net banking, and Cash on Delivery (COD) subject to merchant availability.`,
    icon: <Ticket className="w-4 h-4 text-blue-500" /> 
  },
  { 
    id: 6, 
    title: '6. Cancellations & Returns', 
    desc: 'Our policy on order cancellations, returns, and refund turnarounds.',
    body: `Orders can be cancelled free of charge prior to store preparation. Perishable groceries and custom-prepared items cannot be returned once dispatched unless defective or incorrect. Non-perishable goods carry a 7-day doorstep return policy. Refunds are processed to original payment method within 3–5 business days.`,
    icon: <HelpCircle className="w-4 h-4 text-blue-500" /> 
  },
  { 
    id: 7, 
    title: '7. Prohibited Conduct', 
    desc: `Activities that are strictly prohibited on ${branding.appName}.`,
    body: `Users must not use the platform for fraudulent transactions, impersonate other individuals, upload malicious code, reverse-engineer proprietary software, or harass merchants, delivery riders, or support personnel. Violations result in immediate account termination.`,
    icon: <Shield className="w-4 h-4 text-blue-500" /> 
  },
  { 
    id: 8, 
    title: '8. Limitation of Liability', 
    desc: 'Platform liability limits under applicable Indian consumer regulations.',
    body: `${branding.appName} provides an intermediary technology platform. While we conduct merchant vetting, we are not directly liable for warranties, product defects, or manufacturer warranties beyond our direct platform fulfillment commitments, to the maximum extent permitted under applicable law.`,
    icon: <ShieldCheck className="w-4 h-4 text-blue-500" /> 
  },
  { 
    id: 9, 
    title: '9. Governing Law & Dispute Resolution', 
    desc: 'Jurisdiction and statutory framework governing these terms.',
    body: `These Terms shall be governed by and construed in accordance with the laws of India. Any legal dispute, controversy, or claim arising out of or relating to platform usage shall be subject to the exclusive jurisdiction of the competent courts of Raipur, Chhattisgarh, India.`,
    icon: <AlertCircle className="w-4 h-4 text-blue-500" /> 
  },
  { 
    id: 10, 
    title: '10. Grievance Redressal & Contact', 
    desc: 'How to contact our designated customer support & grievance officer.',
    body: `In compliance with the Information Technology Act and Consumer Protection Rules, if you have complaints or grievances regarding platform services, please reach our Grievance Officer at ${branding.supportEmail} or via the 24x7 Help Desk in your account portal.`,
    icon: <HeadphonesIcon className="w-4 h-4 text-blue-500" /> 
  },
];

export function TermsClient() {
  const router = useRouter();
  const [openSectionId, setOpenSectionId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = SECTIONS.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    section.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSection = (id: number) => {
    setOpenSectionId(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] font-sans relative pb-24">
      <main className="max-w-[1680px] mx-auto px-4 lg:px-8 py-4 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Sidebar */}
        <AccountSidebar />

        {/* Right Content */}
        <div className="flex-1 w-full min-w-0 flex flex-col pt-2">
          
          <div className="flex flex-col gap-5 relative z-10">
            
            {/* Header Area */}
            <div className="flex items-start justify-between relative">
              <div className="flex-1 min-w-0 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <button type="button" onClick={() => router.back()} className="shrink-0 lg:hidden cursor-pointer">
                    <ArrowLeft className="w-6 h-6 text-[#192168]" />
                  </button>
                  <h1 className="text-[24px] md:text-[32px] font-extrabold text-[#192168] leading-tight">Terms & Conditions</h1>
                </div>
                <p className="text-[12px] text-surface-500 leading-relaxed max-w-sm mb-3">
                  Please review these terms governing your access to and use of {branding.appName}.
                </p>
                <div className="flex items-center gap-2 text-surface-500 text-[11px] font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#1668F6]" />
                  <span>Effective Date: October 2026</span>
                </div>
              </div>
            </div>

            {/* Highlights Carousel/Grid */}
            <div className="overflow-x-auto scrollbar-hide pb-1">
              <div className="flex gap-3 min-w-max">
                {HIGHLIGHTS.map((item, idx) => (
                  <div key={idx} className="w-[150px] shrink-0 bg-white rounded-2xl p-3.5 shadow-2xs border border-surface-200 flex flex-col items-center text-center">
                    <div className="w-9 h-9 rounded-full bg-surface-50 flex items-center justify-center mb-2.5">
                      {item.icon}
                    </div>
                    <h4 className="text-[11.5px] font-extrabold text-[#192168] mb-1">{item.title}</h4>
                    <p className="text-[9.5px] text-surface-500 leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms Accordion Container */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-extrabold text-[#192168]">Platform Policies & Agreement</h3>
                <span className="text-xs text-gray-500">{filteredSections.length} sections</span>
              </div>

              {/* Search Input */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-surface-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search in terms and conditions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-surface-200 rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-[#192168] focus:outline-none focus:border-[#1668F6] focus:ring-1 focus:ring-[#1668F6]/20 transition-all placeholder:text-surface-400 shadow-2xs"
                />
              </div>

              <div className="bg-white rounded-2xl border border-surface-200 shadow-2xs overflow-hidden flex flex-col divide-y divide-surface-100">
                {filteredSections.length > 0 ? (
                  filteredSections.map((section) => {
                    const isOpen = openSectionId === section.id;
                    return (
                      <div key={section.id} className="transition-colors">
                        <button 
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-start gap-3 p-4 hover:bg-surface-50 transition-colors text-left cursor-pointer"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isOpen ? 'bg-[#1668F6] text-white shadow-2xs' : 'bg-blue-50 text-[#1668F6]'
                          }`}>
                            {section.icon}
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <h4 className={`text-[12.5px] font-bold mb-0.5 transition-colors ${isOpen ? 'text-[#1668F6]' : 'text-[#192168]'}`}>
                              {section.title}
                            </h4>
                            <p className="text-[10.5px] text-surface-500 leading-tight">{section.desc}</p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-surface-400 shrink-0 mt-1 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#1668F6]' : ''
                          }`} />
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 ml-11 mr-4 text-xs text-gray-600 leading-relaxed border-t border-dashed border-gray-100 mt-1 animate-in fade-in duration-200">
                            {section.body}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-surface-500 text-[12px]">
                    No terms found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Acknowledgment Banner */}
            <div className="bg-[#E8F0FE] rounded-xl p-4 flex items-center gap-3 relative mt-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <p className="text-[10.5px] text-[#192168] leading-tight font-medium">
                By continuing to use {branding.appName}, you acknowledge that you have read, understood and agree to these Terms & Conditions.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
