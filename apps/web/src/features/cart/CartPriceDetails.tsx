import React from 'react';
import { useCartStore } from '@/stores/cart.store';
import { Percent, ChevronRight } from 'lucide-react';

export function CartPriceDetails({ onCheckout }: { onCheckout: () => void }) {
  const { items, getSubtotal, getTax, getShippingFee, getGrandTotal, getItemCount } = useCartStore();

  const totalItemCount = getItemCount();
  const subtotal = getSubtotal();
  const tax = getTax();
  const shippingFee = getShippingFee();
  const grandTotal = getGrandTotal();

  const totalMrp = items.reduce((sum, item) => sum + Math.round(item.unitPrice * 1.15) * item.quantity, 0);
  const discountOnMrp = totalMrp - subtotal;

  return (
    <div>
      {/* Coupon Section */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm cursor-pointer hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Apply Coupon / Offer</h4>
            <p className="text-xs text-gray-500 mt-0.5">Save more on your order</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-gray-900 flex justify-between">
          Price Details <span className="font-normal text-gray-500">{totalItemCount} Items</span>
        </h3>
        
        <div className="flex flex-col gap-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Total MRP</span>
            <span>₹{totalMrp}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Discount on MRP</span>
            <span>-₹{discountOnMrp}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span>₹{tax}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span className={shippingFee === 0 ? "text-green-600" : ""}>
              {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
            </span>
          </div>
        </div>

        <div className="my-4 border-t border-gray-100 border-dashed"></div>

        <div className="flex justify-between text-base font-bold text-gray-900">
          <span>Total Amount</span>
          <span className="text-xl">₹{grandTotal}</span>
        </div>
      </div>
      
      {/* Desktop Checkout Button */}
      <button
        onClick={onCheckout}
        className="hidden lg:flex w-full items-center justify-center gap-2 rounded-xl bg-[#1668F6] py-3.5 text-base font-bold text-white shadow-md hover:bg-blue-700 transition mb-6"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
