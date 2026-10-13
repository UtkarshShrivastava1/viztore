'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Shield, ArrowLeft,
  ShieldCheck, Lock, EyeOff, CheckCircle2, ChevronRight, Search
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';

const SECTIONS = [
  '1. Information We Collect',
  '2. How We Use Your Information',
  '3. Information Sharing',
  '4. Data Security',
  '5. Your Rights',
  '6. Changes to This Policy',
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

  const filteredSections = SECTIONS.filter(section => 
    section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // TODO: Connect to backend API for fetching privacy policy dynamically
    const fetchPrivacyPolicy = async () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          setPolicyData({
            lastUpdated: '20 May 2025'
          });
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch privacy policy', error);
        setIsLoading(false);
      }
    };
    fetchPrivacyPolicy();
  }, []);


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
                  <h1 className="text-[24px] md:text-[32px] font-extrabold text-[#192168] leading-tight">Privacy Policy</h1>
                </div>
                <p className="text-[12px] text-surface-500 leading-relaxed max-w-[220px]">
                  Your privacy is important to us. This Privacy Policy explains how {branding.appName} collects, uses, discloses and protects your information...
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

            {/* Policy Contents */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-extrabold text-[#192168]">Policy Contents</h3>
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

              <div className="bg-white rounded-2xl border border-surface-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
                {filteredSections.length > 0 ? (
                  filteredSections.map((section, idx) => (
                    <button key={idx} className={`flex items-center justify-between p-4 hover:bg-surface-50 transition-colors text-left ${idx !== filteredSections.length - 1 ? 'border-b border-surface-100' : ''}`}>
                      <span className="text-[12px] font-semibold text-[#192168]">{section}</span>
                      <ChevronRight className="w-4 h-4 text-surface-400" />
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-surface-500 text-[12px]">
                    No policies found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>

            {/* Questions Banner */}
            <div className="bg-[#E8F0FE] rounded-2xl p-5 flex flex-col gap-3 relative mt-4">
              <div>
                <h3 className="text-[13px] font-extrabold text-[#192168] mb-1">Questions about your privacy?</h3>
                <p className="text-[10px] text-surface-600 leading-tight">Our support team is here to help you understand how your data is handled.</p>
              </div>
              <button onClick={() => router.push('/account/support')} className="self-start px-4 py-2 bg-white rounded-lg border border-[#1668F6] text-[#1668F6] text-[11px] font-bold">
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

