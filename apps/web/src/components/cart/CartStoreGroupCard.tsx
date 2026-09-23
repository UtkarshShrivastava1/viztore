import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, useCartStore } from '@/stores/cart.store';
import { fetchStoreById } from '@/lib/api/stores';
import { IStore } from '@repo/shared-types';
import { MapPin, Clock, ArrowRight, Loader2, ChevronRight, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface CartStoreGroupCardProps {
  storeId: string;
  items: CartItem[];
  storeNameFallback: string;
}

export const CartStoreGroupCard: React.FC<CartStoreGroupCardProps> = ({
  storeId,
  items,
  storeNameFallback,
}) => {
  const router = useRouter();
  const { getSubtotal, getTax, getShippingFee } = useCartStore();
  const [store, setStore] = useState<IStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadStore = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStoreById(storeId);
        if (isMounted) setStore(data);
      } catch (err) {
        console.error('Failed to load store details', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadStore();
    return () => {
      isMounted = false;
    };
  }, [storeId]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getSubtotal(storeId);
  const tax = getTax(storeId);
  const shipping = getShippingFee(storeId);
  const grandTotal = Number((subtotal + tax + shipping).toFixed(2));

  // Compute MRP and savings
  const totalMrp = items.reduce((sum, item) => sum + Math.round(item.unitPrice * 1.15) * item.quantity, 0);
  const discountOnMrp = Math.max(0, totalMrp - subtotal);

  // Get max 3 item images for preview
  const previewItems = items.slice(0, 3);
  const remainingItemsCount = Math.max(0, items.length - 3);

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
    <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm transition-all hover:shadow-md">
      {/* Store Header Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center">
          {store?.logoUrl ? (
            <img src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-gray-400">
              {storeNameFallback.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <Link href={`/stores/${store?.slug || storeId}`} className="group flex items-center gap-1 w-fit">
            <h2 className="text-lg font-bold text-gray-900 truncate group-hover:text-[#1668F6]">
              {store?.name || storeNameFallback}
            </h2>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#1668F6] transition-transform group-hover:translate-x-0.5" />
          </Link>
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

        {/* Top Right action */}
        <Link href={`/stores/${store?.slug || storeId}`} className="hidden sm:inline-flex items-center justify-center h-8 px-3 rounded border border-blue-100 bg-blue-50 text-xs font-semibold text-[#1668F6] hover:bg-blue-100 transition">
          View Store
        </Link>
        <button className="sm:hidden text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="border-t border-gray-100 my-4" />

      {/* Cart Content Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Images Preview & Item Count */}
        <div className="flex items-center gap-2">
          {previewItems.map((item, idx) => (
            <div key={item.productId} className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center p-1.5 overflow-hidden">
               {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain" />
               ) : (
                  <span className="text-[10px] text-gray-400 text-center leading-tight">No image</span>
               )}
            </div>
          ))}
          
          {remainingItemsCount > 0 && (
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-blue-50 text-[#1668F6] flex flex-col items-center justify-center font-bold text-sm">
              <span>+{remainingItemsCount}</span>
              <span className="text-[10px] font-medium">more</span>
            </div>
          )}

          <div className="ml-2 flex flex-col">
            <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              🛒 {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
            <Link href={`/cart/${storeId}`} className="text-xs font-semibold text-[#1668F6] hover:underline mt-1">
              View products v
            </Link>
          </div>
        </div>

        {/* Pricing & Checkout Action */}
        <div className="flex flex-col items-end w-full sm:w-auto mt-2 sm:mt-0 relative pl-4">
          {/* Vertical divider line on desktop */}
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-px bg-gray-200 h-full"></div>
          
          <div className="text-2xl font-bold text-gray-900">₹{grandTotal.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] mt-0.5">
            <span className="text-gray-500">MRP</span>
            <span className="text-gray-400 line-through">₹{totalMrp.toLocaleString()}</span>
          </div>
          {discountOnMrp > 0 && (
            <div className="text-xs font-semibold text-green-600 mt-0.5">
              You save ₹{discountOnMrp.toLocaleString()}
            </div>
          )}

          <button
            onClick={() => router.push(`/cart/${storeId}`)}
            className="mt-4 flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#EBF3FF] px-6 py-2.5 text-sm font-bold text-[#1668F6] hover:bg-[#D6E6FF] transition"
          >
            View Cart
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
