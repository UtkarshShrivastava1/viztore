import React from 'react';
import { Package, ShoppingBag, AlertTriangle, PackageX, Boxes } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore.js';

export const InventoryKPICards: React.FC = () => {
  const { items, totalProductCount } = useInventoryStore();

  const totalStock = items.reduce((acc, item) => acc + (item.stock || 0), 0);
  const lowStockCount = items.filter((item) => item.status === 'low_stock').length;
  const outOfStockCount = items.filter((item) => item.status === 'out_of_stock').length;
  const totalStockValue = items.reduce((acc, item) => acc + (item.stockValue || 0), 0);

  const count = totalProductCount || items.length;
  const totalProductsDisplay = count.toLocaleString();
  const totalStockDisplay = totalStock.toLocaleString();
  const lowStockDisplay = lowStockCount.toLocaleString();
  const outOfStockDisplay = outOfStockCount.toLocaleString();
  const stockValueDisplay = `₹${totalStockValue.toLocaleString('en-IN')}`;

  const cards = [
    {
      id: 'total-products',
      title: 'Total Products',
      value: totalProductsDisplay,
      insight: count === 0 ? 'Catalog is empty' : `${items.length} variant${items.length === 1 ? '' : 's'} tracked`,
      isPositive: count > 0,
      icon: Package,
      iconBg: 'bg-[#ebf3ff] text-[#2563eb]',
    },
    {
      id: 'total-stock',
      title: 'Total Stock (Units)',
      value: totalStockDisplay,
      insight: totalStock === 0 ? 'No stock on hand' : `Avg ${(totalStock / Math.max(1, items.length)).toFixed(0)} units / SKU`,
      isPositive: totalStock > 0,
      icon: ShoppingBag,
      iconBg: 'bg-[#ecfdf5] text-[#16a34a]',
    },
    {
      id: 'low-stock',
      title: 'Low Stock',
      value: lowStockDisplay,
      insight: lowStockCount === 0 ? '✓ Healthy stock levels' : `⚠ ${lowStockCount} item${lowStockCount === 1 ? '' : 's'} near limit`,
      isPositive: lowStockCount === 0,
      isWarning: lowStockCount > 0,
      icon: AlertTriangle,
      iconBg: 'bg-[#fff7ed] text-[#ea580c]',
    },
    {
      id: 'out-of-stock',
      title: 'Out of Stock',
      value: outOfStockDisplay,
      insight: outOfStockCount === 0 ? '✓ 0 stockout alerts' : `✕ ${outOfStockCount} item${outOfStockCount === 1 ? '' : 's'} unavailable`,
      isPositive: outOfStockCount === 0,
      isDanger: outOfStockCount > 0,
      icon: PackageX,
      iconBg: 'bg-[#fef2f2] text-[#dc2626]',
    },
    {
      id: 'stock-value',
      title: 'Stock Value',
      value: stockValueDisplay,
      insight: totalStockValue === 0 ? '₹0 inventory valuation' : 'At retail selling price',
      isPositive: totalStockValue > 0,
      icon: Boxes,
      iconBg: 'bg-[#ebf3ff] text-[#2563eb]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-shadow duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500 block truncate">
                {card.title}
              </span>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-xl font-extrabold text-slate-900 tracking-tight mt-2 truncate">
              {card.value}
            </div>

            <div className="flex items-center gap-1.5 mt-1 text-[11px] truncate">
              {card.isPositive ? (
                <span className="font-semibold text-emerald-600 flex items-center">
                  {card.insight}
                </span>
              ) : card.isWarning ? (
                <span className="font-semibold text-amber-600 flex items-center">
                  {card.insight}
                </span>
              ) : card.isDanger ? (
                <span className="font-semibold text-rose-600 flex items-center">
                  {card.insight}
                </span>
              ) : (
                <span className="text-slate-400 font-normal">
                  {card.insight}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
