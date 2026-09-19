import { env } from '../config/env.config.js';

/**
 * Validates incoming HTTP/WebSocket origins against configured allowed origins,
 * custom additional domains, and dynamically generated Vercel preview environments.
 */
export function isOriginAllowed(origin: string | undefined): boolean {
  // Allow requests without Origin (e.g. mobile native clients, curl, server-to-server)
  if (!origin) return true;

  const customOrigins = env.ADDITIONAL_ALLOWED_ORIGINS
    ? env.ADDITIONAL_ALLOWED_ORIGINS.split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const allowedOrigins = [
    env.CLIENT_WEB_URL,
    env.CLIENT_MERCHANT_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    ...customOrigins,
  ];

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // Dynamic regex match for Vercel preview / staging URLs (e.g., https://xyz.vercel.app)
  const vercelPreviewRegex = /^https:\/\/[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.vercel\.app$/;
  if (vercelPreviewRegex.test(origin)) {
    return true;
  }

  return false;
}
