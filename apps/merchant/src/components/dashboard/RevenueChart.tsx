import React, { useState } from 'react';
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

interface RevenueChartProps {
  onNavigateOrders?: () => void;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ onNavigateOrders }) => {
  const { orders } = useOrderStore();
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const totalSales = orders.reduce((sum, o) => sum + (o.pricing?.totalAmount || 0), 0);
  const avgSales = orders.length > 0 ? Math.round(totalSales / 7) : 0;

  // Generate dynamic chart data based on timeframe & orders
  const getChartData = () => {
    if (timeframe === 'today') {
      const hours = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
      return hours.map((h, i) => ({
        name: h,
        thisWeek: Math.round((totalSales * (i + 1)) / 15),
        lastWeek: Math.round((totalSales * i) / 18),
      }));
    }
    if (timeframe === 'month') {
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      return weeks.map((w, i) => ({
        name: w,
        thisWeek: Math.round(totalSales * (0.2 + i * 0.25)),
        lastWeek: Math.round(totalSales * (0.15 + i * 0.2)),
      }));
    }
    if (timeframe === 'year') {
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      return quarters.map((q, i) => ({
        name: q,
        thisWeek: Math.round(totalSales * (1 + i * 0.4)),
        lastWeek: Math.round(totalSales * (0.8 + i * 0.3)),
      }));
    }
    // Default 'week'
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, idx) => ({
      name: day,
      thisWeek: orders.length > 0 ? Math.round((totalSales / 7) * (0.7 + (idx % 3) * 0.3)) : (idx + 1) * 450,
      lastWeek: orders.length > 0 ? Math.round((totalSales / 9) * (0.5 + (idx % 2) * 0.4)) : (idx + 1) * 320,
    }));
  };

  const chartData = getChartData();

  const timeframeLabels: Record<string, string> = {
    today: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year',
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Header with Dropdown & Link */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 relative">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Sales Overview</h3>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-[11px] font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span>{timeframeLabels[timeframe]}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 animate-in fade-in duration-100">
                  {(['today', 'week', 'month', 'year'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTimeframe(t);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-blue-50 transition-colors cursor-pointer ${
                        timeframe === t ? 'text-[#1668F6] font-bold bg-blue-50/60' : 'text-slate-700'
                      }`}
                    >
                      {timeframeLabels[t]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              type="button" 
              onClick={onNavigateOrders}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              View All Orders
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 pt-1.5 text-[10px] font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-600 rounded-full" />
            <span className="text-slate-700 font-semibold">{timeframeLabels[timeframe]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b-2 border-dashed border-blue-400" />
            <span>Previous Period</span>
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
                tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
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

      {/* Summary Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
          <span>Avg. daily: <strong className="text-slate-800 font-bold">₹{avgSales.toLocaleString()}</strong></span>
        </div>
        <div>
          Total: <strong className="text-slate-900 font-extrabold">₹{totalSales.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
};
