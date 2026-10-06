'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ArrowLeft,
  Share2,
  Loader2,
  User,
  ShoppingBag,
  Calendar,
  ShoppingBasket,
  Store,
  Heart,
  Bell,
  Ticket,
  FileText,
  LogOut
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { ordersApi } from '@/lib/api/orders';
import { OrderInvoiceModal } from '@/components/orders/OrderInvoiceModal';
import { useAuthStore } from '@/stores/auth.store';
import type { IOrder } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';

export function OrderDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
  const { user, isAuthenticated, openAuthModal } = useAuthStore();

  const formData = {
    fullName: user?.fullName || 'Guest User',
    mobileNumber: user?.phone ? `+91 ${user.phone}` : '+91 91234 56789',
    email: user?.email || 'harishkumar@gmail.com',
  };

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

  // Use fallback values matching screenshot if order is not loaded but we don't want to show empty state just for UI
  const displayId = order?.orderNumber || (id.startsWith('ORD') ? `#${id}` : `#ORD-123456789`);
  const otpDigits = (order?.deliveryOtp || '738216').split('');

  // Status progression checks
  const currentStatus = order?.status || 'DELIVERED';
  const isConfirmed = true;
  const isPacked = true;
  const isOutForDelivery = true;
  const isDelivered = currentStatus === 'DELIVERED';

  const orderDate = order?.createdAt 
    ? new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : '08 May 2024, 10:30 AM';

  const address = order?.shippingAddress || {
    fullName: 'Harish Kumar',
    street: '123, MG Road, Near City Mall',
    city: 'Indore',
    state: 'Madhya Pradesh',
    postalCode: '452001',
    phone: '91 98765 43210'
  };

  const totalAmount = order?.grandTotal ?? 399;
  const subtotal = order?.subtotal ?? 399;
  const deliveryFee = order?.shippingFee ?? 0;

  const mockItem = {
    name: 'Men Graphic Print T-shirt',
    variants: 'Olive Green • Size: L • Qty: 1',
    price: 399,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=200&h=200'
  };

  if (!loading && !order && !id) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1668F6] mx-auto" />
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
            <div className="flex-1 flex flex-col gap-4">
              
              {/* Delivery Status Banner */}
              <div className={`mx-4 lg:mx-0 rounded-xl p-3 flex items-center gap-2 border ${
                isDelivered 
                  ? 'bg-[#F0FDF4] border-green-100 text-[#16A34A]' 
                  : 'bg-blue-50 border-blue-200 text-[#1668F6]'
              }`}>
                {isDelivered ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-[#1668F6] shrink-0" />
                )}
                <span className="text-[12px] font-bold">
                  {isDelivered ? `Delivered on ${orderDate}` : `Order in progress — Status: ${currentStatus}`}
                </span>
              </div>

              {/* Order Item Details */}
              <div className="mx-4 lg:mx-0 bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-200/60">
                <div className="flex items-start justify-between pb-3">
                  <div>
                    <h3 className="text-[13px] lg:text-[14px] font-extrabold text-[#192168]">Order ID: {displayId}</h3>
                    <p className="text-[11px] lg:text-[12px] font-medium text-surface-500 mt-1">{orderDate}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-[12px] lg:text-[13px] font-bold ${isDelivered ? 'text-[#16A34A]' : 'text-[#1668F6]'}`}>
                    {currentStatus} {isDelivered && <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </div>
                </div>
                
                <div className="py-2">
                  <div className="flex gap-4">
                    <div className="w-[72px] h-[72px] lg:w-[88px] lg:h-[88px] rounded-lg overflow-hidden bg-surface-50 flex-shrink-0 flex items-center justify-center border border-surface-100">
                      <img src={mockItem.image} alt={mockItem.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-[14px] lg:text-[16px] font-bold text-[#192168] line-clamp-1 pr-2">
                          {order?.items?.[0]?.name || mockItem.name}
                        </h4>
                        <button className="w-8 h-8 rounded-full bg-surface-50 flex items-center justify-center shrink-0">
                          <Share2 className="w-4 h-4 text-[#192168]" />
                        </button>
                      </div>
                      <p className="text-[12px] lg:text-[13px] font-medium text-surface-500 mt-0.5">
                        {order?.items?.[0] ? `SKU: ${order.items[0].sku} • Qty: ${order.items[0].quantity}` : mockItem.variants}
                      </p>
                      <p className="text-[14px] lg:text-[16px] font-extrabold text-[#192168] mt-1.5">
                        ₹{order?.items?.[0] ? order.items[0].unitPrice * order.items[0].quantity : mockItem.price}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 mt-2 border-t border-surface-100 border-dashed">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-surface-600">
                     <Store className="w-4 h-4 text-[#1668F6]" />
                     Sold by: <span className="font-bold text-[#192168]">Fashion Hub</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowInvoiceModal(true)}
                      className="flex items-center justify-center gap-1.5 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg border border-[#1668F6] text-[#1668F6] text-[12px] lg:text-[13px] font-bold hover:bg-blue-50 transition-colors w-full sm:w-auto"
                    >
                      <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Download Bill
                    </button>
                    <Link 
                      href="/"
                      className="flex items-center justify-center gap-1.5 px-4 lg:px-5 py-1.5 lg:py-2 rounded-lg border border-[#1668F6] text-[#1668F6] text-[12px] lg:text-[13px] font-bold hover:bg-blue-50 transition-colors w-full sm:w-auto"
                    >
                      <ShoppingBasket className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Buy Again
                    </Link>
                  </div>
                </div>
              </div>

              {/* Delivery OTP Box */}
              <div className="mx-4 lg:mx-0 bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-200/60 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#E8F0FE] rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-[#1668F6]" />
                    </div>
                    <h4 className="text-[13px] lg:text-[15px] font-bold text-[#192168]">Delivery OTP</h4>
                    <span className="text-[9px] lg:text-[10px] font-bold text-[#1668F6] bg-blue-50 px-2 py-0.5 rounded-full ml-1">Show to delivery partner</span>
                  </div>
                  <p className="text-[11px] lg:text-[13px] font-medium text-surface-500 mt-2 pr-2">
                    Share this OTP with the delivery partner to confirm successful delivery
                  </p>
                </div>
                <div className="w-full sm:w-auto bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 lg:p-4 flex-shrink-0 text-center min-w-[200px] lg:min-w-[240px]">
                  <p className="text-[11px] lg:text-[12px] font-bold text-[#192168]">Your Delivery OTP</p>
                  <div className="flex justify-center gap-2 mt-2 mb-2 lg:mt-3 lg:mb-3">
                    {otpDigits.map((d, i) => (
                      <span key={i} className="text-[24px] lg:text-[32px] font-extrabold text-[#1668F6] bg-white border border-[#E5E7EB] rounded-md px-2 lg:px-3 py-1 shadow-sm">{d}</span>
                    ))}
                  </div>
                  <p className="text-[10px] lg:text-[11px] font-bold text-red-500">This OTP is unique for this order.</p>
                </div>
              </div>

              {/* Order Tracking */}
              <div className="mx-4 lg:mx-0 bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-200/60">
                <h4 className="text-[13px] lg:text-[15px] font-bold text-[#192168] mb-5 lg:mb-6">Order Tracking</h4>
                
                <div className="relative pl-7 lg:pl-8 space-y-6 lg:space-y-8">
                  {/* Timeline line */}
                  <div className="absolute left-[7px] lg:left-[11px] top-1 bottom-1 w-0.5 bg-[#E5E7EB]" />
                  
                  <div className="relative">
                    <div className={`absolute -left-7 lg:-left-8 w-4 h-4 lg:w-5 lg:h-5 rounded-full border-[3px] border-white shadow-sm ${
                      isConfirmed ? 'bg-[#16A34A]' : 'bg-gray-300'
                    }`} />
                    <h5 className="text-[12px] lg:text-[14px] font-bold text-[#192168]">Order Confirmed</h5>
                    <p className="text-[11px] lg:text-[12px] font-medium text-surface-500 mt-0.5">08 May 2024, 10:30 AM</p>
                    <p className="text-[11px] lg:text-[12px] text-[#192168] mt-0.5">Your order has been placed.</p>
                  </div>
                  
                  <div className="relative">
                    <div className={`absolute -left-7 lg:-left-8 w-4 h-4 lg:w-5 lg:h-5 rounded-full border-[3px] border-white shadow-sm ${
                      isPacked ? 'bg-[#16A34A]' : 'bg-gray-300'
                    }`} />
                    <h5 className="text-[12px] lg:text-[14px] font-bold text-[#192168]">Packed</h5>
                    <p className="text-[11px] lg:text-[12px] font-medium text-surface-500 mt-0.5">08 May 2024, 02:15 PM</p>
                    <p className="text-[11px] lg:text-[12px] text-[#192168] mt-0.5">Your item has been packed.</p>
                  </div>
                  
                  <div className="relative">
                    <div className={`absolute -left-7 lg:-left-8 w-4 h-4 lg:w-5 lg:h-5 rounded-full border-[3px] border-white shadow-sm ${
                      isOutForDelivery ? 'bg-[#16A34A]' : 'bg-gray-300'
                    }`} />
                    <h5 className="text-[12px] lg:text-[14px] font-bold text-[#192168]">Out for Delivery</h5>
                    <p className="text-[11px] lg:text-[12px] font-medium text-surface-500 mt-0.5">08 May 2024, 09:45 AM</p>
                    <p className="text-[11px] lg:text-[12px] text-[#192168] mt-0.5">Your order is out for delivery.</p>
                  </div>
                  
                  <div className="relative">
                    <div className={`absolute -left-7 lg:-left-8 w-4 h-4 lg:w-5 lg:h-5 rounded-full border-[3px] border-white shadow-sm ${
                      isDelivered ? 'bg-[#16A34A]' : 'bg-gray-300'
                    }`} />
                    <h5 className={`text-[12px] lg:text-[14px] font-bold ${isDelivered ? 'text-[#16A34A]' : 'text-gray-500'}`}>
                      Delivered
                    </h5>
                    <p className={`text-[11px] lg:text-[12px] font-medium mt-0.5 ${isDelivered ? 'text-[#16A34A]' : 'text-surface-500'}`}>
                      08 May 2024, 10:30 AM
                    </p>
                    <p className={`text-[11px] lg:text-[12px] mt-0.5 ${isDelivered ? 'text-[#16A34A]' : 'text-gray-500'}`}>Your order has been delivered.</p>
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
                    <h4 className="text-[13px] lg:text-[14px] font-bold text-[#192168]">Delivery Address</h4>
                  </div>
                  <button className="text-[11px] lg:text-[12px] font-bold text-[#1668F6]">View on Map</button>
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
                  <p className="text-xs text-gray-400">No delivery address attached to this order.</p>
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
                    <span className="text-[12px] lg:text-[13px] font-medium text-surface-500">Payment Method</span>
                    <span className="text-[12px] lg:text-[13px] font-bold text-[#192168]">UPI</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[12px] lg:text-[13px] font-medium text-surface-500">Subtotal</span>
                    <span className="text-[12px] lg:text-[13px] font-bold text-[#192168]">₹{subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] lg:text-[13px] font-medium text-surface-500">Delivery Charges</span>
                    <span className="text-[12px] lg:text-[13px] font-bold text-[#16A34A]">
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-surface-100">
                    <span className="text-[14px] lg:text-[15px] font-bold text-[#192168]">Total Amount</span>
                    <span className="text-[16px] lg:text-[20px] font-extrabold text-[#192168]">₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mx-4 lg:mx-0 space-y-3 lg:space-y-4 mb-6">
                
                <div className="w-full bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-200/60 flex items-center justify-between text-left cursor-pointer hover:bg-surface-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100">
                      <HeadphonesIcon className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500" />
                    </div>
                    <div>
                      <span className="text-[14px] lg:text-[15px] font-bold text-[#192168] block">Need Help?</span>
                      <span className="text-[11px] lg:text-[12px] font-medium text-surface-500">Contact our support team for any queries</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#192168]" />
                </div>

                <div className="w-full bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-200/60 flex items-center justify-between text-left cursor-pointer hover:bg-surface-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                      <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
                    </div>
                    <div>
                      <span className="text-[14px] lg:text-[15px] font-bold text-[#192168] block">Feedback</span>
                      <span className="text-[11px] lg:text-[12px] font-medium text-surface-500">Share your experience and help us improve</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#192168]" />
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

