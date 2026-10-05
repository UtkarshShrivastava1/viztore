import React from 'react';
import { useMarketingStore } from '../stores/marketingStore.js';
import { MarketingSubNav } from '../components/marketing/MarketingSubNav.js';
import { MarketingOverviewTab } from '../components/marketing/MarketingOverviewTab.js';
import { AdvertisementsTab } from '../components/marketing/AdvertisementsTab.js';
import { CreateAdvertisementWizard } from '../components/marketing/CreateAdvertisementWizard.js';
import { DiscountsCouponsTab } from '../components/marketing/DiscountsCouponsTab.js';
import { CreateCouponWizard } from '../components/marketing/CreateCouponWizard.js';

interface MarketingPageProps {
  onNavigateHome?: () => void;
}

export const MarketingPage: React.FC<MarketingPageProps> = ({ onNavigateHome }) => {
  const {
    activeSubTab,
    setActiveSubTab,
    isCreateAdWizardOpen,
    openCreateAdWizard,
    closeCreateAdWizard,
    isCreateCouponWizardOpen,
    openCreateCouponWizard,
    closeCreateCouponWizard,
  } = useMarketingStore();

  const isWizardOpen = isCreateAdWizardOpen || isCreateCouponWizardOpen;

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12 animate-in fade-in duration-150">
      {/* Breadcrumb Navigation */}
      {!isWizardOpen && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span
            className="hover:text-slate-600 cursor-pointer"
            onClick={onNavigateHome}
          >
            Home
          </span>
          <span>&gt;</span>
          <span
            className={`cursor-pointer ${
              activeSubTab === 'overview' ? 'text-slate-800 font-bold' : 'hover:text-slate-600'
            }`}
            onClick={() => setActiveSubTab('overview')}
          >
            Marketing
          </span>
          {activeSubTab !== 'overview' && (
            <>
              <span>&gt;</span>
              <span className="text-slate-800 font-bold">
                {activeSubTab === 'advertisements' || (activeSubTab as string) === 'campaigns'
                  ? 'Advertisements'
                  : 'Discounts & Coupons'}
              </span>
            </>
          )}
        </div>
      )}

      {/* Top Tab Bar (Always visible except when inside full Create wizard) */}
      {!isWizardOpen && (
        <MarketingSubNav activeTab={activeSubTab} onTabChange={setActiveSubTab} />
      )}

      {/* Main Tab View Rendering */}
      <div>
        {isCreateAdWizardOpen ? (
          <CreateAdvertisementWizard onClose={closeCreateAdWizard} />
        ) : isCreateCouponWizardOpen ? (
          <CreateCouponWizard onClose={closeCreateCouponWizard} />
        ) : activeSubTab === 'overview' ? (
          <MarketingOverviewTab />
        ) : activeSubTab === 'advertisements' || (activeSubTab as string) === 'campaigns' ? (
          <AdvertisementsTab onCreateAd={openCreateAdWizard} />
        ) : (
          <DiscountsCouponsTab onCreateCoupon={openCreateCouponWizard} />
        )}
      </div>
    </div>
  );
};
