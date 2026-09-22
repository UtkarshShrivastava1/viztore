import React from 'react';
import {
  ChevronRight,
  Store,
  Image as ImageIcon,
  Star,
  Clock,
  MapPin,
  Eye,
  Bell,
  CreditCard,
  Wallet,
  Receipt,
  Users,
  Shield,
  KeyRound,
  Settings,
  Percent,
  Download,
  AlertOctagon,
  Info,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore.js';
import { BusinessHoursModal } from './BusinessHoursModal.js';
import { DeliverySettingsModal } from './DeliverySettingsModal.js';
import { StoreVisibilityModal } from './StoreVisibilityModal.js';
import { StoreInfoModal } from './StoreInfoModal.js';

interface SettingsHubViewProps {
  onNavigateToBillingSettings?: () => void;
}

export const SettingsHubView: React.FC<SettingsHubViewProps> = ({
  onNavigateToBillingSettings,
}) => {
  const {
    isBusinessHoursModalOpen,
    closeBusinessHoursModal,
    openBusinessHoursModal,
    isDeliverySettingsModalOpen,
    closeDeliverySettingsModal,
    openDeliverySettingsModal,
    isStoreVisibilityModalOpen,
    closeStoreVisibilityModal,
    openStoreVisibilityModal,
    isStoreInfoModalOpen,
    closeStoreInfoModal,
    openStoreInfoModal,
  } = useSettingsStore();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header & Breadcrumb (15.0.png) */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
          <span>Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800">Settings</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your store preferences, configurations and account settings.
        </p>
      </div>

      {/* 4-Category Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Category 1: Store Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Store Settings</h3>
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            <button
              type="button"
              onClick={openStoreInfoModal}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Store Details
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Update your store name, description, logo and contact information.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => alert('Opening Store Banner Image upload dialog...')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Banner Image
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage store banner that represents your brand.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => alert('Opening Store Features / USPs editor...')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Store Features
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Highlight key features and USPs of your store in the app.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={openBusinessHoursModal}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Business Hours
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Set your store working days and operating hours.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={openDeliverySettingsModal}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Delivery Settings
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Configure delivery time, minimum order value and delivery areas.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={openStoreVisibilityModal}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Store Visibility
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Control store status and visibility in the customer app.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>
          </div>
        </div>

        {/* Category 2: Preferences */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Preferences</h3>
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            <button
              type="button"
              onClick={() => alert('Configuring store notifications preferences...')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Notifications
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Configure notifications for orders, customers and store activities.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => alert('Opening payment methods and gateway settings...')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Payment Settings
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage payment methods, bank details and settlement preferences.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => alert('Opening Payout Preferences schedule and threshold editor...')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Payout Preferences
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Set payout schedule, threshold and preferred payout account.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateToBillingSettings) {
                  onNavigateToBillingSettings();
                } else {
                  alert('Navigating to Invoice & Billing settings...');
                }
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Invoice &amp; Billing
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage invoice settings, billing address and GST details.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>
          </div>
        </div>

        {/* Category 3: Account & Access */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Account &amp; Access</h3>
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            <button
              type="button"
              onClick={() => alert('Managing team members and invitations...')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    User &amp; Access
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage team members and their access permissions.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => alert('Configuring store roles & permission matrix...')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Roles &amp; Permissions
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Set roles and manage permissions for your team.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => alert('Managing passwords, sessions, and 2FA settings...')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Security
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage password, 2FA and other security preferences.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>
          </div>
        </div>

        {/* Category 4: General */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">General</h3>
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            <button
              type="button"
              onClick={() => alert('Configuring store language and time zone...')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    General Settings
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage language, time zone and other general preferences.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => alert('Configuring store GST schedules and tax slabs...')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Tax Settings
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Configure GST, tax rates and tax related preferences.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => alert('Exporting store catalog, orders, and customer data...')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/70 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Data &amp; Export
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Export your store data and reports.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to deactivate your store?')) {
                  alert('Store deactivation request initiated.');
                }
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-rose-50/50 text-left transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-700 group-hover:text-rose-800 transition-colors">
                    Deactivate Store
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Temporarily deactivate or permanently delete your store.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* About Settings Footer Card */}
      <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-start gap-3 text-xs text-blue-800">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold text-blue-900">About Settings</h5>
          <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">
            These settings help you manage your store operations and preferences. Changes will be
            reflected across the platform.
          </p>
        </div>
      </div>

      {/* Settings Modals */}
      <BusinessHoursModal
        isOpen={isBusinessHoursModalOpen}
        onClose={closeBusinessHoursModal}
      />
      <DeliverySettingsModal
        isOpen={isDeliverySettingsModalOpen}
        onClose={closeDeliverySettingsModal}
      />
      <StoreVisibilityModal
        isOpen={isStoreVisibilityModalOpen}
        onClose={closeStoreVisibilityModal}
      />
      <StoreInfoModal
        isOpen={isStoreInfoModalOpen}
        onClose={closeStoreInfoModal}
      />
    </div>
  );
};
