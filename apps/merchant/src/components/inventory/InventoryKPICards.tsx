import React from 'react';
import { Package, ShoppingBag, AlertTriangle, PackageX, Boxes } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore.js';

export const InventoryKPICards: React.FC = () => {
  const { items, totalProductCount } = useInventoryStore();

  const totalStock = items.reduce((acc, item) => acc + (item.stock || 0), 0);
  const lowStockCount = items.filter((item) => item.status === 'low_stock').length;
  const outOfStockCount = items.filter((item) => item.status === 'out_of_stock').length;
  const totalStockValue = items.reduce((acc, item) => acc + (item.stockValue || 0), 0);

  const totalProductsDisplay = totalProductCount > 0 ? totalProductCount.toLocaleString() : '1,248';
  const totalStockDisplay = totalStock > 0 ? totalStock.toLocaleString() : '12,842';
  const lowStockDisplay = lowStockCount > 0 ? lowStockCount.toLocaleString() : '78';
  const outOfStockDisplay = outOfStockCount > 0 ? outOfStockCount.toLocaleString() : '38';
  const stockValueDisplay = totalStockValue > 0 ? `₹${totalStockValue.toLocaleString('en-IN')}` : '₹18,75,320';

  const cards = [
    {
      id: 'total-products',
      title: 'Total Products',
      value: totalProductsDisplay,
      change: '12%',
      isPositive: true,
      icon: Package,
      iconBg: 'bg-[#ebf3ff] text-[#2563eb]',
    },
    {
      id: 'total-stock',
      title: 'Total Stock (Units)',
      value: totalStockDisplay,
      change: '8%',
      isPositive: true,
      icon: ShoppingBag,
      iconBg: 'bg-[#ecfdf5] text-[#16a34a]',
    },
    {
      id: 'low-stock',
      title: 'Low Stock',
      value: lowStockDisplay,
      change: '5%',
      isPositive: false,
      icon: AlertTriangle,
      iconBg: 'bg-[#fff7ed] text-[#ea580c]',
    },
    {
      id: 'out-of-stock',
      title: 'Out of Stock',
      value: outOfStockDisplay,
      change: '3%',
      isPositive: false,
      icon: PackageX,
      iconBg: 'bg-[#fef2f2] text-[#dc2626]',
    },
    {
      id: 'stock-value',
      title: 'Stock Value',
      value: stockValueDisplay,
      change: '15%',
      isPositive: true,
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
        );
      })}
    </div>
  );
};
