import React from 'react';
import { SmartErpImporterModal } from './SmartErpImporterModal.js';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkSuccess?: (count: number) => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onBulkSuccess,
}) => {
  return (
    <SmartErpImporterModal
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onBulkSuccess}
    />
  );
};
