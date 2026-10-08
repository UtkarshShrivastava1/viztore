import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Download,
  ExternalLink,
  Share2,
  Copy,
  Send,
  CreditCard,
  Receipt,
  StickyNote,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react';
import { IInvoice, useBillingStore } from '../../stores/billingStore.js';

interface InvoiceRowActionMenuProps {
  invoice: IInvoice;
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
  anchorPosition?: { top: number; right: number };
  onRecordPayment?: (invoice: IInvoice) => void;
}

export const InvoiceRowActionMenu: React.FC<InvoiceRowActionMenuProps> = ({
  invoice,
  isOpen,
  onClose,
  anchorRect,
  anchorPosition,
  onRecordPayment,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { duplicateInvoice, updateInvoiceStatus } = useBillingStore();
  const [coords, setCoords] = useState<{ top: number; left?: number; right?: number }>({
    top: 0,
    right: 16,
  });

  // Calculate fixed positioning relative to viewport
  useLayoutEffect(() => {
    if (!isOpen) return;

    if (anchorRect) {
      const menuWidth = 208; // w-52
      const menuHeight = menuRef.current?.offsetHeight || 380;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Vertical placement: prefer opening downwards
      let top = anchorRect.bottom + 6;
      if (top + menuHeight > viewportHeight - 12) {
        if (anchorRect.top - menuHeight > 12) {
          // Open upwards if enough space above
          top = anchorRect.top - menuHeight - 6;
        } else {
          // Clamp inside viewport
          top = Math.max(12, viewportHeight - menuHeight - 12);
        }
      }

      // Horizontal placement: align right edge with trigger button
      let right: number | undefined = Math.max(12, viewportWidth - anchorRect.right);
      let left: number | undefined = undefined;

      // If aligning to right causes overflow on the left edge
      if (viewportWidth - right < menuWidth + 12) {
        right = undefined;
        left = Math.max(12, anchorRect.left);
      }

      setCoords({ top, right, left });
    } else if (anchorPosition) {
      setCoords({ top: anchorPosition.top, right: anchorPosition.right });
    }
  }, [isOpen, anchorRect, anchorPosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // Allow trigger button to manage its own toggling
      if (target?.closest?.('[data-invoice-menu-trigger]')) {
        return;
      }
      if (menuRef.current && !menuRef.current.contains(target as Node)) {
        onClose();
      }
    };

    const handleScrollOrResize = (e: Event) => {
      // If scroll happens inside the menu itself, ignore
      if (menuRef.current && e.target instanceof Node && menuRef.current.contains(e.target)) {
        return;
      }
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleAction = (action: string) => {
    onClose();
    switch (action) {
      case 'download':
        window.print();
        break;
      case 'open':
        alert(`Opening ${invoice.invoiceNo} preview.`);
        break;
      case 'share':
        navigator.clipboard?.writeText?.(window.location.href);
        alert(`Link to ${invoice.invoiceNo} copied to clipboard!`);
        break;
      case 'duplicate':
        duplicateInvoice(invoice.id);
        alert(`Invoice ${invoice.invoiceNo} duplicated successfully!`);
        break;
      case 'mark_sent':
        updateInvoiceStatus(invoice.id, 'issued');
        alert(`Invoice ${invoice.invoiceNo} marked as sent.`);
        break;
      case 'record_payment':
        if (onRecordPayment) {
          onRecordPayment(invoice);
        } else {
          const amtStr = prompt(
            `Enter payment amount for ${invoice.invoiceNo} (Due: ₹${invoice.dueAmount.toLocaleString()}):`,
            String(invoice.dueAmount)
          );
          if (amtStr && !isNaN(Number(amtStr))) {
            useBillingStore.getState().recordPayment(invoice.id, Number(amtStr), 'upi');
            alert(`Payment of ₹${amtStr} recorded for ${invoice.invoiceNo}!`);
          }
        }
        break;
      case 'view_payments':
        alert(
          `Payment history for ${invoice.invoiceNo}:\nPaid: ₹${invoice.paidAmount.toLocaleString()}\nDue: ₹${invoice.dueAmount.toLocaleString()}\nMode: ${invoice.settlementMode || 'N/A'}`
        );
        break;
      case 'notes':
        alert(`Notes on ${invoice.invoiceNo}:\n${invoice.notes || 'No internal notes on this invoice.'}`);
        break;
      case 'adjust':
        alert(`Open invoice adjustment view for ${invoice.invoiceNo}.`);
        break;
      case 'cancel':
        if (confirm(`Are you sure you want to cancel invoice ${invoice.invoiceNo}?`)) {
          updateInvoiceStatus(invoice.id, 'cancelled');
        }
        break;
      default:
        break;
    }
  };

  const menuElement = (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        ...(coords.left !== undefined ? { left: `${coords.left}px` } : {}),
        ...(coords.right !== undefined ? { right: `${coords.right}px` } : {}),
      }}
      className="w-52 max-h-[calc(100vh-24px)] overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200/90 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-150 text-slate-700"
    >
      <button
        onClick={() => handleAction('download')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700 text-left cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Download PDF</span>
      </button>

      <button
        onClick={() => handleAction('open')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700 text-left cursor-pointer"
      >
        <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Open</span>
      </button>

      <button
        onClick={() => handleAction('share')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700 text-left cursor-pointer"
      >
        <Share2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Share Link</span>
      </button>

      <button
        onClick={() => handleAction('duplicate')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700 text-left cursor-pointer"
      >
        <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Duplicate Invoice</span>
      </button>

      <button
        onClick={() => handleAction('mark_sent')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700 text-left cursor-pointer"
      >
        <Send className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Mark as Sent</span>
      </button>

      <button
        onClick={() => handleAction('record_payment')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700 text-left cursor-pointer"
      >
        <CreditCard className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Record Payment</span>
      </button>

      <button
        onClick={() => handleAction('view_payments')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700 text-left cursor-pointer"
      >
        <Receipt className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>View Payments</span>
      </button>

      <button
        onClick={() => handleAction('notes')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700 text-left cursor-pointer"
      >
        <StickyNote className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Notes</span>
      </button>

      <button
        onClick={() => handleAction('adjust')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700 text-left cursor-pointer"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Adjust Invoice</span>
      </button>

      <div className="my-1 border-t border-slate-100" />

      <button
        onClick={() => handleAction('cancel')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
      >
        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        <span>Cancel Invoice</span>
      </button>
    </div>
  );

  return createPortal(menuElement, document.body);
};
