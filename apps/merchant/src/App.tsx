import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useAuthStore } from './stores/authStore.js';
import { useOnboardingStore } from './stores/onboardingStore.js';
import { useBillingStore } from './stores/billingStore.js';
import { Sidebar, DashboardTab } from './components/dashboard/Sidebar.js';
import { Header } from './components/dashboard/Header.js';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage.js';

// Lazy loaded page modules for optimal code splitting & performance
const SellerLandingPage = lazy(() =>
  import('./pages/SellerLandingPage.js').then((m) => ({ default: m.SellerLandingPage }))
);
const SellerLoginPage = lazy(() =>
  import('./pages/SellerLoginPage.js').then((m) => ({ default: m.SellerLoginPage }))
);
const OnboardingPage = lazy(() =>
  import('./pages/OnboardingPage.js').then((m) => ({ default: m.OnboardingPage }))
);
const OrdersPage = lazy(() =>
  import('./pages/OrdersPage.js').then((m) => ({ default: m.OrdersPage }))
);
const CreateOrderPage = lazy(() =>
  import('./pages/CreateOrderPage.js').then((m) => ({ default: m.CreateOrderPage }))
);
const CatalogPage = lazy(() =>
  import('./pages/CatalogPage.js').then((m) => ({ default: m.CatalogPage }))
);
const InventoryPage = lazy(() =>
  import('./pages/InventoryPage.js').then((m) => ({ default: m.InventoryPage }))
);
const StoreManagementPage = lazy(() =>
  import('./pages/StoreManagementPage.js').then((m) => ({ default: m.StoreManagementPage }))
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage.js').then((m) => ({ default: m.SettingsPage }))
);
const BillingPage = lazy(() =>
  import('./pages/BillingPage.js').then((m) => ({ default: m.BillingPage }))
);
const CustomersPage = lazy(() =>
  import('./pages/CustomersPage.js').then((m) => ({ default: m.CustomersPage }))
);
const WalletPage = lazy(() =>
  import('./pages/WalletPage.js').then((m) => ({ default: m.WalletPage }))
);
const ExpensesPage = lazy(() =>
  import('./pages/ExpensesPage.js').then((m) => ({ default: m.ExpensesPage }))
);
const AssetsPage = lazy(() =>
  import('./pages/AssetsPage.js').then((m) => ({ default: m.AssetsPage }))
);
const ReturnsPage = lazy(() =>
  import('./pages/ReturnsPage.js').then((m) => ({ default: m.ReturnsPage }))
);
const PayoutsPage = lazy(() =>
  import('./pages/PayoutsPage.js').then((m) => ({ default: m.PayoutsPage }))
);
const AnalyticsPage = lazy(() =>
  import('./pages/AnalyticsPage.js').then((m) => ({ default: m.AnalyticsPage }))
);
const MarketingPage = lazy(() =>
  import('./pages/MarketingPage.js').then((m) => ({ default: m.MarketingPage }))
);
const SupportPage = lazy(() =>
  import('./pages/SupportPage.js').then((m) => ({ default: m.SupportPage }))
);

// Heavy Modals
const AddProductModal = lazy(() =>
  import('./components/catalog/AddProductModal.js').then((m) => ({ default: m.AddProductModal }))
);
const BulkUploadModal = lazy(() =>
  import('./components/catalog/BulkUploadModal.js').then((m) => ({ default: m.BulkUploadModal }))
);

export type AppView = 'landing' | 'login' | 'onboarding' | 'dashboard';

export const App: React.FC = () => {
  const { isAuthenticated, initialize } = useAuthStore();
  const { isUnderReview } = useOnboardingStore();

  // Determine initial view from URL path or subdomain (e.g. register.<domain>)
  const getInitialView = (): AppView => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const host = window.location.hostname.toLowerCase();
      const params = new URLSearchParams(window.location.search);

      // Dedicated subdomain routing (e.g. register.viztore.com / register.localhost) or path (/register)
      if (host.startsWith('register.') || path.startsWith('/register')) {
        return 'onboarding';
      }

      if (params.get('view') === 'login' || path.endsWith('/login')) return 'login';
      if (params.get('view') === 'signup' || params.get('view') === 'onboarding' || path.endsWith('/signup') || path.endsWith('/onboarding')) {
        return 'onboarding';
      }
      if (params.get('view') === 'dashboard' || path.endsWith('/dashboard')) return 'dashboard';
      if (params.get('view') === 'landing' || path.endsWith('/seller')) return 'landing';
      if (path === '/' && localStorage.getItem('access_token')) return 'dashboard';
    }
    return 'landing';
  };

  const [currentView, setCurrentView] = useState<AppView>(getInitialView);
  const [currentTab, setCurrentTab] = useState<DashboardTab>('overview');
  const [isCreateOrderView, setIsCreateOrderView] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global modals
  const [isGlobalAddOpen, setIsGlobalAddOpen] = useState(false);
  const [isGlobalBulkOpen, setIsGlobalBulkOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // If already authenticated and on login or default root, transition to dashboard.
  // When logged out, transition back to login.
  useEffect(() => {
    if (isAuthenticated && (currentView === 'login' || currentView === 'landing')) {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        const params = new URLSearchParams(window.location.search);
        if (params.get('view') === 'landing' || path.endsWith('/seller')) {
          return;
        }
      }
      setCurrentView('dashboard');
    } else if (!isAuthenticated && currentView === 'dashboard') {
      setCurrentView('login');
    }
  }, [isAuthenticated, currentView]);

  // Screen 1.png: Public Landing Page
  if (currentView === 'landing') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>}>
        <SellerLandingPage
          onStartSelling={() => setCurrentView('onboarding')}
          onLogin={() => setCurrentView('login')}
        />
      </Suspense>
    );
  }

  // Screen 4.png: Floating Seller Login Card
  if (currentView === 'login') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>}>
        <SellerLoginPage
          onLoginSuccess={() => setCurrentView('dashboard')}
          onGoToRegister={() => setCurrentView('onboarding')}
          onGoToHome={() => setCurrentView('landing')}
        />
      </Suspense>
    );
  }

  // Screens 3.png, 5.1.png, 2.png, 5.png, 6.png, 8.png, 7.png: Onboarding Wizard
  if (currentView === 'onboarding') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>}>
        <OnboardingPage
          onEnterDashboard={() => setCurrentView('dashboard')}
          onGoToLogin={() => setCurrentView('login')}
          onGoToHome={() => setCurrentView('landing')}
        />
      </Suspense>
    );
  }

  // Main Merchant Dashboard & Functional Modules
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      {/* Desktop & Mobile Sidebar */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden sm:block'}`}>
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setIsCreateOrderView(false);
            setIsMobileMenuOpen(false);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Header
          isCollapsed={isSidebarCollapsed}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onNavigateToWallet={() => setCurrentTab('wallet')}
        />

        <main
          className={`flex-1 p-3.5 sm:px-6 sm:py-4 transition-[margin] duration-300 ${
            isSidebarCollapsed ? 'sm:ml-20' : 'sm:ml-64'
          }`}
        >
          <Suspense
            fallback={
              <div className="p-12 text-center text-xs font-semibold text-slate-400 animate-pulse">
                Loading module...
              </div>
            }
          >
            {currentTab === 'overview' && (
              <DashboardOverviewPage
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  setIsCreateOrderView(false);
                }}
                onOpenAddProduct={() => setIsGlobalAddOpen(true)}
                onOpenBulkUpload={() => setIsGlobalBulkOpen(true)}
              />
            )}

            {currentTab === 'orders' &&
              (isCreateOrderView ? (
                <CreateOrderPage onBack={() => setIsCreateOrderView(false)} />
              ) : (
                <OrdersPage onOpenCreateOrder={() => setIsCreateOrderView(true)} />
              ))}

            {currentTab === 'catalog' && <CatalogPage />}

            {currentTab === 'inventory' && <InventoryPage />}

            {currentTab === 'billing' && <BillingPage />}

            {currentTab === 'customers' && <CustomersPage />}

            {currentTab === 'wallet' && (
              <WalletPage onNavigateHome={() => setCurrentTab('overview')} />
            )}

            {currentTab === 'expenses' && (
              <ExpensesPage onNavigateHome={() => setCurrentTab('overview')} />
            )}

            {currentTab === 'assets' && (
              <AssetsPage onNavigateHome={() => setCurrentTab('overview')} />
            )}

            {currentTab === 'returns' && (
              <ReturnsPage onNavigateHome={() => setCurrentTab('overview')} />
            )}

            {currentTab === 'payouts' && (
              <PayoutsPage onNavigateHome={() => setCurrentTab('overview')} />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsPage onNavigateHome={() => setCurrentTab('overview')} />
            )}

            {currentTab === 'marketing' && (
              <MarketingPage onNavigateHome={() => setCurrentTab('overview')} />
            )}

            {currentTab === 'store' && <StoreManagementPage />}

            {currentTab === 'settings' && (
              <SettingsPage
                onNavigateToBillingSettings={() => {
                  setCurrentTab('billing');
                  useBillingStore.getState().setActiveView('settings');
                }}
                onNavigateToSupport={() => setCurrentTab('support')}
              />
            )}

            {currentTab === 'support' && (
              <SupportPage onNavigateHome={() => setCurrentTab('overview')} />
            )}

            {/* Fallback placeholder for other modules */}
            {!['overview', 'orders', 'catalog', 'inventory', 'billing', 'customers', 'wallet', 'expenses', 'assets', 'returns', 'payouts', 'analytics', 'marketing', 'store', 'settings', 'support'].includes(currentTab) && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs max-w-xl mx-auto mt-8">
                <h3 className="text-base font-bold text-slate-800 capitalize">
                  {currentTab.replace(/_/g, ' ')} Module
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Operational analytics and live controls active for this merchant vertical.
                </p>
              </div>
            )}
          </Suspense>
        </main>
      </div>

      {/* Global Modals */}
      <Suspense fallback={null}>
        <AddProductModal
          isOpen={isGlobalAddOpen}
          onClose={() => setIsGlobalAddOpen(false)}
          onAddProduct={(p) => {
            alert(`Product '${p.name}' created with SKU ${p.sku}`);
            setIsGlobalAddOpen(false);
          }}
        />

        <BulkUploadModal
          isOpen={isGlobalBulkOpen}
          onClose={() => setIsGlobalBulkOpen(false)}
          onBulkSuccess={(c) => alert(`Imported ${c} items successfully`)}
        />
      </Suspense>
    </div>
  );
};
