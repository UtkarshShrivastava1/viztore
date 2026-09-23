'use client';

import React from 'react';
import { useCartStore, CartItem } from '../../stores/cart.store';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Store } from 'lucide-react';
import Link from 'next/link';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    clearStoreCart,
    getSubtotal,
    getTax,
    getShippingFee,
    getGrandTotal,
    getItemCount,
  } = useCartStore();

  if (!isOpen) return null;

  // Group items by store
  const storeGroups = items.reduce((groups, item) => {
    if (!groups[item.storeId]) {
      groups[item.storeId] = {
        storeId: item.storeId,
        storeName: item.storeName,
        items: [],
      };
    }
    groups[item.storeId].items.push(item);
    return groups;
  }, {} as Record<string, { storeId: string; storeName: string; items: CartItem[] }>);

  const storesList = Object.values(storeGroups);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Cart Drawer Shell */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4 bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#1668F6]" />
            <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#1668F6]">
              {getItemCount()} items
            </span>
          </div>
          <button
            onClick={closeCart}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Header */}
        {items.length > 0 && (
          <div className="flex items-center justify-between bg-gray-50 px-5 py-2.5 text-xs font-medium text-gray-600 border-b">
            <span>Items from {storesList.length} store{storesList.length > 1 ? 's' : ''}</span>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 font-semibold"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-full bg-gray-100 p-4 text-gray-400 mb-3">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="text-base font-medium text-gray-900">Your cart is empty</p>
              <p className="text-sm text-gray-500 mt-1">Discover items from nearby local shops</p>
              <button onClick={closeCart} className="mt-6 text-[#1668F6] text-sm font-semibold">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {storesList.map((group) => (
                <div key={group.storeId} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                     <span className="flex items-center gap-1.5 truncate text-sm font-bold text-gray-900">
                        <Store className="h-4 w-4 text-gray-500" />
                        {group.storeName}
                     </span>
                     <button
                        onClick={() => clearStoreCart(group.storeId)}
                        className="text-xs text-gray-400 hover:text-red-500 font-medium"
                     >
                        Remove
                     </button>
                  </div>
                  
                  <div className="p-4 space-y-4">
                     {group.items.map((item) => (
                        <div
                           key={item.productId}
                           className="flex items-start justify-between gap-3"
                        >
                           <div className="flex items-start gap-3">
                              {item.imageUrl ? (
                                 <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="h-16 w-16 rounded-lg object-contain border border-gray-100 p-1 bg-white"
                                 />
                              ) : (
                                 <div className="h-16 w-16 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] text-gray-400 text-center leading-tight border border-gray-100">
                                    No image
                                 </div>
                              )}
                              <div className="flex flex-col">
                                 <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                                    {item.name}
                                 </h4>
                                 <p className="text-sm font-bold text-gray-900 mt-1">
                                    ₹{item.unitPrice}
                                 </p>
                              </div>
                           </div>

                           <div className="flex flex-col items-end justify-between h-full gap-2">
                              <button
                                 onClick={() => removeItem(item.productId)}
                                 className="text-gray-400 hover:text-red-500 p-1"
                              >
                                 <Trash2 className="h-4 w-4" />
                              </button>
                              <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                                 <button
                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                    className="flex h-7 w-7 items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-l-lg"
                                 >
                                    <Minus className="h-3 w-3" />
                                 </button>
                                 <span className="w-6 text-center text-xs font-semibold text-gray-900">
                                    {item.quantity}
                                 </span>
                                 <button
                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                    className="flex h-7 w-7 items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-r-lg"
                                 >
                                    <Plus className="h-3 w-3" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  {/* Store specific subtotal in drawer */}
                  <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                     <div className="text-xs text-gray-500">
                        Store Total: <span className="font-bold text-gray-900 text-sm ml-1">₹{getGrandTotal(group.storeId)}</span>
                     </div>
                     <Link
                        href={`/cart/${group.storeId}`}
                        onClick={closeCart}
                        className="text-xs font-bold text-[#1668F6] hover:underline flex items-center gap-1"
                     >
                        View & Checkout <ArrowRight className="h-3 w-3" />
                     </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Action Footer */}
        {items.length > 0 && (
          <div className="bg-white p-5 border-t shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <Link
              href="/cart"
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1668F6] py-3.5 text-base font-bold text-white shadow-md hover:bg-blue-700 transition"
            >
              View Full Cart
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
