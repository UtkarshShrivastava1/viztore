import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface WalletSecurityBannerProps {
  onLearnMore?: () => void;
}

export const WalletSecurityBanner: React.FC<WalletSecurityBannerProps> = ({ onLearnMore }) => {
  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900">Secure Wallet Transactions</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Your wallet transactions are secure and encrypted. For any queries, contact our support team.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onLearnMore || (() => alert('All merchant wallet transactions are PCI-DSS compliant and secured with end-to-end tokenization.'))}
        className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors shrink-0 shadow-2xs"
      >
        Know More
      </button>
    </div>
  );
};
