import React, { useState, useEffect } from 'react';
import {
  Printer,
  Eye,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Mail,
  Truck,
  CheckCircle2,
  X,
  Clock,
  Copy,
  Check,
  Package,
  ShieldCheck,
  Key,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import {
  OrderTab,
  MerchantOrderRecord,
  useOrderStore,
} from '../../stores/orderStore.js';
import { parseProductTitle, formatOrderRelativeTime } from '../../lib/orderUtils.js';
import { VerifyOtpModal } from './VerifyOtpModal.js';
import { broadcastOrderToFleet } from '../../lib/fleetBroadcast.js';

interface OrdersTableProps {
  onViewOrder: (order: MerchantOrderRecord) => void;
  onPrintOrder: (order: MerchantOrderRecord) => void;
}

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
    verifyPickup,
    deliverOrder,
    claimReservation,
  } = useOrderStore();

  const [otpModalOrder, setOtpModalOrder] = useState<MerchantOrderRecord | null>(null);
  const [otpModalMode, setOtpModalMode] = useState<'pickup' | 'delivery'>('delivery');
  const [trackingOrder, setTrackingOrder] = useState<MerchantOrderRecord | null>(null);
  const [contactOrder, setContactOrder] = useState<MerchantOrderRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Close more actions menu on external click
  useEffect(() => {
    const handleOutsideClick = () => setOpenActionId(null);
    if (openActionId) {
      window.addEventListener('click', handleOutsideClick);
      return () => window.removeEventListener('click', handleOutsideClick);
    }
  }, [openActionId]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filter orders by tab and active filters
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
      case 'reserves':
        matchesTab =
          order.orderType === 'In-Store Hold (2h)' ||
          String(order.orderNumber || '').toUpperCase().includes('RES-');
        break;
      case 'returns':
        matchesTab = order.status === 'return_requested' || order.status === 'returned';
        break;
      case 'all_orders':
      default:
        matchesTab = true;
        break;
    }
    if (!matchesTab) return false;

    // 2. Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = order.orderNumber.toLowerCase().includes(q);
      const matchCustomer =
        order.customer.name.toLowerCase().includes(q) ||
        order.customer.phone.includes(q) ||
        order.customer.email.toLowerCase().includes(q);
      const matchProduct =
        order.items.some((i) => i.name.toLowerCase().includes(q)) ||
        order.itemsSummary.title.toLowerCase().includes(q);
      if (!matchNumber && !matchCustomer && !matchProduct) return false;
    }

    // 3. Payment Status Filter
    if (paymentStatusFilter !== 'all') {
      if (paymentStatusFilter === 'paid' && order.payment.status !== 'Paid') return false;
      if (paymentStatusFilter === 'pending' && order.payment.status !== 'Pending') return false;
      if (paymentStatusFilter === 'refunded' && order.payment.status !== 'Refunded') return false;
    }

    // 4. Order Status Filter
    if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) {
      return false;
    }

    // 5. Fulfillment Filter
    if (fulfillmentTypeFilter !== 'all') {
      if (fulfillmentTypeFilter === 'online' && order.orderType !== 'Online Order') return false;
      if (
        fulfillmentTypeFilter === 'instore' &&
        order.orderType !== 'Manual In-Store' &&
        order.orderType !== 'In-Store Hold (2h)'
      )
        return false;
    }

    return true;
  });

  const isAllSelected =
    tabFilteredOrders.length > 0 &&
    tabFilteredOrders.every((o) => selectedOrderIds.includes(o.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllOrders(tabFilteredOrders.map((o) => o.id));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden w-full transition-all">
      {/* Bulk Action Bar (when rows selected) */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-blue-50/90 border-b border-blue-200/80 px-4 py-2.5 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
              {selectedOrderIds.length}
            </span>
            <span className="text-xs font-bold text-blue-900">
              Orders selected in this view
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const selected = tabFilteredOrders.filter((o) => selectedOrderIds.includes(o.id));
                selected.forEach((o) => onPrintOrder(o));
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Batch Print Labels</span>
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-medium hover:bg-white transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* 
        Horizontal-scroll protected table with guaranteed column widths.
        min-w-[1060px] guarantees cells never squash or cause buttons to overflow into adjacent columns.
      */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1060px] table-fixed text-left text-xs border-collapse">
          {/* Precise Column Proportions: Total = 100% */}
          <colgroup>
            <col className="w-[3.5%]" />
            <col className="w-[18%]" />
            <col className="w-[19%]" />
            <col className="w-[23%]" />
            <col className="w-[15%]" />
            <col className="w-[21.5%]" />
          </colgroup>

          {/* Table Header */}
          <thead className="bg-[#f8fafc] text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 select-none">
            <tr>
              <th className="py-3 px-3 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                  title="Select all orders in this stage"
                />
              </th>
              <th className="py-3 px-3.5">Order &amp; Timeline</th>
              <th className="py-3 px-3.5">Customer &amp; Area</th>
              <th className="py-3 px-3.5">Items &amp; Specs</th>
              <th className="py-3 px-3.5">Amount &amp; OTP</th>
              <th className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {tabFilteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-14 text-center text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-400">
                    <Package className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">No orders found</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    There are no orders matching this stage or filter criteria.
                  </p>
                </td>
              </tr>
            ) : (
              tabFilteredOrders.map((order) => {
                const isSelected = selectedOrderIds.includes(order.id);
                const isCopied = copiedId === order.id;
                const isOtpCopied = copiedId === `otp-${order.id}`;
                const isPickupOtpCopied = copiedId === `pickup-otp-${order.id}`;
                const parsedTitle = parseProductTitle(
                  order.itemsSummary.title || order.items[0]?.name || 'Packaged parcel'
                );
                const timeInfo = formatOrderRelativeTime(order.timestamps.createdAt);

                return (
                  <tr
                    key={order.id}
                    className={`transition-colors hover:bg-slate-50/75 ${
                      isSelected ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {/* 1. Checkbox */}
                    <td className="py-3 px-3 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                    </td>

                    {/* 2. Order & Timeline Hub */}
                    <td className="py-3 px-3.5 align-middle min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {order.status === 'new' && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-blue-600 text-white shadow-2xs tracking-wider">
                            New
                          </span>
                        )}
                        <span
                          onClick={() => onViewOrder(order)}
                          className="font-bold text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-mono hover:underline truncate max-w-[155px]"
                          title="Click to view complete order details"
                        >
                          {order.orderNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.orderNumber, order.id)}
                          className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors shrink-0"
                          title="Copy Order ID"
                        >
                          {isCopied ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {/* Sub-row: Order Type pill + Timestamp */}
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200/60 truncate max-w-[110px]">
                          {order.orderType === 'In-Store Hold (2h)' ? 'In-Store Hold' : order.orderType}
                        </span>
                        <span className="text-slate-400 text-[10px] flex items-center gap-1 shrink-0" title={timeInfo.full}>
                          <Clock className="w-2.5 h-2.5" />
                          <span>{timeInfo.relative}</span>
                        </span>
                      </div>
                    </td>

                    {/* 3. Customer & Area Hub */}
                    <td className="py-3 px-3.5 align-middle min-w-0">
                      <div className="flex items-center gap-2">
                        {/* Avatar Initials */}
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                          {order.customer.avatarInitials ||
                            order.customer.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 text-xs truncate">
                            {order.customer.name}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <a
                              href={`tel:${order.customer.phone}`}
                              className="hover:text-blue-600 flex items-center gap-1 font-mono"
                              title="Call customer"
                            >
                              <Phone className="w-2.5 h-2.5 text-slate-400" />
                              <span>{order.customer.phone}</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Locality badge */}
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 pl-9 truncate">
                        <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {order.deliveryAddress.locality || order.deliveryAddress.city || 'Local area'} - {order.deliveryAddress.pincode}
                        </span>
                      </div>
                    </td>

                    {/* 4. Items & Smart Specs Hub */}
                    <td className="py-3 px-3.5 align-middle min-w-0">
                      <div className="flex items-start gap-2.5">
                        {/* Product Image Thumbnail */}
                        {order.items[0]?.imageUrl ? (
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-2xs">
                            <img
                              src={order.items[0].imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            {order.itemsSummary.count > 1 && (
                              <span className="absolute bottom-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-1 rounded-tl-md">
                                {order.itemsSummary.count}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                            <Package className="w-4 h-4" />
                          </div>
                        )}

                        {/* Title and Parsed Spec Chips */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-700 text-[10px] bg-slate-100 px-1 rounded shrink-0">
                              {order.itemsSummary.count}x
                            </span>
                            <span
                              className="font-bold text-slate-900 text-xs truncate block"
                              title={order.itemsSummary.title}
                            >
                              {parsedTitle.mainTitle}
                            </span>
                          </div>

                          {/* Clean Spec Chips */}
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {parsedTitle.specs.length > 0 ? (
                              parsedTitle.specs.slice(0, 2).map((spec, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200/60 truncate max-w-[95px]"
                                  title={spec}
                                >
                                  {spec}
                                </span>
                              ))
                            ) : null}

                            {parsedTitle.specs.length > 2 && (
                              <span
                                className="text-[9px] text-slate-400 font-medium cursor-pointer hover:text-slate-600"
                                title={parsedTitle.specs.slice(2).join(', ')}
                              >
                                +{parsedTitle.specs.length - 2} specs
                              </span>
                            )}

                            {order.itemsSummary.extraCount && (
                              <span
                                onClick={() => onViewOrder(order)}
                                className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded border border-blue-100 cursor-pointer hover:underline"
                              >
                                +{order.itemsSummary.extraCount} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 5. Amount & OTP Hub (Cleanly stacked, zero overflow) */}
                    <td className="py-3 px-3.5 align-middle min-w-0">
                      <div className="flex flex-col gap-1">
                        <div className="font-black text-slate-900 text-sm">
                          ₹{order.pricing.totalAmount.toLocaleString('en-IN')}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              order.payment.status === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                order.payment.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                            />
                            {order.payment.status} · {order.payment.mode}
                          </span>
                        </div>

                        {/* Dedicated 2-Leg OTP Badges */}
                        {['accepted', 'ready_to_ship'].includes(order.status) &&
                        (order.pickupOtp || order.otp) ? (
                          <div
                            onClick={() =>
                              handleCopy(order.pickupOtp || order.otp, `pickup-otp-${order.id}`)
                            }
                            className="mt-0.5 px-1.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-900 inline-flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors shadow-2xs group w-fit"
                            title="Click to copy Leg 1 Rider Pickup OTP"
                          >
                            <Key className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                            <span className="font-mono font-bold text-[10px] tracking-wide">
                              Pickup: {order.pickupOtp || order.otp}
                            </span>
                            {isPickupOtpCopied ? (
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-2.5 h-2.5 text-blue-400 opacity-60 group-hover:opacity-100" />
                            )}
                          </div>
                        ) : ['shipped', 'delivered'].includes(order.status) && order.otp ? (
                          <div
                            onClick={() => handleCopy(order.otp, `otp-${order.id}`)}
                            className="mt-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 inline-flex items-center gap-1 cursor-pointer hover:bg-amber-100 transition-colors shadow-2xs group w-fit"
                            title="Click to copy delivery runner OTP"
                          >
                            <ShieldCheck className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                            <span className="font-mono font-bold text-[10px] tracking-wide">
                              Doorstep: {order.otp}
                            </span>
                            {isOtpCopied ? (
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-2.5 h-2.5 text-amber-400 opacity-60 group-hover:opacity-100" />
                            )}
                          </div>
                        ) : null}
                      </div>
                    </td>

                    {/* 6. Action Center (Clean, organized, unjumbled) */}
                    <td className="py-3 px-3.5 text-right align-middle min-w-0">
                      <div className="flex items-center justify-end gap-1.5 shrink-0 flex-nowrap">
                        {/* Status Primary Action */}
                        {order.status === 'new' && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                acceptOrder(order.id);
                                onPrintOrder(order);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1 cursor-pointer shrink-0"
                              title="Accept order and print KOT invoice slip"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Accept</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => rejectOrder(order.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                              title="Reject Order"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {order.status === 'accepted' && (
                          <button
                            type="button"
                            onClick={() => markReadyToShip(order.id)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer shrink-0"
                          >
                            Ready to Ship
                          </button>
                        )}

                        {order.status === 'ready_to_ship' && (
                          <>
                            <button
                              type="button"
                              onClick={() => broadcastOrderToFleet(order)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1 cursor-pointer shrink-0"
                              title="Broadcast Run to WhatsApp Delivery Group"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-current" />
                              <span>Broadcast</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOtpModalOrder(order);
                                setOtpModalMode('pickup');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1 cursor-pointer shrink-0"
                              title="Verify Leg 1 Rider Pickup OTP"
                            >
                              <Key className="w-3 h-3" />
                              <span>Verify Pickup</span>
                            </button>
                          </>
                        )}

                        {order.status === 'shipped' && (
                          <button
                            type="button"
                            onClick={() => {
                              setOtpModalOrder(order);
                              setOtpModalMode('delivery');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer shrink-0"
                          >
                            Verify OTP
                          </button>
                        )}

                        {order.status === 'delivered' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200/60 shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Delivered</span>
                          </span>
                        )}

                        {order.orderType === 'In-Store Hold (2h)' && order.status !== 'delivered' && (
                          <button
                            type="button"
                            onClick={() => claimReservation(order.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer shrink-0"
                          >
                            Claim Hold
                          </button>
                        )}

                        {/* Quick View Details */}
                        <button
                          type="button"
                          onClick={() => onViewOrder(order)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer shrink-0 shadow-2xs"
                          title="View complete order details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Print Invoice Quick Tool */}
                        <button
                          type="button"
                          onClick={() => onPrintOrder(order)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer shrink-0 shadow-2xs"
                          title="Print Thermal Receipt / Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* More Actions Dropdown Menu */}
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionId(openActionId === order.id ? null : order.id);
                            }}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer shadow-2xs ${
                              openActionId === order.id
                                ? 'bg-slate-100 border-slate-300 text-slate-900'
                                : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
                            }`}
                            title="More options"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>

                          {openActionId === order.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-30 text-left animate-in fade-in-50 zoom-in-95 duration-100"
                            >
                              {order.status === 'ready_to_ship' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenActionId(null);
                                    dispatchOrder(order.id);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                                >
                                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Direct Dispatch (Self)</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionId(null);
                                  setContactOrder(order);
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                              >
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Contact Customer</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionId(null);
                                  setTrackingOrder(order);
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                              >
                                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                <span>Track Delivery</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="py-2.5 px-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-[#fbfcfd]">
        <span className="font-semibold text-slate-700">
          Showing {tabFilteredOrders.length} order{tabFilteredOrders.length === 1 ? '' : 's'} in this stage
        </span>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>Delivery radius: 3–4 km</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline text-emerald-600 font-medium">⚡ Real-time updates active</span>
        </div>
      </div>

      {/* Verify OTP Modal */}
      <VerifyOtpModal
        order={otpModalOrder}
        isOpen={Boolean(otpModalOrder)}
        onClose={() => setOtpModalOrder(null)}
        mode={otpModalMode}
        onConfirm={otpModalMode === 'pickup' ? verifyPickup : deliverOrder}
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
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
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
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {trackingOrder.timestamps.shippedAt || '18 May 2024 04:30 PM'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Packed & Label Generated</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {trackingOrder.timestamps.createdAt}
                    </div>
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
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
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
