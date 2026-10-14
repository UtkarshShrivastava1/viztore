import React, { useState } from 'react';
import { useCatalogStore } from '../stores/catalogStore.js';
import { ProductsCatalogPage } from './ProductsCatalogPage.js';
import { AddProductWizardPage } from './AddProductWizardPage.js';
import { ProductPreviewSubmitPage } from './ProductPreviewSubmitPage.js';
import { BulkUploadModal } from '../components/catalog/BulkUploadModal.js';

export const CatalogPage: React.FC = () => {
  const { activeView } = useCatalogStore();
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  return (
    <div>
      {activeView === 'list' && (
        <ProductsCatalogPage onOpenBulkUpload={() => setIsBulkOpen(true)} />
      )}

      {activeView === 'wizard' && <AddProductWizardPage />}

      {activeView === 'preview' && <ProductPreviewSubmitPage />}

      <BulkUploadModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        onBulkSuccess={(_count) => {
          setIsBulkOpen(false);
        }}
      />
    </div>
  );
};
