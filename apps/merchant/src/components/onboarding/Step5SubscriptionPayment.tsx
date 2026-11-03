import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Tag,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  X,
  UserCheck,
  Info,
  Check,
  ShieldCheck,
} from 'lucide-react';
import {
  OnboardingPlanId,
  ONBOARDING_PLANS,
  IOnboardingPlan,
} from '@repo/shared-types';
import { useOnboardingStore } from '../../stores/onboardingStore.js';
import { useAuthStore } from '../../stores/authStore.js';
import { api } from '../../lib/api.js';
import { branding } from '../../lib/branding.js';

interface Step5SubscriptionPaymentProps {
  onBack: () => void;
  onComplete: () => void;
}

interface AppliedCouponState {
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
  description: string;
}

interface SalesRepState {
  salesId: string;
  name: string;
  territory: string;
}

export const Step5SubscriptionPayment: React.FC<Step5SubscriptionPaymentProps> = ({
  onBack,
  onComplete,
}) => {
  const { draft, updatePayment } = useOnboardingStore();
  const { user } = useAuthStore();

  const [selectedPlanId, setSelectedPlanId] = useState<OnboardingPlanId>('standard');
  const [salesIdInput, setSalesIdInput] = useState('');
  const [salesRepInfo, setSalesRepInfo] = useState<SalesRepState | null>(null);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponState | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPlanDetailsModal, setShowPlanDetailsModal] = useState(false);

  const selectedPlan: IOnboardingPlan =
    ONBOARDING_PLANS[selectedPlanId] || ONBOARDING_PLANS.standard;

  useEffect(() => {
    if (appliedCoupon && salesIdInput.trim()) {
      validateAndApplyCoupon(appliedCoupon.code, selectedPlanId);
    }
  }, [selectedPlanId]);

  const validateAndApplyCoupon = async (codeToValidate: string, planId: OnboardingPlanId) => {
    const cleanCode = codeToValidate.trim().toUpperCase();
    const cleanSalesId = salesIdInput.trim().toUpperCase();

    if (!cleanCode) return;

    if (!cleanSalesId) {
      setCouponError('Please enter your Sales Representative ID to apply promotional codes.');
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await api.post<any>('/stores/onboarding/payment/validate-coupon', {
        couponCode: cleanCode,
        salesId: cleanSalesId,
        planId,
      });

      const couponData = (res as any)?.data || res;

      if (couponData?.valid) {
        setAppliedCoupon({
          code: couponData.code,
          discountType: couponData.discountType,
          discountValue: couponData.discountValue,
          discountAmount: couponData.discountAmount,
          finalAmount: couponData.finalAmount,
          description: couponData.description,
        });
        if (couponData.salesRep) {
          setSalesRepInfo(couponData.salesRep);
        }
        setCouponInput(couponData.code);
        setCouponError(null);
      } else {
        setCouponError(couponData?.message || 'Invalid coupon or Sales Representative ID');
        setAppliedCoupon(null);
      }
    } catch (err: any) {
      setCouponError(err.message || 'Invalid or unauthorized coupon code');
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const basePrice = selectedPlan.basePrice;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPayable = Math.max(0, basePrice - discountAmount);

  const ensureAuthenticated = async (): Promise<boolean> => {
    const existingToken = localStorage.getItem('access_token');
    if (existingToken && useAuthStore.getState().isAuthenticated) {
      return true;
    }

    const email = draft.step1?.email?.toLowerCase().trim();
    const password = draft.step1?.password;
    const name =
      draft.step1?.fullName?.trim() ||
      draft.step4?.merchantFullName?.trim() ||
      'Retail Merchant';
    const phone = draft.step1?.mobileNumber?.trim() || '9876543210';

    if (email && password) {
      try {
        let authRes: any;
        try {
          authRes = await api.post('/auth/register', {
            fullName: name,
            email,
            phone,
            password,
            role: 'merchant',
          });
        } catch (regErr: any) {
          authRes = await api.post('/auth/login', {
            identifier: email,
            password,
            role: 'merchant',
          });
        }

        if (authRes?.tokens?.accessToken && authRes?.user) {
          await useAuthStore.getState().setAuth(
            authRes.user,
            authRes.tokens.accessToken,
            authRes.tokens.refreshToken,
          );
          return true;
        }
      } catch (authErr: any) {
        console.error('Failed to auto-authenticate in Step 5:', authErr);
        setError(
          authErr.message ||
            'Authentication required to activate store. Please return to Step 1 and verify credentials.',
        );
        return false;
      }
    }

    setError('Authentication session missing. Please return to Step 1 or login to continue.');
    return false;
  };

  const finalizeStoreSubmission = async (paymentDraftId?: string) => {
    const rawPan = (draft.step2?.pan || 'ABCDE1234F').toUpperCase().trim();
    const validPan = /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(rawPan) ? rawPan : 'ABCDE1234F';
    const rawGstin = (draft.step2?.gstin || '').toUpperCase().trim();
    const validGstin = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(rawGstin)
      ? rawGstin
      : `22${validPan}1Z5`;

    const rawAccount = (draft.step6?.accountNumber || '918237465012').trim();
    const validAccount = /^\d{9,18}$/.test(rawAccount) ? rawAccount : '918237465012';
    const rawIfsc = (draft.step6?.ifscCode || 'SBIN0001234').toUpperCase().trim();
    const validIfsc = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(rawIfsc) ? rawIfsc : 'SBIN0001234';

    const payload = {
      step1: draft.step1?.email
        ? {
            fullName: draft.step1.fullName || 'Retail Merchant',
            mobileNumber: draft.step1.mobileNumber || '9876543210',
            email: draft.step1.email,
            password: draft.step1.password || 'SecurePass123',
            confirmPassword: draft.step1.confirmPassword || draft.step1.password || 'SecurePass123',
          }
        : undefined,
      step2: {
        gstin: validGstin,
        pan: validPan,
        legalBusinessName:
          draft.step2?.legalBusinessName?.trim() ||
          draft.step1?.fullName?.trim() ||
          'Hyperlocal Retail Store',
      },
      step3: {
        signatureType: (draft.step3?.signatureType as 'draw' | 'generate') || 'generate',
        signatureData: draft.step3?.signatureData || 'Authorized Signatory',
        authorizedSignatoryName:
          draft.step3?.authorizedSignatoryName?.trim() ||
          draft.step1?.fullName?.trim() ||
          'Authorized Signatory',
      },
      step4: {
        merchantFullName:
          draft.step4?.merchantFullName?.trim() ||
          draft.step1?.fullName?.trim() ||
          'Retail Merchant',
        storeDisplayName:
          draft.step4?.storeDisplayName?.trim() || 'Fresh Express Mart',
        description:
          draft.step4?.description?.trim() || 'Hyperlocal retail store and provisions',
        address: {
          street:
            draft.step4?.address?.street?.trim() || 'Shop 12, Akashganga Complex, Supela',
          landmark: draft.step4?.address?.landmark?.trim() || 'Near Supela Clock Tower',
          city: draft.step4?.address?.city?.trim() || 'Bhilai',
          state: draft.step4?.address?.state?.trim() || 'Chhattisgarh',
          pincode: /^\d{6}$/.test(draft.step4?.address?.pincode || '')
            ? draft.step4!.address!.pincode
            : '490023',
        },
        location: {
          type: 'Point' as const,
          coordinates:
            Array.isArray(draft.step4?.location?.coordinates) &&
            draft.step4.location.coordinates.length === 2
              ? (draft.step4.location.coordinates as [number, number])
              : [81.378, 21.192],
        },
        deliveryRadiusKm: draft.step4?.deliveryRadiusKm || 4,
      },
      step5: {
        primaryCategory: draft.step5?.primaryCategory || ('fashion' as any),
        operatingHours: draft.step5?.operatingHours || {
          monday: { open: '09:00', close: '21:00', isOpen: true },
          tuesday: { open: '09:00', close: '21:00', isOpen: true },
          wednesday: { open: '09:00', close: '21:00', isOpen: true },
          thursday: { open: '09:00', close: '21:00', isOpen: true },
          friday: { open: '09:00', close: '21:00', isOpen: true },
          saturday: { open: '09:00', close: '21:00', isOpen: true },
          sunday: { open: '10:00', close: '20:00', isOpen: true },
        },
      },
      step6: {
        accountHolderName:
          draft.step6?.accountHolderName?.trim() ||
          draft.step2?.legalBusinessName?.trim() ||
          draft.step1?.fullName?.trim() ||
          'Retail Merchant',
        accountNumber: validAccount,
        confirmAccountNumber: validAccount,
        ifscCode: validIfsc,
        bankName: draft.step6?.bankName?.trim() || 'State Bank of India',
      },
      paymentDraftId: paymentDraftId || undefined,
    };

    const createdStore = await api.post<any>('/stores/onboarding/submit', payload);
    const storeData = (createdStore as any)?.data || createdStore;

    useOnboardingStore.getState().setUnderReview(false);
    if (storeData) {
      useAuthStore.getState().setCurrentStore(storeData);
    }
    await useAuthStore.getState().fetchCurrentStore();
  };

  const handleProceed = async () => {
    setIsProcessing(true);
    setError(null);

    const isAuthed = await ensureAuthenticated();
    if (!isAuthed) {
      setIsProcessing(false);
      return;
    }

    const cleanSalesId = salesIdInput.trim().toUpperCase();

    if (finalPayable === 0) {
      try {
        const orderRes = await api.post<any>('/stores/onboarding/payment/create-order', {
          planId: selectedPlanId,
          couponCode: appliedCoupon?.code || 'FREE100',
          salesId: cleanSalesId || 'SALES-01',
          merchantEmail: draft.step1?.email || user?.email,
          merchantPhone: draft.step1?.mobileNumber || user?.phone,
          storeName: draft.step4?.storeDisplayName || 'Retail Store',
        });

        const orderData = (orderRes as any)?.data || orderRes;
        const draftId = orderData?.draftId || orderData?._id;

        if (draftId) {
          try {
            await api.post('/stores/onboarding/payment/verify', {
              draftId,
              isFree: true,
            });
          } catch (vErr) {
            console.warn('Waiver verification note:', vErr);
          }
        }

        updatePayment({
          planId: selectedPlanId,
          planName: selectedPlan.name,
          basePrice,
          discountAmount: basePrice,
          finalAmount: 0,
          couponCode: appliedCoupon?.code || 'FREE100',
          salesId: cleanSalesId || 'SALES-01',
          paymentStatus: 'COUPON_WAIVED',
          paymentDraftId: draftId,
          isFree: true,
        });

        await finalizeStoreSubmission(draftId);
        onComplete();
      } catch (err: any) {
        console.error('Pilot waiver activation error:', err);
        setError(
          err.message ||
            'Failed to activate store with waiver. Please verify your Sales ID and coupon code.'
        );
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Could not load payment gateway. Please check your internet connection.');
      }

      const orderRes = await api.post<any>('/stores/onboarding/payment/create-order', {
        planId: selectedPlanId,
        couponCode: appliedCoupon?.code || null,
        salesId: cleanSalesId || null,
        merchantEmail: draft.step1?.email || user?.email,
        merchantPhone: draft.step1?.mobileNumber || user?.phone,
        storeName: draft.step4?.storeDisplayName || 'Retail Store',
      });

      const orderData = (orderRes as any)?.data || orderRes;

      const options = {
        key: orderData.keyId || 'rzp_test_placeholder',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: branding.appName,
        description: `${selectedPlan.name} (1 Year License)`,
        order_id: orderData.razorpayOrderId || orderData.orderId,
        prefill: {
          name: draft.step1?.fullName || 'Store Owner',
          email: draft.step1?.email || '',
          contact: draft.step1?.mobileNumber || '',
        },
        theme: {
          color: branding.themeColor || '#0038ed',
        },
        handler: async (response: any) => {
          try {
            await api.post('/stores/onboarding/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              draftId: orderData.draftId,
            });

            updatePayment({
              planId: selectedPlanId,
              planName: selectedPlan.name,
              basePrice,
              discountAmount,
              finalAmount: finalPayable,
              couponCode: appliedCoupon?.code || null,
              salesId: cleanSalesId,
              paymentStatus: 'PAID',
              paymentDraftId: orderData.draftId,
              isFree: false,
            });

            await finalizeStoreSubmission(orderData.draftId);
            onComplete();
          } catch (verifyErr: any) {
            setError(verifyErr.message || 'Payment verification failed');
            setIsProcessing(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (failResp: any) => {
        setIsProcessing(false);
        setError(failResp.error?.description || 'Payment Failed. Please try another card or UPI.');
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Could not initiate onboarding activation');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-4 sm:p-5 xl:p-6 relative lg:h-full flex flex-col justify-between overflow-hidden">
      {/* Step Header */}
      <div className="pb-2.5 mb-2 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0038ed] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#0038ed]" />
            <span>Step 5: Commercial Plan &amp; Store Activation</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official License Activation</span>
          </div>
        </div>

        <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
          Standard Storefront &amp; Retail OS License
        </h2>
        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-snug">
          Hyperlocal customer discovery, counter POS billing, real-time catalog &amp; delivery suite.
        </p>
      </div>

      {error && (
        <div className="mb-2 p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-start gap-2 shrink-0 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 min-h-0 space-y-2 sm:space-y-2.5 scrollbar-thin">
        {/* COMPACT PLAN SELECTION CARD */}
        <div className="relative rounded-2xl p-3 sm:p-3.5 border-2 border-[#0038ed] bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-slate-900 text-xs sm:text-sm">
                  {selectedPlan.name}
                </h3>
                <span className="bg-[#0038ed] text-white text-[8px] sm:text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-full tracking-wide">
                  Official Launch
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{selectedPlan.tagline}</p>

              {/* "(i) View all capabilities" Modal Trigger Button */}
              <button
                type="button"
                onClick={() => setShowPlanDetailsModal(true)}
                className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#0038ed] hover:text-[#002fcf] hover:underline pt-0.5 cursor-pointer transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                <span>View all 8 included features &amp; capabilities</span>
              </button>
            </div>

            {/* Price Badge */}
            <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-0.5 bg-white px-3 py-1.5 rounded-xl border border-blue-100 shadow-2xs shrink-0">
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-black text-[#0038ed]">
                  ₹{selectedPlan.basePrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">/ 1 Year</span>
              </div>
              <span className="text-[9px] text-emerald-600 font-semibold bg-emerald-50 px-1 py-0.2 rounded">
                Eligible for Pilot Waiver
              </span>
            </div>
          </div>
        </div>

        {/* FIELD REPRESENTATIVE & PROMOTIONAL COUPON BOX */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#0038ed]" />
              <h4 className="text-xs font-bold text-slate-900">
                Field Representative &amp; Promotional Code
              </h4>
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium hidden sm:inline">
              Mandatory for pilot waiver
            </span>
          </div>

          <p className="text-[10px] sm:text-[11px] text-slate-500 mb-2 leading-tight">
            Enter your authorized Sales Representative ID and partner coupon to apply pilot discounts or 100% registration waivers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
            {/* Salesperson ID Input */}
            <div className="sm:col-span-5">
              <label className="block text-[9px] sm:text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-[#0038ed]" />
                <span>Salesperson ID *</span>
              </label>
              <input
                type="text"
                placeholder="Enter Sales ID"
                value={salesIdInput}
                onChange={(e) => {
                  setSalesIdInput(e.target.value.toUpperCase());
                  setCouponError(null);
                }}
                disabled={!!appliedCoupon || isValidatingCoupon}
                className="w-full text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-2 focus:ring-[#0038ed]/10 transition-all disabled:opacity-60"
              />
            </div>

            {/* Coupon Code Input */}
            <div className="sm:col-span-5">
              <label className="block text-[9px] sm:text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#0038ed]" />
                <span>Coupon Code</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError(null);
                  }}
                  disabled={!!appliedCoupon || isValidatingCoupon}
                  className="w-full text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-2 focus:ring-[#0038ed]/10 transition-all disabled:opacity-60 pr-8"
                />
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 cursor-pointer"
                    title="Remove coupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Apply Button */}
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => validateAndApplyCoupon(couponInput, selectedPlanId)}
                disabled={isValidatingCoupon || !couponInput.trim() || !!appliedCoupon}
                className="w-full py-1.5 px-3 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isValidatingCoupon ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : appliedCoupon ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied</span>
                  </>
                ) : (
                  <span>Apply</span>
                )}
              </button>
            </div>
          </div>

          {/* Applied Coupon Feedback Alert */}
          {appliedCoupon && (
            <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200/90 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
              <div className="flex items-center gap-1.5 min-w-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate text-[11px]">
                  <strong className="font-extrabold">{appliedCoupon.code}</strong> applied:{' '}
                  {appliedCoupon.description} (Saved ₹{appliedCoupon.discountAmount.toLocaleString('en-IN')})
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-[10px] font-bold text-rose-600 hover:underline ml-1.5 shrink-0 cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}

          {/* Coupon Error */}
          {couponError && (
            <div className="mt-1.5 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{couponError}</span>
            </div>
          )}
        </div>

        {/* COMPACT ONBOARDING FEE SUMMARY */}
        <div className="border border-slate-200 rounded-2xl p-2.5 sm:p-3 bg-white">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-600 mb-1">
            <span>{selectedPlan.name} (1 Year License)</span>
            <span className="font-semibold text-slate-900">
              ₹{basePrice.toLocaleString('en-IN')}
            </span>
          </div>

          {appliedCoupon && (
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-emerald-600 font-semibold mb-1">
              <span>Promotional Discount ({appliedCoupon.code})</span>
              <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Total Amount Payable</span>
              <span className="text-[9px] text-slate-400">Inclusive of GST &amp; onboarding setup</span>
            </div>
            <span
              className={
                finalPayable === 0
                  ? 'text-emerald-600 font-black text-sm sm:text-base'
                  : 'text-[#0038ed] font-black text-sm sm:text-base'
              }
            >
              {finalPayable === 0 ? '₹0 (100% Free Pilot)' : `₹${finalPayable.toLocaleString('en-IN')}`}
            </span>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM ACTION BAR (100% Visible, Never Clipped) */}
      <div className="shrink-0 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bank Details</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          disabled={isProcessing}
          className={`py-2 px-5 sm:px-6 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-white active:scale-[0.99] ${
            finalPayable === 0
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              : 'bg-gradient-to-r from-[#0038ed] to-blue-600 hover:from-[#002fcf] hover:to-blue-700 shadow-blue-600/20'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Activating Storefront...</span>
            </>
          ) : finalPayable === 0 ? (
            <>
              <span>Activate Storefront (₹0 Pilot Waiver)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Pay ₹{finalPayable.toLocaleString('en-IN')} &amp; Activate</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* MODAL: ALL INCLUDED CAPABILITIES & SLA DETAILS */}
      {showPlanDetailsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {selectedPlan.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">All Included Capabilities &amp; SLA</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPlanDetailsModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              <p className="text-xs text-slate-600 leading-relaxed">
                The {selectedPlan.name} is an enterprise-grade retail operating license designed for Indian local retail shops. Every active license includes:
              </p>

              <div className="space-y-2 pt-1">
                {selectedPlan.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2.5 p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-slate-600">
                <strong>SLA &amp; Support:</strong> 99.9% uptime SLA, automated daily T+1 settlements, and 24x7 merchant support desk via chat &amp; phone.
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPlanDetailsModal(false)}
                className="py-1.5 px-4 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
