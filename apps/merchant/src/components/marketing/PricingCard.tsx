import React from 'react';
import { Check, Truck, Sparkles, ArrowRight } from 'lucide-react';
import { branding } from '../../lib/branding.js';

export interface PricingPlan {
  id: 'standard' | 'premium';
  name: string;
  price: string;
  period: string;
  subtitle: string;
  isPopular?: boolean;
  deliveryType: 'standard' | 'zero';
  deliveryNote: {
    title: string;
    items: string[];
  };
  features: string[];
  ctaText: string;
}

interface PricingCardProps {
  plan: PricingPlan;
  onSelectPlan: (planId: 'standard' | 'premium') => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelectPlan }) => {
  const isPremium = plan.id === 'premium';

  return (
    <div
      className={`relative bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
        isPremium
          ? 'border-2 border-[#0038ed] shadow-lg shadow-blue-500/10 ring-4 ring-[#0038ed]/5'
          : 'border border-slate-200/90 shadow-sm hover:border-slate-300'
      }`}
    >
      {/* Recommended Badge */}
      {isPremium && (
        <div className="absolute -top-3.5 right-6 sm:right-8 bg-[#ffd54f] text-slate-900 font-extrabold text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 fill-slate-900" />
          <span>Recommended</span>
        </div>
      )}

      <div>
        {/* Plan Header */}
        <div className="mb-3">
          <h3 className="text-xl sm:text-2xl font-black text-[#0c1427]">{plan.name}</h3>
          <p className="text-xs sm:text-[13px] text-slate-500 mt-1">{plan.subtitle}</p>
        </div>

        {/* Plan Pricing */}
        <div className="flex items-baseline gap-1.5 my-4 pb-4 border-b border-slate-100">
          <span className="text-3xl sm:text-4xl font-black text-[#0052ff] tracking-tight">
            {plan.price}
          </span>
          <span className="text-sm font-semibold text-slate-500">/ {plan.period}</span>
        </div>

        {/* Delivery Charges Box */}
        <div
          className={`rounded-2xl p-4 mb-6 border ${
            isPremium
              ? 'bg-[#ecfdf5] border-emerald-200/90 text-emerald-950'
              : 'bg-[#eff6ff] border-blue-200/90 text-blue-950'
          }`}
        >
          <div className="flex items-center gap-2 mb-2 font-bold text-xs sm:text-[13px]">
            <Truck
              className={`w-4 h-4 ${
                isPremium ? 'text-emerald-600' : 'text-[#0052ff]'
              }`}
            />
            <span>{plan.deliveryNote.title}</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
            {plan.deliveryNote.items.map((item, i) => (
              <p key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-3 mb-8">
          <ul className="space-y-3">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2.5 text-xs sm:text-[13.5px] text-slate-700">
                <div className="w-4.5 h-4.5 rounded-full bg-[#0052ff] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{feature.replace('{branding.appName}', branding.appName)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Button */}
      <div>
        <button
          type="button"
          onClick={() => onSelectPlan(plan.id)}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
            isPremium
              ? 'border-2 border-[#0052ff] text-[#0052ff] hover:bg-blue-50/80 bg-white'
              : 'bg-[#0052ff] hover:bg-[#0043d9] text-white'
          }`}
        >
          <span>{plan.ctaText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
