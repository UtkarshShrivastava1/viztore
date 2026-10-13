import React, { useState } from 'react';
import {
  Printer,
  Eye,
  MessageSquare,
  ChevronDown,
  ExternalLink,
  Phone,
  Mail,
  Truck,
  CheckCircle2,
  X,
  Clock,
} from 'lucide-react';
import {
  OrderTab,
  MerchantOrderRecord,
  useOrderStore,
} from '../../stores/orderStore.js';
import { VerifyOtpModal } from './VerifyOtpModal.js';

interface OrdersTableProps {
  onViewOrder: (order: MerchantOrderRecord) => void;
  onPrintOrder: (order: MerchantOrderRecord) => void;
}

// Visual clothing category thumbnail matching mockups
const ClothingThumbnail: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'kurti':
    case 'dress':
      return (
        <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100/80 flex items-center justify-center shrink-0 shadow-2xs">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-rose-500" fill="currentColor">
            <path d="M12 2L9 5H5v4l2 1v12h10V10l2-1V5h-4l-3-3zm0 3c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
          </svg>
        </div>
      );
    case 'jeans':
    case 'shorts':
      return (
        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-700" fill="currentColor">
            <path d="M6 3h12v4l-2 15h-3l-1-10-1 10H8L6 7V3z" />
          </svg>
        </div>
      );
    case 'saree':
      return (
        <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100/80 flex items-center justify-center shrink-0 shadow-2xs">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-600" fill="currentColor">
            <path d="M12 2c-3 0-5 3-5 6v14h10V8c0-3-2-6-5-6zm0 2c1.7 0 3 2.3 3 4H9c0-1.7 1.3-4 3-4z" />
          </svg>
        </div>
      );
    case 'tshirt':
    default:
      return (
        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-100" fill="currentColor">
            <path d="M16 2l4 4-2 3-2-1v14H8V8L6 9 4 6l4-4h2a3 3 0 004 0h2z" />
          </svg>
        </div>
      );
  }
};

export const OrdersTable: React.FC<OrdersTableProps> = ({ onViewOrder, onPrintOrder }) => {
  const {
    orders,
    activeTab,
    searchQuery,
    paymentStatusFilter,
    orderStatusFilter,
    fulfillmentTypeFilter,
    selectedOrderIds,
    toggleOrderSelection,
    selectAllOrders,
    clearSelection,
    acceptOrder,
    rejectOrder,
    markReadyToShip,
    dispatchOrder,
    deliverOrder,
  } = useOrderStore();

  const [otpModalOrder, setOtpModalOrder] = useState<MerchantOrderRecord | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<MerchantOrderRecord | null>(null);
  const [contactOrder, setContactOrder] = useState<MerchantOrderRecord | null>(null);

  // Filter orders by tab and search
  const tabFilteredOrders = orders.filter((order) => {
    // 1. Tab match
    let matchesTab = true;
    switch (activeTab) {
      case 'new_orders':
        matchesTab = order.status === 'new';
        break;
      case 'accepted':
        matchesTab = order.status === 'accepted';
        break;
      case 'ready_to_ship':
        matchesTab = order.status === 'ready_to_ship';
        break;
      case 'shipped':
        matchesTab = order.status === 'shipped';
        break;
      case 'delivered':
        matchesTab = order.status === 'delivered';
        break;
      case 'cancelled':
        matchesTab = order.status === 'cancelled';
        break;
      case 'returns':
        matchesTab = order.status === 'return_requested' || order.status === 'returned';
        break;
      case 'all_orders':
      default:
        matchesTab = true;
        break;
    }

    // 2. Search query match
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch =
        order.orderNumber.toLowerCase().includes(q) ||
        order.customer.name.toLowerCase().includes(q) ||
        order.customer.email.toLowerCase().includes(q) ||
        order.customer.phone.includes(q) ||
        order.itemsSummary.title.toLowerCase().includes(q);
    }

    // 3. Payment status filter
    let matchesPayment = true;
    if (paymentStatusFilter !== 'all') {
      matchesPayment = order.payment.status.toLowerCase() === paymentStatusFilter;
    }

    // 4. Order status filter
    let matchesStatus = true;
    if (orderStatusFilter !== 'all') {
      matchesStatus = order.status === orderStatusFilter;
    }

    return matchesTab && matchesSearch && matchesPayment && matchesStatus;
  });

  const allSelected =
    tabFilteredOrders.length > 0 &&
    tabFilteredOrders.every((o) => selectedOrderIds.includes(o.id));

  const handleSelectAllToggle = () => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAllOrders(tabFilteredOrders.map((o) => o.id));
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Scrollable Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              {/* Checkbox */}
              <th className="py-3 px-3.5 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAllToggle}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
              </th>

              {/* Order Details */}
              <th className="py-3 px-3 min-w-[130px]">Order Details</th>

              {/* Customer */}
              <th className="py-3 px-3 min-w-[160px]">Customer</th>

              {/* Items */}
              <th className="py-3 px-3 min-w-[180px]">Items</th>

              {/* Amount */}
              <th className="py-3 px-3 min-w-[90px]">Amount</th>

              {/* Payment (on all except Returns where it's replaced or shown) */}
              {activeTab !== 'returns' && (
                <th className="py-3 px-3 min-w-[100px]">Payment</th>
              )}

              {/* Tab-Specific Columns */}
              {['accepted', 'ready_to_ship'].includes(activeTab) && (
                <th className="py-3 px-3 min-w-[90px]">OTP</th>
              )}

              {activeTab === 'shipped' && (
                <>
                  <th className="py-3 px-3 min-w-[110px]">Shipped On</th>
                  <th className="py-3 px-3 min-w-[160px]">Courier Details</th>
                </>
              )}

              {activeTab === 'delivered' && (
                <>
                  <th className="py-3 px-3 min-w-[110px]">Delivered On</th>
                  <th className="py-3 px-3 min-w-[200px]">Delivery Address</th>
                </>
              )}

              {activeTab === 'cancelled' && (
                <>
                  <th className="py-3 px-3 min-w-[110px]">Cancelled On</th>
                  <th className="py-3 px-3 min-w-[160px]">Cancellation Reason</th>
                  <th className="py-3 px-3 min-w-[130px]">Refund Status</th>
                </>
              )}

              {activeTab === 'all_orders' && (
                <>
                  <th className="py-3 px-3 min-w-[110px]">Order Status</th>
                  <th className="py-3 px-3 min-w-[140px]">Current Stage</th>
                </>
              )}

              {activeTab === 'returns' && (
                <>
                  <th className="py-3 px-3 min-w-[120px]">Return Status</th>
                  <th className="py-3 px-3 min-w-[120px]">Refund Status</th>
                  <th className="py-3 px-3 min-w-[160px]">Return Reason</th>
                </>
              )}

              {/* Order Time (for new_orders, accepted, ready_to_ship) */}
              {['new_orders', 'accepted', 'ready_to_ship'].includes(activeTab) && (
                <th className="py-3 px-3 min-w-[110px]">Order Time</th>
              )}

              {/* Actions Header */}
              <th className="py-3 px-3.5 text-center min-w-[130px]">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {tabFilteredOrders.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  <p className="text-sm font-semibold text-slate-600">No orders found</p>
                  <p className="text-xs text-slate-400 mt-1">There are no orders matching this filter or tab.</p>
                </td>
              </tr>
            ) : (
              tabFilteredOrders.map((order) => {
                const isSelected = selectedOrderIds.includes(order.id);

                return (
                  <tr
                    key={order.id}
                    className={`transition-colors hover:bg-slate-50/80 ${
                      isSelected ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                    </td>

                    {/* Order Details */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {activeTab === 'new_orders' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white leading-none">
                            New
                          </span>
                        )}
                        <span className="font-bold text-blue-600 hover:underline cursor-pointer">
                          {order.orderNumber}
                        </span>
                      </div>

                      {/* Subtitle state */}
                      <div className="text-[10px] mt-0.5 font-medium">
                        {activeTab === 'new_orders' && (
                          <span className="text-slate-400">{order.orderType}</span>
                        )}
                        {activeTab === 'accepted' && (
                          <span className="text-blue-600 font-semibold">Accepted</span>
                        )}
                        {activeTab === 'ready_to_ship' && (
                          <span className="text-amber-600 font-semibold">Ready to Ship</span>
                        )}
                        {activeTab === 'shipped' && (
                          <span className="text-emerald-600 font-semibold">Shipped</span>
                        )}
                        {activeTab === 'delivered' && (
                          <span className="text-emerald-600 font-semibold">Delivered</span>
                        )}
                        {activeTab === 'cancelled' && (
                          <span className="text-rose-600 font-semibold">Cancelled</span>
                        )}
                        {activeTab === 'returns' && (
                          <span className="text-rose-600 font-semibold">Return Requested</span>
                        )}
                        {activeTab === 'all_orders' && (
                          <span className="text-slate-400">{order.orderType}</span>
                        )}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 text-xs">{order.customer.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{order.customer.email}</div>
                      <div className="text-[10px] text-slate-500">{order.customer.phone}</div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <ClothingThumbnail type={order.itemsSummary.categoryIconType} />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-xs">
                            {order.itemsSummary.count} items
                          </div>
                          <div className="text-[11px] text-slate-600 truncate mt-0.5">
                            {order.itemsSummary.title}
                          </div>
                          {order.itemsSummary.extraCount && (
                            <div className="text-[10px] text-slate-400">
                              +{order.itemsSummary.extraCount} more
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 text-xs">
                        ₹{order.pricing.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Payment (when not Returns) */}
                    {activeTab !== 'returns' && (
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-emerald-600 text-xs">
                          {order.payment.status}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {order.payment.paymentMethod}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {order.payment.mode}
                        </div>
                      </td>
                    )}

                    {/* TAB SPECIFIC DATA CELLS */}

                    {/* OTP Column for Accepted & Ready to Ship */}
                    {['accepted', 'ready_to_ship'].includes(activeTab) && (
                      <td className="py-3.5 px-3">
                        <span className="font-extrabold text-slate-900 text-sm tracking-wide font-mono">
                          {order.otp}
                        </span>
                      </td>
                    )}

                    {/* Shipped On & Courier Details for Shipped */}
                    {activeTab === 'shipped' && (
                      <>
                        <td className="py-3.5 px-3 text-slate-700 whitespace-pre-line text-[11px]">
                          {order.timestamps.shippedAt || '19 May 2024\n10:20 AM'}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900 text-xs">
                            {order.courier?.partner || 'Local Express'}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                            Tracking ID: {order.courier?.trackingId || 'TRK-849201'}
                          </div>
                          <button
                            type="button"
                            onClick={() => setTrackingOrder(order)}
                            className="text-blue-600 hover:underline font-semibold text-[11px] inline-flex items-center gap-1 mt-0.5 cursor-pointer"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Track Order</span>
                          </button>
                        </td>
                      </>
                    )}

                    {/* Delivered On & Delivery Address for Delivered */}
                    {activeTab === 'delivered' && (
                      <>
                        <td className="py-3.5 px-3 text-slate-700 whitespace-pre-line text-[11px]">
                          {order.timestamps.deliveredAt || '19 May 2024\n12:30 PM'}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900 text-xs">
                            {order.customer.name}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {order.deliveryAddress.street}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                          </div>
                        </td>
                      </>
                    )}

                    {/* Cancelled Info */}
                    {activeTab === 'cancelled' && (
                      <>
                        <td className="py-3.5 px-3 text-slate-700 whitespace-pre-line text-[11px]">
                          {order.timestamps.cancelledAt || '18 May 2024\n01:15 PM'}
                        </td>
                        <td className="py-3.5 px-3 text-slate-700 text-[11px] max-w-xs">
                          {order.cancellation?.reason || 'Customer requested cancellation'}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            {order.cancellation?.refundStatus || 'Refund Initiated'}
                          </span>
                        </td>
                      </>
                    )}

                    {/* All Orders Info */}
                    {activeTab === 'all_orders' && (
                      <>
                        <td className="py-3.5 px-3">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 capitalize">
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 text-[11px]">
                          {order.currentStageName || 'Stage 01: New Order'}
                        </td>
                      </>
                    )}

                    {/* Returns Info */}
                    {activeTab === 'returns' && (
                      <>
                        <td className="py-3.5 px-3">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                            {order.returns?.returnStatus || 'Pickup Scheduled'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 text-[11px]">
                          {order.returns?.refundStatus || 'Pending Inspection'}
                        </td>
                        <td className="py-3.5 px-3 text-slate-700 text-[11px] max-w-xs">
                          {order.returns?.returnReason || 'Size did not fit'}
                        </td>
                      </>
                    )}

                    {/* Order Time (for new_orders, accepted, ready_to_ship) */}
                    {['new_orders', 'accepted', 'ready_to_ship'].includes(activeTab) && (
                      <td className="py-3.5 px-3 text-slate-700 whitespace-pre-line text-[11px]">
                        {order.timestamps.createdAt}
                      </td>
                    )}

                    {/* Actions Column matching 2.0.png through 2.7.png */}
                    <td className="py-3.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* New Orders: Accept Order (blue) + Reject (red text) */}
                        {activeTab === 'new_orders' && (
                          <>
                            <button
                              type="button"
                              onClick={() => acceptOrder(order.id)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
                            >
                              Accept Order
                            </button>
                            <button
                              type="button"
                              onClick={() => rejectOrder(order.id)}
                              className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {/* Accepted: Ready to Ship */}
                        {activeTab === 'accepted' && (
                          <button
                            type="button"
                            onClick={() => markReadyToShip(order.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
                          >
                            Ready to Ship
                          </button>
                        )}

                        {/* Ready to Ship: Mark Shipped */}
                        {activeTab === 'ready_to_ship' && (
                          <button
                            type="button"
                            onClick={() => dispatchOrder(order.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
                          >
                            Mark Shipped
                          </button>
                        )}

                        {/* Shipped: Verify Delivery OTP */}
                        {activeTab === 'shipped' && (
                          <button
                            type="button"
                            onClick={() => setOtpModalOrder(order)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
                          >
                            Verify OTP & Deliver
                          </button>
                        )}

                        {/* Print Invoice Button */}
                        <button
                          type="button"
                          onClick={() => onPrintOrder(order)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-blue-600 transition-colors cursor-pointer"
                          title="Print Shipping Label / Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* View Details Button */}
                        <button
                          type="button"
                          onClick={() => onViewOrder(order)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-blue-600 transition-colors cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Customer Chat/Contact for Returns tab */}
                        {activeTab === 'returns' && (
                          <button
                            type="button"
                            onClick={() => setContactOrder(order)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-blue-600 transition-colors cursor-pointer"
                            title="Contact Customer"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: Showing all active orders */}
      <div className="py-3 px-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-[#fbfcfd]">
        <span className="font-medium">
          Showing {tabFilteredOrders.length} order{tabFilteredOrders.length === 1 ? '' : 's'} in this stage
        </span>
        <span className="text-[11px] text-slate-400">
          Hyperlocal delivery radius: 3–4 km
        </span>
      </div>

      {/* Verify OTP Modal */}
      <VerifyOtpModal
        order={otpModalOrder}
        isOpen={Boolean(otpModalOrder)}
        onClose={() => setOtpModalOrder(null)}
        onConfirm={deliverOrder}
      />

      {/* Parcel Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Live Parcel Tracking</h3>
              </div>
              <button
                type="button"
                onClick={() => setTrackingOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex justify-between items-center text-xs">
                <div>
                  <div className="text-[11px] text-slate-400">Tracking Number</div>
                  <div className="font-bold text-slate-800 font-mono mt-0.5">
                    {trackingOrder.courier?.trackingId || 'TRK-849201'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Courier Partner</div>
                  <div className="font-bold text-blue-600 mt-0.5">
                    {trackingOrder.courier?.partner || 'Local Express'}
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Out for Local Delivery</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Assigned to local delivery runner</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Dispatched from Store</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{trackingOrder.timestamps.shippedAt || '18 May 2024 04:30 PM'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Packed & Label Generated</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{trackingOrder.timestamps.createdAt}</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setTrackingOrder(null)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 cursor-pointer"
                >
                  Close Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Contact Modal */}
      {contactOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Customer Communication</h3>
              <button
                type="button"
                onClick={() => setContactOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">Customer Name</span>
                <span className="font-bold text-slate-900 text-sm">{contactOrder.customer.name}</span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={`tel:${contactOrder.customer.phone}`}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-blue-50/50 hover:border-blue-200 text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    Call: {contactOrder.customer.phone}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href={`mailto:${contactOrder.customer.email}?subject=Regarding Order ${contactOrder.orderNumber}`}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-blue-50/50 hover:border-blue-200 text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Email: {contactOrder.customer.email}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setContactOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
