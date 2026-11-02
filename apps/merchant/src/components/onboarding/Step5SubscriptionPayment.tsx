import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Tag,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Gift,
  HelpCircle,
  Loader2,
  AlertCircle,
  X,
  CreditCard,
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

const PRESET_COUPON_CHIPS = [
  { code: 'FREE100', label: 'FREE100 (100% Free Pilot)' },
  { code: 'WELCOME50', label: 'WELCOME50 (50% Off)' },
  { code: 'LAUNCH100', label: 'LAUNCH100 (Pilot Waiver)' },
];

export const Step5SubscriptionPayment: React.FC<Step5SubscriptionPaymentProps> = ({
  onBack,
  onComplete,
}) => {
  const { draft, updatePayment } = useOnboardingStore();
  const { user } = useAuthStore();

  const [selectedPlanId, setSelectedPlanId] = useState<OnboardingPlanId>('starter');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponState | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPlan: IOnboardingPlan = ONBOARDING_PLANS[selectedPlanId];

  // Re-calculate or re-validate coupon if user changes plans
  useEffect(() => {
    if (appliedCoupon) {
      validateAndApplyCoupon(appliedCoupon.code, selectedPlanId);
    }
  }, [selectedPlanId]);

  const validateAndApplyCoupon = async (codeToValidate: string, planId: OnboardingPlanId) => {
    const cleanCode = codeToValidate.trim().toUpperCase();
    if (!cleanCode) return;

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await api.post<any>('/stores/onboarding/payment/validate-coupon', {
        couponCode: cleanCode,
        planId,
      });

      if (res.data?.valid) {
        setAppliedCoupon({
          code: res.data.code,
          discountType: res.data.discountType,
          discountValue: res.data.discountValue,
          discountAmount: res.data.discountAmount,
          finalAmount: res.data.finalAmount,
          description: res.data.description,
        });
        setCouponInput(res.data.code);
        setCouponError(null);
      } else {
        setCouponError(res.data?.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (err: any) {
      setCouponError(err.response?.data?.error?.message || err.message || 'Invalid or expired coupon code');
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

  // Dynamically load Razorpay checkout script
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

  // Submit complete onboarding payload to backend
  const finalizeStoreSubmission = async (paymentDraftId?: string) => {
    const payload = {
      step1: draft.step1,
      step2: {
        gstin: draft.step2?.gstin || '22ABCDE1234F1Z5',
        pan: draft.step2?.pan || 'ABCDE1234F',
        legalBusinessName: draft.step2?.legalBusinessName || draft.step1?.fullName || 'Hyperlocal Retail Store',
      },
      step3: {
        signatureType: draft.step3?.signatureType || 'generate',
        signatureData: draft.step3?.signatureData || 'Authorized Signatory',
        authorizedSignatoryName: draft.step3?.authorizedSignatoryName || draft.step1?.fullName || 'Authorized Signatory',
      },
      step4: {
        merchantFullName: draft.step4?.merchantFullName || draft.step1?.fullName || 'Retail Merchant',
        storeDisplayName: draft.step4?.storeDisplayName || 'Fresh Express Mart',
        description: draft.step4?.description || 'Hyperlocal retail store and provisions',
        address: {
          street: draft.step4?.address?.street || 'Shop 12, Akashganga Complex, Supela',
          landmark: draft.step4?.address?.landmark || 'Near Supela Clock Tower',
          city: draft.step4?.address?.city || 'Bhilai',
          state: draft.step4?.address?.state || 'Chhattisgarh',
          pincode: draft.step4?.address?.pincode || '490023',
        },
        location: draft.step4?.location || {
          type: 'Point',
          coordinates: [81.378, 21.192],
        },
        deliveryRadiusKm: draft.step4?.deliveryRadiusKm || 4,
      },
      step5: draft.step5 || {
        primaryCategory: 'fashion',
        operatingHours: {
          monday: { open: '09:00', close: '21:00', isOpen: true },
          tuesday: { open: '09:00', close: '21:00', isOpen: true },
          wednesday: { open: '09:00', close: '21:00', isOpen: true },
          thursday: { open: '09:00', close: '21:00', isOpen: true },
          friday: { open: '09:00', close: '21:00', isOpen: true },
          saturday: { open: '09:00', close: '21:00', isOpen: true },
          sunday: { open: '10:00', close: '20:00', isOpen: true },
        },
      },
      step6: draft.step6 || {
        accountNumber: '918237461928',
        ifscCode: 'SBIN0001234',
        accountHolderName: draft.step1?.fullName || 'Merchant Account Holder',
        bankName: 'State Bank of India',
      },
      paymentDraftId,
    };

    await api.post<any>('/stores/onboarding/submit', payload);
    useOnboardingStore.getState().setUnderReview(false);
    await useAuthStore.getState().fetchCurrentStore();
  };

  const handleProceed = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Ensure user is authenticated
      if (!user && draft.step1?.email && draft.step1?.password) {
        try {
          const authRes = await api.post<any>('/auth/login', {
            identifier: draft.step1.email.toLowerCase().trim(),
            password: draft.step1.password,
          });
          if (authRes.tokens?.accessToken && authRes.user) {
            await useAuthStore.getState().setAuth(authRes.user, authRes.tokens.accessToken, authRes.tokens.refreshToken);
          }
        } catch (authErr) {
          console.warn('Auto-auth attempt prior to payment:', authErr);
        }
      }

      // 2. Create Onboarding Payment Order
      const orderRes = await api.post<any>('/stores/onboarding/payment/create-order', {
        planId: selectedPlanId,
        couponCode: appliedCoupon?.code || null,
        merchantEmail: draft.step1?.email,
        merchantPhone: draft.step1?.mobileNumber,
        storeName: draft.step4?.storeDisplayName,
      });

      const orderData = orderRes.data;

      // 3A. Free Promo Code Bypass (e.g. FREE100, LAUNCH100)
      if (orderData.isFree || finalPayable === 0) {
        // Verify ₹0 bypass draft
        await api.post('/stores/onboarding/payment/verify', {
          draftId: orderData.draftId,
          isFree: true,
        });

        updatePayment({
          planId: selectedPlanId,
          planName: selectedPlan.name,
          basePrice,
          discountAmount,
          finalAmount: 0,
          couponCode: appliedCoupon?.code || null,
          paymentStatus: 'COUPON_WAIVED',
          paymentDraftId: orderData.draftId,
          isFree: true,
        });

        // Submit complete onboarding
        await finalizeStoreSubmission(orderData.draftId);
        onComplete();
        return;
      }

      // 3B. Paid Razorpay Flow
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay payment gateway failed to load. Please check your internet connection.');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: branding.appName,
        description: `${selectedPlan.name} (1 Year)`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: draft.step1?.fullName || '',
          email: draft.step1?.email || '',
          contact: draft.step1?.mobileNumber || '',
        },
        theme: {
          color: '#0038ed',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setError('Payment cancelled. You can change your plan or try again.');
          },
        },
        handler: async (response: any) => {
          try {
            // Verify HMAC signature
            await api.post('/stores/onboarding/payment/verify', {
              draftId: orderData.draftId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              isFree: false,
            });

            updatePayment({
              planId: selectedPlanId,
              planName: selectedPlan.name,
              basePrice,
              discountAmount,
              finalAmount: finalPayable,
              couponCode: appliedCoupon?.code || null,
              paymentStatus: 'PAID',
              paymentDraftId: orderData.draftId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              isFree: false,
            });

            // Submit complete onboarding
            await finalizeStoreSubmission(orderData.draftId);
            onComplete();
          } catch (verifyErr: any) {
            setError(verifyErr.response?.data?.error?.message || verifyErr.message || 'Payment verification failed');
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
      setError(err.response?.data?.error?.message || err.message || 'Could not initiate onboarding activation');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-10 transition-all">
      {/* Step Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#0038ed] text-[11px] font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#0038ed]" />
          <span>Step 5: Commercial Plan &amp; Store Activation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Select Your Commercial Plan
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Choose a commercial plan for your digital storefront. Use a promotional code to waive fees for pilot retailer rollouts.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Plan Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {(Object.keys(ONBOARDING_PLANS) as OnboardingPlanId[]).map((planKey) => {
          const plan = ONBOARDING_PLANS[planKey];
          const isSelected = selectedPlanId === plan.id;

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#0038ed] bg-blue-50/20 shadow-md shadow-blue-500/5'
                  : 'border-slate-200/80 hover:border-slate-300 bg-white'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 right-4 bg-[#0038ed] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-slate-900 text-base">{plan.name}</h3>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'border-[#0038ed] bg-[#0038ed]' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-4">{plan.tagline}</p>

                <div className="mb-5 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    ₹{plan.basePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">/ year</span>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 text-xs text-slate-700">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Billing Cycle: Annual</span>
                <span className={isSelected ? 'text-[#0038ed] font-bold' : ''}>
                  {isSelected ? 'Selected' : 'Select Plan'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Promotional Coupon Box */}
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4 text-[#0038ed]" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">Have a Promotional Code?</h4>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Enter a launch promo or field waiver code to discount or completely waive your annual onboarding fee.
        </p>

        {/* Coupon Input Row */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. FREE100, WELCOME50"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value.toUpperCase());
                setCouponError(null);
              }}
              disabled={!!appliedCoupon || isValidatingCoupon}
              className="w-full text-xs sm:text-sm uppercase font-bold tracking-wider px-4 py-2.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-2 focus:ring-[#0038ed]/10 transition-all disabled:opacity-60"
            />
            {appliedCoupon && (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Remove coupon"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {appliedCoupon ? (
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50/60 hover:bg-rose-50 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={() => validateAndApplyCoupon(couponInput, selectedPlanId)}
              disabled={!couponInput.trim() || isValidatingCoupon}
              className="px-6 py-2.5 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isValidatingCoupon ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validating...</span>
                </>
              ) : (
                <span>Apply Code</span>
              )}
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        {!appliedCoupon && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-medium">Try:</span>
            {PRESET_COUPON_CHIPS.map((chip) => (
              <button
                key={chip.code}
                type="button"
                onClick={() => {
                  setCouponInput(chip.code);
                  validateAndApplyCoupon(chip.code, selectedPlanId);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0038ed] bg-blue-50/80 hover:bg-blue-100/70 border border-blue-200/70 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              >
                <Gift className="w-3 h-3" />
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Applied Coupon Feedback Alert */}
        {appliedCoupon && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200/90 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong className="font-extrabold">{appliedCoupon.code}</strong> applied:{' '}
                {appliedCoupon.description} (Saved ₹{appliedCoupon.discountAmount.toLocaleString('en-IN')})
              </span>
            </div>
            <span className="font-black text-emerald-700 uppercase tracking-wide text-[10px] bg-emerald-100 px-2 py-0.5 rounded-md">
              {appliedCoupon.discountType === 'PERCENTAGE' && `${appliedCoupon.discountValue}% OFF`}
            </span>
          </div>
        )}

        {/* Coupon Error */}
        {couponError && (
          <div className="mt-2 text-xs text-rose-600 font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{couponError}</span>
          </div>
        )}
      </div>

      {/* Price Summary Box */}
      <div className="border border-slate-200 rounded-2xl p-5 mb-8 bg-white">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Onboarding Fee Summary
        </h4>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between text-slate-600">
            <span>{selectedPlan.name} (1 Year)</span>
            <span className="font-semibold text-slate-900">₹{basePrice.toLocaleString('en-IN')}</span>
          </div>

          {appliedCoupon && (
            <div className="flex items-center justify-between text-emerald-600 font-semibold">
              <span>Promotional Discount ({appliedCoupon.code})</span>
              <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-slate-600">
            <span>Platform Gateway &amp; GST</span>
            <span className="text-slate-500 font-medium">Inclusive (0%)</span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm sm:text-base font-black text-slate-900">
            <span>Total Amount Payable</span>
            <span className={finalPayable === 0 ? 'text-emerald-600 text-lg' : 'text-[#0038ed] text-lg'}>
              {finalPayable === 0 ? '₹0 (100% Free Pilot)' : `₹${finalPayable.toLocaleString('en-IN')}`}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation & Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bank Details</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          disabled={isProcessing}
          className={`py-3.5 px-8 rounded-xl font-extrabold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-white ${
            finalPayable === 0
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              : 'bg-[#0038ed] hover:bg-[#002fcf] shadow-blue-600/20'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
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
    </div>
  );
};

