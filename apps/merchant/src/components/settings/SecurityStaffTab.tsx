import React from 'react';
import { SecurityLoginTab } from './SecurityLoginTab.js';

interface SecurityStaffTabProps {
  onNavigateToSupport?: () => void;
}

export const SecurityStaffTab: React.FC<SecurityStaffTabProps> = ({ onNavigateToSupport }) => {
  return <SecurityLoginTab onNavigateToSupport={onNavigateToSupport} />;
};

export default SecurityStaffTab;
