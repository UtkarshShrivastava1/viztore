import React, { useState } from 'react';
import { Phone, Mail, Lock, Eye, EyeOff, ArrowRight, User, ShieldCheck, RotateCcw } from 'lucide-react';
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
  const { draft, updateStep, resetOnboarding } = useOnboardingStore();

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

  const hasDraftData = Boolean(
    draft.step1?.fullName ||
    draft.step1?.mobileNumber ||
    draft.step1?.email ||
    draft.step2?.gstin ||
    draft.step4?.storeDisplayName ||
    draft.payment?.paymentStatus ||
    fullName ||
    phone ||
    email
  );

  const handleClearForm = () => {
    resetOnboarding();
    setFullName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhoneOtpSent(false);
    setEmailOtpSent(false);
    setError(null);
  };

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
      const currentAuth = useAuthStore.getState();
      const existingToken = localStorage.getItem('access_token');
      let authRes: any;

      if (currentAuth.isAuthenticated && currentAuth.user?.email === cleanEmail && existingToken) {
        // Already authenticated for this merchant identity
        authRes = {
          user: currentAuth.user,
          tokens: { accessToken: existingToken },
        };
      } else {
        try {
          authRes = await api.post('/auth/register', {
            fullName: trimmedName,
            email: cleanEmail,
            phone: cleanPhone,
            password,
            role: 'merchant',
          });
        } catch (regErr: any) {
          const isConflict =
            regErr?.statusCode === 409 ||
            regErr?.code === 'EMAIL_EXISTS' ||
            regErr?.code === 'PHONE_EXISTS' ||
            regErr?.message?.includes('already exists');

          if (isConflict) {
            try {
              authRes = await api.post('/auth/login', {
                identifier: cleanEmail,
                password,
                role: 'merchant',
              });
            } catch (loginErr: any) {
              throw new Error(
                loginErr.message ||
                  'An account with this email or mobile already exists. Please verify your password or use "Login to Existing Account".'
              );
            }
          } else {
            throw regErr;
          }
        }
      }

      if (authRes?.tokens?.accessToken && authRes?.user) {
        await useAuthStore.getState().setAuth(
          authRes.user,
          authRes.tokens.accessToken,
          authRes.tokens.refreshToken,
        );
      } else if (!existingToken) {
        throw new Error('Could not establish secure merchant session. Please try again.');
      }

      updateStep(1, {
        fullName: trimmedName,
        mobileNumber: cleanPhone,
        email: cleanEmail,
        password,
        confirmPassword,
      });

      onContinue();
    } catch (err: any) {
      console.error('Merchant authentication error during Step 1:', err);
      setError(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 lg:p-7 shadow-xl shadow-slate-200/40 relative lg:h-full flex flex-col justify-between overflow-hidden">
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
      <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0038ed] to-blue-500 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/25 shrink-0">
            1
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black tracking-wider text-[#0038ed] uppercase">
              Mobile &amp; E-mail Verification
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Setup merchant credentials &amp; store login</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasDraftData && (
            <button
              type="button"
              onClick={handleClearForm}
              className="flex items-center gap-1.5 text-[11px] sm:text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-2.5 py-1 rounded-full border border-rose-200/80 font-bold transition-all cursor-pointer shadow-2xs"
              title="Clear prefilled draft and start fresh"
            >
              <RotateCcw className="w-3 h-3 text-rose-500" />
              <span>Start Fresh / Clear Form</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-2.5 p-2.5 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2 shrink-0 animate-in fade-in">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col justify-between overflow-hidden min-h-0"
      >
        <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 min-h-0 space-y-2.5 scrollbar-thin">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Proprietor / Representative Name <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 bg-white focus-within:border-[#0038ed] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
              <User className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
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

          {/* Mobile & Email in 2 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Primary Mobile */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3 py-2 bg-white focus-within:border-[#0038ed] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10 digits"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendPhoneOtp}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ml-1.5 shrink-0 ${
                    phoneOtpSent
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-blue-50 text-[#0038ed] hover:bg-blue-100 border border-blue-200/60'
                  }`}
                >
                  {phoneOtpSent ? 'Sent ✓' : 'OTP'}
                </button>
              </div>
            </div>

            {/* Store Email */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Store Email <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3 py-2 bg-white focus-within:border-[#0038ed] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    placeholder="owner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ml-1.5 shrink-0 ${
                    emailOtpSent
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-blue-50 text-[#0038ed] hover:bg-blue-100 border border-blue-200/60'
                  }`}
                >
                  {emailOtpSent ? 'Sent ✓' : 'OTP'}
                </button>
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Create Password <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3 py-2 bg-white focus-within:border-[#0038ed] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 ml-1 shrink-0 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3 py-2 bg-white focus-within:border-[#0038ed] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
                  className="text-slate-400 hover:text-slate-600 ml-1 shrink-0 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DOCKED BOTTOM ACTIONS (Never Clipped) */}
        <div className="shrink-0 pt-2.5 border-t border-slate-100 space-y-2 bg-white">
          <p className="text-[10px] text-slate-400 leading-tight">
            By continuing, I agree to {branding.appName}&apos;s{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0038ed] hover:underline">
              Terms of Use
            </a>{' '}
            &amp;{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0038ed] hover:underline">
              Privacy Policy
            </a>
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#0038ed] to-blue-600 hover:from-[#002fcf] hover:to-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.99]"
          >
            <span>{isSubmitting ? 'Registering Account...' : 'Register & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <span>Already registered as a seller?</span>
            <button
              type="button"
              onClick={onGoToLogin}
              className="font-bold text-[#0038ed] hover:underline cursor-pointer"
            >
              Login to Existing Account
            </button>
          </div>

          {hasDraftData && (
            <div className="text-center text-[11px] text-slate-400">
              Entering fresh details?{' '}
              <button
                type="button"
                onClick={handleClearForm}
                className="text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Clear saved draft &amp; start fresh
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
