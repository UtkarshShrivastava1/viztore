import React from 'react';
import { Clock, ShieldCheck, Mail, Store, CheckCircle2, ArrowRight, Edit3, Check } from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboardingStore.js';
import { branding } from '../../lib/branding.js';

interface ReviewWaitingRoomProps {
  onEnterDashboard: () => void;
  onEditDraft?: () => void;
}

export const ReviewWaitingRoom: React.FC<ReviewWaitingRoomProps> = ({
  onEnterDashboard,
  onEditDraft,
}) => {
  const { draft, resetOnboarding, setIsUnderReview } = useOnboardingStore();

  const storeName = draft.step4?.storeDisplayName || draft.step2?.legalBusinessName || 'Your Retail Store';
  const merchantEmail = draft.step1?.email || 'merchant@example.com';
  const phone = draft.step1?.mobileNumber || '9876543210';
  const gstin = draft.step2?.gstin || draft.step2?.pan || '29ABCDE1234F1Z5';
  const refId = `REG-${phone.slice(-4)}`;

  const handleEdit = () => {
    if (onEditDraft) {
      onEditDraft();
    } else {
      setIsUnderReview(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      {/* Main Review Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-blue-900/5 p-6 sm:p-10 text-center">
        {/* Animated Hourglass / Clock Visual */}
        <div className="relative mx-auto mb-4 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-100/70 animate-ping opacity-60" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-50 border-2 border-amber-200/90 flex items-center justify-center text-amber-500 shadow-xs">
            <Clock className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>
        </div>

        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 mb-3.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Verification in Progress
        </div>

        {/* Screen Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2.5">
          Store Profile Under Super Admin Review
        </h1>

        {/* Informative Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
          Thank you for completing the registration for <strong className="text-slate-900 font-semibold">{storeName}</strong>.
          Our team is validating your GSTIN and business credentials. An automated activation confirmation will be sent to{' '}
          <span className="text-[#0038ed] font-semibold">{merchantEmail}</span>.
        </p>

        {/* Quick Application Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 sm:p-4 bg-[#f8faff] border border-slate-200/80 rounded-xl text-left mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Store Name</span>
            <span className="text-xs font-semibold text-slate-800 truncate block mt-0.5" title={storeName}>{storeName}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">GSTIN / PAN</span>
            <span className="text-xs font-semibold text-slate-800 truncate block font-mono mt-0.5">{gstin}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Application ID</span>
            <span className="text-xs font-semibold text-[#0038ed] font-mono mt-0.5 block">#{refId}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Queue Status</span>
            <span className="text-xs font-semibold text-amber-600 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Pending
            </span>
          </div>
        </div>

        {/* Approval Flow Timeline Card */}
        <div className="border border-slate-200 rounded-xl p-5 sm:p-6 bg-[#f8faff] text-left mb-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Verification & Activation Workflow
            </span>
            <span className="text-[11px] font-semibold text-[#0038ed] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
              Estimated: 2–4 Hours
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs sm:text-sm font-bold text-slate-800">4-Step Registration Completed</h5>
                  <span className="text-[10px] font-semibold bg-emerald-100/70 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">Completed</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Account, Legal PAN/GSTIN, E-signature, Store Address & Bank mapped</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0038ed] border border-blue-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Clock className="w-4 h-4 animate-spin text-[#0038ed]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900">Super Admin Queue Review</h5>
                  <span className="text-[10px] font-semibold bg-blue-100 text-[#0038ed] px-2 py-0.5 rounded-full animate-pulse">In Progress</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">Verifying GST certificate & geographical store coordinates (Avg: 2–4 hours)</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 opacity-60">
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs sm:text-sm font-semibold text-slate-700">Credential & Approval Dispatch</h5>
                  <span className="text-[10px] font-medium text-slate-400">Step 3</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Automated activation link & operational access dispatched to email</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 opacity-60">
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs sm:text-sm font-semibold text-slate-700">Hyperlocal Digital Storefront Live</h5>
                  <span className="text-[10px] font-medium text-slate-400">Step 4</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Products discoverable by customers within 3–4 km delivery radius</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Callout */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex items-start gap-3 text-left mb-6 text-xs text-slate-600">
          <ShieldCheck className="w-5 h-5 text-[#0038ed] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold block text-slate-800 mb-0.5">Need help or want to make corrections?</span>
            Reach out to our seller assistance team anytime at{' '}
            <a href={`mailto:${branding.supportEmail}`} className="font-semibold text-[#0038ed] underline">
              {branding.supportEmail}
            </a>.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleEdit}
            className="w-full sm:w-auto py-2.5 px-5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>Edit Registration Draft</span>
          </button>

          <button
            type="button"
            onClick={onEnterDashboard}
            className="w-full sm:w-auto py-2.5 px-6 rounded-lg bg-[#0038ed] hover:bg-[#002fcf] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Preview Merchant Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
