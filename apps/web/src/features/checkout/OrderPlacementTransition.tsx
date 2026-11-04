'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, ShoppingBag, Sparkles, Zap, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { branding } from '@repo/shared-types';
import type { PlacementStage } from '@/stores/checkoutStore';

export type { PlacementStage };

interface OrderPlacementTransitionProps {
  stage: PlacementStage;
  orderNumber?: string;
  storeName?: string;
  grandTotal?: number;
  itemCount?: number;
}

const SUBMITTING_STEPS = [
  'Connecting with local merchant store...',
  'Reserving inventory & locking prices...',
  'Dispatching WhatsApp & in-app alerts...',
  'Assigning nearby delivery partner...',
  'Preparing live order tracking cockpit...',
];

export function OrderPlacementTransition({
  stage,
  orderNumber,
  storeName,
  grandTotal,
  itemCount,
}: OrderPlacementTransitionProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progressPercent, setProgressPercent] = useState(18);

  // Rotate through steps smoothly while submitting
  useEffect(() => {
    if (stage !== 'submitting') {
      if (stage === 'confirmed') {
        setProgressPercent(100);
      }
      return;
    }

    setCurrentStepIdx(0);
    setProgressPercent(22);

    const stepInterval = setInterval(() => {
      setCurrentStepIdx((prev) => {
        const next = (prev + 1) % SUBMITTING_STEPS.length;
        setProgressPercent((p) => Math.min(p + 16, 94));
        return next;
      });
    }, 1400);

    return () => clearInterval(stepInterval);
  }, [stage]);

  if (stage === 'idle') return null;

  const isConfirmed = stage === 'confirmed';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-in fade-in duration-300 select-none"
    >
      {/* Ambient background glow */}
      <div
        className={`absolute w-96 h-96 rounded-full blur-3xl opacity-40 transition-all duration-700 pointer-events-none ${
          isConfirmed ? 'bg-emerald-500 scale-125' : 'bg-blue-600 animate-pulse'
        }`}
      />

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl border border-white/15 bg-slate-900/95 p-8 sm:p-9 shadow-2xl backdrop-blur-2xl text-center overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Subtle decorative particles when confirmed */}
        {isConfirmed && (
          <>
            <span className="absolute top-4 left-6 text-emerald-400 text-lg animate-bounce">✨</span>
            <span className="absolute top-7 right-8 text-yellow-400 text-base animate-pulse">🎉</span>
            <span className="absolute bottom-6 left-10 text-cyan-400 text-sm animate-ping">⚡</span>
            <span className="absolute bottom-7 right-8 text-emerald-400 text-lg animate-bounce delay-150">✨</span>
          </>
        )}

        {/* Center Animated Icon Container */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          {/* Animated concentric pulse rings */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 ${
              isConfirmed
                ? 'bg-emerald-500/20 ring-4 ring-emerald-500/40 animate-ping [animation-duration:2s]'
                : 'bg-blue-500/15 ring-2 ring-blue-500/30 animate-pulse'
            }`}
          />
          <div
            className={`absolute inset-2 rounded-full transition-all duration-500 ${
              isConfirmed ? 'bg-emerald-500/25 border border-emerald-400/50' : 'bg-blue-500/25 border border-blue-400/40'
            }`}
          />

          {/* Rotating Spinner Halo (while submitting) */}
          {!isConfirmed && (
            <svg
              className="absolute inset-0 w-full h-full animate-spin text-blue-400 [animation-duration:2s]"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="65 200"
                strokeLinecap="round"
                className="opacity-90"
              />
            </svg>
          )}

          {/* Core Icon */}
          <div className="relative z-10">
            {isConfirmed ? (
              <div className="animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 stroke-[2.5]" />
              </div>
            ) : (
              <div className="animate-bounce [animation-duration:1.2s]">
                <ShoppingBag className="h-10 w-10 text-blue-400 stroke-[2]" />
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
          {isConfirmed ? 'Order Confirmed! 🎉' : 'Processing Your Order...'}
        </h2>

        {/* Store Context or Order Number */}
        <div className="min-h-[28px] mb-4 flex items-center justify-center">
          {isConfirmed && orderNumber ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold tracking-wider animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`}</span>
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              {storeName ? `Ordering from ${storeName}` : `Processing order for ${itemCount || 1} item(s)`}
              {grandTotal ? ` • ₹${grandTotal.toLocaleString('en-IN')}` : ''}
            </span>
          )}
        </div>

        {/* Subtitle / Step text */}
        <p className="text-sm text-slate-200 font-medium mb-6 min-h-[40px] flex items-center justify-center transition-all duration-300 px-2">
          {isConfirmed ? (
            <span className="text-emerald-300 flex items-center gap-2 font-semibold animate-in fade-in">
              <span>Transitioning directly to live tracking</span>
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </span>
          ) : (
            <span className="text-slate-300 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin [animation-duration:3s]" />
              <span>{SUBMITTING_STEPS[currentStepIdx]}</span>
            </span>
          )}
        </p>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-800/90 rounded-full h-2.5 overflow-hidden mb-4 p-0.5 border border-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isConfirmed
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_14px_rgba(16,185,129,0.8)]'
                : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.6)]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Footer info pills */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-4">
          <span className="flex items-center gap-1 text-slate-300 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Hyperlocal Quick Delivery</span>
          </span>
          <span className="flex items-center gap-1 text-slate-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Local Merchant</span>
          </span>
        </div>
      </div>
    </div>
  );
}

