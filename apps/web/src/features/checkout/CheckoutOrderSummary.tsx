import React from 'react';
import { useCartStore } from '@/stores/cart.store';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CheckoutOrderSummary({ storeId }: { storeId?: string }) {
  const { items, getItemCount } = useCartStore();
  const { fulfillmentType } = useCheckoutStore();

  const totalItemCount = getItemCount(storeId);
  const checkoutItems = storeId ? items.filter(item => item.storeId === storeId) : items;

  return (
    <div className="w-full">
      <div className="rounded-xl border border-gray-100 bg-white p-4 lg:p-5 shadow-sm">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-extrabold text-[#192168]">
            {fulfillmentType === 'reserve' ? '3. Order Summary' : 'Order Summary'}
          </h2>
          <div className="text-right flex flex-col items-end">
            <span className="text-sm font-medium text-[#192168]">
              {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'}
            </span>
            <Link 
              href={storeId ? `/cart/${storeId}` : '/cart'} 
              className="mt-1 text-xs font-bold text-[#1668F6] hover:underline"
            >
              Edit
            </Link>
          </div>
        </div>

        {/* Items List */}
        <div className="flex flex-col max-h-[400px] overflow-y-auto pr-1 hide-scrollbar">
          {checkoutItems.map((item, index) => {
            const mrp = Math.round(item.unitPrice * 1.15); // Mock MRP 15% higher
            const discountPercent = Math.round(((mrp - item.unitPrice) / mrp) * 100);

            return (
              <div 
                key={item.productId} 
                className={`flex gap-4 py-4 ${index !== checkoutItems.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                {/* Product Image */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="h-full w-full object-cover mix-blend-multiply" 
                    />
                  ) : (
                    <ShoppingBag className="h-6 w-6 text-gray-300" />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#192168] line-clamp-1">{item.name}</h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Standard <span className="mx-1 text-gray-300">|</span> Sold by: {item.storeName || 'Store'}
                    </p>
                  </div>
                  
                  <div className="mt-2 flex items-end justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-[#192168]">
                        ₹{item.unitPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-medium text-gray-400 line-through">
                        ₹{mrp.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {discountPercent}% OFF
                      </span>
                    </div>
                    <div className="text-sm font-medium text-[#192168]">
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
