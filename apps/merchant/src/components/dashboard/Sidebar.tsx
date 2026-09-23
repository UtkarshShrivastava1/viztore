import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  Receipt,
  Users,
  Wallet,
  ReceiptText,
  CreditCard,
  FileText,
  HardDrive,
  RotateCcw,
  Landmark,
  BarChart3,
  Megaphone,
  Store,
  Settings,
  Headphones,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { useAuthStore } from '../../stores/authStore.js';
import { useOrderStore } from '../../stores/orderStore.js';
import { useBillingStore, BillingSubTab } from '../../stores/billingStore.js';
import { useStoreManagementStore, StoreManagementSubTab } from '../../stores/storeManagementStore.js';

export type DashboardTab =
  | 'overview'
  | 'orders'
  | 'catalog'
  | 'inventory'
  | 'billing'
  | 'customers'
  | 'wallet'
  | 'expenses'
  | 'assets'
  | 'returns'
  | 'payouts'
  | 'analytics'
  | 'marketing'
  | 'store'
  | 'settings'
  | 'support';

interface SidebarProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  id: DashboardTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: 'blue' | 'green' | 'dark' | 'muted';
  hasChevron?: boolean;
}

const billingSubItems = [
  { id: 'invoices', label: 'Invoices', icon: ReceiptText },
  { id: 'quotes', label: 'Estimates / Quotes', icon: FileText },
] as const;

const storeSubItems = [
  { id: 'sections' as const, label: 'Sections' },
  { id: 'placement' as const, label: 'Product Placement' },
  { id: 'view_settings' as const, label: 'Store View Settings' },
] as const;

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { logout } = useAuthStore();
  const { orders } = useOrderStore();
  const { activeSubTab, setActiveSubTab, setActiveView } = useBillingStore();
  const { activeSubTab: activeStoreSubTab, setActiveSubTab: setActiveStoreSubTab } =
    useStoreManagementStore();

  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const returnsCount = orders.filter((o) => o.status === 'return_requested' || o.status === 'returned').length;

  const menuItems: MenuItem[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: newOrdersCount > 0 ? newOrdersCount : undefined,
      badgeColor: 'blue',
    },
    { id: 'catalog', label: 'Products / Catalog', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'billing', label: 'Billing & Invoicing', icon: Receipt, badge: 'New', badgeColor: 'green' },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'expenses', label: 'Expenses', icon: ReceiptText },
    {
      id: 'returns',
      label: 'Returns & Refunds',
      icon: RotateCcw,
      badge: returnsCount > 0 ? returnsCount : undefined,
      badgeColor: 'muted',
    },
    { id: 'payouts', label: 'Payouts / Settlements', icon: Landmark },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'marketing', label: 'Marketing', icon: Megaphone, hasChevron: true },
    { id: 'store', label: 'Store Management', icon: Store, hasChevron: true },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Support', icon: Headphones },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#081028] text-white border-r border-[#152348] z-30 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#152348] shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Stylized Logo Icon */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
              V
            </div>
            <div className="truncate">
              <h1 className="font-extrabold text-base tracking-tight text-white leading-none capitalize">
                {branding.appName}
              </h1>
              <span className="text-[9px] text-slate-400 font-medium block mt-1 tracking-tight">
                Making Local Stores Viable.
              </span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md mx-auto">
            V
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#152348] transition-colors hidden sm:flex"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isBilling = item.id === 'billing';
          const isStore = item.id === 'store';
          const isActive = currentTab === item.id;
          const isSubActiveItem = isBilling && isActive && activeSubTab !== 'invoices';

          return (
            <div key={item.id} className="space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  if (isBilling && currentTab !== 'billing') {
                    setActiveSubTab('invoices');
                    setActiveView('list');
                  }
                  if (isStore && currentTab !== 'store') {
                    setActiveStoreSubTab('sections');
                  }
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 group ${
                  isSubActiveItem
                    ? 'bg-[#101d42] text-white font-semibold border border-[#1d2d5a]'
                    : isActive
                    ? 'bg-[#1a56db] text-white font-semibold shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-[#101d42]'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!isCollapsed && (
                  <>
                    <span className="truncate flex-1 text-left">{item.label}</span>

                    {/* Badge Rendering */}
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none ${
                          item.badgeColor === 'green'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.badgeColor === 'dark'
                            ? 'bg-[#0f172a] text-slate-300 border border-slate-700 font-mono text-[10px]'
                            : 'bg-[#152348] text-slate-300 text-[11px]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.hasChevron && (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                    )}
                  </>
                )}
              </button>

              {/* Sub-navigation tabs for Billing & Invoicing (5.5.png, 5.6.png, 5.8.png) */}
              {isBilling && isActive && !isCollapsed && (
                <div className="pl-4 pr-1 py-1 space-y-0.5 animate-in fade-in duration-150">
                  {billingSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = activeSubTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTab('billing');
                          setActiveSubTab(sub.id);
                          setActiveView('list');
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                          isSubActive
                            ? 'bg-[#1a56db] text-white font-semibold shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-[#101d42]'
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Sub-navigation tabs for Store Management (14.0.png, 14.1.png, 14.2.png) */}
              {isStore && isActive && !isCollapsed && (
                <div className="pl-4 pr-1 py-1 space-y-0.5 animate-in fade-in duration-150">
                  {storeSubItems.map((sub) => {
                    const isSubActive = activeStoreSubTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTab('store');
                          setActiveStoreSubTab(sub.id);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                          isSubActive
                            ? 'bg-[#1a56db] text-white font-semibold shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-[#101d42]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isSubActive ? 'bg-white' : 'bg-slate-500'
                          }`}
                        />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Promo Card: "Grow your business" */}
      {!isCollapsed && (
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-b from-[#101d42] to-[#0d1735] border border-[#1b2b57] relative overflow-hidden shrink-0">
          <div className="relative z-10 space-y-2">
            <h4 className="text-xs font-bold text-white leading-tight">Grow your business</h4>
            <p className="text-[10px] text-slate-300 leading-tight">
              Run ads, grow sales and reach more customers on {branding.appName}.
            </p>
            <button
              type="button"
              onClick={() => onSelectTab('marketing')}
              className="px-3 py-1.5 rounded-lg bg-[#1a56db] hover:bg-blue-600 text-white text-[11px] font-semibold transition-colors shadow-sm"
            >
              Create Ad
            </button>
          </div>
          {/* Megaphone icon illustration placeholder */}
          <div className="absolute -right-2 -bottom-2 opacity-80 text-blue-400">
            <Megaphone className="w-12 h-12 rotate-[-15deg]" />
          </div>
        </div>
      )}

      {/* Bottom Logout */}
      <div className="p-3 border-t border-[#152348] shrink-0">
        <button
          type="button"
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
