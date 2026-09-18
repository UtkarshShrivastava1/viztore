'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Truck, XCircle, Calendar, ShoppingBag, ChevronRight, Loader2 } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';
import type { IOrder } from '@repo/shared-types';

const tabs = [
  'All Orders',
  'To Be Delivered',
  'Delivered',
  'Returns',
  'Cancelled',
  'Reserve',
  'Pickup'
];

interface DisplayOrder {
  id: string;
  type: 'regular' | 'reserve' | 'pickup';
  status: string;
  date: string;
  productName: string;
  variants: string;
  price: number;
  total: number;
  image: string;
  reserveTill?: string;
}

const mockOrders: DisplayOrder[] = [
  {
    id: '#ORD-123456789',
    type: 'regular',
    status: 'Delivered',
    date: '08 May 2024, 10:30 AM',
    productName: 'Men Graphic Print T-shirt',
    variants: 'Olive Green • Size: L • Qty: 1',
    price: 399,
    total: 399,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '#ORD-123456788',
    type: 'regular',
    status: 'To Be Delivered',
    date: '05 May 2024, 09:15 PM',
    productName: 'Men Striped Round Neck T-shirt',
    variants: 'White/Navy • Size: M • Qty: 1',
    price: 449,
    total: 449,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '#ORD-123456787',
    type: 'regular',
    status: 'Delivered',
    date: '02 May 2024, 06:40 PM',
    productName: 'Men Oversized T-shirt',
    variants: 'Black • Size: XL • Qty: 1',
    price: 499,
    total: 499,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '#ORD-123456786',
    type: 'regular',
    status: 'Cancelled',
    date: '28 Apr 2024, 11:20 AM',
    productName: 'Men Cotton Plain T-shirt',
    variants: 'Mauve • Size: M • Qty: 1',
    price: 329,
    total: 329,
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '#PKP-123456781',
    type: 'pickup',
    status: 'Ready for Pickup',
    date: '24 Apr 2024, 02:20 PM',
    productName: 'Laptop Backpack',
    variants: 'Black • Qty: 1',
    price: 899,
    total: 899,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=200&h=200'
  }
];

export function OrdersClient() {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [orders, setOrders] = useState<DisplayOrder[]>(mockOrders);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const liveOrders = await ordersApi.getMyOrders();
        if (isMounted && Array.isArray(liveOrders) && liveOrders.length > 0) {
          const mapped: DisplayOrder[] = liveOrders.map((o: IOrder) => {
            const firstItem = o.items[0];
            return {
              id: `#${o.orderNumber || o.id || o._id}`,
              type: 'regular',
              status: o.status === 'DELIVERED' ? 'Delivered' : o.status === 'CANCELLED' ? 'Cancelled' : 'To Be Delivered',
              date: new Date(o.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              productName: firstItem?.name || 'Local Store Product',
              variants: `Qty: ${firstItem?.quantity || 1} • SKU: ${firstItem?.sku || 'N/A'}`,
              price: firstItem?.unitPrice || o.grandTotal,
              total: o.grandTotal,
              image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200&h=200',
            };
          });
          setOrders(mapped);
        }
      } catch {
        // Fallback gracefully to mock orders
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All Orders') return true;
    if (activeTab === 'Reserve') return order.type === 'reserve';
    if (activeTab === 'Pickup') return order.type === 'pickup';
    return order.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#fafafc] pb-24">
      <main className="max-w-md md:max-w-3xl lg:max-w-5xl mx-auto pt-4 lg:pt-8 relative z-10">
        
        {/* Title */}
        <div className="px-4 mb-4">
          <h1 className="text-[20px] font-bold text-[#192168]">My Orders</h1>
          <p className="text-[12px] font-medium text-surface-500 mt-1">Track, manage and view all your orders</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 overflow-x-auto px-4 pb-3 border-b border-surface-200 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 flex items-center gap-1.5 pb-2 border-b-2 font-bold text-[13px] transition-colors ${
                activeTab === tab 
                  ? 'border-[#1668F6] text-[#1668F6]' 
                  : 'border-transparent text-surface-500 hover:text-[#192168]'
              } ${tab === 'Reserve' && activeTab !== 'Reserve' ? 'text-purple-600' : ''}
                ${tab === 'Pickup' && activeTab !== 'Pickup' ? 'text-green-600' : ''}
              `}
            >
              {tab === 'Reserve' && <Calendar className="w-4 h-4" />}
              {tab === 'Pickup' && <ShoppingBag className="w-4 h-4" />}
              {tab === 'Reserve' || tab === 'Pickup' ? (
                 <span className={`px-2 py-1 rounded-md border ${
                   tab === 'Reserve' ? 'border-purple-200' : 'border-green-200'
                 }`}>{tab}</span>
              ) : tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm">Loading order history...</span>
          </div>
        ) : (
          <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((order) => {
               const isReserve = order.type === 'reserve';
               const isPickup = order.type === 'pickup';
               
               let statusColor = 'text-[#06B95F]';
               let StatusIcon = CheckCircle2;
               
               if (order.status === 'To Be Delivered') {
                 statusColor = 'text-[#F59E0B]';
                 StatusIcon = Truck;
               } else if (order.status === 'Cancelled') {
                 statusColor = 'text-[#EF4444]';
                 StatusIcon = XCircle;
               } else if (isReserve) {
                 statusColor = 'text-[#8b5cf6]';
                 StatusIcon = Calendar;
               } else if (isPickup) {
                 statusColor = 'text-[#22c55e]';
                 StatusIcon = ShoppingBag;
               }

               let borderColor = 'border-surface-200';
               let bgClass = 'bg-white';
               if (isReserve) {
                  borderColor = 'border-purple-200';
                  bgClass = 'bg-purple-50/30';
               }
               if (isPickup) {
                  borderColor = 'border-green-200';
                  bgClass = 'bg-green-50/30';
               }

               return (
                <div key={order.id} className={`rounded-2xl border ${borderColor} ${bgClass} p-4 shadow-sm`}>
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`text-[12px] font-extrabold ${isReserve ? 'text-purple-700' : isPickup ? 'text-green-700' : 'text-[#192168]'}`}>
                        {isReserve ? 'Reserve ' : isPickup ? 'Pickup ' : ''}Order ID: {order.id}
                      </h4>
                      <p className="text-[10px] font-medium text-surface-500 mt-1">{order.date}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-[11px] font-bold ${statusColor}`}>
                      {order.status} <StatusIcon className="w-3.5 h-3.5" /> <ChevronRight className="w-3.5 h-3.5 text-surface-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex gap-3 mt-4">
                    <div className="w-[60px] h-[70px] rounded-lg overflow-hidden bg-surface-100 flex-shrink-0 border border-surface-200">
                      <img src={order.image} alt={order.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[13px] font-extrabold text-[#192168] line-clamp-2">{order.productName}</h3>
                      <p className="text-[10px] font-medium text-surface-500 mt-1">{order.variants}</p>
                      {isReserve && order.reserveTill && (
                        <p className="text-[10px] font-extrabold text-purple-600 mt-0.5">Reserve Till: {order.reserveTill}</p>
                      )}
                      {isPickup && (
                        <p className="text-[10px] font-extrabold text-green-600 mt-0.5">Ready for Pickup</p>
                      )}
                      <p className="text-[13px] font-extrabold text-[#192168] mt-1.5">₹{order.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="h-px bg-surface-200 my-3" />

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#192168]">
                      Total Amount: <span className="font-extrabold">₹{order.total.toLocaleString('en-IN')}</span>
                    </span>
                    <Link href={`/account/orders/${order.id.replace('#', '')}`} className={`px-4 py-1.5 rounded-lg border text-[11px] font-bold ${
                      isReserve ? 'border-purple-300 text-purple-600 hover:bg-purple-50 transition-colors' : 
                      isPickup ? 'border-green-300 text-green-600 hover:bg-green-50 transition-colors' : 
                      'border-[#1668F6] text-[#1668F6] hover:bg-blue-50 transition-colors'
                    }`}>
                      {isReserve || isPickup ? 'View Details' : 'Order Details'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
