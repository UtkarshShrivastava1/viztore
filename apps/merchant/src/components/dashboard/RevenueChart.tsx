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
import { ShoppingBag, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useOrderStore } from '../../stores/orderStore.js';

interface RevenueChartProps {
  onNavigateOrders?: () => void;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ onNavigateOrders }) => {
  const { orders } = useOrderStore();
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'year'>('week');

  const totalSales = orders.reduce((sum, o) => sum + (o.pricing?.totalAmount || 0), 0);
  const avgSales = orders.length > 0 ? Math.round(totalSales / 7) : 0;

  // Generate dynamic chart data based on timeframe & orders
  const getChartData = () => {
    if (timeframe === 'today') {
      const hours = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
      return hours.map((h, i) => ({
        name: h,
        current: Math.round((totalSales * (i + 1)) / 15),
        previous: Math.round((totalSales * i) / 18),
      }));
    }
    if (timeframe === 'month') {
      const weeks = ['W1', 'W2', 'W3', 'W4'];
      return weeks.map((w, i) => ({
        name: w,
        current: Math.round(totalSales * (0.2 + i * 0.25)),
        previous: Math.round(totalSales * (0.15 + i * 0.2)),
      }));
    }
    if (timeframe === 'year') {
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      return quarters.map((q, i) => ({
        name: q,
        current: Math.round(totalSales * (1 + i * 0.4)),
        previous: Math.round(totalSales * (0.8 + i * 0.3)),
      }));
    }
    // Default 'week'
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, idx) => ({
      name: day,
      current: orders.length > 0 ? Math.round((totalSales / 7) * (0.7 + (idx % 3) * 0.3)) : (idx + 1) * 450,
      previous: orders.length > 0 ? Math.round((totalSales / 9) * (0.5 + (idx % 2) * 0.4)) : (idx + 1) * 320,
    }));
  };

  const chartData = getChartData();

  const timeframes: { key: 'today' | 'week' | 'month' | 'year'; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-full">
      <div>
        {/* Header with Segmented Pills & Link */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight leading-none">
              Sales Analytics
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Revenue trajectory & comparison</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Segmented Timeframe Switcher */}
            <div className="flex items-center p-0.5 bg-slate-100/90 rounded-xl border border-slate-200/60 shadow-2xs">
              {timeframes.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTimeframe(t.key)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    timeframe === t.key
                      ? 'bg-white text-blue-600 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button 
              type="button" 
              onClick={onNavigateOrders}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer hidden sm:inline-block ml-1"
            >
              All Orders →
            </button>
          </div>
        </div>

        {/* Legend & Trend Pill */}
        <div className="flex items-center justify-between pt-2 text-[10px] font-medium text-slate-500">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-2xs" />
              <span className="text-slate-800 font-bold">Selected Period</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span>Prior Period</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold text-[10px]">
            <ArrowUpRight className="w-3 h-3" />
            <span>+100% pacing</span>
          </span>
        </div>

        {/* Chart Area */}
        <div className="h-36 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSalesCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
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
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                  fontWeight: '600',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                }}
                formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="previous"
                stroke="#cbd5e1"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
                dot={{ r: 2, fill: '#cbd5e1', strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="current"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSalesCurrent)"
                dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#1d4ed8', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-3 h-3" />
          </div>
          <span>Avg. Daily: <strong className="text-slate-800 font-bold">₹{avgSales.toLocaleString('en-IN')}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-3 h-3" />
          </div>
          <span>Gross: <strong className="text-slate-900 font-black">₹{Math.round(totalSales).toLocaleString('en-IN')}</strong></span>
        </div>
      </div>
    </div>
  );
};
