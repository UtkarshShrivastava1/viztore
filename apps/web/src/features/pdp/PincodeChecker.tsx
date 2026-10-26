'use client';

import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePdpStore } from '@/stores/pdp.store';

interface PincodeCheckerProps {
  className?: string;
}

export function PincodeChecker({ className = '' }: PincodeCheckerProps) {
  const {
    deliveryPincode,
    isPincodeValid,
    deliveryEstimate,
    validatePincode,
  } = usePdpStore();

  const [inputVal, setInputVal] = useState(deliveryPincode || '452001');
  const [hasChecked, setHasChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Run initial check if default pincode provided
  React.useEffect(() => {
    if (!deliveryPincode && inputVal) {
      validatePincode(inputVal);
      setHasChecked(true);
    }
  }, [deliveryPincode, inputVal, validatePincode]);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = inputVal.trim();
    if (!cleanPin) {
      setErrorMsg('Please enter a 6-digit PIN code');
      return;
    }
    const valid = validatePincode(cleanPin);
    setHasChecked(true);
    if (!valid) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code');
    } else {
      setErrorMsg('');
    }
  };

  return (
    <div className={`bg-surface-50 border border-surface-200 rounded-2xl p-4 sm:p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#1668F6]" />
          <h3 className="text-sm font-extrabold text-[#061842]">Delivery & Services</h3>
        </div>
        {isPincodeValid && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Hyperlocal Active
          </span>
        )}
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            maxLength={6}
            value={inputVal}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setInputVal(val);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Enter 6-digit PIN code"
            className="w-full h-11 px-3.5 text-sm font-semibold text-[#061842] bg-white border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1668F6] focus:border-transparent placeholder:text-surface-400 placeholder:font-normal tracking-wide"
          />
        </div>
        <button
          type="submit"
          className="h-11 px-5 rounded-xl bg-[#1668F6] hover:bg-blue-700 text-white text-xs font-extrabold transition-all active:scale-95 shadow-sm whitespace-nowrap"
        >
          Check
        </button>
      </form>

      {errorMsg && (
        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-rose-600 font-semibold animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {hasChecked && isPincodeValid && deliveryEstimate && (
        <div className="mt-3.5 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <Truck className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-extrabold text-emerald-950 leading-snug">
              {deliveryEstimate}
            </p>
            <p className="text-[11px] font-medium text-emerald-700 mt-0.5">
              Dispatched from nearest local verified hub within 30 mins
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
