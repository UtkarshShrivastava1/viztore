import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileText,
  BadgeIndianRupee,
  CheckCircle,
  FileCheck,
  Hourglass,
  Search,
  Download,
  Settings,
  Eye,
  Plus,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { useBillingStore, IQuote, QuoteStatus } from '../../stores/billingStore.js';

interface QuotesTableViewProps {
  onCreateQuoteClick: () => void;
}

export const QuotesTableView: React.FC<QuotesTableViewProps> = ({
  onCreateQuoteClick,
}) => {
  const {
    quotes,
    quoteSearchQuery,
    setQuoteSearchQuery,
    quoteDateRange,
    setQuoteDateRange,
    quoteStatusFilter,
    setQuoteStatusFilter,
    quoteExpirationFilter,
    setQuoteExpirationFilter,
    quoteCustomerFilter,
    setQuoteCustomerFilter,
    quoteCurrentTab,
    setQuoteCurrentTab,
    clearQuoteFilters,
    updateQuoteStatus,
    convertQuoteToInvoice,
  } = useBillingStore();

  const [activeStatusMenuQuoteId, setActiveStatusMenuQuoteId] = useState<string | null>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) {
        setActiveStatusMenuQuoteId(null);
      }
    };
    if (activeStatusMenuQuoteId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeStatusMenuQuoteId]);

  // Dynamic KPI calculations derived purely from live quotes array
  const { totalQuoteValue, acceptedCount, convertedCount, expiredCount } = useMemo(() => {
    let value = 0;
    let accepted = 0;
    let converted = 0;
    let expired = 0;
    quotes.forEach((q) => {
      value += q.totalAmount || 0;
      if (q.status === 'accepted') accepted += 1;
      if (q.status === 'converted') converted += 1;
      if (q.status === 'expired') expired += 1;
    });
    return {
      totalQuoteValue: value,
      acceptedCount: accepted,
      convertedCount: converted,
      expiredCount: expired,
    };
  }, [quotes]);

  const kpiCards = [
    {
      id: 'total-quotes',
      title: 'Total Quotes',
      value: quotes.length.toLocaleString('en-IN'),
      change: quotes.length > 0 ? '+100%' : '0%',
      isPositive: quotes.length > 0,
      icon: FileText,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      id: 'total-value',
      title: 'Total Value',
      value: `₹${totalQuoteValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      change: totalQuoteValue > 0 ? '+100%' : '0%',
      isPositive: totalQuoteValue > 0,
      icon: BadgeIndianRupee,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      id: 'accepted-quotes',
      title: 'Accepted Quotes',
      value: acceptedCount.toLocaleString('en-IN'),
      change: acceptedCount > 0 ? '+100%' : '0%',
      isPositive: acceptedCount > 0,
      icon: CheckCircle,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      id: 'converted-quotes',
      title: 'Converted to Invoices',
      value: convertedCount.toLocaleString('en-IN'),
      change: convertedCount > 0 ? '+100%' : '0%',
      isPositive: convertedCount > 0,
      icon: FileCheck,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      id: 'expired-quotes',
      title: 'Expired Quotes',
      value: expiredCount.toLocaleString('en-IN'),
      change: expiredCount > 0 ? 'Follow-up' : '0',
      isPositive: expiredCount === 0,
      icon: Hourglass,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
  ];

  const statusTabs = [
    'All Quotes',
    'Draft',
    'Sent',
    'Accepted',
    'Declined',
    'Expired',
    'Converted',
    'Cancelled',
  ];

  // Filtered quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      // Tab filter
      if (quoteCurrentTab !== 'All Quotes') {
        const tabKey = quoteCurrentTab.toLowerCase().replace(' ', '_');
        if (q.status !== tabKey) return false;
      }

      // Search
      if (quoteSearchQuery.trim()) {
        const query = quoteSearchQuery.toLowerCase();
        const matchNo = q.quoteNo.toLowerCase().includes(query);
        const matchCust = q.customerName.toLowerCase().includes(query);
        const matchPhone = q.customerPhone.includes(query);
        if (!matchNo && !matchCust && !matchPhone) return false;
      }

      // Status filter dropdown
      if (quoteStatusFilter !== 'All Statuses') {
        const sKey = quoteStatusFilter.toLowerCase().replace(' ', '_');
        if (q.status !== sKey) return false;
      }

      // Customer filter
      if (quoteCustomerFilter !== 'All') {
        if (q.customerName !== quoteCustomerFilter) return false;
      }

      return true;
    });
  }, [
    quotes,
    quoteCurrentTab,
    quoteSearchQuery,
    quoteStatusFilter,
    quoteCustomerFilter,
  ]);

  const getStatusPill = (quote: IQuote) => {
    let style = 'bg-blue-50 text-blue-700 border-blue-200';
    let label = 'Sent';

    switch (quote.status) {
      case 'accepted':
        style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        label = 'Accepted';
        break;
      case 'converted':
        style = 'bg-indigo-50 text-indigo-700 border-indigo-200';
        label = 'Converted';
        break;
      case 'declined':
        style = 'bg-rose-50 text-rose-700 border-rose-200';
        label = 'Declined';
        break;
      case 'expired':
        style = 'bg-amber-50 text-amber-700 border-amber-200';
        label = 'Expired';
        break;
      case 'draft':
        style = 'bg-slate-100 text-slate-700 border-slate-200';
        label = 'Draft';
        break;
      case 'cancelled':
        style = 'bg-slate-100 text-slate-500 border-slate-200 line-through';
        label = 'Cancelled';
        break;
      case 'sent':
      default:
        style = 'bg-blue-50 text-blue-700 border-blue-200';
        label = 'Sent';
        break;
    }

    return (
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() =>
            setActiveStatusMenuQuoteId(
              activeStatusMenuQuoteId === quote.id ? null : quote.id
            )
          }
          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${style}`}
        >
          <span>{label}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {/* Change Status Popup Menu (5.4.png) */}
        {activeStatusMenuQuoteId === quote.id && (
          <div
            ref={statusMenuRef}
            className="absolute left-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 text-left"
          >
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Change Status
            </div>
            {(
              [
                { key: 'draft', label: 'Draft', dot: 'bg-slate-400' },
                { key: 'sent', label: 'Sent', dot: 'bg-blue-500' },
                { key: 'accepted', label: 'Accepted', dot: 'bg-emerald-500' },
                { key: 'declined', label: 'Declined', dot: 'bg-rose-500' },
                { key: 'expired', label: 'Expired', dot: 'bg-amber-500' },
                { key: 'converted', label: 'Converted', dot: 'bg-indigo-500' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  updateQuoteStatus(quote.id, opt.key);
                  setActiveStatusMenuQuoteId(null);
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors ${
                  quote.status === opt.key ? 'font-bold text-blue-600' : 'text-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">{card.title}</span>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                  {card.value}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs">
                  {card.isPositive ? (
                    <span className="font-semibold text-emerald-600 flex items-center">
                      &uarr; {card.change}
                    </span>
                  ) : (
                    <span className="font-semibold text-rose-600 flex items-center">
                      &darr; {card.change}
                    </span>
                  )}
                  <span className="text-slate-400 font-normal">from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar & Filters (5.4.png) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search with Ctrl + K */}
          <div className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quoteSearchQuery}
              onChange={(e) => setQuoteSearchQuery(e.target.value)}
              placeholder="Search by quote no., customer name, or phone..."
              className="w-full pl-9 pr-20 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shadow-3xs">
              Ctrl + K
            </kbd>
          </div>

          {/* Date Range Dropdown */}
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Date Range
            </span>
            <select
              value={quoteDateRange}
              onChange={(e) => setQuoteDateRange(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Status
            </span>
            <select
              value={quoteStatusFilter}
              onChange={(e) => setQuoteStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Accepted">Accepted</option>
              <option value="Sent">Sent</option>
              <option value="Converted">Converted</option>
              <option value="Declined">Declined</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Expiration Dropdown */}
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Expiration
            </span>
            <select
              value={quoteExpirationFilter}
              onChange={(e) => setQuoteExpirationFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Active">Active (&gt; 0 days)</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Customer Dropdown */}
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Customer
            </span>
            <select
              value={quoteCustomerFilter}
              onChange={(e) => setQuoteCustomerFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Ramesh Stores">Ramesh Stores</option>
              <option value="Sharma Garments">Sharma Garments</option>
              <option value="Kiran Collection">Kiran Collection</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="pt-3 sm:pt-4">
            <button
              type="button"
              onClick={clearQuoteFilters}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-3xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* 8 Status Tabs + Export & Settings */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {statusTabs.map((tab) => {
              const isActive = quoteCurrentTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setQuoteCurrentTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600 rounded-b-none bg-blue-50/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => alert('Exporting Quotes to CSV/Excel...')}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-3xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              Export
            </button>
            <button
              type="button"
              className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              title="Table Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quotes Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Quote No.</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Created By</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-10 h-10 text-slate-300 stroke-1" />
                      <p className="text-sm font-semibold text-slate-700">No quotes yet</p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Create estimates or formal quotations for customers and convert them into live invoices with 1 click.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 px-4 font-bold text-blue-600 hover:underline cursor-pointer">
                      {q.quoteNo}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {q.date}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">
                          {q.customerName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {q.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{q.validUntil}</div>
                      {q.validDaysText && (
                        <span
                          className={`text-[11px] font-semibold ${
                            q.validDaysText.includes('Expired')
                              ? 'text-rose-600'
                              : q.validDaysText.includes('Today') || q.validDaysText.includes('1 day')
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {q.validDaysText}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                      ₹{q.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">{getStatusPill(q)}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {q.createdBy}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => alert(`Viewing details for quote ${q.quoteNo}`)}
                          className="px-2 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="View Quote"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        {/* + Convert to Invoice trigger (shown on Accepted quotes) */}
                        {q.status === 'accepted' && (
                          <button
                            type="button"
                            onClick={() => convertQuoteToInvoice(q.id)}
                            className="px-2.5 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                            title="Convert to Invoice"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Convert to Invoice</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => alert(`More options for quote ${q.quoteNo}`)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing 1 to {Math.min(filteredQuotes.length, 8)} of 356 quotes
          </span>
          <button
            type="button"
            className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            Scroll to load more &darr;
          </button>
        </div>
      </div>
    </div>
  );
};
