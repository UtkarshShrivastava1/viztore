import React from 'react';
import { useSupportStore } from '../stores/supportStore.js';
import { SupportHubView } from '../components/support/SupportHubView.js';
import { CreateSupportTicketView } from '../components/support/CreateSupportTicketView.js';
import { SupportTicketsTab } from '../components/support/SupportTicketsTab.js';
import { TicketDetailsDrawer } from '../components/support/TicketDetailsDrawer.js';
import { CreateTicketModal } from '../components/support/CreateTicketModal.js';

interface SupportPageProps {
  onNavigateHome?: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigateHome }) => {
  const { activeView, setActiveView, activeTab, setActiveTab } = useSupportStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* View Switching */}
      {activeView === 'create_ticket' ? (
        <CreateSupportTicketView onBack={() => setActiveView('hub')} />
      ) : activeTab === 'tickets' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setActiveTab('overview');
                setActiveView('hub');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              ← Back to Support Hub
            </button>
            <button
              type="button"
              onClick={() => setActiveView('create_ticket')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              + Create New Ticket
            </button>
          </div>
          <SupportTicketsTab />
        </div>
      ) : (
        <SupportHubView
          onNavigateToTopic={(category) => {
            setActiveView('create_ticket');
          }}
        />
      )}

      {/* Ticket Details Drawer */}
      <TicketDetailsDrawer />
      <CreateTicketModal />
    </div>
  );
};
