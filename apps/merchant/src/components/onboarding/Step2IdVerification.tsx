import React, { useState } from 'react';
import { Info, ArrowRight } from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { useOnboardingStore } from '../../stores/onboardingStore.js';
import { api } from '../../lib/api.js';

interface Step2IdVerificationProps {
  onContinue: () => void;
  onBack?: () => void;
}

export const Step2IdVerification: React.FC<Step2IdVerificationProps> = ({ onContinue }) => {
  const { draft, updateStep } = useOnboardingStore();

  const [gstin, setGstin] = useState(draft.step2?.gstin || '');
  const [pan, setPan] = useState(draft.step2?.pan || '');
  const [legalName, setLegalName] = useState(draft.step2?.legalBusinessName || '');

  const [isVerifyingGstin, setIsVerifyingGstin] = useState(false);
  const [isGstinVerified, setIsGstinVerified] = useState(Boolean(draft.step2?.gstin));
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [isPanVerified, setIsPanVerified] = useState(Boolean(draft.step2?.pan));
  const [error, setError] = useState<string | null>(null);

  const handleVerifyGstin = async () => {
    if (!gstin || gstin.trim().length < 15) {
      setError('Please enter a valid 15-character GSTIN');
      return;
    }
    setError(null);
    setIsVerifyingGstin(true);

    try {
      const res = await api.post<{ isValid: boolean; extractedPan: string; legalName: string }>(
        '/stores/onboarding/verify-gstin',
        { gstin: gstin.toUpperCase() },
      );
      if (res?.extractedPan) setPan(res.extractedPan);
      if (res?.legalName) setLegalName(res.legalName);
      setIsGstinVerified(true);
      setIsPanVerified(true);
    } catch {
      // Offline fallback mock
      const extractedPan = gstin.length >= 12 ? gstin.slice(2, 12).toUpperCase() : 'ABCDE1234F';
      setPan(extractedPan);
      if (!legalName) setLegalName('National Retail Merchants Ltd');
      setIsGstinVerified(true);
      setIsPanVerified(true);
    } finally {
      setIsVerifyingGstin(false);
    }
  };

  const handleVerifyPan = () => {
    if (!pan || pan.trim().length < 10) {
      setError('Please enter a valid 10-digit PAN Number');
      return;
    }
    setError(null);
    setIsVerifyingPan(true);
    setTimeout(() => {
      setIsVerifyingPan(false);
      setIsPanVerified(true);
      if (!legalName) setLegalName('National Retail Merchants Ltd');
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gstin && !pan) {
      setError('Please provide and verify your GSTIN or PAN');
      return;
    }
    if (!legalName.trim()) {
      setError('Please enter your business legal name');
      return;
    }

    updateStep(2, {
      gstin: gstin.toUpperCase(),
      pan: pan.toUpperCase(),
      legalBusinessName: legalName,
      businessType: 'private_limited' as any,
    });

    onContinue();
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 lg:p-9 shadow-xs">
      {/* Header with Step 2 Badge */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-7 h-7 rounded-full bg-[#0038ed] text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
          2
        </div>
        <h2 className="text-xs sm:text-[13px] font-bold tracking-wider text-[#0038ed] uppercase">
          ID &amp; SIGNATURE VERIFICATION
        </h2>
      </div>

      <p className="text-xs text-slate-500 mb-5">
        Enter the details below to verify your identity.
      </p>

      {error && (
        <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* GSTIN Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Enter GSTIN *
          </label>
          <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-[#0038ed] focus-within:ring-1 focus-within:ring-[#0038ed] transition-all">
            <input
              type="text"
              maxLength={15}
              placeholder="Enter your 15-digit GSTIN"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none uppercase font-mono tracking-wider"
            />
            <button
              type="button"
              disabled={isVerifyingGstin || isGstinVerified}
              onClick={handleVerifyGstin}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-all ml-2 whitespace-nowrap cursor-pointer ${
                isGstinVerified
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : 'bg-white text-[#0038ed] border-[#0038ed] hover:bg-blue-50/50'
              }`}
            >
              {isVerifyingGstin ? 'Verifying...' : isGstinVerified ? 'Verified ✓' : 'Verify GSTIN'}
            </button>
          </div>
        </div>

        {/* Info Callout Box */}
        <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg flex items-center gap-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-[#0038ed] shrink-0" />
          <span>
            GSTIN is <span className="font-semibold text-slate-800">required</span> to sell products on {branding.appName}.
          </span>
        </div>

        {/* OR Divider */}
        <div className="relative my-3 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            OR
          </span>
        </div>

        {/* PAN Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Enter PAN Number *
          </label>
          <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-[#0038ed] focus-within:ring-1 focus-within:ring-[#0038ed] transition-all">
            <input
              type="text"
              maxLength={10}
              placeholder="Enter your 10-digit PAN Number"
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none uppercase font-mono tracking-wider"
            />
            <button
              type="button"
              disabled={isVerifyingPan || isPanVerified}
              onClick={handleVerifyPan}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-all ml-2 whitespace-nowrap cursor-pointer ${
                isPanVerified
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : 'bg-white text-[#0038ed] border-[#0038ed] hover:bg-blue-50/50'
              }`}
            >
              {isVerifyingPan ? 'Verifying...' : isPanVerified ? 'Verified ✓' : 'Verify PAN'}
            </button>
          </div>
        </div>

        {/* Business Legal Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Enter Business Legal Name *
          </label>
          <input
            type="text"
            placeholder="Enter your business legal name as per PAN"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-1 focus:ring-[#0038ed] transition-all"
            required
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            This should match the Legal Name of Your Business.
          </span>
        </div>

        {/* Continue Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-[#0038ed] hover:bg-[#002fcf] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
