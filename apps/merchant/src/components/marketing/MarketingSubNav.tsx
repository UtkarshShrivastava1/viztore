import React from 'react';
import {
  LayoutDashboard,
  Megaphone,
  Percent,
  Ticket,
  Bell,
  Mail,
  Gift,
  Share2,
  BarChart2,
} from 'lucide-react';
import { useMarketingStore, MarketingSubTab } from '../../stores/marketingStore.js';

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
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'discounts', label: 'Discounts & Offers', icon: Percent },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'push', label: 'Push Notifications', icon: Bell },
    { id: 'email_sms', label: 'Email & SMS', icon: Mail },
    { id: 'loyalty', label: 'Loyalty Program', icon: Gift },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'text-blue-600 bg-blue-50/70 border-b-2 border-blue-600 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
