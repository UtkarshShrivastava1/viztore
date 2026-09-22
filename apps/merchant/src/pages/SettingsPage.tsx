import React from 'react';
import { SettingsHubView } from '../components/settings/SettingsHubView.js';

interface SettingsPageProps {
  onNavigateToBillingSettings?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onNavigateToBillingSettings,
}) => {
  return <SettingsHubView onNavigateToBillingSettings={onNavigateToBillingSettings} />;
};
