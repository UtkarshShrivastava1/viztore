import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createWhatsAppService,
  normalizePhoneNumber,
  generateFallbackUrl,
  buildOrderConfirmationMessage,
  buildRiderDispatchMessage,
  buildOutForDeliveryMessage,
  buildDeliveryCompletedMessage,
} from './whatsapp.service.js';
import { branding } from '@repo/shared-types';

describe('WhatsAppService Unit Tests (Task T-03 Audit)', () => {
  describe('normalizePhoneNumber', () => {
    it('should normalize standard 10-digit Indian phone numbers with 91 prefix', () => {
      expect(normalizePhoneNumber('9876543210')).toBe('919876543210');
    });

    it('should strip non-digit characters (+, spaces, hyphens)', () => {
      expect(normalizePhoneNumber('+91 98765-43210')).toBe('919876543210');
      expect(normalizePhoneNumber('(9876) 543 210')).toBe('919876543210');
    });

    it('should convert 11-digit numbers starting with 0 to standard 91 format', () => {
      expect(normalizePhoneNumber('09876543210')).toBe('919876543210');
    });

    it('should keep already normalized numbers untouched', () => {
      expect(normalizePhoneNumber('919876543210')).toBe('919876543210');
    });

    it('should return empty string for empty input', () => {
      expect(normalizePhoneNumber('')).toBe('');
    });
  });

  describe('generateFallbackUrl & Failover Deep Linking', () => {
    it('should generate valid 1-click wa.me URL with normalized Indian phone and encoded body', () => {
      const url = generateFallbackUrl('9876543210', 'Order Confirmed: #ORD-12345 for ₹500');
      expect(url).toBe(
        'https://wa.me/919876543210?text=Order%20Confirmed%3A%20%23ORD-12345%20for%20%E2%82%B9500',
      );
    });

    it('should handle un-normalized phone with formatting in fallback URL', () => {
      const url = generateFallbackUrl('+91 98765-43210', 'Dispatch Rider');
      expect(url.startsWith('https://wa.me/919876543210?text=')).toBe(true);
    });

    it('should generate generic wa.me/?text= link when phone number is missing', () => {
      const url = generateFallbackUrl('', 'Customer Broadcast');
      expect(url).toBe('https://wa.me/?text=Customer%20Broadcast');
    });

    it('should cleanly encode newlines, emojis, and currency symbols', () => {
      const rawText = '🛍️ Order #ORD-101\n💰 Total: ₹1,299';
      const url = generateFallbackUrl('9876543210', rawText);
      expect(url).toContain('https://wa.me/919876543210?text=');
      expect(url).toContain('%E2%82%B91%2C299'); // ₹1,299
      expect(url).toContain('%0A'); // newline
    });
  });

  describe('Message Builders & White-Label Compliance', () => {
    it('buildOrderConfirmationMessage formats full INR total and delivery OTP with zero brand leaks', () => {
      const msg = buildOrderConfirmationMessage({
        orderNumber: 'ORD-20261021-X9Y8Z7',
        grandTotal: 1499.5,
        itemsCount: 4,
        storeName: 'Royal Mart Bhilai',
        deliveryOtp: '8912',
      });

      expect(msg).toContain('ORD-20261021-X9Y8Z7');
      expect(msg).toContain('₹1,499.5');
      expect(msg).toContain('Royal Mart Bhilai');
      expect(msg).toContain('8912');
      expect(msg).toContain(branding.appName);

      // White-label check: strictly zero client brand strings
      expect(msg).not.toMatch(/viztore/i);
      expect(msg).not.toMatch(/\bvzt\b/i);
    });

    it('buildRiderDispatchMessage formats coordinates, order number, and OTP prompt', () => {
      const msg = buildRiderDispatchMessage({
        orderNumber: 'ORD-20261021-X9Y8Z7',
        riderName: 'Vikram Patel',
        pickupAddress: 'Shop 12, Nehru Nagar',
        dropoffAddress: 'B-402, Priyadarshini Parisar',
        mapsUrl: 'https://maps.google.com/?q=21.21,81.38',
      });

      expect(msg).toContain('ORD-20261021-X9Y8Z7');
      expect(msg).toContain('Vikram Patel');
      expect(msg).toContain('Shop 12, Nehru Nagar');
      expect(msg).toContain('https://maps.google.com/?q=21.21,81.38');
      expect(msg).toContain('4-digit Delivery OTP');
    });

    it('buildOutForDeliveryMessage and buildDeliveryCompletedMessage format cleanly', () => {
      const outMsg = buildOutForDeliveryMessage({
        orderNumber: 'ORD-101',
        riderName: 'Sameer',
        deliveryOtp: '4567',
        etaMinutes: 15,
      });
      expect(outMsg).toContain('4567');
      expect(outMsg).toContain('~15 minutes');

      const completedMsg = buildDeliveryCompletedMessage({
        orderNumber: 'ORD-101',
        customerName: 'Ananya',
      });
      expect(completedMsg).toContain('Hi Ananya');
      expect(completedMsg).toContain('verified via OTP');
    });
  });

  describe('createWhatsAppService (Dry Run & Fallback Link Verification)', () => {
    const service = createWhatsAppService();

    it('should reject invalid recipient phone numbers but provide fallbackUrl', async () => {
      const result = await service.sendTextMessage('123', 'Hello');
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_PHONE_NUMBER');
      expect(result.fallbackUrl).toContain('https://wa.me/');
    });

    it('should succeed in dry-run mode for test environment and embed fallbackUrl', async () => {
      const result = await service.sendTextMessage('9876543210', 'Test message');
      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
      expect(result.recipient).toBe('919876543210');
      expect(result.messageId).toContain('mock-wa-msg');
      expect(result.fallbackUrl).toContain('https://wa.me/919876543210?text=Test%20message');
    });

    it('should format and dispatch order confirmation message with failover URL', async () => {
      const result = await service.sendOrderConfirmation('9876543210', {
        orderNumber: 'ORD-98214',
        grandTotal: 1250,
        itemsCount: 3,
        storeName: 'Local Corner Mart',
        deliveryOtp: '7412',
      });

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
      expect(result.recipient).toBe('919876543210');
      expect(result.fallbackUrl).toContain('https://wa.me/919876543210?text=');
      expect(result.fallbackUrl).toContain('ORD-98214');
    });
  });

  describe('Live Meta API Dispatch & Failover on Error (Mocked Fetch)', () => {
    const originalFetch = globalThis.fetch;
    const testConfig = {
      forceLive: true,
      phoneNumberId: '1390494190808450',
      accessToken: 'test-access-token-12345',
      apiVersion: 'v20.0',
    };

    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it('should call Meta Graph API endpoint with valid headers and payload', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          messaging_product: 'whatsapp',
          contacts: [{ input: '919876543210', wa_id: '919876543210' }],
          messages: [{ id: 'wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgSMzEwM...' }],
        }),
      });
      globalThis.fetch = mockFetch as unknown as typeof fetch;

      const liveService = createWhatsAppService(testConfig);
      const result = await liveService.sendTextMessage('9876543210', 'Live customer test message');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe('https://graph.facebook.com/v20.0/1390494190808450/messages');
      expect(options.headers).toMatchObject({
        Authorization: 'Bearer test-access-token-12345',
        'Content-Type': 'application/json',
      });

      const body = JSON.parse(options.body);
      expect(body.messaging_product).toBe('whatsapp');
      expect(body.to).toBe('919876543210');
      expect(body.text.body).toBe('Live customer test message');

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(false);
      expect(result.messageId).toBe('wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgSMzEwM...');
      expect(result.fallbackUrl).toContain('https://wa.me/919876543210?text=');
    });

    it('should provide 1-click fallbackUrl on Meta Graph API error response', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({
          error: {
            message: 'Invalid parameter: (#100) The parameter recipient is not a valid WhatsApp user',
            type: 'OAuthException',
            code: 100,
          },
        }),
      });
      globalThis.fetch = mockFetch as unknown as typeof fetch;

      const liveService = createWhatsAppService(testConfig);
      const result = await liveService.sendTextMessage('9876543210', 'Test error handling');

      expect(result.success).toBe(false);
      expect(result.error).toContain('The parameter recipient is not a valid WhatsApp user');
      // Crucial failover invariant: fallbackUrl is present so merchant can still click and send manually
      expect(result.fallbackUrl).toBe(
        'https://wa.me/919876543210?text=Test%20error%20handling',
      );
    });

    it('should provide 1-click fallbackUrl on network exceptions', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Connection refused'));
      globalThis.fetch = mockFetch as unknown as typeof fetch;

      const liveService = createWhatsAppService(testConfig);
      const result = await liveService.sendTextMessage('9876543210', 'Test network failure');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Connection refused');
      expect(result.fallbackUrl).toBe(
        'https://wa.me/919876543210?text=Test%20network%20failure',
      );
    });
  });
});
