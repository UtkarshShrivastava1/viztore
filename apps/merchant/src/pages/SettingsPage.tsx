import React from 'react';
import { SettingsHubView } from '../components/settings/SettingsHubView.js';

interface SettingsPageProps {
  onNavigateToBillingSettings?: () => void;
  onNavigateToSupport?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onNavigateToBillingSettings,
  onNavigateToSupport,
}) => {
  return (
    <SettingsHubView
      onNavigateToBillingSettings={onNavigateToBillingSettings}
      onNavigateToSupport={onNavigateToSupport}
    />
  );
};
