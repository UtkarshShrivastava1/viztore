import React from 'react';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { branding } from '../../../lib/branding.js';

interface RefundPolicyPageProps {
  onNavigate: (route: string) => void;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onNavigate }) => {
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
            <RefreshCw className="w-4 h-4" />
            <span>COMMERCIAL POLICY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: January 1, 2026 &bull; {branding.appName} Merchant Operations
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Annual Subscription Grace Period</h2>
            <p>
              New merchants subscribing to the Standard (₹12,000/yr) or Premium (₹16,000/yr) plans
              are entitled to a 7-day initial evaluation period. If you decide the platform is not
              suitable for your store before catalog publishing or order processing, you may request
              a full refund minus gateway transaction fees.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Order Cancellations &amp; Customer Refunds</h2>
            <p>
              For online customer orders, order cancellation is supported prior to package handover
              to delivery personnel. Once an order is marked 'Out for Delivery' or verified via
              Delivery OTP, settlement funds are credited to the merchant wallet. Customer refund
              disputes must follow the platform Returns and Exchange guidelines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Contacting Payout &amp; Refund Desk</h2>
            <p>
              For subscription refund inquiries or wallet settlement disputes, reach out to our
              financial support desk at{' '}
              <a
                href={`mailto:${branding.supportEmail}`}
                className="text-[#0038ed] font-bold hover:underline"
              >
                {branding.supportEmail}
              </a>{' '}
              or call +91 91091 07251.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
