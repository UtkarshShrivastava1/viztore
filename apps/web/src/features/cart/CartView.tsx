'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore, CartItem } from '@/stores/cart.store';
import { fetchProductBySlug } from '@/lib/api/catalog';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CartStoreGroupCard } from '@/components/cart/CartStoreGroupCard';

export function CartView() {
  const { items, getItemCount } = useCartStore();

  const [isLoading, setIsLoading] = useState(true);
  const [syncedItems, setSyncedItems] = useState<CartItem[]>(items);

  // Sync local cart items with backend data
  useEffect(() => {
    let isMounted = true;

    async function syncCartItems() {
      if (items.length === 0) {
        setSyncedItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const promises = items.map((item) => fetchProductBySlug(item.productId));
        const products = await Promise.all(promises);

        if (isMounted) {
          const updatedItems = items.map((item, index) => {
            const product = products[index];
            if (!product) return item;

            return {
              ...item,
              name: product.name,
              unitPrice: product.basePrice, // Use live price
              imageUrl: product.variants?.[0]?.images?.[0] || item.imageUrl,
              storeId: product.storeId,
              storeName: product.storeName,
            };
          });
          setSyncedItems(updatedItems);
        }
      } catch (err) {
        console.error('Failed to sync cart items from backend:', err);
        if (isMounted) {
          setSyncedItems(items); // fallback to local state
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    syncCartItems();

    return () => {
      isMounted = false;
    };
  }, [items]);

  const totalItemCount = getItemCount();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link href="/products" className="mt-4 rounded-lg bg-[#1668F6] px-6 py-2 text-white font-medium">
          Start Shopping
        </Link>
      </div>
    );
  }

  // Group items by store
  const storeGroups = syncedItems.reduce((groups, item) => {
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
    <div className="mt-4">
      <div className="mb-6">
         <h2 className="text-lg text-gray-600 font-medium">
            My Cart ({totalItemCount})
         </h2>
         <p className="text-sm text-gray-500 mt-1">
            Items from {storesList.length} store{storesList.length > 1 ? 's' : ''}
         </p>
      </div>

      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin text-[#1668F6]" />
            <p className="text-sm font-medium">Updating cart details...</p>
          </div>
        ) : (
          storesList.map((group) => (
            <CartStoreGroupCard
              key={group.storeId}
              storeId={group.storeId}
              storeNameFallback={group.storeName}
              items={group.items}
            />
          ))
        )}
      </div>
    </div>
  );
}
