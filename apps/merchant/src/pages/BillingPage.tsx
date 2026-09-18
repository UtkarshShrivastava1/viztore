import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useBillingStore } from '../stores/billingStore.js';
import { InvoicesTableView } from '../components/billing/InvoicesTableView.js';
import { QuotesTableView } from '../components/billing/QuotesTableView.js';
import { CreateQuoteView } from '../components/billing/CreateQuoteView.js';
import { BillingSettingsView } from '../components/billing/BillingSettingsView.js';
import { CreateInvoiceModal } from '../components/billing/CreateInvoiceModal.js';
import { BillingHeaderActions } from '../components/billing/BillingHeaderActions.js';

export const BillingPage: React.FC = () => {
  const {
    activeSubTab,
    activeView,
    setActiveSubTab,
    setActiveView,
    isCreateInvoiceModalOpen,
    activeInvoiceForModal,
    openCreateInvoiceModal,
    closeCreateInvoiceModal,
  } = useBillingStore();

  const getBreadcrumb = () => {
    if (activeSubTab === 'invoices' || activeView === 'settings') return null;

    let subTabName = 'Estimates / Quotes';
    let actionName = '';
    if (activeView === 'create_quote') actionName = 'Create Estimate / Quote';

    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 mb-2">
        <button
          type="button"
          onClick={() => {
            setActiveSubTab('invoices');
            setActiveView('list');
          }}
          className="hover:underline"
        >
          Billing & Invoicing
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button
          type="button"
          onClick={() => setActiveView('list')}
          className={`${actionName ? 'hover:underline text-blue-600' : 'text-slate-800'}`}
        >
          {subTabName}
        </button>
        {actionName && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800">{actionName}</span>
          </>
        )}
      </div>
    );
  };

  const getPageHeader = () => {
    if (activeView !== 'list') return null;

    if (activeSubTab === 'quotes') {
      return {
        title: 'Estimates / Quotes',
        subtitle: 'Create estimates/quotes for your customers and convert them into invoices.',
      };
    }

    return {
      title: 'Billing & Invoicing',
      subtitle: 'Create invoices, manage billing and track payments.',
    };
  };

  const headerInfo = getPageHeader();

  return (
    <div className="space-y-5 pb-12">
      {/* Breadcrumb if applicable */}
      {getBreadcrumb()}

      {/* Main Page Header on List views */}
      {headerInfo && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {headerInfo.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{headerInfo.subtitle}</p>
          </div>

          <BillingHeaderActions
            onOpenCreateInvoice={() => openCreateInvoiceModal()}
          />
        </div>
      )}

      {/* Sub-views routing */}
      {activeView === 'settings' && (
        <BillingSettingsView onBack={() => setActiveView('list')} />
      )}

      {activeView === 'create_quote' && (
        <CreateQuoteView onBack={() => setActiveView('list')} />
      )}

      {activeView === 'list' && (
        <>
          {activeSubTab === 'invoices' && <InvoicesTableView />}
          {activeSubTab === 'quotes' && (
            <QuotesTableView onCreateQuoteClick={() => setActiveView('create_quote')} />
          )}
        </>
      )}

      {/* 2-Column Create Invoice Modal Dialog (5.2.png) */}
      <CreateInvoiceModal
        isOpen={isCreateInvoiceModalOpen}
        initialData={activeInvoiceForModal}
        onClose={closeCreateInvoiceModal}
      />
    </div>
  );
};
