import React from 'react';
import { Package, ShoppingBag, AlertTriangle, PackageX, Boxes } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore.js';

export const InventoryKPICards: React.FC = () => {
  const { totalProductCount } = useInventoryStore();

  const totalStock = 12842;
  const lowStockCount = 78;
  const outOfStockCount = 38;
  const stockValueFormatted = '\u20B918,75,320';

  const cards = [
    {
      id: 'total-products',
      title: 'Total Products',
      value: totalProductCount.toLocaleString(),
      change: '12%',
      isPositive: true,
      icon: Package,
      iconBg: 'bg-[#ebf3ff] text-[#2563eb]',
    },
    {
      id: 'total-stock',
      title: 'Total Stock (Units)',
      value: totalStock.toLocaleString(),
      change: '8%',
      isPositive: true,
      icon: ShoppingBag,
      iconBg: 'bg-[#ecfdf5] text-[#16a34a]',
    },
    {
      id: 'low-stock',
      title: 'Low Stock',
      value: lowStockCount.toLocaleString(),
      change: '5%',
      isPositive: false,
      icon: AlertTriangle,
      iconBg: 'bg-[#fff7ed] text-[#ea580c]',
    },
    {
      id: 'out-of-stock',
      title: 'Out of Stock',
      value: outOfStockCount.toLocaleString(),
      change: '3%',
      isPositive: false,
      icon: PackageX,
      iconBg: 'bg-[#fef2f2] text-[#dc2626]',
    },
    {
      id: 'stock-value',
      title: 'Stock Value',
      value: stockValueFormatted,
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
            className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow duration-200"
          >
            {/* Header: Title on Left, Icon Container on Right */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                {card.title}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Value & Trend */}
            <div className="mt-2.5">
              <div className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                {card.value}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                {card.isPositive ? (
                  <span className="font-semibold text-[#16a34a] flex items-center">
                    &uarr; {card.change}
                  </span>
                ) : (
                  <span className="font-semibold text-[#dc2626] flex items-center">
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
  );
};
