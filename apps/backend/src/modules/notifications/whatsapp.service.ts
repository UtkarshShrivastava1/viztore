import { env } from '../../shared/config/env.config.js';
import { logger } from '../../shared/utils/logger.js';
import { branding } from '@repo/shared-types';

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  recipient: string;
  error?: string;
  dryRun?: boolean;
}

export interface OrderConfirmationParams {
  orderNumber: string;
  grandTotal: number;
  itemsCount: number;
  deliveryOtp?: string;
  storeName?: string;
}

export interface RiderDispatchParams {
  orderNumber: string;
  riderName: string;
  pickupAddress: string;
  dropoffAddress: string;
  mapsUrl: string;
}

export interface OutForDeliveryParams {
  orderNumber: string;
  riderName: string;
  deliveryOtp: string;
  etaMinutes?: number;
}

export interface DeliveryCompletedParams {
  orderNumber: string;
  customerName?: string;
}

export interface WhatsAppServiceConfig {
  phoneNumberId?: string;
  accessToken?: string;
  apiVersion?: string;
  forceLive?: boolean;
}

export interface IWhatsAppService {
  normalizePhoneNumber(phone: string): string;
  sendTextMessage(to: string, message: string): Promise<WhatsAppSendResult>;
  sendOrderConfirmation(to: string, params: OrderConfirmationParams): Promise<WhatsAppSendResult>;
  sendRiderDispatch(to: string, params: RiderDispatchParams): Promise<WhatsAppSendResult>;
  sendOutForDelivery(to: string, params: OutForDeliveryParams): Promise<WhatsAppSendResult>;
  sendDeliveryCompleted(to: string, params: DeliveryCompletedParams): Promise<WhatsAppSendResult>;
}

/**
 * Normalizes phone numbers to Meta WhatsApp international format (e.g. 919876543210)
 */
export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';
  const cleaned = rawPhone.replace(/\D/g, '');

  // 10 digits standard Indian phone number
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }

  // 11 digits starting with 0
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `91${cleaned.slice(1)}`;
  }

  // Already prefixed with country code
  return cleaned;
}

export function createWhatsAppService(config?: WhatsAppServiceConfig): IWhatsAppService {
  const phoneNumberId = config?.phoneNumberId ?? (env.WHATSAPP_PHONE_NUMBER_ID?.trim() || '');
  const accessToken = config?.accessToken ?? (env.WHATSAPP_ACCESS_TOKEN?.trim() || '');
  const apiVersion = config?.apiVersion ?? (env.WHATSAPP_API_VERSION?.trim() || 'v20.0');
  const isDryRun = !config?.forceLive && (!phoneNumberId || !accessToken || env.NODE_ENV === 'test');

  async function sendTextMessage(to: string, body: string): Promise<WhatsAppSendResult> {
    const normalizedPhone = normalizePhoneNumber(to);
    if (!normalizedPhone || normalizedPhone.length < 10) {
      logger.warn(`[WhatsAppService] Skipping dispatch: invalid recipient phone "${to}"`);
      return { success: false, recipient: to, error: 'INVALID_PHONE_NUMBER' };
    }

    // Dry-run mode for test environments or when credentials are absent
    if (isDryRun) {
      logger.debug(
        `[WhatsAppService] [DRY_RUN] Dispatched text message to ${normalizedPhone}: ${body.slice(0, 80).replace(/\n/g, ' ')}...`,
      );
      return {
        success: true,
        messageId: `mock-wa-msg-${Date.now()}`,
        recipient: normalizedPhone,
        dryRun: true,
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
        };
      }

      const messageId = responseData.messages?.[0]?.id || `wa-msg-${Date.now()}`;
      logger.info(`[WhatsAppService] Successfully sent WhatsApp message ${messageId} to ${normalizedPhone}`);
      return {
        success: true,
        messageId,
        recipient: normalizedPhone,
        dryRun: false,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.error(`[WhatsAppService] Network exception dispatching to ${normalizedPhone}: ${errorMsg}`);
      return {
        success: false,
        recipient: normalizedPhone,
        error: errorMsg,
      };
    }
  }

  async function sendOrderConfirmation(
    to: string,
    params: OrderConfirmationParams,
  ): Promise<WhatsAppSendResult> {
    const storeText = params.storeName ? `\n🏪 *Store:* ${params.storeName}` : '';
    const otpText = params.deliveryOtp ? `\n🔑 *Delivery Handoff OTP:* *${params.deliveryOtp}*` : '';

    const message = [
      `🛍️ *ORDER CONFIRMED!*`,
      `Order #${params.orderNumber}`,
      `--------------------------------`,
      `📦 *Items:* ${params.itemsCount}`,
      `💰 *Total Amount:* ₹${params.grandTotal.toLocaleString('en-IN')}${storeText}${otpText}`,
      `--------------------------------`,
      `Your order is being prepared by your local neighborhood retailer. Keep your 4-digit Delivery OTP ready for when the rider arrives.`,
      `\nThank you for shopping local with *${branding.appName}*!`,
    ].join('\n');

    return sendTextMessage(to, message);
  }

  async function sendRiderDispatch(
    to: string,
    params: RiderDispatchParams,
  ): Promise<WhatsAppSendResult> {
    const message = [
      `🛵 *NEW DELIVERY ASSIGNMENT*`,
      `Order #${params.orderNumber}`,
      `Assigned Rider: ${params.riderName}`,
      `--------------------------------`,
      `📍 *Pickup:* ${params.pickupAddress}`,
      `🏠 *Dropoff:* ${params.dropoffAddress}`,
      `🗺️ *Turn-by-Turn Navigation:*`,
      `${params.mapsUrl}`,
      `--------------------------------`,
      `⚠️ *Action Required:* Collect the 4-digit Delivery OTP from the customer upon physical package handoff to complete the delivery.`,
    ].join('\n');

    return sendTextMessage(to, message);
  }

  async function sendOutForDelivery(
    to: string,
    params: OutForDeliveryParams,
  ): Promise<WhatsAppSendResult> {
    const etaText = params.etaMinutes ? `\n⏱️ *Estimated Arrival:* ~${params.etaMinutes} minutes` : '';

    const message = [
      `🚚 *YOUR ORDER IS OUT FOR DELIVERY!*`,
      `Order #${params.orderNumber}`,
      `--------------------------------`,
      `🛵 *Delivery Partner:* ${params.riderName}${etaText}`,
      `🔑 *Delivery Handoff OTP:* *${params.deliveryOtp}*`,
      `--------------------------------`,
      `Please share this 4-digit OTP with the delivery partner only when you physically receive your package.`,
      `\n*${branding.appName}* — Hyperlocal Neighborhood Delivery`,
    ].join('\n');

    return sendTextMessage(to, message);
  }

  async function sendDeliveryCompleted(
    to: string,
    params: DeliveryCompletedParams,
  ): Promise<WhatsAppSendResult> {
    const nameGreeting = params.customerName ? `Hi ${params.customerName}, ` : '';

    const message = [
      `✅ *ORDER DELIVERED SUCCESSFULLY!*`,
      `Order #${params.orderNumber}`,
      `--------------------------------`,
      `${nameGreeting}Your delivery has been completed and verified via OTP.`,
      `We hope you loved your items!`,
      `\nRate your experience and explore more deals on *${branding.appName}*!`,
    ].join('\n');

    return sendTextMessage(to, message);
  }

  return {
    normalizePhoneNumber,
    sendTextMessage,
    sendOrderConfirmation,
    sendRiderDispatch,
    sendOutForDelivery,
    sendDeliveryCompleted,
  };
}
