import { branding } from '@repo/shared-types';

export interface PrintableInvoiceItem {
  name: string;
  sku?: string;
  hsnCode?: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  discountAmount?: number;
  taxableAmount: number;
  taxRate?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  lineTotal: number;
}

export interface PrintableInvoiceData {
  invoiceNumber: string;
  referenceNumber?: string;
  date: string | Date;
  status?: string;
  type?: string;
  seller: {
    name: string;
    address: string;
    phone: string;
    gstin?: string;
    email?: string;
    state?: string;
  };
  customer: {
    name: string;
    phone: string;
    address?: string;
    gstin?: string;
    email?: string;
    state?: string;
  };
  items: PrintableInvoiceItem[];
  pricing: {
    subtotal: number;
    discount?: number;
    taxableAmount?: number;
    tax: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
    shippingFee?: number;
    grandTotal: number;
    roundOff?: number;
  };
  payment?: {
    settlementMode?: string;
    status?: string;
    paidAmount?: number;
    dueAmount?: number;
    tenderedCashAmount?: number;
    changeReturnAmount?: number;
  };
  deliveryOtp?: string;
  notes?: string;
  terms?: string[];
  qrPayload?: string;
}

export interface PrintRenderOptions {
  format?: 'thermal' | 'a4' | '80mm';
  autoPrint?: boolean;
}

// ── HTML Safety & Number Helpers ─────────────────────────────────────────

export function escapeHtml(str?: string | number | null): string {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatCurrency(amount?: number | null): string {
  const num = amount ?? 0;
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateInput: string | Date): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(dateInput);
  }
}

export function formatTime(dateInput: string | Date): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
}

export function amountInWords(amount: number): string {
  if (!amount || isNaN(amount) || amount === 0) return 'Rupees Zero Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const twoDigits = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tensMultiple = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n: number): string {
    if (n === 0) return '';
    if (n < 10) return singleDigits[n] || '';
    if (n < 20) return twoDigits[n - 10] || '';
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    const tensWord = tensMultiple[tens] || '';
    const onesWord = ones > 0 ? (singleDigits[ones] || '') : '';
    return `${tensWord}${onesWord ? ' ' + onesWord : ''}`.trim();
  }

  function convertThreeDigits(n: number): string {
    const hundreds = Math.floor(n / 100);
    const rest = n % 100;
    const parts: string[] = [];
    if (hundreds > 0) parts.push(`${singleDigits[hundreds] || ''} Hundred`);
    if (rest > 0) parts.push(convertTwoDigits(rest));
    return parts.join(' ').trim();
  }


  const rounded = Math.round(amount * 100) / 100;
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);

  const crore = Math.floor(rupees / 10000000);
  const lakh = Math.floor((rupees % 10000000) / 100000);
  const thousand = Math.floor((rupees % 100000) / 1000);
  const remainder = rupees % 1000;

  const parts: string[] = [];
  if (crore > 0) parts.push(`${convertTwoDigits(crore)} Crore`);
  if (lakh > 0) parts.push(`${convertTwoDigits(lakh)} Lakh`);
  if (thousand > 0) parts.push(`${convertTwoDigits(thousand)} Thousand`);
  if (remainder > 0) parts.push(convertThreeDigits(remainder));

  const rupeeText = parts.length > 0 ? parts.join(' ') : 'Zero';
  let result = `Rupees ${rupeeText}`;
  if (paise > 0) {
    result += ` and ${convertTwoDigits(paise)} Paise`;
  }
  return `${result} Only`;
}

// ── 1. Thermal 80mm Receipt Generator ───────────────────────────────────

export function renderThermalReceiptHtml(
  data: PrintableInvoiceData,
  options: PrintRenderOptions = {},
): string {
  const autoPrintScript = options.autoPrint
    ? `<script>window.addEventListener('load', function(){ setTimeout(function(){ window.print(); }, 250); });</script>`
    : '';

  const dateStr = formatDate(data.date);
  const timeStr = formatTime(data.date);
  const docTitle = data.type || (data.seller.gstin ? 'TAX INVOICE' : 'CASH RECEIPT');

  const itemsHtml = data.items
    .map((item) => {
      const unitStr = item.unit ? ` ${item.unit}` : '';
      const taxRateStr = item.taxRate ? ` (GST ${item.taxRate}%)` : '';
      return `
        <tr>
          <td colspan="4" class="bold text-left" style="padding-top: 4px;">${escapeHtml(item.name)}</td>
        </tr>
        <tr>
          <td class="text-left" style="padding-left: 8px;">${item.quantity}${unitStr} x ${formatCurrency(item.unitPrice)}${taxRateStr}</td>
          <td colspan="3" class="text-right bold">${formatCurrency(item.lineTotal)}</td>
        </tr>
      `;
    })
    .join('');

  const cashBreakdown =
    data.payment?.tenderedCashAmount !== undefined
      ? `
        <div class="row">
          <span>Cash Tendered:</span>
          <span>${formatCurrency(data.payment.tenderedCashAmount)}</span>
        </div>
        <div class="row">
          <span>Change Returned:</span>
          <span>${formatCurrency(data.payment.changeReturnAmount || 0)}</span>
        </div>
      `
      : '';

  const otpBlock = data.deliveryOtp
    ? `
      <div class="otp-box">
        DELIVERY OTP: <span style="font-size: 13px; letter-spacing: 2px;">${escapeHtml(data.deliveryOtp)}</span>
      </div>
    `
    : '';

  const upiPayload =
    data.qrPayload ||
    `upi://pay?pa=merchant@upi&pn=${encodeURIComponent(data.seller.name)}&am=${data.pricing.grandTotal}&cu=INR`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt - ${escapeHtml(data.invoiceNumber)}</title>
  <style>
    @page {
      size: 80mm auto;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      line-height: 1.35;
      color: #000;
      background: #f1f5f9;
      padding: 20px 0;
    }
    .receipt-container {
      width: 76mm;
      max-width: 320px;
      margin: 0 auto;
      background: #fff;
      padding: 12px 10px;
      border: 1px dashed #cbd5e1;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    @media print {
      body {
        background: #fff;
        padding: 0;
      }
      .receipt-container {
        width: 100%;
        max-width: 100%;
        border: none;
        box-shadow: none;
        padding: 2mm 3mm;
      }
      .no-print {
        display: none !important;
      }
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .bold { font-weight: bold; }
    .divider {
      border-top: 1px dashed #000;
      margin: 6px 0;
    }
    .double-divider {
      border-top: 2px dashed #000;
      margin: 6px 0;
    }
    .store-name {
      font-size: 15px;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .doc-type {
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 0.5px;
      margin: 4px 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
      font-size: 11px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 4px 0;
      font-size: 11px;
    }
    .items-table th {
      border-bottom: 1px dashed #000;
      padding: 3px 0;
      font-size: 10px;
    }
    .grand-total {
      font-size: 13px;
      font-weight: bold;
    }
    .otp-box {
      border: 1px dashed #000;
      padding: 5px;
      margin: 6px 0;
      text-align: center;
      font-weight: bold;
      background: #fafafa;
    }
    .cut-line {
      text-align: center;
      font-size: 9px;
      color: #666;
      margin-top: 12px;
      letter-spacing: 1px;
    }
    .actions-bar {
      max-width: 320px;
      margin: 0 auto 12px auto;
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    .btn {
      padding: 6px 14px;
      border-radius: 4px;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      cursor: pointer;
      border: 1px solid #cbd5e1;
      background: #fff;
      text-decoration: none;
      color: #0f172a;
      font-weight: 500;
    }
    .btn-primary {
      background: #0f172a;
      color: #fff;
      border: 1px solid #0f172a;
    }
  </style>
</head>
<body>
  <div class="actions-bar no-print">
    <button class="btn btn-primary" onclick="window.print()">Print Receipt</button>
    <a class="btn" href="?format=a4">View A4 Tax Invoice</a>
  </div>

  <div class="receipt-container">
    <!-- Header -->
    <div class="text-center">
      <div class="store-name">${escapeHtml(data.seller.name)}</div>
      <div>${escapeHtml(data.seller.address)}</div>
      <div>Tel: ${escapeHtml(data.seller.phone)}</div>
      ${data.seller.gstin ? `<div>GSTIN: <span class="bold">${escapeHtml(data.seller.gstin)}</span></div>` : ''}
    </div>

    <div class="divider"></div>
    <div class="text-center doc-type">*** ${escapeHtml(docTitle)} ***</div>
    <div class="divider"></div>

    <!-- Metadata -->
    <div class="row">
      <span>Bill No: <span class="bold">${escapeHtml(data.invoiceNumber)}</span></span>
      <span>${escapeHtml(dateStr)} ${escapeHtml(timeStr)}</span>
    </div>
    ${
      data.referenceNumber
        ? `<div class="row"><span>Ref/Order:</span><span class="bold">${escapeHtml(data.referenceNumber)}</span></div>`
        : ''
    }
    <div class="row">
      <span>Customer: ${escapeHtml(data.customer.name || 'Walk-in Customer')}</span>
      <span>${escapeHtml(data.customer.phone || '')}</span>
    </div>
    ${data.customer.gstin ? `<div class="row"><span>Cust GSTIN:</span><span>${escapeHtml(data.customer.gstin)}</span></div>` : ''}

    <div class="divider"></div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th class="text-left">ITEM</th>
          <th colspan="3" class="text-right">AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="divider"></div>

    <!-- Financial Totals -->
    <div class="row">
      <span>Subtotal (${data.items.length} items):</span>
      <span>${formatCurrency(data.pricing.subtotal)}</span>
    </div>
    ${
      data.pricing.discount
        ? `<div class="row"><span>Discount:</span><span>-${formatCurrency(data.pricing.discount)}</span></div>`
        : ''
    }
    ${
      data.pricing.cgst
        ? `<div class="row"><span>CGST:</span><span>${formatCurrency(data.pricing.cgst)}</span></div>`
        : ''
    }
    ${
      data.pricing.sgst
        ? `<div class="row"><span>SGST:</span><span>${formatCurrency(data.pricing.sgst)}</span></div>`
        : ''
    }
    ${
      data.pricing.igst
        ? `<div class="row"><span>IGST:</span><span>${formatCurrency(data.pricing.igst)}</span></div>`
        : ''
    }
    ${
      data.pricing.shippingFee
        ? `<div class="row"><span>Delivery Fee:</span><span>${formatCurrency(data.pricing.shippingFee)}</span></div>`
        : ''
    }
    ${
      data.pricing.roundOff
        ? `<div class="row"><span>Round Off:</span><span>${formatCurrency(data.pricing.roundOff)}</span></div>`
        : ''
    }

    <div class="double-divider"></div>
    <div class="row grand-total">
      <span>GRAND TOTAL:</span>
      <span>${formatCurrency(data.pricing.grandTotal)}</span>
    </div>
    <div class="double-divider"></div>

    <!-- Settlement -->
    <div class="row">
      <span>Settlement Mode:</span>
      <span class="bold">${escapeHtml(data.payment?.settlementMode || 'PAID')}</span>
    </div>
    ${cashBreakdown}

    ${otpBlock}

    <!-- Footer Note -->
    <div class="text-center" style="margin-top: 10px; font-size: 10px;">
      <div>${escapeHtml(data.terms?.[0] || 'Thank you for shopping local!')}</div>
      <div style="font-size: 9px; color: #555; margin-top: 4px;">Powered by ${escapeHtml(branding.appName)}</div>
    </div>

    <!-- Cut Line -->
    <div class="cut-line">- - - - - - [ TEAR HERE ] - - - - - -</div>
  </div>

  ${autoPrintScript}
</body>
</html>`;
}

// ── 2. Standard A4 GST Tax Invoice Generator ───────────────────────────

export function renderA4InvoiceHtml(
  data: PrintableInvoiceData,
  options: PrintRenderOptions = {},
): string {
  const autoPrintScript = options.autoPrint
    ? `<script>window.addEventListener('load', function(){ setTimeout(function(){ window.print(); }, 250); });</script>`
    : '';

  const dateStr = formatDate(data.date);
  const docTitle = data.type || 'TAX INVOICE';
  const wordsTotal = amountInWords(data.pricing.grandTotal);

  // Line items
  const itemsHtml = data.items
    .map((item, index) => {
      const hsn = item.hsnCode || '0000';
      const unit = item.unit || 'Pcs';
      const rate = formatCurrency(item.unitPrice);
      const discount = item.discountAmount ? formatCurrency(item.discountAmount) : '-';
      const taxable = formatCurrency(item.taxableAmount);
      const cgstVal = item.cgst ? formatCurrency(item.cgst) : '-';
      const sgstVal = item.sgst ? formatCurrency(item.sgst) : '-';
      const total = formatCurrency(item.lineTotal);

      return `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>
            <div class="bold text-slate-900">${escapeHtml(item.name)}</div>
            ${item.sku ? `<div class="text-muted text-xs">SKU: ${escapeHtml(item.sku)}</div>` : ''}
          </td>
          <td class="text-center">${escapeHtml(hsn)}</td>
          <td class="text-center">${item.quantity} ${escapeHtml(unit)}</td>
          <td class="text-right">${rate}</td>
          <td class="text-right">${discount}</td>
          <td class="text-right">${taxable}</td>
          <td class="text-right">${cgstVal}</td>
          <td class="text-right">${sgstVal}</td>
          <td class="text-right bold">${total}</td>
        </tr>
      `;
    })
    .join('');

  // Tax breakdown table
  const taxSummaryRow = `
    <tr>
      <td class="text-center bold">TOTALS</td>
      <td class="text-right bold">${formatCurrency(data.pricing.taxableAmount || data.pricing.subtotal)}</td>
      <td class="text-right bold">${formatCurrency(data.pricing.cgst || 0)}</td>
      <td class="text-right bold">${formatCurrency(data.pricing.sgst || 0)}</td>
      <td class="text-right bold">${formatCurrency(data.pricing.igst || 0)}</td>
      <td class="text-right bold">${formatCurrency(data.pricing.tax)}</td>
    </tr>
  `;

  const termsList =
    data.terms && data.terms.length > 0
      ? data.terms.map((t, i) => `<li>${escapeHtml(t)}</li>`).join('')
      : `
        <li>Goods once sold will not be accepted back without original tax invoice.</li>
        <li>All disputes are subject to local jurisdiction only.</li>
        <li>Payment due immediately upon delivery / handover.</li>
      `;

  const statusBadge =
    (data.payment?.status || data.status || 'PAID').toUpperCase() === 'PAID'
      ? `<span class="badge badge-success">PAID</span>`
      : `<span class="badge badge-warning">${escapeHtml(data.payment?.status || data.status || 'PENDING')}</span>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${escapeHtml(data.invoiceNumber)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 11.5px;
      line-height: 1.45;
      color: #1e293b;
      background: #f8fafc;
      padding: 24px 0;
    }
    .invoice-container {
      width: 210mm;
      max-width: 820px;
      margin: 0 auto;
      background: #fff;
      padding: 28px 32px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    @media print {
      body {
        background: #fff;
        padding: 0;
      }
      .invoice-container {
        width: 100%;
        max-width: 100%;
        border: none;
        box-shadow: none;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
    .actions-bar {
      max-width: 820px;
      margin: 0 auto 16px auto;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      align-items: center;
    }
    .btn {
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid #cbd5e1;
      background: #fff;
      text-decoration: none;
      color: #0f172a;
      transition: all 0.15s ease;
    }
    .btn:hover { background: #f1f5f9; }
    .btn-primary {
      background: #0f172a;
      color: #fff;
      border: 1px solid #0f172a;
    }
    .btn-primary:hover { background: #1e293b; }
    .header-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 24px;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .store-brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }
    .invoice-meta-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      text-align: right;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    .meta-table td {
      padding: 2px 0;
    }
    .meta-table td:first-child {
      color: #64748b;
      font-weight: 500;
      width: 45%;
    }
    .meta-table td:last-child {
      text-align: right;
      font-weight: 600;
      color: #0f172a;
    }
    .party-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    .party-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px 14px;
      background: #fafafa;
    }
    .party-card-header {
      font-size: 10px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .party-name {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .table th {
      background: #f1f5f9;
      color: #334155;
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px 6px;
      border: 1px solid #cbd5e1;
    }
    .table td {
      padding: 8px 6px;
      border: 1px solid #e2e8f0;
      vertical-align: middle;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .bold { font-weight: 700; }
    .text-muted { color: #64748b; }
    .text-xs { font-size: 10px; }
    .summary-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }
    .words-box {
      border: 1px dashed #cbd5e1;
      padding: 10px 12px;
      border-radius: 4px;
      background: #fafafa;
      margin-bottom: 12px;
    }
    .words-title {
      font-size: 10px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .words-content {
      font-size: 11.5px;
      font-weight: 600;
      color: #0f172a;
      font-style: italic;
    }
    .totals-table {
      width: 100%;
      border-collapse: collapse;
    }
    .totals-table td {
      padding: 4px 6px;
      border-bottom: 1px solid #f1f5f9;
    }
    .totals-table td:last-child {
      text-align: right;
      font-weight: 600;
    }
    .grand-total-row {
      background: #f8fafc;
      border-top: 2px solid #0f172a;
      border-bottom: 2px solid #0f172a;
    }
    .grand-total-row td {
      padding: 8px 6px;
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .badge-success { background: #dcfce7; color: #15803d; }
    .badge-warning { background: #fef3c7; color: #b45309; }
    .terms-box {
      font-size: 10px;
      color: #64748b;
      line-height: 1.5;
    }
    .terms-box ul {
      padding-left: 16px;
      margin-top: 4px;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      align-items: end;
    }
    .signatory-box {
      text-align: right;
    }
    .signatory-line {
      display: inline-block;
      width: 180px;
      border-bottom: 1px solid #0f172a;
      margin-bottom: 4px;
      height: 40px;
    }
  </style>
</head>
<body>
  <div class="actions-bar no-print">
    <a class="btn" href="?format=thermal">Switch to 80mm Thermal</a>
    <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="invoice-container">
    <!-- Header -->
    <div class="header-grid">
      <div>
        <div class="store-brand-title">${escapeHtml(data.seller.name)}</div>
        <div class="text-muted">${escapeHtml(data.seller.address)}</div>
        <div class="text-muted">Phone: <span class="bold">${escapeHtml(data.seller.phone)}</span>${data.seller.email ? ` | Email: ${escapeHtml(data.seller.email)}` : ''}</div>
        ${data.seller.gstin ? `<div>GSTIN: <span class="bold" style="color: #0f172a;">${escapeHtml(data.seller.gstin)}</span></div>` : ''}
        ${data.seller.state ? `<div class="text-muted">State: ${escapeHtml(data.seller.state)}</div>` : ''}
      </div>
      <div>
        <div class="invoice-meta-title">${escapeHtml(docTitle)}</div>
        <table class="meta-table">
          <tr>
            <td>Invoice No:</td>
            <td>${escapeHtml(data.invoiceNumber)}</td>
          </tr>
          ${
            data.referenceNumber
              ? `<tr><td>Order / Ref No:</td><td>${escapeHtml(data.referenceNumber)}</td></tr>`
              : ''
          }
          <tr>
            <td>Invoice Date:</td>
            <td>${escapeHtml(dateStr)}</td>
          </tr>
          <tr>
            <td>Place of Supply:</td>
            <td>${escapeHtml(data.customer.state || data.seller.state || 'Local')}</td>
          </tr>
          <tr>
            <td>Payment Status:</td>
            <td>${statusBadge}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Parties -->
    <div class="party-grid">
      <div class="party-card">
        <div class="party-card-header">Billed To (Customer Details)</div>
        <div class="party-name">${escapeHtml(data.customer.name || 'Walk-in Customer')}</div>
        <div class="text-muted">Phone: ${escapeHtml(data.customer.phone || 'N/A')}</div>
        ${data.customer.email ? `<div class="text-muted">Email: ${escapeHtml(data.customer.email)}</div>` : ''}
        ${data.customer.address ? `<div>Address: ${escapeHtml(data.customer.address)}</div>` : ''}
        ${data.customer.gstin ? `<div>GSTIN: <span class="bold">${escapeHtml(data.customer.gstin)}</span></div>` : ''}
      </div>

      <div class="party-card">
        <div class="party-card-header">Delivery & Settlement Information</div>
        <div class="text-muted">Settlement Mode: <span class="bold" style="color: #0f172a;">${escapeHtml(data.payment?.settlementMode || 'COUNTER_CASH')}</span></div>
        ${data.payment?.paidAmount !== undefined ? `<div>Amount Paid: <span class="bold">${formatCurrency(data.payment.paidAmount)}</span></div>` : ''}
        ${data.payment?.dueAmount ? `<div>Amount Due: <span class="bold" style="color: #dc2626;">${formatCurrency(data.payment.dueAmount)}</span></div>` : ''}
        ${
          data.deliveryOtp
            ? `<div style="margin-top: 6px; padding: 4px 8px; background: #e0f2fe; border-radius: 4px; font-weight: bold; color: #0369a1;">Verification OTP: ${escapeHtml(data.deliveryOtp)}</div>`
            : ''
        }
        ${data.notes ? `<div class="text-muted text-xs" style="margin-top: 4px;">Note: ${escapeHtml(data.notes)}</div>` : ''}
      </div>
    </div>

    <!-- Line Items Table -->
    <table class="table">
      <thead>
        <tr>
          <th style="width: 32px;" class="text-center">#</th>
          <th class="text-left">Item Description</th>
          <th class="text-center">HSN/SAC</th>
          <th class="text-center">Qty</th>
          <th class="text-right">Unit Rate</th>
          <th class="text-right">Discount</th>
          <th class="text-right">Taxable Val</th>
          <th class="text-right">CGST</th>
          <th class="text-right">SGST</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Financial Summary -->
    <div class="summary-grid">
      <div>
        <div class="words-box">
          <div class="words-title">Total Amount (in words)</div>
          <div class="words-content">${escapeHtml(wordsTotal)}</div>
        </div>

        <!-- Tax HSN Summary Table -->
        <table class="table" style="margin-bottom: 12px; font-size: 10px;">
          <thead>
            <tr>
              <th class="text-center">Tax Summary</th>
              <th class="text-right">Taxable Value</th>
              <th class="text-right">CGST</th>
              <th class="text-right">SGST</th>
              <th class="text-right">IGST</th>
              <th class="text-right">Total Tax</th>
            </tr>
          </thead>
          <tbody>
            ${taxSummaryRow}
          </tbody>
        </table>

        <div class="terms-box">
          <div class="bold" style="color: #334155;">Terms & Conditions:</div>
          <ul>
            ${termsList}
          </ul>
        </div>
      </div>

      <div>
        <table class="totals-table">
          <tr>
            <td class="text-muted">Subtotal:</td>
            <td>${formatCurrency(data.pricing.subtotal)}</td>
          </tr>
          ${
            data.pricing.discount
              ? `<tr><td class="text-muted">Discount:</td><td style="color: #16a34a;">-${formatCurrency(data.pricing.discount)}</td></tr>`
              : ''
          }
          <tr>
            <td class="text-muted">Taxable Value:</td>
            <td>${formatCurrency(data.pricing.taxableAmount || data.pricing.subtotal)}</td>
          </tr>
          ${
            data.pricing.cgst
              ? `<tr><td class="text-muted">CGST:</td><td>${formatCurrency(data.pricing.cgst)}</td></tr>`
              : ''
          }
          ${
            data.pricing.sgst
              ? `<tr><td class="text-muted">SGST:</td><td>${formatCurrency(data.pricing.sgst)}</td></tr>`
              : ''
          }
          ${
            data.pricing.igst
              ? `<tr><td class="text-muted">IGST:</td><td>${formatCurrency(data.pricing.igst)}</td></tr>`
              : ''
          }
          ${
            data.pricing.shippingFee
              ? `<tr><td class="text-muted">Shipping / Delivery Fee:</td><td>${formatCurrency(data.pricing.shippingFee)}</td></tr>`
              : ''
          }
          ${
            data.pricing.roundOff
              ? `<tr><td class="text-muted">Round Off:</td><td>${formatCurrency(data.pricing.roundOff)}</td></tr>`
              : ''
          }
          <tr class="grand-total-row">
            <td>Grand Total:</td>
            <td>${formatCurrency(data.pricing.grandTotal)}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Signatory & Brand Footer -->
    <div class="footer-grid">
      <div class="text-muted text-xs">
        <div>This is a computer generated tax invoice.</div>
        <div style="margin-top: 4px;">Issued via ${escapeHtml(branding.appName)} Hyperlocal Commerce Platform.</div>
      </div>

      <div class="signatory-box">
        <div class="bold" style="margin-bottom: 24px;">For ${escapeHtml(data.seller.name)}</div>
        <div class="signatory-line"></div>
        <div class="text-xs text-muted">Authorized Signatory</div>
      </div>
    </div>
  </div>

  ${autoPrintScript}
</body>
</html>`;
}

// ── 3. High-Level Universal Dispatcher & Normalizers ────────────────────

export function renderPrintableInvoiceHtml(
  data: PrintableInvoiceData,
  options: PrintRenderOptions = {},
): string {
  if (options.format === 'thermal' || options.format === '80mm') {
    return renderThermalReceiptHtml(data, options);
  }
  return renderA4InvoiceHtml(data, options);
}

export function normalizeOrderInvoiceToPrintable(orderInvoice: any): PrintableInvoiceData {
  const items: PrintableInvoiceItem[] = (orderInvoice.items || []).map((it: any) => {
    const total = it.lineTotal ?? it.quantity * it.unitPrice;
    const taxable = it.taxableAmount ?? Number((total / 1.05).toFixed(2));
    const taxDiff = Math.max(0, total - taxable);
    const halfTax = Number((taxDiff / 2).toFixed(2));
    return {
      name: it.name,
      sku: it.sku,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      taxableAmount: taxable,
      cgst: halfTax,
      sgst: Number((taxDiff - halfTax).toFixed(2)),
      lineTotal: total,
    };
  });

  return {
    invoiceNumber: orderInvoice.invoiceNumber,
    referenceNumber: orderInvoice.orderNumber,
    date: orderInvoice.date,
    status: orderInvoice.status,
    type: 'TAX INVOICE',
    seller: {
      name: orderInvoice.seller?.name || 'Local Partner Store',
      address: orderInvoice.seller?.address || 'Local Market',
      phone: orderInvoice.seller?.phone || '',
      gstin: orderInvoice.seller?.gstin,
    },
    customer: {
      name: orderInvoice.customer?.name || 'Customer',
      phone: orderInvoice.customer?.phone || '',
      address: orderInvoice.customer?.address || '',
    },
    items,
    pricing: {
      subtotal: orderInvoice.pricing?.subtotal || 0,
      taxableAmount: orderInvoice.pricing?.subtotal || 0,
      tax: orderInvoice.pricing?.tax || 0,
      cgst: orderInvoice.pricing?.cgst || 0,
      sgst: orderInvoice.pricing?.sgst || 0,
      shippingFee: orderInvoice.pricing?.shippingFee || 0,
      grandTotal: orderInvoice.pricing?.grandTotal || 0,
    },
    payment: {
      settlementMode: 'ONLINE_ESCROW',
      status: orderInvoice.status === 'delivered' ? 'PAID' : 'PENDING',
      paidAmount: orderInvoice.pricing?.grandTotal || 0,
      dueAmount: 0,
    },
    deliveryOtp: orderInvoice.deliveryOtp,
    terms: [
      'Orders are prepared and fulfilled by the local merchant store.',
      'For returns or exchange, please inspect items at delivery handover with OTP.',
      'Subject to local customer support policies.',
    ],
  };
}

