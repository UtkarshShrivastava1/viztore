import { MerchantOrderRecord } from '../stores/orderStore.js';
import { useAuthStore } from '../stores/authStore.js';

export function getRiderRunUrl(order: MerchantOrderRecord): string {
  if (import.meta.env.VITE_STOREFRONT_URL) {
    return `${import.meta.env.VITE_STOREFRONT_URL}/rider/run/${order.id || order.orderNumber}`;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return `http://localhost:3000/rider/run/${order.id || order.orderNumber}`;
    }
    const storefrontHost = host.replace('partner.', 'shop.').replace('merchant.', 'web.');
    return `${window.location.protocol}//${storefrontHost}/rider/run/${order.id || order.orderNumber}`;
  }
  return `https://viztore-web.vercel.app/rider/run/${order.id || order.orderNumber}`;
}

export function buildFleetBroadcastText(order: MerchantOrderRecord): string {
  const store = useAuthStore.getState().currentStore;
  const storeName = store?.name || 'Store Partner';
  const storeLocality = store?.address?.locality || store?.address?.city || '';
  const pickupDisplay = storeLocality ? `${storeName} (${storeLocality})` : storeName;

  const street = order.deliveryAddress?.street || '';
  const streetParts = street.split(',').map((p) => p.trim()).filter(Boolean);
  const streetLocality = streetParts[0] || '';
  let streetCity = '';
  for (let i = streetParts.length - 1; i >= 0; i--) {
    const rawPart = streetParts[i];
    if (!rawPart) continue;
    const part = rawPart.replace(/-\s*\d+$/, '').trim();
    if (!/^\d+$/.test(part) && !/chhattisgarh|state|india/i.test(part) && part.length > 2) {
      streetCity = part;
      break;
    }
  }

  let locality = order.deliveryAddress?.locality?.trim() || '';
  let city = order.deliveryAddress?.city?.trim() || '';
  if (locality.toLowerCase() === 'local city' || locality.toLowerCase() === 'city') locality = '';
  if (city.toLowerCase() === 'local city' || city.toLowerCase() === 'city') city = '';

  const resolvedLocality = locality || streetLocality;
  const resolvedCity = city || streetCity || 'Local Area';

  const dropArea = (resolvedLocality && resolvedCity && resolvedLocality.toLowerCase() === resolvedCity.toLowerCase())
    ? resolvedCity
    : [resolvedLocality, resolvedCity].filter(Boolean).filter((v, idx, arr) => arr.indexOf(v) === idx).join(', ') || street || 'Local Customer Area';

  const itemsCount = order.itemsSummary?.count || order.items?.length || 1;
  const itemsTitle = order.itemsSummary?.title || order.items?.[0]?.name || 'Packaged parcel';

  const isCod = order.payment?.paymentMethod === 'Cash on Delivery';
  const paymentText = isCod
    ? `Cash on Delivery (Collect ₹${(order.pricing?.totalAmount || 0).toLocaleString('en-IN')} cash)`
    : 'Prepaid Online (₹0 cash to collect)';

  return [
    `🛵 *NEW DELIVERY RUN — #${order.orderNumber}*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `🏪 *Pickup Store:* ${pickupDisplay}`,
    `🏠 *Drop Area:* ${dropArea}`,
    `📦 *Items:* ${itemsCount} item${itemsCount > 1 ? 's' : ''} (${itemsTitle})`,
    `💰 *Rider Payout:* ₹40`,
    `💳 *Payment:* ${paymentText}`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `👉 *Tap to Accept & Claim Run:*`,
    `${getRiderRunUrl(order)}`,
  ].join('\n');
}

export function broadcastOrderToFleet(order: MerchantOrderRecord) {
  const text = buildFleetBroadcastText(order);
  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}
