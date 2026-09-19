import React, { useState } from 'react';
import { SellerNavbar } from '../components/layout/SellerNavbar.js';
import {
  ShoppingBag,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { branding } from '../lib/branding.js';
import { api } from '../lib/api.js';
import { useAuthStore } from '../stores/authStore.js';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onGoToRegister }) => {
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
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      {/* Top Navbar */}
      <SellerNavbar onGoToLogin={() => {}} onGoToSignup={onGoToRegister} />

      {/* Main Hero & Login Split Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 lg:p-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
          {/* Left Hero Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Sell online to Crores of Customers with{' '}
                <span className="text-blue-600">{branding.appName}</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                List your products, manage orders and grow your business with India's local commerce
                platform.
              </p>
            </div>

            {/* 3 Value Propositions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">List Products</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Create your digital catalog in minutes.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Get Orders</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Receive orders from local customers.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Grow Business</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Manage, fulfill and scale with ease.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={onGoToRegister}
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer"
              >
                Start Selling Now
              </button>

              <button
                type="button"
                className="px-4 py-3.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Learn How it Works</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Login Card (Floating Form Box) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 w-full max-w-md">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Login</h2>

              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Identifier */}
                <div>
                  <input
                    type="text"
                    placeholder="Username or phone number or email"
                    value={identifier}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all pr-16"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-xs text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-700"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>

                {/* Submit Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Signing in...' : 'Login'}
                </button>

                {/* Don't have an account */}
                <div className="pt-4 text-center space-y-3">
                  <span className="text-xs text-slate-500 block">Don't have an account?</span>
                  <button
                    type="button"
                    onClick={onGoToRegister}
                    className="w-full py-3 px-6 rounded-xl border border-blue-600 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    Create your seller account
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 text-center pt-2">
                  By continuing, you agree to {branding.appName}'s{' '}
                  <span className="font-semibold text-slate-700">Terms of Use</span> &{' '}
                  <span className="font-semibold text-slate-700">Privacy Policy</span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
        &copy; {new Date().getFullYear()} {branding.appName}. Hyperlocal Retail Commerce Infrastructure.
      </footer>
    </div>
  );
};
