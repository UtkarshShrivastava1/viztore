import React, { useState } from 'react';
import {
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Percent,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore.js';

export const ProductWiseReportTab: React.FC = () => {
  const { productsPerformance } = useAnalyticsStore();

  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [brandFilter, setBrandFilter] = useState('All Brands');

  const filteredProducts = productsPerformance.filter((p) => {
    if (categoryFilter !== 'All Categories' && p.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter Bar Matching 12.2.png */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Category
            </span>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[140px]"
              >
                <option value="All Categories">All Categories</option>
                <option value="Men's Wear">Men's Wear</option>
                <option value="Women's Wear">Women's Wear</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Brand */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Brand
            </span>
            <div className="relative">
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[130px]"
              >
                <option value="All Brands">All Brands</option>
                <option value="Urban Classics">Urban Classics</option>
                <option value="TrendVibe">TrendVibe</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Product */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Product
            </span>
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[150px]">
                <option value="all">All Products</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={() => {
              setCategoryFilter('All Categories');
              setBrandFilter('All Brands');
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-2"
          >
            Clear Filters
          </button>
          <button className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
            Apply Filters
          </button>
        </div>
      </div>

      {/* 5 KPI Cards Matching 12.2.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Products */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Products</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">245</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 8.45% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Quantity Sold */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Quantity Sold</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">3,245</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 10.23% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Revenue */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Revenue</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,45,230.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 12.54% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Profit */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Profit</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 28,450.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 15.22% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Avg. Profit Margin */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Avg. Profit Margin</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">19.59%</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 2.15% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>
      </div>

      {/* Grid: Product Performance Table (2 Cols) vs Sidebar Widgets (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Performance Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Product Performance</h3>
          </div>

          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">Quantity Sold</th>
                  <th className="py-3 px-3 text-right">Total Revenue (₹)</th>
                  <th className="py-3 px-3 text-right">Total Cost (₹)</th>
                  <th className="py-3 px-3 text-right">Gross Profit (₹)</th>
                  <th className="py-3 px-3 text-right">Profit Margin (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
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
                    <td className="py-3 px-3 text-right font-medium text-slate-900">
                      {p.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500">
                      {p.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600">
                      {p.grossProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      {p.profitMargin.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 border-t border-slate-100 text-[11px] text-slate-400 bg-slate-50/50">
            Showing 1 to {filteredProducts.length} of 245 products
          </div>
        </div>

        {/* Right Column: Top 5 Profitable + Top 5 Low Margin + Insight */}
        <div className="space-y-6">
          {/* Top 5 Profitable Products */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 mb-3">
              Top 5 Profitable Products
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Belt</span>
                <div className="text-right">
                  <span className="font-bold text-emerald-600">₹ 1,890.00</span>
                  <span className="text-[10px] text-slate-400 ml-2">46.67%</span>
                </div>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Cap</span>
                <div className="text-right">
                  <span className="font-bold text-emerald-600">₹ 1,680.00</span>
                  <span className="text-[10px] text-slate-400 ml-2">48.00%</span>
                </div>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Wrist Watch</span>
                <div className="text-right">
                  <span className="font-bold text-emerald-600">₹ 3,490.00</span>
                  <span className="text-[10px] text-slate-400 ml-2">42.30%</span>
                </div>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Saree</span>
                <div className="text-right">
                  <span className="font-bold text-emerald-600">₹ 3,330.00</span>
                  <span className="text-[10px] text-slate-400 ml-2">38.06%</span>
                </div>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="font-semibold text-slate-800">T-Shirt (Pack of 2)</span>
                <div className="text-right">
                  <span className="font-bold text-emerald-600">₹ 5,960.00</span>
                  <span className="text-[10px] text-slate-400 ml-2">39.21%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 Low Profit Margin Products */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 mb-3">
              Top 5 Low Profit Margin Products
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Men's Cotton Shirt</span>
                <div className="text-right">
                  <span className="font-medium text-slate-700">₹ 8,670.00</span>
                  <span className="text-[10px] text-slate-400 ml-2">34.06%</span>
                </div>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Denim Jeans</span>
                <div className="text-right">
                  <span className="font-medium text-slate-700">₹ 4,530.00</span>
                  <span className="text-[10px] text-slate-400 ml-2">34.87%</span>
                </div>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Casual Shoes</span>
                <div className="text-right">
                  <span className="font-medium text-slate-700">₹ 3,730.00</span>
                  <span className="text-[10px] text-slate-400 ml-2">35.70%</span>
                </div>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Formal Shirt</span>
                <div className="text-right">
                  <span className="font-medium text-slate-700">₹ 3,700.00</span>
                  <span className="text-[10px] text-slate-400 ml-2">37.56%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insight Box */}
          <div className="p-4 bg-blue-50/60 border border-blue-200/60 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              <span className="font-bold">Insight:</span> Men's Wear category has highest sales volume of 1,250 units (38.52% of total).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
