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
  Sparkles,
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
      sublabel: 'Tax / GST Invoice',
      icon: FileText,
      iconGradient: 'from-blue-600 to-indigo-600',
      iconColor: 'text-white',
      badgeBg: 'bg-blue-600 text-white',
      isPrimary: true,
      onClick: onOpenCreateInvoice || (() => onNavigate('billing')),
    },
    {
      label: 'Add Product',
      sublabel: 'New catalog item',
      icon: PlusCircle,
      iconGradient: 'from-emerald-500 to-teal-600',
      iconColor: 'text-white',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      onClick: onOpenAddProduct || (() => {
        useCatalogStore.getState().setWizardStep(1);
        useCatalogStore.getState().resetDraftProduct();
        useCatalogStore.getState().setActiveView('wizard');
        onNavigate('catalog');
      }),
    },
    {
      label: 'Adjust Stock',
      sublabel: 'Inventory update',
      icon: Boxes,
      iconGradient: 'from-amber-500 to-orange-500',
      iconColor: 'text-white',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      onClick: () => onNavigate('inventory'),
    },
    // Row 2
    {
      label: 'Add Expense',
      sublabel: 'Record expense',
      icon: ReceiptIndianRupee,
      iconGradient: 'from-rose-500 to-pink-600',
      iconColor: 'text-white',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      onClick: () => onNavigate('expenses'),
    },
    {
      label: 'View Payouts',
      sublabel: 'Settlement wallet',
      icon: Landmark,
      iconGradient: 'from-purple-500 to-indigo-600',
      iconColor: 'text-white',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/80',
      onClick: () => onNavigate('payouts'),
    },
    {
      label: 'Refund Order',
      sublabel: 'Process return',
      icon: RotateCcw,
      iconGradient: 'from-teal-500 to-cyan-600',
      iconColor: 'text-white',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200/80',
      onClick: onOpenRefundOrder || (() => onNavigate('returns')),
    },
    // Row 3
    {
      label: 'POS Counter',
      sublabel: 'Manual order entry',
      icon: ShoppingCart,
      iconGradient: 'from-sky-500 to-blue-600',
      iconColor: 'text-white',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200/80',
      onClick: onOpenCreateOrder || (() => onNavigate('orders')),
    },
    {
      label: 'Add Customer',
      sublabel: 'Khata CRM entry',
      icon: UserPlus,
      iconGradient: 'from-indigo-500 to-blue-700',
      iconColor: 'text-white',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      onClick: onOpenAddCustomer || (() => onNavigate('customers')),
    },
    {
      label: 'View Reports',
      sublabel: 'Sales analytics',
      icon: BarChart3,
      iconGradient: 'from-violet-500 to-purple-700',
      iconColor: 'text-white',
      badgeBg: 'bg-violet-50 text-violet-700 border-violet-200/80',
      onClick: () => onNavigate('analytics'),
    },
  ];

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-full">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight leading-none">
            Quick Actions
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
          9 shortcuts
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 flex-1">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              type="button"
              onClick={act.onClick}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer group shadow-2xs hover:-translate-y-0.5 hover:shadow-sm ${
                act.isPrimary
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-600 text-white shadow-blue-500/20'
                  : 'bg-white border-slate-200/80 hover:border-blue-300 hover:bg-slate-50/70'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-1.5 shadow-2xs transition-transform group-hover:scale-110 ${
                  act.isPrimary
                    ? 'bg-white/20 text-white'
                    : `bg-gradient-to-tr ${act.iconGradient} text-white`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div>
                <span
                  className={`text-[11px] font-bold block truncate leading-tight ${
                    act.isPrimary ? 'text-white' : 'text-slate-800 group-hover:text-blue-600'
                  }`}
                >
                  {act.label}
                </span>
                <span
                  className={`text-[9px] block truncate mt-0.5 font-medium ${
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
