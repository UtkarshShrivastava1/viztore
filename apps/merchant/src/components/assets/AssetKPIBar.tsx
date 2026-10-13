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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">{card.title}</span>
                <h4 className="text-xl lg:text-2xl font-black text-slate-900 mt-1 tracking-tight">
                  {card.value}
                </h4>
              </div>
              <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs text-slate-400 font-medium">
              <span>{card.subtext}</span>
              {card.hasInfo && <Info className="w-3.5 h-3.5 text-slate-400" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};
