import React from 'react';
import {
  Store,
  FileText,
  Clock,
  ReceiptIndianRupee,
  Percent,
  CreditCard,
  Truck,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import { useSettingsStore, SettingsSubTab } from '../../stores/settingsStore.js';

export interface SettingsNavTabItem {
  id: SettingsSubTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const SETTINGS_NAV_ITEMS: SettingsNavTabItem[] = [
  { id: 'store_profile', label: 'Store Profile', icon: Store },
  { id: 'business_info', label: 'Business Information', icon: FileText },
  { id: 'timings_pickup', label: 'Store Timings & Pickup', icon: Clock },
  { id: 'billing_invoicing', label: 'Billing & Invoicing', icon: ReceiptIndianRupee },
  { id: 'tax_gst', label: 'Tax & GST', icon: Percent },
  { id: 'payments_wallet', label: 'Payments & Wallet', icon: CreditCard },
  { id: 'shipping_returns', label: 'Shipping & Returns', icon: Truck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security_login', label: 'Security & Login', icon: ShieldCheck },
];

interface SettingsTabsNavProps {
  activeTab?: SettingsSubTab;
  onTabChange?: (tab: SettingsSubTab) => void;
  orientation?: 'vertical' | 'horizontal';
}

export const SettingsTabsNav: React.FC<SettingsTabsNavProps> = ({
  activeTab: propActiveTab,
  onTabChange,
  orientation = 'vertical',
}) => {
  const store = useSettingsStore();
  const currentTab = propActiveTab ?? store.activeSubTab;

  const handleSelect = (tab: SettingsSubTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      store.setActiveSubTab(tab);
    }
  };

  if (orientation === 'horizontal') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {SETTINGS_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-2 space-y-1">
      {SETTINGS_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelect(item.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
              isActive
                ? 'bg-blue-50 text-blue-600 font-bold shadow-2xs relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-blue-600 before:rounded-r'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 ${
                isActive ? 'text-blue-600' : 'text-slate-400'
              }`}
            />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
