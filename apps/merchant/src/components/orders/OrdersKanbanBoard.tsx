import React, { useState } from 'react';
import {
  Printer,
  Eye,
  MessageCircle,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Copy,
  Check,
  ChevronRight,
  User,
  MapPin,
  Phone,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { MerchantOrderRecord, OrderStatus, useOrderStore } from '../../stores/orderStore.js';
import { parseProductTitle, formatOrderRelativeTime } from '../../lib/orderUtils.js';
import { broadcastOrderToFleet } from '../../lib/fleetBroadcast.js';
import { VerifyOtpModal } from './VerifyOtpModal.js';

interface OrdersKanbanBoardProps {
  onViewOrder: (order: MerchantOrderRecord) => void;
  onPrintOrder: (order: MerchantOrderRecord) => void;
}

interface StageColumn {
  id: OrderStatus;
  title: string;
  subtitle: string;
  color: 'blue' | 'indigo' | 'amber' | 'purple' | 'emerald';
  badgeClass: string;
  dotClass: string;
}

const STAGES: StageColumn[] = [
  {
    id: 'new',
    title: 'New Orders',
    subtitle: 'Awaiting merchant acceptance',
    color: 'blue',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500 animate-pulse',
  },
  {
    id: 'accepted',
    title: 'Accepted',
    subtitle: 'Packing & preparing parcel',
    color: 'indigo',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotClass: 'bg-indigo-500',
  },
  {
    id: 'ready_to_ship',
    title: 'Ready to Ship',
    subtitle: 'Waiting for runner pickup',
    color: 'amber',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  {
    id: 'shipped',
    title: 'In Transit',
    subtitle: 'Runner out for delivery',
    color: 'purple',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotClass: 'bg-purple-500',
  },
  {
    id: 'delivered',
    title: 'Delivered',
    subtitle: 'Completed handshakes',
    color: 'emerald',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
];

export const OrdersKanbanBoard: React.FC<OrdersKanbanBoardProps> = ({ onViewOrder, onPrintOrder }) => {
  const {
    orders,
    searchQuery,
    paymentStatusFilter,
    orderStatusFilter,
    fulfillmentTypeFilter,
    acceptOrder,
    rejectOrder,
    markReadyToShip,
    dispatchOrder,
    deliverOrder,
  } = useOrderStore();

  const [otpModalOrder, setOtpModalOrder] = useState<MerchantOrderRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filter orders based on active filters
  const filteredOrders = orders.filter((order) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = order.orderNumber.toLowerCase().includes(q);
      const matchCustomer = order.customer.name.toLowerCase().includes(q) || order.customer.phone.includes(q);
      const matchProduct = order.items.some((i) => i.name.toLowerCase().includes(q)) || order.itemsSummary.title.toLowerCase().includes(q);
      if (!matchNumber && !matchCustomer && !matchProduct) return false;
    }

    // Payment Filter
    if (paymentStatusFilter !== 'all') {
      if (paymentStatusFilter === 'paid' && order.payment.status !== 'Paid') return false;
      if (paymentStatusFilter === 'pending' && order.payment.status !== 'Pending') return false;
      if (paymentStatusFilter === 'refunded' && order.payment.status !== 'Refunded') return false;
    }

    // Status Filter
    if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) {
      return false;
    }

    // Fulfillment Filter
    if (fulfillmentTypeFilter !== 'all') {
      if (fulfillmentTypeFilter === 'online' && order.orderType !== 'Online Order') return false;
      if (fulfillmentTypeFilter === 'instore' && order.orderType !== 'Manual In-Store' && order.orderType !== 'In-Store Hold (2h)') return false;
    }

    return true;
  });

  return (
    <div className="w-full">
      {/* Kanban Board Container - Horizontally scrollable across 5 responsive swimlanes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 pb-4">
        {STAGES.map((stage) => {
          const stageOrders = filteredOrders.filter((o) => o.status === stage.id);

          return (
            <div
              key={stage.id}
              className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-3 flex flex-col min-h-[580px] shadow-2xs"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stage.dotClass}`} />
                  <h3 className="text-xs font-bold text-slate-800 tracking-tight">
                    {stage.title}
                  </h3>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${stage.badgeClass}`}
                >
                  {stageOrders.length}
                </span>
              </div>

              {/* Order Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                {stageOrders.length === 0 ? (
                  <div className="h-44 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                    <Package className="w-5 h-5 text-slate-300 mb-1.5" />
                    <span className="text-[11px] font-medium text-slate-400">
                      No {stage.title.toLowerCase()}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Orders advance here in real time
                    </span>
                  </div>
                ) : (
                  stageOrders.map((order) => {
                    const parsedTitle = parseProductTitle(order.itemsSummary.title || order.items[0]?.name || '');
                    const timeInfo = formatOrderRelativeTime(order.timestamps.createdAt);
                    const isCopied = copiedId === order.id;

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all p-3 space-y-2.5 group"
                      >
                        {/* Card Header: Order # + Time + Type */}
                        <div className="flex items-start justify-between gap-1.5">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span
                                onClick={() => onViewOrder(order)}
                                className="font-bold text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-mono"
                                title="Click to view full order details"
                              >
                                {order.orderNumber}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(order.orderNumber, order.id)}
                                className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                                title="Copy Order Number"
                              >
                                {isCopied ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{timeInfo.relative}</span>
                            </span>
                          </div>

                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200/60 shrink-0">
                            {order.orderType === 'In-Store Hold (2h)' ? 'In-Store Hold' : order.orderType}
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-slate-50/70 rounded-lg p-2 border border-slate-100 text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 truncate">
                              {order.customer.name}
                            </span>
                            <a
                              href={`tel:${order.customer.phone}`}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-mono text-[10px]"
                              title="Call customer"
                            >
                              <Phone className="w-2.5 h-2.5" />
                              <span>{order.customer.phone}</span>
                            </a>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            <span className="truncate">
                              {order.deliveryAddress.locality || order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                            </span>
                          </div>
                        </div>

                        {/* Products & Specs Section */}
                        <div className="flex items-start gap-2 pt-0.5">
                          {/* Image or Icon */}
                          {order.items[0]?.imageUrl ? (
                            <img
                              src={order.items[0].imageUrl}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                                {order.itemsSummary.count}x
                              </span>
                              <span
                                className="font-semibold text-slate-900 text-xs truncate block"
                                title={order.itemsSummary.title}
                              >
                                {parsedTitle.mainTitle}
                              </span>
                            </div>

                            {/* Clean Spec Chips */}
                            {parsedTitle.specs.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {parsedTitle.specs.slice(0, 3).map((spec, i) => (
                                  <span
                                    key={i}
                                    className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200/60 truncate max-w-[110px]"
                                  >
                                    {spec}
                                  </span>
                                ))}
                                {parsedTitle.specs.length > 3 && (
                                  <span className="text-[9px] text-slate-400">
                                    +{parsedTitle.specs.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Financials & OTP Row */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                          <div>
                            <span className="font-extrabold text-slate-900 text-sm">
                              ₹{order.pricing.totalAmount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 block -mt-0.5">
                              {order.payment.status} · {order.payment.mode}
                            </span>
                          </div>

                          {/* Runner Doorstep OTP Badge */}
                          {['accepted', 'ready_to_ship', 'shipped'].includes(order.status) && order.otp && (
                            <div
                              onClick={() => handleCopy(order.otp, `otp-${order.id}`)}
                              className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-900 flex items-center gap-1 cursor-pointer hover:bg-amber-100 transition-colors shadow-2xs"
                              title="Click to copy delivery runner OTP"
                            >
                              <ShieldCheck className="w-3 h-3 text-amber-600" />
                              <span className="font-mono font-black text-xs tracking-wider">
                                OTP: {order.otp}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Card Stage Action Footer */}
                        <div className="pt-1.5 flex items-center justify-between gap-1.5 border-t border-slate-100">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onPrintOrder(order)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Print Invoice / Label"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onViewOrder(order)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="View Order Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Stage Transition Buttons */}
                          <div className="flex items-center gap-1">
                            {order.status === 'new' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    acceptOrder(order.id);
                                    onPrintOrder(order);
                                  }}
                                  className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
                                >
                                  Accept & Print
                                </button>
                                <button
                                  type="button"
                                  onClick={() => rejectOrder(order.id)}
                                  className="px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {order.status === 'accepted' && (
                              <button
                                type="button"
                                onClick={() => markReadyToShip(order.id)}
                                className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
                              >
                                Ready to Ship
                              </button>
                            )}

                            {order.status === 'ready_to_ship' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => broadcastOrderToFleet(order)}
                                  className="px-2.5 py-1 text-[11px] font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                                  title="Broadcast to WhatsApp runner pool"
                                >
                                  <MessageCircle className="w-3 h-3 fill-current" />
                                  <span>Broadcast</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => dispatchOrder(order.id)}
                                  className="px-2 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
                                >
                                  Ship
                                </button>
                              </>
                            )}

                            {order.status === 'shipped' && (
                              <button
                                type="button"
                                onClick={() => setOtpModalOrder(order)}
                                className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
                              >
                                Verify OTP
                              </button>
                            )}

                            {order.status === 'delivered' && (
                              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Completed</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Verify OTP Modal */}
      <VerifyOtpModal
        order={otpModalOrder}
        isOpen={Boolean(otpModalOrder)}
        onClose={() => setOtpModalOrder(null)}
        onConfirm={deliverOrder}
      />
    </div>
  );
};
