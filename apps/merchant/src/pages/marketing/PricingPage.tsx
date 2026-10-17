import React from 'react';
import {
  ArrowRight,
  Play,
  Calendar,
  Percent,
  CheckCircle2,
  Headphones,
  Crown,
  TrendingUp,
  Store,
  Sparkles,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { MARKETING_DATA } from '../../data/marketingData.js';
import { PricingCard, PricingPlan } from '../../components/marketing/PricingCard.js';
import { FeatureComparisonTable } from '../../components/marketing/FeatureComparisonTable.js';
import { FaqAccordion } from '../../components/marketing/FaqAccordion.js';
import { useVideoModal } from '../../components/marketing/MerchantPublicLayout.js';

interface PricingPageProps {
  onNavigate: (route: string) => void;
  onStartSelling: (planId?: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigate,
  onStartSelling,
}) => {
  const { openVideoModal } = useVideoModal();

  const handleWatchVideo = () => {
    openVideoModal({
      id: 'pricing-video',
      title: 'Transparent Pricing & Delivery Economics',
      duration: '2:15',
      category: 'Pricing',
      description: 'Learn why simple annual subscription models save local shopkeepers thousands in commission fees.',
    });
  };

  const standardPlan: PricingPlan = {
    id: 'standard',
    name: 'Standard Plan',
    price: '₹12,000',
    period: 'year',
    subtitle: 'Ideal for small and medium stores.',
    deliveryType: 'standard',
    deliveryNote: {
      title: 'Delivery Charges (Customer Orders)',
      items: [
        'Order value below ₹850  →  ₹30 per order',
        'Order value ₹850 and above  →  ₹50 per order',
      ],
    },
    features: [
      'All features included',
      'Customer app listing (local discovery)',
      'Accept online orders with {branding.appName} delivery',
      'Inventory, billing and reports',
      'Business insights and basic marketing tools',
      'Dedicated support',
    ],
    ctaText: 'Start Selling',
  };

  const premiumPlan: PricingPlan = {
    id: 'premium',
    name: 'Premium Plan',
    price: '₹16,000',
    period: 'year',
    subtitle: 'Best for high volume stores and growing businesses.',
    isPopular: true,
    deliveryType: 'zero',
    deliveryNote: {
      title: 'Delivery Charges (Customer Orders)',
      items: [
        'No delivery charges for any order value.',
        'You pay ₹0 per order.',
      ],
    },
    features: [
      'All features included',
      'Customer app listing (local discovery)',
      'Accept online orders with {branding.appName} delivery',
      'Inventory, billing and reports',
      'Advanced business insights and marketing tools',
      'Priority support',
    ],
    ctaText: 'Start Selling',
  };

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Hero Section (Mockup 3.0.png) */}
      <section className="py-12 sm:py-16 bg-[#f8fbff] border-b border-slate-100 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#0052ff] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>&gt;</span>
            <span className="text-[#0052ff] font-bold">Pricing</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block text-[#0052ff] font-black text-xs uppercase tracking-wider">
                PRICING
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0c1427] tracking-tight leading-tight">
                Simple &amp; Transparent Pricing for{' '}
                <span className="text-[#0052ff]">Local Retailers</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-lg">
                Everything you need to create your digital store, manage products, receive orders and
                grow your business — at a simple annual price.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onStartSelling()}
                  className="px-7 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0043d9] text-white font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Start Selling</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleWatchVideo}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0052ff] flex items-center justify-center">
                    <Play className="w-3 h-3 fill-[#0052ff] ml-0.5" />
                  </div>
                  <span>See How It Works</span>
                </button>
              </div>
            </div>

            {/* Right Graphic 3D Devices matching 3.0.png */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full max-w-[620px]">
                <img
                  src="/images/homepage-hero-devices.png"
                  alt="Viztore Merchant Management and Storefront Suite"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 Value Pills matching 3.0.png */}
      <div className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0c1427]">12 Months</div>
              <div className="text-xs text-slate-500">Annual plan only</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0c1427]">No hidden charges</div>
              <div className="text-xs text-slate-500">Transparent pricing</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0052ff] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0c1427]">All features included</div>
              <div className="text-xs text-slate-500">No feature restrictions</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0c1427]">Dedicated support</div>
              <div className="text-xs text-slate-500">Get help whenever you need</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Choose the Right Plan for Your Business */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0c1427] tracking-tight">
              Choose the Right Plan for Your Business
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Both plans include all features. The only difference is the delivery charge structure
              and a few additional benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Standard Plan (4 cols) */}
            <div className="lg:col-span-4">
              <PricingCard
                plan={standardPlan}
                onSelectPlan={(id) => onStartSelling(id)}
              />
            </div>

            {/* Premium Plan (4 cols) */}
            <div className="lg:col-span-4">
              <PricingCard
                plan={premiumPlan}
                onSelectPlan={(id) => onStartSelling(id)}
              />
            </div>

            {/* Right Side Benefits Info Column (4 cols) matching 3.0.png */}
            <div className="lg:col-span-4 space-y-4 pt-1">
              <div className="p-4.5 rounded-2xl bg-[#f8fbff] border border-blue-100/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Full Platform Access</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Create your digital store, manage products, receive orders and more.
                  </p>
                </div>
              </div>

              <div className="p-4.5 rounded-2xl bg-[#f8fbff] border border-blue-100/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Transparent Delivery Pricing</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Clear and simple delivery charges. No hidden fees.
                  </p>
                </div>
              </div>

              <div className="p-4.5 rounded-2xl bg-[#f8fbff] border border-blue-100/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-500 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Get Discovered Locally</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Your products visible to nearby customers searching on {branding.appName}.
                  </p>
                </div>
              </div>

              <div className="p-4.5 rounded-2xl bg-[#f8fbff] border border-blue-100/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Powerful Business Tools</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Inventory, billing, reports and marketing tools to grow your business.
                  </p>
                </div>
              </div>

              <div className="p-4.5 rounded-2xl bg-[#f8fbff] border border-blue-100/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-[#0052ff] flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Dedicated Support</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Get help whenever you need it from our support team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Compare Features Checklist Table (3.0.png) */}
      <section className="py-16 sm:py-20 bg-[#f8fbff] border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">Compare Features</h2>
            <p className="text-sm text-slate-500 mt-2">
              Both plans include all essential features. The only difference is the delivery charge
              structure and support priority.
            </p>
          </div>

          <FeatureComparisonTable />
        </div>
      </section>

      {/* 5. Frequently Asked Questions (3.0.png) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Still have questions? Here are some common queries about our pricing and plans.
            </p>
          </div>

          <FaqAccordion items={MARKETING_DATA.pricingFaqs} showNumbers={false} />
        </div>
      </section>

      {/* 6. Pre-Footer Banner matching 3.0.png */}
      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0052ff] to-[#0038ed] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="space-y-2 text-center md:text-left z-10">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                READY TO GET STARTED?
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">
                Start Your 12-Month Plan Today
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                Create your store, list your products and start receiving orders from nearby customers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onStartSelling()}
              className="px-6 py-3.5 rounded-xl bg-white text-[#0052ff] hover:bg-slate-50 font-bold text-sm shadow-md transition-all cursor-pointer shrink-0 z-10"
            >
              Start Selling &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
