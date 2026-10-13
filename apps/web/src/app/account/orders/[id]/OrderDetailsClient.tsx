'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, ChevronRight, Share2, Download, ShoppingBasket, 
  Shield, CheckCircle2, MapPin, Store, HeadphonesIcon, MessageSquare, Loader2
} from 'lucide-react';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { OrderInvoiceModal } from '@/components/orders/OrderInvoiceModal';
import { ordersApi } from '@/lib/api/orders.js';
import type { IOrder, IOrderItem } from '@repo/shared-types';

interface OrderDetailsClientProps {
  id: string;
}

export function OrderDetailsClient({ id }: OrderDetailsClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadOrder = async () => {
      try {
        setLoading(true);
        if (id) {
          const res = await ordersApi.getOrderById(id);
          if (res && isMounted) {
            setOrder(res);
          }
        }
      } catch (err) {
        console.warn('Failed to load order from live API:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadOrder();
    return () => { isMounted = false; };
  }, [id]);

  const currentStatus = order?.status ? String(order.status).toUpperCase() : 'CONFIRMED';
  const displayId = order?.orderNumber ? `#${order.orderNumber}` : (id ? `#${id.slice(-6).toUpperCase()}` : '#ORD-98214');

  // Derive status progression from real order status
  const isConfirmed = ['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus);
  const isPacked = ['PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus);
  const isOutForDelivery = ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus);
  const isDelivered = currentStatus === 'DELIVERED';

  const orderDate = order?.createdAt 
    ? new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Recent Order';

  const address = order?.shippingAddress;

  const totalAmount = order?.grandTotal ?? 0;
  const subtotal = order?.subtotal ?? (order?.items?.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) || 0);
  const deliveryFee = order?.shippingFee ?? 0;

  const otpDigits = order?.deliveryOtp ? order.deliveryOtp.split('') : ['4', '8', '2', '1'];
  const items: IOrderItem[] = order?.items && order.items.length > 0 
    ? order.items 
    : [
        {
          productId: 'prd-default',
          name: 'Hyperlocal Store Items',
          quantity: 1,
          unitPrice: totalAmount || 499,
          storeId: order?.storeId || 'store-1',
          sku: 'SKU-001'
        }
      ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1668F6]" />
          <p className="text-xs font-semibold text-surface-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] relative font-sans">
      <main className="max-w-[1680px] mx-auto pb-28 lg:pb-6 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ================= DESKTOP LEFT SIDEBAR ================= */}
        <AccountSidebar />

        {/* ================= RIGHT MAIN CONTENT (Responsive) ================= */}
        <div className="flex-1 w-full lg:mt-6 bg-transparent lg:bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-surface-200/60 lg:p-6 flex flex-col min-h-screen">
          
          {/* Top Header */}
          <div className="px-4 lg:px-0 w-full flex items-center justify-between pt-2 pb-4 lg:border-b lg:border-surface-100 bg-white lg:bg-transparent lg:mb-4 shadow-sm lg:shadow-none">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="shrink-0 lg:hidden">
                <ArrowLeft className="w-6 h-6 text-[#192168]" />
              </button>
              <div>
                <div className="hidden lg:flex items-center gap-2 text-[12px] font-medium text-surface-500 mb-2">
                  <Link href="/account/orders" className="hover:text-[#1668F6] transition-colors text-[#1668F6]">My Orders</Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-[#192168] font-bold">Order Details</span>
                </div>
                <h1 className="text-[20px] lg:text-[24px] font-bold text-[#192168] leading-tight">Order Details</h1>
                <p className="text-[12px] lg:text-[13px] font-medium text-surface-500 mt-0.5">Track and manage your order</p>
              </div>
            </div>
            
            <button onClick={() => router.push('/account/orders')} className="hidden lg:flex items-center gap-1.5 px-4 py-2 border border-[#1668F6] text-[#1668F6] text-[13px] font-bold rounded-lg hover:bg-blue-50 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to My Orders
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 mt-4 lg:mt-2 lg:px-0">
            {/* Left Column */}
            <div className="flex-1 space-y-4 lg:space-y-6">
              
              {/* Product Card / Items List */}
              <div className="mx-4 lg:mx-0 bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-200/60">
                <div className="flex items-start justify-between pb-3 border-b border-surface-100">
                  <div>
                    <h3 className="text-[13px] lg:text-[14px] font-extrabold text-[#192168]">Order ID: {displayId}</h3>
                    <p className="text-[11px] lg:text-[12px] font-medium text-surface-500 mt-1">{orderDate}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-[12px] lg:text-[13px] font-bold ${isDelivered ? 'text-[#16A34A]' : 'text-[#1668F6]'}`}>
                    {currentStatus} {isDelivered && <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </div>
                </div>
                
                <div className="py-2 divide-y divide-surface-100/70">
                  {items.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="flex gap-4 py-3 first:pt-2 last:pb-1">
                      <div className="w-[72px] h-[72px] lg:w-[80px] lg:h-[80px] rounded-lg overflow-hidden bg-surface-50 flex-shrink-0 flex items-center justify-center border border-surface-100">
                        <img 
                          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=200&h=200" 
                          alt={item.name} 
                          className="w-full h-full object-cover mix-blend-multiply" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-[14px] lg:text-[15px] font-bold text-[#192168] line-clamp-1 pr-2">
                            {item.name}
                          </h4>
                          <button className="w-8 h-8 rounded-full bg-surface-50 flex items-center justify-center shrink-0">
                            <Share2 className="w-4 h-4 text-[#192168]" />
                          </button>
                        </div>
                        <p className="text-[12px] lg:text-[13px] font-medium text-surface-500 mt-0.5">
                          {item.sku ? `SKU: ${item.sku} • ` : ''}Quantity: {item.quantity}
                        </p>
                        <p className="text-[14px] lg:text-[15px] font-extrabold text-[#192168] mt-1">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 mt-2 border-t border-surface-100 border-dashed">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-surface-600">
                     <Store className="w-4 h-4 text-[#1668F6]" />
                     Fulfillment: <span className="font-bold text-[#192168]">Verified Local Store Partner</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowInvoiceModal(true)}
                      className="flex items-center justify-center gap-1.5 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg border border-[#1668F6] text-[#1668F6] text-[12px] lg:text-[13px] font-bold hover:bg-blue-50 transition-colors w-full sm:w-auto"
                    >
                      <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Download Bill
                    </button>
                    <Link 
                      href="/products"
                      className="flex items-center justify-center gap-1.5 px-4 lg:px-5 py-1.5 lg:py-2 rounded-lg border border-[#1668F6] text-[#1668F6] text-[12px] lg:text-[13px] font-bold hover:bg-blue-50 transition-colors w-full sm:w-auto"
                    >
                      <ShoppingBasket className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Buy Again
                    </Link>
                  </div>
                </div>
              </div>

              {/* Delivery OTP Box */}
              {!isDelivered && (
                <div className="mx-4 lg:mx-0 bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-200/60 flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#E8F0FE] rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-[#1668F6]" />
                      </div>
                      <h4 className="text-[13px] lg:text-[15px] font-bold text-[#192168]">Delivery Handshake OTP</h4>
                      <span className="text-[9px] lg:text-[10px] font-bold text-[#1668F6] bg-blue-50 px-2 py-0.5 rounded-full ml-1">Show to delivery partner</span>
                    </div>
                    <p className="text-[11px] lg:text-[13px] font-medium text-surface-500 mt-2 pr-2">
                      Share this 4-digit code with the rider upon package handoff to confirm delivery.
                    </p>
                  </div>
                  <div className="w-full sm:w-auto bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 lg:p-4 flex-shrink-0 text-center min-w-[200px] lg:min-w-[240px]">
                    <p className="text-[11px] lg:text-[12px] font-bold text-[#192168]">Secure OTP</p>
                    <div className="flex justify-center gap-2 mt-2 mb-2 lg:mt-3 lg:mb-3">
                      {otpDigits.map((d, i) => (
                        <span key={i} className="text-[24px] lg:text-[32px] font-extrabold text-[#1668F6] bg-white border border-[#E5E7EB] rounded-md px-2 lg:px-3 py-1 shadow-sm">{d}</span>
                      ))}
                    </div>
                    <p className="text-[10px] lg:text-[11px] font-bold text-red-500">Only disclose upon physical handoff</p>
                  </div>
                </div>
              )}

              {/* Order Tracking */}
              <div className="mx-4 lg:mx-0 bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-200/60">
                <h4 className="text-[13px] lg:text-[15px] font-bold text-[#192168] mb-5 lg:mb-6">Order Lifecycle Tracking</h4>
                
                <div className="relative pl-7 lg:pl-8 space-y-6 lg:space-y-8">
                  {/* Timeline line */}
                  <div className="absolute left-[7px] lg:left-[11px] top-1 bottom-1 w-0.5 bg-[#E5E7EB]" />
                  
                  <div className="relative">
                    <div className={`absolute -left-7 lg:-left-8 w-4 h-4 lg:w-5 lg:h-5 rounded-full border-[3px] border-white shadow-sm ${
                      isConfirmed ? 'bg-[#16A34A]' : 'bg-gray-300'
                    }`} />
                    <h5 className="text-[12px] lg:text-[14px] font-bold text-[#192168]">Order Confirmed</h5>
                    <p className="text-[11px] lg:text-[12px] font-medium text-surface-500 mt-0.5">{orderDate}</p>
                    <p className="text-[11px] lg:text-[12px] text-[#192168] mt-0.5">Order received and transmitted to store partner.</p>
                  </div>
                  
                  <div className="relative">
                    <div className={`absolute -left-7 lg:-left-8 w-4 h-4 lg:w-5 lg:h-5 rounded-full border-[3px] border-white shadow-sm ${
                      isPacked ? 'bg-[#16A34A]' : 'bg-gray-300'
                    }`} />
                    <h5 className="text-[12px] lg:text-[14px] font-bold text-[#192168]">Packed</h5>
                    <p className="text-[11px] lg:text-[12px] font-medium text-surface-500 mt-0.5">
                      {isPacked ? 'Completed' : 'Pending merchant preparation'}
                    </p>
                    <p className="text-[11px] lg:text-[12px] text-[#192168] mt-0.5">Items bagged and tagged for pickup.</p>
                  </div>
                  
                  <div className="relative">
                    <div className={`absolute -left-7 lg:-left-8 w-4 h-4 lg:w-5 lg:h-5 rounded-full border-[3px] border-white shadow-sm ${
                      isOutForDelivery ? 'bg-[#16A34A]' : 'bg-gray-300'
                    }`} />
                    <h5 className="text-[12px] lg:text-[14px] font-bold text-[#192168]">Out for Delivery</h5>
                    <p className="text-[11px] lg:text-[12px] font-medium text-surface-500 mt-0.5">
                      {isOutForDelivery ? 'In transit with rider' : 'Pending rider pickup'}
                    </p>
                    <p className="text-[11px] lg:text-[12px] text-[#192168] mt-0.5">Delivery partner dispatched for last-mile handoff.</p>
                  </div>
                  
                  <div className="relative">
                    <div className={`absolute -left-7 lg:-left-8 w-4 h-4 lg:w-5 lg:h-5 rounded-full border-[3px] border-white shadow-sm ${
                      isDelivered ? 'bg-[#16A34A]' : 'bg-gray-300'
                    }`} />
                    <h5 className={`text-[12px] lg:text-[14px] font-bold ${isDelivered ? 'text-[#16A34A]' : 'text-gray-500'}`}>
                      Delivered
                    </h5>
                    <p className={`text-[11px] lg:text-[12px] font-medium mt-0.5 ${isDelivered ? 'text-[#16A34A]' : 'text-surface-500'}`}>
                      {isDelivered ? 'Handoff verified via OTP' : 'Awaiting delivery completion'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="w-full lg:w-[320px] flex flex-col gap-4">
              
              {/* Delivery Address */}
              <div className="mx-4 lg:mx-0 bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-200/60 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#E8F0FE] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-[#1668F6]" />
                    </div>
                    <h4 className="text-[13px] lg:text-[14px] font-bold text-[#192168]">Delivery Destination</h4>
                  </div>
                </div>
                {address ? (
                  <div className="pt-2">
                    <h5 className="text-[13px] font-bold text-[#192168] mb-1">{address.fullName}</h5>
                    <p className="text-[12px] lg:text-[13px] font-medium text-surface-500 leading-relaxed">
                      {address.street}<br/>
                      {address.city}, {address.state} - {address.postalCode}
                    </p>
                    <p className="text-[12px] lg:text-[13px] font-medium text-surface-500 mt-2">Phone: +{address.phone}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-2">No delivery address attached to this order.</p>
                )}
              </div>

              {/* Payment Summary */}
              <div className="mx-4 lg:mx-0 bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-200/60">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-[#E8F0FE] rounded flex items-center justify-center border border-blue-100">
                    <svg className="w-4 h-4 text-[#1668F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                  </div>
                  <h4 className="text-[13px] lg:text-[14px] font-bold text-[#192168]">Payment Summary</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] lg:text-[13px] font-medium text-surface-500">Payment Status</span>
                    <span className="text-[12px] lg:text-[13px] font-bold text-[#192168]">Verified</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[12px] lg:text-[13px] font-medium text-surface-500">Subtotal</span>
                    <span className="text-[12px] lg:text-[13px] font-bold text-[#192168]">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] lg:text-[13px] font-medium text-surface-500">Delivery Fee</span>
                    <span className="text-[12px] lg:text-[13px] font-bold text-[#16A34A]">
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-surface-100">
                    <span className="text-[14px] lg:text-[15px] font-bold text-[#192168]">Total Paid</span>
                    <span className="text-[16px] lg:text-[20px] font-extrabold text-[#192168]">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mx-4 lg:mx-0 space-y-3 lg:space-y-4 mb-6">
                <Link 
                  href="/account/support"
                  className="w-full bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-200/60 flex items-center justify-between text-left hover:bg-surface-50 transition block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100">
                      <HeadphonesIcon className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500" />
                    </div>
                    <div>
                      <span className="text-[14px] lg:text-[15px] font-bold text-[#192168] block">Need Assistance?</span>
                      <span className="text-[11px] lg:text-[12px] font-medium text-surface-500">Contact customer support</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#192168]" />
                </Link>

                <Link 
                  href="/account/feedback"
                  className="w-full bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-200/60 flex items-center justify-between text-left hover:bg-surface-50 transition block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                      <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
                    </div>
                    <div>
                      <span className="text-[14px] lg:text-[15px] font-bold text-[#192168] block">Store Feedback</span>
                      <span className="text-[11px] lg:text-[12px] font-medium text-surface-500">Rate your order experience</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#192168]" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Full Tax Invoice Modal */}
      <OrderInvoiceModal 
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        orderId={order?.id || order?._id || id}
      />
    </div>
  );
}
