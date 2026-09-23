import React from 'react';
import { useCartStore } from '@/stores/cart.store';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { Percent, ChevronRight, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CheckoutPriceDetails({ storeId }: { storeId?: string }) {
  const router = useRouter();
  const { items, getSubtotal, getTax, getShippingFee, getGrandTotal, getItemCount, clearStoreCart, clearCart } = useCartStore();
  const { fulfillmentType, isPlacingOrder, setIsPlacingOrder } = useCheckoutStore();

  const totalItemCount = getItemCount(storeId);
  const subtotal = getSubtotal(storeId);
  const tax = getTax(storeId);
  const shippingFee = fulfillmentType === 'pickup' || fulfillmentType === 'reserve' ? 0 : getShippingFee(storeId);
  const grandTotal = subtotal + tax + shippingFee;

  const checkoutItems = storeId ? items.filter(item => item.storeId === storeId) : items;

  const totalMrp = checkoutItems.reduce((sum, item) => sum + Math.round(item.unitPrice * 1.15) * item.quantity, 0);
  const discountOnMrp = Math.max(0, totalMrp - subtotal);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    // Mock API call
    setTimeout(() => {
      setIsPlacingOrder(false);
      if (storeId) {
        clearStoreCart(storeId);
      } else {
        clearCart();
      }
      router.push('/checkout/success');
    }, 1500);
  };

  return (
    <div className="w-full">
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-gray-900 flex justify-between">
          Price Details <span className="font-normal text-gray-500">{totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'}</span>
        </h3>
        
        <div className="flex flex-col gap-3 text-sm text-gray-600 font-medium">
          <div className="flex justify-between">
            <span>Total MRP</span>
            <span>₹{totalMrp.toLocaleString('en-IN')}</span>
          </div>
          
          {/* Coupon Section directly inside price details */}
          <div className="my-2 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 cursor-pointer hover:bg-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#1668F6] text-white">
                <Percent className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Apply Coupon / Offer</h4>
                <p className="text-[10px] text-gray-500">Save more on your order</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>

          {discountOnMrp > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount on MRP</span>
              <span>-₹{discountOnMrp.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span>₹{tax.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1">Delivery Charges</span>
            <span className={shippingFee === 0 ? "text-emerald-600 font-bold" : ""}>
              {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
            </span>
          </div>
        </div>

        <div className="my-4 border-t border-gray-200 border-dashed"></div>

        <div className="flex justify-between text-base font-black text-gray-900 mb-6">
          <span>Total Amount</span>
          <span className="text-[20px] text-[#192168]">₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>

        <button 
          type="button"
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1668F6] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition active:scale-98"
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
        {!isPlacingOrder && fulfillmentType !== 'reserve' && (
           <p className="text-center text-[10px] text-gray-500 mt-3 flex items-center justify-center gap-1">
             <ShieldCheckIcon className="h-3.5 w-3.5" />
             Your payment information is safe with us.
           </p>
        )}
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

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
