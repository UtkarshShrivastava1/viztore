'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Radar,
} from 'lucide-react';
import {
  branding,
  type IUserProfile,
  cleanEmail,
  cleanName,
  cleanPhoneNumber,
  validateEmail,
  validatePassword,
  validatePersonName,
} from '@repo/shared-types';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { authApi } from '@/lib/api/auth';

interface CelebrationState {
  user: IUserProfile;
  tokens: { accessToken: string; refreshToken?: string };
  isNewUser: boolean;
}

export const AuthModal: React.FC = () => {
  const router = useRouter();
  const { isAuthModalOpen, authModalView, closeAuthModal, openAuthModal, setAuth } = useAuthStore();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Celebration & transition state
  const [celebration, setCelebration] = useState<CelebrationState | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setError(null);
    setSuccessMsg(null);
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
  };

  const handleTabSwitch = (view: 'login' | 'register') => {
    if (celebration) return;
    resetForm();
    openAuthModal(view);
  };

  const handleClose = () => {
    if (isLoading || celebration) return;
    closeAuthModal();
  };

  const completeAuthTransition = (
    user: IUserProfile,
    accessToken: string,
    refreshToken?: string,
    isNewUser = false
  ) => {
    // 1. Trigger celebratory state
    setCelebration({
      user,
      tokens: { accessToken, refreshToken },
      isNewUser,
    });

    // 2. Play smooth celebration inside modal for 1.35 seconds
    setTimeout(() => {
      setIsExiting(true);

      // 3. Smooth exit transition (300ms)
      setTimeout(() => {
        setAuth(user, accessToken, refreshToken);
        resetForm();
        setCelebration(null);
        setIsExiting(false);

        // 4. Trigger global floating welcome toast
        useToastStore.getState().showWelcomeToast({
          userName: user.fullName,
          email: user.email,
          isNewUser,
          onViewAccount: () => router.push('/account'),
        });

        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (currentPath === '/account/logged-out' || currentPath === '/account/logout') {
            router.push('/');
          }
        }
      }, 300);
    }, 1350);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = cleanEmail(email);
    if (!normalizedEmail || !password) {
      setError('Please enter both your email address and password.');
      return;
    }
    const emailValidation = validateEmail(normalizedEmail);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await authApi.login({ email: normalizedEmail, password });
      completeAuthTransition(res.user, res.tokens.accessToken, res.tokens.refreshToken, false);
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message ||
          'Invalid email or password. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedName = cleanName(fullName);
    const normalizedEmail = cleanEmail(email);
    const cleanedPhone = cleanPhoneNumber(phone);

    if (!sanitizedName) {
      setError('Please enter your full name.');
      return;
    }
    const nameValidation = validatePersonName(sanitizedName);
    if (!nameValidation.isValid) {
      setError(nameValidation.error || 'Name must be at least 2 characters.');
      return;
    }

    if (!normalizedEmail) {
      setError('Please enter your email address.');
      return;
    }
    const emailValidation = validateEmail(normalizedEmail);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Please enter a valid email address.');
      return;
    }

    if (cleanedPhone && cleanedPhone.length !== 10) {
      setError('Mobile number must be strictly 10 digits starting with 6, 7, 8, or 9.');
      return;
    }
    if (cleanedPhone && !/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setError('Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(
        passwordValidation.error ||
          'Password must be at least 8 characters long and contain letters, numbers, and special characters.'
      );
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await authApi.register({
        fullName: sanitizedName,
        email: normalizedEmail,
        password,
        phone: cleanedPhone || undefined,
      });
      completeAuthTransition(res.user, res.tokens.accessToken, res.tokens.refreshToken, true);
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message ||
          'Registration failed. Please check your details and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const userFirstName = celebration?.user?.fullName?.trim().split(' ')[0] || 'Friend';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with fade transition */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 transition-all duration-300 ${
          isExiting
            ? 'scale-95 opacity-0 translate-y-3 pointer-events-none'
            : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        {/* CELEBRATORY SUCCESS STATE */}
        {celebration ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-[#011A5D] via-[#002275] to-[#1668F6] p-8 text-white shadow-2xl text-center">
            {/* Ambient decorative glowing blobs */}
            <div
              className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-blue-400/25 blur-3xl pointer-events-none animate-pulse"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Radiant central badge */}
            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-60" />
              {/* Glowing halo */}
              <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-300 to-[#4C82FB] opacity-80 blur-md animate-pulse" />
              {/* Core Badge */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-2xl text-[#011A5D] border-4 border-white/40">
                <Sparkles className="h-9 w-9 text-[#1668F6] animate-bounce" />
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-1.5 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold tracking-wide">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {celebration.isNewUser ? 'Account Created' : 'Authenticated'}
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {celebration.isNewUser
                  ? `Welcome, ${userFirstName}! 🎉`
                  : `Welcome Back, ${userFirstName}! 👋`}
              </h3>
              <p className="text-xs text-white/80 max-w-xs mx-auto leading-relaxed">
                {celebration.isNewUser
                  ? `Welcome to ${branding.appName}! Discover nearby shops within 3–4 km.`
                  : `Signed in as ${celebration.user.email}. Loading verified local stores...`}
              </p>
            </div>

            {/* Feature Unlocked Cards */}
            <div className="space-y-2 mb-6 text-left bg-black/20 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 shadow-inner">
              <div className="flex items-center gap-2.5 text-xs text-white/95">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/25 text-emerald-300 shrink-0">
                  <Radar className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium">Hyperlocal 3–4 km discovery radar active</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/95">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-400/25 text-blue-300 shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium">Secure session & saved cart synchronized</span>
              </div>
            </div>

            {/* Animated Loading Bar */}
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 via-white to-blue-200 rounded-full animate-[progress_1.35s_ease-out_forwards]" />
              </div>
              <p className="text-[11px] text-white/70 font-semibold tracking-wide">
                Taking you to your storefront...
              </p>
            </div>

            <style jsx>{`
              @keyframes progress {
                from {
                  width: 0%;
                }
                to {
                  width: 100%;
                }
              }
            `}</style>
          </div>
        ) : (
          /* STANDARD LOGIN & REGISTRATION VIEW */
          <>
            {/* Header Ribbon */}
            <div className="bg-gradient-to-r from-[#011A5D] via-[#002070] to-[#1668F6] px-6 pt-6 pb-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                    <span className="font-black text-lg text-white">
                      {branding.appName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{branding.appName}</h3>
                    <p className="text-xs text-white/75">{branding.tagline}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="mt-5 flex rounded-xl bg-white/10 p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-all cursor-pointer ${
                    authModalView === 'login'
                      ? 'bg-white text-[#011A5D] shadow-sm'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('register')}
                  className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-all cursor-pointer ${
                    authModalView === 'register'
                      ? 'bg-white text-[#011A5D] shadow-sm'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Error Alerts */}
              {error && (
                <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* LOGIN VIEW */}
              {authModalView === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        id="login-email"
                        name="email"
                        required
                        autoComplete="username"
                        autoCapitalize="none"
                        spellCheck={false}
                        maxLength={100}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1668F6] focus:outline-none focus:ring-2 focus:ring-[#1668F6]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700">Password</label>
                      <a href="#" className="text-xs text-[#1668F6] font-medium hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1668F6] focus:outline-none focus:ring-2 focus:ring-[#1668F6]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-[#1668F6] py-3 text-sm font-bold text-white shadow-md shadow-[#1668F6]/25 hover:bg-[#1255cc] active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </form>
              ) : (
                /* REGISTER VIEW */
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        id="register-fullname"
                        name="name"
                        required
                        autoComplete="name"
                        maxLength={100}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1668F6] focus:outline-none focus:ring-2 focus:ring-[#1668F6]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        id="register-phone"
                        name="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit mobile number"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1668F6] focus:outline-none focus:ring-2 focus:ring-[#1668F6]/20 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        id="register-email"
                        name="email"
                        required
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        maxLength={100}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1668F6] focus:outline-none focus:ring-2 focus:ring-[#1668F6]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password (min. 8 characters) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="register-password"
                        name="password"
                        required
                        autoComplete="new-password"
                        minLength={8}
                        maxLength={128}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1668F6] focus:outline-none focus:ring-2 focus:ring-[#1668F6]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {/* Visual Password Strength Bar */}
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1 h-1">
                          <div
                            className={`flex-1 rounded-full ${
                              password.length >= 8 ? 'bg-amber-400' : 'bg-rose-400'
                            }`}
                          />
                          <div
                            className={`flex-1 rounded-full ${
                              validatePassword(password).score >= 3
                                ? 'bg-blue-500'
                                : 'bg-slate-200'
                            }`}
                          />
                          <div
                            className={`flex-1 rounded-full ${
                              validatePassword(password).score >= 4
                                ? 'bg-emerald-500'
                                : 'bg-slate-200'
                            }`}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {validatePassword(password).isValid
                            ? 'Strong password'
                            : 'Use 8+ characters with uppercase, lowercase, numbers & symbols'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1668F6] focus:ring-[#1668F6] cursor-pointer"
                    />
                    <label htmlFor="agreeTerms" className="text-[11px] text-slate-600 leading-tight">
                      I agree to the{' '}
                      <a href="/account/terms" className="text-[#1668F6] underline">
                        Terms & Conditions
                      </a>{' '}
                      and{' '}
                      <a href="/account/privacy" className="text-[#1668F6] underline">
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-[#1668F6] py-3 text-sm font-bold text-white shadow-md shadow-[#1668F6]/25 hover:bg-[#1255cc] active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
