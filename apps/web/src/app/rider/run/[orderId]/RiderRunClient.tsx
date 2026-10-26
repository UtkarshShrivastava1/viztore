'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Store,
  Clock,
  ArrowRight,
  Coins,
  Lock,
  User,
  Check,
  MessageCircle,
  PackageCheck,
  RefreshCw,
} from 'lucide-react';
import { deliveryApi } from '@/lib/api/delivery';
import { ApiError } from '@/lib/api/client';
import {
  PILOT_RIDERS,
  type PilotRider,
  type RiderRunDetailsDto,
  DeliveryStatus,
} from '@repo/shared-types';
import { branding } from '@repo/shared-types';

interface RiderRunClientProps {
  orderId: string;
}

export function RiderRunClient({ orderId }: RiderRunClientProps) {
  const [selectedRider, setSelectedRider] = useState<PilotRider | null>(null);
  const [pilotRoster, setPilotRoster] = useState<PilotRider[]>(PILOT_RIDERS);
  const [runDetails, setRunDetails] = useState<RiderRunDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAlreadyClaimedByOther, setIsAlreadyClaimedByOther] = useState(false);
  const [claimedByName, setClaimedByName] = useState<string>('Another Partner');

  // OTP Inputs (4 digits)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // 1. Load active pilot rider from localStorage or initialize
  useEffect(() => {
    const savedRiderId = localStorage.getItem('viztore_rider_id');
    if (savedRiderId) {
      const found = pilotRoster.find((r) => r.id === savedRiderId);
      if (found) {
        setSelectedRider(found);
      }
    } else {
      setSelectedRider(pilotRoster[0] || null);
    }

    // Attempt to load fresh roster from API
    deliveryApi
      .getPilotRoster()
      .then((roster) => {
        if (roster && roster.length > 0) {
          setPilotRoster(roster);
          if (savedRiderId) {
            const match = roster.find((r) => r.id === savedRiderId);
            if (match) setSelectedRider(match);
          }
        }
      })
      .catch(() => {
        // Fallback to static PILOT_RIDERS
      });
  }, []);

  // 2. Fetch run details whenever orderId or selectedRider changes
  const fetchRun = async (riderId?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const details = await deliveryApi.getRunDetails(orderId, riderId);
      setRunDetails(details);

      if (details.isClaimed && !details.isClaimedByCaller) {
        setIsAlreadyClaimedByOther(true);
        if (details.claimedByRider?.name) {
          setClaimedByName(details.claimedByRider.name);
        }
      } else {
        setIsAlreadyClaimedByOther(false);
      }
    } catch (err: any) {
      if (err instanceof ApiError && err.statusCode === 404) {
        setErrorMessage('Delivery run not found for this order. It may have expired or was cancelled.');
      } else {
        setErrorMessage(err?.message || 'Failed to load delivery run information.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRun(selectedRider?.id);
  }, [orderId, selectedRider?.id]);

  // Handle rider switch
  const handleRiderChange = (riderId: string) => {
    const found = pilotRoster.find((r) => r.id === riderId);
    if (found) {
      setSelectedRider(found);
      localStorage.setItem('viztore_rider_id', found.id);
      fetchRun(found.id);
    }
  };

  // 3. Claim Action
  const handleClaimRun = async () => {
    if (!selectedRider) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await deliveryApi.claimRun(orderId, selectedRider);
      // Refresh run details to unlock full store and customer data
      await fetchRun(selectedRider.id);
    } catch (err: any) {
      if (err instanceof ApiError && (err.statusCode === 409 || err.code === 'DELIVERY_ALREADY_CLAIMED')) {
        setIsAlreadyClaimedByOther(true);
      } else {
        setErrorMessage(err?.message || 'Could not claim run. Please retry.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Mark Picked Up Action
  const handleMarkPickedUp = async () => {
    setIsSubmitting(true);
    try {
      await deliveryApi.updateStatus(orderId, DeliveryStatus.PICKED_UP, 'Rider picked up package from store');
      await fetchRun(selectedRider?.id);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update pickup status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    const char = value.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const nextDigits = [...otpDigits];
    nextDigits[index] = char;
    setOtpDigits(nextDigits);
    setOtpError(null);

    // Auto-focus next input
    if (char && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  // 6. Verify OTP and Complete Delivery
  const handleVerifyOtp = async () => {
    const otp = otpDigits.join('');
    if (otp.length !== 4) {
      setOtpError('Please enter all 4 digits of the Delivery OTP.');
      return;
    }

    setIsSubmitting(true);
    setOtpError(null);

    try {
      await deliveryApi.verifyOtp(orderId, otp);
      await fetchRun(selectedRider?.id);
    } catch (err: any) {
      const msg = err?.error?.message || err?.message;
      setOtpError(msg || 'Invalid OTP! Please ask customer to re-check their order tracking screen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Loading delivery run details...</p>
      </div>
    );
  }

  // Render Error
  if (errorMessage && !runDetails) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Delivery Run Unavailable</h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6">{errorMessage}</p>
        <button
          onClick={() => fetchRun(selectedRider?.id)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const isDelivered = runDetails?.status === DeliveryStatus.DELIVERED;
  const isPickedUp =
    runDetails?.status === DeliveryStatus.PICKED_UP ||
    runDetails?.status === DeliveryStatus.IN_TRANSIT ||
    runDetails?.status === DeliveryStatus.ARRIVED ||
    isDelivered;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      {/* Top Mobile App Bar */}
      <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {branding.appName} Fleet Portal
            </h1>
            <p className="text-sm font-extrabold text-white">
              Run: {runDetails?.orderNumber || orderId}
            </p>
          </div>
        </div>

        {/* Rider Selector Dropdown */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <select
              aria-label="Select Active Rider"
              value={selectedRider?.id || ''}
              onChange={(e) => handleRiderChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 appearance-none pr-7 font-medium focus:outline-hidden focus:border-emerald-500"
            >
              {pilotRoster.map((r) => (
                <option key={r.id} value={r.id}>
                  🛵 {r.name.split(' ')[0]}
                </option>
              ))}
            </select>
            <User className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-md p-4 space-y-4 pb-12 flex-1">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ── STATE 2: ALREADY CLAIMED BY SOMEONE ELSE ───────────────────── */}
        {isAlreadyClaimedByOther && (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">Run Already Claimed!</h3>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              This delivery assignment was claimed by <strong className="text-amber-300">{claimedByName}</strong> moments ago.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Return to WhatsApp Group</span>
              </a>
            </div>
          </div>
        )}

        {/* ── STATE 4: DELIVERED (SUCCESS SCREEN) ────────────────────────── */}
        {isDelivered && (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Delivery Completed & Verified!</h2>
              <p className="text-xs text-emerald-200/80 mt-1">
                4-digit customer OTP was verified. Order marked delivered.
              </p>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Rider Partner:</span>
                <span className="font-bold text-white">{selectedRider?.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Delivery Earnings:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  +₹{runDetails?.estimatedPayout || 40}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Order Reference:</span>
                <span className="font-mono text-slate-300">{runDetails?.orderNumber}</span>
              </div>
            </div>

            <a
              href="https://wa.me"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-950/40"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Back to WhatsApp Orders Portal</span>
            </a>
          </div>
        )}

        {/* ── STATE 1: UNCLAIMED TEASER CARD ────────────────────────────── */}
        {!runDetails?.isClaimed && !isAlreadyClaimedByOther && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Payout & Distance Hero */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/80 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold">
                    <Coins className="w-3 h-3" />
                    <span>Payout ₹{runDetails?.estimatedPayout || 40}</span>
                  </span>
                  <h3 className="text-lg font-extrabold text-white mt-2">New Delivery Run</h3>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-slate-400">Road Distance</span>
                  <div className="text-base font-extrabold text-slate-200">
                    ~{runDetails?.distanceKm || 1.8} km
                  </div>
                </div>
              </div>

              {/* Area summary */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-700/60">
                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Store className="w-3 h-3 text-blue-400" />
                    <span>Pickup Area</span>
                  </div>
                  <div className="text-xs font-bold text-white mt-1 truncate">
                    {runDetails?.pickupArea || 'Local Store'}
                  </div>
                </div>

                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>Drop Area</span>
                  </div>
                  <div className="text-xs font-bold text-white mt-1 truncate">
                    {runDetails?.dropoffArea || 'Customer Area'}
                  </div>
                </div>
              </div>

              {/* COD or Prepaid Notice */}
              <div
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                  runDetails?.paymentMethod === 'CASH_ON_DELIVERY' || runDetails?.paymentMethod === 'COD'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
              >
                <span>
                  {runDetails?.paymentMethod === 'CASH_ON_DELIVERY' || runDetails?.paymentMethod === 'COD'
                    ? `💰 Collect ₹${runDetails?.totalAmount?.toLocaleString('en-IN') || 0} Cash on Delivery`
                    : '✅ Prepaid Online (Do not collect cash)'}
                </span>
              </div>
            </div>

            {/* Accept Button */}
            <button
              type="button"
              disabled={isSubmitting || !selectedRider}
              onClick={handleClaimRun}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  <span>Locking Run...</span>
                </>
              ) : (
                <>
                  <span>ACCEPT RUN & START PICKUP</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Claiming as <strong className="text-slate-200">{selectedRider?.name}</strong>. First rider to tap wins the lock.
            </p>
          </div>
        )}

        {/* ── STATE 3: ACTIVE DELIVERY RUN (CLAIMED BY CALLER) ──────────── */}
        {runDetails?.isClaimedByCaller && !isDelivered && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Step Progress Tracker */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs font-bold">
              <div
                className={`flex items-center gap-1.5 ${
                  !isPickedUp ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                    !isPickedUp
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {isPickedUp ? <Check className="w-3.5 h-3.5" /> : '1'}
                </div>
                <span>Pickup</span>
              </div>

              <div className="w-8 h-0.5 bg-slate-800" />

              <div
                className={`flex items-center gap-1.5 ${
                  isPickedUp ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                    isPickedUp
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  2
                </div>
                <span>Doorstep OTP</span>
              </div>
            </div>

            {/* CARD A: STORE PICKUP */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                !isPickedUp
                  ? 'bg-slate-900 border-blue-500/40 shadow-lg'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    <span>Step 1: Store Pickup</span>
                  </span>
                  <h4 className="text-base font-extrabold text-white mt-1">
                    {runDetails.pickupDetails?.storeName || 'Merchant Store'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">
                    {runDetails.pickupDetails?.pickupAddress}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400">Order Code</span>
                  <div className="text-sm font-black text-emerald-400 font-mono">
                    {runDetails.pickupDetails?.pickupCode}
                  </div>
                </div>
              </div>

              {/* Navigation button */}
              {!isPickedUp && (
                <div className="mt-4 space-y-2.5">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`✅ *ORDER CLAIMED!* I am picking up #${runDetails.orderNumber} from ${runDetails.pickupDetails?.storeName || 'Store'}. — ${selectedRider?.name || 'Rider'} 🛵💨`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Post "Claimed" to Fleet Group</span>
                  </a>

                  <a
                    href={runDetails.pickupDetails?.navigationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Navigate to Store (Google Maps)</span>
                  </a>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleMarkPickedUp}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>I Have Picked Up the Package</span>
                  </button>
                </div>
              )}
            </div>

            {/* CARD B: CUSTOMER DROPOFF & CASH */}
            {isPickedUp && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-lg space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Step 2: Customer Doorstep</span>
                  </span>
                  <h4 className="text-base font-extrabold text-white mt-1">
                    {runDetails.dropoffDetails?.customerName || 'Customer'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">
                    {runDetails.dropoffDetails?.dropoffAddress}
                  </p>
                </div>

                {/* COD Cash Collection Notice */}
                <div
                  className={`p-3 rounded-xl border text-xs font-bold ${
                    runDetails.paymentMethod === 'CASH_ON_DELIVERY' || runDetails.paymentMethod === 'COD'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {runDetails.paymentMethod === 'CASH_ON_DELIVERY' || runDetails.paymentMethod === 'COD' ? (
                    <div className="flex items-center justify-between">
                      <span>💰 Collect Cash at Doorstep:</span>
                      <span className="text-sm font-extrabold">
                        ₹{runDetails.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : (
                    <span>✅ Already Paid Online (Do not collect cash)</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={runDetails.dropoffDetails?.navigationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate</span>
                  </a>

                  {runDetails.dropoffDetails?.customerPhone ? (
                    <a
                      href={`tel:${runDetails.dropoffDetails.customerPhone}`}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>Call Customer</span>
                    </a>
                  ) : (
                    <div className="py-2.5 px-3 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-500 font-semibold text-xs flex items-center justify-center gap-1.5">
                      <span>No phone provided</span>
                    </div>
                  )}
                </div>

                {/* CARD C: DOORSTEP OTP HANDSHAKE */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Enter Customer Delivery OTP</span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Ask customer for the 4-digit code shown on their tracking screen
                    </p>
                  </div>

                  {/* 4 Digit Boxes */}
                  <div className="flex justify-center gap-3 py-1">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-14 text-center text-xl font-mono font-black rounded-xl bg-slate-950 border-2 border-slate-700 focus:border-emerald-500 focus:outline-hidden text-white transition-all"
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p className="text-xs text-rose-400 text-center font-semibold animate-shake">
                      {otpError}
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={isSubmitting || otpDigits.join('').length !== 4}
                    onClick={handleVerifyOtp}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        <span>Verifying OTP...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>VERIFY OTP & COMPLETE DELIVERY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
