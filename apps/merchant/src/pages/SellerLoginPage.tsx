import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  X,
  Mail,
  Lock,
  User,
  Phone,
  Store,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { SellerLandingPage } from './SellerLandingPage.js';
import { branding } from '../lib/branding.js';
import { api } from '../lib/api.js';
import { useAuthStore } from '../stores/authStore.js';
import { useOnboardingStore } from '../stores/onboardingStore.js';

interface SellerLoginPageProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
  onGoToHome?: () => void;
  initialMode?: 'login' | 'register';
}

export const SellerLoginPage: React.FC<SellerLoginPageProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onGoToHome,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Quick Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setAuth } = useAuthStore();
  const { updateStep } = useOnboardingStore();

  const handleClose = () => {
    if (onGoToHome) {
      onGoToHome();
    } else {
      window.history.back();
    }
  };

  // Keyboard Escape listener to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onGoToHome]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post<any>('/auth/login', {
        identifier: identifier.trim(),
        password,
      });

      // Role-Based Access Control: ensure user has merchant or admin privileges
      if (res.user.role !== 'merchant' && res.user.role !== 'admin') {
        setError('Access denied: This account does not have merchant or seller permissions.');
        return;
      }

      await setAuth(res.user, res.tokens.accessToken, res.tokens.refreshToken);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regPhone || !/^[6-9]\d{9}$/.test(regPhone)) {
      setError('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }
    if (!regEmail || !regEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (regPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let authRes: any;
      try {
        authRes = await api.post('/auth/register', {
          fullName: regFullName.trim() || 'Merchant Partner',
          email: regEmail.toLowerCase().trim(),
          phone: regPhone.trim(),
          password: regPassword,
          role: 'merchant',
        });
      } catch (regErr: any) {
        if (regErr?.message?.includes('already exists') || regErr?.status === 409) {
          authRes = await api.post('/auth/login', {
            identifier: regEmail.toLowerCase().trim(),
            password: regPassword,
          });
        } else {
          throw regErr;
        }
      }

      if (authRes?.tokens?.accessToken && authRes?.user) {
        await setAuth(authRes.user, authRes.tokens.accessToken, authRes.tokens.refreshToken);
      }

      // Sync into onboarding draft store
      updateStep(1, {
        fullName: regFullName.trim() || 'Merchant Partner',
        mobileNumber: regPhone.trim(),
        email: regEmail.toLowerCase().trim(),
        password: regPassword,
        confirmPassword: regConfirmPassword,
      });

      // Transition to onboarding
      onGoToRegister();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-[#0038ed] selection:text-white overflow-x-hidden">
      {/* Autofill CSS Reset to prevent harsh browser yellow backgrounds */}
      <style>{`
        .modal-input:-webkit-autofill,
        .modal-input:-webkit-autofill:hover, 
        .modal-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
          -webkit-text-fill-color: #0f172a !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Underlying Landing Page with Backdrop Blur filter */}
      <div className="filter blur-[3px] pointer-events-none opacity-85 select-none">
        <SellerLandingPage onStartSelling={() => {}} onLogin={() => {}} />
      </div>

      {/* Floating Centered Modal Backdrop with Click-to-Dismiss */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
        className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-[3px] flex items-center justify-center p-4 transition-all duration-300"
      >
        {/* Modal Card */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-slate-100/90 w-full max-w-[460px] animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden"
        >
          {/* Close Button (X) */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 sm:right-6 top-4 sm:top-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#0038ed]/30"
            aria-label="Close dialog"
            title="Close (Esc)"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* Header Brand Icon & Tag */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0038ed] to-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-600/25 shrink-0">
              {mode === 'login' ? (
                <Store className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#0038ed] uppercase tracking-wider block">
                {branding.appName} Merchant Hub
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {mode === 'login' ? 'Merchant Login' : 'Create Seller Account'}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            {mode === 'login'
              ? 'Access your merchant store management dashboard and live orders'
              : 'Start your hyperlocal digital storefront and discover nearby customers'}
          </p>

          {/* Segmented Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-xl mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Create Account</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-medium flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3.5">
              {/* Username / Phone / Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email or Phone Number
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/40 hover:bg-white focus-within:bg-white focus-within:border-[#0038ed] focus-within:ring-3 focus-within:ring-[#0038ed]/10 transition-all">
                  <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter phone or email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="modal-input w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <a
                    href={`mailto:${branding.supportEmail}?subject=Password%20Reset%20Request`}
                    className="text-[11px] font-semibold text-[#0038ed] hover:underline"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="flex items-center border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/40 hover:bg-white focus-within:bg-white focus-within:border-[#0038ed] focus-within:ring-3 focus-within:ring-[#0038ed]/10 transition-all">
                  <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="modal-input w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none pr-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 ml-1 shrink-0 cursor-pointer select-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Login to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Switch to Register */}
              <div className="pt-3 text-center border-t border-slate-100">
                <span className="text-xs text-slate-500 block mb-2">New merchant on {branding.appName}?</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-blue-200 text-[#0038ed] bg-blue-50/40 hover:bg-blue-50 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Create your seller account
                </button>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Proprietor Name *
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/40 hover:bg-white focus-within:bg-white focus-within:border-[#0038ed] focus-within:ring-3 focus-within:ring-[#0038ed]/10 transition-all">
                  <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="modal-input w-full text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (10 digits) *
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/40 hover:bg-white focus-within:bg-white focus-within:border-[#0038ed] focus-within:ring-3 focus-within:ring-[#0038ed]/10 transition-all">
                  <Phone className="w-4 h-4 text-slate-400 mr-1.5 shrink-0" />
                  <span className="text-xs font-semibold text-slate-500 mr-1.5 select-none">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                    className="modal-input w-full text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/40 hover:bg-white focus-within:bg-white focus-within:border-[#0038ed] focus-within:ring-3 focus-within:ring-[#0038ed]/10 transition-all">
                  <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="email"
                    placeholder="store.owner@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="modal-input w-full text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-xl px-2.5 py-2 bg-slate-50/40 hover:bg-white focus-within:bg-white focus-within:border-[#0038ed] transition-all">
                    <Lock className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Min 8 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="modal-input w-full text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Confirm *
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-xl px-2.5 py-2 bg-slate-50/40 hover:bg-white focus-within:bg-white focus-within:border-[#0038ed] transition-all">
                    <Lock className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Repeat"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="modal-input w-full text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer select-none"
                >
                  {showRegPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showRegPassword ? 'Hide password' : 'Show password'}</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account &amp; Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Switch to Login */}
              <div className="pt-2 text-center border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                    }}
                    className="font-bold text-[#0038ed] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* Legal Terms Footer */}
          <p className="text-[11px] text-slate-500 text-center pt-3.5 leading-relaxed">
            By continuing, you agree to {branding.appName}'s{' '}
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
        </div>
      </div>
    </div>
  );
};
