import React, { useState } from 'react';
import { Download, ChevronDown, Plus } from 'lucide-react';
import { useOrderStore, MerchantOrderRecord, OrderTab } from '../stores/orderStore.js';
import { OrderStepper } from '../components/orders/OrderStepper.js';
import { OrdersTabsBar } from '../components/orders/OrdersTabsBar.js';
import { OrdersToolbar } from '../components/orders/OrdersToolbar.js';
import { OrdersTable } from '../components/orders/OrdersTable.js';
import { OrderDetailModal } from '../components/orders/OrderDetailModal.js';
import { branding } from '@repo/shared-types/branding.config';

interface OrdersPageProps {
  onOpenCreateOrder?: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onOpenCreateOrder }) => {
  const { activeTab, setActiveTab, orders, fetchOrders, isLoading } = useOrderStore();

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const [selectedOrder, setSelectedOrder] = useState<MerchantOrderRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Context-sensitive subtitles based on active tab matching mockups
  const getSubtitle = (tab: OrderTab) => {
    switch (tab) {
      case 'new_orders':
        return 'Orders that are waiting for packing and processing';
      case 'ready_to_ship':
        return 'Orders packed and ready for runner pickup';
      case 'shipped':
        return 'Orders in transit to customer';
      case 'delivered':
        return 'Successfully delivered orders';
      case 'all_orders':
        return 'Complete history of all customer orders';
      case 'cancelled':
        return 'Orders that were cancelled';
      case 'returns':
        return 'Customer return requests and status';
      default:
        return 'Orders that are waiting for your processing';
    }
  };

  const handlePrint = (order: MerchantOrderRecord) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${order.orderNumber}</title>
            <style>
              body { font-family: sans-serif; padding: 24px; color: #1e293b; }
              .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px; }
              .otp { font-size: 20px; font-weight: bold; background: #fef3c7; padding: 8px 12px; border-radius: 6px; display: inline-block; }
              table { width: 100%; border-collapse: collapse; margin-top: 16px; }
              th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
              th { background: #f1f5f9; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${branding.appName} Merchant Invoice</h2>
              <p>Order ID: <strong>${order.orderNumber}</strong> | Date: ${order.timestamps.createdAt.replace('\n', ' ')}</p>
              <div class="otp">Delivery Runner OTP: ${order.otp}</div>
            </div>
            <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.phone})</p>
            <p><strong>Delivery Address:</strong><br/>${order.deliveryAddress.fullText.replace(/\n/g, '<br/>')}</p>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (i) => `
                  <tr>
                    <td>${i.name} ${i.variant ? `(${i.variant})` : ''}</td>
                    <td>${i.quantity}</td>
                    <td>₹${i.price * i.quantity}</td>
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
            <h3>Total: ₹${order.pricing.totalAmount} (${order.payment.status} via ${order.payment.mode})</h3>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const totalCount = orders.length;

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto animate-in fade-in-50 duration-200">
      {/* 1. Page Header matching Orders_01_New_Orders.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Orders</h1>
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-2xs">
              {totalCount}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{getSubtitle(activeTab)}</p>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2">
          {/* Export Button */}
          <button
            type="button"
            onClick={() => alert('Exporting orders as CSV / Excel...')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          {/* More Actions Dropdown */}
          <button
            type="button"
            onClick={() => alert('Bulk Print Labels | Assign Runners | Batch CSV')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <span>More Actions</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Create Order Button */}
          <button
            type="button"
            onClick={onOpenCreateOrder}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* 2. Top Order Stepper */}
      <OrderStepper
        activeTab={activeTab}
        onSelectStep={(tab) => setActiveTab(tab)}
      />

      {/* 3. Status Tabs Bar (8 Tabs) */}
      <OrdersTabsBar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* 4. Toolbar Controls */}
      <OrdersToolbar activeTab={activeTab} />

      {/* 5. Orders Table */}
      <OrdersTable
        onViewOrder={(order) => {
          setSelectedOrder(order);
          setIsDetailOpen(true);
        }}
        onPrintOrder={handlePrint}
      />

      {/* 6. Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onPrint={handlePrint}
      />
    </div>
  );
};
