'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Shield, ArrowLeft,
  ShieldCheck, Lock, EyeOff, CheckCircle2, ChevronRight, Search,
  ChevronsUpDown, FileText, Database, Share2
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';

interface PolicySection {
  id: number;
  title: string;
  desc: string;
  icon: React.ReactNode;
  details: string[];
}

const SECTIONS: PolicySection[] = [
  {
    id: 1,
    title: '1. Information We Collect',
    desc: 'Types of data collected when you use our platform.',
    icon: <Database className="w-4 h-4 text-blue-500" />,
    details: [
      `Personal Profile Details: Your name, mobile number, email address, and delivery addresses provided during registration and checkout.`,
      `Device & Location Data: Approximate and precise GPS coordinates (with your permission) to calculate delivery distances, verify delivery zone feasibility, and recommend nearby local stores.`,
      `Transactional Records: Details of ordered products, billing invoices, payment statuses, and customer support communications.`,
    ],
  },
  {
    id: 2,
    title: '2. How We Use Your Information',
    desc: 'Purpose and legitimate interests for processing your data.',
    icon: <Lock className="w-4 h-4 text-blue-500" />,
    details: [
      `To process, fulfill, and deliver orders placed with local merchant stores across our network.`,
      `To transmit real-time order status updates, delivery OTPs, and rider tracking notifications.`,
      `To detect, prevent, and mitigate fraudulent transactions, coupon abuse, and unauthorized account access.`,
      `To improve store recommendations and refine catalog search relevance based on localized demand.`,
    ],
  },
  {
    id: 3,
    title: '3. Information Sharing & Disclosure',
    desc: 'Strict controls on how data is shared with fulfillment partners.',
    icon: <Share2 className="w-4 h-4 text-blue-500" />,
    details: [
      `Local Merchant Stores: We share your delivery recipient name, delivery address, and ordered items with the fulfilling merchant store solely to prepare and package your items.`,
      `Delivery Partners: Assigned delivery riders receive your address and delivery instructions strictly to complete the last-mile package drop-off.`,
      `We strictly do NOT sell, rent, or trade your personal information or browsing data to third-party data brokers or marketing agencies.`,
    ],
  },
  {
    id: 4,
    title: '4. Data Security & Storage',
    desc: 'Bank-grade encryption and access controls protecting your data.',
    icon: <ShieldCheck className="w-4 h-4 text-blue-500" />,
    details: [
      `All communication between your device and our servers is secured using modern TLS 1.3 cryptographic protocols.`,
      `Sensitive authentication credentials (passwords, OTP sessions) are hashed and protected with restricted internal access controls.`,
      `Payment processing is handled through RBI-certified, PCI-DSS compliant payment gateways; we do not store sensitive credit/debit card CVVs.`,
    ],
  },
  {
    id: 5,
    title: '5. Your Privacy Rights & Controls',
    desc: 'How you can manage, access, or delete your personal data.',
    icon: <User className="w-4 h-4 text-blue-500" />,
    details: [
      `Access & Edit: You can review and update your profile details and saved delivery addresses anytime in your account settings.`,
      `Data Deletion: You may request the permanent closure of your account and erasure of personal data by contacting our support team.`,
      `Notification Preferences: You can manage notification settings while continuing to receive essential transactional order alerts.`,
    ],
  },
  {
    id: 6,
    title: '6. Policy Updates & Contact',
    desc: 'Notifications regarding policy revisions and contact channels.',
    icon: <FileText className="w-4 h-4 text-blue-500" />,
    details: [
      `We may update this Privacy Policy periodically to reflect enhancements in platform features or changes in statutory data protection laws.`,
      `When significant changes are made, we will notify users through the app and update the 'Last Updated' timestamp above.`,
      `For any privacy inquiries or grievance redressal, please write to privacy@viztore.com or visit the Help & Support section.`,
    ],
  },
];

const HIGHLIGHTS = [
  { icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, title: 'Secure', desc: 'Bank-grade encryption' },
  { icon: <Lock className="w-5 h-5 text-blue-500" />, title: 'Your Data', desc: 'Never sold to 3rd parties' },
  { icon: <EyeOff className="w-5 h-5 text-purple-500" />, title: 'No Spam', desc: 'You control emails' },
  { icon: <User className="w-5 h-5 text-rose-500" />, title: 'Your Control', desc: 'Delete data anytime' },
];

export function PrivacyClient() {
  const router = useRouter();
  
  const [policyData, setPolicyData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<number[]>([1]);

  const filteredSections = SECTIONS.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.details.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      setOpenSections(filteredSections.map(s => s.id));
    }
  }, [searchQuery]);

  const toggleSection = (id: number) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExpandAll = () => {
    setOpenSections(filteredSections.map(s => s.id));
  };

  const handleCollapseAll = () => {
    setOpenSections([]);
  };

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          setPolicyData({
            lastUpdated: '20 May 2025'
          });
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.error('Failed to fetch privacy policy', error);
        setIsLoading(false);
      }
    };
    fetchPrivacyPolicy();
  }, []);

  const allExpanded = filteredSections.length > 0 && filteredSections.every(s => openSections.includes(s.id));

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
                  <button 
                    type="button" 
                    onClick={() => router.back()} 
                    aria-label="Go back"
                    className="shrink-0 lg:hidden p-1 text-[#192168] hover:text-[#1668F6] transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6 text-[#192168]" />
                  </button>
                  <h1 className="text-[24px] md:text-[32px] font-extrabold text-[#192168] leading-tight">Privacy Policy</h1>
                </div>
                <p className="text-[12px] text-surface-500 leading-relaxed max-w-[280px]">
                  Your privacy is important to us. This Privacy Policy explains how {branding.appName} collects, uses, discloses and protects your information.
                </p>
              </div>

              {/* Decorative Graphic */}
              <div className="relative shrink-0 w-[120px] h-[100px] pointer-events-none z-0">
                <div className="absolute right-0 top-0 w-24 h-24 flex items-center justify-center">
                  <Shield className="w-full h-full text-[#1668F6]" strokeWidth={1.5} />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#E8F0FE] rounded-full flex items-center justify-center">
                     <Lock className="w-4 h-4 text-[#1668F6]" />
                  </div>
                </div>
                <div className="absolute top-8 left-0 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center transform -rotate-12 shadow-sm">
                  <Lock className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="absolute bottom-4 right-1 text-[#10B981] text-xs">✦</div>
                <div className="absolute top-10 right-24 text-[#1668F6] text-xs">✦</div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="mt-4">
              <h3 className="text-[14px] font-extrabold text-[#192168] mb-4">Key Highlights</h3>
              <div className="flex flex-wrap gap-3">
                {HIGHLIGHTS.map((item, idx) => (
                  <div key={idx} className="w-[calc(50%-6px)] bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-surface-200 flex flex-col">
                    <div className="w-10 h-10 rounded-full bg-surface-50 flex items-center justify-center mb-3">
                      {item.icon}
                    </div>
                    <h4 className="text-[12px] font-extrabold text-[#192168] mb-1">{item.title}</h4>
                    <p className="text-[10px] text-surface-500 leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Policy Contents (Accordion) */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-extrabold text-[#192168]">Policy Contents</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {filteredSections.length} sections
                  </span>
                </div>
                {filteredSections.length > 0 && (
                  <button
                    type="button"
                    onClick={allExpanded ? handleCollapseAll : handleExpandAll}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#1668F6] hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    <ChevronsUpDown className="w-3.5 h-3.5" />
                    <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
                  </button>
                )}
              </div>

              {/* Search Input */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-surface-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search policies..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-surface-200 rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-[#192168] focus:outline-none focus:border-[#1668F6] focus:ring-1 focus:ring-[#1668F6]/20 transition-all placeholder:text-surface-400 shadow-sm"
                />
              </div>

              {/* Accordion Container */}
              <div className="bg-white rounded-2xl border border-surface-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col divide-y divide-surface-100">
                {filteredSections.length > 0 ? (
                  filteredSections.map((section) => {
                    const isOpen = openSections.includes(section.id);
                    return (
                      <div key={section.id} className="transition-colors">
                        <button 
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          aria-expanded={isOpen}
                          aria-controls={`policy-content-${section.id}`}
                          className={`w-full flex items-start gap-3 p-4 text-left cursor-pointer transition-all ${
                            isOpen ? 'bg-blue-50/40' : 'hover:bg-surface-50/70'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isOpen ? 'bg-blue-100 text-[#1668F6]' : 'bg-blue-50'
                          }`}>
                            {section.icon}
                          </div>

                          <div className="flex-1 min-w-0 pr-2">
                            <h4 className={`text-[13px] font-bold mb-0.5 transition-colors ${
                              isOpen ? 'text-[#1668F6]' : 'text-[#192168]'
                            }`}>
                              {section.title}
                            </h4>
                            <p className="text-[11px] text-surface-500 leading-tight">
                              {section.desc}
                            </p>
                          </div>

                          <div className="shrink-0 mt-1.5 p-1 rounded-full text-surface-400">
                            <ChevronRight 
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isOpen ? 'rotate-90 text-[#1668F6]' : 'text-surface-400'
                              }`} 
                            />
                          </div>
                        </button>

                        {isOpen && (
                          <div 
                            id={`policy-content-${section.id}`}
                            className="px-5 pb-5 pt-2 bg-gradient-to-b from-blue-50/30 to-white border-t border-surface-100/70 text-[12px] text-surface-700 space-y-2.5 animate-fadeIn"
                          >
                            {section.details.map((paragraph, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2.5 leading-relaxed">
                                <span className="text-[#1668F6] font-extrabold text-sm leading-none shrink-0 mt-0.5">•</span>
                                <p className="text-surface-600">{paragraph}</p>
                              </div>
                            ))}
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
            <div className="bg-[#E8F0FE] rounded-2xl p-5 flex flex-col gap-3 relative mt-4 border border-blue-100">
              <div>
                <h3 className="text-[13px] font-extrabold text-[#192168] mb-1">Questions about your privacy?</h3>
                <p className="text-[11px] text-surface-600 leading-tight">Our support team is here to help you understand how your data is handled.</p>
              </div>
              <button 
                type="button" 
                onClick={() => router.push('/account/support')} 
                className="self-start px-4 py-2 bg-white rounded-lg border border-[#1668F6] text-[#1668F6] text-[11px] font-bold hover:bg-blue-50 transition-colors cursor-pointer"
              >
                Contact Support
              </button>
            </div>

            {/* Last Updated */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
               <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
               <span className="text-[10px] text-surface-500">Last updated: {isLoading ? '...' : String(policyData?.lastUpdated || '')}</span>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
