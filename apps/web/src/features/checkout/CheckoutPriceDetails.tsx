'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cart.store';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { useAuthStore } from '@/stores/auth.store';
import { useLocationStore } from '@/stores/location.store';
import { ordersApi } from '@/lib/api/orders';
import { couponsApi } from '@/lib/api/coupons';
import type { CreateOrderDto, ICoupon } from '@repo/shared-types';
import { Percent, ChevronRight, Lock, Loader2, Calendar, X, CheckCircle, Tag, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CheckoutPriceDetails({ storeId }: { storeId?: string }) {
  const router = useRouter();
  const { items, getSubtotal, getTax, getShippingFee, getItemCount, clearStoreCart, clearCart } = useCartStore();
  const { 
    fulfillmentType, 
    isPlacingOrder, 
    setIsPlacingOrder, 
    shippingAddress,
    setIsAddressModalOpen,
    couponCode,
    discountAmount,
    applyCouponDiscount,
    removeCoupon
  } = useCheckoutStore();
  const { isAuthenticated, user, openAuthModal } = useAuthStore();
  const { city: locationCity, pincode: locationPincode } = useLocationStore();

  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<ICoupon[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  const totalItemCount = getItemCount(storeId);
  const subtotal = getSubtotal(storeId);
  const tax = getTax(storeId);
  const shippingFee = fulfillmentType === 'pickup' || fulfillmentType === 'reserve' ? 0 : getShippingFee(storeId);
  const rawGrandTotal = subtotal + tax + shippingFee;
  const grandTotal = Math.max(0, rawGrandTotal - discountAmount);
  
  // Calculate total MRP for savings highlight
  const checkoutItems = storeId ? items.filter(i => i.storeId === storeId) : items;
  const totalMrp = checkoutItems.reduce((sum, item) => sum + Math.round(item.unitPrice * 1.15) * item.quantity, 0);
  const discountOnMrp = Math.max(0, totalMrp - subtotal);
  const totalSavings = discountOnMrp + discountAmount;

  useEffect(() => {
    if (isCouponDrawerOpen && availableCoupons.length === 0) {
      setIsLoadingCoupons(true);
      couponsApi.getActiveCoupons(storeId)
        .then((coupons) => {
          setAvailableCoupons(coupons);
        })
        .catch((err) => {
          console.error('Failed to load available coupons:', err);
        })
        .finally(() => {
          setIsLoadingCoupons(false);
        });
    }
  }, [isCouponDrawerOpen, storeId, availableCoupons.length]);

  const handleApplyCode = async (codeToApply: string) => {
    if (!codeToApply.trim()) return;
    setCouponError(null);
    setIsApplyingCoupon(true);

    try {
      const res = await couponsApi.validateCoupon(codeToApply.trim().toUpperCase(), subtotal, storeId);
      applyCouponDiscount(res.coupon.code, res.discountAmount);
      setIsCouponDrawerOpen(false);
      setCouponInput('');
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Invalid coupon code or criteria not met';
      setCouponError(msg);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (checkoutItems.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    const targetStoreId = storeId || checkoutItems[0]?.storeId;
    if (!targetStoreId) {
      alert('Store context is missing for this order.');
      return;
    }

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (fulfillmentType === 'deliver') {
      const pinToTest = (shippingAddress?.postalCode && shippingAddress.postalCode !== '452001') ? shippingAddress.postalCode : (locationPincode || '');
      const cleanPin = pinToTest.replace(/\D/g, '');
      const phoneToTest = shippingAddress?.phone || user?.phone || '';
      const cleanPhone = phoneToTest.replace(/\D/g, '');
      const streetToTest = shippingAddress?.street?.trim() || '';

      const isInvalid =
        !shippingAddress ||
        !streetToTest ||
        streetToTest === 'Customer Address' ||
        streetToTest.length < 5 ||
        cleanPin.length !== 6 ||
        !/^[1-9][0-9]{5}$/.test(cleanPin) ||
        cleanPhone.length !== 10 ||
        !/^[6-9]\d{9}$/.test(cleanPhone);

      if (isInvalid) {
        setIsAddressModalOpen(true);
        const addressEl = document.getElementById('delivery-address-section');
        if (addressEl) {
          addressEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        alert('Please provide a complete delivery address with a valid 6-digit postal PIN code and 10-digit mobile number.');
        return;
      }
    }

    const finalAddress = {
      fullName: shippingAddress?.fullName || user?.fullName || 'Customer',
      phone: shippingAddress?.phone || user?.phone || '9876543210',
      street: shippingAddress?.street || (fulfillmentType === 'pickup' ? 'Store Pickup' : fulfillmentType === 'reserve' ? 'In-Store 2h Hold' : 'Customer Address'),
      city: (shippingAddress?.city && shippingAddress.city !== 'Local City') ? shippingAddress.city : (locationCity || 'Local City'),
      state: (shippingAddress?.state && shippingAddress.state !== 'State') ? shippingAddress.state : 'Chhattisgarh',
      postalCode: (shippingAddress?.postalCode && shippingAddress.postalCode !== '452001') ? shippingAddress.postalCode : (locationPincode || '490006'),
      country: 'IN',
    };

    const orderPayload: CreateOrderDto = {
      storeId: targetStoreId,
      items: checkoutItems.map(item => ({
        productId: item.productId,
        name: item.name,
        sku: item.sku || 'SKU-DEFAULT',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        storeId: targetStoreId,
      })),
      shippingAddress: fulfillmentType === 'deliver' ? finalAddress : undefined,
      fulfilmentMode: (fulfillmentType as any) || 'deliver',
      couponCode: couponCode || undefined,
    };

    setIsPlacingOrder(true);
    try {
      const order = await ordersApi.createOrder(orderPayload);
      if (storeId) {
        clearStoreCart(storeId);
      } else {
        clearCart();
      }
      const orderId = order.id || order._id || order.orderNumber;
      router.push(`/checkout/success?orderId=${encodeURIComponent(orderId)}&orderNumber=${encodeURIComponent(order.orderNumber)}`);
    } catch (err: unknown) {
      console.error('Backend order placement API error:', err);
      const isAuthError =
        (err as { statusCode?: number })?.statusCode === 401 ||
        (err as { message?: string })?.message?.toLowerCase().includes('token') ||
        (err as { message?: string })?.message?.toLowerCase().includes('unauthorized');

      if (isAuthError) {
        openAuthModal('login');
        return;
      }

      let msg = err instanceof Error ? err.message : 'Failed to communicate with store server. Please try again.';
      if ((err as { details?: unknown })?.details) {
        const details = (err as { details?: unknown }).details;
        if (Array.isArray(details)) {
          const detailStrings = details.map((d: any) => d.message || `${d.field}: ${d.message}`).filter(Boolean);
          if (detailStrings.length > 0) {
            msg = `${msg} (${detailStrings.join(', ')})`;
          }
        }
      }
      alert(`Could not place order: ${msg}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-gray-900 flex justify-between">
          <span>Price Details</span>
          <span className="text-xs font-normal text-gray-500">({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})</span>
        </h3>

        <div className="space-y-3 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Total MRP</span>
            <span>₹{totalMrp.toLocaleString('en-IN')}</span>
          </div>
          
          {/* Coupon Trigger Card */}
          <div 
            onClick={() => {
              if (!couponCode) {
                setCouponError(null);
                setIsCouponDrawerOpen(true);
              }
            }}
            className="my-2 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 p-3 cursor-pointer hover:bg-blue-50 transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1668F6] text-white shrink-0">
                <Percent className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  {couponCode ? `Coupon Applied: ${couponCode}` : 'Apply Coupon / Offer'}
                </h4>
                <p className="text-[10px] text-gray-500">
                  {couponCode ? `₹${discountAmount} discount deducted from cart` : 'View available coupons & save more'}
                </p>
              </div>
            </div>
            {couponCode ? (
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); removeCoupon(); }} 
                className="text-xs text-red-600 font-bold hover:underline cursor-pointer px-2 py-1"
              >
                Remove
              </button>
            ) : (
              <div className="flex items-center gap-1 text-[#1668F6] font-bold text-xs">
                <span>View</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            )}
          </div>

          {discountOnMrp > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Discount on MRP</span>
              <span>-₹{discountOnMrp.toLocaleString('en-IN')}</span>
            </div>
          )}

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50/80 px-2 py-1.5 rounded-lg border border-emerald-100">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                Coupon ({couponCode})
              </span>
              <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>GST & Platform Charges</span>
            <span>₹{tax.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1">Delivery Charges</span>
            {shippingFee === 0 ? (
              <span className="font-medium text-emerald-600">FREE</span>
            ) : (
              <span>₹{shippingFee.toLocaleString('en-IN')}</span>
            )}
          </div>

          <div className="my-3 border-t border-dashed border-gray-200"></div>

          <div className="flex justify-between text-sm font-bold text-gray-900">
            <span>Total Amount</span>
            <span>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>

          {totalSavings > 0 && (
            <div className="rounded-lg bg-emerald-50 p-2 text-center text-xs font-semibold text-emerald-700">
              You will save ₹{totalSavings.toLocaleString('en-IN')} on this order
            </div>
          )}
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || checkoutItems.length === 0}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1668F6] py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPlacingOrder ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Placing Order...</span>
            </>
          ) : fulfillmentType === 'reserve' ? (
            <>
              <Calendar className="h-4 w-4" />
              <span>Confirm Store Reservation</span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              <span>Place Order • ₹{grandTotal.toLocaleString('en-IN')}</span>
            </>
          )}
        </button>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
          <Lock className="h-3 w-3" />
          <span>Safe and Secure Payments • 100% Authentic Products</span>
        </div>
      </div>

      {/* Modern Coupon Selection Drawer / Slideout */}
      {isCouponDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="fixed inset-0"
            onClick={() => setIsCouponDrawerOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-screen shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <h3 className="text-base font-bold text-gray-900">Apply Coupon</h3>
                <p className="text-xs text-gray-500">Order Subtotal: ₹{subtotal.toLocaleString('en-IN')}</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsCouponDrawerOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Manual Code Input */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code (e.g. LOCAL200)"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyCode(couponInput);
                    }
                  }}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 uppercase placeholder:normal-case placeholder:text-gray-400 focus:outline-none focus:border-[#1668F6]"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCode(couponInput)}
                  disabled={!couponInput.trim() || isApplyingCoupon}
                  className="px-5 py-2.5 bg-[#1668F6] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </button>
              </div>
              {couponError && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{couponError}</span>
                </div>
              )}
            </div>

            {/* Available Coupons List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Available Coupons</h4>

              {isLoadingCoupons ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin text-[#1668F6] mb-2" />
                  <span className="text-xs">Loading best offers...</span>
                </div>
              ) : availableCoupons.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-gray-200 rounded-xl">
                  No applicable coupons found for this store right now.
                </div>
              ) : (
                availableCoupons.map((c) => {
                  const isEligible = subtotal >= c.minOrderValue;
                  const isCurrent = couponCode === c.code;

                  return (
                    <div 
                      key={c.id || c.code}
                      className={`border rounded-xl p-3.5 transition-all ${
                        isCurrent 
                          ? 'border-emerald-500 bg-emerald-50/30'
                          : isEligible 
                          ? 'border-gray-200 bg-white hover:border-blue-300 shadow-2xs' 
                          : 'border-gray-100 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1668F6] font-mono font-bold text-xs">
                              {c.code}
                            </span>
                            {c.tag && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                {c.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-gray-900">{c.title}</p>
                          {c.description && (
                            <p className="text-[11px] text-gray-500 mt-0.5">{c.description}</p>
                          )}
                          <p className="text-[10px] text-gray-400 mt-1">
                            Min. order: ₹{c.minOrderValue.toLocaleString('en-IN')} • {c.endDate ? `Valid till ${c.endDate}` : 'Limited period'}
                          </p>
                        </div>

                        {isCurrent ? (
                          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0">
                            <CheckCircle className="w-3.5 h-3.5" /> Applied
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApplyCode(c.code)}
                            disabled={!isEligible || isApplyingCoupon}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                              isEligible 
                                ? 'bg-[#1668F6] text-white hover:bg-blue-700 cursor-pointer' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Apply
                          </button>
                        )}
                      </div>
                      {!isEligible && (
                        <p className="text-[10px] text-amber-600 font-medium mt-2">
                          Add ₹{(c.minOrderValue - subtotal).toLocaleString('en-IN')} more to unlock this coupon.
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
