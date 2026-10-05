import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  Edit2,
  TrendingUp,
  ShoppingBag,
  Wallet,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useCustomerStore, Customer } from '../../stores/customerStore.js';

interface CustomerDetailsDrawerProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCreditModal?: (customer: Customer) => void;
  onEditCustomer?: (customer: Customer) => void;
  onOpenStatements?: (customer: Customer) => void;
}

export const CustomerDetailsDrawer: React.FC<CustomerDetailsDrawerProps> = ({
  customer,
  isOpen,
  onClose,
  onOpenCreditModal,
  onEditCustomer,
  onOpenStatements,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'invoices' | 'payments' | 'statements'
  >('overview');

  if (!isOpen || !customer) return null;

  const initials = customer.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleTabClick = (
    tab: 'overview' | 'orders' | 'invoices' | 'payments' | 'statements'
  ) => {
    setActiveTab(tab);
    if (tab === 'statements' && onOpenStatements) {
      onOpenStatements(customer);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-hidden animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel (6.2.png) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-white h-screen shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <h2 className="text-base font-bold text-slate-900">Customer Details</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Identity Bar */}
          <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-extrabold text-sm flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {customer.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {customer.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-mono">{customer.id}</span>
                <span>|</span>
                <span className="px-2 py-0.2 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px]">
                  {customer.customerType}
                </span>
              </div>
            </div>
          </div>

          {/* 5 Sub-navigation Tabs Strip */}
          <div className="px-6 border-b border-slate-200 flex items-center gap-8 bg-white">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'orders', label: 'Orders' },
                { id: 'invoices', label: 'Invoices' },
                { id: 'payments', label: 'Payments' },
                { id: 'statements', label: 'Statements' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTabClick(t.id)}
                className={`py-3 text-xs font-bold transition-all relative ${
                  activeTab === t.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Drawer Body Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Overview Tab Content (6.2.png) */}
            {activeTab === 'overview' && (
              <>
                {/* 1. Basic Information Card */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-xs text-slate-900">Basic Information</h4>
                    <button
                      type="button"
                      onClick={() => onEditCustomer && onEditCustomer(customer)}
                      className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Customer ID</span>
                      <span className="font-bold text-slate-800 font-mono">{customer.id}</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Customer Type</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px] inline-block mt-0.5">
                        {customer.customerType}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Customer Name</span>
                      <span className="font-bold text-slate-800">{customer.name}</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Display Name</span>
                      <span className="font-semibold text-slate-800">{customer.displayName || customer.name}</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Mobile Number</span>
                      <span className="font-semibold text-slate-800">+91 {customer.phone}</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Email Address</span>
                      <span className="font-semibold text-slate-800 truncate block">{customer.email}</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">GSTIN</span>
                      <span className="font-mono font-semibold text-slate-800">{customer.gstin || '23ABCDE1234F1Z5'}</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Location</span>
                      <span className="font-semibold text-slate-800">{customer.location}</span>
                    </div>

                    <div className="col-span-2">
                      <span className="text-[11px] text-slate-400 block">Address</span>
                      <span className="font-semibold text-slate-800">
                        {customer.billingAddress.addressLine1}
                        {customer.billingAddress.addressLine2 ? `, ${customer.billingAddress.addressLine2}` : ''}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Pincode</span>
                      <span className="font-semibold text-slate-800">{customer.billingAddress.pincode}</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">State</span>
                      <span className="font-semibold text-slate-800">{customer.billingAddress.state}</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Country</span>
                      <span className="font-semibold text-slate-800">{customer.billingAddress.country}</span>
                    </div>
                  </div>
                </div>

                {/* 2. 3 Summary KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Card 1: Outstanding Amount */}
                  <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">Outstanding Amount</span>
                      <span className="text-sm font-black text-rose-600">
                        ₹{customer.outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Total Sales */}
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">Total Sales</span>
                      <span className="text-sm font-black text-slate-900">
                        ₹{customer.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Total Orders */}
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">Total Orders</span>
                      <span className="text-sm font-black text-slate-900">{customer.totalOrders}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Notes Card */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900">Notes</h4>
                    <button
                      type="button"
                      onClick={() => onEditCustomer && onEditCustomer(customer)}
                      className="px-2 py-0.5 text-blue-600 hover:bg-blue-50 rounded text-[11px] font-bold flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {customer.notes ||
                      'Regular customer. Prefers bulk orders during festival season. Contact via WhatsApp for faster response.'}
                  </p>
                </div>

                {/* 4. Footer Metadata */}
                <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <div>
                    <span>Created At</span>
                    <p className="font-semibold text-slate-600 mt-0.5">12 Jan 2024, 10:30 AM</p>
                  </div>
                  <div>
                    <span>Last Updated</span>
                    <p className="font-semibold text-slate-600 mt-0.5">08 May 2024, 04:15 PM</p>
                  </div>
                </div>
              </>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Recent Orders ({customer.recentOrders.length})</h4>
                <div className="space-y-2">
                  {customer.recentOrders.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">{ord.orderId}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {ord.date} • {ord.itemsCount} items • {ord.paymentMethod}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-xs text-slate-900">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="block text-[10px] font-bold text-emerald-600 capitalize">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Invoices</h4>
                <div className="space-y-2">
                  {(customer.statementTransactions || [])
                    .filter((t) => t.type === 'Invoice')
                    .map((inv) => (
                      <div
                        key={inv.id}
                        className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono font-bold text-xs text-blue-600">{inv.referenceNo}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{inv.date}</div>
                        </div>
                        <span className="font-black text-xs text-slate-900">
                          ₹{inv.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Payments Recorded</h4>
                <div className="space-y-2">
                  {(customer.statementTransactions || [])
                    .filter((t) => t.type === 'Payment')
                    .map((pay) => (
                      <div
                        key={pay.id}
                        className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono font-bold text-xs text-emerald-700">{pay.referenceNo}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{pay.date}</div>
                        </div>
                        <span className="font-black text-xs text-emerald-600">
                          ₹{Math.abs(pay.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
