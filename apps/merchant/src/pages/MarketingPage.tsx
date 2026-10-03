import React from 'react';
import { useMarketingStore } from '../stores/marketingStore.js';
import { MarketingSubNav } from '../components/marketing/MarketingSubNav.js';
import { MarketingOverviewTab } from '../components/marketing/MarketingOverviewTab.js';
import { CampaignsTab } from '../components/marketing/CampaignsTab.js';
import { CreateCampaignWizard } from '../components/marketing/CreateCampaignWizard.js';
import { DiscountsTab } from '../components/marketing/DiscountsTab.js';
import { CouponsTab } from '../components/marketing/CouponsTab.js';
import { PushNotificationsTab } from '../components/marketing/PushNotificationsTab.js';
import { EmailSmsTab } from '../components/marketing/EmailSmsTab.js';
import { LoyaltyProgramTab } from '../components/marketing/LoyaltyTab.js';
import { SocialMediaTab } from '../components/marketing/SocialMediaTab.js';
import { MarketingAnalyticsTab } from '../components/marketing/MarketingAnalyticsTab.js';

interface MarketingPageProps {
  onNavigateHome?: () => void;
}

export const MarketingPage: React.FC<MarketingPageProps> = ({ onNavigateHome }) => {
  const { activeSubTab, setActiveSubTab, activeCampaignView } = useMarketingStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
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
            <span className="text-slate-800 font-bold capitalize">
              {activeSubTab === 'campaigns'
                ? activeCampaignView === 'create'
                  ? 'Create Campaign'
                  : 'Campaigns'
                : activeSubTab === 'discounts'
                ? 'Discounts & Offers'
                : activeSubTab === 'coupons'
                ? 'Coupons'
                : activeSubTab === 'push'
                ? 'Push Notifications'
                : activeSubTab === 'email_sms'
                ? 'Email & SMS'
                : activeSubTab === 'loyalty'
                ? 'Loyalty Program'
                : activeSubTab === 'social'
                ? 'Social Media'
                : 'Analytics'}
            </span>
          </>
        )}
      </div>

      {/* Top Tab Bar (Always visible except when inside full Create Campaign wizard, or visible with state sync) */}
      {activeCampaignView !== 'create' && (
        <MarketingSubNav activeTab={activeSubTab} onTabChange={setActiveSubTab} />
      )}

      {/* Main Tab View Rendering */}
      <div>
        {activeSubTab === 'overview' && <MarketingOverviewTab />}

        {activeSubTab === 'campaigns' &&
          (activeCampaignView === 'create' ? <CreateCampaignWizard /> : <CampaignsTab />)}

        {activeSubTab === 'discounts' && <DiscountsTab />}

        {activeSubTab === 'coupons' && <CouponsTab />}

        {activeSubTab === 'push' && <PushNotificationsTab />}

        {activeSubTab === 'email_sms' && <EmailSmsTab />}

        {activeSubTab === 'loyalty' && <LoyaltyProgramTab />}

        {activeSubTab === 'social' && <SocialMediaTab />}

        {activeSubTab === 'analytics' && <MarketingAnalyticsTab />}
      </div>
    </div>
  );
};
