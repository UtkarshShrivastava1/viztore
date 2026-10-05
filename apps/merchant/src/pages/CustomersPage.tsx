import React, { useState } from 'react';
import { Plus, ChevronDown, Upload, Download, FileText, ChevronUp } from 'lucide-react';
import { useCustomerStore, Customer } from '../stores/customerStore.js';
import { CustomerKPIBar } from '../components/customers/CustomerKPIBar.js';
import { CustomerTable } from '../components/customers/CustomerTable.js';
import { AddCustomerView } from '../components/customers/AddCustomerView.js';
import { CustomerDetailsDrawer } from '../components/customers/CustomerDetailsDrawer.js';
import { CustomerStatementDrawer } from '../components/customers/CustomerStatementDrawer.js';
import { AddStoreCreditModal } from '../components/customers/AddStoreCreditModal.js';

export const CustomersPage: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    editingCustomer,
    setEditingCustomer,
    isStatementDrawerOpen,
    statementCustomer,
    openCustomerStatement,
    closeCustomerStatement,
  } = useCustomerStore();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [creditModalCustomer, setCreditModalCustomer] = useState<Customer | null>(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setViewMode('add');
    setIsDrawerOpen(false);
  };

  const handleOpenCreditModal = (customer: Customer) => {
    setCreditModalCustomer(customer);
    setIsCreditModalOpen(true);
  };

  if (viewMode === 'add') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <AddCustomerView
          editingCustomer={editingCustomer}
          onBack={() => {
            setEditingCustomer(null);
            setViewMode('list');
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-3.5">
      {/* Page Header matching mockup 6.0.png & 6.6.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Customers</h1>
          <p className="text-[11px] text-slate-500">
            Manage your customers and track their outstanding, sales and payment history.
          </p>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* More Actions Dropdown (6.6.png) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>More Actions</span>
              {isMoreActionsOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {isMoreActionsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-40 animate-in fade-in duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert('Import Customers: Please select CSV/Excel file to upload.');
                  }}
                  className="w-full px-4 py-2.5 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-start gap-3 text-left"
                >
                  <Upload className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold">Import Customers</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Upload CSV/Excel file
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert('Exporting customer data...');
                  }}
                  className="w-full px-4 py-2.5 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-start gap-3 text-left"
                >
                  <Download className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold">Export Customers</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Download customer data
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert('Bulk downloading customer statements...');
                  }}
                  className="w-full px-4 py-2.5 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-start gap-3 text-left"
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold">Download Customer Statement</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Bulk download statements
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* + Add Customer Button (6.0.png) */}
          <button
            type="button"
            onClick={() => {
              setEditingCustomer(null);
              setViewMode('add');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* 3 KPI Metric Cards (6.0.png) */}
      <CustomerKPIBar />

      {/* Customer Directory Table (6.0.png) */}
      <CustomerTable
        onSelectCustomer={handleSelectCustomer}
        onEditCustomer={handleEditCustomer}
        onOpenStatements={(c, tab) => openCustomerStatement(c, tab || 'history')}
        onOpenCreditModal={handleOpenCreditModal}
      />

      {/* Slide-over Profile Details Drawer (6.2.png) */}
      <CustomerDetailsDrawer
        customer={selectedCustomer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenCreditModal={handleOpenCreditModal}
        onEditCustomer={handleEditCustomer}
        onOpenStatements={(c) => {
          setIsDrawerOpen(false);
          openCustomerStatement(c, 'history');
        }}
      />

      {/* Slide-over Statements Drawer (6.3.png & 6.4.png) */}
      <CustomerStatementDrawer
        customer={statementCustomer}
        isOpen={isStatementDrawerOpen}
        onClose={closeCustomerStatement}
        onEditCustomer={(c) => {
          closeCustomerStatement();
          handleEditCustomer(c);
        }}
        onViewCustomer={(c) => {
          closeCustomerStatement();
          handleSelectCustomer(c);
        }}
      />

      {/* Store Credit Management Modal */}
      <AddStoreCreditModal
        customer={creditModalCustomer}
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
      />
    </div>
  );
};
