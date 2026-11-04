import React from 'react';
import { ShieldCheck, Zap, Receipt, Sparkles, ArrowRight } from 'lucide-react';

export const AnnouncementsBar: React.FC = () => {
  const announcements = [
    {
      id: '1',
      title: 'Hyperlocal Instant Delivery Active',
      description: 'Your products are discoverable within 3–4 km. Customer orders dispatch with 2-leg OTP handshakes.',
      tag: 'LIVE DISPATCH',
      icon: Zap,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: '2',
      title: 'Automated Payouts & Wallet Settlements',
      description: 'Fulfilled orders automatically settle into your merchant balance with daily direct transfers.',
      tag: 'FINANCE',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: '3',
      title: 'GST & Thermal Billing Console',
      description: 'Generate A4 tax invoices and 80mm POS receipts with instant real-time inventory adjustments.',
      tag: 'NEW FEATURE',
      icon: Receipt,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    },
  ];

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight leading-none">
            Platform Intelligence & Updates
          </h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400">All services operational</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {announcements.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 flex items-start gap-3 transition-all duration-200 group"
            >
              <div className={`w-8 h-8 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${item.badgeBg}`}>
                    {item.tag}
                  </span>
                </div>
                <h4 className="text-[11px] font-bold text-slate-900 truncate leading-snug group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 mt-0.5 font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
