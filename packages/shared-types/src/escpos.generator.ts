import {
  IPOSReceiptData,
  POSPrintPaperSize,
  SettlementMode,
} from './billing.types.js';

/**
 * Enterprise ESC/POS Binary Command Constants
 */
export const ESC_POS_COMMANDS = {
  INIT: [0x1b, 0x40], // ESC @ (Initialize printer)
  ALIGN_LEFT: [0x1b, 0x61, 0x00], // ESC a 0
  ALIGN_CENTER: [0x1b, 0x61, 0x01], // ESC a 1
  ALIGN_RIGHT: [0x1b, 0x61, 0x02], // ESC a 2
  BOLD_ON: [0x1b, 0x45, 0x01], // ESC E 1
  BOLD_OFF: [0x1b, 0x45, 0x00], // ESC E 0
  DOUBLE_ON: [0x1d, 0x21, 0x11], // GS ! 0x11 (Double height & width)
  DOUBLE_HEIGHT_ON: [0x1d, 0x21, 0x01],
  DOUBLE_WIDTH_ON: [0x1d, 0x21, 0x10],
  TEXT_NORMAL: [0x1d, 0x21, 0x00], // GS ! 0 (Normal text size)
  UNDERLINE_ON: [0x1b, 0x2d, 0x01],
  UNDERLINE_OFF: [0x1b, 0x2d, 0x00],
  FEED_LINE: [0x0a], // LF
  FEED_AND_CUT: [0x1b, 0x64, 0x04, 0x1d, 0x56, 0x42, 0x00], // Feed 4 lines and partial cut
  KICK_DRAWER: [0x1b, 0x70, 0x00, 0x19, 0xfa], // Pulse to pin 2 (RJ11 Cash Drawer)
};

/**
 * Text layout and column width parameters per paper size
 */
export function getPaperWidthColumns(paperSize: POSPrintPaperSize): number {
  switch (paperSize) {
    case POSPrintPaperSize.THERMAL_58MM:
      return 32; // Standard 58mm thermal rolls have 32 character columns in Font A
    case POSPrintPaperSize.THERMAL_80MM:
    default:
      return 48; // Standard 80mm thermal rolls have 48 character columns in Font A
  }
}

/**
 * Text utility to create left-aligned and right-aligned text on the same line
 */
export function formatLeftRightLine(left: string, right: string, width: number): string {
  const leftClean = left.trim();
  const rightClean = right.trim();
  const totalLength = leftClean.length + rightClean.length;

  if (totalLength >= width) {
    // Truncate left string if overflowing
    const maxLeft = Math.max(width - rightClean.length - 1, 1);
    return `${leftClean.substring(0, maxLeft)} ${rightClean}`;
  }

  const spaces = ' '.repeat(width - totalLength);
  return `${leftClean}${spaces}${rightClean}`;
}

/**
 * Formats a 3-column line (e.g., Description, Qty x Rate, Amount)
 */
export function formatItemRow(
  title: string,
  qtyRate: string,
  amount: string,
  width: number,
): string {
  if (width <= 32) {
    // 58mm narrow roll: 2-line layout
    // Line 1: Title
    // Line 2: Qty x Rate ... Amount
    const bottomLine = formatLeftRightLine(`  ${qtyRate}`, amount, width);
    return `${title.substring(0, width)}\n${bottomLine}`;
  }

  // 80mm wide roll: 3 columns (e.g. 24 chars title, 12 chars qty/rate, 12 chars amount)
  const titleWidth = Math.floor(width * 0.5); // 24
  const qtyRateWidth = Math.floor(width * 0.25); // 12
  const amountWidth = width - titleWidth - qtyRateWidth; // 12

  const col1 = title.length > titleWidth ? title.substring(0, titleWidth - 1) + ' ' : title.padEnd(titleWidth, ' ');
  const col2 = qtyRate.padStart(qtyRateWidth, ' ');
  const col3 = amount.padStart(amountWidth, ' ');

  return `${col1}${col2}${col3}`;
}

/**
 * Enterprise ESC/POS Byte Buffer Builder
 */
export class EscposBufferBuilder {
  private buffer: number[] = [];

  constructor() {
    this.init();
  }

  init(): this {
    this.buffer.push(...ESC_POS_COMMANDS.INIT);
    return this;
  }

  alignLeft(): this {
    this.buffer.push(...ESC_POS_COMMANDS.ALIGN_LEFT);
    return this;
  }

  alignCenter(): this {
    this.buffer.push(...ESC_POS_COMMANDS.ALIGN_CENTER);
    return this;
  }

  alignRight(): this {
    this.buffer.push(...ESC_POS_COMMANDS.ALIGN_RIGHT);
    return this;
  }

  bold(enable: boolean = true): this {
    this.buffer.push(...(enable ? ESC_POS_COMMANDS.BOLD_ON : ESC_POS_COMMANDS.BOLD_OFF));
    return this;
  }

  doubleSize(enable: boolean = true): this {
    this.buffer.push(...(enable ? ESC_POS_COMMANDS.DOUBLE_ON : ESC_POS_COMMANDS.TEXT_NORMAL));
    return this;
  }

  doubleHeight(enable: boolean = true): this {
    this.buffer.push(...(enable ? ESC_POS_COMMANDS.DOUBLE_HEIGHT_ON : ESC_POS_COMMANDS.TEXT_NORMAL));
    return this;
  }

  normalSize(): this {
    this.buffer.push(...ESC_POS_COMMANDS.TEXT_NORMAL);
    return this;
  }

  text(str: string): this {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    for (const b of bytes) {
      this.buffer.push(b);
    }
    return this;
  }

  line(str: string = ''): this {
    if (str) {
      this.text(str);
    }
    this.buffer.push(...ESC_POS_COMMANDS.FEED_LINE);
    return this;
  }

  feed(lines: number = 1): this {
    for (let i = 0; i < lines; i++) {
      this.buffer.push(...ESC_POS_COMMANDS.FEED_LINE);
    }
    return this;
  }

  divider(char: string = '-', width: number = 48): this {
    this.line(char.repeat(width));
    return this;
  }

  kickCashDrawer(): this {
    this.buffer.push(...ESC_POS_COMMANDS.KICK_DRAWER);
    return this;
  }

  cutPaper(): this {
    this.buffer.push(...ESC_POS_COMMANDS.FEED_AND_CUT);
    return this;
  }

  /**
   * Appends standard Code128 Barcode command sequence
   */
  barcode(codeStr: string): this {
    this.alignCenter();
    // GS h 60 (Set barcode height to 60 dots)
    this.buffer.push(0x1d, 0x68, 0x3c);
    // GS w 2 (Set barcode module width to 2)
    this.buffer.push(0x1d, 0x77, 0x02);
    // GS H 2 (Print HRI human-readable characters below the barcode)
    this.buffer.push(0x1d, 0x48, 0x02);
    // GS k 73 len bytes (Code128)
    const encoder = new TextEncoder();
    const codeBytes = encoder.encode(codeStr);
    this.buffer.push(0x1d, 0x6b, 0x49, codeBytes.length);
    for (const b of codeBytes) {
      this.buffer.push(b);
    }
    this.feed(1);
    this.alignLeft();
    return this;
  }

  /**
   * Appends standard Model 2 QR Code command sequence
   */
  qrCode(qrData: string): this {
    if (!qrData) return this;
    this.alignCenter();

    const encoder = new TextEncoder();
    const qrBytes = encoder.encode(qrData);
    const len = qrBytes.length + 3;
    const pL = len % 256;
    const pH = Math.floor(len / 256);

    // 1. Select Model 2: GS ( k 4 0 49 65 50 0
    this.buffer.push(0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00);
    // 2. Set Module Size 4: GS ( k 3 0 49 67 4
    this.buffer.push(0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x04);
    // 3. Set Error Correction Level M (49): GS ( k 3 0 49 69 49
    this.buffer.push(0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x31);
    // 4. Store Data: GS ( k pL pH 49 80 48 <data>
    this.buffer.push(0x1d, 0x28, 0x6b, pL, pH, 0x31, 0x50, 0x30);
    for (const b of qrBytes) {
      this.buffer.push(b);
    }
    // 5. Print Symbol: GS ( k 3 0 49 81 48
    this.buffer.push(0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30);
    this.feed(1);
    this.alignLeft();
    return this;
  }

  build(): Uint8Array {
    if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
      return Buffer.from(this.buffer);
    }
    return new Uint8Array(this.buffer);
  }

  toBase64(): string {
    const bytes = this.build();
    let binary = '';
    for (const b of bytes) {
      binary += String.fromCharCode(b);
    }
    if (typeof btoa === 'function') {
      return btoa(binary);
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(bytes).toString('base64');
    }
    return '';
  }
}

/**
 * Compiles an IPOSReceiptData object into a standard binary ESC/POS stream
 */
export function generateEscposReceiptBuffer(
  receipt: IPOSReceiptData,
  kickCashDrawer = true,
): Uint8Array {
  const width = getPaperWidthColumns(receipt.paperSize);
  const builder = new EscposBufferBuilder();

  // 1. Optional Cash Drawer Kick
  if (kickCashDrawer) {
    builder.kickCashDrawer();
  }

  // 2. Header & Store Information (Centered)
  builder.alignCenter();
  builder.bold(true).doubleHeight(true);
  builder.line(receipt.storeName.toUpperCase());
  builder.normalSize().bold(false);

  if (receipt.storeAddress) {
    builder.line(receipt.storeAddress);
  }
  if (receipt.storePhone) {
    builder.line(`Tel: ${receipt.storePhone}`);
  }
  if (receipt.storeGstin) {
    builder.line(`GSTIN: ${receipt.storeGstin}`);
  }

  builder.divider('=', width);
  builder.bold(true);
  builder.line('RETAIL TAX INVOICE');
  builder.bold(false);
  builder.divider('-', width);

  // 3. Invoice & Customer Metadata (Left & Right aligned)
  builder.alignLeft();
  builder.line(formatLeftRightLine(`Bill No: ${receipt.invoiceNumber}`, `Date: ${receipt.date}`, width));
  builder.line(formatLeftRightLine(`Time: ${receipt.time}`, receipt.cashierName ? `Cashier: ${receipt.cashierName}` : '', width));
  builder.line(formatLeftRightLine(`Customer: ${receipt.customerName}`, receipt.customerPhone ? `Ph: ${receipt.customerPhone}` : '', width));
  if (receipt.customerGstin) {
    builder.line(`Customer GSTIN: ${receipt.customerGstin}`);
  }

  builder.divider('-', width);

  // 4. Items Table Header
  builder.bold(true);
  if (width <= 32) {
    builder.line(formatLeftRightLine('ITEM', 'QTY x RATE   TOTAL', width));
  } else {
    builder.line(formatItemRow('ITEM DESCRIPTION', 'QTY x RATE', 'TOTAL (INR)', width));
  }
  builder.bold(false);
  builder.divider('-', width);

  // 5. Line Items
  for (const item of receipt.items) {
    const qtyRateStr = `${item.quantity} ${item.unit} x @${item.unitPrice.toFixed(2)}`;
    const totalStr = `INR ${item.totalAmount.toFixed(2)}`;

    builder.line(formatItemRow(item.title, qtyRateStr, totalStr, width));
    if (item.discountAmount > 0) {
      builder.line(formatLeftRightLine(`  (Discount saved)`, `-INR ${item.discountAmount.toFixed(2)}`, width));
    }
  }

  builder.divider('-', width);

  // 6. Taxable & Summary Math
  builder.alignLeft();
  const pricing = receipt.pricing || {
    subTotal: (receipt as any).subTotal ?? 0,
    totalDiscount: (receipt as any).totalDiscount ?? 0,
    taxableAmount: (receipt as any).taxableAmount ?? 0,
    cgstTotal: (receipt as any).cgstTotal ?? 0,
    sgstTotal: (receipt as any).sgstTotal ?? 0,
    igstTotal: (receipt as any).igstTotal ?? 0,
    roundOff: (receipt as any).roundOff ?? 0,
    grandTotal: (receipt as any).grandTotal ?? 0,
  };

  const subTotal = pricing.subTotal ?? 0;
  const totalDiscount = pricing.totalDiscount ?? 0;
  const taxableAmount = pricing.taxableAmount ?? 0;
  const cgstTotal = pricing.cgstTotal ?? 0;
  const sgstTotal = pricing.sgstTotal ?? 0;
  const igstTotal = pricing.igstTotal ?? 0;
  const roundOff = pricing.roundOff ?? 0;
  const grandTotal = pricing.grandTotal ?? 0;

  builder.line(formatLeftRightLine('Sub Total:', `INR ${subTotal.toFixed(2)}`, width));
  if (totalDiscount > 0) {
    builder.line(formatLeftRightLine('Total Discount:', `-INR ${totalDiscount.toFixed(2)}`, width));
  }
  builder.line(formatLeftRightLine('Taxable Amount:', `INR ${taxableAmount.toFixed(2)}`, width));

  if (cgstTotal > 0) {
    builder.line(formatLeftRightLine('CGST:', `INR ${cgstTotal.toFixed(2)}`, width));
  }
  if (sgstTotal > 0) {
    builder.line(formatLeftRightLine('SGST:', `INR ${sgstTotal.toFixed(2)}`, width));
  }
  if (igstTotal > 0) {
    builder.line(formatLeftRightLine('IGST:', `INR ${igstTotal.toFixed(2)}`, width));
  }
  if (roundOff !== 0) {
    builder.line(formatLeftRightLine('Round Off:', `INR ${roundOff.toFixed(2)}`, width));
  }

  builder.divider('=', width);

  // 7. Grand Total (Double size, bold)
  builder.alignLeft();
  builder.bold(true).doubleHeight(true);
  builder.line(formatLeftRightLine('GRAND TOTAL:', `INR ${grandTotal.toFixed(2)}`, width));
  builder.normalSize().bold(false);

  builder.divider('-', width);

  // 8. Payment Details & Cashier Tender Breakdown
  builder.line(formatLeftRightLine(`Payment Mode:`, receipt.settlementMode.toUpperCase(), width));
  if (receipt.settlementMode === SettlementMode.CASH) {
    if (receipt.tenderedCashAmount !== undefined && receipt.tenderedCashAmount > 0) {
      builder.line(formatLeftRightLine(`Cash Received:`, `INR ${receipt.tenderedCashAmount.toFixed(2)}`, width));
    }
    if (receipt.changeReturnAmount !== undefined && receipt.changeReturnAmount > 0) {
      builder.bold(true);
      builder.line(formatLeftRightLine(`Change Returned:`, `INR ${receipt.changeReturnAmount.toFixed(2)}`, width));
      builder.bold(false);
    }
  }

  // 9. QR Code (UPI Payment / Verification)
  if (receipt.qrPayload) {
    builder.feed(1);
    builder.alignCenter();
    builder.line('Scan to Pay via UPI');
    builder.qrCode(receipt.qrPayload);
  }

  // 10. Barcode (Invoice Number)
  builder.feed(1);
  builder.barcode(receipt.invoiceNumber);

  // 11. Footer Note & Terms
  builder.alignCenter();
  if (receipt.footerMessage) {
    builder.line(receipt.footerMessage);
  } else {
    builder.line('Thank you for shopping local!');
    builder.line('Goods once sold can be exchanged within 7 days.');
    builder.line('Save Paper, Save Environment.');
  }

  // 12. Feed & Cut
  builder.cutPaper();

  return builder.build();
}

/**
 * Generates an ASCII preview string of the receipt for browser console / UI rendering
 */
export function generateAsciiReceiptPreview(receipt: IPOSReceiptData): string {
  const width = getPaperWidthColumns(receipt.paperSize);
  const lines: string[] = [];

  const divider = (char = '-') => char.repeat(width);
  const center = (str: string) => {
    const spaces = Math.max(0, Math.floor((width - str.length) / 2));
    return ' '.repeat(spaces) + str;
  };

  lines.push(center(receipt.storeName.toUpperCase()));
  if (receipt.storeAddress) lines.push(center(receipt.storeAddress));
  if (receipt.storePhone) lines.push(center(`Tel: ${receipt.storePhone}`));
  if (receipt.storeGstin) lines.push(center(`GSTIN: ${receipt.storeGstin}`));

  lines.push(divider('='));
  lines.push(center('RETAIL TAX INVOICE'));
  lines.push(divider('-'));

  lines.push(formatLeftRightLine(`Bill: ${receipt.invoiceNumber}`, `Date: ${receipt.date}`, width));
  lines.push(formatLeftRightLine(`Time: ${receipt.time}`, receipt.cashierName ? `Cashier: ${receipt.cashierName}` : '', width));
  lines.push(formatLeftRightLine(`Cust: ${receipt.customerName}`, receipt.customerPhone ? `Ph: ${receipt.customerPhone}` : '', width));

  lines.push(divider('-'));
  if (width <= 32) {
    lines.push(formatLeftRightLine('ITEM', 'QTY x RATE   TOTAL', width));
  } else {
    lines.push(formatItemRow('ITEM DESCRIPTION', 'QTY x RATE', 'TOTAL', width));
  }
  lines.push(divider('-'));

  for (const item of receipt.items) {
    const qtyRate = `${item.quantity} ${item.unit} x @${item.unitPrice.toFixed(2)}`;
    const total = `₹${item.totalAmount.toFixed(2)}`;
    lines.push(formatItemRow(item.title, qtyRate, total, width));
  }

  lines.push(divider('-'));
  lines.push(formatLeftRightLine('Sub Total:', `₹${receipt.pricing.subTotal.toFixed(2)}`, width));
  if (receipt.pricing.totalDiscount > 0) {
    lines.push(formatLeftRightLine('Discount:', `-₹${receipt.pricing.totalDiscount.toFixed(2)}`, width));
  }
  lines.push(formatLeftRightLine('Taxable:', `₹${receipt.pricing.taxableAmount.toFixed(2)}`, width));
  if (receipt.pricing.cgstTotal > 0) lines.push(formatLeftRightLine('CGST:', `₹${receipt.pricing.cgstTotal.toFixed(2)}`, width));
  if (receipt.pricing.sgstTotal > 0) lines.push(formatLeftRightLine('SGST:', `₹${receipt.pricing.sgstTotal.toFixed(2)}`, width));
  if (receipt.pricing.igstTotal > 0) lines.push(formatLeftRightLine('IGST:', `₹${receipt.pricing.igstTotal.toFixed(2)}`, width));
  if (receipt.pricing.roundOff !== 0) lines.push(formatLeftRightLine('Round Off:', `₹${receipt.pricing.roundOff.toFixed(2)}`, width));

  lines.push(divider('='));
  lines.push(formatLeftRightLine('GRAND TOTAL:', `₹${receipt.pricing.grandTotal.toFixed(2)}`, width));
  lines.push(divider('-'));

  lines.push(formatLeftRightLine('Mode:', receipt.settlementMode.toUpperCase(), width));
  if (receipt.tenderedCashAmount) lines.push(formatLeftRightLine('Received:', `₹${receipt.tenderedCashAmount.toFixed(2)}`, width));
  if (receipt.changeReturnAmount) lines.push(formatLeftRightLine('Change:', `₹${receipt.changeReturnAmount.toFixed(2)}`, width));

  lines.push(divider('-'));
  lines.push(center('Thank you for shopping local!'));
  lines.push(center(`[Barcode: ${receipt.invoiceNumber}]`));

  return lines.join('\n');
}
