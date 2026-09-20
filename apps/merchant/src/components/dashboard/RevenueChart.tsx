import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { useOrderStore } from '../../stores/orderStore.js';

export const RevenueChart: React.FC = () => {
  const { orders } = useOrderStore();
  const totalSales = orders.reduce((sum, o) => sum + (o.pricing?.totalAmount || 0), 0);
  const avgSales = orders.length > 0 ? Math.round(totalSales / 7) : 0;

  // Generate dynamic 7-day chart data based on orders
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = days.map((day) => ({
    name: day,
    thisWeek: orders.length > 0 ? Math.round(totalSales / 7) : 0,
    lastWeek: 0,
  }));
  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Header with Dropdown & Link */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Sales Overview</h3>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-[11px] font-medium hover:bg-slate-100 transition-colors"
            >
              <span>This Week</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
            <button type="button" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">
              View All Orders
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 pt-1.5 text-[10px] font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-600 rounded-full" />
            <span className="text-slate-700 font-semibold">This Week</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b-2 border-dashed border-blue-400" />
            <span>Last Week</span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-36 w-full mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="colorThisWeek" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(val: number) => [`₹${val.toLocaleString()}`, '']}
              />
              {/* Last Week Line */}
              <Area
                type="monotone"
                dataKey="lastWeek"
                stroke="#93c5fd"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="none"
                dot={{ r: 2.5, fill: '#93c5fd', strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
              {/* This Week Line */}
              <Area
                type="monotone"
                dataKey="thisWeek"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorThisWeek)"
                dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mini Stat Pills */}
      <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 mt-1">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/60">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-medium block leading-none">Total Sales</span>
            <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">
              ₹{totalSales.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100/80">
          <span className="text-[9px] text-slate-400 font-medium block leading-none">Average Daily Sales</span>
          <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">
            ₹{avgSales.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};
