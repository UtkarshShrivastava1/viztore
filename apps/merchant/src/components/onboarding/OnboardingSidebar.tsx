import React from 'react';
import {
  Smartphone,
  CreditCard,
  Store,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Check,
  Sparkles,
  Headphones,
  Users,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { useOnboardingStore } from '../../stores/onboardingStore.js';

export type OnboardingMainStep = 1 | 2 | 3 | 4 | 5;

interface OnboardingSidebarProps {
  activeMainStep: OnboardingMainStep;
  subStep?: string;
  onSelectStep?: (step: OnboardingMainStep) => void;
}

export const OnboardingSidebar: React.FC<OnboardingSidebarProps> = ({
  activeMainStep,
  subStep,
  onSelectStep,
}) => {
  const { draft } = useOnboardingStore();

  const steps = [
    {
      stepNumber: 1,
      title: 'Mobile & E-mail Verification',
      icon: Smartphone,
      milestones: [
        {
          id: 'mobile',
          label: 'Mobile Verification',
          isDone: () => Boolean(activeMainStep > 1),
        },
        {
          id: 'email',
          label: 'E-mail Verification',
          isDone: () => Boolean(activeMainStep > 1),
        },
      ],
      caption: 'Verified secure seller credentials.',
    },
    {
      stepNumber: 2,
      title: 'ID & Signature Verification',
      icon: CreditCard,
      milestones: [
        {
          id: 'id',
          label: 'ID Verification',
          isDone: () => Boolean(activeMainStep > 2 || subStep === '2_signature'),
        },
        {
          id: 'signature',
          label: 'Signature Verification',
          isDone: () => Boolean(activeMainStep > 2),
        },
      ],
      caption: 'Government GSTIN & legal consent.',
    },
    {
      stepNumber: 3,
      title: 'Create Your Store',
      icon: Store,
      milestones: [
        {
          id: 'store_details',
          label: 'Store Details',
          isDone: () => Boolean(activeMainStep > 3 || subStep === '3_business'),
        },
        {
          id: 'business_info',
          label: 'Business Information',
          isDone: () => Boolean(activeMainStep > 3),
        },
      ],
      caption: 'Store map & operating categories.',
    },
    {
      stepNumber: 4,
      title: 'Bank Account Information',
      icon: Landmark,
      milestones: [
        {
          id: 'bank',
          label: 'Add Bank Details',
          isDone: () => Boolean(activeMainStep > 4),
        },
      ],
      caption: 'Automated direct UPI & payouts.',
    },
    {
      stepNumber: 5,
      title: 'Plan & Store Activation',
      icon: Sparkles,
      milestones: [
        {
          id: 'plan',
          label: 'Plan & Activation',
          isDone: () =>
            Boolean(
              (draft.payment?.paymentStatus === 'PAID' ||
                draft.payment?.paymentStatus === 'COUPON_WAIVED') &&
                (activeMainStep === 5 || subStep === 'success'),
            ),
        },
      ],
      caption: 'Commercial license & store launch.',
    },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-4 sm:p-5 xl:p-6 flex flex-col justify-between shadow-xl shadow-slate-200/30 lg:h-full overflow-hidden">
      <div className="space-y-2.5 flex-1 min-h-0 flex flex-col">
        {/* Header Branding */}
        <div className="shrink-0 pb-1">
          <div className="flex items-center justify-between mb-1">
            <img
              src="/images/logo-dark.png"
              alt={branding.appName}
              className="h-5 sm:h-6 w-auto object-contain"
            />
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0038ed] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#0038ed]" />
              <span>Seller Onboarding</span>
            </div>
          </div>

          <h2 className="text-base sm:text-lg xl:text-xl font-black text-slate-900 tracking-tight">
            Welcome to {branding.appName}
          </h2>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
            Complete these simple steps to create your seller account and start selling on {branding.appName}.
          </p>
        </div>

        {/* Compact Stepper with Milestone Checkmarks */}
        <div className="space-y-1 pt-0.5 flex-1 overflow-y-auto pr-1 min-h-0 scrollbar-thin">
          {steps.map((s) => {
            const isActive = activeMainStep === s.stepNumber;
            const isCompleted = activeMainStep > s.stepNumber;
            const Icon = s.icon;

            return (
              <div
                key={s.stepNumber}
                onClick={() =>
                  onSelectStep &&
                  isCompleted &&
                  onSelectStep(s.stepNumber as OnboardingMainStep)
                }
                className={`group relative flex items-start gap-2.5 p-1.5 sm:p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50/90 border border-blue-200/90 shadow-2xs'
                    : isCompleted
                    ? 'hover:bg-slate-50 border border-transparent cursor-pointer'
                    : 'border border-transparent opacity-75'
                }`}
              >
                {/* Left Icon with Completed Check Badge */}
                <div className="relative shrink-0 mt-0.5">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-[#0038ed] text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-100 scale-105'
                        : isCompleted
                        ? 'bg-blue-50 text-[#0038ed] border border-blue-200/80'
                        : 'bg-slate-100/90 text-slate-400 border border-slate-200/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>

                  {/* Completed Mini Badge */}
                  {isCompleted && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-1.5 ring-white shadow-2xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Step Info & Milestones */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-[11px] sm:text-xs xl:text-[13px] font-bold tracking-tight truncate ${
                        isActive
                          ? 'text-[#0038ed]'
                          : isCompleted
                          ? 'text-slate-900'
                          : 'text-slate-700'
                      }`}
                    >
                      {s.stepNumber}. {s.title}
                    </h3>
                    {isCompleted && (
                      <span className="text-[8px] sm:text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200/60 uppercase">
                        Done
                      </span>
                    )}
                  </div>

                  {/* Compact Milestone Checklist */}
                  <div className="mt-0.5 space-y-0.5">
                    {s.milestones.map((m) => {
                      const done = m.isDone();
                      return (
                        <div
                          key={m.id}
                          className="flex items-center gap-1.5 text-[10px] sm:text-[11px] leading-tight"
                        >
                          {done ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 stroke-[2.5]" />
                          ) : (
                            <Circle
                              className={`w-3 h-3 shrink-0 stroke-[1.8] ${
                                isActive ? 'text-blue-300' : 'text-slate-300'
                              }`}
                            />
                          )}
                          <span
                            className={
                              done
                                ? 'text-slate-700 font-semibold'
                                : isActive
                                ? 'text-slate-600 font-medium'
                                : 'text-slate-400'
                            }
                          >
                            {m.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dynamic caption for active step */}
                  {isActive && (
                    <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 leading-tight truncate">
                      {s.caption}
                    </p>
                  )}
                </div>

                {isCompleted && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 self-center shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom 4 Trust Credentials Cards */}
      <div className="mt-2 pt-2 border-t border-slate-100 shrink-0">
        <div className="grid grid-cols-4 gap-1 text-center divide-x divide-slate-100 bg-slate-50/80 rounded-xl py-1.5 px-0.5 border border-slate-200/60">
          <div className="px-0.5 flex flex-col items-center">
            <ShieldCheck className="w-3 h-3 text-[#0038ed] mb-0.5" />
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-800 leading-tight">
              100% Safe
            </span>
            <span className="text-[7px] sm:text-[8px] text-slate-400">Encrypted</span>
          </div>

          <div className="px-0.5 flex flex-col items-center">
            <Headphones className="w-3 h-3 text-indigo-600 mb-0.5" />
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-800 leading-tight">
              24x7 Help
            </span>
            <span className="text-[7px] sm:text-[8px] text-slate-400">Call</span>
          </div>

          <div className="px-0.5 flex flex-col items-center">
            <Users className="w-3 h-3 text-amber-600 mb-0.5" />
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-800 leading-tight">
              10k+ Stores
            </span>
            <span className="text-[7px] sm:text-[8px] text-slate-400">Verified</span>
          </div>

          <div className="px-0.5 flex flex-col items-center">
            <TrendingUp className="w-3 h-3 text-emerald-600 mb-0.5" />
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-800 leading-tight">
              Fast Growth
            </span>
            <span className="text-[7px] sm:text-[8px] text-slate-400">Local Reach</span>
          </div>
        </div>
      </div>
    </div>
  );
};
