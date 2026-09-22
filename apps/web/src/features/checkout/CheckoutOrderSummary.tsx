import React from 'react';
import { useCartStore } from '@/stores/cart.store';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { ShoppingBag, Lock, ShieldCheck, RotateCcw, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CheckoutOrderSummary() {
  const router = useRouter();
  const { items, getSubtotal, getTax, getShippingFee, getGrandTotal, getItemCount, clearCart } = useCartStore();
  const { fulfillmentType, isPlacingOrder, setIsPlacingOrder } = useCheckoutStore();

  const totalItemCount = getItemCount();
  const subtotal = getSubtotal();
  const tax = getTax();
  const shippingFee = fulfillmentType === 'pickup' || fulfillmentType === 'reserve' ? 0 : getShippingFee();
  const grandTotal = subtotal + tax + shippingFee;

  const totalMrp = items.reduce((sum, item) => sum + Math.round(item.unitPrice * 1.15) * item.quantity, 0);
  const discountOnMrp = Math.max(0, totalMrp - subtotal);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    // Mock API call
    setTimeout(() => {
      setIsPlacingOrder(false);
      clearCart();
      router.push('/checkout/success');
    }, 1500);
  };

  return (
    <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24">
      {/* 4. Order Summary */}
      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-[#192168] flex justify-between">
          <span>{fulfillmentType === 'reserve' ? '3. Order Summary' : '4. Order Summary'}</span>
          <span className="font-normal text-gray-500">{totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'}</span>
        </h2>

        {/* Items List Preview */}
        <div className="mb-4 divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.productId} className="py-2 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 truncate flex-1">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-gray-100" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                )}
                <div className="truncate">
                  <p className="font-bold text-gray-800 truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-extrabold text-[#192168] shrink-0">
                ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-3 text-[11px] text-gray-600 font-medium pt-2 border-t border-gray-100">
          <div className="flex justify-between">
            <span>Total MRP</span>
            <span>₹{totalMrp.toLocaleString('en-IN')}</span>
          </div>
          {discountOnMrp > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount on MRP</span>
              <span>-₹{discountOnMrp.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="flex items-center gap-1">Delivery Charges</span>
            <span className={shippingFee === 0 ? "text-emerald-600 font-bold" : ""}>
              {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Taxes (GST 5%)</span>
            <span>₹{tax.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="my-4 border-t border-gray-100 border-dashed"></div>

        <div className="flex justify-between text-sm font-black text-gray-900 mb-6">
          <span>Total Amount</span>
          <span className="text-[16px] text-[#1668F6]">₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>

        {/* Desktop Place Order Button */}
        <button 
          type="button"
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="hidden lg:flex w-full items-center justify-center gap-2 rounded-xl bg-[#1668F6] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition active:scale-98"
        >
          {isPlacingOrder ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {fulfillmentType === 'reserve' ? <CalendarIcon className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {fulfillmentType === 'reserve' ? 'Reserve Order' : 'Place Order'}
            </>
          )}
        </button>
      </div>

      {/* Trust Badges */}
      <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6 hidden lg:flex">
        <TrustBadge icon={<ShieldCheck className="h-4 w-4 text-emerald-500" />} title="Secure Payments" desc="100% Secure" />
        <TrustBadge icon={<RotateCcw className="h-4 w-4 text-[#1668F6]" />} title="Easy Returns" desc="7 Days Return" />
        <TrustBadge icon={<CheckCircle className="h-4 w-4 text-[#1668F6]" />} title="Top Quality" desc="Trusted Products" />
      </div>

      {/* Fixed Bottom Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] pb-8 md:pb-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-medium">Total Payable</p>
            <div className="text-[22px] font-black text-[#1668F6] leading-none mb-0.5">₹{grandTotal.toLocaleString('en-IN')}</div>
            <span className="text-[10px] font-bold text-gray-600">
              {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <button 
            type="button"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1668F6] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition active:scale-98"
          >
            {isPlacingOrder ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {fulfillmentType === 'reserve' ? <CalendarIcon className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {fulfillmentType === 'reserve' ? 'Reserve Order' : 'Place Order'}
              </>
            )}
          </button>
        </div>
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

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  );
}
