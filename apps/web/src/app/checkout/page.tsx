'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  Building2, 
  Banknote, 
  CheckCircle2,
  ChevronDown,
  Lock,
  RotateCcw,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { ordersApi } from '@/lib/api/orders';

export default function CheckoutPage() {
  const router = useRouter();
  const [deliveryOption, setDeliveryOption] = useState('deliver');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { isAuthenticated, openAuthModal } = useAuthStore();

  const {
    items,
    storeId,
    getSubtotal,
    getTax,
    getShippingFee,
    getGrandTotal,
    getItemCount,
    clearCart,
  } = useCartStore();

  const totalItemCount = getItemCount();
  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const grandTotal = getGrandTotal();

  // Mock MRP and discount logic based on items
  const totalMrp = items.reduce((sum, item) => sum + Math.round(item.unitPrice * 1.15) * item.quantity, 0) || 2547;
  const discountOnMrp = totalMrp - (subtotal || 2197);

  const handlePlaceOrder = async () => {
    // Idempotency & double-submit protection
    if (isSubmitting) return;

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please add items from a store before placing an order.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderStoreId = storeId || items[0]?.storeId || 'store-sample-1';
      const shippingAddress = {
        fullName: 'Harish Kumar',
        street: '123, MG Road, Near City Mall',
        city: 'Indore',
        state: 'Madhya Pradesh',
        postalCode: '452001',
        country: 'IN',
        phone: '9876543210',
      };

      const payload = {
        storeId: orderStoreId,
        items: items.map((item) => ({
          productId: item.productId,
          sku: item.sku || 'SKU-DEFAULT',
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          storeId: item.storeId || orderStoreId,
        })),
        shippingAddress,
      };

      const created = await ordersApi.createOrder(payload);
      clearCart();
      const orderRef = created.orderNumber || created.id;
      router.push(`/account/orders/${orderRef}`);
    } catch (err: any) {
      const msg = err?.message || 'Failed to place order. Please check inventory and try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent pb-32 pt-4 flex flex-col">
      <div className="mx-auto max-w-[1920px] px-4 md:px-6 flex-1 w-full">
        
        {/* Header Section */}
        <div className="mb-4">
          <h1 className="text-[22px] font-bold text-[#192168]">Checkout</h1>
          <p className="text-sm text-gray-500 mt-1">Review and place your order</p>
        </div>

        {/* Secure Banner */}
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 shadow-sm">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Shop with confidence! Your order is 100% safe and secure.
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 shadow-sm">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Unable to place order: </span>
              {errorMessage}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full">

        {/* 1. Delivery Address */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#192168]">1. Delivery Address</h2>
            <button className="text-[11px] font-bold text-[#1668F6]">Change</button>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1668F6]">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 mb-0.5">Harish Kumar</h3>
              <p className="text-xs font-medium text-gray-700 mb-1">+91 98765 43210</p>
              <p className="text-[11px] text-gray-500 leading-snug pr-4 mb-2">123, MG Road, Near City Mall<br/>Indore, Madhya Pradesh - 452001</p>
              <span className="inline-block rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                Home
              </span>
            </div>
          </div>
        </div>

        {/* 2. Delivery Options */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-[#192168] mb-1">2. Delivery Options</h2>
          <p className="text-[11px] text-gray-500 mb-3">Choose how you want to receive your order</p>
          <div className="flex flex-col gap-3">
            <OptionCard 
              icon={<Calendar className="h-5 w-5" />}
              title="Reserve"
              desc="Reserve your order for a specific date and time."
              selected={deliveryOption === 'reserve'}
              onClick={() => setDeliveryOption('reserve')}
              iconColor="text-blue-500"
              iconBg="bg-blue-50"
            />
            <OptionCard 
              icon={<ShoppingBag className="h-5 w-5" />}
              title="Pickup"
              desc="Pick up your order from the store."
              selected={deliveryOption === 'pickup'}
              onClick={() => setDeliveryOption('pickup')}
              iconColor="text-emerald-500"
              iconBg="bg-emerald-50"
            />
            <OptionCard 
              icon={<Truck className="h-5 w-5" />}
              title="Deliver"
              desc="Get your order delivered to your address."
              selected={deliveryOption === 'deliver'}
              onClick={() => setDeliveryOption('deliver')}
              iconColor="text-[#1668F6]"
              iconBg="bg-blue-50"
            />
          </div>
          {deliveryOption === 'deliver' && shippingFee === 0 && (
             <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-emerald-600">
               <Truck className="h-4 w-4" />
               Yay! You get FREE delivery on this order.
             </div>
          )}
        </div>

        {/* 3. Payment Methods */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-[#192168] mb-1">3. Payment Methods</h2>
          <p className="text-[11px] text-gray-500 mb-3">Select a payment method</p>
          <div className="flex flex-col gap-3">
            <PaymentCard 
              icon={<div className="font-black italic text-gray-800 tracking-tighter">UPI</div>}
              title="UPI"
              desc="Pay using any UPI app"
              selected={paymentMethod === 'upi'}
              onClick={() => setPaymentMethod('upi')}
            />
            <PaymentCard 
              icon={<CreditCard className="h-5 w-5 text-blue-500" />}
              title="Credit / Debit Card"
              desc="Visa, Mastercard, Rupay, etc."
              selected={paymentMethod === 'card'}
              onClick={() => setPaymentMethod('card')}
            />
            <PaymentCard 
              icon={<Building2 className="h-5 w-5 text-indigo-500" />}
              title="Net Banking"
              desc="All major banks supported"
              selected={paymentMethod === 'netbanking'}
              onClick={() => setPaymentMethod('netbanking')}
            />
            <PaymentCard 
              icon={<Banknote className="h-5 w-5 text-emerald-500" />}
              title="Cash on Delivery (COD)"
              desc="Pay when you receive"
              selected={paymentMethod === 'cod'}
              onClick={() => setPaymentMethod('cod')}
            />
          </div>
        </div>
        </div>

        {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24">
            {/* 4. Order Summary */}
            <div className="mb-8 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-sm font-bold text-[#192168] flex justify-between">
                4. Order Summary <span className="font-normal text-gray-500">{totalItemCount || 3} Items</span>
              </h2>
          
          <div className="flex flex-col gap-3 text-[11px] text-gray-600 font-medium">
            <div className="flex justify-between">
              <span>Total MRP</span>
              <span>₹{totalMrp}</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Discount on MRP</span>
              <span>-₹{discountOnMrp}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1">Delivery Charges <InfoIcon /></span>
              <span className={shippingFee === 0 ? "text-emerald-600 font-bold" : ""}>
                {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
              </span>
            </div>
          </div>

          <div className="my-4 border-t border-gray-100 border-dashed"></div>

          <div className="flex justify-between text-sm font-black text-gray-900">
            <span>Total Amount</span>
            <span className="text-[15px]">₹{grandTotal || 2197}</span>
          </div>
        </div>

            {/* Trust Badges */}
            <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
              <TrustBadge icon={<ShieldCheck className="h-4 w-4 text-emerald-500" />} title="Secure Payments" desc="100% Secure" />
              <TrustBadge icon={<RotateCcw className="h-4 w-4 text-[#1668F6]" />} title="Easy Returns" desc="7 Days Return" />
              <TrustBadge icon={<CheckCircle className="h-4 w-4 text-[#1668F6]" />} title="Top Quality" desc="Trusted Products" />
            </div>
            
            {/* Desktop Place Order Button (hidden on mobile) */}
            <button 
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="hidden lg:flex w-full items-center justify-center gap-2 rounded-xl bg-[#1668F6] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition mb-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing Order...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Place Order
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Fixed Bottom Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] pb-8 md:pb-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-medium">Total Payable</p>
            <div className="text-[22px] font-black text-[#1668F6] leading-none mb-0.5">₹{grandTotal || 2197}</div>
            <button className="flex items-center gap-1 text-[10px] font-bold text-gray-600">
              View Price Details <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <button 
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1668F6] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Place Order
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

function OptionCard({ icon, title, desc, selected, onClick, iconColor, iconBg }: any) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
        selected ? 'border-[#1668F6] bg-blue-50/30' : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${selected ? 'border-[#1668F6]/20 bg-white' : `border-transparent ${iconBg}`} ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold text-gray-900 mb-0.5">{title}</h4>
        <p className="text-[10px] text-gray-500 leading-snug pr-2">{desc}</p>
      </div>
      <div className="shrink-0">
        {selected ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1668F6] text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
        )}
      </div>
    </div>
  );
}

function PaymentCard({ icon, title, desc, selected, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
        selected ? 'border-[#1668F6] bg-blue-50/30' : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex h-8 w-10 shrink-0 items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold text-gray-900 mb-0.5">{title}</h4>
        <p className="text-[10px] text-gray-500 leading-snug">{desc}</p>
      </div>
      <div className="shrink-0">
        {selected ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1668F6] text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
        )}
      </div>
    </div>
  );
}

function TrustBadge({ icon, title, desc }: any) {
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
        {icon}
      </div>
      <div>
        <h5 className="text-[9px] font-bold text-gray-900 leading-tight">{title}</h5>
        <p className="text-[8px] text-gray-500 leading-tight">{desc}</p>
      </div>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg className="h-3 w-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );
}
