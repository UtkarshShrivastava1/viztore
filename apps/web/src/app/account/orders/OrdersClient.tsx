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
  'Pickup',
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

export function OrdersClient() {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const liveOrders = await ordersApi.getMyOrders();
        if (isMounted && Array.isArray(liveOrders)) {
          const mapped: DisplayOrder[] = liveOrders.map((o: IOrder) => {
            const firstItem = o.items[0];
            return {
              id: `#${o.orderNumber || o.id || (o as any)._id}`,
              type: 'regular',
              status:
                o.status === 'DELIVERED'
                  ? 'Delivered'
                  : o.status === 'CANCELLED'
                  ? 'Cancelled'
                  : 'To Be Delivered',
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
              image:
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200&h=200',
            };
          });
          setOrders(mapped);
        }
      } catch (err) {
        console.warn('Could not load user orders:', err);
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
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
          <p className="text-[12px] font-medium text-surface-500 mt-1">
            Track, manage and view all your orders
          </p>
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
                <span
                  className={`px-2 py-1 rounded-md border ${
                    tab === 'Reserve' ? 'border-purple-200' : 'border-green-200'
                  }`}
                >
                  {tab}
                </span>
              ) : (
                tab
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm">Loading order history...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center px-4">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No orders found</h3>
            <p className="text-xs text-slate-500 mt-1">
              You do not have any {activeTab === 'All Orders' ? '' : activeTab.toLowerCase()} orders yet.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
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
                <div
                  key={order.id}
                  className={`rounded-2xl border ${borderColor} ${bgClass} p-4 shadow-sm`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4
                        className={`text-[12px] font-extrabold ${
                          isReserve
                            ? 'text-purple-700'
                            : isPickup
                            ? 'text-green-700'
                            : 'text-[#192168]'
                        }`}
                      >
                        {isReserve ? 'Reserve ' : isPickup ? 'Pickup ' : ''}Order ID: {order.id}
                      </h4>
                      <p className="text-[10px] font-medium text-surface-500 mt-1">{order.date}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-[11px] font-bold ${statusColor}`}>
                      {order.status} <StatusIcon className="w-3.5 h-3.5" />{' '}
                      <ChevronRight className="w-3.5 h-3.5 text-surface-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex gap-3 mt-4">
                    <div className="w-[60px] h-[70px] rounded-lg overflow-hidden bg-surface-100 flex-shrink-0 border border-surface-200">
                      <img
                        src={order.image}
                        alt={order.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[13px] font-extrabold text-[#192168] line-clamp-2">
                        {order.productName}
                      </h3>
                      <p className="text-[10px] font-medium text-surface-500 mt-1">
                        {order.variants}
                      </p>
                      {isReserve && order.reserveTill && (
                        <p className="text-[10px] font-extrabold text-purple-600 mt-0.5">
                          Reserve Till: {order.reserveTill}
                        </p>
                      )}
                      {isPickup && (
                        <p className="text-[10px] font-extrabold text-green-600 mt-0.5">
                          Ready for Pickup
                        </p>
                      )}
                      <p className="text-[13px] font-extrabold text-[#192168] mt-1.5">
                        ₹{order.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-surface-200 my-3" />

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#192168]">
                      Total Amount:{' '}
                      <span className="font-extrabold">₹{order.total.toLocaleString('en-IN')}</span>
                    </span>
                    <Link
                      href={`/account/orders/${order.id.replace('#', '')}`}
                      className={`px-4 py-1.5 rounded-lg border text-[11px] font-bold ${
                        isReserve
                          ? 'border-purple-300 text-purple-600 hover:bg-purple-50 transition-colors'
                          : isPickup
                          ? 'border-green-300 text-green-600 hover:bg-green-50 transition-colors'
                          : 'border-[#1668F6] text-[#1668F6] hover:bg-blue-50 transition-colors'
                      }`}
                    >
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
