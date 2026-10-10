'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Calendar, ShoppingBag, 
  Ticket, HelpCircle, FileText, Shield, 
  ChevronRight, ArrowLeft, Users, ShieldCheck, CheckCircle2,
  AlertCircle, Search, HeadphonesIcon
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';

const HIGHLIGHTS = [
  { icon: <Users className="w-5 h-5 text-blue-500" />, title: 'User Agreement', desc: `By using ${branding.appName}, you agree to these terms.` },
  { icon: <ShoppingBag className="w-5 h-5 text-emerald-500" />, title: 'Use of Services', desc: 'Use our app and services only for lawful purposes.' },
  { icon: <ShieldCheck className="w-5 h-5 text-purple-500" />, title: 'Your Responsibilities', desc: 'Provide accurate information and keep your account secure.' },
  { icon: <FileText className="w-5 h-5 text-orange-500" />, title: 'Policy Updates', desc: 'We may update these terms. Continued use means you accept the changes.' },
];

const SECTIONS = [
  { id: 1, title: '1. Acceptance of Terms', desc: `By accessing or using ${branding.appName}, you agree to be bound by these Terms and Conditions.`, icon: <FileText className="w-4 h-4 text-blue-500" /> },
  { id: 2, title: `2. About ${branding.appName}`, desc: `Learn about ${branding.appName}, our platform and the services we provide.`, icon: <AlertCircle className="w-4 h-4 text-blue-500" /> },
  { id: 3, title: '3. User Accounts', desc: 'Rules and responsibilities related to creating and managing your account.', icon: <User className="w-4 h-4 text-blue-500" /> },
  { id: 4, title: '4. Use of Services', desc: `Guidelines for using ${branding.appName} and what you can expect from our services.`, icon: <ShoppingBag className="w-4 h-4 text-blue-500" /> },
  { id: 5, title: '5. Orders and Payments', desc: 'Information about placing orders, pricing and payment methods.', icon: <Ticket className="w-4 h-4 text-blue-500" /> },
  { id: 6, title: '6. Returns and Refunds', desc: 'Our policy on returns, refunds and cancellations.', icon: <HelpCircle className="w-4 h-4 text-blue-500" /> },
  { id: 7, title: '7. Prohibited Activities', desc: `Activities that are not allowed on ${branding.appName}.`, icon: <Shield className="w-4 h-4 text-blue-500" /> },
  { id: 8, title: '8. Limitation of Liability', desc: 'Limitations of our liability to the fullest extent permitted by law.', icon: <ShieldCheck className="w-4 h-4 text-blue-500" /> },
  { id: 9, title: '9. Governing Law', desc: 'These terms are governed by the laws of India.', icon: <AlertCircle className="w-4 h-4 text-blue-500" /> },
  { id: 10, title: '10. Contact Us', desc: 'How to reach us for any questions about these terms.', icon: <HeadphonesIcon className="w-4 h-4 text-blue-500" /> },
];

export function TermsClient() {
  const router = useRouter();
  const [termsData, setTermsData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = SECTIONS.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    section.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );


  useEffect(() => {
    // TODO: Connect to backend API for fetching terms dynamically
    const fetchTerms = async () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          setTermsData({
            lastUpdated: '20 May 2025'
          });
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch terms', error);
        setIsLoading(false);
      }
    };
    fetchTerms();
  }, []);

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
                <div className="flex items-center gap-2 mb-4">
                  <button type="button" onClick={() => router.back()} className="shrink-0 lg:hidden">
                    <ArrowLeft className="w-6 h-6 text-[#192168]" />
                  </button>
                  <h1 className="text-[24px] md:text-[32px] font-extrabold text-[#192168] leading-tight">Terms & Conditions</h1>
                </div>
                <p className="text-[12px] text-surface-500 leading-relaxed max-w-[220px] mb-4">
                  Please read these terms and conditions carefully before using {branding.appName}.
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#192168]" />
                  <span className="text-[11px] text-surface-600 font-medium">Last updated: {isLoading ? '...' : (termsData?.lastUpdated as string)}</span>
                </div>
              </div>

              {/* Decorative Graphic */}
              <div className="relative shrink-0 w-[120px] h-[120px] pointer-events-none z-0">
                <div className="absolute right-0 top-0 w-28 h-28 flex flex-col items-center justify-center bg-[#E8F0FE] rounded-lg border border-blue-200">
                  <div className="w-3/4 h-2 bg-blue-200 rounded-full mb-3"></div>
                  <div className="w-5/6 h-2 bg-blue-200 rounded-full mb-3"></div>
                  <div className="w-5/6 h-2 bg-blue-200 rounded-full mb-3"></div>
                  <div className="w-2/3 h-2 bg-blue-200 rounded-full mb-3"></div>
                  <div className="w-3/4 h-2 bg-blue-200 rounded-full mb-3"></div>
                </div>
                <div className="absolute -left-6 bottom-4 w-16 h-20 bg-blue-500 rounded-full flex items-center justify-center z-20 shadow-md" style={{ clipPath: 'polygon(50% 0%, 100% 15%, 100% 75%, 50% 100%, 0% 75%, 0% 15%)' }}>
                   <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -right-2 -bottom-2 text-emerald-400">
                  <LeafIcon />
                </div>
                <div className="absolute top-2 -left-2 text-blue-200 text-xs">✦</div>
                <div className="absolute top-12 -right-4 text-blue-200 text-xs">✦</div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="mt-6">
              <h3 className="text-[14px] font-extrabold text-[#192168] mb-4">Key Highlights</h3>
              <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
                {HIGHLIGHTS.map((item, idx) => (
                  <div key={idx} className="w-[140px] shrink-0 bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-surface-200 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-surface-50 flex items-center justify-center mb-3">
                      {item.icon}
                    </div>
                    <h4 className="text-[11px] font-extrabold text-[#192168] mb-1.5">{item.title}</h4>
                    <p className="text-[9px] text-surface-500 leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms Contents */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-extrabold text-[#192168]">Terms & Conditions</h3>
              </div>

              {/* Search Input */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-surface-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search terms..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-surface-200 rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-[#192168] focus:outline-none focus:border-[#1668F6] focus:ring-1 focus:ring-[#1668F6]/20 transition-all placeholder:text-surface-400 shadow-sm"
                />
              </div>

              <div className="bg-white rounded-2xl border border-surface-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
                {filteredSections.length > 0 ? (
                  filteredSections.map((section, idx) => (
                    <button key={idx} className={`flex items-start gap-3 p-4 hover:bg-surface-50 transition-colors text-left ${idx !== filteredSections.length - 1 ? 'border-b border-surface-100' : ''}`}>
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        {section.icon}
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="text-[12px] font-bold text-[#192168] mb-1">{section.title}</h4>
                        <p className="text-[10px] text-surface-500 leading-tight">{section.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-surface-400 shrink-0 mt-2" />
                    </button>
                  ))
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
              <p className="text-[10px] text-[#192168] leading-tight font-medium">
                By continuing to use {branding.appName}, you acknowledge that you have read, understood and agree to these Terms & Conditions.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function LeafIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 12 16 16 12C20 8 22 10 22 10C22 10 18 14 16 18C14 22 12 22 12 22Z" fill="currentColor"/>
      <path d="M12 22C12 22 12 16 8 12C4 8 2 10 2 10C2 10 6 14 8 18C10 22 12 22 12 22Z" fill="currentColor"/>
    </svg>
  );
}

