import React from 'react';
import {
  Store,
  FileText,
  Clock,
  Receipt,
  Percent,
  CreditCard,
  Truck,
  Bell,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useSettingsStore, SettingsSubTab } from '../../stores/settingsStore.js';
import { StoreProfileTab } from './StoreProfileTab.js';
import { BusinessInfoTab } from './BusinessInfoTab.js';
import { StoreTimingsTab } from './StoreTimingsTab.js';
import { BillingInvoicingTab } from './BillingInvoicingTab.js';
import { TaxGstTab } from './TaxGstTab.js';
import { PaymentsWalletTab } from './PaymentsWalletTab.js';
import { ShippingReturnsTab } from './ShippingReturnsTab.js';
import { NotificationsTab } from './NotificationsTab.js';
import { SecurityLoginTab } from './SecurityLoginTab.js';

interface SettingsHubViewProps {
  onNavigateToBillingSettings?: () => void;
  onNavigateToSupport?: () => void;
}

interface NavItem {
  id: SettingsSubTab;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'store_profile', label: 'Store Profile', icon: Store },
  { id: 'business_info', label: 'Business Information', icon: FileText },
  { id: 'timings_pickup', label: 'Store Timings & Pickup', icon: Clock },
  { id: 'billing_invoicing', label: 'Billing & Invoicing', icon: Receipt },
  { id: 'tax_gst', label: 'Tax & GST', icon: Percent },
  { id: 'payments_wallet', label: 'Payments & Wallet', icon: CreditCard },
  { id: 'shipping_returns', label: 'Shipping & Returns', icon: Truck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security_login', label: 'Security & Login', icon: ShieldCheck },
];

export const SettingsHubView: React.FC<SettingsHubViewProps> = ({
  onNavigateToSupport,
}) => {
  const { activeSubTab, setActiveSubTab } = useSettingsStore();

  const getHeaderMeta = () => {
    switch (activeSubTab) {
      case 'store_profile':
        return {
          title: 'Settings',
          subtitle: 'Manage your store, business details and preferences.',
          breadcrumb: null,
        };
      case 'business_info':
        return {
          title: 'Business Information',
          subtitle: 'Manage your business details to help customers know more about your store.',
          breadcrumb: 'Business Information',
        };
      case 'timings_pickup':
        return {
          title: 'Store Timings & Pickup',
          subtitle: 'Set your store operating hours and manage how customers can pick up their orders.',
          breadcrumb: 'Store Timings & Pickup',
        };
      case 'billing_invoicing':
        return {
          title: 'Billing & Invoicing',
          subtitle: 'Configure how you bill your customers and manage invoices for your orders.',
          breadcrumb: 'Billing & Invoicing',
        };
      case 'tax_gst':
        return {
          title: 'Tax & GST',
          subtitle: 'Manage your tax settings, GST details and how taxes are applied to your products and invoices.',
          breadcrumb: 'Tax & GST',
        };
      case 'payments_wallet':
        return {
          title: 'Payments & Wallet',
          subtitle: 'Manage your payment methods, wallet settings and how you receive payments from customers.',
          breadcrumb: 'Payments & Wallet',
        };
      case 'shipping_returns':
        return {
          title: 'Shipping & Returns',
          subtitle: 'Configure delivery settings and return/refund policies for your orders.',
          breadcrumb: 'Shipping & Returns',
        };
      case 'notifications':
        return {
          title: 'Notifications',
          subtitle: 'Manage notification preferences for orders, payments and other important updates.',
          breadcrumb: 'Notifications',
        };
      case 'security_login':
        return {
          title: 'Security & Login',
          subtitle: 'Manage your account security and login preferences to keep your store safe.',
          breadcrumb: 'Security & Login',
        };
    }
  };

  const headerMeta = getHeaderMeta();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
          <span className="hover:text-slate-800 cursor-pointer">Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span
            onClick={() => setActiveSubTab('store_profile')}
            className={`cursor-pointer ${
              !headerMeta.breadcrumb ? 'text-slate-900 font-bold' : 'hover:text-slate-800'
            }`}
          >
            Settings
          </span>
          {headerMeta.breadcrumb && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold">{headerMeta.breadcrumb}</span>
            </>
          )}
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {headerMeta.title}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">{headerMeta.subtitle}</p>
      </div>

      {/* Main Settings Layout (Left Nav + Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sub-Navigation */}
        <div className="lg:col-span-3 xl:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSubTab(item.id)}
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

        {/* Right Tab Content Area */}
        <div className="lg:col-span-9 xl:col-span-9">
          {activeSubTab === 'store_profile' && <StoreProfileTab />}
          {activeSubTab === 'business_info' && <BusinessInfoTab />}
          {activeSubTab === 'timings_pickup' && <StoreTimingsTab />}
          {activeSubTab === 'billing_invoicing' && <BillingInvoicingTab />}
          {activeSubTab === 'tax_gst' && <TaxGstTab />}
          {activeSubTab === 'payments_wallet' && <PaymentsWalletTab />}
          {activeSubTab === 'shipping_returns' && <ShippingReturnsTab />}
          {activeSubTab === 'notifications' && <NotificationsTab />}
          {activeSubTab === 'security_login' && (
            <SecurityLoginTab onNavigateToSupport={onNavigateToSupport} />
          )}
        </div>
      </div>
    </div>
  );
};
