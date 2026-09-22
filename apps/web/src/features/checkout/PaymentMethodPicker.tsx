import React from 'react';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { CreditCard, Building2, Banknote } from 'lucide-react';

export function PaymentMethodPicker() {
  const { paymentMethod, setPaymentMethod, fulfillmentType } = useCheckoutStore();

  const isReserve = fulfillmentType === 'reserve';

  return (
    <div className="mb-6">
      <h2 className="text-sm font-bold text-[#192168] mb-1">3. Payment Methods</h2>
      <p className="text-[11px] text-gray-500 mb-3">Select a payment method</p>
      
      {isReserve ? (
        <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-medium text-blue-800 shadow-sm">
          <Banknote className="h-5 w-5 shrink-0 text-blue-600" />
          No payment is required now. You can pay later at the time of pickup or delivery.
        </div>
      ) : (
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
            title={fulfillmentType === 'pickup' ? "Cash on Pickup" : "Cash on Delivery (COD)"}
            desc={fulfillmentType === 'pickup' ? "Pay at the store while picking up" : "Pay when you receive"}
            selected={paymentMethod === 'cod'}
            onClick={() => setPaymentMethod('cod')}
          />
        </div>
      )}
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
