'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, Truck, XCircle, Calendar, ShoppingBag, 
  ChevronRight, Loader2, MapPin, Heart, Ticket, Store, 
  MessageSquare, HeadphonesIcon, Shield, FileText, LogOut, 
  User, Bell, ShoppingBasket, Share2, ArrowLeft
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { useAuthStore } from '@/stores/auth.store';
import { ordersApi } from '@/lib/api/orders';
import { AccountSidebar } from '@/components/account/AccountSidebar';

const tabs = [
  'All Orders',
  'To Be Delivered',
  'Delivered',
  'Returns',
  'Cancelled',
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
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const [activeTab, setActiveTab] = useState('All Orders');
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formData = {
    fullName: user?.fullName || 'Guest User',
    mobileNumber: user?.phone ? `+91 ${user.phone}` : '+91 91234 56789',
    email: user?.email || 'harishkumar@gmail.com',
  };

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // const liveOrders = await ordersApi.getMyOrders();
        // Using mock data to match the screenshot precisely for demo purposes
        const liveOrders: DisplayOrder[] = [
          {
            id: '#VZT123456789', type: 'regular', status: 'Delivered', date: '08 May 2024, 10:30 AM',
            productName: 'Men Graphic Print T-shirt', variants: 'Olive Green • Size: L • Qty: 1', price: 399, total: 399, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=200&h=200'
          },
          {
            id: '#VZT123456788', type: 'regular', status: 'To Be Delivered', date: '05 May 2024, 09:15 PM',
            productName: 'Men Striped Round Neck T-shirt', variants: 'White/Navy • Size: M • Qty: 1', price: 449, total: 449, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200&h=200'
          },
          {
            id: '#VZT123456787', type: 'regular', status: 'Delivered', date: '02 May 2024, 06:40 PM',
            productName: 'Men Oversized T-shirt', variants: 'Black • Size: XL • Qty: 1', price: 499, total: 499, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=200&h=200'
          },
          {
            id: '#VZT123456786', type: 'regular', status: 'Cancelled', date: '28 Apr 2024, 11:20 AM',
            productName: 'Men Cotton Plain T-shirt', variants: 'Mauve • Size: M • Qty: 1', price: 329, total: 329, image: 'https://images.unsplash.com/photo-1618517351616-38fb9c52e0c6?auto=format&fit=crop&q=80&w=200&h=200'
          },
          {
            id: '#VZT123456785', type: 'regular', status: 'Delivered', date: '25 Apr 2024, 08:10 PM',
            productName: 'Men Polo T-shirt', variants: 'Navy Blue • Size: L • Qty: 1', price: 349, total: 349, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=200&h=200'
          },
          {
            id: '#VZR123456782', type: 'reserve', status: 'Reserved', date: '26 Apr 2024, 04:30 PM',
            productName: 'Men White Sneakers', variants: 'White • Size: 9 • Qty: 1', price: 1299, total: 1299, reserveTill: '30 Apr 2024, 08:00 PM', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=200&h=200'
          },
          {
            id: '#VZP123456781', type: 'pickup', status: 'Ready for Pickup', date: '24 Apr 2024, 02:20 PM',
            productName: 'Laptop Backpack', variants: 'Black • Qty: 1', price: 899, total: 899, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=200&h=200'
          }
        ];
        
        if (isMounted) {
          setOrders(liveOrders);
        }
      } catch (err) {
        console.warn('Could not load user orders:', err);
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchOrders();
    return () => { isMounted = false; };
  }, []);

  const getCount = (tab: string) => {
    if (tab === 'All Orders') return orders.length;
    return orders.filter((o) => o.status === tab).length;
  };

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
          
          {/* Header - Transparent on Mobile, Standard on Desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:border-b lg:border-surface-100 pb-4 px-4 lg:px-0 pt-6 lg:pt-0 bg-white lg:bg-transparent shadow-sm lg:shadow-none">
            <div className="flex items-center gap-3">
              <Link href="/account" className="shrink-0 lg:hidden">
                <ArrowLeft className="w-6 h-6 text-[#192168]" />
              </Link>
              <div>
                <h1 className="text-[24px] font-bold text-[#192168]">My Orders</h1>
                <p className="text-[13px] font-medium text-surface-600 mt-1">Track, manage and view all your orders</p>
              </div>
            </div>
            {/* Desktop Reserve/Pickup Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-purple-200 text-purple-600 text-[14px] font-bold rounded-lg hover:bg-purple-50 transition">
                <Calendar className="w-4 h-4" /> Reserve
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-emerald-200 text-emerald-600 text-[14px] font-bold rounded-lg hover:bg-emerald-50 transition">
                <ShoppingBag className="w-4 h-4" /> Pickup
              </button>
            </div>
          </div>

          {/* Tabs & Mobile Reserve/Pickup */}
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
              
              {/* Mobile Reserve & Pickup Buttons in Tab Row */}
              <div className="flex lg:hidden items-center gap-2 pb-3 ml-2">
                <Link href="/account/orders/reserve" className="flex items-center gap-1.5 px-3 py-1.5 border border-purple-200 rounded-md text-purple-600 text-[12px] font-bold bg-white">
                  <Calendar className="w-3.5 h-3.5" /> Reserve
                </Link>
                <Link href="/account/orders/pickup" className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-200 rounded-md text-emerald-600 text-[12px] font-bold bg-white">
                  <ShoppingBag className="w-3.5 h-3.5" /> Pickup
                </Link>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="flex-1 mt-4 px-4 lg:px-0">
            {isLoading ? (
              <div className="py-16 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#1668F6]" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-16 text-center">
                <h3 className="text-base font-bold text-slate-800">No orders found</h3>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredOrders.map((order) => {
                  const isReserve = order.type === 'reserve';
                  const isPickup = order.type === 'pickup';
                  
                  let statusColor = 'text-emerald-600';
                  let StatusIcon = CheckCircle2;

                  if (order.status === 'To Be Delivered') {
                    statusColor = 'text-orange-500';
                    StatusIcon = Truck;
                  } else if (order.status === 'Cancelled') {
                    statusColor = 'text-rose-500';
                    StatusIcon = XCircle;
                  } else if (isReserve) {
                    statusColor = 'text-purple-600';
                    StatusIcon = Calendar;
                  } else if (isPickup) {
                    statusColor = 'text-emerald-600';
                    StatusIcon = ShoppingBag;
                  }

                  let bgClass = 'bg-white';
                  let borderClass = 'border-surface-200 border-b-4';
                  let headerColor = 'text-[#192168]';
                  if (isReserve) {
                    bgClass = 'bg-purple-50/30';
                    borderClass = 'border-purple-200';
                    headerColor = 'text-purple-700';
                  } else if (isPickup) {
                    bgClass = 'bg-emerald-50/30';
                    borderClass = 'border-emerald-200';
                    headerColor = 'text-emerald-700';
                  }

                  return (
                    <div key={order.id} className={`w-full border ${borderClass} rounded-2xl p-4 ${bgClass}`}>
                      
                      {/* Header */}
                      <div className="flex items-start justify-between border-b border-surface-100 pb-3 mb-3">
                        <div>
                          <h4 className={`text-[12px] font-bold ${headerColor}`}>
                            {isReserve ? 'Reserve ' : isPickup ? 'Pickup ' : ''}Order ID: {order.id}
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
                            <button className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                              <Share2 className="w-3.5 h-3.5 text-[#1668F6]" />
                            </button>
                          </div>
                          <p className="text-[11px] font-medium text-surface-500 mt-0.5">
                            {order.variants}
                          </p>
                          {isReserve && order.reserveTill && (
                            <p className="text-[11px] font-bold text-purple-600 mt-0.5">
                              Reserve Till: {order.reserveTill}
                            </p>
                          )}
                          {isPickup && (
                            <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
                              Ready for Pickup
                            </p>
                          )}
                          <p className="text-[14px] font-bold text-[#192168] mt-1.5">
                            ₹{order.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-1">
                        <div className="text-[12px] font-medium text-surface-600">
                          Total Amount: <span className="font-bold text-[#192168]">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                        <Link 
                          href={`/account/orders/${order.id.replace('#', '')}`}
                          className={`px-4 py-1.5 rounded-md border text-[12px] font-bold transition-colors block text-center ${
                          isReserve ? 'border-purple-300 text-purple-600 hover:bg-purple-50' : 
                          isPickup ? 'border-emerald-300 text-emerald-600 hover:bg-emerald-50' : 
                          'border-[#1668F6] text-[#1668F6] hover:bg-blue-50'
                        }`}>
                          {isReserve || isPickup ? 'View Details' : 'Order Details'}
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

