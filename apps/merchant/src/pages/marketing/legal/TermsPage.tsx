import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { branding } from '../../../lib/branding.js';

interface TermsPageProps {
  onNavigate: (route: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-white select-none py-12 sm:py-16">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => onNavigate('/')}
          className="text-xs font-bold text-[#0038ed] flex items-center gap-1.5 hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0038ed] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>LEGAL &amp; COMPLIANCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms of Use &amp; Merchant Agreement
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: January 1, 2026 &bull; {branding.appName} Retail Infrastructure
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By registering an account, accessing, or using the {branding.appName} Merchant Suite
              (operated by Zager Digital Services), you agree to be bound by these Terms of Use and
              all incorporated policies. If you do not agree, do not access or use the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Merchant Obligations &amp; KYC</h2>
            <p>
              Merchants must provide accurate legal business credentials, including verified GSTIN,
              Permanent Account Number (PAN), and business address within the defined delivery
              radius. All product catalog entries, prices, and stock figures must remain truthful and
              free of counterfeit goods.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Subscription &amp; Billing</h2>
            <p>
              Access to operational tools is provided via annual subscriptions (Standard ₹12,000/yr or
              Premium ₹16,000/yr). Subscriptions are billed annually. Delivery fees, where
              applicable, are calculated strictly according to your selected plan terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Order Fulfillment &amp; Handover</h2>
            <p>
              Orders fulfilled through local delivery require customer OTP verification at the point
              of handoff. Merchants agree to prepare packages in accordance with state quality and
              safety standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable Indian law, {branding.appName} and its
              parent entity Zager Digital Services shall not be liable for indirect, incidental, or
              consequential damages arising from store disruptions, customer chargebacks, or network
              outages.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
