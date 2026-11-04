'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, ShoppingBag, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { branding } from '@repo/shared-types';

export type PlacementStage = 'idle' | 'submitting' | 'confirmed' | 'error';

interface OrderPlacementTransitionProps {
  stage: PlacementStage;
  orderNumber?: string;
  storeName?: string;
  grandTotal?: number;
  itemCount?: number;
}

const SUBMITTING_STEPS = [
  'Connecting with local store...',
  'Reserving inventory & locking prices...',
  'Dispatching order confirmation...',
  'Opening live tracking dashboard...',
];

export function OrderPlacementTransition({
  stage,
  orderNumber,
  storeName,
  grandTotal,
  itemCount,
}: OrderPlacementTransitionProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);

  // Rotate through steps while submitting
  useEffect(() => {
    if (stage !== 'submitting') {
      if (stage === 'confirmed') {
        setProgressPercent(100);
      }
      return;
    }

    setCurrentStepIdx(0);
    setProgressPercent(20);

    const stepInterval = setInterval(() => {
      setCurrentStepIdx((prev) => {
        const next = Math.min(prev + 1, SUBMITTING_STEPS.length - 1);
        setProgressPercent((p) => Math.min(p + 25, 92));
        return next;
      });
    }, 700);

    return () => clearInterval(stepInterval);
  }, [stage]);

  if (stage === 'idle') return null;

  const isConfirmed = stage === 'confirmed';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 select-none"
    >
      {/* Ambient background glow */}
      <div
        className={`absolute w-80 h-80 rounded-full blur-3xl opacity-40 transition-all duration-700 pointer-events-none ${
          isConfirmed ? 'bg-emerald-500 scale-125' : 'bg-blue-600 animate-pulse'
        }`}
      />

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-8 sm:p-9 shadow-2xl backdrop-blur-xl text-center overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Subtle decorative particles when confirmed */}
        {isConfirmed && (
          <>
            <span className="absolute top-4 left-6 text-emerald-400 text-base animate-bounce">✨</span>
            <span className="absolute top-8 right-8 text-yellow-400 text-sm animate-pulse">🎉</span>
            <span className="absolute bottom-6 left-10 text-blue-400 text-xs animate-ping">⚡</span>
            <span className="absolute bottom-8 right-8 text-emerald-400 text-base animate-bounce delay-150">✨</span>
          </>
        )}

        {/* Center Animated Icon Container */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          {/* Animated concentric pulse rings */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 ${
              isConfirmed
                ? 'bg-emerald-500/20 ring-4 ring-emerald-500/30 animate-ping [animation-duration:2s]'
                : 'bg-blue-500/10 ring-2 ring-blue-500/20 animate-pulse'
            }`}
          />
          <div
            className={`absolute inset-2 rounded-full transition-all duration-500 ${
              isConfirmed ? 'bg-emerald-500/20 border border-emerald-400/40' : 'bg-blue-500/20 border border-blue-400/30'
            }`}
          />

          {/* Rotating Spinner Halo (while submitting) */}
          {!isConfirmed && (
            <svg
              className="absolute inset-0 w-full h-full animate-spin text-blue-500 [animation-duration:2.5s]"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="70 200"
                strokeLinecap="round"
                className="opacity-80"
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
          {isConfirmed ? 'Order Confirmed! 🎉' : 'Placing Your Order...'}
        </h2>

        {/* Store Context or Order Number */}
        <div className="min-h-[28px] mb-4 flex items-center justify-center">
          {isConfirmed && orderNumber ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold tracking-wider animate-in fade-in">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`}</span>
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              {storeName ? `Ordering from ${storeName}` : `Processing order for ${itemCount || 1} item(s)`}
            </span>
          )}
        </div>

        {/* Subtitle / Step text */}
        <p className="text-sm text-slate-300 font-medium mb-6 min-h-[40px] flex items-center justify-center transition-all duration-300">
          {isConfirmed ? (
            <span className="text-emerald-300 flex items-center gap-1.5 animate-in fade-in">
              <span>Transitioning directly to live tracking</span>
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </span>
          ) : (
            <span>{SUBMITTING_STEPS[currentStepIdx]}</span>
          )}
        </p>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-4 p-0.5 border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isConfirmed
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.7)]'
                : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Footer info pills */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-4">
          <span className="flex items-center gap-1 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Same-Day Regional Delivery</span>
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Local Merchant</span>
          </span>
        </div>
      </div>
    </div>
  );
}

