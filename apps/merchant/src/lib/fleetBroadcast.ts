import { MerchantOrderRecord } from '../stores/orderStore.js';
import { useAuthStore } from '../stores/authStore.js';
import { branding } from './branding.js';

export function getRiderRunUrl(order: MerchantOrderRecord): string {
  if (import.meta.env.VITE_STOREFRONT_URL) {
    return `${import.meta.env.VITE_STOREFRONT_URL}/rider/run/${order.id || order.orderNumber}`;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return `http://localhost:3000/rider/run/${order.id || order.orderNumber}`;
    }
    const storefrontHost = host.replace(/^(seller|partner|merchant)\./, 'www.');
    return `${window.location.protocol}//${storefrontHost}/rider/run/${order.id || order.orderNumber}`;
  }
  return `https://${branding.domain || 'localhost:3000'}/rider/run/${order.id || order.orderNumber}`;
}

export function buildFleetBroadcastText(order: MerchantOrderRecord): string {
  const store = useAuthStore.getState().currentStore;
  const storeName = store?.name || 'Store Partner';
  const storePhone = store?.phone || '';
  const storeParts = [
    store?.address?.street,
    store?.address?.locality,
    store?.address?.city,
    store?.address?.state,
    store?.address?.pincode,
  ].filter(Boolean);
  const fullStoreAddress = storeParts.join(', ') || storeName;

  const addr = order.deliveryAddress;
  const customerName = order.customer?.name || (addr as any)?.fullName || 'Customer';
  const customerPhone = order.customer?.phone || (addr as any)?.phone || '';
  const dropParts = [
    addr?.street,
    addr?.locality,
    addr?.city,
    addr?.state,
    addr?.pincode,
  ].filter(Boolean).filter((v, idx, arr) => arr.indexOf(v) === idx);
  const fullCustomerAddress = dropParts.join(', ') || addr?.street || 'Customer Delivery Address';

  const itemsCount = order.itemsSummary?.count || order.items?.length || 1;
  const itemsTitle = order.itemsSummary?.title || order.items?.[0]?.name || 'Packaged parcel';

  // Accurate Cash on Delivery vs Prepaid Detection
  const rawMethod = String(
    order.payment?.paymentMethod ||
    (order as any).paymentMethod ||
    order.payment?.mode ||
    ''
  ).toLowerCase();

  const isCod =
    order.payment?.paymentMethod === 'Cash on Delivery' ||
    rawMethod === 'cod' ||
    rawMethod === 'cash on delivery' ||
    rawMethod === 'cash' ||
    rawMethod.includes('cod') ||
    rawMethod.includes('cash');

  const totalAmountFormatted = (order.pricing?.totalAmount || 0).toLocaleString('en-IN');
  const paymentText = isCod
    ? `💵 *Cash on Delivery* (⚠️ COLLECT ₹${totalAmountFormatted} IN CASH)`
    : '✅ *Prepaid Online* (₹0 cash to collect — DO NOT collect cash)';

  const runUrl = getRiderRunUrl(order);

  return [
    `🛵 *NEW HYPERLOCAL DELIVERY RUN — #${order.orderNumber}*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `🏪 *1. PICKUP POINT (STORE):*`,
    `*${storeName}*`,
    `📍 ${fullStoreAddress}`,
    storePhone ? `📞 Contact: ${storePhone}` : '',
    ``,
    `🏠 *2. DROPOFF POINT (CUSTOMER):*`,
    `*${customerName}*`,
    `📍 ${fullCustomerAddress}`,
    customerPhone ? `📞 Contact: ${customerPhone}` : '',
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📏 *ESTIMATED RUN DISTANCES:*`,
    `• 🛵 *Rider ➔ Store:* ~1.2 km (live GPS)`,
    `• 🏪 *Store ➔ Customer:* ~2.4 km (road transit)`,
    `• 🏁 *Total Trip Distance:* ~3.6 km`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📦 *PACKAGE & EARNINGS:*`,
    `• ${itemsCount} item${itemsCount > 1 ? 's' : ''} (${itemsTitle})`,
    `• 💰 *Rider Payout:* ₹40`,
    `• 💳 *Payment Collection:* ${paymentText}`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `⚡ *1-TAP ACCEPT & CLAIM RUN:*`,
    `👉 ${runUrl}`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `*(Tap link above to open turn-by-turn navigation & claim run)*`,
  ].filter(line => line !== null && line !== undefined).join('\n');
}

export function broadcastOrderToFleet(order: MerchantOrderRecord) {
  const text = buildFleetBroadcastText(order);
  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}
