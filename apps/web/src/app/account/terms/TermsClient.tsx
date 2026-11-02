'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Calendar, ShoppingBag, 
  Ticket, HelpCircle, FileText, Shield, 
  ChevronRight, ArrowLeft, Users, ShieldCheck, CheckCircle2,
  AlertCircle, Search, HeadphonesIcon, ChevronsUpDown
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';

const HIGHLIGHTS = [
  { icon: <Users className="w-5 h-5 text-blue-500" />, title: 'User Agreement', desc: `By using ${branding.appName}, you agree to these terms.` },
  { icon: <ShoppingBag className="w-5 h-5 text-emerald-500" />, title: 'Use of Services', desc: 'Use our app and services only for lawful purposes.' },
  { icon: <ShieldCheck className="w-5 h-5 text-purple-500" />, title: 'Your Responsibilities', desc: 'Provide accurate information and keep your account secure.' },
  { icon: <FileText className="w-5 h-5 text-orange-500" />, title: 'Policy Updates', desc: 'We may update these terms. Continued use means you accept the changes.' },
];

interface TermSection {
  id: number;
  title: string;
  desc: string;
  icon: React.ReactNode;
  details: string[];
}

const SECTIONS: TermSection[] = [
  {
    id: 1,
    title: '1. Acceptance of Terms',
    desc: `By accessing or using ${branding.appName}, you agree to be bound by these Terms and Conditions.`,
    icon: <FileText className="w-4 h-4 text-blue-500" />,
    details: [
      `By downloading, installing, browsing, or accessing any part of the ${branding.appName} platform (including our web application, mobile views, and related services), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms and Conditions and our Privacy Policy.`,
      `If you do not agree with any part of these Terms and Conditions, you must refrain from accessing, browsing, or using our platform and discontinue your account usage immediately.`,
      `These terms apply equally to all visitors, buyers, registered users, and participating merchant store partners across the Viztore network.`,
    ],
  },
  {
    id: 2,
    title: `2. About ${branding.appName}`,
    desc: `Learn about ${branding.appName}, our platform and the services we provide.`,
    icon: <AlertCircle className="w-4 h-4 text-blue-500" />,
    details: [
      `${branding.appName} operates as a hyperlocal marketplace and multi-store digital platform that connects neighborhood consumers with local retail stores, shops, and verified merchants.`,
      `We provide the technology infrastructure that enables customer product discovery, digital catalog browsing, localized order placement, real-time status notifications, and delivery coordination.`,
      `Unless expressly marked otherwise, products listed on ${branding.appName} are sold, packaged, and fulfilled directly by independent local merchant stores listed on the platform.`,
    ],
  },
  {
    id: 3,
    title: '3. User Accounts & Security',
    desc: 'Rules and responsibilities related to creating and managing your account.',
    icon: <User className="w-4 h-4 text-blue-500" />,
    details: [
      `To place orders, track live deliveries, or manage saved wishlist items, you must register an account using a valid mobile phone number and verify ownership via OTP authentication.`,
      `You are solely responsible for maintaining the confidentiality of your account credentials, login sessions, and OTP codes. You agree not to share OTPs with anyone, including delivery partners or support staff, prior to final package receipt.`,
      `You agree to provide accurate, current, and truthful personal, contact, and delivery address details. Providing fraudulent or falsified information constitutes a violation of these terms and may lead to immediate account termination.`,
    ],
  },
  {
    id: 4,
    title: '4. Use of Services',
    desc: `Guidelines for using ${branding.appName} and what you can expect from our services.`,
    icon: <ShoppingBag className="w-4 h-4 text-blue-500" />,
    details: [
      `You agree to utilize ${branding.appName} solely for legitimate, personal shopping purposes in compliance with all applicable local, state, and central Indian laws and regulations.`,
      `You must not engage in any activity that impairs, overburdens, or interferes with the normal operation, server infrastructure, or network security of the ${branding.appName} ecosystem.`,
      `Automated scraping, bulk data harvesting, price crawling, unauthorized API access, and reverse-engineering of our application or catalog data are strictly prohibited.`,
    ],
  },
  {
    id: 5,
    title: '5. Orders, Pricing and Payments',
    desc: 'Information about placing orders, pricing and payment methods.',
    icon: <Ticket className="w-4 h-4 text-blue-500" />,
    details: [
      `All prices listed on ${branding.appName} are quoted in Indian Rupees (₹) and include all applicable taxes (such as GST), unless explicitly stated otherwise during the checkout breakdown.`,
      `Product pricing and inventory levels are managed directly by each independent merchant store. In the rare event of an inadvertent pricing error or inventory stockout, the store reserves the right to cancel or modify the order with prompt customer notification.`,
      `Payments are securely processed via certified payment gateways supporting UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD) for eligible pincodes.`,
      `An order confirmation displayed on the app confirms receipt of your order request and initiates processing with the chosen merchant store.`,
    ],
  },
  {
    id: 6,
    title: '6. Returns, Refunds and Cancellations',
    desc: 'Our policy on returns, refunds and cancellations.',
    icon: <HelpCircle className="w-4 h-4 text-blue-500" />,
    details: [
      `Order Cancellation: You may cancel an order free of charge at any time before the merchant has packed or dispatched the order for delivery.`,
      `Perishable Goods: For fresh produce, dairy, groceries, or bakery products, any concerns regarding quality, spoilage, or incorrect items must be reported upon delivery or within 24 hours of package receipt.`,
      `Non-Perishable Goods: For apparel, footwear, accessories, and general merchandise, return or exchange requests are honored within 7 days of delivery, provided the item is unused, unworn, and returned with original tags, labels, and packaging.`,
      `Refund Processing: Once a refund request is verified and approved, refunds are credited back to the original payment method within 5–7 banking business days. For COD orders, refunds are credited to the customer's linked UPI ID or bank account.`,
    ],
  },
  {
    id: 7,
    title: '7. Prohibited Activities',
    desc: `Activities that are not allowed on ${branding.appName}.`,
    icon: <Shield className="w-4 h-4 text-blue-500" />,
    details: [
      `Placing fraudulent or mock orders with the intention of causing commercial loss or logistical inconvenience to local merchants or delivery riders.`,
      `Exploiting promotional discounts, first-order referral bonuses, or coupon codes through multiple account creation or synthetic phone numbers.`,
      `Using abusive, threatening, discriminatory, or harassing language towards customer service representatives, store proprietors, or delivery personnel.`,
      `Attempting to circumvent geolocation filters or misrepresenting your GPS location to access non-serviceable delivery corridors.`,
    ],
  },
  {
    id: 8,
    title: '8. Limitation of Liability',
    desc: 'Limitations of our liability to the fullest extent permitted by law.',
    icon: <ShieldCheck className="w-4 h-4 text-blue-500" />,
    details: [
      `${branding.appName} operates as an intermediary marketplace facilitator connecting consumers with third-party local merchants and independent delivery logistics providers.`,
      `To the maximum extent permitted under applicable Indian law, ${branding.appName} and its affiliates shall not be liable for any indirect, punitive, incidental, special, or consequential damages arising from merchant product defects, merchant operational delays, or third-party service interruptions.`,
      `Our aggregate liability for any proven claim arising out of an order placed on our platform shall not exceed the total transaction amount paid by you for that specific order.`,
    ],
  },
  {
    id: 9,
    title: '9. Governing Law & Dispute Resolution',
    desc: 'These terms are governed by the laws of India.',
    icon: <AlertCircle className="w-4 h-4 text-blue-500" />,
    details: [
      `These Terms and Conditions shall be governed by, interpreted, and construed in strict accordance with the laws of the Republic of India, without regard to conflict of law principles.`,
      `Any legal controversy, claim, or dispute arising out of or relating to your use of ${branding.appName} shall be subject to the exclusive jurisdiction of the competent courts of law located in Durg / Bhilai, Chhattisgarh, India.`,
    ],
  },
  {
    id: 10,
    title: '10. Contact Us & Grievance Redressal',
    desc: 'How to reach us for any questions about these terms.',
    icon: <HeadphonesIcon className="w-4 h-4 text-blue-500" />,
    details: [
      `If you have questions, feedback, or grievance redressal requests concerning these Terms & Conditions, please contact our dedicated support team:`,
      `Customer Support: Available via the 'Help & Support' screen in your account, or via email at support@viztore.com.`,
      `Operating Hours: Monday through Saturday, 9:00 AM – 9:00 PM IST. Support queries are typically resolved within 24–48 working hours.`,
      `Grievance Officer: Designated in compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.`,
    ],
  },
];

export function TermsClient() {
  const router = useRouter();
  const [termsData, setTermsData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  // Accordion state: array of section IDs currently open
  const [openSections, setOpenSections] = useState<number[]>([1]);

  const filteredSections = SECTIONS.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    section.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.details.some(detail => detail.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Auto-expand sections that match active search query
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
    const fetchTerms = async () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          setTermsData({
            lastUpdated: '20 May 2025'
          });
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.error('Failed to fetch terms', error);
        setIsLoading(false);
      }
    };
    fetchTerms();
  }, []);

  const allExpanded = filteredSections.length > 0 && filteredSections.every(s => openSections.includes(s.id));

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
                  <button 
                    type="button" 
                    onClick={() => router.back()} 
                    aria-label="Go back"
                    className="shrink-0 lg:hidden p-1 text-[#192168] hover:text-[#1668F6] transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6 text-[#192168]" />
                  </button>
                  <h1 className="text-[24px] md:text-[32px] font-extrabold text-[#192168] leading-tight">Terms & Conditions</h1>
                </div>
                <p className="text-[12px] text-surface-500 leading-relaxed max-w-[280px] mb-4">
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

            {/* Terms Contents (Accordion) */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-extrabold text-[#192168]">Terms & Conditions</h3>
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
                  placeholder="Search terms, clauses or keywords..." 
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
                        {/* Accordion Trigger Header */}
                        <button 
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          aria-expanded={isOpen}
                          aria-controls={`term-content-${section.id}`}
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
                            <h4 className={`text-[13px] font-bold mb-1 transition-colors ${
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

                        {/* Accordion Expandable Content Body */}
                        {isOpen && (
                          <div 
                            id={`term-content-${section.id}`}
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
                    No terms found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Acknowledgment Banner */}
            <div className="bg-[#E8F0FE] rounded-xl p-4 flex items-center gap-3 relative mt-2 border border-blue-100">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <p className="text-[11px] text-[#192168] leading-tight font-medium">
                By continuing to use {branding.appName}, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
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
