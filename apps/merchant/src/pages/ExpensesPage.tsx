import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  ChevronDown,
  Home,
  ChevronRight,
  FileText,
  Receipt,
  RotateCcw,
  Zap,
  UserPlus,
  FileCheck,
  Upload,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { useExpenseStore } from '../stores/expenseStore.js';
import { ExpensesKPIBar } from '../components/expenses/ExpensesKPIBar.js';
import { ExpensesTable } from '../components/expenses/ExpensesTable.js';
import { PurchaseDetailsDrawer } from '../components/expenses/PurchaseDetailsDrawer.js';
import { EditPurchaseDrawer } from '../components/expenses/EditPurchaseDrawer.js';
import { CreateCreditNoteDrawer } from '../components/expenses/CreateCreditNoteDrawer.js';
import { AddVendorDrawer } from '../components/expenses/AddVendorDrawer.js';
import { GenerateEWayBillDrawer } from '../components/expenses/GenerateEWayBillDrawer.js';
import { CreatePurchaseOrderModal } from '../components/expenses/CreatePurchaseOrderModal.js';
import { CreatePurchaseBillModal } from '../components/expenses/CreatePurchaseBillModal.js';
import { CreatePurchaseReturnModal } from '../components/expenses/CreatePurchaseReturnModal.js';
import { CreateDirectPurchaseModal } from '../components/expenses/CreateDirectPurchaseModal.js';
import { AddExpenseModal } from '../components/expenses/AddExpenseModal.js';
import { AddExpenseView } from '../components/expenses/AddExpenseView.js';

interface ExpensesPageProps {
  onNavigateHome?: () => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ onNavigateHome }) => {
  const {
    selectedPurchase,
    setSelectedPurchase,
    isEditPurchaseOpen,
    setIsEditPurchaseOpen,
    isCreateCreditNoteOpen,
    setIsCreateCreditNoteOpen,
    isAddVendorOpen,
    setIsAddVendorOpen,
    isGenerateEWayBillOpen,
    setIsGenerateEWayBillOpen,
    setIsCreatePOModalOpen,
    setIsCreateBillModalOpen,
    setIsCreateReturnModalOpen,
    setIsCreateDirectPurchaseOpen,
    setIsAddExpenseModalOpen,
    viewMode,
    setViewMode,
  } = useExpenseStore();

  const [isAddPurchaseMenuOpen, setIsAddPurchaseMenuOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  const purchaseMenuRef = useRef<HTMLDivElement>(null);
  const moreActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (purchaseMenuRef.current && !purchaseMenuRef.current.contains(e.target as Node)) {
        setIsAddPurchaseMenuOpen(false);
      }
      if (moreActionsRef.current && !moreActionsRef.current.contains(e.target as Node)) {
        setIsMoreActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (viewMode === 'add') {
    return (
      <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
        <AddExpenseView onBack={() => setViewMode('list')} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-3.5">
      {/* Breadcrumb + Header compact block matching 8.0.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-0.5">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              <Home className="w-3 h-3" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800">Purchase / Expense</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Purchase / Expense</h1>
          <p className="text-[11px] text-slate-500">
            Manage vendors, purchase orders, expenses, credit notes and e-way bills — all in one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* + Add Expense Button */}
          <button
            type="button"
            onClick={() => setIsAddExpenseModalOpen(true)}
            className="px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>

          {/* + Add Purchase ▾ Split Dropdown Menu (Mockup 8.14.png) */}
          <div className="relative" ref={purchaseMenuRef}>
            <button
              type="button"
              onClick={() => setIsAddPurchaseMenuOpen(!isAddPurchaseMenuOpen)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Purchase</span>
              <ChevronDown className="w-3 h-3 text-blue-200" />
            </button>

            {isAddPurchaseMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddPurchaseMenuOpen(false);
                    setIsCreatePOModalOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-start gap-3 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Create Purchase Order</p>
                    <p className="text-[11px] text-slate-500">Create a new purchase order</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAddPurchaseMenuOpen(false);
                    setIsCreateBillModalOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-start gap-3 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Create Purchase (Bill)</p>
                    <p className="text-[11px] text-slate-500">Record a purchase invoice</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAddPurchaseMenuOpen(false);
                    setIsCreateReturnModalOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-start gap-3 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Create Purchase Return</p>
                    <p className="text-[11px] text-slate-500">Create a purchase return entry</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAddPurchaseMenuOpen(false);
                    setIsCreateDirectPurchaseOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-start gap-3 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Create Direct Purchase</p>
                    <p className="text-[11px] text-slate-500">Quick purchase entry without PO</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* More Actions ▾ Dropdown Menu (Mockup 8.11.png) */}
          <div className="relative" ref={moreActionsRef}>
            <button
              type="button"
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>More Actions</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isMoreActionsOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-2xl py-1.5 z-40 animate-in fade-in duration-100 text-left">
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    setIsAddVendorOpen(true);
                  }}
                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2.5 font-medium transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-slate-500" />
                  <span>Add Vendor</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    setIsGenerateEWayBillOpen(true);
                  }}
                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2.5 font-medium transition-colors"
                >
                  <FileCheck className="w-4 h-4 text-slate-500" />
                  <span>Generate E-Way Bill</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert('Import Purchases modal');
                  }}
                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2.5 font-medium transition-colors"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Import Purchase</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert('Import Expenses modal');
                  }}
                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2.5 font-medium transition-colors"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Import Expense</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert('Import Vendors modal');
                  }}
                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2.5 font-medium transition-colors"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Import Vendors</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert('Downloading procurement & expenses report...');
                  }}
                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2.5 font-medium transition-colors"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Download Report</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic KPI Bar matching 8.0, 8.5, 8.7, 8.8, 8.9, 8.10 */}
      <ExpensesKPIBar />

      {/* High Density Table matching 8.0 - 8.10 with row actions menu 8.1 */}
      <ExpensesTable
        onViewDetails={(item) => setSelectedPurchase(item)}
        onEditItem={(item) => {
          setSelectedPurchase(item);
          setIsEditPurchaseOpen(true);
        }}
        onCreateCreditNote={() => setIsCreateCreditNoteOpen(true)}
        onGenerateEWayBill={() => setIsGenerateEWayBillOpen(true)}
      />

      {/* Bottom Compliance & Information Banner matching Mockup 8.0 & 8.11 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Streamlined Procurement & Expenses</h4>
            <p className="text-[11px] text-slate-500">
              Manage your vendors, purchases, expenses, credit notes and e-way bills in one place.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert('Procurement documentation & compliance guide')}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shrink-0 transition-colors"
        >
          Know More
        </button>
      </div>

      {/* Slide-Over Drawers */}
      <PurchaseDetailsDrawer
        purchase={selectedPurchase}
        isOpen={!!selectedPurchase && !isEditPurchaseOpen}
        onClose={() => setSelectedPurchase(null)}
        onEdit={() => setIsEditPurchaseOpen(true)}
      />
      <EditPurchaseDrawer
        isOpen={isEditPurchaseOpen}
        onClose={() => setIsEditPurchaseOpen(false)}
        onUpdate={() => setIsEditPurchaseOpen(false)}
      />
      <CreateCreditNoteDrawer
        isOpen={isCreateCreditNoteOpen}
        onClose={() => setIsCreateCreditNoteOpen(false)}
        onCreated={() => setIsCreateCreditNoteOpen(false)}
      />
      <AddVendorDrawer
        isOpen={isAddVendorOpen}
        onClose={() => setIsAddVendorOpen(false)}
        onSaved={() => setIsAddVendorOpen(false)}
      />
      <GenerateEWayBillDrawer
        isOpen={isGenerateEWayBillOpen}
        onClose={() => setIsGenerateEWayBillOpen(false)}
        onGenerated={() => setIsGenerateEWayBillOpen(false)}
      />

      {/* Centered Modal Dialogs */}
      <CreatePurchaseOrderModal />
      <CreatePurchaseBillModal />
      <CreatePurchaseReturnModal />
      <CreateDirectPurchaseModal />
      <AddExpenseModal />
    </div>
  );
};
