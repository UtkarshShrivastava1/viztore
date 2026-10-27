import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Store,
  MapPin,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Zap,
  Radio,
  Clock,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.js';
import { useOnboardingStore } from '../../stores/onboardingStore.js';
import { branding } from '../../lib/branding.js';

interface RegistrationSuccessViewProps {
  onEnterDashboard: () => void;
}

export const RegistrationSuccessView: React.FC<RegistrationSuccessViewProps> = ({
  onEnterDashboard,
}) => {
  const { currentStore, user } = useAuthStore();
  const { draft } = useOnboardingStore();

  const [countdown, setCountdown] = useState<number>(5);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Derive merchant store details from draft or currentStore
  const storeName =
    currentStore?.name ||
    draft.step4?.storeDisplayName ||
    'Fresh Express Mart';
  const merchantName =
    user?.fullName ||
    draft.step4?.merchantFullName ||
    draft.step1?.fullName ||
    'Retail Merchant';
  const category =
    draft.step5?.primaryCategory ||
    (currentStore as any)?.category ||
    'Provisions & Supermarket';
  const locality =
    draft.step4?.address?.city
      ? `${draft.step4.address.street || 'Supela'}, ${draft.step4.address.city}, CG`
      : 'Bhilai, Chhattisgarh';
  const deliveryRadius = draft.step4?.deliveryRadiusKm || 4;
  const bankName = draft.step6?.bankName || 'State Bank of India';
  const rawAccount = draft.step6?.accountNumber || '1234567890';
  const maskedAccount =
    rawAccount.length > 4
      ? `•••• •••• ${rawAccount.slice(-4)}`
      : `•••• ${rawAccount}`;

  // Countdown timer auto-transitioning to dashboard
  useEffect(() => {
    if (isPaused) return;

    if (countdown <= 0) {
      onEnterDashboard();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isPaused, onEnterDashboard]);

  const progressPercent = Math.max(0, Math.min(100, ((5 - countdown) / 5) * 100));

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-blue-900/10 relative overflow-hidden">
        {/* Subtle decorative background gradient glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/60 via-indigo-50/40 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-100/40 via-teal-50/30 to-transparent rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

        {/* Top Celebration Badge */}
        <div className="flex flex-col items-center text-center relative z-10 mb-8">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#0038ed] to-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-600/30 ring-8 ring-blue-50">
              <CheckCircle2 className="w-10 h-10 text-white stroke-[2.2]" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shadow-md animate-bounce">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Store Verified & Onboarding Complete
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to {branding.appName}, {merchantName}!
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mt-1.5">
            Your storefront <span className="font-semibold text-slate-900">"{storeName}"</span> has been configured and is ready to accept hyperlocal customer orders.
          </p>
        </div>

        {/* Store Summary Verified Profile Card */}
        <div className="relative z-10 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-6 mb-7 backdrop-blur-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-blue-600 shadow-2xs shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {storeName}
                </h3>
                <span className="text-xs text-slate-500 font-medium capitalize">
                  {category} • Proprietor: {merchantName}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/80 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200/60">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Delivery Radius & Location
                </span>
                <span className="font-semibold text-slate-800 text-xs">
                  {deliveryRadius} km Hyperlocal Radius
                </span>
                <p className="text-slate-500 text-[11px] truncate mt-0.5">{locality}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200/60">
              <CreditCard className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Settlements Bank Account
                </span>
                <span className="font-semibold text-slate-800 text-xs">
                  {bankName}
                </span>
                <p className="text-slate-500 text-[11px] font-mono mt-0.5">{maskedAccount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Key Operational Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-8 relative z-10">
          <div className="p-3 rounded-xl bg-white border border-slate-200 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800">Instant Orders</span>
            <span className="text-[10px] text-slate-500">Live Chimes</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800">Zero Commission</span>
            <span className="text-[10px] text-slate-500">Tier 1 Launch</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800">Catalog Manager</span>
            <span className="text-[10px] text-slate-500">Easy Product Add</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800">T+1 Payouts</span>
            <span className="text-[10px] text-slate-500">Direct To Bank</span>
          </div>
        </div>

        {/* Dynamic Countdown & Action Section */}
        <div className="relative z-10 pt-2 border-t border-slate-100 flex flex-col items-center">
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
            <div
              className="bg-gradient-to-r from-[#0038ed] to-blue-500 h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between w-full text-xs text-slate-500 mb-4 px-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              {countdown > 0 ? (
                <span>
                  Transitioning to your dashboard in <strong className="text-slate-900 font-bold">{countdown}s</strong>...
                </span>
              ) : (
                <span>Launching dashboard now...</span>
              )}
            </span>

            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="text-[11px] font-semibold text-slate-600 hover:text-blue-600 cursor-pointer underline"
            >
              {isPaused ? 'Resume countdown' : 'Pause'}
            </button>
          </div>

          <button
            type="button"
            onClick={onEnterDashboard}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#0038ed] hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group hover:scale-[1.01]"
          >
            <span>Launch Merchant Dashboard Now</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
