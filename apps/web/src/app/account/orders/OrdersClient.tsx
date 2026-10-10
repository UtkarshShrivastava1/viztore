'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, CheckCircle2, Truck, XCircle, ChevronRight, Loader2, ArrowLeft 
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { ordersApi } from '@/lib/api/orders.js';
import type { IOrder } from '@repo/shared-types';
import { OrderStatus } from '@repo/shared-types';

const tabs = ['All Orders', 'Delivered', 'To Be Delivered', 'Cancelled', 'Returns'];

interface DisplayOrder {
  id: string;
  rawId: string;
  type: 'regular' | 'reserve' | 'pickup';
  status: 'Delivered' | 'To Be Delivered' | 'Cancelled' | 'Returns' | 'Reserved' | 'Ready for Pickup';
  date: string;
  productName: string;
  variants: string;
  price: number;
  total: number;
  image: string;
  reserveTill?: string;
}

export function OrdersClient() {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const [activeTab, setActiveTab] = useState('All Orders');
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mapBackendOrder = (order: IOrder): DisplayOrder => {
    let displayStatus: DisplayOrder['status'] = 'To Be Delivered';
    if (order.status === OrderStatus.DELIVERED) {
      displayStatus = 'Delivered';
    } else if (order.status === OrderStatus.CANCELLED) {
      displayStatus = 'Cancelled';
    }

    const firstItem = order.items?.[0];
    const totalItems = order.items?.reduce((acc, curr) => acc + (curr.quantity || 1), 0) || 1;
    const additionalCount = order.items?.length > 1 ? ` (+${order.items.length - 1} other item${order.items.length > 2 ? 's' : ''})` : '';

    const formattedDate = order.createdAt 
      ? new Date(order.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Recent Order';

    return {
      id: `#${order.orderNumber || (order._id || order.id || '').slice(-6).toUpperCase()}`,
      rawId: order._id || order.id || order.orderNumber,
      type: 'regular',
      status: displayStatus,
      date: formattedDate,
      productName: firstItem ? `${firstItem.name}${additionalCount}` : 'Marketplace Item',
      variants: firstItem ? `Qty: ${firstItem.quantity} • Unit: ₹${firstItem.unitPrice}` : `Total items: ${totalItems}`,
      price: firstItem ? firstItem.unitPrice * firstItem.quantity : order.grandTotal,
      total: order.grandTotal,
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=200&h=200',
    };
  };

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        if (isAuthenticated) {
          const apiOrders = await ordersApi.getMyOrders();
          if (Array.isArray(apiOrders)) {
            if (isMounted) setOrders(apiOrders.map(mapBackendOrder));
            return;
          }
        }
        if (isMounted) setOrders([]);
      } catch (err) {
        console.warn('Could not load user orders from live API:', err);
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchOrders();
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'All Orders') return true;
    if (activeTab === 'Delivered') return order.status === 'Delivered';
    if (activeTab === 'Cancelled') return order.status === 'Cancelled';
    if (activeTab === 'To Be Delivered') return order.status === 'To Be Delivered';
    if (activeTab === 'Returns') return order.status === 'Returns';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] relative font-sans">
      <main className="max-w-[1680px] mx-auto pb-28 lg:pb-6 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ================= DESKTOP LEFT SIDEBAR ================= */}
        <AccountSidebar />

        {/* ================= RIGHT MAIN CONTENT (Responsive) ================= */}
        <div className="flex-1 w-full lg:mt-6 bg-transparent lg:bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-surface-200/60 lg:p-6 flex flex-col min-h-screen">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:border-b lg:border-surface-100 pb-4 px-4 lg:px-0 pt-6 lg:pt-0 bg-white lg:bg-transparent shadow-sm lg:shadow-none">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="lg:hidden">
                <ArrowLeft className="w-6 h-6 text-[#192168]" />
              </button>
              <div>
                <h1 className="text-[24px] font-bold text-[#192168]">My Orders</h1>
                <p className="text-[13px] font-medium text-surface-600 mt-1">Track, manage and view all your purchases</p>
              </div>
            </div>
            {/* Desktop Reserve/Pickup Links */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/products" className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-200 text-blue-600 text-[14px] font-bold rounded-lg hover:bg-blue-50 transition">
                <ShoppingBag className="w-4 h-4" /> Explore Catalog
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center overflow-x-auto border-b border-surface-200 bg-white lg:bg-transparent hide-scrollbar px-4 lg:px-0">
            <div className="flex gap-6 lg:gap-8 pt-4 pb-0 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 font-semibold text-[13px] pb-3 transition-colors relative whitespace-nowrap ${
                    activeTab === tab ? 'text-[#1668F6]' : 'text-surface-500 hover:text-[#192168]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1668F6] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="flex-1 mt-4 px-4 lg:px-0">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-surface-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#1668F6]" />
                <p className="text-sm font-medium">Fetching your order history...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-20 border border-dashed border-[#E5E7EB] bg-white rounded-2xl text-center flex flex-col items-center justify-center p-6 my-2">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#1668F6]" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">No Orders in "{activeTab}"</h3>
                <p className="text-xs text-surface-500 max-w-sm mb-6">
                  {isAuthenticated 
                    ? "You don't have any orders under this filter. Browse your local stores and place an order to track it live."
                    : "Please sign in to view your orders and track live deliveries."}
                </p>
                {isAuthenticated ? (
                  <Link 
                    href="/products" 
                    className="px-6 py-2.5 bg-[#1668F6] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 transition"
                  >
                    Start Shopping
                  </Link>
                ) : (
                  <button 
                    onClick={() => openAuthModal('login')}
                    className="px-6 py-2.5 bg-[#1668F6] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 transition"
                  >
                    Sign In to View Orders
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredOrders.map((order) => {
                  let statusColor = 'text-emerald-600';
                  let StatusIcon = CheckCircle2;

                  if (order.status === 'To Be Delivered') {
                    statusColor = 'text-orange-500';
                    StatusIcon = Truck;
                  } else if (order.status === 'Cancelled') {
                    statusColor = 'text-rose-500';
                    StatusIcon = XCircle;
                  }

                  return (
                    <div key={order.rawId} className="w-full border border-surface-200 border-b-4 rounded-2xl p-4 bg-white hover:shadow-sm transition-all">
                      
                      {/* Header */}
                      <div className="flex items-start justify-between border-b border-surface-100 pb-3 mb-3">
                        <div>
                          <h4 className="text-[12px] font-bold text-[#192168]">
                            Order ID: {order.id}
                          </h4>
                          <p className="text-[10px] font-semibold text-surface-500 mt-0.5">{order.date}</p>
                        </div>
                        <div className={`flex items-center gap-1 text-[11px] font-bold ${statusColor}`}>
                          {order.status} <StatusIcon className="w-4 h-4 ml-0.5" />
                          <ChevronRight className="w-3.5 h-3.5 text-surface-400" />
                        </div>
                      </div>

                      {/* Product Content */}
                      <div className="flex gap-3">
                        <div className="w-[72px] h-[72px] bg-surface-50 rounded-lg shrink-0 overflow-hidden border border-surface-100 flex items-center justify-center">
                          <img src={order.image} alt={order.productName} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h3 className="text-[13px] font-bold text-[#192168] line-clamp-1 pr-2">{order.productName}</h3>
                          </div>
                          <p className="text-[11px] font-medium text-surface-500 mt-0.5">
                            {order.variants}
                          </p>
                          <p className="text-[14px] font-bold text-[#192168] mt-1.5">
                            ₹{order.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-1 border-t border-surface-100/60">
                        <div className="text-[12px] font-medium text-surface-600">
                          Total Amount: <span className="font-bold text-[#192168]">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                        <Link 
                          href={`/account/orders/${order.rawId}`}
                          className="px-4 py-1.5 rounded-md border border-[#1668F6] text-[#1668F6] text-[12px] font-bold hover:bg-blue-50 transition-colors block text-center"
                        >
                          Order Details
                        </Link>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
