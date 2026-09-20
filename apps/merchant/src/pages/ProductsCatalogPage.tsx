import React from 'react';
import { CatalogKpiCards } from '../components/catalog/CatalogKpiCards.js';
import { CatalogToolbar } from '../components/catalog/CatalogToolbar.js';
import { ProductsTable } from '../components/catalog/ProductsTable.js';
import { UpdateStockModal } from '../components/catalog/UpdateStockModal.js';
import { ProductLabelPrintModal } from '../components/catalog/ProductLabelPrintModal.js';
import { useCatalogStore } from '../stores/catalogStore.js';
import { AlertCircle, Trash2 } from 'lucide-react';

interface ProductsCatalogPageProps {
  onOpenBulkUpload?: () => void;
}

export const ProductsCatalogPage: React.FC<ProductsCatalogPageProps> = ({
  onOpenBulkUpload,
}) => {
  const {
    isDeleteModalOpen,
    closeDeleteModal,
    selectedProductForDelete,
    deleteProduct,
    fetchProducts,
    products,
  } = useCatalogStore();

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleConfirmDelete = () => {
    if (selectedProductForDelete) {
      deleteProduct(selectedProductForDelete.id);
      closeDeleteModal();
    }
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,SKU,Name,Category,Price,Stock,Status\n' +
      'PRD-TSHIRT-RD-BLK-M,Men Black Round Neck T-Shirt,Men,599,120,Active\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `catalog_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* 5 Top KPI Cards */}
      <CatalogKpiCards />

      {/* Toolbar & Filter Bar */}
      <CatalogToolbar
        onOpenBulkUpload={onOpenBulkUpload}
        onExportCsv={handleExportCsv}
      />

      {/* Main Data Table */}
      <ProductsTable />

      {/* Stock Updater Modal */}
      <UpdateStockModal />

      {/* Barcode Sticker Print Modal */}
      <ProductLabelPrintModal />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProductForDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Product?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-slate-800">&ldquo;{selectedProductForDelete.name}&rdquo;</strong>?
              This action cannot be undone.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
