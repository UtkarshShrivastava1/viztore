'use client';

import React from 'react';
import { useToastStore, type ToastItem } from '@/stores/toast.store';
import { Sparkles, CheckCircle2, AlertCircle, Info, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);
  const router = useRouter();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-md w-[calc(100vw-2rem)] pointer-events-none sm:top-6 sm:right-6"
    >
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
          onNavigate={(url) => {
            dismissToast(toast.id);
            router.push(url);
          }}
        />
      ))}
    </div>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: () => void;
  onNavigate: (url: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss, onNavigate }) => {
  const isWelcome = toast.type === 'welcome';
  const duration = toast.duration ?? 4500;

  return (
    <div
      role="status"
      className={`pointer-events-auto relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
        isWelcome
          ? 'bg-gradient-to-br from-slate-950 via-[#031b57] to-[#0a2f8a] text-white border border-blue-400/30 shadow-blue-950/50'
          : toast.type === 'error'
          ? 'bg-red-950/95 text-white border border-red-500/30 shadow-red-950/40 backdrop-blur-xl'
          : toast.type === 'success'
          ? 'bg-emerald-950/95 text-white border border-emerald-500/30 shadow-emerald-950/40 backdrop-blur-xl'
          : 'bg-slate-900/95 text-white border border-slate-700/50 shadow-slate-950/50 backdrop-blur-xl'
      }`}
    >
      {/* Glow decorative orb for welcome toast */}
      {isWelcome && (
        <div
          className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-blue-500/20 blur-2xl pointer-events-none"
          aria-hidden="true"
        />
      )}

      <div className="relative p-4 sm:p-4.5 flex items-start gap-3.5">
        {/* Left Icon or User Initial Avatar */}
        {isWelcome ? (
          <div className="relative shrink-0">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-[#1668F6] to-[#4C82FB] flex items-center justify-center font-black text-lg text-white shadow-lg shadow-blue-500/30 border border-white/20">
              {toast.avatarInitial || 'S'}
            </div>
            {/* Active pulsing green dot */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950" />
            </span>
          </div>
        ) : (
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && (
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="h-6 w-6 text-red-400" />
            )}
            {toast.type === 'info' && (
              <Info className="h-6 w-6 text-blue-400" />
            )}
            {toast.type === 'warning' && (
              <AlertCircle className="h-6 w-6 text-amber-400" />
            )}
          </div>
        )}

        {/* Text Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-1.5 mb-1">
            {isWelcome && <Sparkles className="h-4 w-4 text-amber-300 animate-pulse shrink-0" />}
            <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
              {toast.title}
            </h4>
          </div>

          {toast.message && (
            <p className="text-xs text-white/80 leading-relaxed">
              {toast.message}
            </p>
          )}

          {/* Quick Action Button */}
          {toast.action && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={toast.action.onClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-semibold text-white transition-all border border-white/10 shadow-sm"
              >
                <span>{toast.action.label}</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}

          {isWelcome && !toast.action && (
            <div className="mt-2.5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/account')}
                className="text-xs font-medium text-blue-300 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
              >
                View Profile
              </button>
              <span className="text-white/30">•</span>
              <button
                type="button"
                onClick={() => onNavigate('/stores')}
                className="text-xs font-medium text-blue-300 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
              >
                Explore Nearby Stores
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3.5 right-3.5 p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Dismiss toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Shrinking progress bar */}
      {duration > 0 && (
        <div className="h-1 w-full bg-white/10 overflow-hidden">
          <div
            className={`h-full ${
              isWelcome
                ? 'bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400'
                : toast.type === 'error'
                ? 'bg-red-400'
                : toast.type === 'success'
                ? 'bg-emerald-400'
                : 'bg-blue-400'
            }`}
            style={{
              animation: `toast-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

