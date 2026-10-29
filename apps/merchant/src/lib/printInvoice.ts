import { MerchantOrderRecord } from '../stores/orderStore.js';
import { branding } from '@repo/shared-types/branding.config';
import { useAuthStore } from '../stores/authStore.js';

export function printMerchantInvoice(order: MerchantOrderRecord) {
  const store = useAuthStore.getState().currentStore;
  const storeName = store?.name || `${branding.appName} Partner`;
  const storePhone = store?.phone || '';
  const storeAddress = store?.address ? `${store.address.street || ''}, ${store.address.city || ''}` : '';

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice / KOT - ${order.orderNumber}</title>
        <style>
          @page { size: 80mm auto; margin: 4mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            width: 72mm;
            margin: 0 auto;
            padding: 8px 4px;
            color: #0f172a;
            font-size: 11px;
            line-height: 1.35;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .font-bold { font-weight: 700; }
          .header { border-bottom: 1.5px dashed #64748b; padding-bottom: 8px; margin-bottom: 8px; text-align: center; }
          .store-name { font-size: 15px; font-weight: 800; text-transform: uppercase; margin-bottom: 2px; }
          .store-sub { font-size: 9px; color: #475569; }
          .order-meta { margin-bottom: 8px; font-size: 10px; }
          .order-id { font-size: 13px; font-weight: 800; margin-bottom: 2px; }
          .otp-banner {
            border: 2px solid #000;
            background: #f8fafc;
            padding: 6px;
            text-align: center;
            border-radius: 4px;
            margin: 8px 0;
          }
          .otp-code { font-size: 20px; font-weight: 900; letter-spacing: 3px; font-family: monospace; }
          .customer-box { border-bottom: 1px dashed #cbd5e1; padding-bottom: 6px; margin-bottom: 6px; font-size: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 10px; }
          th { border-bottom: 1px solid #000; padding: 4px 2px; text-align: left; font-size: 9px; text-transform: uppercase; }
          td { padding: 4px 2px; vertical-align: top; }
          .totals { border-top: 1.5px dashed #64748b; padding-top: 6px; margin-top: 6px; font-size: 11px; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
          .grand-total { font-size: 13px; font-weight: 800; border-top: 1px solid #000; padding-top: 4px; margin-top: 4px; }
          .footer { text-align: center; font-size: 8px; color: #64748b; margin-top: 14px; border-top: 1px dashed #cbd5e1; padding-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="store-name">${storeName}</div>
          <div class="store-sub">${storeAddress ? storeAddress + ' | ' : ''}${storePhone}</div>
          <div class="store-sub font-bold" style="margin-top: 2px;">⚡ Hyperlocal Order KOT / Invoice</div>
        </div>

        <div class="order-meta">
          <div class="order-id">#${order.orderNumber}</div>
          <div>Type: <span class="font-bold">${order.orderType || 'Delivery'}</span></div>
          <div>Date: ${order.timestamps?.createdAt ? order.timestamps.createdAt.replace('\n', ' ') : new Date().toLocaleString('en-IN')}</div>
        </div>

        <div class="otp-banner">
          <div style="font-size: 9px; font-weight: 700; text-transform: uppercase;">Handshake Verification OTP</div>
          <div class="otp-code">${order.otp || '0000'}</div>
          <div style="font-size: 8px; color: #475569;">Runner must verify before handover</div>
        </div>

        <div class="customer-box">
          <div><strong>Customer:</strong> ${order.customer?.name || 'Customer'}</div>
          <div><strong>Phone:</strong> ${order.customer?.phone || ''}</div>
          <div><strong>Address:</strong> ${order.deliveryAddress?.fullText || `${order.deliveryAddress?.street || ''}, ${order.deliveryAddress?.city || ''}`}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 55%;">Item</th>
              <th style="width: 15%; text-align: center;">Qty</th>
              <th style="width: 30%; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map((item) => `
              <tr>
                <td>
                  <div class="font-bold">${item.name}</div>
                  ${item.variant ? `<div style="font-size: 8px; color: #64748b;">${item.variant}</div>` : ''}
                </td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>Items Subtotal:</span>
            <span>₹${(order.pricing?.itemsTotal || order.pricing?.totalAmount || 0).toLocaleString('en-IN')}</span>
          </div>
          ${order.pricing?.deliveryFee ? `
            <div class="total-row">
              <span>Delivery Fee:</span>
              <span>₹${order.pricing.deliveryFee}</span>
            </div>
          ` : ''}
          ${order.pricing?.packagingFee ? `
            <div class="total-row">
              <span>Packaging Fee:</span>
              <span>₹${order.pricing.packagingFee}</span>
            </div>
          ` : ''}
          ${(order.pricing as any)?.taxes ? `
            <div class="total-row">
              <span>Taxes / GST:</span>
              <span>₹${(order.pricing as any).taxes}</span>
            </div>
          ` : ''}
          <div class="total-row grand-total">
            <span>Total Payable:</span>
            <span>₹${(order.pricing?.totalAmount || 0).toLocaleString('en-IN')}</span>
          </div>
          <div class="total-row" style="font-size: 10px; margin-top: 4px;">
            <span>Payment Method:</span>
            <span class="font-bold">${order.payment?.paymentMethod || 'Prepaid'} (${order.payment?.mode || 'Online'})</span>
          </div>
        </div>

        <div class="footer">
          <div>Thank you for supporting local businesses!</div>
          <div>Powered by ${branding.appName} Hyperlocal Network</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
