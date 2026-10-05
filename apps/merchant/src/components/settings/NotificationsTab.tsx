import React, { useState } from 'react';
import {
  Bell,
  CreditCard,
  Megaphone,
  CheckCircle2,
  Eye,
  ShoppingCart,
  Truck,
  XCircle,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore.js';

export const NotificationsTab: React.FC = () => {
  const { notifications, updateNotifications } = useSettingsStore();
  const [formData, setFormData] = useState({ ...notifications });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    updateNotifications(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Middle Column (Form) */}
      <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        {/* Section 1: Order Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Order Notifications</h2>
              <p className="text-xs text-slate-500">
                Get notified about new orders and order status updates.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {/* New Order */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.newOrderReceived}
                  onChange={(e) =>
                    setFormData({ ...formData, newOrderReceived: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">New Order Received</h4>
                  <p className="text-[11px] text-slate-500">Get notified when a new order is placed.</p>
                </div>
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, newOrderReceived: !formData.newOrderReceived })
                }
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.newOrderReceived ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    formData.newOrderReceived ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Order Status Updates */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.orderStatusUpdates}
                  onChange={(e) =>
                    setFormData({ ...formData, orderStatusUpdates: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Order Status Updates</h4>
                  <p className="text-[11px] text-slate-500">
                    Get notified when order status changes (e.g. confirmed, ready, out for delivery, delivered).
                  </p>
                </div>
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, orderStatusUpdates: !formData.orderStatusUpdates })
                }
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.orderStatusUpdates ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    formData.orderStatusUpdates ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Order Cancellations */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.orderCancellations}
                  onChange={(e) =>
                    setFormData({ ...formData, orderCancellations: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Order Cancellations</h4>
                  <p className="text-[11px] text-slate-500">Get notified when an order is cancelled.</p>
                </div>
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, orderCancellations: !formData.orderCancellations })
                }
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.orderCancellations ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    formData.orderCancellations ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Payment Notifications */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Payment Notifications</h3>
              <p className="text-xs text-slate-500">Get notified about payments, payouts and refunds.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {/* Payment Received */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.paymentReceived}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentReceived: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Payment Received</h4>
                  <p className="text-[11px] text-slate-500">Get notified when a customer makes a payment.</p>
                </div>
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentReceived: !formData.paymentReceived })
                }
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.paymentReceived ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    formData.paymentReceived ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Payout Updates */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.payoutUpdates}
                  onChange={(e) =>
                    setFormData({ ...formData, payoutUpdates: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Payout Updates</h4>
                  <p className="text-[11px] text-slate-500">Get notified about payout processing and status.</p>
                </div>
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, payoutUpdates: !formData.payoutUpdates })
                }
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.payoutUpdates ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    formData.payoutUpdates ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Refund Processed */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.refundProcessed}
                  onChange={(e) =>
                    setFormData({ ...formData, refundProcessed: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Refund Processed</h4>
                  <p className="text-[11px] text-slate-500">Get notified when a refund is processed.</p>
                </div>
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, refundProcessed: !formData.refundProcessed })
                }
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.refundProcessed ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    formData.refundProcessed ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Marketing & System Notifications */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Marketing & System Notifications</h3>
              <p className="text-xs text-slate-500">
                Get important updates, offers and announcements from Viztore.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {/* Product Updates */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.productUpdates}
                  onChange={(e) =>
                    setFormData({ ...formData, productUpdates: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Product Updates & Features</h4>
                  <p className="text-[11px] text-slate-500">Get notified about new features and product updates.</p>
                </div>
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, productUpdates: !formData.productUpdates })
                }
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.productUpdates ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    formData.productUpdates ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Important Announcements */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.importantAnnouncements}
                  onChange={(e) =>
                    setFormData({ ...formData, importantAnnouncements: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Important Announcements</h4>
                  <p className="text-[11px] text-slate-500">Get notified about important updates from Viztore.</p>
                </div>
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, importantAnnouncements: !formData.importantAnnouncements })
                }
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.importantAnnouncements ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    formData.importantAnnouncements ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 mr-auto flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Notification preferences saved!
            </span>
          )}
          <button
            type="button"
            onClick={() => setFormData({ ...notifications })}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Right Column (Cards) */}
      <div className="xl:col-span-4 space-y-5">
        {/* Notification Preview Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900">Notification Preview</h3>
          </div>
          <p className="text-[11px] text-slate-500">This is how you will receive notifications.</p>

          <div className="space-y-2.5">
            {/* Item 1 */}
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">New Order Received</h4>
                  <p className="text-[10px] text-slate-500">Order #12345 has been placed.</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] text-slate-400">2 min ago</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Order Out for Delivery</h4>
                  <p className="text-[10px] text-slate-500">Order #12345 is out for delivery.</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] text-slate-400">10 min ago</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Payment Received</h4>
                  <p className="text-[10px] text-slate-500">₹ 2,450 received from customer.</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] text-slate-400">1 hour ago</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Item 4 */}
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <XCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Order Cancelled</h4>
                  <p className="text-[10px] text-slate-500">Order #12345 has been cancelled.</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] text-slate-400">2 hours ago</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
            <Lightbulb className="w-4 h-4" />
            <span>Tips</span>
          </div>

          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Keep notifications enabled to stay updated about important activities in your store.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>You will receive notifications in the Viztore app, email and (if enabled) via SMS or WhatsApp.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Instant notifications help you respond faster to customers and manage your business better.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
