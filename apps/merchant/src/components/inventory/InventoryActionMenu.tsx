import React, { useState, useRef } from 'react';
import {
  MoreVertical,
  Eye,
  Edit2,
  Boxes,
  History,
  Copy,
  Printer,
  Trash2,
} from 'lucide-react';
import { InventoryItem, useInventoryStore } from '../../stores/inventoryStore.js';
import { TableActionPopover } from '../ui/TableActionPopover.js';

interface InventoryActionMenuProps {
  item: InventoryItem;
}

export const InventoryActionMenu: React.FC<InventoryActionMenuProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const {
    openAdjustDrawer,
    openHistoryDrawer,
    openDeleteModal,
    openDetailModal,
    duplicateItem,
  } = useInventoryStore();

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`p-1 rounded-md transition-colors cursor-pointer ${
          isOpen
            ? 'border border-blue-600 text-blue-600 bg-blue-50/50'
            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
        }`}
        title="Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      <TableActionPopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
        className="w-44 rounded-xl py-1 text-xs font-medium text-slate-700 shadow-xl divide-y divide-slate-100"
      >
        <div className="py-0.5">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              openDetailModal(item);
            }}
            className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>View Details</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              alert(`Edit product: ${item.name}`);
            }}
            className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Edit Product</span>
          </button>
        </div>

        <div className="py-0.5">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              openAdjustDrawer(item);
            }}
            className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-blue-50/60 hover:text-blue-600 text-slate-800 font-semibold transition-colors text-left cursor-pointer"
          >
            <Boxes className="w-3.5 h-3.5 text-blue-600" />
            <span>Adjust Stock</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              openHistoryDrawer(item);
            }}
            className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Stock History</span>
          </button>
        </div>

        <div className="py-0.5">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              duplicateItem(item.id);
            }}
            className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Duplicate</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              window.print();
            }}
            className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Label</span>
          </button>
        </div>

        <div className="py-0.5">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              openDeleteModal(item);
            }}
            className="w-full px-3 py-1.5 flex items-center gap-2.5 text-red-600 hover:bg-red-50 transition-colors text-left font-medium cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Delete</span>
          </button>
        </div>
      </TableActionPopover>
    </>
  );
};
