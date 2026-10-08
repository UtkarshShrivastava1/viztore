import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { getRedisClient, checkRedisHealth } from '../redis/client.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

interface CachedResponse {
  payloadHash: string;
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
}

// In-memory fallback map for environments where Redis is not active
const memoryIdempotencyStore = new Map<string, { data: CachedResponse; expiresAt: number }>();

function cleanupMemoryStore(): void {
  const now = Date.now();
  for (const [key, item] of memoryIdempotencyStore.entries()) {
    if (item.expiresAt <= now) {
      memoryIdempotencyStore.delete(key);
    }
  }
}

/**
 * Idempotency Middleware (Rajesh Pillar 2)
 *
 * Prevents duplicate financial/operational mutations (e.g. Invoices, Orders).
 * Inspects `Idempotency-Key` or `X-Idempotency-Key` header.
 * If cached and hash matches: replays previous response without touching services.
 * If cached and hash mismatches: throws 422 conflict error.
 * If new: captures response and caches with 5-minute TTL.
 */
export function idempotencyMiddleware(options?: { ttlSeconds?: number; required?: boolean }) {
  const ttl = options?.ttlSeconds ?? 300; // 5 minutes default
  const isRequired = options?.required ?? false;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Only apply to state-modifying requests (POST, PATCH, PUT)
    if (!['POST', 'PATCH', 'PUT'].includes(req.method)) {
      return next();
    }

    const idempotencyKey =
      (req.headers['idempotency-key'] as string) ||
      (req.headers['x-idempotency-key'] as string);

    if (!idempotencyKey) {
      if (isRequired) {
        return next(
          AppError.badRequest(
            'Idempotency-Key header is required for this operation',
            'IDEMPOTENCY_KEY_REQUIRED',
          ),
        );
      }
      return next();
    }

    const scopeId =
      (req as any).user?.storeId ||
      (req as any).user?.sub ||
      (req as any).user?.id ||
      'anonymous';
    const operation = `${req.method}:${req.baseUrl}${req.path}`;
    const cacheKey = `idemp:${scopeId}:${operation}:${idempotencyKey}`;

    // Compute deterministic SHA-256 hash of incoming request body
    const incomingHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(req.body ?? {}))
      .digest('hex');

    const redis = getRedisClient();
    let cached: CachedResponse | null = null;

    if (checkRedisHealth() && redis) {
      try {
        const raw = await redis.get(cacheKey);
        if (raw) {
          cached = JSON.parse(raw) as CachedResponse;
        }
      } catch (err) {
        logger.warn(`Idempotency Redis read error: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      cleanupMemoryStore();
      const memItem = memoryIdempotencyStore.get(cacheKey);
      if (memItem && memItem.expiresAt > Date.now()) {
        cached = memItem.data;
      }
    }

    if (cached) {
      if (cached.payloadHash !== incomingHash) {
        return next(
          AppError.conflict(
            'Idempotency-Key was already used with a different request payload',
            'IDEMPOTENCY_KEY_PAYLOAD_MISMATCH',
          ),
        );
      }

      logger.info(`[Idempotency] Replaying cached response for key: ${idempotencyKey}`);
      res.setHeader('X-Idempotent-Replay', 'true');
      res.status(cached.statusCode).json(cached.body);
      return;
    }

    // Intercept response to store upon successful completion
    const originalJson = res.json.bind(res);
    res.json = function (body: unknown): Response {
      // Only cache successful mutations (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const record: CachedResponse = {
          payloadHash: incomingHash,
          statusCode: res.statusCode,
          headers: {},
          body,
        };

        if (checkRedisHealth() && redis) {
          redis
            .set(cacheKey, JSON.stringify(record), 'EX', ttl)
            .catch((err) =>
              logger.warn(`Idempotency Redis write failed: ${err instanceof Error ? err.message : String(err)}`),
            );
        } else {
          memoryIdempotencyStore.set(cacheKey, {
            data: record,
            expiresAt: Date.now() + ttl * 1000,
          });
        }
      }

      return originalJson(body);
    };

    next();
  };
}
