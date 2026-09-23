'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore, CartItem } from '@/stores/cart.store';
import { CartPriceDetails } from './CartPriceDetails';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { fetchProductBySlug } from '@/lib/api/catalog';
import { fetchStoreById } from '@/lib/api/stores';
import { IStore } from '@repo/shared-types';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, MapPin, Truck, Trash2, Store } from 'lucide-react';
import Link from 'next/link';

export function StoreCartView({ storeId }: { storeId: string }) {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearStoreCart, getShippingFee, getItemCount } = useCartStore();

  const [isLoading, setIsLoading] = useState(true);
  const [store, setStore] = useState<IStore | null>(null);
  
  // Filter items for this store
  const storeItems = items.filter(item => item.storeId === storeId);
  const [syncedItems, setSyncedItems] = useState<CartItem[]>(storeItems);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (storeItems.length === 0) {
        setSyncedItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch store details and product updates in parallel
        const [storeData, ...productsData] = await Promise.all([
          fetchStoreById(storeId),
          ...storeItems.map((item) => fetchProductBySlug(item.productId))
        ]);

        if (isMounted) {
          setStore(storeData);
          
          const updatedItems = storeItems.map((item, index) => {
            const product = productsData[index];
            if (!product) return item;

            return {
              ...item,
              name: product.name,
              unitPrice: product.basePrice, // Use live price
              imageUrl: product.variants?.[0]?.images?.[0] || item.imageUrl,
            };
          });
          setSyncedItems(updatedItems);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        if (isMounted) {
          setSyncedItems(storeItems); // fallback to local state
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [items, storeId]);

  const totalItemCount = getItemCount(storeId);
  const isFreeDelivery = getShippingFee(storeId) === 0;

  if (storeItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">Your cart for this store is empty.</p>
        <Link href="/cart" className="mt-4 rounded-lg bg-[#1668F6] px-6 py-2 text-white font-medium">
          Back to all carts
        </Link>
      </div>
    );
  }

  // Helper to format opening hours
  const getTodayStatus = () => {
    if (!store?.operatingHours) return null;
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const today = days[new Date().getDay()];
    const hours = store.operatingHours[today];
    
    if (!hours?.isOpen) return <span className="text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded text-xs">Closed Today</span>;
    return (
      <span className="text-green-700 font-medium bg-green-50 px-2 py-1 rounded text-xs border border-green-100">
        Open till {hours.close}
      </span>
    );
  };

  const formatAddress = () => {
    if (!store?.address) return 'Address not available';
    const { street, city, state, pincode } = store.address;
    return `${street}, ${city}, ${state} - ${pincode}`;
  };

  return (
    <div className="mt-4">
      <div className="mb-6 flex justify-between items-end">
         <div>
            <h1 className="text-xl font-bold text-[#192168]">My Cart ({totalItemCount})</h1>
            <p className="text-sm text-gray-500 mt-1">Items from a single store</p>
         </div>
         <button 
           onClick={() => {
             clearStoreCart(storeId);
             router.push('/cart');
           }}
           className="flex items-center gap-1.5 text-sm font-semibold text-[#1668F6] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
         >
           <Trash2 className="h-4 w-4" />
           Clear Cart
         </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full flex flex-col gap-4">
          
          {/* Store Info Banner */}
          <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center">
                  {store?.logoUrl ? (
                    <img src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" />
                  ) : (
                    <Store className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1">
                    {store?.name || storeItems[0]?.storeName || 'Store'}
                    <span className="text-gray-400">›</span>
                  </h2>
                  <div className="flex items-start gap-1 mt-1 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{isLoading ? 'Loading address...' : formatAddress()}</span>
                  </div>
                  <div className="mt-2">
                    {isLoading ? (
                      <span className="bg-gray-100 text-transparent rounded px-2 py-0.5 text-xs animate-pulse">Loading...</span>
                    ) : (
                      getTodayStatus()
                    )}
                  </div>
                </div>
              </div>
              <Link href={`/stores/${store?.slug || storeId}`} className="hidden sm:inline-flex items-center justify-center h-8 px-3 rounded border border-blue-100 bg-blue-50 text-xs font-semibold text-[#1668F6] hover:bg-blue-100 transition">
                View Store
              </Link>
            </div>
          </div>

          {/* Free Delivery Banner */}
          {isFreeDelivery && (
             <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
               <Truck className="h-5 w-5 shrink-0" />
               Yay! You get FREE delivery on this order.
             </div>
          )}

          {/* Cart Items Area */}
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500 bg-white rounded-xl border border-gray-100">
                <Loader2 className="h-6 w-6 animate-spin text-[#1668F6]" />
                <p className="text-sm font-medium">Updating cart details...</p>
              </div>
            ) : (
              <div className="flex flex-col rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm">
                {syncedItems.map((item, index) => (
                  <div key={item.productId} className={index !== syncedItems.length - 1 ? 'border-b border-gray-100' : ''}>
                    <CartItemCard
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                      onMoveToWishlist={(id) => {
                        removeItem(id);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-24">
          <CartPriceDetails 
            storeId={storeId} 
            onCheckout={() => router.push(`/checkout/${storeId}`)} 
          />
        </div>

        {/* Sticky Checkout Button (Mobile Only) */}
        <div className="lg:hidden fixed bottom-[72px] left-0 right-0 z-40 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:bottom-0">
          <div className="mx-auto max-w-3xl">
            <button
              onClick={() => router.push(`/checkout/${storeId}`)}
              disabled={isLoading}
              className="flex w-full items-center justify-between px-6 rounded-xl bg-[#1668F6] py-3.5 text-base font-bold text-white shadow-md hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
