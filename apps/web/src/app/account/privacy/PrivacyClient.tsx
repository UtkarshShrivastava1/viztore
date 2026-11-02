'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Lock, Eye,
  ChevronDown, ArrowLeft, Search, Calendar
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';

const PRIVACY_SECTIONS = [
  {
    id: 1,
    title: '1. Information We Collect',
    desc: 'Personal information, location data, and device telemetry gathered.',
    body: `We collect information necessary to deliver hyperlocal orders: your name, mobile phone number, email address, delivery addresses, and real-time GPS coordinates (when permission is granted). When browsing, device telemetry, browser type, and IP address are logged for session authentication and fraud detection.`,
  },
  {
    id: 2,
    title: '2. How We Use Your Information',
    desc: 'Fulfilling orders, dispatching riders, and personalizing store listings.',
    body: `Your information is utilized exclusively to: (a) calculate spatial distance to nearby stores within your 3–4 km delivery zone; (b) route orders to merchant fulfillment registers; (c) coordinate courier pickup and dropoff; (d) notify you regarding real-time order status updates; and (e) prevent fraudulent cart activities.`,
  },
  {
    id: 3,
    title: '3. Data Sharing & Third Parties',
    desc: 'Authorized partners: merchants, delivery couriers, and payment processors.',
    body: `We never sell your personal data. We disclose only essential order details to the specific merchant fulfilling your order and the assigned rider navigating to your location. Secure payment processing is handled through PCI-DSS compliant gateways where card credentials never touch our servers.`,
  },
  {
    id: 4,
    title: '4. Location Data & Geolocation Accuracy',
    desc: 'Handling of foreground and background location permissions.',
    body: `Precise location data is used solely to display stores operating in your vicinity and calculate accurate delivery estimates. You may disable GPS access at any time through your device settings and choose delivery locations manually via saved addresses or locality lookup.`,
  },
  {
    id: 5,
    title: '5. Data Security & Encryption Standards',
    desc: 'Industry-standard encryption, SSL/TLS protocols, and access controls.',
    body: `All communications between client applications and backend APIs are encrypted using TLS 1.3. User passwords and tokens are hashed using salted bcrypt cryptography. Our databases employ 256-bit AES encryption at rest with strict role-based access controls.`,
  },
  {
    id: 6,
    title: '6. Cookies & Local Session Storage',
    desc: 'Session persistence, cart persistence, and auth token handling.',
    body: `We use essential browser cookies and local storage to maintain your logged-in session, remember your active delivery address, and safeguard your single-store cart items across browser reloads. We do not use intrusive third-party cross-site tracking cookies.`,
  },
  {
    id: 7,
    title: '7. Your Rights & Data Portability',
    desc: 'Accessing, updating, or requesting deletion of your personal account.',
    body: `Under applicable digital data protection regulations, you have the right to inspect, correct, export, or request permanent deletion of your profile data. You can manage saved addresses and profile details directly from the Account portal or contact our privacy desk for account erasure.`,
  },
  {
    id: 8,
    title: '8. Grievance Officer & Contact Information',
    desc: 'Contact details for privacy concerns, data inquiries, and audit requests.',
    body: `For questions, data access requests, or privacy concerns, please contact our designated Data Protection Officer at ${branding.supportEmail} or submit a ticket through the 24x7 Support Help Desk in your customer account.`,
  },
];

export function PrivacyClient() {
  const router = useRouter();
  const [openSectionId, setOpenSectionId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = PRIVACY_SECTIONS.filter(section => 
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
                  <h1 className="text-[24px] md:text-[32px] font-extrabold text-[#192168] leading-tight">Privacy Policy</h1>
                </div>
                <p className="text-[12px] text-surface-500 leading-relaxed max-w-sm mb-3">
                  How {branding.appName} protects, processes, and respects your personal information.
                </p>
                <div className="flex items-center gap-2 text-surface-500 text-[11px] font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#1668F6]" />
                  <span>Effective Date: October 2026</span>
                </div>
              </div>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-[#1668F6] flex items-center justify-center shrink-0 shadow-2xs">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">End-to-End Encrypted</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">TLS 1.3 & AES-256 protected</p>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Never Sold to Advertisers</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Zero third-party monetization</p>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Complete Transparency</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Full control over your data</p>
                </div>
              </div>
            </div>

            {/* Policy Accordions */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-extrabold text-[#192168]">Privacy Principles & Disclosures</h3>
                <span className="text-xs text-gray-500">{filteredSections.length} sections</span>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-surface-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search in privacy policies..." 
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
                          className="w-full flex items-start justify-between p-4 hover:bg-surface-50 transition-colors text-left cursor-pointer"
                        >
                          <div className="pr-4">
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
                          <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-dashed border-gray-100 mt-1 animate-in fade-in duration-200">
                            {section.body}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-surface-500 text-[12px]">
                    No policies found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>

            {/* Questions Banner */}
            <div className="bg-[#E8F0FE] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-2">
              <div>
                <h3 className="text-[13px] font-extrabold text-[#192168] mb-1">Questions about your privacy?</h3>
                <p className="text-[11px] text-surface-600 leading-tight">Our support team is here to assist you with data requests and privacy rights.</p>
              </div>
              <button 
                type="button"
                onClick={() => router.push('/account/support')} 
                className="px-4 py-2 bg-white rounded-xl border border-[#1668F6] text-[#1668F6] text-[11.5px] font-bold hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
              >
                Contact Support
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
