import { describe, it, expect } from 'vitest';
import { isOriginAllowed } from './cors.js';
import { env } from '../config/env.config.js';

describe('CORS Origin Validation', () => {
  it('allows requests with no origin (mobile app, curl, server-to-server)', () => {
    expect(isOriginAllowed(undefined)).toBe(true);
    expect(isOriginAllowed('')).toBe(true);
  });

  it('allows standard localhost development origins', () => {
    expect(isOriginAllowed('http://localhost:3000')).toBe(true);
    expect(isOriginAllowed('http://localhost:3001')).toBe(true);
    expect(isOriginAllowed('http://127.0.0.1:3000')).toBe(true);
    expect(isOriginAllowed('http://127.0.0.1:3001')).toBe(true);
  });

  it('allows configured CLIENT_WEB_URL and CLIENT_MERCHANT_URL', () => {
    expect(isOriginAllowed(env.CLIENT_WEB_URL)).toBe(true);
    expect(isOriginAllowed(env.CLIENT_MERCHANT_URL)).toBe(true);
  });

  it('allows dynamic Vercel preview and staging deployments (*.vercel.app)', () => {
    expect(isOriginAllowed('https://platform-web-staging.vercel.app')).toBe(true);
    expect(isOriginAllowed('https://platform-web-git-feat-cart-checkout.vercel.app')).toBe(true);
    expect(isOriginAllowed('https://preview-123.platform-web.vercel.app')).toBe(true);
  });

  it('rejects unauthorized third-party origins', () => {
    expect(isOriginAllowed('https://malicious-site.com')).toBe(false);
    expect(isOriginAllowed('https://attacker.org')).toBe(false);
    expect(isOriginAllowed('http://randomsite.net')).toBe(false);
    expect(isOriginAllowed('https://fake-vercel.app.badsite.com')).toBe(false);
  });
});
