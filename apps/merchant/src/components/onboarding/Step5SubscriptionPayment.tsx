import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Tag,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  AlertCircle,
  X,
  UserCheck,
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

  const selectedPlan: IOnboardingPlan = ONBOARDING_PLANS[selectedPlanId] || ONBOARDING_PLANS.standard;

  // Re-calculate or re-validate coupon if user changes plans
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

      // Handle both unwrapped payload (custom fetch client) and wrapped payload
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
      const cleanSalesId = salesIdInput.trim().toUpperCase() || null;
      const orderRes = await api.post<any>('/stores/onboarding/payment/create-order', {
        planId: selectedPlanId,
        couponCode: appliedCoupon?.code || null,
        salesId: cleanSalesId,
        merchantEmail: draft.step1?.email,
        merchantPhone: draft.step1?.mobileNumber,
        storeName: draft.step4?.storeDisplayName,
      });

      const orderData = (orderRes as any)?.data || orderRes;

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
          salesId: cleanSalesId,
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
          },
        },
        handler: async (response: any) => {
          try {
            await api.post('/stores/onboarding/payment/verify', {
              draftId: orderData.draftId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
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
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-10 transition-all">
      {/* Step Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#0038ed] text-[11px] font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#0038ed]" />
          <span>Step 5: Commercial Plan &amp; Store Activation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Standard Storefront &amp; Retail OS License
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete retail suite: Hyperlocal discovery, in-house counter POS, delivery &amp; billing. Use a promotional code to waive fees for pilot retailer rollouts.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Plan Selection Card - Standard All-Inclusive */}
      <div className="mb-8">
        <div
          className="relative rounded-3xl p-6 sm:p-8 border-2 border-[#0038ed] bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 shadow-lg shadow-blue-500/5 transition-all"
        >
          <div className="absolute -top-3.5 right-6 bg-[#0038ed] text-white text-[11px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-sm tracking-wide">
            Official Launch License
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-lg sm:text-xl">
                {selectedPlan.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">{selectedPlan.tagline}</p>
            </div>

            <div className="flex items-baseline gap-2 bg-white px-5 py-3 rounded-2xl border border-blue-100 shadow-xs">
              <span className="text-3xl sm:text-4xl font-black text-[#0038ed]">
                ₹{selectedPlan.basePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-bold uppercase">/ 1 Year License</span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="pt-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Included All-In-One Capabilities:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              {selectedPlan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Coupon & Sales Representative Box */}
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 sm:p-6 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4 text-[#0038ed]" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">Field Representative &amp; Promotional Code</h4>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Enter your authorized Sales Representative ID and promo code to apply promotional partner discounts or 100% pilot waivers.
        </p>

        {/* Input Rows: Sales ID and Coupon Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Salesperson ID Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#0038ed]" />
              <span>Salesperson ID *</span>
            </label>
            <input
              type="text"
              placeholder="e.g. SALES-01, SALES-02, AGENT-PILOT"
              value={salesIdInput}
              onChange={(e) => {
                setSalesIdInput(e.target.value.toUpperCase());
                setCouponError(null);
              }}
              disabled={!!appliedCoupon || isValidatingCoupon}
              className="w-full text-xs sm:text-sm uppercase font-bold tracking-wider px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-2 focus:ring-[#0038ed]/10 transition-all disabled:opacity-60"
            />
          </div>

          {/* Coupon Code Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#0038ed]" />
              <span>Promotional Coupon Code</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. FREE100, WELCOME50"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value.toUpperCase());
                  setCouponError(null);
                }}
                disabled={!!appliedCoupon || isValidatingCoupon}
                className="w-full text-xs sm:text-sm uppercase font-bold tracking-wider px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-2 focus:ring-[#0038ed]/10 transition-all disabled:opacity-60 pr-10"
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
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-1">
          {/* Validate Button */}
          {appliedCoupon ? (
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="px-5 py-2 rounded-xl border border-rose-200 text-rose-600 bg-rose-50/60 hover:bg-rose-50 font-bold text-xs transition-all cursor-pointer self-end"
            >
              Remove Code
            </button>
          ) : (
            <button
              type="button"
              onClick={() => validateAndApplyCoupon(couponInput, selectedPlanId)}
              disabled={!couponInput.trim() || isValidatingCoupon}
              className="px-5 py-2.5 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 self-end"
            >
              {isValidatingCoupon ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validating...</span>
                </>
              ) : (
                <span>Verify &amp; Apply Code</span>
              )}
            </button>
          )}
        </div>

        {/* Verified Sales Rep Info Badge */}
        {salesRepInfo && appliedCoupon && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-xs text-[#0038ed] animate-in fade-in">
            <ShieldCheck className="w-4 h-4 text-[#0038ed] shrink-0" />
            <span>
              Authorized Field Representative: <strong>{salesRepInfo.name}</strong> ({salesRepInfo.territory} &bull; {salesRepInfo.salesId})
            </span>
          </div>
        )}

        {/* Applied Coupon Feedback Alert */}
        {appliedCoupon && (
          <div className="mt-2.5 p-3 bg-emerald-50 border border-emerald-200/90 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
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
          <div className="mt-2.5 text-xs text-rose-600 font-semibold flex items-center gap-1.5">
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
