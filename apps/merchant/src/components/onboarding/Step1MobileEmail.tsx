import React, { useState } from 'react';
import { Phone, Mail, Lock, Eye, EyeOff, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { useOnboardingStore } from '../../stores/onboardingStore.js';
import { api } from '../../lib/api.js';
import { useAuthStore } from '../../stores/authStore.js';

interface Step1MobileEmailProps {
  onContinue: () => void;
  onGoToLogin: () => void;
}

export const Step1MobileEmail: React.FC<Step1MobileEmailProps> = ({
  onContinue,
  onGoToLogin,
}) => {
  const { draft, updateStep } = useOnboardingStore();

  const [fullName, setFullName] = useState(draft.step1?.fullName || '');
  const [phone, setPhone] = useState(draft.step1?.mobileNumber || '');
  const [email, setEmail] = useState(draft.step1?.email || '');
  const [password, setPassword] = useState(draft.step1?.password || '');
  const [confirmPassword, setConfirmPassword] = useState(draft.step1?.confirmPassword || '');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP Simulation with visual feedback
  const handleSendPhoneOtp = () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setPhoneOtpSent(true);
  };

  const handleSendEmailOtp = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError(null);
    setEmailOtpSent(true);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || fullName.trim().length < 2) {
      setError('Please enter your full proprietor or representative name');
      return;
    }
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const trimmedName = fullName.trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    try {
      let authRes: any;
      try {
        authRes = await api.post('/auth/register', {
          fullName: trimmedName,
          email: cleanEmail,
          phone: cleanPhone,
          password,
          role: 'merchant',
        });
      } catch (regErr: any) {
        if (regErr?.message?.includes('already exists') || regErr?.status === 409) {
          authRes = await api.post('/auth/login', {
            identifier: cleanEmail,
            password,
          });
        } else {
          throw regErr;
        }
      }

      if (authRes?.tokens?.accessToken && authRes?.user) {
        await useAuthStore.getState().setAuth(authRes.user, authRes.tokens.accessToken, authRes.tokens.refreshToken);
      }
    } catch (err: any) {
      console.warn('Backend user registration sync during onboarding step 1:', err);
    } finally {
      setIsSubmitting(false);
    }

    // Save to persisted onboarding draft and pre-populate signatory name
    updateStep(1, {
      fullName: trimmedName,
      mobileNumber: cleanPhone,
      email: cleanEmail,
      password,
      confirmPassword,
    });

    onContinue();
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-xl shadow-slate-200/40 relative">
      {/* Autofill Background Color Fix */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
          -webkit-text-fill-color: #0f172a !important;
        }
      `}</style>

      {/* Header with Step 1 Badge */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0038ed] to-blue-500 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/25 shrink-0">
            1
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black tracking-wider text-[#0038ed] uppercase">
              Mobile &amp; E-mail Verification
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Setup merchant credentials &amp; store login</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name / Proprietor Name */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Proprietor / Representative Name <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center border border-slate-200 rounded-xl px-3.5 py-3 bg-white focus-within:border-[#0038ed] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
            <User className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar Patel"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
              required
            />
          </div>
        </div>

        {/* Mobile Number Input with +91 Country Pill */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Primary Mobile Number <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus-within:border-[#0038ed] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md select-none border border-slate-200/60">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleSendPhoneOtp}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ml-2 shrink-0 ${
                phoneOtpSent
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-blue-50 text-[#0038ed] hover:bg-blue-100 border border-blue-200/60'
              }`}
            >
              {phoneOtpSent ? 'OTP Sent ✓' : 'Send OTP'}
            </button>
          </div>
        </div>

        {/* E-mail ID Input */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Store / Business Email <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus-within:border-[#0038ed] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="email"
                placeholder="store.owner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleSendEmailOtp}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ml-2 shrink-0 ${
                emailOtpSent
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-blue-50 text-[#0038ed] hover:bg-blue-100 border border-blue-200/60'
              }`}
            >
              {emailOtpSent ? 'OTP Sent ✓' : 'Send OTP'}
            </button>
          </div>
        </div>

        {/* Password & Confirm Password side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Create Password */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Create Password <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3.5 py-3 bg-white focus-within:border-[#0038ed] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 ml-2 shrink-0 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3.5 py-3 bg-white focus-within:border-[#0038ed] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-slate-400 hover:text-slate-600 ml-2 shrink-0 cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Legal Terms */}
        <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
          By continuing, I agree to {branding.appName}'s{' '}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#0038ed] hover:underline cursor-pointer"
          >
            Terms of Use
          </a>{' '}
          &amp;{' '}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#0038ed] hover:underline cursor-pointer"
          >
            Privacy Policy
          </a>
        </p>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0038ed] to-blue-600 hover:from-[#002fcf] hover:to-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer mt-3 disabled:opacity-60 active:scale-[0.99]"
        >
          <span>{isSubmitting ? 'Registering Account...' : 'Register & Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Already a user Section */}
        <div className="pt-4 text-center border-t border-slate-100">
          <span className="text-xs text-slate-500 block mb-2">Already registered as a seller?</span>
          <button
            type="button"
            onClick={onGoToLogin}
            className="w-full py-2.5 px-6 rounded-xl border border-[#0038ed] text-[#0038ed] font-bold text-sm hover:bg-blue-50/60 transition-all cursor-pointer"
          >
            Login to Existing Account
          </button>
        </div>
      </form>
    </div>
  );
};

