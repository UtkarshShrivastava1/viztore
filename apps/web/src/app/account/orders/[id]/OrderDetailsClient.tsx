'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CheckCircle2, 
  MapPin, 
  Download,
  Shield,
  MessageSquare,
  HeadphonesIcon,
  ChevronRight,
  Clock,
  Package,
  Truck,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { ordersApi } from '@/lib/api/orders';
import { OrderInvoiceModal } from '@/components/orders/OrderInvoiceModal';
import type { IOrder } from '@repo/shared-types';

export function OrderDetailsClient({ id }: { id: string }) {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await ordersApi.getOrderById(id);
        if (mounted && data) {
          setOrder(data);
        }
      } catch (err) {
        console.warn('Could not fetch live order from API, using fallback:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchOrder();
    return () => {
      mounted = false;
    };
  }, [id]);

  const displayId = order?.orderNumber || (id.startsWith('ORD') ? `#${id}` : `#ORD-${id}`);
  const otpDigits = (order?.deliveryOtp || '7382').split('');

  // Status progression checks
  const currentStatus = order?.status || 'CONFIRMED';
  const isConfirmed = ['CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus);
  const isPacked = ['PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus);
  const isOutForDelivery = ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus);
  const isDelivered = currentStatus === 'DELIVERED';

  const orderDate = order?.createdAt 
    ? new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Today, Just now';

  const address = order?.shippingAddress || {
    fullName: 'Customer Account',
    phone: '9876543210',
    street: '12-B, Sea Breeze Apts, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    country: 'IN',
  };

  const totalAmount = order?.grandTotal ?? 399;
  const subtotal = order?.subtotal ?? 399;
  const deliveryFee = order?.shippingFee ?? 0;

  return (
    <div className="min-h-screen bg-[#f4f5f9] pb-24">
      <main className="max-w-md lg:max-w-5xl mx-auto pt-4 relative z-10 flex flex-col gap-4 lg:gap-6 px-0 lg:px-4">
        {/* Title */}
        <div className="px-4 lg:px-0 w-full flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#192168]">Order Details</h1>
            <p className="text-[12px] font-medium text-surface-500 mt-0.5">Track and manage your order</p>
          </div>
          {loading && (
            <div className="flex items-center gap-1.5 text-xs text-[#1668F6] font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Syncing live status...
            </div>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Delivery Status Banner */}
            <div className={`mx-4 lg:mx-0 rounded-xl p-3 flex items-center gap-2 border ${
              isDelivered 
                ? 'bg-[#ecfdf3] border-green-200 text-green-700' 
                : 'bg-blue-50 border-blue-200 text-[#1668F6]'
            }`}>
              {isDelivered ? (
                <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-[#1668F6] shrink-0" />
              )}
              <span className="text-[11px] font-bold">
                {isDelivered ? `Delivered successfully` : `Order in progress — Status: ${currentStatus}`}
              </span>
            </div>

            {/* Order Item Details */}
            <div className="mx-4 lg:mx-0 bg-white rounded-2xl p-4 shadow-sm border border-surface-200/50">
              <div className="flex items-center justify-between pb-3 border-b border-surface-100">
                <div>
                  <h3 className="text-[12px] font-extrabold text-[#192168]">Order ID: {displayId}</h3>
                  <p className="text-[10px] font-medium text-surface-500 mt-1">{orderDate}</p>
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-bold ${isDelivered ? 'text-[#06B95F]' : 'text-[#1668F6]'}`}>
                  {currentStatus} {isDelivered && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
              
              <div className="divide-y divide-surface-100 py-1">
                {order?.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 py-3">
                      <div className="w-[60px] h-[70px] rounded-lg overflow-hidden bg-surface-100 flex-shrink-0 flex items-center justify-center">
                        <Package className="w-6 h-6 text-surface-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-extrabold text-[#192168]">{item.name}</h4>
                        <p className="text-[10px] font-medium text-surface-500 mt-1">
                          SKU: {item.sku || 'SKU-DEFAULT'} • Qty: {item.quantity}
                        </p>
                        <p className="text-[13px] font-extrabold text-[#192168] mt-1.5">
                          ₹{item.unitPrice * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-4 py-4">
                    <div className="w-[60px] h-[70px] rounded-lg overflow-hidden bg-surface-100 flex-shrink-0">
                      <Image 
                        src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200&h=200" 
                        alt="Product"
                        width={60}
                        height={70}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[13px] font-extrabold text-[#192168]">Men Graphic Print T-shirt</h4>
                      <p className="text-[10px] font-medium text-surface-500 mt-1">Olive Green • Size: L • Qty: 1</p>
                      <p className="text-[13px] font-extrabold text-[#192168] mt-1.5">₹399</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                <span className="text-[12px] text-[#192168]">
                  Total Amount: <span className="font-extrabold">₹{totalAmount}</span>
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowInvoiceModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#1668F6] text-[#1668F6] text-[10px] font-bold hover:bg-blue-50 transition-colors"
                  >
                    <Download className="w-3 h-3" /> Download Bill
                  </button>
                  <Link 
                    href="/"
                    className="px-3 py-1.5 rounded-lg border border-[#1668F6] text-[#1668F6] text-[10px] font-bold hover:bg-blue-50 transition-colors inline-block"
                  >
                    Buy Again
                  </Link>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mx-4 lg:mx-0 bg-white rounded-2xl p-4 shadow-sm border border-surface-200/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[12px] font-bold text-[#192168]">Delivery Address</h4>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Standard Delivery</span>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#E8F0FE] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#1668F6]" />
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-[#192168]">{address.fullName}</h5>
                  <p className="text-[10px] font-medium text-surface-500 mt-0.5">
                    {address.street}<br/>
                    {address.city}, {address.state} - {address.postalCode}
                  </p>
                  <p className="text-[10px] font-medium text-surface-500 mt-1">Phone: +91 {address.phone}</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mx-4 lg:mx-0 space-y-2 mb-4">
              <div className="w-full bg-white rounded-xl p-3 shadow-sm border border-surface-200/50 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-[#192168] block">Feedback</span>
                    <span className="text-[10px] font-medium text-surface-500">Share your experience and help us improve</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-surface-400" />
              </div>
              
              <div className="w-full bg-white rounded-xl p-3 shadow-sm border border-surface-200/50 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                    <HeadphonesIcon className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-[#192168] block">Need Help?</span>
                    <span className="text-[10px] font-medium text-surface-500">Contact {branding.supportEmail}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-surface-400" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[350px] flex flex-col gap-4 shrink-0">
            {/* Delivery OTP */}
            <div className="mx-4 lg:mx-0 bg-white rounded-2xl p-4 shadow-sm border border-surface-200/50 flex gap-4 items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#E8F0FE] rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3.5 h-3.5 text-[#1668F6]" />
                  </div>
                  <h4 className="text-[12px] font-bold text-[#192168]">Delivery OTP</h4>
                </div>
                <p className="text-[10px] font-medium text-surface-500 mt-2 leading-relaxed">
                  Share this 4-digit OTP with the delivery partner upon arrival to confirm receipt.
                </p>
              </div>
              <div className="bg-[#fef9f9] border border-rose-100 rounded-xl p-2.5 flex-shrink-0 text-center min-w-[110px]">
                <p className="text-[9px] font-bold text-[#192168]">Your Delivery OTP</p>
                <div className="flex gap-1.5 justify-center mt-1.5 mb-1">
                  {otpDigits.map((d, i) => (
                    <span key={i} className="text-[18px] font-extrabold text-[#1668F6]">{d}</span>
                  ))}
                </div>
                <p className="text-[7.5px] font-bold text-rose-500 italic">4-digit security code</p>
              </div>
            </div>

            {/* Order Tracking */}
            <div className="mx-4 lg:mx-0 bg-white rounded-2xl p-4 shadow-sm border border-surface-200/50">
              <h4 className="text-[12px] font-bold text-[#192168] mb-4">Order Tracking</h4>
              
              <div className="relative pl-6 space-y-5">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200" />
                
                <div className="relative">
                  <div className={`absolute -left-6 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                    isConfirmed ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <h5 className="text-[11px] font-bold text-[#192168]">Order Confirmed</h5>
                  <p className="text-[10px] font-medium text-surface-500 mt-0.5">Order accepted by store</p>
                </div>
                
                <div className="relative">
                  <div className={`absolute -left-6 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                    isPacked ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <h5 className="text-[11px] font-bold text-[#192168]">Packed & Ready</h5>
                  <p className="text-[10px] font-medium text-surface-500 mt-0.5">Items verified and packed</p>
                </div>
                
                <div className="relative">
                  <div className={`absolute -left-6 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                    isOutForDelivery ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <h5 className="text-[11px] font-bold text-[#192168]">Out for Delivery</h5>
                  <p className="text-[10px] font-medium text-surface-500 mt-0.5">Assigned to delivery rider</p>
                </div>
                
                <div className="relative">
                  <div className={`absolute -left-6 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                    isDelivered ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <h5 className={`text-[11px] font-bold ${isDelivered ? 'text-[#06B95F]' : 'text-gray-500'}`}>
                    Delivered
                  </h5>
                  <p className="text-[10px] font-medium text-surface-500 mt-0.5">
                    {isDelivered ? 'Handshake complete' : 'Pending OTP verification'}
                  </p>
                </div>
              </div>
              
              {isDelivered && (
                <div className="mt-5 bg-[#ecfdf3] rounded-lg p-3 flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                  <p className="text-[10px] font-medium text-green-700">
                    Your order has been delivered. Thank you for shopping with {branding.appName}!
                  </p>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="mx-4 lg:mx-0 bg-white rounded-2xl p-4 shadow-sm border border-surface-200/50">
              <h4 className="text-[12px] font-bold text-[#192168] mb-3">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#E8F0FE] rounded flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#1668F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                      </svg>
                    </div>
                    <span className="text-[11px] text-[#192168]">Payment Method</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#192168]">UPI / Online</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-surface-500">Subtotal</span>
                  <span className="text-[11px] font-bold text-[#192168]">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-surface-500">Delivery Charges</span>
                  <span className="text-[11px] font-bold text-green-600">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-surface-100 mt-2">
                  <span className="text-[12px] font-bold text-[#192168]">Total Amount</span>
                  <span className="text-[14px] font-extrabold text-[#192168]">₹{totalAmount}</span>
                </div>
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
