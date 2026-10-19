import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { branding } from '../../../lib/branding.js';

interface PrivacyPageProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
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
            <Shield className="w-4 h-4" />
            <span>PRIVACY &amp; DATA PROTECTION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: January 1, 2026 &bull; {branding.appName} Retail Platform
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              We collect information provided during merchant onboarding (legal name, phone number,
              store address, GSTIN, bank details), operational usage logs, order records, and
              customer delivery coordinates strictly required for local retail fulfillment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. How Information is Used</h2>
            <p>
              Your store details and catalog items are rendered on customer-facing hyperlocal discovery
              feeds. Transaction data is processed to generate GST-compliant tax invoices, settlement
              payouts, and financial ledgers. We do not sell merchant data to third-party ad brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Data Security &amp; Storage</h2>
            <p>
              All merchant credentials and financial records are encrypted in transit via TLS 1.3
              and stored in SOC-2 compliant database clusters. Access to bank accounts and PAN details
              is restricted to authenticated store administrators.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Contacting Data Officer</h2>
            <p>
              For questions regarding privacy, data deletion, or compliance audits, contact our
              privacy desk at{' '}
              <a
                href={`mailto:${branding.supportEmail}`}
                className="text-[#0038ed] font-bold hover:underline"
              >
                {branding.supportEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
