import React, { useState, useEffect } from 'react';
import { useAuthStore } from './stores/authStore.js';
import { useOnboardingStore } from './stores/onboardingStore.js';
import { SellerLandingPage } from './pages/SellerLandingPage.js';
import { SellerLoginPage } from './pages/SellerLoginPage.js';
import { OnboardingPage } from './pages/OnboardingPage.js';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage.js';
import { OrdersPage } from './pages/OrdersPage.js';
import { CreateOrderPage } from './pages/CreateOrderPage.js';
import { CatalogPage } from './pages/CatalogPage.js';
import { InventoryPage } from './pages/InventoryPage.js';
import { StoreSettingsPage } from './pages/StoreSettingsPage.js';
import { Sidebar, DashboardTab } from './components/dashboard/Sidebar.js';
import { Header } from './components/dashboard/Header.js';
import { AddProductModal } from './components/catalog/AddProductModal.js';
import { BulkUploadModal } from './components/catalog/BulkUploadModal.js';

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
      if (params.get('view') === 'landing' || path.endsWith('/seller') || path === '/') return 'landing';
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

  // If already authenticated and on login, transition to dashboard
  useEffect(() => {
    if (isAuthenticated && currentView === 'login') {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, currentView]);

  // Screen 1.png: Public Landing Page
  if (currentView === 'landing') {
    return (
      <SellerLandingPage
        onStartSelling={() => setCurrentView('onboarding')}
        onLogin={() => setCurrentView('login')}
      />
    );
  }

  // Screen 4.png: Floating Seller Login Card
  if (currentView === 'login') {
    return (
      <SellerLoginPage
        onLoginSuccess={() => setCurrentView('dashboard')}
        onGoToRegister={() => setCurrentView('onboarding')}
        onGoToHome={() => setCurrentView('landing')}
      />
    );
  }

  // Screens 3.png, 5.1.png, 2.png, 5.png, 6.png, 8.png, 7.png: Onboarding Wizard
  if (currentView === 'onboarding') {
    return (
      <OnboardingPage
        onEnterDashboard={() => setCurrentView('dashboard')}
        onGoToLogin={() => setCurrentView('login')}
        onGoToHome={() => setCurrentView('landing')}
      />
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
        />

        <main
          className={`flex-1 p-3 sm:p-4 transition-all duration-300 ${
            isSidebarCollapsed ? 'sm:ml-20' : 'sm:ml-64'
          }`}
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

          {currentTab === 'store' && <StoreSettingsPage />}

          {/* Fallback placeholder for other modules */}
          {!['overview', 'orders', 'catalog', 'inventory', 'store'].includes(currentTab) && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs max-w-xl mx-auto mt-8">
              <h3 className="text-base font-bold text-slate-800 capitalize">
                {currentTab.replace(/_/g, ' ')} Module
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Operational analytics and live controls active for this merchant vertical.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
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
    </div>
  );
};
