import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Key, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { MerchantOrderRecord } from '../../stores/orderStore.js';

interface VerifyOtpModalProps {
  order: MerchantOrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (orderId: string, otp: string) => Promise<boolean>;
}

export const VerifyOtpModal: React.FC<VerifyOtpModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '']);
      setError(null);
      setIsSuccess(false);
      setIsSubmitting(false);
      setTimeout(() => {
        inputRefs[0]?.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric single characters
    const clean = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = clean;
    setDigits(newDigits);
    setError(null);

    // Auto-advance to next input
    if (clean && index < 3) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasteData) return;
    const newDigits = ['', '', '', ''];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i] || '';
    }
    setDigits(newDigits);
    const nextFocusIndex = Math.min(pasteData.length, 3);
    inputRefs[nextFocusIndex]?.current?.focus();
  };

  const fullOtp = digits.join('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullOtp.length !== 4) {
      setError('Please enter the complete 4-digit OTP provided by the runner/customer.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onConfirm(order.id, fullOtp);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.message || 'Invalid delivery OTP. Please verify and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFillExpected = () => {
    if (order.otp) {
      const chars = String(order.otp).slice(0, 4).split('');
      while (chars.length < 4) chars.push('0');
      setDigits(chars);
      setError(null);
      inputRefs[3]?.current?.focus();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
          <Key className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 text-center leading-snug mb-1">
          Verify Delivery OTP
        </h3>
        <p className="text-xs text-slate-500 text-center leading-relaxed mb-4">
          Enter the 4-digit handshake OTP collected from the runner or customer to complete delivery for{' '}
          <span className="font-bold text-slate-800">{order.orderNumber}</span>.
        </p>

        {/* Order Details Brief Box */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl mb-4 text-xs space-y-1">
          <div className="flex justify-between text-slate-600">
            <span>Customer:</span>
            <span className="font-semibold text-slate-800">{order.customer.name}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Amount:</span>
            <span className="font-semibold text-slate-800">₹{order.pricing.totalAmount.toLocaleString('en-IN')}</span>
          </div>
          {order.otp && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-600">
              <span>Expected Runner OTP:</span>
              <button
                type="button"
                onClick={handleQuickFillExpected}
                className="font-mono font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                title="Click to auto-fill expected OTP"
              >
                <span>{order.otp}</span>
                <span className="text-[10px] text-blue-500 font-normal">(Click to fill)</span>
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>OTP Verified! Order Marked Delivered.</span>
          </div>
        )}

        {/* 4-Digit Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center items-center gap-2.5 sm:gap-3 py-1">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                disabled={isSubmitting || isSuccess}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black font-mono border-2 border-slate-200 rounded-2xl bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all shadow-2xs"
              />
            ))}
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isSuccess}
              className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess || fullOtp.length !== 4}
              className="w-1/2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </>
              ) : (
                <span>Confirm Delivery</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
