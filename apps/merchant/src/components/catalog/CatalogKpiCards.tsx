import React from 'react';
import { Package, ShoppingBag, AlertTriangle, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { useCatalogStore } from '../../stores/catalogStore.js';

export const CatalogKpiCards: React.FC = () => {
  const { kpis, products } = useCatalogStore();

  const totalProducts = products.length > 0 ? products.length : kpis.totalProducts;
  const totalStockUnits = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const activeCount = products.length > 0 ? products.filter((p) => p.status === 'active').length : kpis.activeProducts;
  const lowStockCount = products.length > 0 ? products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length : kpis.lowStock;
  const outOfStockCount = products.length > 0 ? products.filter((p) => p.stock <= 0 || p.status === 'out_of_stock').length : kpis.outOfStock;
  const draftCount = products.length > 0 ? products.filter((p) => p.status === 'draft').length : kpis.draft;

  const activePct = totalProducts > 0 ? Math.round((activeCount / totalProducts) * 100) : 0;

  const cards = [
    {
      id: 'total',
      title: 'Total Products',
      value: totalProducts.toLocaleString(),
      icon: Package,
      topBorder: 'border-t-blue-600',
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      badge: totalProducts === 0 ? 'Empty Catalog' : `${totalStockUnits.toLocaleString()} units`,
      subtext: totalProducts === 0 ? 'no items' : 'in inventory',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'active',
      title: 'Active Products',
      value: activeCount.toLocaleString(),
      icon: ShoppingBag,
      topBorder: 'border-t-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: `${activePct}% published`,
      subtext: 'live & discoverable',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'low',
      title: 'Low Stock',
      value: lowStockCount.toLocaleString(),
      icon: AlertTriangle,
      topBorder: 'border-t-amber-500',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: lowStockCount === 0 ? '✓ Optimal levels' : `⚠ ${lowStockCount} items low`,
      subtext: lowStockCount === 0 ? 'healthy stock' : 'needs reorder',
      badgeColor: lowStockCount === 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'out',
      title: 'Out of Stock',
      value: outOfStockCount.toLocaleString(),
      icon: AlertCircle,
      topBorder: 'border-t-rose-500',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      badge: outOfStockCount === 0 ? '✓ 0 stockouts' : `✕ ${outOfStockCount} unavailable`,
      subtext: outOfStockCount === 0 ? 'full availability' : 'restock required',
      badgeColor: outOfStockCount === 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'draft',
      title: 'Draft',
      value: draftCount.toLocaleString(),
      icon: FileText,
      topBorder: 'border-t-purple-600',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      badge: draftCount === 0 ? '0 pending drafts' : `● ${draftCount} draft`,
      subtext: draftCount === 0 ? 'all published' : 'awaiting review',
      badgeColor: draftCount === 0 ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`bg-white rounded-2xl border border-slate-200/80 border-t-4 ${card.topBorder} p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${card.iconBg} shadow-3xs group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none font-mono">
                {card.value}
              </h4>
              <div className="flex items-center gap-1.5 mt-2.5 text-xs truncate">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] border ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-normal truncate">
                  {card.subtext}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
