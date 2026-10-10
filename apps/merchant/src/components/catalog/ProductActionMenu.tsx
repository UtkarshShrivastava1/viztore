import React, { useState, useRef } from 'react';
import {
  MoreVertical,
  Eye,
  Edit2,
  Copy,
  RefreshCw,
  EyeOff,
  CheckCircle,
  Trash2,
  Printer,
} from 'lucide-react';
import { ProductItem, useCatalogStore } from '../../stores/catalogStore.js';
import { TableActionPopover } from '../ui/TableActionPopover.js';

interface ProductActionMenuProps {
  product: ProductItem;
  onViewDetails?: (product: ProductItem) => void;
}

export const ProductActionMenu: React.FC<ProductActionMenuProps> = ({
  product,
  onViewDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const {
    loadProductIntoDraft,
    duplicateProduct,
    toggleProductStatus,
    openStockModal,
    openPrintLabelModal,
    openDeleteModal,
    setActiveView,
    updateDraftProduct,
  } = useCatalogStore();

  const handleView = () => {
    setIsOpen(false);
    updateDraftProduct({ ...product });
    setActiveView('preview');
  };

  const handleEdit = () => {
    setIsOpen(false);
    loadProductIntoDraft(product);
  };

  const handleDuplicate = () => {
    setIsOpen(false);
    duplicateProduct(product.id);
  };

  const handleStock = () => {
    setIsOpen(false);
    openStockModal(product);
  };

  const handleToggleActive = () => {
    setIsOpen(false);
    toggleProductStatus(product.id);
  };

  const handleDelete = () => {
    setIsOpen(false);
    openDeleteModal(product);
  };

  const handlePrint = () => {
    setIsOpen(false);
    openPrintLabelModal(product);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        title="More actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      <TableActionPopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
        className="w-48 rounded-xl py-1.5 text-left shadow-xl"
      >
        {/* 1. View Details */}
        <button
          type="button"
          onClick={handleView}
          className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4 text-slate-500" />
          <span>View Details</span>
        </button>

        {/* 2. Edit Product */}
        <button
          type="button"
          onClick={handleEdit}
          className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <Edit2 className="w-4 h-4 text-slate-500" />
          <span>Edit Product</span>
        </button>

        {/* 3. Duplicate */}
        <button
          type="button"
          onClick={handleDuplicate}
          className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <Copy className="w-4 h-4 text-slate-500" />
          <span>Duplicate</span>
        </button>

        {/* 4. Update Stock */}
        <button
          type="button"
          onClick={handleStock}
          className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Update Stock</span>
        </button>

        {/* 5. Deactivate / Activate */}
        <button
          type="button"
          onClick={handleToggleActive}
          className="w-full text-left px-3.5 py-2 text-xs font-medium text-amber-600 hover:bg-amber-50 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          {product.status === 'active' ? (
            <>
              <EyeOff className="w-4 h-4 text-amber-500" />
              <span>Deactivate</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Activate</span>
            </>
          )}
        </button>

        {/* 6. Delete */}
        <button
          type="button"
          onClick={handleDelete}
          className="w-full text-left px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          <span>Delete</span>
        </button>

        <div className="my-1 border-t border-slate-100" />

        {/* 7. Print Product Label */}
        <button
          type="button"
          onClick={handlePrint}
          className="w-full text-left px-3.5 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-blue-600" />
          <span>Print Product Label</span>
        </button>
      </TableActionPopover>
    </>
  );
};
