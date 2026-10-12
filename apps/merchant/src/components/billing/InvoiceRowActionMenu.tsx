import React, { useRef } from 'react';
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
  Printer,
} from 'lucide-react';
import { IInvoice, useBillingStore } from '../../stores/billingStore.js';
import { TableActionPopover } from '../ui/TableActionPopover.js';

interface InvoiceRowActionMenuProps {
  invoice: IInvoice;
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
  anchorRect?: DOMRect | null;
  anchorPosition?: { top: number; right: number };
  onRecordPayment?: (invoice: IInvoice) => void;
  onPrintThermal?: (invoice: IInvoice) => void;
  onPrintA4?: (invoice: IInvoice) => void;
}

export const InvoiceRowActionMenu: React.FC<InvoiceRowActionMenuProps> = ({
  invoice,
  isOpen,
  onClose,
  triggerRef,
  onRecordPayment,
  onPrintThermal,
  onPrintA4,
}) => {
  const fallbackRef = useRef<HTMLDivElement>(null);
  const effectiveTriggerRef = triggerRef || fallbackRef;
  const { duplicateInvoice, updateInvoiceStatus } = useBillingStore();

  if (!isOpen) return null;

  const handleAction = (action: string) => {
    onClose();
    switch (action) {
      case 'download':
        if (onPrintA4) {
          onPrintA4(invoice);
        } else {
          window.print();
        }
        break;
      case 'print_thermal':
        if (onPrintThermal) {
          onPrintThermal(invoice);
        } else {
          window.print();
        }
        break;
      case 'open':
        if (onPrintA4) {
          onPrintA4(invoice);
        } else {
          alert(`Opening ${invoice.invoiceNo} preview.`);
        }
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
    <TableActionPopover
      isOpen={isOpen}
      onClose={onClose}
      triggerRef={effectiveTriggerRef}
      className="w-52 text-slate-700"
    >
      <button
        onClick={() => handleAction('download')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700 text-left cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Download PDF</span>
      </button>

      {onPrintThermal && (
        <button
          onClick={() => handleAction('print_thermal')}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700 text-left cursor-pointer"
        >
          <Receipt className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Print Thermal (80mm)</span>
        </button>
      )}

      {onPrintA4 && (
        <button
          onClick={() => handleAction('open')}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700 text-left cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>Print A4 Invoice</span>
        </button>
      )}

      <button
        onClick={() => handleAction('open')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-700 text-left cursor-pointer"
      >
        <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Open Preview</span>
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
    </TableActionPopover>
  );
};
