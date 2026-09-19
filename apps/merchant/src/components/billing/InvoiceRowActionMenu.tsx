import React, { useEffect, useRef } from 'react';
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
  anchorPosition?: { top: number; right: number };
  onRecordPayment?: (invoice: IInvoice) => void;
}

export const InvoiceRowActionMenu: React.FC<InvoiceRowActionMenuProps> = ({
  invoice,
  isOpen,
  onClose,
  onRecordPayment,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { duplicateInvoice, updateInvoiceStatus } = useBillingStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 text-slate-700"
    >
      <button
        onClick={() => handleAction('download')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700"
      >
        <Download className="w-3.5 h-3.5 text-slate-500" />
        <span>Download PDF</span>
      </button>

      <button
        onClick={() => handleAction('open')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700"
      >
        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        <span>Open</span>
      </button>

      <button
        onClick={() => handleAction('share')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700"
      >
        <Share2 className="w-3.5 h-3.5 text-slate-500" />
        <span>Share Link</span>
      </button>

      <button
        onClick={() => handleAction('duplicate')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700"
      >
        <Copy className="w-3.5 h-3.5 text-slate-500" />
        <span>Duplicate Invoice</span>
      </button>

      <button
        onClick={() => handleAction('mark_sent')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700"
      >
        <Send className="w-3.5 h-3.5 text-slate-500" />
        <span>Mark as Sent</span>
      </button>

      <button
        onClick={() => handleAction('record_payment')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700"
      >
        <CreditCard className="w-3.5 h-3.5 text-slate-500" />
        <span>Record Payment</span>
      </button>

      <button
        onClick={() => handleAction('view_payments')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700"
      >
        <Receipt className="w-3.5 h-3.5 text-slate-500" />
        <span>View Payments</span>
      </button>

      <button
        onClick={() => handleAction('notes')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700"
      >
        <StickyNote className="w-3.5 h-3.5 text-slate-500" />
        <span>Notes</span>
      </button>

      <button
        onClick={() => handleAction('adjust')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
        <span>Adjust Invoice</span>
      </button>

      <div className="my-1 border-t border-slate-100" />

      <button
        onClick={() => handleAction('cancel')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
      >
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>Cancel Invoice</span>
      </button>
    </div>
  );
};
