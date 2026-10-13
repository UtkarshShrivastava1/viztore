import type { IOrderService } from './order.types.js';
import { orderService } from './index.js';
import { logger } from '../../shared/utils/logger.js';

export interface OrderExpiryWorkerOptions {
  intervalMs?: number;
  timeoutMinutes?: number;
  batchSize?: number;
}

export interface OrderExpiryWorkerStatus {
  isRunning: boolean;
  intervalMs: number;
  timeoutMinutes: number;
  batchSize: number;
  totalProcessed: number;
  totalCancelled: number;
  lastRunAt: Date | null;
  lastRunCancelled: number;
}

export class OrderExpiryWorkerManager {
  private timer: NodeJS.Timeout | null = null;
  private isProcessing = false;
  private isRunning = false;
  private intervalMs = 60000;
  private timeoutMinutes = 30;
  private batchSize = 50;
  private totalProcessed = 0;
  private totalCancelled = 0;
  private lastRunAt: Date | null = null;
  private lastRunCancelled = 0;
  private customService?: IOrderService;

  constructor(service?: IOrderService) {
    this.customService = service;
  }

  private get service(): IOrderService {
    return this.customService || orderService;
  }

  public start(options: OrderExpiryWorkerOptions = {}): void {
    if (this.isRunning) return;

    this.intervalMs = options.intervalMs ?? 60000;
    this.timeoutMinutes = options.timeoutMinutes ?? 30;
    this.batchSize = options.batchSize ?? 50;
    this.isRunning = true;

    logger.info(
      `⚡ [OrderExpiryWorker] Started background worker (interval: ${this.intervalMs}ms, timeout: ${this.timeoutMinutes}m, batchSize: ${this.batchSize})`,
    );

    this.timer = setInterval(() => {
      void this.runSweep();
    }, this.intervalMs);

    if (this.timer.unref) {
      this.timer.unref();
    }
  }

  public async runSweep(): Promise<{ processed: number; cancelled: number; failed: number }> {
    if (this.isProcessing) {
      logger.debug('[OrderExpiryWorker] Sweep already in progress, skipping tick');
      return { processed: 0, cancelled: 0, failed: 0 };
    }

    this.isProcessing = true;
    try {
      const result = await this.service.autoCancelStaleOrders(
        this.timeoutMinutes,
        this.batchSize,
      );
      this.lastRunAt = new Date();
      this.lastRunCancelled = result.cancelled;
      this.totalProcessed += result.processed;
      this.totalCancelled += result.cancelled;

      if (result.cancelled > 0) {
        logger.info(
          `⏰ [OrderExpiryWorker] Auto-cancelled ${result.cancelled} stale pending order(s) and restored inventory`,
        );
      }
      return result;
    } catch (err: unknown) {
      logger.error('[OrderExpiryWorker] Error during order expiry sweep:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return { processed: 0, cancelled: 0, failed: 1 };
    } finally {
      this.isProcessing = false;
    }
  }

  public async stop(): Promise<void> {
    if (!this.isRunning) return;

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;

    // Await active processing if any
    let attempts = 0;
    while (this.isProcessing && attempts < 20) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      attempts++;
    }

    logger.info('[OrderExpiryWorker] Stopped background order expiry worker');
  }

  public getStatus(): OrderExpiryWorkerStatus {
    return {
      isRunning: this.isRunning,
      intervalMs: this.intervalMs,
      timeoutMinutes: this.timeoutMinutes,
      batchSize: this.batchSize,
      totalProcessed: this.totalProcessed,
      totalCancelled: this.totalCancelled,
      lastRunAt: this.lastRunAt,
      lastRunCancelled: this.lastRunCancelled,
    };
  }
}

export const orderExpiryWorker = new OrderExpiryWorkerManager();

export function startOrderExpiryWorker(options?: OrderExpiryWorkerOptions): void {
  orderExpiryWorker.start(options);
}

export async function stopOrderExpiryWorker(): Promise<void> {
  await orderExpiryWorker.stop();
}

export function getOrderExpiryWorkerStatus(): OrderExpiryWorkerStatus {
  return orderExpiryWorker.getStatus();
}
