import React, { useState } from 'react';
import { Plus, ChevronDown, Upload, Download, MessageSquare } from 'lucide-react';
import { useCustomerStore, Customer } from '../stores/customerStore.js';
import { CustomerKPIBar } from '../components/customers/CustomerKPIBar.js';
import { CustomerTable } from '../components/customers/CustomerTable.js';
import { AddCustomerView } from '../components/customers/AddCustomerView.js';
import { CustomerDetailsDrawer } from '../components/customers/CustomerDetailsDrawer.js';
import { AddStoreCreditModal } from '../components/customers/AddStoreCreditModal.js';

export const CustomersPage: React.FC = () => {
  const { viewMode, setViewMode } = useCustomerStore();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [creditModalCustomer, setCreditModalCustomer] = useState<Customer | null>(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
  };

  const handleOpenCreditModal = (customer: Customer) => {
    setCreditModalCustomer(customer);
    setIsCreditModalOpen(true);
  };

  if (viewMode === 'add') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <AddCustomerView onBack={() => setViewMode('list')} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header matching mockup 6.0.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customers</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your customers and track their outstanding, sales and payment history.
          </p>
        </div>

        <div className="flex items-center gap-3 relative">
          <button
            type="button"
            onClick={() => setViewMode('add')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>More Actions</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isMoreActionsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-30 animate-in fade-in duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert('Import Customers via CSV/Excel feature active.');
                  }}
                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-2 text-left"
                >
                  <Upload className="w-4 h-4 text-slate-400" />
                  Import Customers
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert('Customer Statement Download feature ready.');
                  }}
                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-2 text-left"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  Export All (CSV)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert('Bulk customer notification broadcast triggered.');
                  }}
                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-2 text-left"
                >
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  Broadcast Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5 KPI Metric Cards matching 6.0.png */}
      <CustomerKPIBar />

      {/* Customer Directory Table */}
      <CustomerTable
        onSelectCustomer={handleSelectCustomer}
        onOpenCreditModal={handleOpenCreditModal}
      />

      {/* Slide-over Profile & Credit Drawer */}
      <CustomerDetailsDrawer
        customer={selectedCustomer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenCreditModal={handleOpenCreditModal}
      />

      {/* Store Credit Management Modal */}
      <AddStoreCreditModal
        customer={creditModalCustomer}
        isOpen={isCreditModalOpen}
        onClose={() => {
          setIsCreditModalOpen(false);
          // Sync selected customer state if viewing in drawer
          if (selectedCustomer && creditModalCustomer && selectedCustomer.id === creditModalCustomer.id) {
            const updated = useCustomerStore.getState().customers.find((c) => c.id === selectedCustomer.id);
            if (updated) setSelectedCustomer(updated);
          }
        }}
      />
    </div>
  );
};
