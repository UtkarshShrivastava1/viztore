import React from 'react';
import {
  Package,
  ShoppingCart,
  DollarSign,
  Tag,
  ShoppingBag,
  Download,
  Info,
  Eye,
} from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore.js';

export const HighSellingReportTab: React.FC = () => {
  const { productsPerformance } = useAnalyticsStore();

  return (
    <div className="space-y-6">
      {/* 5 KPI Cards Matching 12.6.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Products Sold */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">
                Total Products Sold
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-1">1,245</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 8.72% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Quantity Sold */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">
                Total Quantity Sold
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-1">3,245</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 10.25% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Sales */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Sales (₹)</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 12,45,320</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 10.25% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Average Selling Price */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">
                Average Selling Price (₹)
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 383.45</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 3.65% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Orders</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">1,245</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 8.72% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>
      </div>

      {/* Grid: Top Selling Products Table (2 Cols) vs Sidebar Categories & Insights (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Top Selling Products</h3>
            <button
              onClick={() => alert('Exporting top selling table...')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Table</span>
            </button>
          </div>

          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3 text-center">#</th>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">Unit Sold</th>
                  <th className="py-3 px-3 text-right">Sales Value (₹)</th>
                  <th className="py-3 px-3 text-right">% of Total Sales</th>
                  <th className="py-3 px-3 text-center">Total Orders</th>
                  <th className="py-3 px-3 text-right">Average Selling Price (₹)</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {productsPerformance.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      {p.imageUrl && (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-7 h-7 rounded object-cover border border-slate-200 shrink-0"
                        />
                      )}
                      <span>{p.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {p.sku}
                    </td>
                    <td className="py-3 px-3 text-slate-700">{p.category}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {p.quantitySold}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-900 whitespace-nowrap">
                      ₹ {p.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-700">
                      {p.percentageOfTotalSales?.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600">
                      {p.totalOrders || '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-900 whitespace-nowrap">
                      ₹ {p.avgSellingPrice?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => alert(`Product performance details for ${p.name}`)}
                        className="px-2 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-lg inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 border-t border-slate-100 text-[11px] text-slate-400 bg-slate-50/50">
            Showing 1 to {productsPerformance.length} of 125 products
          </div>
        </div>

        {/* Right Column: Top Categories Donut & Insights */}
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 mb-2">
              Top Categories (By Sales Value)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Men's Wear
                </span>
                <span className="font-bold">₹ 5,12,300 (41.14%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Women's Wear
                </span>
                <span className="font-bold">₹ 3,45,200 (27.72%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Footwear
                </span>
                <span className="font-bold">₹ 1,88,690 (15.15%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  Accessories
                </span>
                <span className="font-bold">₹ 98,130 (7.88%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  Others
                </span>
                <span className="font-bold">₹ 90,000 (7.21%)</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              Insights
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <p>
                <span className="font-bold text-slate-900">Men's Wear</span> is the top performing category with <span className="font-bold text-emerald-700">41.14%</span> of total sales.
              </p>
              <p>
                <span className="font-bold text-slate-900">Men's Cotton Shirt</span> is the highest selling product in this period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
