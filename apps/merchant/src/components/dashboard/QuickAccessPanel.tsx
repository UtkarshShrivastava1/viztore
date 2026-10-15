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

interface QuickAccessPanelProps {
  onNavigate: (tab: DashboardTab) => void;
  onOpenAddProduct: () => void;
  onOpenBulkUpload: () => void;
}

export const QuickAccessPanel: React.FC<QuickAccessPanelProps> = ({
  onNavigate,
  onOpenAddProduct,
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
      onClick: () => onNavigate('billing'),
    },
    {
      label: 'Add Product',
      sublabel: 'Add new product',
      icon: PlusCircle,
      color: 'text-emerald-600 bg-emerald-50',
      borderColor: 'border-emerald-200/80',
      onClick: onOpenAddProduct,
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
      onClick: () => onNavigate('returns'),
    },
    // Row 3
    {
      label: 'Create Order',
      sublabel: 'Manual order',
      icon: ShoppingCart,
      color: 'text-sky-600 bg-sky-50',
      borderColor: 'border-sky-200/80',
      onClick: () => onNavigate('orders'),
    },
    {
      label: 'Add Customer',
      sublabel: 'Add new customer',
      icon: UserPlus,
      color: 'text-blue-600 bg-blue-50',
      borderColor: 'border-blue-200/80',
      onClick: () => onNavigate('customers'),
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
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2 h-full">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={`p-1.5 rounded-xl border text-left flex items-center gap-1.5 transition-all hover:shadow-2xs group ${
                action.isPrimary
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  : `bg-white hover:bg-slate-50/80 ${action.borderColor}`
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  action.isPrimary ? 'bg-white/20 text-white' : action.color
                }`}
              >
                <Icon className="w-3 h-3" />
              </div>
              <div className="min-w-0 flex-1">
                <span
                  className={`text-[10px] font-bold block truncate leading-tight ${
                    action.isPrimary ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {action.label}
                </span>
                <span
                  className={`text-[8px] block truncate leading-none mt-0.5 ${
                    action.isPrimary ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {action.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
