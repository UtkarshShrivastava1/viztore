import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, ToastType } from '../../stores/toastStore.js';

export const GlobalToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-5 right-5 z-[99999] pointer-events-none flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full px-3 sm:px-0"
    >
      {toasts.map((item) => {
        const isSuccess = item.type === 'success';
        const isError = item.type === 'error';
        const isWarning = item.type === 'warning';
        const isInfo = item.type === 'info';

        return (
          <div
            key={item.id}
            className={`pointer-events-auto w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 border shadow-xl transition-all duration-200 animate-in fade-in slide-in-from-top-3 flex items-start gap-3.5 ${
              isSuccess
                ? 'border-emerald-200/90 shadow-emerald-950/5 text-slate-800'
                : isError
                ? 'border-rose-200/90 shadow-rose-950/5 text-slate-800'
                : isWarning
                ? 'border-amber-200/90 shadow-amber-950/5 text-slate-800'
                : 'border-blue-200/90 shadow-blue-950/5 text-slate-800'
            }`}
          >
            {/* Visual Icon Badge */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                isSuccess
                  ? 'bg-emerald-50 border-emerald-200/80 text-emerald-600'
                  : isError
                  ? 'bg-rose-50 border-rose-200/80 text-rose-600'
                  : isWarning
                  ? 'bg-amber-50 border-amber-200/80 text-amber-600'
                  : 'bg-blue-50 border-blue-200/80 text-blue-600'
              }`}
            >
              {isSuccess && <CheckCircle2 className="w-5 h-5 stroke-[2.25]" />}
              {isError && <AlertCircle className="w-5 h-5 stroke-[2.25]" />}
              {isWarning && <AlertTriangle className="w-5 h-5 stroke-[2.25]" />}
              {isInfo && <Info className="w-5 h-5 stroke-[2.25]" />}
            </div>

            {/* Content Text */}
            <div className="flex-1 min-w-0 pr-1">
              <h5 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">
                {item.title}
              </h5>
              {item.message && (
                <p className="text-xs text-slate-600 font-normal mt-0.5 leading-relaxed break-words">
                  {item.message}
                </p>
              )}
            </div>

            {/* Close / Dismiss Button */}
            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

