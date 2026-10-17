import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from './stores/authStore.js';
import { useOnboardingStore } from './stores/onboardingStore.js';
import { SellerLoginPage } from './pages/SellerLoginPage.js';
import { OnboardingPage } from './pages/OnboardingPage.js';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage.js';
import { OrdersPage } from './pages/OrdersPage.js';
import { CreateOrderPage } from './pages/CreateOrderPage.js';
import { CatalogPage } from './pages/CatalogPage.js';
import { InventoryPage } from './pages/InventoryPage.js';
import { StoreManagementPage } from './pages/StoreManagementPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { BillingPage } from './pages/BillingPage.js';
import { CustomersPage } from './pages/CustomersPage.js';
import { WalletPage } from './pages/WalletPage.js';
import { ExpensesPage } from './pages/ExpensesPage.js';
import { AssetsPage } from './pages/AssetsPage.js';
import { ReturnsPage } from './pages/ReturnsPage.js';
import { PayoutsPage } from './pages/PayoutsPage.js';
import { AnalyticsPage } from './pages/AnalyticsPage.js';
import { MarketingPage } from './pages/MarketingPage.js';
import { SupportPage } from './pages/SupportPage.js';
import { useBillingStore } from './stores/billingStore.js';
import { Sidebar, DashboardTab } from './components/dashboard/Sidebar.js';
import { Header } from './components/dashboard/Header.js';
import { AddProductModal } from './components/catalog/AddProductModal.js';
import { BulkUploadModal } from './components/catalog/BulkUploadModal.js';
import { LiveOrderSocketListener } from './components/dashboard/LiveOrderSocketListener.js';

// Marketing Website Pages & Layout
import { MerchantPublicLayout } from './components/marketing/MerchantPublicLayout.js';
import { MerchantHomePage } from './pages/marketing/MerchantHomePage.js';
import { SellOnlinePage, SellOnlineTab } from './pages/marketing/SellOnlinePage.js';
import { HowItWorksPage } from './pages/marketing/HowItWorksPage.js';
import { LocalDiscoveryPage } from './pages/marketing/LocalDiscoveryPage.js';
import { GrowLocalDiscoveryPage } from './pages/marketing/GrowLocalDiscoveryPage.js';
import { PricingPage } from './pages/marketing/PricingPage.js';
import { GrowBusinessPage } from './pages/marketing/GrowBusinessPage.js';
import { BusinessGuidesPage } from './pages/marketing/BusinessGuidesPage.js';
import { GuideDetailPage } from './pages/marketing/GuideDetailPage.js';
import { VideoTutorialsPage } from './pages/marketing/VideoTutorialsPage.js';
import { HelpCentrePage } from './pages/marketing/HelpCentrePage.js';
import { FaqPage } from './pages/marketing/FaqPage.js';
import { SellerBlogPage } from './pages/marketing/SellerBlogPage.js';
import { BlogDetailPage } from './pages/marketing/BlogDetailPage.js';
import { ContactSupportPage } from './pages/marketing/ContactSupportPage.js';
import { TermsPage } from './pages/marketing/legal/TermsPage.js';
import { PrivacyPage } from './pages/marketing/legal/PrivacyPage.js';
import { RefundPolicyPage } from './pages/marketing/legal/RefundPolicyPage.js';

export type AppView = 'landing' | 'login' | 'onboarding' | 'dashboard';

export const App: React.FC = () => {
  const { isAuthenticated, initialize } = useAuthStore();
  const { isUnderReview } = useOnboardingStore();

  const getInitialRoute = (): string => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.toLowerCase() || '/';
    }
    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);

  // Determine initial view from URL path or subdomain (e.g. register.<domain>)
  const getInitialView = (): AppView => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const host = window.location.hostname.toLowerCase();
      const params = new URLSearchParams(window.location.search);

      // Dedicated subdomain routing (e.g. register.<domain> / register.localhost) or path (/register)
      if (host.startsWith('register.') || path.startsWith('/register')) {
        return 'onboarding';
      }

      if (params.get('view') === 'login' || path.endsWith('/login')) return 'login';
      if (
        params.get('view') === 'signup' ||
        params.get('view') === 'onboarding' ||
        path.endsWith('/signup') ||
        path.endsWith('/onboarding')
      ) {
        return 'onboarding';
      }
      if (params.get('view') === 'dashboard' || path.endsWith('/dashboard')) return 'dashboard';
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

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      setCurrentRoute(path);

      if (path === '/login') {
        setCurrentView('login');
      } else if (path === '/register' || path === '/signup' || path === '/onboarding') {
        setCurrentView('onboarding');
      } else if (path === '/dashboard') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation handler
  const navigateTo = useCallback((route: string) => {
    const cleanRoute = route.toLowerCase();
    setCurrentRoute(cleanRoute);

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (cleanRoute === '/login') {
      setCurrentView('login');
    } else if (
      cleanRoute === '/register' ||
      cleanRoute === '/signup' ||
      cleanRoute === '/onboarding'
    ) {
      setCurrentView('onboarding');
    } else if (cleanRoute === '/dashboard') {
      setCurrentView('dashboard');
    } else {
      setCurrentView('landing');
    }
  }, []);

  // If already authenticated and on login or default root, transition to dashboard.
  useEffect(() => {
    if (isAuthenticated && currentView === 'login') {
      setCurrentView('dashboard');
    } else if (!isAuthenticated && currentView === 'dashboard') {
      setCurrentView('login');
    }
  }, [isAuthenticated, currentView]);

  // Public Marketing Website (23 Mockup Screens)
  if (currentView === 'landing') {
    let pageContent: React.ReactNode = null;

    if (currentRoute.startsWith('/sell-online')) {
      const tab: SellOnlineTab = currentRoute.includes('managestore')
        ? 'managestore'
        : currentRoute.includes('ordersdelivery')
        ? 'ordersdelivery'
        : currentRoute.includes('sellertools')
        ? 'sellertools'
        : 'listproducts';

      pageContent = (
        <SellOnlinePage
          initialTab={tab}
          onNavigate={navigateTo}
          onStartSelling={() => navigateTo('/register')}
        />
      );
    } else if (currentRoute === '/how-it-works') {
      pageContent = (
        <HowItWorksPage
          onNavigate={navigateTo}
          onStartSelling={() => navigateTo('/register')}
        />
      );
    } else if (
      currentRoute === '/how-it-works/localdiscovery' ||
      currentRoute === '/learn/local-discovery'
    ) {
      pageContent = (
        <LocalDiscoveryPage
          onNavigate={navigateTo}
          onStartSelling={() => navigateTo('/register')}
        />
      );
    } else if (currentRoute === '/grow-business/localdiscovery') {
      pageContent = (
        <GrowLocalDiscoveryPage
          onNavigate={navigateTo}
          onStartSelling={() => navigateTo('/register')}
        />
      );
    } else if (currentRoute === '/pricing') {
      pageContent = (
        <PricingPage
          onNavigate={navigateTo}
          onStartSelling={() => navigateTo('/register')}
        />
      );
    } else if (currentRoute === '/grow-business') {
      pageContent = (
        <GrowBusinessPage
          onNavigate={navigateTo}
          onStartSelling={() => navigateTo('/register')}
        />
      );
    } else if (currentRoute === '/learn' || currentRoute === '/learn/guides') {
      pageContent = (
        <BusinessGuidesPage
          onNavigate={navigateTo}
          onSelectGuide={(slug) => navigateTo(`/learn/guides/${slug}`)}
          onStartSelling={() => navigateTo('/register')}
        />
      );
    } else if (currentRoute.startsWith('/learn/guides/')) {
      const slug = currentRoute.replace('/learn/guides/', '');
      pageContent = (
        <GuideDetailPage
          slug={slug}
          onNavigate={navigateTo}
          onSelectGuide={(s) => navigateTo(`/learn/guides/${s}`)}
          onStartSelling={() => navigateTo('/register')}
        />
      );
    } else if (currentRoute === '/learn/tutorials') {
      pageContent = (
        <VideoTutorialsPage
          onNavigate={navigateTo}
          onStartSelling={() => navigateTo('/register')}
        />
      );
    } else if (currentRoute === '/help') {
      pageContent = (
        <HelpCentrePage
          onNavigate={navigateTo}
          onSelectGuide={(slug) => navigateTo(`/learn/guides/${slug}`)}
        />
      );
    } else if (currentRoute === '/faqs') {
      pageContent = <FaqPage onNavigate={navigateTo} />;
    } else if (currentRoute === '/blog') {
      pageContent = (
        <SellerBlogPage
          onNavigate={navigateTo}
          onSelectPost={(slug) => navigateTo(`/blog/${slug}`)}
        />
      );
    } else if (currentRoute.startsWith('/blog/')) {
      const slug = currentRoute.replace('/blog/', '');
      pageContent = (
        <BlogDetailPage
          slug={slug}
          onNavigate={navigateTo}
          onSelectPost={(s) => navigateTo(`/blog/${s}`)}
        />
      );
    } else if (currentRoute === '/help/contact' || currentRoute === '/contact') {
      pageContent = <ContactSupportPage onNavigate={navigateTo} />;
    } else if (currentRoute === '/terms') {
      pageContent = <TermsPage onNavigate={navigateTo} />;
    } else if (currentRoute === '/privacy') {
      pageContent = <PrivacyPage onNavigate={navigateTo} />;
    } else if (currentRoute === '/refund-policy') {
      pageContent = <RefundPolicyPage onNavigate={navigateTo} />;
    } else {
      // Default: 1.0.png Merchant Landing Homepage
      pageContent = (
        <MerchantHomePage
          onNavigate={navigateTo}
          onStartSelling={() => navigateTo('/register')}
        />
      );
    }

    return (
      <MerchantPublicLayout
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onGoToLogin={() => navigateTo('/login')}
        onGoToSignup={() => navigateTo('/register')}
      >
        {pageContent}
      </MerchantPublicLayout>
    );
  }

  // Screen 4.png: Floating Seller Login Card
  if (currentView === 'login') {
    return (
      <SellerLoginPage
        onLoginSuccess={() => setCurrentView('dashboard')}
        onGoToRegister={() => setCurrentView('onboarding')}
        onGoToHome={() => navigateTo('/')}
      />
    );
  }

  // Screens 3.png, 5.1.png, 2.png, 5.png, 6.png, 8.png, 7.png: Onboarding Wizard
  if (currentView === 'onboarding') {
    return (
      <OnboardingPage
        onEnterDashboard={() => setCurrentView('dashboard')}
        onGoToLogin={() => setCurrentView('login')}
        onGoToHome={() => navigateTo('/')}
      />
    );
  }

  // Main Merchant Dashboard & Functional Modules
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      {/* Real-time Socket.io Incoming Order Alert & Melodic Chime Engine */}
      <LiveOrderSocketListener
        onNavigateToOrder={() => {
          setCurrentTab('orders');
          setIsCreateOrderView(false);
        }}
      />

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
          className={`flex-1 p-3.5 sm:px-6 sm:py-4 transition-[margin] duration-300 ${isSidebarCollapsed ? 'sm:ml-20' : 'sm:ml-64'
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