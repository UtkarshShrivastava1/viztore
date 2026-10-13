import { processPendingOutboxEvents } from './outbox.service.js';
import { logger } from '../utils/logger.js';

export interface OutboxWorkerOptions {
  intervalMs?: number;
  batchSize?: number;
}

export interface OutboxWorkerStatus {
  isRunning: boolean;
  intervalMs: number;
  batchSize: number;
  totalDispatched: number;
  lastRunAt: Date | null;
  lastRunDispatched: number;
}

class OutboxWorkerManager {
  private timer: NodeJS.Timeout | null = null;
  private isProcessing = false;
  private isRunning = false;
  private intervalMs = 5000;
  private batchSize = 25;
  private totalDispatched = 0;
  private lastRunAt: Date | null = null;
  private lastRunDispatched = 0;

  public start(options: OutboxWorkerOptions = {}): void {
    if (this.isRunning) return;

    this.intervalMs = options.intervalMs ?? 5000;
    this.batchSize = options.batchSize ?? 25;
    this.isRunning = true;

    logger.info(`⚡ [OutboxWorker] Started background worker (interval: ${this.intervalMs}ms, batchSize: ${this.batchSize})`);

    this.timer = setInterval(() => {
      void this.runSweep();
    }, this.intervalMs);

    if (this.timer.unref) {
      this.timer.unref();
    }
  }

  public async runSweep(): Promise<number> {
    if (this.isProcessing) {
      logger.debug('[OutboxWorker] Sweep already in progress, skipping tick');
      return 0;
    }

    this.isProcessing = true;
    try {
      const dispatched = await processPendingOutboxEvents(this.batchSize);
      this.lastRunAt = new Date();
      this.lastRunDispatched = dispatched;
      this.totalDispatched += dispatched;

      if (dispatched > 0) {
        logger.info(`📦 [OutboxWorker] Dispatched ${dispatched} pending outbox domain event(s)`);
      }
      return dispatched;
    } catch (err: unknown) {
      logger.error('[OutboxWorker] Error during outbox sweep:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return 0;
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

    logger.info('[OutboxWorker] Stopped background outbox worker');
  }

  public getStatus(): OutboxWorkerStatus {
    return {
      isRunning: this.isRunning,
      intervalMs: this.intervalMs,
      batchSize: this.batchSize,
      totalDispatched: this.totalDispatched,
      lastRunAt: this.lastRunAt,
      lastRunDispatched: this.lastRunDispatched,
    };
  }
}

export const outboxWorker = new OutboxWorkerManager();

export function startOutboxWorker(options?: OutboxWorkerOptions): void {
  outboxWorker.start(options);
}

export async function stopOutboxWorker(): Promise<void> {
  await outboxWorker.stop();
}

export async function triggerOutboxSweep(): Promise<number> {
  return await outboxWorker.runSweep();
}

export function getOutboxWorkerStatus(): OutboxWorkerStatus {
  return outboxWorker.getStatus();
}
