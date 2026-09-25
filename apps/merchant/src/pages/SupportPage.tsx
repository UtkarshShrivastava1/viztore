import React from 'react';
import { LayoutDashboard, Ticket, BookOpen, Headphones } from 'lucide-react';
import { useSupportStore, SupportSubTab } from '../stores/supportStore.js';
import { SupportOverviewTab } from '../components/support/SupportOverviewTab.js';
import { SupportTicketsTab } from '../components/support/SupportTicketsTab.js';
import { HelpCenterTab } from '../components/support/HelpCenterTab.js';
import { ContactUsTab } from '../components/support/ContactUsTab.js';
import { TicketDetailsDrawer } from '../components/support/TicketDetailsDrawer.js';
import { CreateTicketModal } from '../components/support/CreateTicketModal.js';

interface SupportPageProps {
  onNavigateHome?: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigateHome }) => {
  const { activeTab, setActiveTab } = useSupportStore();

  const tabs: { id: SupportSubTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'tickets', label: 'My Tickets', icon: Ticket },
    { id: 'help_center', label: 'Help Center', icon: BookOpen },
    { id: 'contact', label: 'Contact Us', icon: Headphones },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Breadcrumb (16.0.png) */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
          <span
            className="hover:text-slate-600 cursor-pointer"
            onClick={onNavigateHome}
          >
            Home
          </span>
          <span>&gt;</span>
          <span
            className={`cursor-pointer ${
              activeTab === 'overview' ? 'text-slate-800 font-bold' : 'hover:text-slate-600'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Support
          </span>
          {activeTab !== 'overview' && (
            <>
              <span>&gt;</span>
              <span className="text-slate-800 font-bold capitalize">
                {activeTab === 'tickets'
                  ? 'My Tickets'
                  : activeTab === 'help_center'
                  ? 'Help Center'
                  : 'Contact Us'}
              </span>
            </>
          )}
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Support</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          We're here to help! Get the support you need.
        </p>
      </div>

      {/* Top Tabs (16.0.png) */}
      <div className="border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-blue-600 bg-blue-50/70 border-b-2 border-blue-600 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Views */}
      <div>
        {activeTab === 'overview' && <SupportOverviewTab />}
        {activeTab === 'tickets' && <SupportTicketsTab />}
        {activeTab === 'help_center' && <HelpCenterTab />}
        {activeTab === 'contact' && <ContactUsTab />}
      </div>

      {/* Slide-over Ticket Details & Creation Modals */}
      <TicketDetailsDrawer />
      <CreateTicketModal />
    </div>
  );
};
