import React, { useState } from 'react';
import { Phone, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { useOnboardingStore } from '../../stores/onboardingStore.js';

interface Step1MobileEmailProps {
  onContinue: () => void;
  onGoToLogin: () => void;
}

export const Step1MobileEmail: React.FC<Step1MobileEmailProps> = ({
  onContinue,
  onGoToLogin,
}) => {
  const { draft, updateStep } = useOnboardingStore();

  const [phone, setPhone] = useState(draft.step1?.mobileNumber || '');
  const [email, setEmail] = useState(draft.step1?.email || '');
  const [password, setPassword] = useState(draft.step1?.password || '');
  const [confirmPassword, setConfirmPassword] = useState(draft.step1?.confirmPassword || '');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP Bypass: Immediate simulated verification for testing
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
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
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    updateStep(1, {
      fullName: 'Merchant Partner',
      mobileNumber: phone,
      email,
      password,
      confirmPassword,
    });

    onContinue();
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 lg:p-9 shadow-xs">
      {/* Header with Step 1 Badge matching Screen 3.png */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-7 h-7 rounded-full bg-[#0038ed] text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
          1
        </div>
        <h2 className="text-xs sm:text-[13px] font-bold tracking-wider text-[#0038ed] uppercase">
          MOBILE &amp; E-MAIL VERIFICATION
        </h2>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Mobile Number Input */}
        <div>
          <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-[#0038ed] focus-within:ring-1 focus-within:ring-[#0038ed] transition-all">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Phone className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter Mobile Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleSendPhoneOtp}
              className="text-xs sm:text-sm font-semibold text-[#0038ed] hover:text-[#002fcf] ml-2 whitespace-nowrap cursor-pointer"
            >
              {phoneOtpSent ? 'OTP Sent ✓' : 'Send OTP'}
            </button>
          </div>
        </div>

        {/* E-mail ID Input */}
        <div>
          <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-[#0038ed] focus-within:ring-1 focus-within:ring-[#0038ed] transition-all">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="email"
                placeholder="E-mail ID *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleSendEmailOtp}
              className="text-xs sm:text-sm font-semibold text-[#0038ed] hover:text-[#002fcf] ml-2 whitespace-nowrap cursor-pointer"
            >
              {emailOtpSent ? 'OTP Sent ✓' : 'Send OTP'}
            </button>
          </div>
        </div>

        {/* Create Password */}
        <div>
          <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-[#0038ed] focus-within:ring-1 focus-within:ring-[#0038ed] transition-all">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create Password *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
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
          <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-[#0038ed] focus-within:ring-1 focus-within:ring-[#0038ed] transition-all">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password *"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
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

        {/* Dynamic Legal Terms */}
        <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
          By continuing, I agree to {branding.appName}'s{' '}
          <span className="font-semibold text-slate-800 hover:underline cursor-pointer">
            Terms of Use
          </span>{' '}
          &amp;{' '}
          <span className="font-semibold text-slate-800 hover:underline cursor-pointer">
            Privacy Policy
          </span>
        </p>

        {/* Primary Action Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-lg bg-[#0038ed] hover:bg-[#002fcf] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer mt-2"
        >
          <span>Register &amp; Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Already a user Section */}
        <div className="pt-4 text-center">
          <span className="text-xs text-slate-500 block mb-2">Already a user?</span>
          <button
            type="button"
            onClick={onGoToLogin}
            className="w-full py-2.5 px-6 rounded-lg border border-[#0038ed] text-[#0038ed] font-semibold text-sm hover:bg-blue-50/50 transition-all cursor-pointer"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};
