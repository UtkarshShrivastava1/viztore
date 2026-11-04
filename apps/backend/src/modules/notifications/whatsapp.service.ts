import { env } from '../../shared/config/env.config.js';
import { logger } from '../../shared/utils/logger.js';
import { branding } from '@repo/shared-types';

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  recipient: string;
  error?: string;
  dryRun?: boolean;
  fallbackUrl?: string;
  isInteractive?: boolean;
  duplicated?: boolean;
}

export interface InteractiveCtaOption {
  buttonText: string;
  buttonUrl: string;
  headerText?: string;
  footerText?: string;
}

// ---------------------------------------------------------------------------
// Customer Lifecycle Parameters
// ---------------------------------------------------------------------------
export interface OrderConfirmationParams {
  orderId?: string;
  orderNumber: string;
  grandTotal: number;
  itemsCount: number;
  deliveryOtp?: string;
  storeName?: string;
  paymentMethod?: string;
  customerName?: string;
  deliveryAddress?: string;
  ctaUrl?: string;
  statusText?: string;
}

export interface CustomerRiderAssignedParams {
  orderId?: string;
  orderNumber: string;
  riderName: string;
  riderPhone?: string;
  etaMinutes?: number;
  storeName?: string;
  deliveryOtp?: string;
  ctaUrl?: string;
}

export interface OutForDeliveryParams {
  orderId?: string;
  orderNumber: string;
  riderName: string;
  riderPhone?: string;
  deliveryOtp: string;
  etaMinutes?: number;
  storeName?: string;
  ctaUrl?: string;
}

export interface DeliveryCompletedParams {
  orderId?: string;
  orderNumber: string;
  customerName?: string;
  riderName?: string;
  invoiceUrl?: string;
}

export interface OrderCancelledParams {
  orderId?: string;
  orderNumber: string;
  customerName?: string;
  reason?: string;
  refundStatus?: string;
  ctaUrl?: string;
}

// ---------------------------------------------------------------------------
// Merchant / Store Lifecycle Parameters
// ---------------------------------------------------------------------------
export interface MerchantNewOrderParams {
  orderId: string;
  orderNumber: string;
  storeName?: string;
  customerName?: string;
  itemsCount: number;
  grandTotal: number;
  paymentMethod?: string;
  ctaUrl?: string;
}

export interface MerchantRiderArrivingParams {
  orderId: string;
  orderNumber: string;
  riderName: string;
  riderPhone?: string;
  storeName?: string;
  ctaUrl?: string;
}

export interface MerchantDeliveryCompletedParams {
  orderId: string;
  orderNumber: string;
  riderName?: string;
  customerName?: string;
  grandTotal?: number;
}

// ---------------------------------------------------------------------------
// Rider Lifecycle Parameters
// ---------------------------------------------------------------------------
export interface RiderDispatchParams {
  orderId?: string;
  orderNumber: string;
  riderName: string;
  riderPhone?: string;
  pickupAddress: string;
  dropoffAddress: string;
  mapsUrl?: string;
  pickupOtp?: string;
  storeName?: string;
  estimatedPayout?: number;
  dispatchMode?: 'broadcast' | 'assigned';
}

export interface RiderPickupConfirmedParams {
  orderId?: string;
  orderNumber: string;
  riderName: string;
  dropoffAddress: string;
  storeName?: string;
  ctaUrl?: string;
}

export interface WhatsAppServiceConfig {
  phoneNumberId?: string;
  accessToken?: string;
  apiVersion?: string;
  forceLive?: boolean;
}

export interface IWhatsAppService {
  normalizePhoneNumber(phone: string): string;
  generateFallbackUrl(to: string, message: string): string;
  getDeduplicationCache(): DeduplicationCache;

  // Builders
  buildOrderConfirmationMessage(params: OrderConfirmationParams): string;
  buildCustomerRiderAssignedMessage(params: CustomerRiderAssignedParams): string;
  buildOutForDeliveryMessage(params: OutForDeliveryParams): string;
  buildDeliveryCompletedMessage(params: DeliveryCompletedParams): string;
  buildOrderCancelledMessage(params: OrderCancelledParams): string;
  buildMerchantNewOrderMessage(params: MerchantNewOrderParams): string;
  buildMerchantRiderArrivingMessage(params: MerchantRiderArrivingParams): string;
  buildMerchantDeliveryCompletedMessage(params: MerchantDeliveryCompletedParams): string;
  buildRiderDispatchMessage(params: RiderDispatchParams): string;
  buildRiderPickupConfirmedMessage(params: RiderPickupConfirmedParams): string;

  // Dispatchers
  sendTextMessage(to: string, message: string, dedupeKey?: string): Promise<WhatsAppSendResult>;
  sendInteractiveCtaMessage(to: string, body: string, cta: InteractiveCtaOption, dedupeKey?: string): Promise<WhatsAppSendResult>;

  // Customer Dispatches
  sendOrderConfirmation(to: string, params: OrderConfirmationParams): Promise<WhatsAppSendResult>;
  sendCustomerRiderAssigned(to: string, params: CustomerRiderAssignedParams): Promise<WhatsAppSendResult>;
  sendOutForDelivery(to: string, params: OutForDeliveryParams): Promise<WhatsAppSendResult>;
  sendDeliveryCompleted(to: string, params: DeliveryCompletedParams): Promise<WhatsAppSendResult>;
  sendOrderCancelled(to: string, params: OrderCancelledParams): Promise<WhatsAppSendResult>;

  // Merchant Dispatches
  sendMerchantNewOrderAlert(to: string, params: MerchantNewOrderParams): Promise<WhatsAppSendResult>;
  sendMerchantRiderArriving(to: string, params: MerchantRiderArrivingParams): Promise<WhatsAppSendResult>;
  sendMerchantDeliveryCompleted(to: string, params: MerchantDeliveryCompletedParams): Promise<WhatsAppSendResult>;

  // Rider Dispatches
  sendRiderDispatch(to: string, params: RiderDispatchParams): Promise<WhatsAppSendResult>;
  sendRiderPickupConfirmed(to: string, params: RiderPickupConfirmedParams): Promise<WhatsAppSendResult>;
}

// ---------------------------------------------------------------------------
// Helpers & Deduplication Cache
// ---------------------------------------------------------------------------
export class DeduplicationCache {
  private cache = new Map<string, number>();
  private ttlMs: number;

  constructor(ttlMs = 10 * 60 * 1000) {
    this.ttlMs = ttlMs;
  }

  isDuplicate(key: string): boolean {
    const now = Date.now();
    const expiresAt = this.cache.get(key);
    if (expiresAt && expiresAt > now) {
      return true;
    }
    this.cache.set(key, now + this.ttlMs);

    if (this.cache.size > 1000) {
      for (const [k, v] of this.cache.entries()) {
        if (v <= now) this.cache.delete(k);
      }
    }
    return false;
  }

  clear(): void {
    this.cache.clear();
  }
}

export function getWebBaseUrl(): string {
  if (env.CLIENT_WEB_URL && !env.CLIENT_WEB_URL.includes('localhost')) {
    return env.CLIENT_WEB_URL;
  }
  return branding.domain !== 'localhost' ? `https://${branding.domain}` : (env.CLIENT_WEB_URL || 'http://localhost:3000');
}

export function getMerchantBaseUrl(): string {
  if (env.CLIENT_MERCHANT_URL && !env.CLIENT_MERCHANT_URL.includes('localhost')) {
    return env.CLIENT_MERCHANT_URL;
  }
  return branding.domain !== 'localhost' ? `https://merchant.${branding.domain}` : (env.CLIENT_MERCHANT_URL || 'http://localhost:3001');
}

export function getApiBaseUrl(): string {
  return branding.domain !== 'localhost' ? `https://api.${branding.domain}` : `http://localhost:${env.PORT || 5000}`;
}

/**
 * Normalizes phone numbers to Meta WhatsApp international format (e.g. 919876543210)
 */
export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';
  const cleaned = rawPhone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }

  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `91${cleaned.slice(1)}`;
  }

  return cleaned;
}

/**
 * Generates 1-click fallback wa.me URL for instant browser redirect or manual failover
 */
export function generateFallbackUrl(rawPhone: string, message: string): string {
  const normalized = normalizePhoneNumber(rawPhone);
  const encodedText = encodeURIComponent(message);
  return normalized ? `https://wa.me/${normalized}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
}

// ---------------------------------------------------------------------------
// Message Builders
// ---------------------------------------------------------------------------
export function buildOrderConfirmationMessage(params: OrderConfirmationParams): string {
  const isConfirmed = params.statusText ? params.statusText.toLowerCase().includes('confirm') : false;
  const headline = isConfirmed ? '🛍️ *ORDER CONFIRMED & PREPARING!*' : '🛍️ *ORDER PLACED SUCCESSFULLY!*';
  const storeText = params.storeName ? `\n🏪 *Store:* ${params.storeName}` : '';
  const paymentText = params.paymentMethod ? `\n💳 *Payment Mode:* ${params.paymentMethod.toUpperCase()}` : '';
  const otpText = params.deliveryOtp ? `\n🔑 *Delivery Handoff OTP:* *${params.deliveryOtp}*` : '';
  const greeting = params.customerName ? `Hi *${params.customerName}*,\n\n` : '';

  return [
    headline,
    `Order #${params.orderNumber}`,
    `--------------------------------`,
    `${greeting}📦 *Items:* ${params.itemsCount}`,
    `💰 *Total Amount:* ₹${params.grandTotal.toLocaleString('en-IN')}${storeText}${paymentText}${otpText}`,
    `--------------------------------`,
    isConfirmed
      ? 'Your order is confirmed and is actively being packed by your neighborhood store. A delivery runner will pick it up shortly!'
      : 'Your order has been received by your local neighborhood retailer. Keep your 4-digit Delivery OTP ready for when the rider arrives.',
    `\nThank you for shopping local with *${branding.appName}*!`,
  ].join('\n');
}

export function buildCustomerRiderAssignedMessage(params: CustomerRiderAssignedParams): string {
  const etaText = params.etaMinutes ? `\n⏱️ *Estimated Delivery:* ~${params.etaMinutes} minutes` : '';
  const riderContact = params.riderPhone ? ` (${params.riderPhone})` : '';
  const storeText = params.storeName ? `\n🏪 *Store:* ${params.storeName}` : '';
  const otpText = params.deliveryOtp ? `\n🔑 *Delivery Handoff OTP:* *${params.deliveryOtp}*` : '';

  return [
    `🛵 *DELIVERY PARTNER ASSIGNED!*`,
    `Order #${params.orderNumber}`,
    `--------------------------------`,
    `👤 *Rider:* ${params.riderName}${riderContact}${storeText}${etaText}${otpText}`,
    `--------------------------------`,
    `Your parcel is packed and our partner is en route to collect it.`,
    `\n*${branding.appName}* — Live Hyperlocal Tracking`,
  ].join('\n');
}

export function buildOutForDeliveryMessage(params: OutForDeliveryParams): string {
  const etaText = params.etaMinutes ? `\n⏱️ *Estimated Arrival:* ~${params.etaMinutes} minutes` : '';
  const riderContact = params.riderPhone ? ` (${params.riderPhone})` : '';
  const storeText = params.storeName ? `\n🏪 *Collected From:* ${params.storeName}` : '';

  return [
    `🚚 *YOUR ORDER IS OUT FOR DELIVERY!*`,
    `Order #${params.orderNumber}`,
    `--------------------------------`,
    `🛵 *Delivery Partner:* ${params.riderName}${riderContact}${storeText}${etaText}`,
    `🔑 *Delivery Handoff OTP:* *${params.deliveryOtp}*`,
    `--------------------------------`,
    `⚠️ *Security Rule:* Share this 4-digit OTP with your delivery partner only after physically inspecting and receiving your package.`,
    `\n*${branding.appName}* — Hyperlocal Neighborhood Delivery`,
  ].join('\n');
}

export function buildDeliveryCompletedMessage(params: DeliveryCompletedParams): string {
  const nameGreeting = params.customerName ? `Hi ${params.customerName}, ` : '';
  const riderText = params.riderName ? ` by ${params.riderName}` : '';

  return [
    `✅ *ORDER DELIVERED SUCCESSFULLY!*`,
    `Order #${params.orderNumber}`,
    `--------------------------------`,
    `${nameGreeting}Your delivery has been completed${riderText} and verified via OTP.`,
    `We hope you loved your items!`,
    `\nRate your experience and explore more local deals on *${branding.appName}*!`,
  ].join('\n');
}

export function buildOrderCancelledMessage(params: OrderCancelledParams): string {
  const nameGreeting = params.customerName ? `Hi ${params.customerName},\n\n` : '';
  const reasonText = params.reason ? `\nReason: ${params.reason}` : '';
  const refundText = params.refundStatus
    ? `\n💰 *Refund Status:* ${params.refundStatus}`
    : `\nIf payment was deducted, your refund will be returned to the original source in 3–5 banking days.`;

  return [
    `❌ *ORDER CANCELLED*`,
    `Order #${params.orderNumber}`,
    `--------------------------------`,
    `${nameGreeting}Your order has been cancelled.${reasonText}${refundText}`,
    `\nWe apologize for any inconvenience. Check out other stores near you on *${branding.appName}*.`,
  ].join('\n');
}

export function buildMerchantNewOrderMessage(params: MerchantNewOrderParams): string {
  const customerText = params.customerName ? `\n👤 *Customer:* ${params.customerName}` : '';
  const paymentText = params.paymentMethod ? `\n💳 *Payment Mode:* ${params.paymentMethod.toUpperCase()}` : '';

  return [
    `🔔 *NEW ORDER RECEIVED!*`,
    `Order #${params.orderNumber}`,
    `--------------------------------`,
    `📦 *Items:* ${params.itemsCount}`,
    `💰 *Order Value:* ₹${params.grandTotal.toLocaleString('en-IN')}${customerText}${paymentText}`,
    `--------------------------------`,
    `⚡ Please open your Merchant Dashboard to accept, prepare, and pack this order immediately to prevent auto-expiry!`,
    `\n*${branding.appName}* Merchant Operations`,
  ].join('\n');
}

export function buildMerchantRiderArrivingMessage(params: MerchantRiderArrivingParams): string {
  const riderContact = params.riderPhone ? ` (${params.riderPhone})` : '';

  return [
    `🛵 *RIDER ON THE WAY FOR PICKUP!*`,
    `Order #${params.orderNumber}`,
    `--------------------------------`,
    `👤 *Assigned Rider:* ${params.riderName}${riderContact}`,
    `--------------------------------`,
    `🔑 *Action Required:* Before handing over the parcel, ask the rider for their *4-digit Store Pickup OTP* and enter it in your Merchant Orders Table.`,
    `\n*${branding.appName}* Merchant Logistics`,
  ].join('\n');
}

export function buildMerchantDeliveryCompletedMessage(params: MerchantDeliveryCompletedParams): string {
  const riderText = params.riderName ? ` by ${params.riderName}` : '';
  const customerText = params.customerName ? ` to ${params.customerName}` : '';
  const totalText = params.grandTotal ? ` (₹${params.grandTotal.toLocaleString('en-IN')})` : '';

  return [
    `🎉 *ORDER FULFILLED & SETTLED!*`,
    `Order #${params.orderNumber}`,
    `--------------------------------`,
    `The package was successfully delivered${riderText}${customerText}${totalText}.`,
    `Order revenue has been recorded in your store payouts ledger.`,
  ].join('\n');
}

export function buildRiderDispatchMessage(params: RiderDispatchParams): string {
  if (params.dispatchMode === 'broadcast') {
    const storeHeader = params.storeName ? ` (${params.storeName})` : '';
    const payoutLine = params.estimatedPayout
      ? `💵 *Delivery Earnings:* ₹${params.estimatedPayout}\n--------------------------------\n`
      : '';
    return [
      `🛵 *NEW DELIVERY RUN AVAILABLE!*`,
      `Order #${params.orderNumber}`,
      `--------------------------------`,
      `📍 *Pickup Store${storeHeader}:* ${params.pickupAddress}`,
      `🏠 *Customer Dropoff:* ${params.dropoffAddress}`,
      `--------------------------------`,
      payoutLine +
      `⚡ *Claim this run now* in your Rider Cockpit to start pickup and earn your delivery fee!`,
      `\n*${branding.appName}* Hyperlocal Logistics`,
    ].join('\n');
  }

  const pickupOtpLine = params.pickupOtp
    ? `🔑 *Store Pickup OTP:* *${params.pickupOtp}*\n(Show this code to store clerk when collecting parcel)\n--------------------------------\n`
    : '';
  const payoutLine = params.estimatedPayout
    ? `💵 *Delivery Earnings:* ₹${params.estimatedPayout}\n--------------------------------\n`
    : '';
  const storeHeader = params.storeName ? ` (${params.storeName})` : '';
  const mapsText = params.mapsUrl ? `🗺️ *Navigation:* ${params.mapsUrl}\n` : '';

  return [
    `🛵 *NEW DELIVERY ASSIGNMENT CONFIRMED!*`,
    `Order #${params.orderNumber}`,
    `Assigned Partner: ${params.riderName}`,
    `--------------------------------`,
    `📍 *Pickup Store${storeHeader}:* ${params.pickupAddress}`,
    `🏠 *Customer Dropoff:* ${params.dropoffAddress}`,
    `--------------------------------`,
    payoutLine + pickupOtpLine + mapsText +
    `⚠️ *Next Steps:* Show Pickup OTP to store clerk upon collection, then collect customer 4-digit Delivery OTP at doorstep.`,
  ].join('\n');
}

export function buildRiderPickupConfirmedMessage(params: RiderPickupConfirmedParams): string {
  const storeHeader = params.storeName ? ` from ${params.storeName}` : '';

  return [
    `📦 *PARCEL PICKED UP SUCCESSFULLY!*`,
    `Order #${params.orderNumber}`,
    `--------------------------------`,
    `You have collected the package${storeHeader}.`,
    `🏠 *Customer Dropoff:* ${params.dropoffAddress}`,
    `--------------------------------`,
    `🔑 *At Doorstep:* Ask the customer for their secret *4-digit Delivery OTP* to confirm handover and unlock your delivery earnings.`,
    `\nDrive safe with *${branding.appName}*!`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Service Factory Implementation
// ---------------------------------------------------------------------------
export function createWhatsAppService(config?: WhatsAppServiceConfig): IWhatsAppService {
  const phoneNumberId = config?.phoneNumberId ?? (env.WHATSAPP_PHONE_NUMBER_ID?.trim() || '');
  const accessToken = config?.accessToken ?? (env.WHATSAPP_ACCESS_TOKEN?.trim() || '');
  const apiVersion = config?.apiVersion ?? (env.WHATSAPP_API_VERSION?.trim() || 'v20.0');
  const isDryRun = !config?.forceLive && (!phoneNumberId || !accessToken || env.NODE_ENV === 'test');

  const dedupeCache = new DeduplicationCache();

  function getDeduplicationCache(): DeduplicationCache {
    return dedupeCache;
  }

  async function sendTextMessage(
    to: string,
    body: string,
    dedupeKey?: string,
  ): Promise<WhatsAppSendResult> {
    const normalizedPhone = normalizePhoneNumber(to);
    const fallbackUrl = generateFallbackUrl(to, body);

    if (!normalizedPhone || normalizedPhone.length < 10) {
      logger.warn(`[WhatsAppService] Skipping dispatch: invalid recipient phone "${to}"`);
      return { success: false, recipient: to, error: 'INVALID_PHONE_NUMBER', fallbackUrl };
    }

    if (dedupeKey && dedupeCache.isDuplicate(dedupeKey)) {
      logger.info(`[WhatsAppService] Suppressed duplicate dispatch for key "${dedupeKey}" to ${normalizedPhone}`);
      return {
        success: true,
        messageId: `deduped-${Date.now()}`,
        recipient: normalizedPhone,
        duplicated: true,
        fallbackUrl,
      };
    }

    if (isDryRun) {
      logger.debug(
        `[WhatsAppService] [DRY_RUN] Dispatched text message to ${normalizedPhone}: ${body.slice(0, 80).replace(/\n/g, ' ')}...`,
      );
      return {
        success: true,
        messageId: `mock-wa-msg-${Date.now()}`,
        recipient: normalizedPhone,
        dryRun: true,
        fallbackUrl,
      };
    }

    const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

    try {
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: normalizedPhone,
        type: 'text',
        text: {
          preview_url: true,
          body,
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = (await response.json()) as {
        messages?: Array<{ id: string }>;
        error?: { message: string; type: string; code: number };
      };

      if (!response.ok || responseData.error) {
        const errorMsg = responseData.error?.message || `HTTP ${response.status} ${response.statusText}`;
        logger.error(`[WhatsAppService] Meta API Error: ${errorMsg}`, {
          code: responseData.error?.code,
          recipient: normalizedPhone,
        });
        return {
          success: false,
          recipient: normalizedPhone,
          error: errorMsg,
          fallbackUrl,
        };
      }

      const messageId = responseData.messages?.[0]?.id || `wa-msg-${Date.now()}`;
      logger.info(`[WhatsAppService] Successfully sent WhatsApp message ${messageId} to ${normalizedPhone}`);
      return {
        success: true,
        messageId,
        recipient: normalizedPhone,
        dryRun: false,
        fallbackUrl,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.error(`[WhatsAppService] Network exception dispatching to ${normalizedPhone}: ${errorMsg}`);
      return {
        success: false,
        recipient: normalizedPhone,
        error: errorMsg,
        fallbackUrl,
      };
    }
  }

  async function sendInteractiveCtaMessage(
    to: string,
    body: string,
    cta: InteractiveCtaOption,
    dedupeKey?: string,
  ): Promise<WhatsAppSendResult> {
    const normalizedPhone = normalizePhoneNumber(to);
    const enrichedBody = `${body}\n\n👉 *${cta.buttonText}:* ${cta.buttonUrl}`;
    const fallbackUrl = generateFallbackUrl(to, enrichedBody);

    if (!normalizedPhone || normalizedPhone.length < 10) {
      logger.warn(`[WhatsAppService] Skipping interactive dispatch: invalid phone "${to}"`);
      return { success: false, recipient: to, error: 'INVALID_PHONE_NUMBER', fallbackUrl };
    }

    if (dedupeKey && dedupeCache.isDuplicate(dedupeKey)) {
      logger.info(`[WhatsAppService] Suppressed duplicate interactive dispatch for "${dedupeKey}"`);
      return {
        success: true,
        messageId: `deduped-cta-${Date.now()}`,
        recipient: normalizedPhone,
        duplicated: true,
        fallbackUrl,
      };
    }

    if (isDryRun) {
      logger.debug(
        `[WhatsAppService] [DRY_RUN] Dispatched interactive CTA message to ${normalizedPhone} [${cta.buttonText} ➔ ${cta.buttonUrl}]`,
      );
      return {
        success: true,
        messageId: `mock-wa-interactive-${Date.now()}`,
        recipient: normalizedPhone,
        dryRun: true,
        isInteractive: true,
        fallbackUrl,
      };
    }

    // Meta WhatsApp Cloud API Interactive CTA URL payload
    const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

    try {
      const payload: Record<string, unknown> = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: normalizedPhone,
        type: 'interactive',
        interactive: {
          type: 'cta_url',
          body: {
            text: body.length > 1024 ? body.slice(0, 1020) + '...' : body,
          },
          action: {
            name: 'cta_url',
            parameters: {
              display_text: cta.buttonText.slice(0, 20),
              url: cta.buttonUrl,
            },
          },
        },
      };

      if (cta.headerText) {
        (payload.interactive as any).header = {
          type: 'text',
          text: cta.headerText.slice(0, 60),
        };
      }

      if (cta.footerText) {
        (payload.interactive as any).footer = {
          text: cta.footerText.slice(0, 60),
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = (await response.json()) as {
        messages?: Array<{ id: string }>;
        error?: { message: string; type: string; code: number };
      };

      if (!response.ok || responseData.error) {
        const errorMsg = responseData.error?.message || `HTTP ${response.status} ${response.statusText}`;
        logger.warn(
          `[WhatsAppService] Interactive CTA failed (${errorMsg}), failing over to standard text message...`,
        );
        // Failover: Deliver standard text message with formatted link
        return sendTextMessage(to, enrichedBody);
      }

      const messageId = responseData.messages?.[0]?.id || `wa-cta-${Date.now()}`;
      logger.info(`[WhatsAppService] Successfully sent WhatsApp interactive CTA ${messageId} to ${normalizedPhone}`);
      return {
        success: true,
        messageId,
        recipient: normalizedPhone,
        dryRun: false,
        isInteractive: true,
        fallbackUrl,
      };
    } catch (err) {
      logger.warn(
        `[WhatsAppService] Exception in interactive CTA dispatch, failing over to text: ${err instanceof Error ? err.message : String(err)}`,
      );
      return sendTextMessage(to, enrichedBody);
    }
  }

  // -------------------------------------------------------------------------
  // Customer Dispatches
  // -------------------------------------------------------------------------
  async function sendOrderConfirmation(
    to: string,
    params: OrderConfirmationParams,
  ): Promise<WhatsAppSendResult> {
    const webBase = getWebBaseUrl();
    const trackingUrl = params.ctaUrl || `${webBase}/orders/${params.orderId || params.orderNumber}/tracking`;
    const message = buildOrderConfirmationMessage(params);

    const headerText = params.statusText || 'Order Placed';
    const slug = headerText.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    return sendInteractiveCtaMessage(
      to,
      message,
      {
        headerText: headerText.slice(0, 60),
        buttonText: 'Track Order Live',
        buttonUrl: trackingUrl,
        footerText: `${branding.appName} Hyperlocal`,
      },
      `cust:${slug}:${params.orderNumber}:${to}`,
    );
  }

  async function sendCustomerRiderAssigned(
    to: string,
    params: CustomerRiderAssignedParams,
  ): Promise<WhatsAppSendResult> {
    const webBase = getWebBaseUrl();
    const trackingUrl = params.ctaUrl || `${webBase}/orders/${params.orderId || params.orderNumber}/tracking`;
    const message = buildCustomerRiderAssignedMessage(params);

    return sendInteractiveCtaMessage(
      to,
      message,
      {
        headerText: 'Rider Assigned',
        buttonText: 'Track Rider Live',
        buttonUrl: trackingUrl,
        footerText: `${branding.appName} Delivery`,
      },
      `cust:rider_assigned:${params.orderNumber}:${to}`,
    );
  }

  async function sendOutForDelivery(
    to: string,
    params: OutForDeliveryParams,
  ): Promise<WhatsAppSendResult> {
    const webBase = getWebBaseUrl();
    const trackingUrl = params.ctaUrl || `${webBase}/orders/${params.orderId || params.orderNumber}/tracking`;
    const message = buildOutForDeliveryMessage(params);

    return sendInteractiveCtaMessage(
      to,
      message,
      {
        headerText: 'Out For Delivery',
        buttonText: 'Track Delivery',
        buttonUrl: trackingUrl,
        footerText: `${branding.appName} Neighborhood`,
      },
      `cust:out_for_delivery:${params.orderNumber}:${to}`,
    );
  }

  async function sendDeliveryCompleted(
    to: string,
    params: DeliveryCompletedParams,
  ): Promise<WhatsAppSendResult> {
    const apiBase = getApiBaseUrl();
    const invoiceUrl =
      params.invoiceUrl ||
      `${apiBase}/api/v1/orders/${params.orderId || params.orderNumber}/invoice/print?format=a4`;
    const message = buildDeliveryCompletedMessage(params);

    return sendInteractiveCtaMessage(
      to,
      message,
      {
        headerText: 'Delivered',
        buttonText: 'Download Invoice',
        buttonUrl: invoiceUrl,
        footerText: `Thank you for shopping local!`,
      },
      `cust:delivered:${params.orderNumber}:${to}`,
    );
  }

  async function sendOrderCancelled(
    to: string,
    params: OrderCancelledParams,
  ): Promise<WhatsAppSendResult> {
    const webBase = getWebBaseUrl();
    const dealsUrl = params.ctaUrl || `${webBase}`;
    const message = buildOrderCancelledMessage(params);

    return sendInteractiveCtaMessage(
      to,
      message,
      {
        headerText: 'Order Cancelled',
        buttonText: 'Browse Deals',
        buttonUrl: dealsUrl,
        footerText: `${branding.appName} Support`,
      },
      `cust:cancelled:${params.orderNumber}:${to}`,
    );
  }

  // -------------------------------------------------------------------------
  // Merchant Dispatches
  // -------------------------------------------------------------------------
  async function sendMerchantNewOrderAlert(
    to: string,
    params: MerchantNewOrderParams,
  ): Promise<WhatsAppSendResult> {
    const merchantBase = getMerchantBaseUrl();
    const ordersUrl = params.ctaUrl || `${merchantBase}/orders`;
    const message = buildMerchantNewOrderMessage(params);

    return sendInteractiveCtaMessage(
      to,
      message,
      {
        headerText: 'New Order Alert',
        buttonText: 'Open Merchant Hub',
        buttonUrl: ordersUrl,
        footerText: `${branding.appName} Merchant Operations`,
      },
      `merchant:new_order:${params.orderNumber}:${to}`,
    );
  }

  async function sendMerchantRiderArriving(
    to: string,
    params: MerchantRiderArrivingParams,
  ): Promise<WhatsAppSendResult> {
    const merchantBase = getMerchantBaseUrl();
    const ordersUrl = params.ctaUrl || `${merchantBase}/orders`;
    const message = buildMerchantRiderArrivingMessage(params);

    return sendInteractiveCtaMessage(
      to,
      message,
      {
        headerText: 'Rider Arriving',
        buttonText: 'Verify Store Pickup',
        buttonUrl: ordersUrl,
        footerText: `${branding.appName} Merchant Logistics`,
      },
      `merchant:rider_arriving:${params.orderNumber}:${to}`,
    );
  }

  async function sendMerchantDeliveryCompleted(
    to: string,
    params: MerchantDeliveryCompletedParams,
  ): Promise<WhatsAppSendResult> {
    const message = buildMerchantDeliveryCompletedMessage(params);
    return sendTextMessage(
      to,
      message,
      `merchant:fulfilled:${params.orderNumber}:${to}`,
    );
  }

  // -------------------------------------------------------------------------
  // Rider Dispatches
  // -------------------------------------------------------------------------
  async function sendRiderDispatch(
    to: string,
    params: RiderDispatchParams,
  ): Promise<WhatsAppSendResult> {
    const webBase = getWebBaseUrl();
    const cockpitUrl = `${webBase}/rider/run/${params.orderId || params.orderNumber}`;
    const message = buildRiderDispatchMessage({
      ...params,
      mapsUrl: params.mapsUrl || cockpitUrl,
    });

    const isBroadcast = params.dispatchMode === 'broadcast';
    return sendInteractiveCtaMessage(
      to,
      message,
      {
        headerText: isBroadcast ? 'Delivery Run Available' : 'Dispatch Order',
        buttonText: isBroadcast ? 'Claim Delivery Run' : 'Open Rider Cockpit',
        buttonUrl: cockpitUrl,
        footerText: `${branding.appName} Delivery Fleet`,
      },
      `rider:${params.dispatchMode || 'dispatched'}:${params.orderNumber}:${to}`,
    );
  }

  async function sendRiderPickupConfirmed(
    to: string,
    params: RiderPickupConfirmedParams,
  ): Promise<WhatsAppSendResult> {
    const webBase = getWebBaseUrl();
    const cockpitUrl = params.ctaUrl || `${webBase}/rider/run/${params.orderId || params.orderNumber}`;
    const message = buildRiderPickupConfirmedMessage(params);

    return sendInteractiveCtaMessage(
      to,
      message,
      {
        headerText: 'Pickup Confirmed',
        buttonText: 'Navigate to Dropoff',
        buttonUrl: cockpitUrl,
        footerText: `${branding.appName} Delivery Fleet`,
      },
      `rider:pickup_confirmed:${params.orderNumber}:${to}`,
    );
  }

  return {
    normalizePhoneNumber,
    generateFallbackUrl,
    getDeduplicationCache,
    buildOrderConfirmationMessage,
    buildCustomerRiderAssignedMessage,
    buildOutForDeliveryMessage,
    buildDeliveryCompletedMessage,
    buildOrderCancelledMessage,
    buildMerchantNewOrderMessage,
    buildMerchantRiderArrivingMessage,
    buildMerchantDeliveryCompletedMessage,
    buildRiderDispatchMessage,
    buildRiderPickupConfirmedMessage,
    sendTextMessage,
    sendInteractiveCtaMessage,
    sendOrderConfirmation,
    sendCustomerRiderAssigned,
    sendOutForDelivery,
    sendDeliveryCompleted,
    sendOrderCancelled,
    sendMerchantNewOrderAlert,
    sendMerchantRiderArriving,
    sendMerchantDeliveryCompleted,
    sendRiderDispatch,
    sendRiderPickupConfirmed,
  };
}
