import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createWhatsAppService,
  normalizePhoneNumber,
} from './whatsapp.service.js';
import { branding } from '@repo/shared-types';

describe('WhatsAppService Unit Tests', () => {
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

  describe('createWhatsAppService (Dry Run Mode in Tests)', () => {
    const service = createWhatsAppService();

    it('should reject invalid recipient phone numbers', async () => {
      const result = await service.sendTextMessage('123', 'Hello');
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_PHONE_NUMBER');
    });

    it('should succeed in dry-run mode for test environment', async () => {
      const result = await service.sendTextMessage('9876543210', 'Test message');
      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
      expect(result.recipient).toBe('919876543210');
      expect(result.messageId).toContain('mock-wa-msg');
    });

    it('should format and dispatch order confirmation message', async () => {
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
    });

    it('should format and dispatch rider delivery assignment message', async () => {
      const result = await service.sendRiderDispatch('9876543210', {
        orderNumber: 'ORD-98214',
        riderName: 'Rahul Verma',
        pickupAddress: 'Shop 4, Commercial Complex, Sector 6',
        dropoffAddress: 'Flat 302, Green Valley Apartments',
        mapsUrl: 'https://maps.google.com/?q=21.19,81.35',
      });

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
    });

    it('should format and dispatch out-for-delivery OTP message', async () => {
      const result = await service.sendOutForDelivery('9876543210', {
        orderNumber: 'ORD-98214',
        riderName: 'Rahul Verma',
        deliveryOtp: '7412',
        etaMinutes: 25,
      });

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
    });

    it('should format and dispatch delivery completed message', async () => {
      const result = await service.sendDeliveryCompleted('9876543210', {
        orderNumber: 'ORD-98214',
        customerName: 'Aarav Sharma',
      });

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
    });
  });

  describe('Live Meta API Dispatch (Mocked Fetch)', () => {
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
    });

    it('should handle Meta Graph API error response gracefully without throwing', async () => {
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
    });

    it('should handle network exceptions gracefully', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Connection refused'));
      globalThis.fetch = mockFetch as unknown as typeof fetch;

      const liveService = createWhatsAppService(testConfig);
      const result = await liveService.sendTextMessage('9876543210', 'Test network failure');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Connection refused');
    });
  });
});
