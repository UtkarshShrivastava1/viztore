import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import {
  CANONICAL_INDEX_SPECIFICATIONS,
  ensureIndexes,
  checkIndexHealth,
} from '../indexes.js';

describe('MongoDB Compound Indexes Audit & Boot Verification (Task B-05)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('1. defines canonical specifications for all critical high-velocity models', () => {
    const modelNames = CANONICAL_INDEX_SPECIFICATIONS.map((spec) => spec.modelName);

    expect(modelNames).toContain('Order');
    expect(modelNames).toContain('Product');
    expect(modelNames).toContain('Store');
    expect(modelNames).toContain('Invoice');
    expect(modelNames).toContain('Quote');
    expect(modelNames).toContain('Delivery');
    expect(modelNames).toContain('Outbox');
  });

  it('2. verifies Order model specification enforces the ESR rule', () => {
    const orderSpec = CANONICAL_INDEX_SPECIFICATIONS.find((s) => s.modelName === 'Order');
    expect(orderSpec).toBeDefined();

    const rules = orderSpec!.criticalRules.map((r) => r.fields);
    // Merchant live orders: Equality (storeId, status), Sort (createdAt: -1)
    expect(rules).toContainEqual({ storeId: 1, status: 1, createdAt: -1 });
    // Customer history
    expect(rules).toContainEqual({ userId: 1, createdAt: -1 });
    // Auto-expiry sweep
    expect(rules).toContainEqual({ status: 1, createdAt: 1 });
  });

  it('3. verifies Product model specification enforces filtered catalog queries', () => {
    const productSpec = CANONICAL_INDEX_SPECIFICATIONS.find((s) => s.modelName === 'Product');
    expect(productSpec).toBeDefined();

    const rules = productSpec!.criticalRules.map((r) => r.fields);
    expect(rules).toContainEqual({ storeId: 1, isActive: 1, createdAt: -1 });
    expect(rules).toContainEqual({ isActive: 1, category: 1, storeId: 1 });
  });

  it('4. verifies Store model specification enforces 2dsphere spatial discovery', () => {
    const storeSpec = CANONICAL_INDEX_SPECIFICATIONS.find((s) => s.modelName === 'Store');
    expect(storeSpec).toBeDefined();

    const rules = storeSpec!.criticalRules.map((r) => r.fields);
    expect(rules).toContainEqual({ location: '2dsphere' });
  });

  it('5. executes ensureIndexes() and synchronizes registered models successfully', async () => {
    // Mock registered models in Mongoose
    vi.spyOn(mongoose, 'modelNames').mockReturnValue(['Order', 'Store']);

    const mockOrderListIndexes = vi.fn().mockReturnValue({
      toArray: vi.fn().mockResolvedValue([
        { name: '_id_', key: { _id: 1 } },
        { name: 'storeId_1_status_1_createdAt_-1', key: { storeId: 1, status: 1, createdAt: -1 } },
        { name: 'userId_1_createdAt_-1', key: { userId: 1, createdAt: -1 } },
        { name: 'status_1_createdAt_1', key: { status: 1, createdAt: 1 } },
      ]),
    });

    const mockStoreListIndexes = vi.fn().mockReturnValue({
      toArray: vi.fn().mockResolvedValue([
        { name: '_id_', key: { _id: 1 } },
        { name: 'location_2dsphere', key: { location: '2dsphere' } },
        {
          name: 'approvalStatus_1_isActive_1_category_1',
          key: { approvalStatus: 1, isActive: 1, category: 1 },
        },
      ]),
    });

    const mockOrderModel = {
      collection: {
        name: 'orders',
        listIndexes: mockOrderListIndexes,
      },
      createIndexes: vi.fn().mockResolvedValue(undefined),
    };

    const mockStoreModel = {
      collection: {
        name: 'stores',
        listIndexes: mockStoreListIndexes,
      },
      createIndexes: vi.fn().mockResolvedValue(undefined),
    };

    vi.spyOn(mongoose, 'model').mockImplementation((name: string) => {
      if (name === 'Order') return mockOrderModel as any;
      if (name === 'Store') return mockStoreModel as any;
      throw new Error(`Unexpected model: ${name}`);
    });

    const summary = await ensureIndexes({ verbose: false });

    expect(summary.success).toBe(true);
    expect(summary.totalModelsAudited).toBe(2);
    expect(summary.issues).toHaveLength(0);
    expect(mockOrderModel.createIndexes).toHaveBeenCalledTimes(1);
    expect(mockStoreModel.createIndexes).toHaveBeenCalledTimes(1);

    const health = await checkIndexHealth();
    expect(health.isHealthy).toBe(true);
    expect(health.issues).toHaveLength(0);
  });

  it('6. detects missing compound indexes and flags warning gracefully', async () => {
    vi.spyOn(mongoose, 'modelNames').mockReturnValue(['Order']);

    // Order listIndexes is missing the auto-expiry status_1_createdAt_1 index
    const mockOrderListIndexes = vi.fn().mockReturnValue({
      toArray: vi.fn().mockResolvedValue([
        { name: '_id_', key: { _id: 1 } },
        { name: 'storeId_1_status_1_createdAt_-1', key: { storeId: 1, status: 1, createdAt: -1 } },
      ]),
    });

    const mockOrderModel = {
      collection: {
        name: 'orders',
        listIndexes: mockOrderListIndexes,
      },
      createIndexes: vi.fn().mockResolvedValue(undefined),
    };

    vi.spyOn(mongoose, 'model').mockReturnValue(mockOrderModel as any);

    const summary = await ensureIndexes();

    expect(summary.success).toBe(false);
    expect(summary.issues.length).toBeGreaterThan(0);
    expect(summary.results[0].status).toBe('WARNING');
    expect(summary.results[0].missingRules.length).toBeGreaterThan(0);
  });

  it('7. catches index creation exceptions gracefully without throwing unhandled rejection', async () => {
    vi.spyOn(mongoose, 'modelNames').mockReturnValue(['Order']);

    const mockOrderModel = {
      collection: {
        name: 'orders',
        listIndexes: vi.fn(),
      },
      createIndexes: vi.fn().mockRejectedValue(new Error('Index build collision')),
    };

    vi.spyOn(mongoose, 'model').mockReturnValue(mockOrderModel as any);

    const summary = await ensureIndexes();

    expect(summary.success).toBe(false);
    expect(summary.results[0].status).toBe('FAILED');
    expect(summary.results[0].error).toContain('Index build collision');
  });
});
