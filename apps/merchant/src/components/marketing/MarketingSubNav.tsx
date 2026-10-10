import React from 'react';
import {
  LayoutDashboard,
  Megaphone,
  Ticket,
} from 'lucide-react';
import { MarketingSubTab } from '../../stores/marketingStore.js';

interface MarketingSubNavProps {
  activeTab: MarketingSubTab;
  onTabChange: (tab: MarketingSubTab) => void;
}

export const MarketingSubNav: React.FC<MarketingSubNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: MarketingSubTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'advertisements', label: 'Advertisements', icon: Megaphone },
    { id: 'discounts_coupons', label: 'Discounts & Coupons', icon: Ticket },
  ];

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeTab === tab.id ||
            (tab.id === 'advertisements' && (activeTab === 'campaigns' as any)) ||
            (tab.id === 'discounts_coupons' &&
              ((activeTab === 'coupons' as any) || (activeTab === 'discounts' as any)));

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-3 text-xs font-bold transition-all relative whitespace-nowrap ${
                isActive
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
