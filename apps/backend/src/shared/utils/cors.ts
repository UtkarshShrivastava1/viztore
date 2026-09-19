import { env } from '../config/env.config.js';

/**
 * Validates incoming HTTP/WebSocket origins against configured allowed origins,
 * custom additional domains, and dynamically generated Vercel preview environments.
 */
export function isOriginAllowed(origin: string | undefined): boolean {
  // Allow requests without Origin (e.g. mobile native clients, curl, server-to-server)
  if (!origin) return true;

  // Allow any localhost, 127.0.0.1, or [::1] on any port (e.g., 3000, 3001, 3002, 5173, 4173)
  const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:[0-9]+)?$/;
  if (localhostRegex.test(origin)) {
    return true;
  }

  // Dynamic regex match for Vercel preview / staging URLs (e.g., https://xyz.vercel.app)
  const vercelPreviewRegex = /^https:\/\/[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.vercel\.app$/;
  if (vercelPreviewRegex.test(origin)) {
    return true;
  }

  const customOrigins = env.ADDITIONAL_ALLOWED_ORIGINS
    ? env.ADDITIONAL_ALLOWED_ORIGINS.split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const allowedOrigins = [
    env.CLIENT_WEB_URL,
    env.CLIENT_MERCHANT_URL,
    ...customOrigins,
  ].filter(Boolean);

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  return false;
}
