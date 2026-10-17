import React, { useState } from 'react';
import {
  ArrowRight,
  Search,
  Store,
  Package,
  Truck,
  Layers,
  CreditCard,
  TrendingUp,
  Settings,
  User,
  FileText,
  Phone,
  Mail,
  Headphones,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { MARKETING_DATA } from '../../data/marketingData.js';
import { FaqAccordion } from '../../components/marketing/FaqAccordion.js';
import { StillNeedHelpBanner } from '../../components/marketing/StillNeedHelpBanner.js';

interface HelpCentrePageProps {
  onNavigate: (route: string) => void;
  onSelectGuide?: (slug: string) => void;
}

export const HelpCentrePage: React.FC<HelpCentrePageProps> = ({
  onNavigate,
  onSelectGuide,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const helpFaqs = [
    {
      question: `How do I create my store on ${branding.appName}?`,
      answer: `Click on 'Start Selling', enter your mobile number to receive an OTP, submit your store address, category, and basic bank details. Your store goes live instantly.`,
    },
    {
      question: 'How do I add products with multiple sizes?',
      answer: `In the Products section, click 'Add Product', select variants, and specify available stock units for each size (S, M, L, XL) and color.`,
    },
    {
      question: 'Are there any delivery charges for my store?',
      answer: `Under the Premium Plan (₹16,000/yr), delivery charges are ₹0 for all orders. Under the Standard Plan (₹12,000/yr), a nominal ₹30 or ₹50 applies.`,
    },
    {
      question: 'How do I generate GST invoices?',
      answer: `Navigate to Billing & Invoices. Enter the customer details and items; our platform computes CGST/SGST automatically and allows direct 80mm thermal or A4 printing.`,
    },
    {
      question: 'How do I receive and manage orders?',
      answer: `You will hear an audio chime alert whenever a customer nearby places an order. View details on your Orders tab and click 'Accept Order'.`,
    },
    {
      question: 'How can I get more customers to my store?',
      answer: `Share your store link and counter QR standee on WhatsApp and Instagram, and create special discount coupons from the Marketing tab.`,
    },
    {
      question: 'How do I update product prices and stock?',
      answer: `Open Inventory or Catalog. Click 'Adjust Stock' or edit any item's price. Changes synchronize live to your customer-facing catalog in real time.`,
    },
    {
      question: 'How do I change my plan or renew subscription?',
      answer: `Go to Settings > Subscription & Plans. You can view your remaining plan duration and upgrade or renew seamlessly.`,
    },
  ];

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Hero Header (Mockup 5.4.png) */}
      <section className="py-12 sm:py-16 bg-[#f8fbff] border-b border-slate-100 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#0052ff] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>&gt;</span>
            <button
              onClick={() => onNavigate('/learn')}
              className="hover:text-[#0052ff] transition-colors cursor-pointer"
            >
              Learn
            </button>
            <span>&gt;</span>
            <span className="text-[#0052ff] font-bold">Help Centre</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Title, description, and search */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-block text-[#0052ff] font-black text-xs uppercase tracking-wider">
                HELP CENTRE
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0c1427] tracking-tight leading-tight">
                How Can We <span className="text-[#0052ff]">Help You?</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-lg">
                Find answers to common questions, learn how to use {branding.appName}, and get the
                help you need to grow your business.
              </p>

              {/* Search Input Bar */}
              <div className="pt-2">
                <div className="relative max-w-md">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search help topics, guides, questions..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm text-slate-900 shadow-2xs focus:outline-none focus:border-[#0052ff] focus:ring-4 focus:ring-[#0052ff]/5 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Hero Graphic from 5.4.png */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[560px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/60 bg-white">
                <img
                  src="/images/contact-support-hero.png"
                  alt="Customer Support Executive with Headset"
                  className="w-full h-auto object-cover block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Explore Help Topics (8 Tiles) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Explore Help Topics
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Find quick answers and helpful information for your store.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MARKETING_DATA.helpTopics.map((topic) => {
              const Icon =
                topic.iconName === 'Store'
                  ? Store
                  : topic.iconName === 'Package'
                  ? Package
                  : topic.iconName === 'Truck'
                  ? Truck
                  : topic.iconName === 'Layers'
                  ? Layers
                  : topic.iconName === 'CreditCard'
                  ? CreditCard
                  : topic.iconName === 'TrendingUp'
                  ? TrendingUp
                  : topic.iconName === 'Settings'
                  ? Settings
                  : User;

              return (
                <div
                  key={topic.id}
                  onClick={() => onNavigate('/faqs')}
                  className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-[#0038ed]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{topic.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0038ed]">
                    <span>{topic.articleCount} Articles</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Popular Articles Row (5.4.png) */}
      <section className="py-16 bg-[#f8fbff] border-y border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Popular Articles</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore the most helpful articles from our Help Centre.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/learn/guides')}
              className="text-xs font-bold text-[#0038ed] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MARKETING_DATA.guides.map((g, gi) => (
              <div
                key={gi}
                onClick={() => {
                  if (onSelectGuide) onSelectGuide(g.slug);
                  else onNavigate(`/learn/guides/${g.slug}`);
                }}
                className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:border-[#0038ed]/30 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038ed] bg-blue-50 px-2 py-0.5 rounded-full">
                    {g.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2.5 line-clamp-2">{g.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{g.summary}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{g.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions (8 Items in 2 cols) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Quick answers to common questions from local retailers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/faqs')}
              className="text-xs font-bold text-[#0038ed] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <FaqAccordion items={helpFaqs} showNumbers={false} allowMultiple={true} />
        </div>
      </section>

      {/* 5. Still Need Help? Contact Banner (Matching 5.4.png) */}
      <StillNeedHelpBanner />
    </div>
  );
};
