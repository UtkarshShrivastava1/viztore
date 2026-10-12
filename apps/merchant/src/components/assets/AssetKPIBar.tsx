import React from 'react';
import { Briefcase, Landmark, Calendar, Calculator, Wrench, Info } from 'lucide-react';
import { useAssetStore } from '../../stores/assetStore.js';

export const AssetKPIBar: React.FC = () => {
  const { kpis } = useAssetStore();

  const cards = [
    {
      title: 'Total Assets',
      value: kpis.totalAssets.toString(),
      subtext: 'All assets',
      hasInfo: true,
      icon: Briefcase,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Total Asset Value',
      value: `₹ ${kpis.totalAssetValue.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
      })}`,
      subtext: 'Current value',
      hasInfo: true,
      icon: Landmark,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Depreciable Assets',
      value: kpis.depreciableAssets.toString(),
      subtext: `${kpis.depreciablePercent}% of total assets`,
      hasInfo: false,
      icon: Calendar,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Fully Depreciated',
      value: kpis.fullyDepreciated.toString(),
      subtext: 'Assets',
      hasInfo: false,
      icon: Calculator,
      iconBg: 'bg-sky-50 text-sky-600',
    },
    {
      title: 'Under Maintenance',
      value: kpis.underMaintenance.toString(),
      subtext: 'Assets',
      hasInfo: false,
      icon: Wrench,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-slate-500 block truncate">{card.title}</span>
              <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
                {card.value}
              </h4>
              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400 font-medium truncate">
                <span>{card.subtext}</span>
                {card.hasInfo && <Info className="w-3 h-3 text-slate-400" />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
