'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Lock,
  User,
  Check,
  MessageCircle,
  PackageCheck,
  RefreshCw,
  Radio,
  LocateFixed,
  Bike,
  Banknote,
  Route,
} from 'lucide-react';
import { deliveryApi } from '@/lib/api/delivery';
import { ApiError } from '@/lib/api/client';
import {
  PILOT_RIDERS,
  type PilotRider,
  type RiderRunDetailsDto,
  DeliveryStatus,
} from '@repo/shared-types';

interface RiderRunClientProps {
  orderId: string;
}

interface RiderCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
}

type GpsStatus = 'searching' | 'active' | 'denied' | 'unsupported';

// Helper: Haversine distance in meters
function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function formatMeters(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
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

  // Geolocation & Live Telemetry State
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('searching');
  const [riderCoords, setRiderCoords] = useState<RiderCoordinates | null>(null);
  const lastTelemetrySyncRef = useRef<number>(0);

  // OTP Inputs (4 digits)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isCashCollected, setIsCashCollected] = useState(false);
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // 1. Load active pilot rider from localStorage or initialize
  useEffect(() => {
    const savedRiderId = localStorage.getItem('rider_partner_id');
    if (savedRiderId) {
      const found = pilotRoster.find((r) => r.id === savedRiderId);
      if (found) {
        setSelectedRider(found);
      }
    } else {
      setSelectedRider(pilotRoster[0] || null);
    }

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

      const isClaimedByMe = Boolean(
        details.isClaimedByCaller ||
          (details.isClaimed && riderId && details.claimedByRider?.id === riderId),
      );

      if (details.isClaimed && !isClaimedByMe) {
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
      localStorage.setItem('rider_partner_id', found.id);
      fetchRun(found.id);
    }
  };

  // 3. Geolocation Tracking
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus('unsupported');
      return;
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 4000,
      timeout: 12000,
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: RiderCoordinates = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
          heading: pos.coords.heading,
          speed: pos.coords.speed,
        };
        setRiderCoords(coords);
        setGpsStatus('active');

        // Throttle telemetry push to backend
        const now = Date.now();
        if (
          now - lastTelemetrySyncRef.current > 8000 &&
          selectedRider &&
          runDetails?.isClaimedByCaller
        ) {
          lastTelemetrySyncRef.current = now;
          deliveryApi
            .updateLocation(orderId, {
              latitude: coords.latitude,
              longitude: coords.longitude,
              accuracy: coords.accuracy,
              heading: coords.heading ?? undefined,
              speed: coords.speed ?? undefined,
            })
            .catch(() => {});
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGpsStatus('denied');
        } else {
          setGpsStatus('searching');
        }
      },
      geoOptions,
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [orderId, selectedRider?.id, runDetails?.isClaimedByCaller]);

  // 4. Claim Run Handler
  const handleClaimRun = async () => {
    if (!selectedRider) {
      setErrorMessage('Please select a rider before claiming the run.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await deliveryApi.claimRun(orderId, selectedRider);
      await fetchRun(selectedRider.id);
    } catch (err: any) {
      if (err instanceof ApiError && err.statusCode === 409) {
        setIsAlreadyClaimedByOther(true);
        setErrorMessage('Another rider just claimed this run moments ago.');
      } else {
        setErrorMessage(err?.message || 'Could not claim this delivery run.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Mark Picked Up Handler
  const handleMarkPickedUp = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await deliveryApi.updateStatus(
        orderId,
        DeliveryStatus.PICKED_UP,
        'Package picked up from store counter',
      );
      await fetchRun(selectedRider?.id);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not update pickup status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. OTP Handlers
  const handleOtpChange = (index: number, value: string) => {
    const char = value.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const nextDigits = [...otpDigits];
    nextDigits[index] = char;
    setOtpDigits(nextDigits);
    setOtpError(null);

    if (char && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  // 7. Verify OTP
  const handleVerifyOtp = async () => {
    const otp = otpDigits.join('');
    if (otp.length !== 4) {
      setOtpError('Please enter all 4 digits of the Delivery OTP.');
      return;
    }

    if (isCod && !isCashCollected) {
      setOtpError(`Please confirm that you have received the ₹${runDetails?.totalAmount?.toLocaleString('en-IN') || 0} cash first.`);
      return;
    }

    setIsSubmitting(true);
    setOtpError(null);

    try {
      await deliveryApi.verifyOtp(orderId, otp);
      await fetchRun(selectedRider?.id);
    } catch (err: any) {
      const msg = err?.error?.message || err?.message;
      setOtpError(msg || 'Invalid OTP! Please ask customer to re-check their order screen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDelivered = runDetails?.status === DeliveryStatus.DELIVERED;
  const isPickedUp =
    runDetails?.status === DeliveryStatus.PICKED_UP ||
    runDetails?.status === DeliveryStatus.IN_TRANSIT ||
    runDetails?.status === DeliveryStatus.ARRIVED ||
    isDelivered;

  const isClaimedByCaller = Boolean(
    runDetails?.isClaimedByCaller ||
      (runDetails?.isClaimed && selectedRider?.id && runDetails?.claimedByRider?.id === selectedRider?.id),
  );

  const isClaimedByAnotherRider = Boolean(
    isAlreadyClaimedByOther ||
      (runDetails?.isClaimed && !isClaimedByCaller),
  );

  // Is COD check
  const isCod =
    runDetails?.paymentMethod === 'CASH_ON_DELIVERY' ||
    runDetails?.paymentMethod === 'COD' ||
    String(runDetails?.paymentMethod || '').toLowerCase().includes('cash');

  // Distance 1: Rider -> Store
  const distanceRiderToStoreMeters = useMemo(() => {
    if (!runDetails?.pickupCoordinates) return null;
    if (!riderCoords) return null;
    const [storeLng, storeLat] = runDetails.pickupCoordinates;
    return calculateDistanceMeters(riderCoords.latitude, riderCoords.longitude, storeLat, storeLng);
  }, [riderCoords, runDetails]);

  // Distance 2: Store -> Customer
  const distanceStoreToDropoffMeters = useMemo(() => {
    if (runDetails?.pickupCoordinates && runDetails?.dropoffCoordinates) {
      const [sLng, sLat] = runDetails.pickupCoordinates;
      const [dLng, dLat] = runDetails.dropoffCoordinates;
      return calculateDistanceMeters(sLat, sLng, dLat, dLng);
    }
    if (runDetails?.distanceKm) {
      return Math.round(runDetails.distanceKm * 1000);
    }
    return 2400; // default 2.4 km
  }, [runDetails]);

  // Distance 3: Total Trip Run
  const totalTripDistanceMeters = useMemo(() => {
    const leg1 = distanceRiderToStoreMeters ?? 1200;
    const leg2 = distanceStoreToDropoffMeters ?? 2400;
    return leg1 + leg2;
  }, [distanceRiderToStoreMeters, distanceStoreToDropoffMeters]);

  // Dynamic distance to current destination
  const activeDistanceMeters = useMemo(() => {
    if (!riderCoords || !runDetails) return null;
    if (!isPickedUp && runDetails.pickupCoordinates) {
      const [lng, lat] = runDetails.pickupCoordinates;
      return calculateDistanceMeters(riderCoords.latitude, riderCoords.longitude, lat, lng);
    }
    if (isPickedUp && runDetails.dropoffCoordinates) {
      const [lng, lat] = runDetails.dropoffCoordinates;
      return calculateDistanceMeters(riderCoords.latitude, riderCoords.longitude, lat, lng);
    }
    return null;
  }, [riderCoords, runDetails, isPickedUp]);

  // Turn-by-turn Navigation URLs
  const livePickupNavUrl = useMemo(() => {
    if (riderCoords && runDetails?.pickupCoordinates) {
      const [lng, lat] = runDetails.pickupCoordinates;
      return `https://www.google.com/maps/dir/?api=1&origin=${riderCoords.latitude},${riderCoords.longitude}&destination=${lat},${lng}&travelmode=two-wheeler`;
    }
    if (runDetails?.pickupCoordinates) {
      const [lng, lat] = runDetails.pickupCoordinates;
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=two-wheeler`;
    }
    return runDetails?.pickupDetails?.navigationUrl;
  }, [riderCoords, runDetails]);

  const liveDropoffNavUrl = useMemo(() => {
    if (riderCoords && runDetails?.dropoffCoordinates) {
      const [lng, lat] = runDetails.dropoffCoordinates;
      return `https://www.google.com/maps/dir/?api=1&origin=${riderCoords.latitude},${riderCoords.longitude}&destination=${lat},${lng}&travelmode=two-wheeler`;
    }
    if (runDetails?.dropoffCoordinates) {
      const [lng, lat] = runDetails.dropoffCoordinates;
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=two-wheeler`;
    }
    return runDetails?.dropoffDetails?.navigationUrl;
  }, [riderCoords, runDetails]);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
            <Bike className="w-8 h-8" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <p className="text-base font-bold text-white">Connecting to Fleet Dispatch...</p>
        <p className="text-xs text-slate-400 mt-1">Fetching live route telemetry & store coordinates</p>
      </div>
    );
  }

  // Error Screen
  if (errorMessage && !runDetails) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
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
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  // Early return: Run Already Claimed by Another Rider (Render ONLY this info box)
  if (isClaimedByAnotherRider) {
    const claimer =
      claimedByName && claimedByName !== 'Another Partner'
        ? claimedByName
        : runDetails?.claimedByRider?.name || 'Another Partner';

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-amber-500 selection:text-slate-950">
        <div className="w-full max-w-xl p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Run Already Claimed!</h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              This delivery assignment was claimed by <strong className="text-amber-400 font-bold">{claimer}</strong> moments ago.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="https://wa.me"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-bold text-white transition-all shadow-md active:scale-98"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Return to WhatsApp Group</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const pickupStoreName = runDetails?.pickupDetails?.storeName || 'Merchant Store';
  const pickupStoreAddress = runDetails?.pickupDetails?.pickupAddress || 'Local Store Pickup Point';
  const pickupStorePhone = runDetails?.pickupDetails?.storePhone || '';

  const dropoffCustomerName = runDetails?.dropoffDetails?.customerName || 'Customer';
  const dropoffAddress = runDetails?.dropoffDetails?.dropoffAddress || 'Customer Delivery Address';
  const dropoffPhone = runDetails?.dropoffDetails?.customerPhone || '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center selection:bg-emerald-500 selection:text-slate-950">
      {/* =========================================================================
          TOP RUNNER COCKPIT APP BAR
      ========================================================================= */}
      <header className="w-full bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Runner Cockpit
              </span>
              <span className="text-xs text-slate-400 font-mono">
                #{runDetails?.orderNumber?.slice(-6) || orderId.slice(-6)}
              </span>
            </div>
            <p className="text-sm font-extrabold text-white truncate max-w-[200px] sm:max-w-xs mt-0.5">
              Run: {runDetails?.orderNumber || orderId}
            </p>
          </div>
        </div>

        {/* Rider Selector & Profile */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              aria-label="Active Rider Partner"
              value={selectedRider?.id || ''}
              onChange={(e) => handleRiderChange(e.target.value)}
              className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-100 text-xs rounded-xl px-3 py-2 pr-8 font-bold focus:outline-hidden focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {pilotRoster.map((r) => (
                <option key={r.id} value={r.id}>
                  🛵 {r.name.split(' ')[0]} ({r.phone.slice(-4)})
                </option>
              ))}
            </select>
            <User className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN RUNNER VIEWPORT (EXPANSIVE DESKTOP + STREAMLINED MOBILE)
      ========================================================================= */}
      <main className="w-full max-w-4xl p-4 sm:p-6 space-y-5 pb-16 flex-1">
        {/* GPS Live Telemetry Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2.5">
            {gpsStatus === 'active' ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-slate-200 font-bold flex items-center gap-1.5">
                  <LocateFixed className="w-3.5 h-3.5 text-emerald-400" />
                  GPS Live Locked {riderCoords?.accuracy ? `(±${riderCoords.accuracy}m)` : ''}
                </span>
              </>
            ) : gpsStatus === 'denied' ? (
              <span className="text-rose-400 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                GPS Permission Denied — Using Route Coordinates
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Acquiring High-Accuracy GPS Signal...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Payout for this run:</span>
            <span className="font-black text-emerald-400 text-sm bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              ₹{runDetails?.estimatedPayout || 40}
            </span>
          </div>
        </div>

        {/* =========================================================================
            3-DISTANCE TELEMETRY DASHBOARD
        ========================================================================= */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-850 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                Route Distance Breakdown (3 Legs)
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Run Trip</span>
              <span className="text-sm sm:text-base font-black text-emerald-400">
                ~{formatMeters(totalTripDistanceMeters)}
              </span>
            </div>
          </div>

          {/* 3 Distances Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Leg 1: Rider -> Store */}
            <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 flex items-center justify-between sm:flex-col sm:items-start sm:justify-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Bike className="w-3 h-3 text-emerald-400" />
                  <span>Leg 1: You → Store</span>
                </span>
                <p className="text-xs text-slate-300 font-medium mt-0.5">Pickup Dispatch</p>
              </div>
              <div className="text-right sm:text-left sm:mt-2">
                <span className="text-base font-black text-white">
                  ~{distanceRiderToStoreMeters ? formatMeters(distanceRiderToStoreMeters) : '1.2 km'}
                </span>
              </div>
            </div>

            {/* Leg 2: Store -> Customer */}
            <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 flex items-center justify-between sm:flex-col sm:items-start sm:justify-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Store className="w-3 h-3 text-blue-400" />
                  <span>Leg 2: Store → Customer</span>
                </span>
                <p className="text-xs text-slate-300 font-medium mt-0.5">Transit to Doorstep</p>
              </div>
              <div className="text-right sm:text-left sm:mt-2">
                <span className="text-base font-black text-white">
                  ~{formatMeters(distanceStoreToDropoffMeters)}
                </span>
              </div>
            </div>

            {/* Leg 3: Cumulative Total */}
            <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/30 flex items-center justify-between sm:flex-col sm:items-start sm:justify-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-emerald-400" />
                  <span>Leg 3: Total Run</span>
                </span>
                <p className="text-xs text-emerald-200/80 font-medium mt-0.5">Full Turnaround</p>
              </div>
              <div className="text-right sm:text-left sm:mt-2">
                <span className="text-base font-black text-emerald-400">
                  ~{formatMeters(totalTripDistanceMeters)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PAYMENT MODE ALERT BANNER (CRITICAL FOR CASH COLLECTION)
        ========================================================================= */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border-2 shadow-xl transition-all ${
            isCod
              ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
              : 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200'
          }`}
        >
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl ${
                  isCod ? 'bg-amber-500 text-slate-950 font-black' : 'bg-emerald-500 text-slate-950'
                }`}
              >
                {isCod ? <Banknote className="w-6 h-6 stroke-[2.5]" /> : <ShieldCheck className="w-6 h-6 stroke-[2.5]" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isCod ? 'bg-amber-500/30 text-amber-300' : 'bg-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    {isCod ? 'Cash on Delivery (COD)' : 'Prepaid Online Order'}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white mt-1">
                  {isCod
                    ? `⚠️ COLLECT ₹${runDetails?.totalAmount?.toLocaleString('en-IN') || 0} IN CASH`
                    : '✅ PREPAID ORDER — DO NOT COLLECT CASH'}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {isCod
                    ? 'Take cash from the customer before asking for the 4-digit Delivery OTP.'
                    : 'Customer has paid online via gateway. Collect ₹0 from customer.'}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Order Value</span>
              <span className="text-lg sm:text-xl font-black text-white">
                ₹{runDetails?.totalAmount?.toLocaleString('en-IN') || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Error message banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        

        {/* =========================================================================
            STATE: DELIVERED (SUCCESS SCREEN)
        ========================================================================= */}
        {isDelivered && (
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-5 animate-in fade-in duration-200">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Delivery Completed & Verified!</h2>
              <p className="text-xs text-emerald-200/90 mt-1">
                4-digit customer OTP was verified. Order marked delivered.
              </p>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 max-w-md mx-auto space-y-2.5 text-left">
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Back to WhatsApp Fleet Portal</span>
            </a>
          </div>
        )}

        {/* =========================================================================
            STATE: UNCLAIMED RUN (TEASER CARD WITH FULL DETAILS & 1-TAP ACCEPT)
        ========================================================================= */}
        {!runDetails?.isClaimed && !isAlreadyClaimedByOther && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Two Column Route Overview (Store Pickup & Dropoff Address) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Store Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5" />
                    <span>Pickup Location</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    ~{distanceRiderToStoreMeters ? formatMeters(distanceRiderToStoreMeters) : '1.2 km'}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white">{pickupStoreName}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{pickupStoreAddress}</p>
                {pickupStorePhone && (
                  <p className="text-xs font-mono text-blue-400 flex items-center gap-1.5 pt-1">
                    <Phone className="w-3 h-3" />
                    <span>{pickupStorePhone}</span>
                  </p>
                )}
              </div>

              {/* Delivery Dropoff Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Dropoff Location</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    ~{formatMeters(distanceStoreToDropoffMeters)}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white">{dropoffCustomerName}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{dropoffAddress}</p>
                {dropoffPhone && (
                  <p className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 pt-1">
                    <Phone className="w-3 h-3" />
                    <span>{dropoffPhone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Accept Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isSubmitting || !selectedRider}
                onClick={handleClaimRun}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Locking Run for {selectedRider?.name}...</span>
                  </>
                ) : (
                  <>
                    <span>ACCEPT & CLAIM RUN (EARN ₹{runDetails?.estimatedPayout || 40})</span>
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Claiming as <strong className="text-slate-200">{selectedRider?.name}</strong>. First rider to tap locks the assignment.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE: ACTIVE RUN CLAIMED BY CURRENT RIDER
        ========================================================================= */}
        {runDetails && isClaimedByCaller && !isDelivered && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Step Progress Tracker */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs font-bold shadow-md">
              <div
                className={`flex items-center gap-2 ${
                  !isPickedUp ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    !isPickedUp
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {isPickedUp ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span>Step 1: Store Pickup</span>
              </div>

              <div className="flex-1 mx-4 h-0.5 bg-slate-800 relative">
                {isPickedUp && <div className="absolute inset-0 bg-emerald-500" />}
              </div>

              <div
                className={`flex items-center gap-2 ${
                  isPickedUp ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    isPickedUp
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  2
                </div>
                <span>Step 2: Customer Doorstep OTP</span>
              </div>
            </div>

            {/* STEP 1: STORE PICKUP CARD */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                !isPickedUp
                  ? 'bg-slate-900 border-blue-500/50 shadow-2xl ring-1 ring-blue-500/20'
                  : 'bg-slate-900/50 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5" />
                    <span>Pickup Location</span>
                  </span>
                  <h4 className="text-lg font-black text-white mt-1">{pickupStoreName}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{pickupStoreAddress}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 block">Pickup Code</span>
                  <div className="text-base font-black text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {runDetails.pickupDetails?.pickupCode || runDetails.orderNumber.slice(-4)}
                  </div>
                </div>
              </div>

              {/* Action Buttons for Pickup */}
              {!isPickedUp && (
                <div className="mt-5 space-y-3 pt-3 border-t border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {livePickupNavUrl && (
                      <a
                        href={livePickupNavUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>
                          Navigate to Store (Google Maps){' '}
                          {activeDistanceMeters ? `· ${formatMeters(activeDistanceMeters)}` : ''}
                        </span>
                      </a>
                    )}

                    {pickupStorePhone ? (
                      <a
                        href={`tel:${pickupStorePhone}`}
                        className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
                      >
                        <Phone className="w-4 h-4 text-blue-400" />
                        <span>Call Store ({pickupStorePhone})</span>
                      </a>
                    ) : null}
                  </div>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `✅ *ORDER CLAIMED!* I am picking up #${runDetails.orderNumber} from ${pickupStoreName}. — ${selectedRider?.name || 'Rider'} 🛵💨`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Notify WhatsApp Fleet Group ("Claimed")</span>
                  </a>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleMarkPickedUp}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-98 cursor-pointer"
                  >
                    <PackageCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>I HAVE PICKED UP THE PACKAGE</span>
                  </button>
                </div>
              )}
            </div>

            {/* STEP 2: CUSTOMER DROPOFF & DOORSTEP OTP */}
            {isPickedUp && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl space-y-5 animate-in fade-in duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Step 2: Customer Doorstep Delivery</span>
                    </span>
                    <h4 className="text-lg font-black text-white mt-1">{dropoffCustomerName}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{dropoffAddress}</p>
                  </div>
                </div>

                {/* Turn-by-Turn Navigation & Call */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {liveDropoffNavUrl && (
                    <a
                      href={liveDropoffNavUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>
                        Navigate to Customer (Google Maps){' '}
                        {activeDistanceMeters ? `· ${formatMeters(activeDistanceMeters)}` : ''}
                      </span>
                    </a>
                  )}

                  {dropoffPhone ? (
                    <a
                      href={`tel:${dropoffPhone}`}
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>Call Customer ({dropoffPhone})</span>
                    </a>
                  ) : null}
                </div>

                {/* Step 2A: COD Cash Collection Confirmation Gate */}
                {isCod && (
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                      isCashCollected
                        ? 'bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                        : 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-950/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            isCashCollected
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                              : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                          }`}
                        >
                          {isCashCollected ? (
                            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                          ) : (
                            <Banknote className="w-6 h-6 stroke-[2.5]" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                isCashCollected
                                  ? 'bg-emerald-500/30 text-emerald-300'
                                  : 'bg-amber-500/30 text-amber-300'
                              }`}
                            >
                              Step 2A: Cash Collection
                            </span>
                            {isCashCollected && (
                              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[3]" />
                                Confirmed
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-black text-white mt-0.5">
                            {isCashCollected
                              ? `✅ ₹${runDetails?.totalAmount?.toLocaleString('en-IN') || 0} Cash Collected`
                              : `Collect ₹${runDetails?.totalAmount?.toLocaleString('en-IN') || 0} Cash First`}
                          </h4>
                          <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                            {isCashCollected
                              ? 'Cash verified in hand. Ask customer for delivery OTP.'
                              : 'Take cash from customer before handing over the parcel & asking for OTP.'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsCashCollected((prev) => !prev);
                          setOtpError(null);
                        }}
                        className={`w-full sm:w-auto px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-md ${
                          isCashCollected
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 animate-pulse'
                        }`}
                      >
                        {isCashCollected ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>CASH RECEIVED (CONFIRMED)</span>
                          </>
                        ) : (
                          <>
                            <Banknote className="w-4 h-4 stroke-[2.5]" />
                            <span>I HAVE RECEIVED THE CASH</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Customer Delivery OTP Verification Box */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="text-center">
                    <span className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Enter 4-Digit Customer Delivery OTP</span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Ask the customer for the delivery OTP shown on their order tracking screen
                    </p>
                  </div>

                  {/* 4 Digit OTP Inputs */}
                  <div className="flex justify-center gap-3 py-2">
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
                        className="w-14 h-16 text-center text-2xl font-mono font-black rounded-2xl bg-slate-950 border-2 border-slate-700 focus:border-emerald-500 focus:outline-hidden text-white transition-all shadow-inner"
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
                    disabled={isSubmitting || otpDigits.join('').length !== 4 || (isCod && !isCashCollected)}
                    onClick={handleVerifyOtp}
                    className="w-full py-4 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        <span>Verifying Delivery OTP...</span>
                      </>
                    ) : isCod && !isCashCollected ? (
                      <>
                        <Lock className="w-4 h-4 stroke-[2.5]" />
                        <span>CONFIRM CASH RECEIVED TO COMPLETE DELIVERY</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 stroke-[2.5]" />
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
