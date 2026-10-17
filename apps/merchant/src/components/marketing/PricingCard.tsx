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
        <div className="absolute -top-3.5 right-6 sm:right-8 bg-amber-400 text-slate-900 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 fill-slate-900" />
          <span>Recommended</span>
        </div>
      )}

      <div>
        {/* Plan Header */}
        <div className="mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{plan.name}</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{plan.subtitle}</p>
        </div>

        {/* Plan Pricing */}
        <div className="flex items-baseline gap-1.5 my-5 pb-5 border-b border-slate-100">
          <span className="text-3xl sm:text-4xl font-extrabold text-[#0038ed] tracking-tight">
            {plan.price}
          </span>
          <span className="text-sm font-semibold text-slate-500">/ {plan.period}</span>
        </div>

        {/* Delivery Charges Box */}
        <div
          className={`rounded-2xl p-4 mb-6 border ${
            isPremium
              ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
              : 'bg-blue-50/70 border-blue-200/80 text-blue-950'
          }`}
        >
          <div className="flex items-center gap-2 mb-2 font-bold text-xs sm:text-sm">
            <Truck
              className={`w-4 h-4 ${
                isPremium ? 'text-emerald-600' : 'text-[#0038ed]'
              }`}
            />
            <span>{plan.deliveryNote.title}</span>
          </div>
          <div className="space-y-1 text-xs sm:text-[13px] text-slate-700">
            {plan.deliveryNote.items.map((item, i) => (
              <p key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-3 mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Everything Included:
          </p>
          <ul className="space-y-2.5">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
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
              ? 'border-2 border-[#0038ed] text-[#0038ed] hover:bg-blue-50/80 bg-white'
              : 'bg-[#0038ed] hover:bg-[#002fcf] text-white'
          }`}
        >
          <span>{plan.ctaText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
