import React, { useState } from 'react';
import { Plus, Upload, ChevronDown, Download, Home, ChevronRight } from 'lucide-react';
import { useExpenseStore, Expense } from '../stores/expenseStore.js';
import { ExpensesKPIBar } from '../components/expenses/ExpensesKPIBar.js';
import { ExpensesTable } from '../components/expenses/ExpensesTable.js';
import { AddExpenseView } from '../components/expenses/AddExpenseView.js';
import { ExpenseDetailModal } from '../components/expenses/ExpenseDetailModal.js';

interface ExpensesPageProps {
  onNavigateHome?: () => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ onNavigateHome }) => {
  const { viewMode, setViewMode } = useExpenseStore();

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  if (viewMode === 'add') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <AddExpenseView onBack={() => setViewMode('list')} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb matching mockup 8.0.png */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={onNavigateHome}
          className="hover:text-blue-600 flex items-center gap-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800">Expenses</span>
      </div>

      {/* Header matching mockup 8.0.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Expenses</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track and manage all your business expenses in one place.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative">
          <button
            type="button"
            onClick={() => setViewMode('add')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Import CSV/Excel expenses feature')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import Expenses</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors shadow-2xs"
            >
              <span>More Actions</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isMoreActionsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-30 animate-in fade-in duration-100 text-left">
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert('Exporting expenses ledger to CSV...');
                  }}
                  className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  Export All (CSV)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5 KPI Cards matching 8.0.png */}
      <ExpensesKPIBar />

      {/* Expenses Table matching 8.0.png */}
      <ExpensesTable onViewExpense={(exp) => setSelectedExpense(exp)} />

      {/* Expense Detail Voucher Modal */}
      <ExpenseDetailModal
        expense={selectedExpense}
        isOpen={!!selectedExpense}
        onClose={() => setSelectedExpense(null)}
      />
    </div>
  );
};
