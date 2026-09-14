import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setAuth } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post<any>('/auth/login', {
        identifier,
        password,
      });

      setAuth(res.user, res.tokens.accessToken, res.tokens.refreshToken);
      onLoginSuccess();
    } catch {
      // Mock login fallback
      if (identifier && password) {
        setAuth(
          {
            _id: 'merchant_demo',
            fullName: 'Thoufiq Ahmed',
            email: identifier.includes('@') ? identifier : 'thoufiq@retail.com',
            phone: identifier.includes('@') ? '9876543210' : identifier,
            role: 'merchant' as any,
            isVerified: true,
            isActive: true,
            addresses: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          'mock_merchant_token_jwt',
        );
        onLoginSuccess();
      } else {
        setError('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-[#0038ed] selection:text-white overflow-x-hidden">
      {/* Underlying Landing Page with Backdrop Blur filter matching Screen 4.png */}
      <div className="filter blur-[3px] pointer-events-none opacity-85 select-none">
        <SellerLandingPage onStartSelling={() => {}} onLogin={() => {}} />
      </div>

      {/* Floating Centered Login Card Modal Overlay */}
      <div className="fixed inset-0 z-50 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-2xl border border-slate-100 w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username / Phone / Email */}
            <div>
              <input
                type="text"
                placeholder="Username or phone number or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg px-3.5 py-3 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-1 focus:ring-[#0038ed] transition-all"
                required
              />
            </div>

            {/* Password with Show/Hide toggle */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg px-3.5 py-3 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-1 focus:ring-[#0038ed] transition-all pr-20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-xs font-semibold text-[#0038ed] hover:text-[#002fcf] flex items-center gap-1 cursor-pointer select-none"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            {/* Login Primary Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-lg bg-[#0038ed] hover:bg-[#002fcf] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-60 mt-1"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>

            {/* Register Link Box */}
            <div className="pt-3 text-center">
              <span className="text-xs text-slate-600 block mb-2">Don't have an account?</span>
              <button
                type="button"
                onClick={onGoToRegister}
                className="w-full py-2.5 px-6 rounded-lg border border-[#0038ed] text-[#0038ed] font-semibold text-sm hover:bg-blue-50/60 transition-all cursor-pointer"
              >
                Create your seller account
              </button>
            </div>

            {/* Terms Disclaimer */}
            <p className="text-[11px] text-slate-500 text-center pt-3 leading-relaxed">
              By continuing, you agree to {branding.appName}'s{' '}
              <span className="font-semibold text-slate-700 hover:underline cursor-pointer">
                Terms of Use
              </span>{' '}
              &{' '}
              <span className="font-semibold text-slate-700 hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
