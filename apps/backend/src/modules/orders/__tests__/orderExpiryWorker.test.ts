import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OrderExpiryWorkerManager } from '../orderExpiryWorker.js';
import type { IOrderService } from '../order.types.js';

describe('OrderExpiryWorkerManager Unit Tests (Task B-02)', () => {
  let fakeService: Partial<IOrderService>;

  beforeEach(() => {
    vi.useFakeTimers();
    fakeService = {
      autoCancelStaleOrders: vi.fn().mockResolvedValue({
        processed: 2,
        cancelled: 2,
        failed: 0,
      }),
    };
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('1. starts worker and transitions status to isRunning: true', () => {
    const worker = new OrderExpiryWorkerManager(fakeService as IOrderService);
    expect(worker.getStatus().isRunning).toBe(false);

    worker.start({ intervalMs: 2000, timeoutMinutes: 20, batchSize: 10 });
    const status = worker.getStatus();
    expect(status.isRunning).toBe(true);
    expect(status.intervalMs).toBe(2000);
    expect(status.timeoutMinutes).toBe(20);
    expect(status.batchSize).toBe(10);

    void worker.stop();
  });

  it('2. stops worker cleanly and marks isRunning: false', async () => {
    const worker = new OrderExpiryWorkerManager(fakeService as IOrderService);
    worker.start({ intervalMs: 1000 });
    expect(worker.getStatus().isRunning).toBe(true);

    await worker.stop();
    expect(worker.getStatus().isRunning).toBe(false);
  });

  it('3. executes periodic sweeps on interval ticks', async () => {
    const worker = new OrderExpiryWorkerManager(fakeService as IOrderService);
    worker.start({ intervalMs: 1000, timeoutMinutes: 30, batchSize: 50 });

    expect(fakeService.autoCancelStaleOrders).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);
    expect(fakeService.autoCancelStaleOrders).toHaveBeenCalledTimes(1);
    expect(fakeService.autoCancelStaleOrders).toHaveBeenCalledWith(30, 50);

    await vi.advanceTimersByTimeAsync(2000);
    expect(fakeService.autoCancelStaleOrders).toHaveBeenCalledTimes(3);

    const status = worker.getStatus();
    expect(status.totalProcessed).toBe(6);
    expect(status.totalCancelled).toBe(6);
    expect(status.lastRunCancelled).toBe(2);
    expect(status.lastRunAt).toBeInstanceOf(Date);

    await worker.stop();
  });

  it('4. prevents overlapping sweeps when previous execution is still running', async () => {
    let resolveFirstSweep!: (val: { processed: number; cancelled: number; failed: number }) => void;
    const delayedPromise = new Promise<{ processed: number; cancelled: number; failed: number }>((resolve) => {
      resolveFirstSweep = resolve;
    });

    vi.mocked(fakeService.autoCancelStaleOrders!)
      .mockReturnValueOnce(delayedPromise)
      .mockResolvedValue({ processed: 1, cancelled: 1, failed: 0 });

    const worker = new OrderExpiryWorkerManager(fakeService as IOrderService);

    // Trigger first sweep manually
    const firstSweepPromise = worker.runSweep();

    // Trigger overlapping sweep while first is running
    const secondSweepResult = await worker.runSweep();
    expect(secondSweepResult).toEqual({ processed: 0, cancelled: 0, failed: 0 });

    // Complete first sweep
    resolveFirstSweep({ processed: 3, cancelled: 3, failed: 0 });
    const firstSweepResult = await firstSweepPromise;
    expect(firstSweepResult.cancelled).toBe(3);
  });

  it('5. catches unexpected exceptions gracefully without crashing', async () => {
    vi.mocked(fakeService.autoCancelStaleOrders!).mockRejectedValueOnce(
      new Error('MongoNetworkTimeoutException'),
    );

    const worker = new OrderExpiryWorkerManager(fakeService as IOrderService);
    const result = await worker.runSweep();

    expect(result).toEqual({ processed: 0, cancelled: 0, failed: 1 });
    expect(worker.getStatus().isRunning).toBe(false);
  });
});
