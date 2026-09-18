import React from 'react';
import {
  Smartphone,
  CreditCard,
  Store,
  Landmark,
  ShieldCheck,
  Headphones,
  Users,
  TrendingUp,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';

export type OnboardingMainStep = 1 | 2 | 3 | 4;

interface OnboardingSidebarProps {
  activeMainStep: OnboardingMainStep;
  subStepIndex?: number;
  onSelectStep?: (step: OnboardingMainStep) => void;
}

export const OnboardingSidebar: React.FC<OnboardingSidebarProps> = ({
  activeMainStep,
  onSelectStep,
}) => {
  const steps = [
    {
      stepNumber: 1,
      title: 'Mobile & E-mail Verification',
      substeps: ['Mobile Verification', 'E-mail Verification'],
      icon: Smartphone,
      description: 'Verify your mobile number and email address to ensure secure communication.',
    },
    {
      stepNumber: 2,
      title: 'ID & Signature Verification',
      substeps: ['ID Verification', 'Signature Verification'],
      icon: CreditCard,
      description: 'Verify your identity to ensure a safe and trustworthy marketplace.',
    },
    {
      stepNumber: 3,
      title: 'Create Your Store',
      substeps: ['Store Details', 'Business Information'],
      icon: Store,
      description: 'Provide your store and business details to help customers trust your brand.',
    },
    {
      stepNumber: 4,
      title: 'Bank Account Information',
      substeps: ['Add Bank Details'],
      icon: Landmark,
      description: 'Add your bank details to receive payments securely and on time.',
    },
  ];

  return (
    <div className="bg-[#f4f7fd] border border-slate-200/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between h-full shadow-2xs">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
            Welcome to {branding.appName}
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm">
            Complete these simple steps to create your seller account and start selling on{' '}
            {branding.appName}.
          </p>
        </div>

        {/* 4 Steps matching Screen 3.png */}
        <div className="space-y-4">
          {steps.map((s) => {
            const isActive = activeMainStep === s.stepNumber;
            const isCompleted = activeMainStep > s.stepNumber;
            const Icon = s.icon;

            return (
              <div
                key={s.stepNumber}
                onClick={() =>
                  onSelectStep && isCompleted && onSelectStep(s.stepNumber as OnboardingMainStep)
                }
                className="flex items-start gap-3.5 p-2 rounded-xl transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isActive
                      ? 'bg-white border-[#0038ed] text-[#0038ed] shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : 'bg-white border-slate-200 text-[#0038ed]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-1 flex-1">
                  <h3 className="text-[13px] font-bold text-slate-900">{s.title}</h3>

                  <div className="space-y-0.5">
                    {s.substeps.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px]">
                        <div
                          className={`w-1.5 h-1.5 rounded-full border ${
                            isActive || isCompleted
                              ? 'border-[#0038ed] bg-[#0038ed]'
                              : 'border-slate-300'
                          }`}
                        />
                        <span
                          className={
                            isActive || isCompleted
                              ? 'text-[#0038ed] font-medium'
                              : 'text-slate-500'
                          }
                        >
                          {sub}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed pt-0.5">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom 4 Trust Credentials inside white container matching Screen 3.png */}
      <div className="mt-8 bg-white rounded-xl p-3 border border-slate-200/70 shadow-2xs">
        <div className="grid grid-cols-4 gap-2 text-center divide-x divide-slate-100">
          <div className="px-1 flex flex-col items-center">
            <ShieldCheck className="w-4 h-4 text-[#0038ed] mb-1" />
            <span className="text-[10px] font-bold text-slate-900 leading-tight">
              Secure &amp; Reliable
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5">100% Safe Platform</span>
          </div>

          <div className="px-1 flex flex-col items-center">
            <Headphones className="w-4 h-4 text-[#0038ed] mb-1" />
            <span className="text-[10px] font-bold text-slate-900 leading-tight">24x7 Support</span>
            <span className="text-[9px] text-slate-400 mt-0.5">We're here to help</span>
          </div>

          <div className="px-1 flex flex-col items-center">
            <Users className="w-4 h-4 text-[#0038ed] mb-1" />
            <span className="text-[10px] font-bold text-slate-900 leading-tight">
              10,000+ Sellers
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5">Trust {branding.appName}</span>
          </div>

          <div className="px-1 flex flex-col items-center">
            <TrendingUp className="w-4 h-4 text-[#0038ed] mb-1" />
            <span className="text-[10px] font-bold text-slate-900 leading-tight">5X Growth</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Scale your business</span>
          </div>
        </div>
      </div>
    </div>
  );
};
