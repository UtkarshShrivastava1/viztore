import React, { useState } from 'react';
import { X, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore.js';

export const StockHistoryDrawer: React.FC = () => {
  const {
    historyDrawerItem,
    closeHistoryDrawer,
    transactions,
    setViewMode,
  } = useInventoryStore();

  const [filterType, setFilterType] = useState<'all' | 'stock_in' | 'stock_out'>('all');

  if (!historyDrawerItem) return null;

  // Filter transactions for this specific product or general matching mock
  const productTransactions = transactions.filter((t) => {
    if (filterType === 'stock_in' && t.type !== 'stock_in') return false;
    if (filterType === 'stock_out' && t.type !== 'stock_out') return false;
    return true;
  });

  const handleViewAllHistory = () => {
    closeHistoryDrawer();
    setViewMode('stock_history');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={closeHistoryDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <h2 className="text-base font-bold text-slate-900">Stock History</h2>
          <button
            type="button"
            onClick={closeHistoryDrawer}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Scope Card */}
        <div className="p-6 border-b border-slate-200/80 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3.5">
            <img
              src={historyDrawerItem.imageUrl}
              alt={historyDrawerItem.name}
              className="w-14 h-14 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-xs truncate">
                {historyDrawerItem.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                SKU: {historyDrawerItem.sku}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Barcode: {historyDrawerItem.barcode}
              </p>
              <p className="text-xs font-bold text-slate-800 mt-1">
                Current Stock: <span className="text-blue-600">{historyDrawerItem.stock} Units</span>
              </p>
            </div>
          </div>

          {/* Filter dropdown */}
          <div className="relative mt-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Transactions</option>
              <option value="stock_in">Stock In (Added)</option>
              <option value="stock_out">Stock Out (Deducted)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Timeline Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {productTransactions.map((tx) => {
              const isIncrease = tx.type === 'stock_in';
              return (
                <div key={tx.id} className="relative group">
                  {/* Timeline icon dot */}
                  <div
                    className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs ${
                      isIncrease
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {isIncrease ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 space-y-1 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">
                        {isIncrease ? 'Stock Updated (Increase)' : 'Stock Updated (Decrease)'}
                      </span>
                      <span
                        className={`font-black text-xs ${
                          isIncrease ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isIncrease ? `+${tx.quantity}` : `${tx.quantity}`} Units
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-0.5 pt-0.5">
                      <p>
                        New stock: <span className="font-bold text-slate-800">{tx.stockAfter}</span>
                      </p>
                      <p>
                        Reason: <span className="text-slate-700">{tx.notes || tx.referenceType}</span>
                      </p>
                      <p>
                        Reference: <span className="font-mono text-slate-700">{tx.referenceNo}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>{tx.date}</span>
                      <span>By: <strong className="text-slate-600">{tx.performedBy}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-white shrink-0">
          <button
            type="button"
            onClick={handleViewAllHistory}
            className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors shadow-2xs cursor-pointer text-center"
          >
            View All Stock History
          </button>
        </div>
      </div>
    </div>
  );
};
