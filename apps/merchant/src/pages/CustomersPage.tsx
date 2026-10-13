import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronDown, Upload, Download, FileText, ChevronUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useCustomerStore, Customer } from '../stores/customerStore.js';
import { CustomerKPIBar } from '../components/customers/CustomerKPIBar.js';
import { CustomerTable } from '../components/customers/CustomerTable.js';
import { AddCustomerView } from '../components/customers/AddCustomerView.js';
import { CustomerDetailsDrawer } from '../components/customers/CustomerDetailsDrawer.js';
import { CustomerStatementDrawer } from '../components/customers/CustomerStatementDrawer.js';
import { AddStoreCreditModal } from '../components/customers/AddStoreCreditModal.js';
import { downloadCSV } from '../utils/csvExport.js';
import { useBillingStore } from '../stores/billingStore.js';
import { useOrderStore } from '../stores/orderStore.js';

export const CustomersPage: React.FC = () => {
  const {
    customers,
    viewMode,
    setViewMode,
    editingCustomer,
    setEditingCustomer,
    isStatementDrawerOpen,
    statementCustomer,
    openCustomerStatement,
    closeCustomerStatement,
    addCustomer,
    syncFromStoreData,
  } = useCustomerStore();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [creditModalCustomer, setCreditModalCustomer] = useState<Customer | null>(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [importNotification, setImportNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync customers from live invoices & orders on mount
  useEffect(() => {
    const invoices = useBillingStore.getState().invoices;
    const orders = useOrderStore.getState().orders;
    if (invoices.length > 0 || orders.length > 0) {
      syncFromStoreData(invoices, orders);
    }
  }, [syncFromStoreData]);

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

  // 1. Export Customers to CSV
  const handleExportCustomers = () => {
    setIsMoreActionsOpen(false);
    const headers = [
      'Customer ID',
      'Name',
      'Customer Type',
      'Phone',
      'Email',
      'Location',
      'Credit Limit (INR)',
      'Outstanding Balance (INR)',
      'Total Sales (INR)',
      'Store Credit (INR)',
      'Payment Terms',
      'Status',
    ];
    const rows = customers.map((c) => [
      c.id,
      c.name,
      c.customerType,
      c.phone,
      c.email,
      c.location,
      c.creditLimit || 0,
      c.outstandingAmount || 0,
      c.totalSales || 0,
      c.storeCredit || 0,
      c.paymentTerms,
      c.status,
    ]);
    downloadCSV('customers_directory', headers, rows);
  };

  // 2. Bulk Download Statements to CSV
  const handleBulkDownloadStatements = () => {
    setIsMoreActionsOpen(false);
    const headers = [
      'Customer ID',
      'Customer Name',
      'Phone',
      'Transaction Date',
      'Transaction Type',
      'Reference No',
      'Amount (INR)',
      'Running Balance (INR)',
    ];
    const rows: (string | number)[][] = [];
    customers.forEach((c) => {
      const txs = c.statementTransactions || [];
      if (txs.length > 0) {
        txs.forEach((tx) => {
          rows.push([
            c.id,
            c.name,
            c.phone,
            tx.date,
            tx.type,
            tx.referenceNo,
            tx.amount,
            tx.balance,
          ]);
        });
      } else {
        rows.push([
          c.id,
          c.name,
          c.phone,
          c.lastOrderDate,
          'Summary',
          'BALANCE',
          c.outstandingAmount,
          c.outstandingAmount,
        ]);
      }
    });
    downloadCSV('customer_statements_ledger', headers, rows);
  };

  // 3. Import Customers from CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          setImportNotification({
            type: 'error',
            message: 'CSV file is empty or missing headers.',
          });
          return;
        }

        const headerLine = lines[0] ?? '';
        const headers = headerLine.split(',').map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
        const nameIdx = headers.findIndex((h) => h.includes('name'));
        const phoneIdx = headers.findIndex((h) => h.includes('phone') || h.includes('mobile'));
        const emailIdx = headers.findIndex((h) => h.includes('email'));
        const typeIdx = headers.findIndex((h) => h.includes('type'));
        const creditLimitIdx = headers.findIndex((h) => h.includes('credit limit') || h.includes('limit'));
        const openingBalanceIdx = headers.findIndex((h) => h.includes('balance') || h.includes('outstanding'));
        const cityIdx = headers.findIndex((h) => h.includes('city') || h.includes('location'));
        const stateIdx = headers.findIndex((h) => h.includes('state'));

        let importedCount = 0;
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (!line) continue;
          const cells = line.split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());
          const getCell = (idx: number): string | undefined => (idx >= 0 && idx < cells.length ? cells[idx] : undefined);

          const name = getCell(nameIdx) || `Imported Customer ${i}`;
          const phone = getCell(phoneIdx) || '+91 90000 00000';
          const email = getCell(emailIdx) || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
          const rawType = getCell(typeIdx) || 'Individual';
          const validTypes = ['Individual', 'Business', 'Retailer', 'Wholesaler'] as const;
          const customerType = validTypes.includes(rawType as any) ? (rawType as any) : 'Individual';
          const creditLimit = creditLimitIdx >= 0 && getCell(creditLimitIdx) ? parseFloat(getCell(creditLimitIdx)!) || 10000 : 10000;
          const openingBalance = openingBalanceIdx >= 0 && getCell(openingBalanceIdx) ? parseFloat(getCell(openingBalanceIdx)!) || 0 : 0;
          const city = getCell(cityIdx) || 'Local';
          const state = getCell(stateIdx) || 'CG';

          addCustomer({
            name,
            customerType,
            phone,
            email,
            creditLimit,
            paymentTerms: '15 Days',
            creditPeriodDays: 15,
            openingBalance,
            status: 'active',
            billingAddress: {
              addressLine1: `${city} Central`,
              city,
              state,
              pincode: '490001',
              country: 'India',
              sameAsShipping: true,
            },
          });
          importedCount++;
        }

        setImportNotification({
          type: 'success',
          message: `Successfully imported ${importedCount} customers from ${file.name}.`,
        });
        setTimeout(() => setImportNotification(null), 5000);
      } catch (err: any) {
        setImportNotification({
          type: 'error',
          message: `Failed to parse CSV file: ${err?.message || 'Invalid format'}`,
        });
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      {/* Hidden CSV File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv,text/csv"
        onChange={handleImportCSV}
        className="hidden"
      />

      {/* Import Notification Banner */}
      {importNotification && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in duration-150 ${
            importNotification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {importNotification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{importNotification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setImportNotification(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

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
                    fileInputRef.current?.click();
                  }}
                  className="w-full px-4 py-2.5 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-start gap-3 text-left"
                >
                  <Upload className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold">Import Customers</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Upload CSV file
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleExportCustomers}
                  className="w-full px-4 py-2.5 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-start gap-3 text-left"
                >
                  <Download className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold">Export Customers</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Download customer directory CSV
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleBulkDownloadStatements}
                  className="w-full px-4 py-2.5 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-start gap-3 text-left"
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold">Download Customer Statement</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Bulk download ledger statements
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
