import React, { useState } from 'react';
import {
  Package,
  TrendingUp,
  Percent,
  CreditCard,
  Search,
  ChevronDown,
  Info,
  ChevronLeft,
  ChevronRight,
  Shirt,
  Sparkles,
} from 'lucide-react';

export const ProductWiseReportTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [brandFilter, setBrandFilter] = useState('All Brands');
  const [storeFilter, setStoreFilter] = useState('All Stores');

  const productsData = [
    { id: 1, name: "Men's Cotton Shirt", sku: 'MS001', category: "Men's Wear", sales: 25450, qty: 120, cogs: 12000, profit: 13450, margin: '52.8%', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=80' },
    { id: 2, name: "Women's Kurti", sku: 'WK002', category: "Women's Wear", sales: 18750, qty: 95, cogs: 8400, profit: 10350, margin: '55.2%', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=100&auto=format&fit=crop&q=80' },
    { id: 3, name: "Denim Jeans", sku: 'DJ003', category: "Men's Wear", sales: 15200, qty: 60, cogs: 7500, profit: 7700, margin: '50.7%', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&auto=format&fit=crop&q=80' },
    { id: 4, name: "Casual Shoes", sku: 'CS004', category: 'Footwear', sales: 12980, qty: 45, cogs: 6200, profit: 6780, margin: '52.2%', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&auto=format&fit=crop&q=80' },
    { id: 5, name: "T-Shirt (Pack of 2)", sku: 'TS005', category: "Men's Wear", sales: 10450, qty: 80, cogs: 4800, profit: 5650, margin: '54.1%', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80' },
    { id: 6, name: "Women's Handbag", sku: 'WH006', category: 'Accessories', sales: 9800, qty: 40, cogs: 4500, profit: 5300, margin: '54.1%', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&auto=format&fit=crop&q=80' },
    { id: 7, name: "Saree", sku: 'SR007', category: "Women's Wear", sales: 8750, qty: 35, cogs: 4200, profit: 4550, margin: '52.0%', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&auto=format&fit=crop&q=80' },
    { id: 8, name: "Track Pant", sku: 'TP008', category: "Men's Wear", sales: 7650, qty: 45, cogs: 3600, profit: 4050, margin: '52.9%', img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=100&auto=format&fit=crop&q=80' },
    { id: 9, name: "Formal Shirt", sku: 'FS009', category: "Men's Wear", sales: 6900, qty: 30, cogs: 3100, profit: 3800, margin: '55.1%', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=100&auto=format&fit=crop&q=80' },
    { id: 10, name: "Ladies Sandals", sku: 'LS010', category: 'Footwear', sales: 6450, qty: 28, cogs: 2900, profit: 3550, margin: '55.0%', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&auto=format&fit=crop&q=80' },
  ];

  const filtered = productsData.filter((p) => {
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.sku.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (categoryFilter !== 'All Categories' && p.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-3.5">
      {/* 4 KPI Cards Matching 11.2.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Products Sold */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Products Sold</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">1,245</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 12.8%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Sales */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Sales (₹)</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,38,500.00</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 15.4%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Profit */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Profit (₹)</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 58,450.00</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 16.2%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Profit Margin */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Profit Margin</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">42.2%</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 3.8%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>
      </div>

      {/* Filter Row Matching 11.2.png */}
      <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by name, SKU, barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All Categories">All Categories</option>
              <option value="Men's Wear">Men's Wear</option>
              <option value="Women's Wear">Women's Wear</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All Brands">All Brands</option>
              <option value="Roadster">Roadster</option>
              <option value="Zara">Zara</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All Stores">All Stores</option>
              <option value="Store 1">Store 1</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('All Categories');
              setBrandFilter('All Brands');
              setStoreFilter('All Stores');
            }}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Reset
          </button>
          <button className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs">
            Apply
          </button>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left Table (8 Cols) */}
        <div className="lg:col-span-8 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 mb-3">
              <h3 className="text-xs font-bold text-slate-900">Product Wise Report</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-semibold bg-slate-50/50">
                    <th className="py-2 px-2.5">#</th>
                    <th className="py-2 px-2.5">Product</th>
                    <th className="py-2 px-2.5">SKU</th>
                    <th className="py-2 px-2.5">Category</th>
                    <th className="py-2 px-2.5 text-right">Sales (₹)</th>
                    <th className="py-2 px-2.5 text-right">Quantity Sold</th>
                    <th className="py-2 px-2.5 text-right">COGS (₹)</th>
                    <th className="py-2 px-2.5 text-right">Profit (₹)</th>
                    <th className="py-2 px-2.5 text-right">Profit Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-2.5 font-medium text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-2.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-7 h-7 rounded-md object-cover border border-slate-200 shrink-0"
                          />
                          <span className="font-semibold text-slate-900 truncate max-w-[120px]">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-2.5 font-mono text-slate-500">{item.sku}</td>
                      <td className="py-2 px-2.5 text-slate-600">{item.category}</td>
                      <td className="py-2 px-2.5 text-right font-semibold text-slate-900">
                        ₹ {item.sales.toLocaleString('en-IN')}.00
                      </td>
                      <td className="py-2 px-2.5 text-right font-medium">{item.qty}</td>
                      <td className="py-2 px-2.5 text-right text-slate-600">
                        ₹ {item.cogs.toLocaleString('en-IN')}.00
                      </td>
                      <td className="py-2 px-2.5 text-right font-semibold text-emerald-600">
                        ₹ {item.profit.toLocaleString('en-IN')}.00
                      </td>
                      <td className="py-2 px-2.5 text-right font-bold text-slate-900">{item.margin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Showing 1 - 10 of 245 products</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-400">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-semibold">1</button>
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">2</button>
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">3</button>
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">4</button>
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">5</button>
              <span className="px-1">...</span>
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">25</button>
              <button className="p-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-400">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1 ml-2">
                <span>Show</span>
                <select className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-[11px]">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Top Selling Products */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-slate-900">Top Selling Products</h4>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1.5">#</th>
                  <th className="pb-1.5">Product</th>
                  <th className="pb-1.5 text-right">Quantity Sold</th>
                  <th className="pb-1.5 text-right">Sales (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-1.5 text-slate-400">1</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[90px]">Men's Cotton Shirt</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">320</td>
                  <td className="py-1.5 text-right font-semibold">₹ 25,450</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">2</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[90px]">Women's Kurti</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">280</td>
                  <td className="py-1.5 text-right font-semibold">₹ 18,750</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">3</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[90px]">Denim Jeans</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">240</td>
                  <td className="py-1.5 text-right font-semibold">₹ 15,200</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">4</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[90px]">T-Shirt (Pack of 2)</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">210</td>
                  <td className="py-1.5 text-right font-semibold">₹ 10,450</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">5</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[90px]">Casual Shoes</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">180</td>
                  <td className="py-1.5 text-right font-semibold">₹ 12,980</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Category Wise Performance */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-slate-900">Category Wise Performance</h4>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1.5">Category</th>
                  <th className="pb-1.5 text-right">Total Sales (₹)</th>
                  <th className="pb-1.5 text-right">Qty Sold</th>
                  <th className="pb-1.5 text-right">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-1.5 font-medium text-slate-900">Men's Wear</td>
                  <td className="py-1.5 text-right font-semibold">₹ 61,050</td>
                  <td className="py-1.5 text-right">305</td>
                  <td className="py-1.5 text-right font-bold text-emerald-600">↑ 52.5%</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-medium text-slate-900">Women's Wear</td>
                  <td className="py-1.5 text-right font-semibold">₹ 40,650</td>
                  <td className="py-1.5 text-right">230</td>
                  <td className="py-1.5 text-right font-bold text-emerald-600">↑ 53.1%</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-medium text-slate-900">Footwear</td>
                  <td className="py-1.5 text-right font-semibold">₹ 21,780</td>
                  <td className="py-1.5 text-right">125</td>
                  <td className="py-1.5 text-right font-bold text-emerald-600">↑ 53.4%</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-medium text-slate-900">Accessories</td>
                  <td className="py-1.5 text-right font-semibold">₹ 14,500</td>
                  <td className="py-1.5 text-right">70</td>
                  <td className="py-1.5 text-right font-bold text-emerald-600">↑ 54.6%</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-medium text-slate-900">Others</td>
                  <td className="py-1.5 text-right font-semibold">₹ 7,250</td>
                  <td className="py-1.5 text-right">45</td>
                  <td className="py-1.5 text-right font-bold text-emerald-600">↑ 51.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
