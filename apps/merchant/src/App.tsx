import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore.js';
import { api } from './lib/api.js';
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
import { useSettingsStore } from './stores/settingsStore.js';
import { useCatalogStore } from './stores/catalogStore.js';
import { Sidebar, DashboardTab } from './components/dashboard/Sidebar.js';
import { Header } from './components/dashboard/Header.js';
import { AddProductModal } from './components/catalog/AddProductModal.js';
import { BulkUploadModal } from './components/catalog/BulkUploadModal.js';
import { LiveOrderSocketListener } from './components/dashboard/LiveOrderSocketListener.js';
import { WelcomeGuideModal, WelcomeGuideLauncher } from './components/dashboard/WelcomeGuideModal.js';

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

const VALID_TABS: DashboardTab[] = [
  'overview',
  'orders',
  'catalog',
  'inventory',
  'billing',
  'customers',
  'wallet',
  'expenses',
  'assets',
  'returns',
  'payouts',
  'analytics',
  'marketing',
  'store',
  'settings',
  'support',
];

export const App: React.FC = () => {
  const { isAuthenticated, initialize } = useAuthStore();
  const { isUnderReview } = useOnboardingStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Layout UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Resizable Sidebar state
  const DEFAULT_SIDEBAR_WIDTH = 256;
  const MIN_SIDEBAR_WIDTH = 200;
  const MAX_SIDEBAR_WIDTH = 420;

  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('merchant_sidebar_width');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= MIN_SIDEBAR_WIDTH && parsed <= MAX_SIDEBAR_WIDTH) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_SIDEBAR_WIDTH;
  });
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);

  // Global modals
  const [isGlobalAddOpen, setIsGlobalAddOpen] = useState(false);
  const [isGlobalBulkOpen, setIsGlobalBulkOpen] = useState(false);

  // Welcome & Quick Start Guide Modal
  const [isWelcomeGuideOpen, setIsWelcomeGuideOpen] = useState(() => {
    try {
      const isUrlWelcome = searchParams.get('welcome') === 'true';
      const isSessionWelcome = sessionStorage.getItem('show_merchant_welcome') === 'true';
      if (isUrlWelcome || isSessionWelcome) {
        sessionStorage.removeItem('show_merchant_welcome');
        return true;
      }
    } catch {}
    return false;
  });

  useEffect(() => {
    if (searchParams.get('welcome') === 'true') {
      setIsWelcomeGuideOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Proactive Session Keep-Alive Heartbeat (keeps merchant session alive indefinitely)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      api.get('/stores/mine').catch(() => {});
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Determine view mode based on Route path & hostname
  const pathname = location.pathname.toLowerCase();
  const host = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';

  const isRegisterRoute =
    host.startsWith('register.') ||
    pathname === '/register' ||
    pathname === '/signup' ||
    pathname === '/onboarding';

  const isLoginRoute = pathname === '/login';
  const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  // Derive dashboard active tab from URL path and search params
  const getTabFromPath = (path: string): DashboardTab => {
    const clean = path.toLowerCase();
    if (clean === '/dashboard' || clean === '/dashboard/' || clean === '/dashboard/overview') {
      return 'overview';
    }
    const prefix = '/dashboard/';
    if (clean.startsWith(prefix)) {
      const sub = clean.slice(prefix.length).split('/')[0] as DashboardTab;
      if (VALID_TABS.includes(sub)) {
        return sub;
      }
    }
    const queryTab = searchParams.get('tab') as DashboardTab | null;
    if (queryTab && VALID_TABS.includes(queryTab)) {
      return queryTab;
    }
    return 'overview';
  };

  const currentTab = getTabFromPath(location.pathname);
  const isCreateOrderView = pathname === '/dashboard/orders/create';

  // Navigation handler for dashboard tabs
  const handleSelectTab = useCallback(
    (tab: DashboardTab) => {
      navigate(tab === 'overview' ? '/dashboard' : `/dashboard/${tab}`);
      setIsMobileMenuOpen(false);
    },
    [navigate]
  );

  // Marketing & Public navigation handler
  const navigateTo = useCallback(
    (route: string) => {
      navigate(route);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [navigate]
  );

  // Listen for inter-component merchant navigation events
  useEffect(() => {
    const handleMerchantNavigate = (e: CustomEvent<{ tab?: DashboardTab; view?: string }>) => {
      if (e.detail?.tab) {
        if (e.detail.tab === 'orders' && e.detail.view === 'create') {
          navigate('/dashboard/orders/create');
        } else if (e.detail.tab === 'catalog' && e.detail.view === 'wizard') {
          useCatalogStore.getState().setActiveView('wizard');
          navigate('/dashboard/catalog');
        } else {
          handleSelectTab(e.detail.tab);
        }
      }
    };
    window.addEventListener('merchant:navigate' as any, handleMerchantNavigate);
    return () => window.removeEventListener('merchant:navigate' as any, handleMerchantNavigate);
  }, [handleSelectTab, navigate]);

  // View Resolution:
  // 0. Rider Run Portal Redirect (Hosted on Customer Storefront)
  if (pathname.startsWith('/rider/run/')) {
    if (typeof window !== 'undefined') {
      const targetHost = (host === 'localhost' || host === '127.0.0.1')
        ? 'localhost:3000'
        : host.replace(/^(seller|partner|merchant)\./, 'www.');
      const protocol = (host === 'localhost' || host === '127.0.0.1') ? 'http:' : window.location.protocol;
      window.location.replace(`${protocol}//${targetHost}${location.pathname}`);
      return null;
    }
  }

  // 1. Onboarding / Register
  if (isRegisterRoute) {
    return (
      <OnboardingPage
        onEnterDashboard={() => {
          try {
            sessionStorage.setItem('show_merchant_welcome', 'true');
          } catch {}
          navigate('/dashboard?welcome=true');
        }}
        onGoToLogin={() => navigate('/login')}
        onGoToHome={() => navigate('/')}
        onNavigate={navigateTo}
      />
    );
  }

  // 2. Seller Login
  if (isLoginRoute) {
    const isAuth = isAuthenticated || !!localStorage.getItem('access_token');
    if (isAuth) {
      return <Navigate to="/dashboard" replace />;
    }
    return (
      <SellerLoginPage
        onLoginSuccess={() => navigate('/dashboard')}
        onGoToRegister={() => navigate('/register')}
        onGoToHome={() => navigate('/')}
      />
    );
  }

  // 3. Merchant Dashboard (Protected)
  if (isDashboardRoute) {
    const isAuth = isAuthenticated || !!localStorage.getItem('access_token');
    if (!isAuth) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return (
      <div
        style={
          {
            '--sidebar-width': isSidebarCollapsed ? '80px' : `${sidebarWidth}px`,
          } as React.CSSProperties
        }
        className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col"
      >
        {/* Real-time Socket.io Incoming Order Alert & Melodic Chime Engine */}
        <LiveOrderSocketListener
          onNavigateToOrder={() => {
            navigate('/dashboard/orders');
          }}
        />

        {/* Desktop & Mobile Sidebar */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden sm:block'}`}>
          <Sidebar
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            sidebarWidth={sidebarWidth}
            onWidthChange={(w) => {
              setSidebarWidth(w);
              try {
                localStorage.setItem('merchant_sidebar_width', String(w));
              } catch {
                // ignore
              }
            }}
            isResizing={isResizingSidebar}
            onResizingChange={setIsResizingSidebar}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Header
            isCollapsed={isSidebarCollapsed}
            isResizing={isResizingSidebar}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onNavigateToWallet={() => handleSelectTab('wallet')}
            onNavigateToSettings={(subTab) => {
              if (subTab) {
                useSettingsStore.getState().setActiveSubTab(subTab as any);
              }
              handleSelectTab('settings');
            }}
            onNavigateToSupport={() => handleSelectTab('support')}
            onNavigate={(tab) => handleSelectTab(tab)}
            onOpenWelcomeGuide={() => setIsWelcomeGuideOpen(true)}
          />

          <main
            className={`flex-1 p-3.5 sm:px-6 sm:py-4 sm:ml-[var(--sidebar-width)] ${
              isResizingSidebar ? '' : 'transition-[margin] duration-300'
            }`}
          >
            {currentTab === 'overview' && (
              <DashboardOverviewPage
                onNavigate={(tab) => handleSelectTab(tab)}
                onOpenAddProduct={() => setIsGlobalAddOpen(true)}
                onOpenBulkUpload={() => setIsGlobalBulkOpen(true)}
                onOpenCreateOrder={() => navigate('/dashboard/orders/create')}
              />
            )}

            {currentTab === 'orders' &&
              (isCreateOrderView ? (
                <CreateOrderPage onBack={() => navigate('/dashboard/orders')} />
              ) : (
                <OrdersPage onOpenCreateOrder={() => navigate('/dashboard/orders/create')} />
              ))}

            {currentTab === 'catalog' && <CatalogPage />}

            {currentTab === 'inventory' && <InventoryPage />}

            {currentTab === 'billing' && <BillingPage />}

            {currentTab === 'customers' && <CustomersPage />}

            {currentTab === 'wallet' && (
              <WalletPage onNavigateHome={() => handleSelectTab('overview')} />
            )}

            {currentTab === 'expenses' && (
              <ExpensesPage onNavigateHome={() => handleSelectTab('overview')} />
            )}

            {currentTab === 'assets' && (
              <AssetsPage onNavigateHome={() => handleSelectTab('overview')} />
            )}

            {currentTab === 'returns' && (
              <ReturnsPage onNavigateHome={() => handleSelectTab('overview')} />
            )}

            {currentTab === 'payouts' && (
              <PayoutsPage onNavigateHome={() => handleSelectTab('overview')} />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsPage onNavigateHome={() => handleSelectTab('overview')} />
            )}

            {currentTab === 'marketing' && (
              <MarketingPage onNavigateHome={() => handleSelectTab('overview')} />
            )}

            {currentTab === 'store' && <StoreManagementPage />}

            {currentTab === 'settings' && (
              <SettingsPage
                onNavigateToBillingSettings={() => {
                  handleSelectTab('billing');
                  useBillingStore.getState().setActiveView('settings');
                }}
                onNavigateToSupport={() => handleSelectTab('support')}
              />
            )}

            {currentTab === 'support' && (
              <SupportPage onNavigateHome={() => handleSelectTab('overview')} />
            )}

            {/* Fallback placeholder for other modules */}
            {!VALID_TABS.includes(currentTab) && (
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
            useCatalogStore.getState().updateDraftProduct({
              name: p.name,
              category: p.category,
              sku: p.sku,
              price: p.price,
              mrp: p.mrp,
              stock: p.stock,
              images: p.imageUrl ? [p.imageUrl] : [],
            });
            useCatalogStore.getState().saveDraftAsProduct().catch(() => {});
            setIsGlobalAddOpen(false);
          }}
        />

        <BulkUploadModal
          isOpen={isGlobalBulkOpen}
          onClose={() => setIsGlobalBulkOpen(false)}
          onBulkSuccess={(_c) => {
            setIsGlobalBulkOpen(false);
            useCatalogStore.getState().fetchProducts().catch(() => {});
          }}
        />

        {/* Welcome & Quick Start Guide Modal */}
        <WelcomeGuideModal
          isOpen={isWelcomeGuideOpen}
          onClose={() => setIsWelcomeGuideOpen(false)}
          onNavigate={(tab, subTab) => {
            handleSelectTab(tab);
            if (subTab && tab === 'settings') {
              useSettingsStore.getState().setActiveSubTab(subTab as any);
            }
          }}
          onOpenAddProduct={() => setIsGlobalAddOpen(true)}
        />

        {/* Floating Quick Start Guide Launcher at bottom right */}
        {!isWelcomeGuideOpen && (
          <WelcomeGuideLauncher onOpen={() => setIsWelcomeGuideOpen(true)} />
        )}
      </div>
    );
  }

  // 4. Public Marketing Website (23 Mockup Screens)
  let pageContent: React.ReactNode = null;

  if (pathname.startsWith('/sell-online')) {
    const tab: SellOnlineTab = pathname.includes('managestore')
      ? 'managestore'
      : pathname.includes('ordersdelivery')
      ? 'ordersdelivery'
      : pathname.includes('sellertools')
      ? 'sellertools'
      : 'listproducts';

    pageContent = (
      <SellOnlinePage
        initialTab={tab}
        onNavigate={navigateTo}
        onStartSelling={() => navigate('/register')}
      />
    );
  } else if (pathname === '/how-it-works') {
    pageContent = (
      <HowItWorksPage
        onNavigate={navigateTo}
        onStartSelling={() => navigate('/register')}
      />
    );
  } else if (
    pathname === '/how-it-works/localdiscovery' ||
    pathname === '/learn/local-discovery'
  ) {
    pageContent = (
      <LocalDiscoveryPage
        onNavigate={navigateTo}
        onStartSelling={() => navigate('/register')}
      />
    );
  } else if (pathname === '/grow-business/localdiscovery') {
    pageContent = (
      <GrowLocalDiscoveryPage
        onNavigate={navigateTo}
        onStartSelling={() => navigate('/register')}
      />
    );
  } else if (pathname === '/pricing') {
    pageContent = (
      <PricingPage
        onNavigate={navigateTo}
        onStartSelling={() => navigate('/register')}
      />
    );
  } else if (pathname === '/grow-business') {
    pageContent = (
      <GrowBusinessPage
        onNavigate={navigateTo}
        onStartSelling={() => navigate('/register')}
      />
    );
  } else if (pathname === '/learn' || pathname === '/learn/guides') {
    pageContent = (
      <BusinessGuidesPage
        onNavigate={navigateTo}
        onSelectGuide={(slug) => navigate(`/learn/guides/${slug}`)}
        onStartSelling={() => navigate('/register')}
      />
    );
  } else if (pathname.startsWith('/learn/guides/')) {
    const slug = pathname.replace('/learn/guides/', '');
    pageContent = (
      <GuideDetailPage
        slug={slug}
        onNavigate={navigateTo}
        onSelectGuide={(s) => navigate(`/learn/guides/${s}`)}
        onStartSelling={() => navigate('/register')}
      />
    );
  } else if (pathname === '/learn/tutorials') {
    pageContent = (
      <VideoTutorialsPage
        onNavigate={navigateTo}
        onStartSelling={() => navigate('/register')}
      />
    );
  } else if (pathname === '/help') {
    pageContent = (
      <HelpCentrePage
        onNavigate={navigateTo}
        onSelectGuide={(slug) => navigate(`/learn/guides/${slug}`)}
      />
    );
  } else if (pathname === '/faqs') {
    pageContent = <FaqPage onNavigate={navigateTo} />;
  } else if (pathname === '/blog') {
    pageContent = (
      <SellerBlogPage
        onNavigate={navigateTo}
        onSelectPost={(slug) => navigate(`/blog/${slug}`)}
      />
    );
  } else if (pathname.startsWith('/blog/')) {
    const slug = pathname.replace('/blog/', '');
    pageContent = (
      <BlogDetailPage
        slug={slug}
        onNavigate={navigateTo}
        onSelectPost={(s) => navigate(`/blog/${s}`)}
      />
    );
  } else if (pathname === '/help/contact' || pathname === '/contact') {
    pageContent = <ContactSupportPage onNavigate={navigateTo} />;
  } else if (pathname === '/terms') {
    pageContent = <TermsPage onNavigate={navigateTo} />;
  } else if (pathname === '/privacy') {
    pageContent = <PrivacyPage onNavigate={navigateTo} />;
  } else if (pathname === '/refund-policy') {
    pageContent = <RefundPolicyPage onNavigate={navigateTo} />;
  } else {
    // Default: 1.0.png Merchant Landing Homepage
    pageContent = (
      <MerchantHomePage
        onNavigate={navigateTo}
        onStartSelling={() => navigate('/register')}
      />
    );
  }

  return (
    <MerchantPublicLayout
      currentRoute={pathname}
      onNavigate={navigateTo}
      onGoToLogin={() => navigate('/login')}
      onGoToSignup={() => navigate('/register')}
    >
      {pageContent}
    </MerchantPublicLayout>
  );
};
