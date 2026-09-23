import React from 'react';
import { useCartStore } from '@/stores/cart.store';
import { Percent, ChevronRight, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

interface CartPriceDetailsProps {
  onCheckout: () => void;
  storeId?: string;
}

export function CartPriceDetails({ onCheckout, storeId }: CartPriceDetailsProps) {
  const { items, getSubtotal, getTax, getShippingFee, getGrandTotal, getItemCount } = useCartStore();

  const totalItemCount = getItemCount(storeId);
  const subtotal = getSubtotal(storeId);
  const tax = getTax(storeId);
  const shippingFee = getShippingFee(storeId);
  const grandTotal = getGrandTotal(storeId);

  // Filter items by storeId if provided for MRP calculation
  const itemsToCalculate = storeId ? items.filter(i => i.storeId === storeId) : items;
  
  const totalMrp = itemsToCalculate.reduce((sum, item) => sum + Math.round(item.unitPrice * 1.15) * item.quantity, 0);
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
            <p className="text-xs text-gray-500 mt-0.5">Save more on this order</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-gray-900 flex justify-between">
          Price Details <span className="font-normal text-gray-500">{totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'}</span>
        </h3>
        
        <div className="flex flex-col gap-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Total MRP</span>
            <span>₹{totalMrp.toLocaleString()}</span>
          </div>
          {discountOnMrp > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount on MRP</span>
              <span>-₹{discountOnMrp.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span>₹{tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span className={shippingFee === 0 ? "text-green-600 font-medium" : ""}>
              {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
            </span>
          </div>
        </div>

        <div className="my-4 border-t border-gray-100 border-dashed"></div>

        <div className="flex justify-between text-base font-bold text-gray-900">
          <span>Total Amount</span>
          <span className="text-xl">₹{grandTotal.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Desktop Checkout Button */}
      <button
        onClick={onCheckout}
        className="hidden lg:flex w-full items-center justify-between px-6 rounded-xl bg-[#1668F6] py-3.5 text-base font-bold text-white shadow-md hover:bg-blue-700 transition mb-6"
      >
        <span>Proceed to Checkout</span>
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Trust Badges */}
      <div className="flex items-center justify-between px-2 pt-2 border-t border-gray-100 mt-2">
        <div className="flex flex-col items-center gap-1.5 w-1/3">
          <ShieldCheck className="h-6 w-6 text-gray-700" strokeWidth={1.5} />
          <div className="text-center">
            <p className="text-[10px] text-gray-600 font-medium leading-tight">100% Secure</p>
            <p className="text-[10px] text-gray-600 font-medium leading-tight">Payments</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5 w-1/3">
          <RefreshCw className="h-6 w-6 text-gray-700" strokeWidth={1.5} />
          <div className="text-center">
            <p className="text-[10px] text-gray-600 font-medium leading-tight">Easy Returns</p>
            <p className="text-[10px] text-gray-600 font-medium leading-tight">7 Days</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5 w-1/3">
          <Headphones className="h-6 w-6 text-gray-700" strokeWidth={1.5} />
          <div className="text-center">
            <p className="text-[10px] text-gray-600 font-medium leading-tight">24x7</p>
            <p className="text-[10px] text-gray-600 font-medium leading-tight">Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
