import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  outboxWorker,
  startOutboxWorker,
  stopOutboxWorker,
  triggerOutboxSweep,
  getOutboxWorkerStatus,
} from '../outboxWorker.js';
import * as outboxService from '../outbox.service.js';

describe('Transactional Outbox Background Drain Worker (Rajesh Pillar 7)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(async () => {
    await stopOutboxWorker();
    vi.useRealTimers();
  });

  it('1. starts worker and transitions status to isRunning: true', () => {
    startOutboxWorker({ intervalMs: 3000, batchSize: 50 });
    const status = getOutboxWorkerStatus();

    expect(status.isRunning).toBe(true);
    expect(status.intervalMs).toBe(3000);
    expect(status.batchSize).toBe(50);
  });

  it('2. stops worker cleanly and marks isRunning: false', async () => {
    startOutboxWorker({ intervalMs: 2000 });
    expect(getOutboxWorkerStatus().isRunning).toBe(true);

    await stopOutboxWorker();
    expect(getOutboxWorkerStatus().isRunning).toBe(false);
  });

  it('3. executes periodic sweeps on interval ticks', async () => {
    const processSpy = vi.spyOn(outboxService, 'processPendingOutboxEvents').mockResolvedValue(3);

    startOutboxWorker({ intervalMs: 1000, batchSize: 20 });

    expect(processSpy).not.toHaveBeenCalled();

    // Advance 1 second
    await vi.advanceTimersByTimeAsync(1000);
    expect(processSpy).toHaveBeenCalledTimes(1);
    expect(processSpy).toHaveBeenCalledWith(20);

    // Advance another 2 seconds
    await vi.advanceTimersByTimeAsync(2000);
    expect(processSpy).toHaveBeenCalledTimes(3);

    const status = getOutboxWorkerStatus();
    expect(status.totalDispatched).toBe(9);
    expect(status.lastRunDispatched).toBe(3);
    expect(status.lastRunAt).toBeInstanceOf(Date);
  });

  it('4. prevents overlapping sweeps when previous execution is still running', async () => {
    let resolveFirstSweep: (val: number) => void = () => {};
    const firstPromise = new Promise<number>((res) => {
      resolveFirstSweep = res;
    });

    const processSpy = vi.spyOn(outboxService, 'processPendingOutboxEvents')
      .mockReturnValueOnce(firstPromise)
      .mockResolvedValueOnce(2);

    // Trigger first sweep
    const sweep1Promise = triggerOutboxSweep();

    // Trigger second sweep while first is still resolving
    const sweep2Promise = triggerOutboxSweep();
    const sweep2Result = await sweep2Promise;

    expect(sweep2Result).toBe(0); // skipped due to reentrancy guard

    // Resolve first sweep
    resolveFirstSweep(5);
    const sweep1Result = await sweep1Promise;
    expect(sweep1Result).toBe(5);

    expect(processSpy).toHaveBeenCalledTimes(1);
  });

  it('5. catches unexpected exceptions gracefully without crashing', async () => {
    vi.spyOn(outboxService, 'processPendingOutboxEvents').mockRejectedValue(new Error('MongoNetworkTimeout'));

    const count = await triggerOutboxSweep();
    expect(count).toBe(0);
  });
});
