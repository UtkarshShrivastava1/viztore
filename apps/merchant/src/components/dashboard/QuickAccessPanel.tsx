import React from 'react';
import {
  FileText,
  PlusCircle,
  Boxes,
  ReceiptIndianRupee,
  Landmark,
  RotateCcw,
  ShoppingCart,
  UserPlus,
  BarChart3,
} from 'lucide-react';
import { DashboardTab } from './Sidebar.js';
import { useCatalogStore } from '../../stores/catalogStore.js';

interface QuickAccessPanelProps {
  onNavigate: (tab: DashboardTab) => void;
  onOpenAddProduct?: () => void;
  onOpenBulkUpload?: () => void;
  onOpenCreateOrder?: () => void;
  onOpenAddCustomer?: () => void;
  onOpenCreateInvoice?: () => void;
  onOpenRefundOrder?: () => void;
}

export const QuickAccessPanel: React.FC<QuickAccessPanelProps> = ({
  onNavigate,
  onOpenAddProduct,
  onOpenCreateOrder,
  onOpenAddCustomer,
  onOpenCreateInvoice,
  onOpenRefundOrder,
}) => {
  const actions = [
    // Row 1
    {
      label: 'Create New Bill',
      sublabel: 'Tax Invoice / GST Invoice',
      icon: FileText,
      color: 'bg-blue-600 text-white',
      borderColor: 'border-blue-600',
      isPrimary: true,
      onClick: onOpenCreateInvoice || (() => onNavigate('billing')),
    },
    {
      label: 'Add Product',
      sublabel: 'Add new product',
      icon: PlusCircle,
      color: 'text-emerald-600 bg-emerald-50',
      borderColor: 'border-emerald-200/80',
      onClick: onOpenAddProduct || (() => {
        useCatalogStore.getState().setWizardStep(1);
        useCatalogStore.getState().resetDraftProduct();
        useCatalogStore.getState().setActiveView('wizard');
        onNavigate('catalog');
      }),
    },
    {
      label: 'Adjust Stock',
      sublabel: 'Update inventory',
      icon: Boxes,
      color: 'text-amber-600 bg-amber-50',
      borderColor: 'border-amber-200/80',
      onClick: () => onNavigate('inventory'),
    },
    // Row 2
    {
      label: 'Add Expense',
      sublabel: 'Record new expense',
      icon: ReceiptIndianRupee,
      color: 'text-rose-600 bg-rose-50',
      borderColor: 'border-rose-200/80',
      onClick: () => onNavigate('expenses'),
    },
    {
      label: 'View Payouts',
      sublabel: 'Check payouts',
      icon: Landmark,
      color: 'text-purple-600 bg-purple-50',
      borderColor: 'border-purple-200/80',
      onClick: () => onNavigate('payouts'),
    },
    {
      label: 'Refund Order',
      sublabel: 'Process refund',
      icon: RotateCcw,
      color: 'text-teal-600 bg-teal-50',
      borderColor: 'border-teal-200/80',
      onClick: onOpenRefundOrder || (() => onNavigate('returns')),
    },
    // Row 3
    {
      label: 'Create Order',
      sublabel: 'Manual counter POS',
      icon: ShoppingCart,
      color: 'text-sky-600 bg-sky-50',
      borderColor: 'border-sky-200/80',
      onClick: onOpenCreateOrder || (() => onNavigate('orders')),
    },
    {
      label: 'Add Customer',
      sublabel: 'Register customer',
      icon: UserPlus,
      color: 'text-blue-600 bg-blue-50',
      borderColor: 'border-blue-200/80',
      onClick: onOpenAddCustomer || (() => onNavigate('customers')),
    },
    {
      label: 'View Reports',
      sublabel: 'Business insights',
      icon: BarChart3,
      color: 'text-violet-600 bg-violet-50',
      borderColor: 'border-violet-200/80',
      onClick: () => onNavigate('analytics'),
    },
  ];

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900">Quick Actions</h3>
        <span className="text-[10px] text-slate-400 font-medium">9 shortcuts</span>
      </div>

      <div className="grid grid-cols-3 gap-2 flex-1">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              type="button"
              onClick={act.onClick}
              className={`p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between cursor-pointer group shadow-2xs ${
                act.isPrimary
                  ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-1.5 transition-transform group-hover:scale-105 ${
                  act.isPrimary ? 'bg-white/20 text-white' : act.color
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span
                  className={`text-[11px] font-bold block truncate leading-tight ${
                    act.isPrimary ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {act.label}
                </span>
                <span
                  className={`text-[9px] block truncate mt-0.5 leading-none ${
                    act.isPrimary ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {act.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
