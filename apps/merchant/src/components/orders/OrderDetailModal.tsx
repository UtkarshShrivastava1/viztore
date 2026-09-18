import React from 'react';
import {
  X,
  Printer,
  Package,
  Clock,
  ShieldCheck,
  Truck,
  MapPin,
  CreditCard,
  Key,
  MessageCircle,
} from 'lucide-react';
import { MerchantOrderRecord } from '../../stores/orderStore.js';

interface OrderDetailModalProps {
  order: MerchantOrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onPrint?: (order: MerchantOrderRecord) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onPrint,
}) => {
  if (!isOpen || !order) return null;

  const handleWhatsAppDispatch = () => {
    const itemsText = order.items
      .map((item, idx) => `${idx + 1}. ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`)
      .join('\n');

    const text = 
`🚚 *DELIVERY DISPATCH MANIFEST — ${order.orderNumber}*
━━━━━━━━━━━━━━━━━━━━━━
🏪 *Store Pickup:* Merchant Store Partner
📍 *Drop Address:* ${order.deliveryAddress.fullText || `${order.deliveryAddress.street}, ${order.deliveryAddress.city}`}
👤 *Customer:* ${order.customer.name}
📞 *Customer Phone:* ${order.customer.phone}

📦 *Items to Deliver:*
${itemsText}

💰 *Bill Amount:* ₹${order.pricing.totalAmount.toLocaleString('en-IN')} (${order.payment.paymentMethod})
🔑 *Handshake OTP (Collect from Customer):* *${order.otp}*
━━━━━━━━━━━━━━━━━━━━━━
_Please collect package from store and verify 4-digit OTP upon customer handover._`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint(order);
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Order Details: {order.orderNumber}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsAppDispatch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-sm"
              title="Send Delivery Manifest to Rider on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Rider</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-blue-600 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Bill</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* OTP Runner Verification Banner */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-900">Delivery Runner OTP</h4>
                <p className="text-[10px] text-amber-700">
                  Required by delivery runner upon parcel handover
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-black text-amber-900 font-mono tracking-widest bg-white px-3 py-1 rounded-lg border border-amber-200 shadow-2xs">
                {order.otp}
              </span>
            </div>
          </div>

          {/* Grid of Customer & Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Customer Information */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Customer Information</span>
              </h3>
              <div className="space-y-1 text-slate-600">
                <div className="font-bold text-slate-800 text-xs">{order.customer.name}</div>
                <div>{order.customer.email}</div>
                <div>{order.customer.phone}</div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Delivery Address</span>
              </h3>
              <div className="text-slate-600 whitespace-pre-line leading-relaxed">
                {order.deliveryAddress.fullText || `${order.deliveryAddress.street}, ${order.deliveryAddress.city}`}
              </div>
            </div>
          </div>

          {/* Courier & Tracking (if applicable) */}
          {order.courier && (
            <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="font-bold text-slate-800">{order.courier.partner}</span>
                  <span className="text-slate-500 ml-2">ID: {order.courier.trackingId}</span>
                </div>
              </div>
              <span className="font-semibold text-blue-600 underline cursor-pointer">
                Live Tracking Active
              </span>
            </div>
          )}

          {/* Items Breakdown Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-slate-700" />
              <span>Order Items ({order.itemsSummary.count})</span>
            </h3>

            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Item</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Price</th>
                    <th className="p-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5">
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        {item.variant && (
                          <div className="text-[10px] text-slate-400">{item.variant}</div>
                        )}
                      </td>
                      <td className="p-2.5 text-center font-medium">{item.quantity}</td>
                      <td className="p-2.5 text-right text-slate-600">₹{item.price}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment & Financial Summary */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-800">
                  {order.payment.paymentMethod} ({order.payment.mode})
                </span>
                <span className="text-emerald-700 font-bold ml-2">Status: {order.payment.status}</span>
              </div>
            </div>

            <div className="w-full sm:w-auto text-right space-y-0.5">
              <div className="flex justify-between sm:justify-end gap-6 text-slate-500">
                <span>Items Subtotal:</span>
                <span>₹{order.pricing.itemsTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-6 font-bold text-slate-900 text-sm pt-1 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{order.pricing.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
