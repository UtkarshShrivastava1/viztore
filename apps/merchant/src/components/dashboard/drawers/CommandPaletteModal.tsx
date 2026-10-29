import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Package,
  ShoppingBag,
  Users,
  Settings,
  CreditCard,
  RotateCcw,
  Headphones,
  ArrowRight,
  TrendingUp,
  FileText,
  Boxes,
  Compass,
} from 'lucide-react';
import { useOrderStore } from '../../../stores/orderStore.js';
import { useCatalogStore } from '../../../stores/catalogStore.js';
import { useCustomerStore } from '../../../stores/customerStore.js';
import { DashboardTab } from '../Sidebar.js';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: DashboardTab, subTab?: string) => void;
}

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Orders' | 'Products' | 'Customers';
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const orders = useOrderStore((state) => state.orders);
  const setOrderSearch = useOrderStore((state) => state.setSearchQuery);

  const products = useCatalogStore((state) => state.products);
  const setCatalogSearch = useCatalogStore((state) => state.setSearchQuery);

  const customers = useCustomerStore((state) => state.customers);
  const setCustomerSearch = useCustomerStore((state) => state.setSearchQuery);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Static navigation routes
  const navigationItems: PaletteItem[] = useMemo(
    () => [
      {
        id: 'nav-overview',
        title: 'Dashboard Overview',
        subtitle: 'Key business metrics, sales overview & live activity',
        category: 'Navigation',
        icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
        action: () => onNavigate?.('overview'),
      },
      {
        id: 'nav-orders',
        title: 'Orders Hub',
        subtitle: 'Live orders, dispatch tracking, OTP delivery & fulfillment',
        category: 'Navigation',
        icon: <Package className="w-4 h-4 text-emerald-600" />,
        action: () => onNavigate?.('orders'),
      },
      {
        id: 'nav-catalog',
        title: 'Product Catalog',
        subtitle: 'Add products, barcode scanning, category mapping & prices',
        category: 'Navigation',
        icon: <ShoppingBag className="w-4 h-4 text-purple-600" />,
        action: () => onNavigate?.('catalog'),
      },
      {
        id: 'nav-inventory',
        title: 'Inventory Management',
        subtitle: 'Stock counts, low stock alerts & batch adjustments',
        category: 'Navigation',
        icon: <Boxes className="w-4 h-4 text-amber-600" />,
        action: () => onNavigate?.('inventory'),
      },
      {
        id: 'nav-billing',
        title: 'Counter POS & Billing',
        subtitle: 'Quick barcode bill slip, GST invoices & quotations',
        category: 'Navigation',
        icon: <FileText className="w-4 h-4 text-indigo-600" />,
        action: () => onNavigate?.('billing'),
      },
      {
        id: 'nav-customers',
        title: 'Customer Directory',
        subtitle: 'Purchase history, loyalty credits & address details',
        category: 'Navigation',
        icon: <Users className="w-4 h-4 text-teal-600" />,
        action: () => onNavigate?.('customers'),
      },
      {
        id: 'nav-returns',
        title: 'Returns & Refunds Desk',
        subtitle: 'Doorstep pickup approval, return inspections & refunds',
        category: 'Navigation',
        icon: <RotateCcw className="w-4 h-4 text-rose-600" />,
        action: () => onNavigate?.('returns'),
      },
      {
        id: 'nav-settlements',
        title: 'Payouts & Bank Settlements',
        subtitle: 'Wallet balance, daily payout cycle & bank account',
        category: 'Navigation',
        icon: <CreditCard className="w-4 h-4 text-cyan-600" />,
        action: () => onNavigate?.('payouts'),
      },
      {
        id: 'nav-store_management',
        title: 'Store Front CMS & Sections',
        subtitle: 'Banners, brand logo, mobile sections & storefront link',
        category: 'Navigation',
        icon: <Compass className="w-4 h-4 text-blue-500" />,
        action: () => onNavigate?.('store'),
      },
      {
        id: 'nav-settings',
        title: 'Store Settings & Profile',
        subtitle: 'Operating timings, delivery radius, GST & account',
        category: 'Navigation',
        icon: <Settings className="w-4 h-4 text-slate-600" />,
        action: () => onNavigate?.('settings'),
      },
      {
        id: 'nav-support',
        title: 'Support & Help Desk',
        subtitle: 'Submit support tickets, FAQs & toll-free assistance',
        category: 'Navigation',
        icon: <Headphones className="w-4 h-4 text-rose-500" />,
        action: () => onNavigate?.('support'),
      },
    ],
    [onNavigate]
  );

  // Compute matched items
  const filteredItems: PaletteItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // When empty, display top navigation shortcuts
      return navigationItems;
    }

    const results: PaletteItem[] = [];

    // 1. Navigation Matches
    navigationItems.forEach((nav) => {
      if (
        nav.title.toLowerCase().includes(q) ||
        (nav.subtitle && nav.subtitle.toLowerCase().includes(q))
      ) {
        results.push(nav);
      }
    });

    // 2. Order Matches
    if (orders && orders.length > 0) {
      orders.forEach((o) => {
        const orderNum = o.orderNumber || o.id;
        const custName = o.customer?.name || '';
        const custPhone = o.customer?.phone || '';
        if (
          orderNum.toLowerCase().includes(q) ||
          custName.toLowerCase().includes(q) ||
          custPhone.includes(q)
        ) {
          results.push({
            id: `order-${o.id}`,
            title: `Order ${orderNum}`,
            subtitle: `${custName || 'Customer'} • ₹${o.pricing?.totalAmount || 0} • Status: ${o.status}`,
            category: 'Orders',
            icon: <Package className="w-4 h-4 text-emerald-600" />,
            action: () => {
              setOrderSearch(orderNum);
              onNavigate?.('orders');
            },
          });
        }
      });
    }

    // 3. Product Matches
    if (products && products.length > 0) {
      products.forEach((p) => {
        const name = p.name || '';
        const sku = p.sku || '';
        const category = p.category || '';
        if (
          name.toLowerCase().includes(q) ||
          sku.toLowerCase().includes(q) ||
          category.toLowerCase().includes(q)
        ) {
          results.push({
            id: `prod-${p.id}`,
            title: name,
            subtitle: `SKU: ${sku} • ₹${p.price} • ${category}`,
            category: 'Products',
            icon: <ShoppingBag className="w-4 h-4 text-purple-600" />,
            action: () => {
              setCatalogSearch(name);
              onNavigate?.('catalog');
            },
          });
        }
      });
    }

    // 4. Customer Matches
    if (customers && customers.length > 0) {
      customers.forEach((c) => {
        const name = c.name || '';
        const phone = c.phone || '';
        const email = c.email || '';
        if (
          name.toLowerCase().includes(q) ||
          phone.includes(q) ||
          email.toLowerCase().includes(q)
        ) {
          results.push({
            id: `cust-${c.id}`,
            title: name,
            subtitle: `${phone} • ${c.totalOrders || 0} orders • ₹${c.totalSales || 0} sales`,
            category: 'Customers',
            icon: <Users className="w-4 h-4 text-teal-600" />,
            action: () => {
              setCustomerSearch(name);
              onNavigate?.('customers');
            },
          });
        }
      });
    }

    return results.slice(0, 15);
  }, [query, navigationItems, orders, products, customers, onNavigate, setOrderSearch, setCatalogSearch, setCustomerSearch]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search orders, products, customers, or actions..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-50">
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              {!query && (
                <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Navigation & Actions
                </div>
              )}
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                      isSelected
                        ? 'bg-blue-50 text-blue-900 border border-blue-100 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isSelected ? 'bg-white shadow-2xs' : 'bg-slate-100'
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate">{item.title}</span>
                          <span
                            className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                              item.category === 'Orders'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.category === 'Products'
                                ? 'bg-purple-100 text-purple-800'
                                : item.category === 'Customers'
                                ? 'bg-teal-100 text-teal-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected
                          ? 'text-blue-600 translate-x-0.5'
                          : 'text-slate-300 opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-slate-400 mt-1">Try searching by order number, product name, or customer phone</p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 text-[9px] font-bold bg-white border border-slate-200 rounded">↑</kbd>
              <kbd className="px-1 py-0.5 text-[9px] font-bold bg-white border border-slate-200 rounded">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[9px] font-bold bg-white border border-slate-200 rounded">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Press <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded">ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
};

