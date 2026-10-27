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
  CheckCircle2,
  Sparkles,
  ChevronRight,
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
      description: 'Verify your phone & email to establish your secure seller credentials.',
    },
    {
      stepNumber: 2,
      title: 'ID & Signature Verification',
      substeps: ['GSTIN / PAN Identity', 'Digital Signature'],
      icon: CreditCard,
      description: 'Instant government verification to build trustworthy merchant presence.',
    },
    {
      stepNumber: 3,
      title: 'Create Your Store',
      substeps: ['Store Location & Map', 'Operating Categories'],
      icon: Store,
      description: 'Pinpoint your physical retail shop and specify your delivery radius.',
    },
    {
      stepNumber: 4,
      title: 'Bank Account Information',
      substeps: ['Bank Account & Settlement'],
      icon: Landmark,
      description: 'Secure instant payouts and automated T+1 UPI direct settlements.',
    },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-slate-200/30">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#0038ed] text-[11px] font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0038ed]" />
            <span>Digital Merchant Onboarding</span>
          </div>

          <h2 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
            Welcome to {branding.appName}
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-500 mt-1.5 leading-relaxed max-w-sm">
            Complete these 4 simple steps to digitize your retail store and discover customers in your 3–4 km neighborhood.
          </p>
        </div>

        {/* 4 Steps Timeline */}
        <div className="space-y-3">
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
                className={`relative flex items-start gap-3.5 p-3.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50/90 via-blue-50/40 to-transparent border border-blue-200/80 shadow-xs'
                    : isCompleted
                    ? 'bg-slate-50/60 hover:bg-emerald-50/40 border border-transparent hover:border-emerald-200/60 cursor-pointer'
                    : 'bg-transparent border border-transparent opacity-80'
                }`}
              >
                {/* Step Icon Badge */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                    isActive
                      ? 'bg-[#0038ed] text-white shadow-md shadow-blue-600/30 ring-4 ring-blue-100 scale-105'
                      : isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-[13px] font-bold tracking-tight truncate ${
                        isActive
                          ? 'text-[#0038ed]'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-700'
                      }`}
                    >
                      {s.title}
                    </h3>
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    {s.substeps.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px]">
                        <div
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            isActive
                              ? 'bg-[#0038ed] ring-2 ring-blue-200 animate-pulse'
                              : isCompleted
                              ? 'bg-emerald-500'
                              : 'bg-slate-300'
                          }`}
                        />
                        <span
                          className={
                            isActive
                              ? 'text-[#0038ed] font-semibold'
                              : isCompleted
                              ? 'text-slate-600 font-medium'
                              : 'text-slate-400'
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

                {isCompleted && (
                  <ChevronRight className="w-4 h-4 text-slate-400 self-center shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom 4 Trust Credentials Cards */}
      <div className="mt-8 bg-slate-50/80 rounded-2xl p-3 border border-slate-200/70 shadow-2xs">
        <div className="grid grid-cols-4 gap-2 text-center divide-x divide-slate-200/60">
          <div className="px-1 flex flex-col items-center">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0038ed] flex items-center justify-center mb-1">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-900 leading-tight">
              100% Safe
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5">Encrypted</span>
          </div>

          <div className="px-1 flex flex-col items-center">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1">
              <Headphones className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-900 leading-tight">24x7 Help</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Instant Call</span>
          </div>

          <div className="px-1 flex flex-col items-center">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-1">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-900 leading-tight">
              10k+ Stores
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5">Verified</span>
          </div>

          <div className="px-1 flex flex-col items-center">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-900 leading-tight">Fast Growth</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Local Reach</span>
          </div>
        </div>
      </div>
    </div>
  );
};

