import React from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  MessageCircle,
  Package,
  RotateCcw,
  Award,
  DollarSign,
  Plus,
  Minus,
  ExternalLink,
} from 'lucide-react';
import { Customer } from '../../stores/customerStore.js';

interface CustomerDetailsDrawerProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCreditModal: (customer: Customer) => void;
}

export const CustomerDetailsDrawer: React.FC<CustomerDetailsDrawerProps> = ({
  customer,
  isOpen,
  onClose,
  onOpenCreditModal,
}) => {
  if (!isOpen || !customer) return null;

  const initials = customer.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                {initials}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {customer.name}
                </h3>
                <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                  {customer.id} • {customer.customerType}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Actions (WhatsApp & Call) */}
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/91${customer.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                WhatsApp
              </a>
              <a
                href={`tel:${customer.phone}`}
                className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-blue-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                Call Customer
              </a>
            </div>

            {/* Lifetime Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Lifetime Spent
                </span>
                <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                  ₹{customer.totalSales.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Orders
                </span>
                <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                  {customer.totalOrders}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Outstanding Due
                </span>
                <span
                  className={`text-base font-extrabold mt-0.5 block ${
                    customer.outstandingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  ₹{customer.outstandingAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Loyalty Points
                </span>
                <span className="text-base font-extrabold text-indigo-600 mt-0.5 block">
                  {customer.loyaltyPoints} pts
                </span>
              </div>
            </div>

            {/* Store Credit Balance Card */}
            <div className="p-4 bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-slate-50 rounded-2xl border border-indigo-100/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-600">Store Credit Balance</span>
                  <div className="text-2xl font-black text-indigo-950 mt-0.5">
                    ₹{customer.storeCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenCreditModal(customer)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Manage Credit
                </button>
              </div>

              {customer.creditHistory.length > 0 && (
                <div className="mt-3 pt-3 border-t border-indigo-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Recent Credit Logs
                  </span>
                  {customer.creditHistory.slice(0, 2).map((log) => (
                    <div key={log.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 truncate max-w-[200px]">{log.reason}</span>
                      <span
                        className={`font-semibold ${
                          log.type === 'add' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {log.type === 'add' ? '+' : '-'}₹{log.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact & Tax Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Contact & Tax Details
              </h4>
              <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-semibold text-slate-800">{customer.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[220px]">
                    {customer.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">GSTIN:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {customer.gstin || 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Credit Limit:</span>
                  <span className="font-semibold text-slate-800">
                    {customer.creditLimit ? `₹${customer.creditLimit.toLocaleString('en-IN')}` : 'No Limit'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Payment Terms:</span>
                  <span className="font-semibold text-slate-800">{customer.paymentTerms}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Billing Address
              </h4>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                <div>{customer.billingAddress.addressLine1}</div>
                {customer.billingAddress.addressLine2 && (
                  <div>{customer.billingAddress.addressLine2}</div>
                )}
                <div>
                  {customer.billingAddress.city}, {customer.billingAddress.state} -{' '}
                  {customer.billingAddress.pincode}
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent Orders
                </h4>
                <span className="text-[11px] text-blue-600 font-semibold cursor-pointer">
                  View All
                </span>
              </div>

              {customer.recentOrders.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 rounded-xl text-xs text-slate-400">
                  No orders recorded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {customer.recentOrders.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-blue-300 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                          <span>{ord.orderId}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {ord.date} • {ord.itemsCount} items • {ord.paymentMethod}
                        </div>
                      </div>
                      <div className="font-extrabold text-xs text-slate-900">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
