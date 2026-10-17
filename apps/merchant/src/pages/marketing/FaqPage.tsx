import React, { useState } from 'react';
import {
  HelpCircle,
  Store,
  Package,
  Truck,
  Layers,
  CreditCard,
  Settings,
  User,
  Phone,
  Mail,
  Headphones,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { FaqAccordion, FaqItem } from '../../components/marketing/FaqAccordion.js';

interface FaqPageProps {
  onNavigate: (route: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All FAQs');

  const categories = [
    { name: 'All FAQs', icon: HelpCircle },
    { name: 'Getting Started', icon: Store },
    { name: 'Product Management', icon: Package },
    { name: 'Orders & Delivery', icon: Truck },
    { name: 'Inventory', icon: Layers },
    { name: 'Billing & Payments', icon: CreditCard },
    { name: 'Store Settings', icon: Settings },
    { name: 'Account & Plans', icon: User },
  ];

  const allFaqs: FaqItem[] = [
    {
      question: `How do I create my store on ${branding.appName}?`,
      answer: `Creating your store is simple. Click on 'Start Selling', verify your mobile number with a one-time password (OTP), submit your store name, category, and address. You can complete bank details immediately or in your seller dashboard.`,
      category: 'Getting Started',
    },
    {
      question: 'How do I add products to my store?',
      answer: `Navigate to the Catalog module from your merchant sidebar. Click '+ Add Product' to upload photos, enter titles, prices, SKUs, and stock quantities. You can also import existing inventory via Excel/CSV spreadsheets.`,
      category: 'Product Management',
    },
    {
      question: 'Are there any delivery charges for my store?',
      answer: `Under our transparent pricing structure, the Premium Plan (₹16,000/yr) includes ₹0 delivery fulfillment charges on all orders. On the Standard Plan (₹12,000/yr), delivery charges are ₹30 for orders under ₹850, and ₹50 for orders ₹850 and above.`,
      category: 'Account & Plans',
    },
    {
      question: 'How do I receive and manage orders?',
      answer: `When a nearby customer places an order, you will hear a real-time chime alert and see an instant toast notification. You can review items, pack the parcel, and advance the order from 'New' to 'Ready for Pickup' or 'Out for Delivery'.`,
      category: 'Orders & Delivery',
    },
    {
      question: 'How do I generate GST invoices?',
      answer: `Our integrated billing and invoicing module automatically computes CGST and SGST based on product tax classifications. You can print 80mm thermal receipts for counter sales or generate A4 tax invoices with your GSTIN and store details.`,
      category: 'Billing & Payments',
    },
    {
      question: 'How can I change my plan or renew my subscription?',
      answer: `Go to Settings > Subscription in your Merchant Hub. You can view your current validity, upgrade from Standard to Premium, or renew your 12-month access directly via UPI or Net Banking.`,
      category: 'Account & Plans',
    },
    {
      question: 'How does local discovery work for nearby shoppers?',
      answer: `Customers using our customer app or web storefront set their delivery location or pincode. Our hyperlocal engine highlights registered retailers within a 2-4 km radius, allowing shoppers to discover your items and order for doorstep delivery or store pickup.`,
      category: 'Getting Started',
    },
    {
      question: 'What happens when stock runs out?',
      answer: `You can configure minimum stock thresholds in the Inventory module. When stock falls below your threshold, you receive automated low-stock warnings, and items marked out-of-stock are temporarily paused from customer checkout to prevent fulfillment conflicts.`,
      category: 'Inventory',
    },
    {
      question: 'Can I customize my store logo and banner?',
      answer: `Yes! From Store Management, you can upload desktop hero banners (1920x600 px), mobile banners (1080x1350 px), and store logos (512x512 px) to match your retail shop identity.`,
      category: 'Store Settings',
    },
  ];

  const displayedFaqs = allFaqs.filter(
    (faq) => selectedCategory === 'All FAQs' || faq.category === selectedCategory
  );

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Header (Mockup 5.5.png) */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f0f6ff] to-white border-b border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#0038ed] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>&gt;</span>
            <button
              onClick={() => onNavigate('/help')}
              className="hover:text-[#0038ed] transition-colors cursor-pointer"
            >
              Help Centre
            </button>
            <span>&gt;</span>
            <span className="text-[#0038ed] font-bold">FAQs</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0038ed] font-bold text-xs uppercase tracking-wider">
              HELP CENTRE
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              Find quick answers to common questions about using {branding.appName} for your store.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Sidebar + Accordions Layout */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 4 Cols: Category Sidebar (5.5.png) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-1.5">
              <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                FAQ Categories
              </div>

              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.name;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-[#0038ed] shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#0038ed] text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{cat.name}</span>
                    </div>

                    <span
                      className={`text-xs ${
                        isSelected ? 'text-[#0038ed] font-bold' : 'text-slate-400'
                      }`}
                    >
                      &rsaquo;
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right 8 Cols: Expandable Accordions */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {selectedCategory}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Find answers to the most common questions about {branding.appName}.
                </p>
              </div>

              <FaqAccordion
                items={displayedFaqs}
                showNumbers={true}
                allowMultiple={false}
                defaultOpenIndex={0}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Still Need Help? Banner */}
      <section className="py-12 bg-[#edf4ff] border-t border-blue-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                <Headphones className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Still Need Help?</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Our regional team is here to support you. Get in touch with us anytime.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">
                    Call Support
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">+91 91091 07251</div>
                  <div className="text-[10px] text-slate-500">Mon - Sat, 10:00 AM - 6:00 PM</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">
                    Email Support
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#0038ed]">
                    {branding.supportEmail}
                  </div>
                  <div className="text-[10px] text-slate-500">We reply within 24 hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
