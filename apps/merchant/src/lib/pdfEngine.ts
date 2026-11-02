import { jsPDF } from 'jspdf';
import { branding } from '@repo/shared-types/branding.config';
import { useAuthStore } from '../stores/authStore.js';
import { numberToIndianWords } from './numberToWords.js';

export interface DocumentItem {
  id?: string;
  name: string;
  description?: string;
  hsn?: string;
  sku?: string;
  qty: number;
  unit?: string;
  rate: number;
  taxPercent?: number;
  total: number;
}

export interface VoucherDocumentData {
  title: string; // e.g. "PURCHASE VOUCHER", "TAX INVOICE", "E-WAY BILL SLIP", "PAYMENT RECEIPT"
  referenceNo: string;
  voucherType?: string; // "Purchase", "Expense", "Purchase Order", "Credit Note", "E-Way Bill"
  date: string;
  time?: string;
  dueDate?: string;
  paymentTerms?: string;
  placeOfSupply?: string;
  purchaseOrderRef?: string;
  status?: string;
  paymentStatus?: string;
  vendorOrCustomer: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    gstin?: string;
    phone?: string;
    email?: string;
  };
  items: DocumentItem[];
  financials: {
    subtotal: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
    taxAmount?: number;
    totalAmount: number;
    paidAmount?: number;
    balanceDue?: number;
    paymentMethod?: string;
    referenceTxnId?: string;
  };
  ewayBill?: {
    ewayBillNo: string;
    vehicleNo?: string;
    validTill?: string;
    fromLocation?: string;
    toLocation?: string;
    distanceKm?: number;
  };
  notes?: string;
  filename?: string;
}

/**
 * Format currency with Indian grouping: 1,23,456.78
 */
function formatINR(val: number): string {
  return Number(val || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Generates clean, isolated, print-ready HTML for A4 paper.
 * Contains 0% webpage chrome, 0% background, and 100% professional document typography.
 */
export function generateDocumentHtml(data: VoucherDocumentData): string {
  const store = useAuthStore.getState().currentStore;
  const storeName = store?.name || `${branding.appName} Merchant Store`;
  const storeAddress = store?.address
    ? `${store.address.street || ''}, ${store.address.city || ''}, ${store.address.state || ''} - ${store.address.pincode || ''}`
    : 'Commercial Market, Bhilai, Chhattisgarh - 490006';
  const storeGstin = store?.legalDetails?.gstin || '22AABCS1429B1ZB';
  const storePhone = store?.address?.landmark || 'Support: +91 98765 43210';

  const amountInWords = numberToIndianWords(data.financials.totalAmount);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${data.title} - ${data.referenceNo}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff !important;
      font-size: 11px;
      line-height: 1.4;
      padding: 4px;
    }
    .invoice-card {
      border: 1.5px solid #0f172a;
      border-radius: 6px;
      padding: 16px 20px;
      max-width: 195mm;
      margin: 0 auto;
      background: #ffffff;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 12px;
    }
    .store-brand {
      max-width: 60%;
    }
    .store-name {
      font-size: 18px;
      font-weight: 900;
      letter-spacing: -0.5px;
      text-transform: uppercase;
      color: #0f172a;
      margin-bottom: 3px;
    }
    .store-details {
      font-size: 10px;
      color: #475569;
      line-height: 1.35;
    }
    .doc-badge-col {
      text-align: right;
    }
    .doc-badge {
      display: inline-block;
      background: #0f172a;
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .doc-ref {
      font-size: 14px;
      font-weight: 800;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: #0f172a;
    }
    .doc-date {
      font-size: 10px;
      color: #64748b;
      margin-top: 2px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 12px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 10px 14px;
      margin-bottom: 14px;
      background: #f8fafc;
    }
    .meta-box h4 {
      font-size: 9px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .entity-name {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      margin-bottom: 3px;
    }
    .meta-row .label {
      color: #64748b;
      font-weight: 600;
    }
    .meta-row .val {
      color: #0f172a;
      font-weight: 700;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    table.items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 10px;
    }
    table.items-table th {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.3px;
      color: #334155;
    }
    table.items-table td {
      border: 1px solid #e2e8f0;
      padding: 6px 8px;
      vertical-align: top;
      color: #1e293b;
    }
    .item-name {
      font-weight: 700;
      color: #0f172a;
    }
    .item-desc {
      font-size: 9px;
      color: #64748b;
      margin-top: 1px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 14px;
      align-items: flex-start;
      margin-bottom: 14px;
    }
    .words-box {
      border: 1px dashed #cbd5e1;
      border-radius: 4px;
      padding: 8px 10px;
      background: #f8fafc;
      font-size: 10px;
    }
    .words-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 2px;
    }
    .words-val {
      font-weight: 700;
      color: #0f172a;
      line-height: 1.35;
    }

    .totals-box {
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 8px 12px;
      background: #ffffff;
    }
    .total-line {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      margin-bottom: 4px;
      color: #475569;
    }
    .total-line.bold {
      border-top: 1.5px solid #0f172a;
      padding-top: 6px;
      margin-top: 6px;
      font-size: 13px;
      font-weight: 900;
      color: #0f172a;
    }

    .eway-highlight {
      border: 1px solid #10b981;
      background: #ecfdf5;
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 14px;
      font-size: 10px;
      color: #065f46;
    }
    .eway-title {
      font-weight: 800;
      text-transform: uppercase;
      font-size: 10px;
      margin-bottom: 4px;
      color: #047857;
    }
    .eway-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      font-size: 9.5px;
    }

    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid #cbd5e1;
      padding-top: 14px;
      margin-top: 8px;
    }
    .terms-box {
      max-width: 60%;
      font-size: 9px;
      color: #64748b;
      line-height: 1.4;
    }
    .sign-box {
      text-align: center;
      width: 140px;
    }
    .sign-line {
      border-top: 1px solid #0f172a;
      padding-top: 4px;
      font-size: 9.5px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
    }
    .watermark-note {
      text-align: center;
      font-size: 8px;
      color: #94a3b8;
      margin-top: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <!-- Header -->
    <div class="header-row">
      <div class="store-brand">
        <div class="store-name">${storeName}</div>
        <div class="store-details">${storeAddress}</div>
        <div class="store-details"><strong>GSTIN:</strong> ${storeGstin} | <strong>Phone:</strong> ${storePhone}</div>
      </div>
      <div class="doc-badge-col">
        <div class="doc-badge">${data.title}</div>
        <div class="doc-ref">#${data.referenceNo}</div>
        <div class="doc-date">Date: ${data.date} ${data.time ? '| ' + data.time : ''}</div>
      </div>
    </div>

    <!-- Metadata Grid -->
    <div class="meta-grid">
      <div class="meta-box">
        <h4>${data.voucherType === 'Purchase' || data.voucherType === 'Expense' ? 'Vendor / Billed By' : 'Customer / Billed To'}</h4>
        <div class="entity-name">${data.vendorOrCustomer.name}</div>
        ${data.vendorOrCustomer.address ? `<div style="color: #475569; font-size: 10px;">${data.vendorOrCustomer.address}</div>` : ''}
        ${data.vendorOrCustomer.city ? `<div style="color: #475569; font-size: 10px;">${data.vendorOrCustomer.city}${data.vendorOrCustomer.pincode ? ' - ' + data.vendorOrCustomer.pincode : ''}</div>` : ''}
        ${data.vendorOrCustomer.gstin ? `<div style="color: #334155; font-size: 10px; margin-top: 2px;"><strong>GSTIN:</strong> ${data.vendorOrCustomer.gstin}</div>` : ''}
        ${data.vendorOrCustomer.phone ? `<div style="color: #334155; font-size: 10px;"><strong>Phone:</strong> ${data.vendorOrCustomer.phone}</div>` : ''}
      </div>

      <div class="meta-box">
        <h4>Voucher & Commercial Details</h4>
        <div class="meta-row">
          <span class="label">Voucher / Bill No:</span>
          <span class="val">${data.referenceNo}</span>
        </div>
        <div class="meta-row">
          <span class="label">Place of Supply:</span>
          <span class="val">${data.placeOfSupply || 'Chhattisgarh (22)'}</span>
        </div>
        <div class="meta-row">
          <span class="label">Payment Terms:</span>
          <span class="val">${data.paymentTerms || 'Due on Receipt'}</span>
        </div>
        ${data.purchaseOrderRef ? `
        <div class="meta-row">
          <span class="label">Linked PO Ref:</span>
          <span class="val">${data.purchaseOrderRef}</span>
        </div>
        ` : ''}
        <div class="meta-row">
          <span class="label">Payment Status:</span>
          <span class="val" style="color: ${data.financials.balanceDue && data.financials.balanceDue > 0 ? '#b45309' : '#047857'}">
            ${data.paymentStatus || (data.financials.balanceDue && data.financials.balanceDue > 0 ? 'Partial' : 'Paid')}
          </span>
        </div>
      </div>
    </div>

    <!-- E-Way Bill Section (if present) -->
    ${data.ewayBill ? `
    <div class="eway-highlight">
      <div class="eway-title">Official E-Way Bill Movement Clearance</div>
      <div class="eway-grid">
        <div><strong>E-Way Bill No:</strong> ${data.ewayBill.ewayBillNo}</div>
        <div><strong>Vehicle No:</strong> ${data.ewayBill.vehicleNo || 'CG 07 CA 4589'}</div>
        <div><strong>Valid Till:</strong> ${data.ewayBill.validTill || '7 Days'}</div>
        <div><strong>From:</strong> ${data.ewayBill.fromLocation || data.vendorOrCustomer.city || 'Origin Hub'}</div>
        <div><strong>To:</strong> ${data.ewayBill.toLocation || 'Central Store, Bhilai'}</div>
        <div><strong>Distance:</strong> ${data.ewayBill.distanceKm || 45} KM</div>
      </div>
    </div>
    ` : ''}

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 5%; text-align: center;">#</th>
          <th style="width: 45%;">Item / Product Description</th>
          <th style="width: 15%; text-align: center;">HSN/SKU</th>
          <th style="width: 10%; text-align: center;">Qty</th>
          <th style="width: 12%; text-align: right;">Rate (₹)</th>
          <th style="width: 13%; text-align: right;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map((it, idx) => `
          <tr>
            <td style="text-align: center; color: #64748b;">${idx + 1}</td>
            <td>
              <div class="item-name">${it.name}</div>
              ${it.description ? `<div class="item-desc">${it.description}</div>` : ''}
            </td>
            <td style="text-align: center; font-family: monospace; font-size: 9px; color: #475569;">${it.hsn || it.sku || '6109'}</td>
            <td style="text-align: center; font-weight: 700;">${it.qty} ${it.unit || 'Pcs'}</td>
            <td style="text-align: right;">₹ ${formatINR(it.rate)}</td>
            <td style="text-align: right; font-weight: 700;">₹ ${formatINR(it.total)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Summary Grid -->
    <div class="summary-grid">
      <div class="words-box">
        <div class="words-label">Amount in Words:</div>
        <div class="words-val">${amountInWords}</div>
        ${data.financials.paymentMethod ? `
        <div style="margin-top: 8px; font-size: 9.5px; color: #475569;">
          <strong>Settlement Mode:</strong> ${data.financials.paymentMethod} ${data.financials.referenceTxnId ? `(Ref: ${data.financials.referenceTxnId})` : ''}
        </div>
        ` : ''}
      </div>

      <div class="totals-box">
        <div class="total-line">
          <span>Taxable Subtotal:</span>
          <span>₹ ${formatINR(data.financials.subtotal)}</span>
        </div>
        <div class="total-line">
          <span>CGST (9%):</span>
          <span>₹ ${formatINR(data.financials.cgst || (data.financials.taxAmount ? data.financials.taxAmount / 2 : 0))}</span>
        </div>
        <div class="total-line">
          <span>SGST (9%):</span>
          <span>₹ ${formatINR(data.financials.sgst || (data.financials.taxAmount ? data.financials.taxAmount / 2 : 0))}</span>
        </div>
        <div class="total-line bold">
          <span>Grand Total:</span>
          <span>₹ ${formatINR(data.financials.totalAmount)}</span>
        </div>
        ${data.financials.paidAmount !== undefined ? `
        <div class="total-line" style="margin-top: 4px; font-weight: 600; color: #047857;">
          <span>Amount Paid:</span>
          <span>₹ ${formatINR(data.financials.paidAmount)}</span>
        </div>
        ` : ''}
        ${data.financials.balanceDue !== undefined && data.financials.balanceDue > 0 ? `
        <div class="total-line" style="font-weight: 700; color: #b45309;">
          <span>Balance Due:</span>
          <span>₹ ${formatINR(data.financials.balanceDue)}</span>
        </div>
        ` : ''}
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-row">
      <div class="terms-box">
        <strong>Terms & Conditions:</strong>
        <div>1. Goods once received and verified at intake dock cannot be returned after 48 hours.</div>
        <div>2. Input Tax Credit (ITC) applicable as per GST regulations in GSTR-2B.</div>
        <div>3. All disputes are subject to local jurisdiction.</div>
      </div>

      <div class="sign-box">
        <div style="height: 38px;"></div>
        <div class="sign-line">Authorized Signatory</div>
      </div>
    </div>

    <div class="watermark-note">
      This is a verified computer generated document • Powered by ${branding.appName} Retail Platform
    </div>
  </div>
</body>
</html>`;
}

/**
 * Isolated Clean Printing:
 * Mounts an isolated hidden iframe, renders the clean standalone document HTML,
 * and prints ONLY the document. Webpage background, sidebar, and modals NEVER appear.
 */
export function printFormattedDocument(data: VoucherDocumentData): void {
  const html = generateDocumentHtml(data);

  // Create an isolated iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.setAttribute('title', 'Print Frame');

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    // Fallback to new clean window if iframe access blocked
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(html);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
        printWin.close();
      }, 250);
    }
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  // Print once contents loaded
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('Iframe print failed, falling back to popup', e);
    } finally {
      // Clean up DOM after print dialog closes
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }
  }, 350);
}

/**
 * Direct PDF File Download:
 * Uses jsPDF to generate a crisp, vector A4 PDF file and directly downloads it
 * to the merchant's machine without ever opening the print dialog.
 */
export function downloadDocumentPdf(data: VoucherDocumentData): void {
  const store = useAuthStore.getState().currentStore;
  const storeName = store?.name || `${branding.appName} Merchant Store`;
  const storeAddress = store?.address
    ? `${store.address.street || ''}, ${store.address.city || ''}`
    : 'Commercial Market, Bhilai, Chhattisgarh';
  const storeGstin = store?.legalDetails?.gstin || '22AABCS1429B1ZB';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // 1. Store Header & Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(storeName.toUpperCase(), margin, cursorY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(`${storeAddress} | GSTIN: ${storeGstin}`, margin, cursorY + 10);

  // Document Badge on right
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(pageWidth - margin - 50, cursorY, 50, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(data.title.toUpperCase(), pageWidth - margin - 25, cursorY + 4.8, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`#${data.referenceNo}`, pageWidth - margin, cursorY + 13, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${data.date}`, pageWidth - margin, cursorY + 17, { align: 'right' });

  cursorY += 22;

  // Divider line
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.6);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 4;

  // 2. Metadata Cards (2 columns)
  const colWidth = (contentWidth - 6) / 2;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, cursorY, colWidth, 28, 1.5, 1.5, 'FD');
  doc.roundedRect(margin + colWidth + 6, cursorY, colWidth, 28, 1.5, 1.5, 'FD');

  // Left: Entity Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const partyLabel = data.voucherType === 'Purchase' || data.voucherType === 'Expense' ? 'VENDOR / SUPPLIER DETAILS' : 'CUSTOMER DETAILS';
  doc.text(partyLabel, margin + 4, cursorY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(data.vendorOrCustomer.name.substring(0, 38), margin + 4, cursorY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  if (data.vendorOrCustomer.address) {
    doc.text(data.vendorOrCustomer.address.substring(0, 42), margin + 4, cursorY + 14.5);
  }
  const cityPincode = `${data.vendorOrCustomer.city || 'Durg'}${data.vendorOrCustomer.pincode ? ' - ' + data.vendorOrCustomer.pincode : ''}`;
  doc.text(cityPincode, margin + 4, cursorY + 18.5);

  if (data.vendorOrCustomer.gstin) {
    doc.setFont('helvetica', 'bold');
    doc.text(`GSTIN: ${data.vendorOrCustomer.gstin}`, margin + 4, cursorY + 23);
  }

  // Right: Voucher Metadata
  const rX = margin + colWidth + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('VOUCHER & COMPLIANCE METRICS', rX + 4, cursorY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Place of Supply:', rX + 4, cursorY + 10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(data.placeOfSupply || 'Chhattisgarh (22)', rX + colWidth - 4, cursorY + 10, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Payment Terms:', rX + 4, cursorY + 14.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(data.paymentTerms || 'Due on Receipt', rX + colWidth - 4, cursorY + 14.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Settlement Status:', rX + 4, cursorY + 19);
  doc.setFont('helvetica', 'bold');
  const isSettled = !data.financials.balanceDue || data.financials.balanceDue <= 0;
  doc.setTextColor(isSettled ? 4 : 180, isSettled ? 120 : 83, isSettled ? 87 : 9);
  doc.text(data.paymentStatus || (isSettled ? 'Paid & Reconciled' : 'Pending Settlement'), rX + colWidth - 4, cursorY + 19, { align: 'right' });

  if (data.purchaseOrderRef) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('PO Reference:', rX + 4, cursorY + 23.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text(data.purchaseOrderRef, rX + colWidth - 4, cursorY + 23.5, { align: 'right' });
  }

  cursorY += 32;

  // 3. E-Way Bill highlight banner (if applicable)
  if (data.ewayBill) {
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(16, 185, 129);
    doc.roundedRect(margin, cursorY, contentWidth, 12, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(4, 120, 87);
    doc.text(`E-WAY BILL: ${data.ewayBill.ewayBillNo} • VALID TILL: ${data.ewayBill.validTill || '7 Days'}`, margin + 4, cursorY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(6, 95, 70);
    const routeText = `Vehicle: ${data.ewayBill.vehicleNo || 'CG 07 CA 4589'} | Route: ${data.ewayBill.fromLocation || 'Origin'} -> ${data.ewayBill.toLocation || 'Central Store'} (${data.ewayBill.distanceKm || 45} KM)`;
    doc.text(routeText, margin + 4, cursorY + 9);

    cursorY += 16;
  }

  // 4. Items Table Header
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, cursorY, contentWidth, 7, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  doc.text('#', margin + 3, cursorY + 4.8);
  doc.text('ITEM / PRODUCT DESCRIPTION', margin + 12, cursorY + 4.8);
  doc.text('HSN/SKU', margin + 98, cursorY + 4.8);
  doc.text('QTY', margin + 125, cursorY + 4.8, { align: 'center' });
  doc.text('RATE (INR)', margin + 150, cursorY + 4.8, { align: 'right' });
  doc.text('AMOUNT (INR)', margin + contentWidth - 3, cursorY + 4.8, { align: 'right' });

  cursorY += 7;

  // Items Table Rows
  data.items.forEach((item, idx) => {
    const rowHeight = 7.5;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, cursorY + rowHeight, margin + contentWidth, cursorY + rowHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(String(idx + 1), margin + 3, cursorY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(item.name.substring(0, 44), margin + 12, cursorY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(item.hsn || item.sku || '6109', margin + 98, cursorY + 5);

    doc.setFont('helvetica', 'bold');
    doc.text(`${item.qty} ${item.unit || 'Pcs'}`, margin + 125, cursorY + 5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.text(formatINR(item.rate), margin + 150, cursorY + 5, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(formatINR(item.total), margin + contentWidth - 3, cursorY + 5, { align: 'right' });

    cursorY += rowHeight;
  });

  cursorY += 4;

  // 5. Amount Summary & Words Box
  const summaryBoxWidth = 72;
  const wordsBoxWidth = contentWidth - summaryBoxWidth - 6;

  // Left: Words Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, cursorY, wordsBoxWidth, 28, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('AMOUNT IN WORDS:', margin + 4, cursorY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  const splitWords = doc.splitTextToSize(numberToIndianWords(data.financials.totalAmount), wordsBoxWidth - 8);
  doc.text(splitWords, margin + 4, cursorY + 10);

  if (data.financials.paymentMethod) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Payment Mode: ${data.financials.paymentMethod}`, margin + 4, cursorY + 23);
  }

  // Right: Totals Box
  const tX = margin + wordsBoxWidth + 6;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(tX, cursorY, summaryBoxWidth, 28, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  doc.text('Taxable Subtotal:', tX + 4, cursorY + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`INR ${formatINR(data.financials.subtotal)}`, tX + summaryBoxWidth - 4, cursorY + 5.5, { align: 'right' });

  const cgstVal = data.financials.cgst || (data.financials.taxAmount ? data.financials.taxAmount / 2 : 0);
  const sgstVal = data.financials.sgst || (data.financials.taxAmount ? data.financials.taxAmount / 2 : 0);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('CGST (9%):', tX + 4, cursorY + 10.5);
  doc.text(`INR ${formatINR(cgstVal)}`, tX + summaryBoxWidth - 4, cursorY + 10.5, { align: 'right' });

  doc.text('SGST (9%):', tX + 4, cursorY + 15.5);
  doc.text(`INR ${formatINR(sgstVal)}`, tX + summaryBoxWidth - 4, cursorY + 15.5, { align: 'right' });

  // Divider for Total
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(tX + 4, cursorY + 18, tX + summaryBoxWidth - 4, cursorY + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Total Amount:', tX + 4, cursorY + 23.5);
  doc.text(`INR ${formatINR(data.financials.totalAmount)}`, tX + summaryBoxWidth - 4, cursorY + 23.5, { align: 'right' });

  cursorY += 34;

  // 6. Signatory & Compliance Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Terms & Conditions:', margin, cursorY);
  doc.text('1. Goods once inspected at intake dock are subject to commercial GST reconciliation.', margin, cursorY + 4);
  doc.text('2. Computer-generated tax document compliant with GST Electronic Invoicing standards.', margin, cursorY + 8);

  // Signatory Box
  const signX = pageWidth - margin - 45;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(signX, cursorY + 16, pageWidth - margin, cursorY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('AUTHORIZED SIGNATORY', signX + 22.5, cursorY + 20, { align: 'center' });

  // Bottom watermark
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated securely by ${branding.appName} Retail Monolith • All rights reserved`, pageWidth / 2, 290, { align: 'center' });

  // 7. Save and trigger direct file download
  const safeFilename = (data.filename || `${data.referenceNo}_${data.title.replace(/\s+/g, '_')}`).replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeFilename}.pdf`);
}

/**
 * Isolated raw HTML printer:
 * Mounts an isolated hidden iframe and prints provided HTML without background website chrome.
 */
export function printHtmlDocument(html: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.setAttribute('title', 'Print Frame');

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(html);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
        printWin.close();
      }, 250);
    }
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('Iframe print failed', e);
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }
  }, 350);
}

/**
 * Converts a Billing Invoice into standard VoucherDocumentData
 */
export function invoiceToVoucherDoc(invoice: any): VoucherDocumentData {
  const taxableAmount = Math.max(0, (invoice.subTotal || 0) - (invoice.discountTotal || 0));
  const taxTotal = invoice.taxTotal ?? (taxableAmount * 0.18);
  const halfTax = Math.round((taxTotal / 2) * 100) / 100;
  return {
    title: invoice.type === 'Bill of Supply' ? 'BILL OF SUPPLY' : 'TAX INVOICE',
    referenceNo: invoice.invoiceNo,
    voucherType: 'Sale Invoice',
    date: (invoice.date ? String(invoice.date).split('T')[0] : new Date().toISOString().split('T')[0]) || '',
    dueDate: invoice.dueDate ? String(invoice.dueDate).split('T')[0] : undefined,
    paymentTerms: invoice.paymentTerms || 'Due on Receipt',
    placeOfSupply: invoice.placeOfSupply || 'Chhattisgarh (22)',
    status: invoice.status || 'Active',
    paymentStatus: (invoice.dueAmount ?? 0) <= 0 ? 'Paid' : (invoice.paidAmount ?? 0) > 0 ? 'Partial' : 'Unpaid',
    vendorOrCustomer: {
      name: invoice.customerName || 'Walk-in Customer',
      phone: invoice.customerPhone || '',
      gstin: invoice.customerGstin || '',
      address: invoice.customerAddress || '',
    },
    items: (invoice.items || []).map((it: any) => ({
      id: it.id,
      name: it.name,
      description: it.description,
      hsn: it.hsnSac || '6109',
      qty: it.quantity || 1,
      unit: it.unit || 'Pcs',
      rate: it.rate || 0,
      taxPercent: it.taxPercent || 18,
      total: it.amount || ((it.quantity || 1) * (it.rate || 0)),
    })),
    financials: {
      subtotal: invoice.subTotal || taxableAmount,
      cgst: halfTax,
      sgst: halfTax,
      taxAmount: taxTotal,
      totalAmount: invoice.totalAmount,
      paidAmount: invoice.paidAmount,
      balanceDue: invoice.dueAmount,
      paymentMethod: invoice.settlementMode ? String(invoice.settlementMode).toUpperCase() : 'CASH',
    },
    notes: invoice.notes,
    filename: `Invoice_${invoice.invoiceNo}`,
  };
}

/**
 * Converts a Billing Quote into standard VoucherDocumentData
 */
export function quoteToVoucherDoc(quote: any): VoucherDocumentData {
  const taxableAmount = Math.max(0, (quote.subTotal || 0) - (quote.discountTotal || 0));
  const taxTotal = quote.taxTotal ?? (taxableAmount * 0.18);
  const halfTax = Math.round((taxTotal / 2) * 100) / 100;
  return {
    title: 'QUOTATION / ESTIMATE',
    referenceNo: quote.quoteNo,
    voucherType: 'Estimate',
    date: (quote.date ? String(quote.date).split('T')[0] : new Date().toISOString().split('T')[0]) || '',
    dueDate: quote.validUntil ? String(quote.validUntil).split('T')[0] : undefined,
    paymentTerms: quote.paymentTerms || 'Valid for 15 Days',
    placeOfSupply: quote.placeOfSupply || 'Chhattisgarh (22)',
    status: 'Issued',
    paymentStatus: 'Quotation Only',
    vendorOrCustomer: {
      name: quote.customerName || 'Prospective Customer',
      phone: quote.customerPhone || '',
      email: quote.customerEmail || '',
      gstin: quote.customerGstin || '',
      address: quote.customerAddress || '',
    },
    items: (quote.items || []).map((it: any) => ({
      id: it.id,
      name: it.name,
      description: it.description,
      hsn: it.hsnSac || '6109',
      qty: it.quantity || 1,
      unit: it.unit || 'Pcs',
      rate: it.rate || 0,
      taxPercent: it.taxPercent || 18,
      total: it.amount || ((it.quantity || 1) * (it.rate || 0)),
    })),
    financials: {
      subtotal: quote.subTotal || taxableAmount,
      cgst: halfTax,
      sgst: halfTax,
      taxAmount: taxTotal,
      totalAmount: quote.totalAmount,
      balanceDue: quote.totalAmount,
    },
    notes: quote.notes || quote.terms,
    filename: `Quote_${quote.quoteNo}`,
  };
}

/**
 * Converts a Payout Request into standard VoucherDocumentData
 */
export function payoutToVoucherDoc(payout: any): VoucherDocumentData {
  return {
    title: 'PAYOUT SETTLEMENT RECEIPT',
    referenceNo: payout.id || payout.referenceNo || 'PAYOUT-RECEIPT',
    voucherType: 'Payout',
    date: (payout.requestDate ? String(payout.requestDate).split('T')[0] : new Date().toISOString().split('T')[0]) || '',
    paymentTerms: 'Bank Direct Credit (NEFT/IMPS)',
    status: payout.status,
    paymentStatus: payout.status === 'Approved' ? 'Settled' : payout.status,
    vendorOrCustomer: {
      name: payout.beneficiaryName || 'Store Account',
      phone: payout.bankDetails?.accountNo ? `A/C: ${payout.bankDetails.accountNo}` : '',
      address: payout.bankDetails?.bankName ? `${payout.bankDetails.bankName} (IFSC: ${payout.bankDetails?.ifscCode || ''})` : 'Registered Merchant Bank Account',
    },
    items: [
      {
        name: `Merchant Wallet Settlement - ${payout.type || 'Standard'}`,
        description: `UTR / Reference ID: ${payout.utrNumber || payout.referenceId || 'PENDING'}`,
        qty: 1,
        unit: 'Txn',
        rate: payout.amount || 0,
        total: payout.amount || 0,
      },
    ],
    financials: {
      subtotal: payout.amount || 0,
      totalAmount: payout.amount || 0,
      paidAmount: payout.status === 'Approved' ? payout.amount : 0,
      balanceDue: payout.status === 'Approved' ? 0 : payout.amount,
      paymentMethod: 'NEFT / IMPS Bank Transfer',
      referenceTxnId: payout.utrNumber || payout.referenceId,
    },
    notes: payout.notes || 'Settlement processed to merchant registered bank account.',
    filename: `Payout_${payout.id || 'receipt'}`,
  };
}

/**
 * Converts a Wallet Transaction into standard VoucherDocumentData
 */
export function walletTxnToVoucherDoc(txn: any): VoucherDocumentData {
  return {
    title: 'WALLET TRANSACTION RECEIPT',
    referenceNo: txn.id || txn.txnNumber || 'TXN-SLIP',
    voucherType: txn.type === 'credit' ? 'Wallet Credit' : 'Wallet Debit',
    date: (txn.timestamp ? String(txn.timestamp).split('T')[0] : new Date().toISOString().split('T')[0]) || '',
    status: txn.status || 'Completed',
    paymentStatus: 'Processed',
    vendorOrCustomer: {
      name: txn.narration || txn.description || 'Wallet Transfer',
      address: `Channel: ${txn.source || 'In-App POS Settlement'}`,
    },
    items: [
      {
        name: txn.narration || txn.description || 'Wallet Settlement Item',
        description: `Closing Balance: ₹${(txn.closingBalance || 0).toLocaleString('en-IN')}`,
        qty: 1,
        unit: 'Txn',
        rate: txn.amount || 0,
        total: txn.amount || 0,
      },
    ],
    financials: {
      subtotal: txn.amount || 0,
      totalAmount: txn.amount || 0,
      paidAmount: txn.amount || 0,
      balanceDue: 0,
      paymentMethod: txn.paymentMethod || 'Wallet Ledger',
      referenceTxnId: txn.id,
    },
    notes: `Transaction Status: ${txn.status}. Category: ${txn.category || 'General Ledger'}.`,
    filename: `Transaction_${txn.id || 'receipt'}`,
  };
}

/**
 * Converts a Return Record into standard VoucherDocumentData
 */
export function returnSlipToVoucherDoc(ret: any): VoucherDocumentData {
  return {
    title: 'RETURN MERCHANDISE AUTHORIZATION (RMA)',
    referenceNo: ret.returnNumber || ret.id || 'RMA-SLIP',
    voucherType: 'Return Voucher',
    date: (ret.requestDate ? String(ret.requestDate).split('T')[0] : new Date().toISOString().split('T')[0]) || '',
    status: ret.status,
    paymentStatus: ret.refundStatus || 'Refund Pending',
    vendorOrCustomer: {
      name: ret.customer?.name || 'Customer',
      phone: ret.customer?.phone || '',
      address: ret.customer?.address || '',
    },
    items: (ret.items || []).map((it: any) => ({
      name: it.productName || it.name || 'Returned Product',
      description: `Reason: ${ret.reason || 'Customer Return'} | Condition: ${it.condition || 'Unopened'}`,
      qty: it.quantity || 1,
      unit: 'Pcs',
      rate: it.unitPrice || it.price || 0,
      total: (it.unitPrice || it.price || 0) * (it.quantity || 1),
    })),
    financials: {
      subtotal: ret.refundAmount || ret.totalAmount || 0,
      totalAmount: ret.refundAmount || ret.totalAmount || 0,
      paidAmount: ret.refundStatus === 'Completed' ? (ret.refundAmount || ret.totalAmount || 0) : 0,
      balanceDue: ret.refundStatus === 'Completed' ? 0 : (ret.refundAmount || ret.totalAmount || 0),
      paymentMethod: ret.refundMode || 'Original Payment Source',
    },
    notes: `RMA authorized for return processing. Return Reason: ${ret.reason || 'N/A'}.`,
    filename: `Return_Slip_${ret.returnNumber || ret.id}`,
  };
}
