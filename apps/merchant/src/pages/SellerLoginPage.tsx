import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  X,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { SellerLandingPage } from './SellerLandingPage.js';
import { branding } from '../lib/branding.js';
import { api } from '../lib/api.js';
import { useAuthStore } from '../stores/authStore.js';

interface SellerLoginPageProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
  onGoToHome?: () => void;
}

export const SellerLoginPage: React.FC<SellerLoginPageProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onGoToHome,
}) => {
  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setAuth } = useAuthStore();

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
    const cleanId = identifier.trim();
    if (!cleanId || !password) {
      setError('Please provide your registered email/phone and password.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post<any>('/auth/login', {
        identifier: cleanId,
        password,
        role: 'merchant',
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
        <SellerLandingPage onStartSelling={onGoToRegister} onLogin={() => {}} />
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
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <img
                src="/images/logo-dark.png"
                alt={branding.appName}
                className="h-7 w-auto object-contain"
              />
              <div className="h-4 w-px bg-slate-200 mx-1" />
              <span className="text-[11px] font-bold text-[#0038ed] uppercase tracking-wider block">
                Merchant Hub
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Merchant Login
            </h2>
          </div>

          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Access your merchant store management dashboard and live orders
          </p>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-medium flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* LOGIN FORM */}
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
                  id="merchant-login-id"
                  name="identifier"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
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
                  id="merchant-login-password"
                  name="password"
                  autoComplete="current-password"
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

            {/* Switch to Register -> Routes Directly to Canonical Onboarding Portal /register */}
            <div className="pt-3 text-center border-t border-slate-100">
              <span className="text-xs text-slate-500 block mb-2">New merchant on {branding.appName}?</span>
              <button
                type="button"
                onClick={() => {
                  if (onGoToRegister) {
                    onGoToRegister();
                  } else {
                    window.location.href = '/register';
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-blue-200 text-[#0038ed] bg-blue-50/40 hover:bg-blue-50 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Create your seller account
              </button>
            </div>
          </form>

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
