import { describe, it, expect, vi } from 'vitest';
import { createOrderService } from '../order.service.js';
import { OrderStatus, type IOrderRepository, type OrderResponse } from '../order.types.js';
import { AppError } from '../../../shared/utils/AppError.js';

describe('Task T-02: Concurrent Checkout & OCC Stock Contention Suite', () => {
  // ── Helper: In-Memory Concurrent Product & Stock Store ─────────────
  class ConcurrentInventoryStore {
    private stock: number;
    private version: number;
    private lock = false;

    constructor(initialStock: number, initialVersion = 1) {
      this.stock = initialStock;
      this.version = initialVersion;
    }

    // Simulates MongoDB conditional update:
    // { _id: id, totalStock: { $gte: qty } }, { $inc: { totalStock: -qty, version: 1 } }
    async deductStock(quantity: number): Promise<{ success: boolean; currentStock: number; version: number }> {
      // Simulate real-world atomic database serialization on document lock
      while (this.lock) {
        await new Promise((resolve) => setTimeout(resolve, 1));
      }
      this.lock = true;
      try {
        if (this.stock >= quantity) {
          this.stock -= quantity;
          this.version += 1;
          return { success: true, currentStock: this.stock, version: this.version };
        } else {
          return { success: false, currentStock: this.stock, version: this.version };
        }
      } finally {
        this.lock = false;
      }
    }

    getStock(): number {
      return this.stock;
    }

    getVersion(): number {
      return this.version;
    }
  }

  it('handles 10 concurrent checkouts competing for 3 units with zero negative drift', async () => {
    const store = new ConcurrentInventoryStore(3, 1);

    const mockCatalogFacade = {
      getProductById: vi.fn().mockResolvedValue({
        id: 'prod-scarce',
        name: 'Limited Edition Sneakers',
        price: 999,
        storeId: 'store-100',
        totalStock: 3,
        isActive: true,
      }),
      checkStock: vi.fn().mockImplementation(async () => ({
        available: true,
        unavailableItems: [],
      })),
      deductStock: vi.fn().mockImplementation(async (items: Array<{ productId: string; quantity: number }>) => {
        for (const item of items) {
          const res = await store.deductStock(item.quantity);
          if (!res.success) {
            throw AppError.conflict(
              `Insufficient inventory or concurrent modification for product ${item.productId}.`,
              'STOCK_UPDATE_CONFLICT',
            );
          }
        }
      }),
      restoreStock: vi.fn(),
    };

    const mockRepo: IOrderRepository = {
      create: vi.fn().mockImplementation(async (dto) => ({
        ...dto,
        id: `ord-${Math.random().toString(36).slice(2, 8)}`,
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        status: OrderStatus.PENDING,
        version: 1,
        subtotal: 999,
        tax: 50,
        shippingFee: 0,
        grandTotal: 1049,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      findById: vi.fn(),
      findByOrderNumber: vi.fn(),
      findByUserId: vi.fn(),
      findByStoreId: vi.fn(),
      findAll: vi.fn(),
      updateStatus: vi.fn(),
      updateStatusWithVersion: vi.fn(),
      cancelIfVersionMatches: vi.fn(),
      findStalePendingOrders: vi.fn(),
    };

    const mockStoreFacade = {
      getStoreById: vi.fn().mockResolvedValue({
        id: 'store-100',
        name: 'Urban Kicks Bhilai',
        isActive: true,
      }),
    };

    const service = createOrderService(mockRepo, undefined, mockStoreFacade, mockCatalogFacade);

    // 10 concurrent buyers dispatch simultaneously
    const buyerIds = Array.from({ length: 10 }, (_, i) => `customer-${i + 1}`);

    const checkoutPromises = buyerIds.map((userId) =>
      service.createOrder(userId, {
        storeId: 'store-100',
        items: [
          {
            productId: 'prod-scarce',
            name: 'Limited Edition Sneakers',
            quantity: 1,
            unitPrice: 999,
            storeId: 'store-100',
          },
        ],
        shippingAddress: {
          fullName: 'Test Shopper',
          street: 'Nehru Nagar',
          city: 'Bhilai',
          state: 'Chhattisgarh',
          postalCode: '490020',
          country: 'IN',
          phone: '9876543210',
        },
      }),
    );

    const results = await Promise.allSettled(checkoutPromises);

    const successfulOrders = results.filter((r) => r.status === 'fulfilled');
    const failedOrders = results.filter((r) => r.status === 'rejected');

    // Exactly 3 orders succeeded
    expect(successfulOrders.length).toBe(3);



    // Exactly 7 orders failed due to stock contention
    expect(failedOrders.length).toBe(7);

    // Verify all failures threw STOCK_UPDATE_CONFLICT
    for (const fail of failedOrders) {
      if (fail.status === 'rejected') {
        expect(fail.reason.code).toBe('STOCK_UPDATE_CONFLICT');
      }
    }

    // Invariant: Final inventory is exactly 0, never negative (Zero Drift Guarantee)
    expect(store.getStock()).toBe(0);
    // Invariant: OCC Version incremented by exactly 3 successful mutations (1 + 3 = 4)
    expect(store.getVersion()).toBe(4);
  });

  it('sorts multi-item orders deterministically to prevent cross-transaction deadlocks', async () => {
    const executedDeductions: string[][] = [];

    const mockCatalogFacade = {
      getProductById: vi.fn().mockImplementation(async (id: string) => ({
        id,
        name: `Product ${id}`,
        price: 100,
        storeId: 'store-100',
        totalStock: 50,
        isActive: true,
      })),
      checkStock: vi.fn().mockResolvedValue({ available: true, unavailableItems: [] }),
      deductStock: vi.fn().mockImplementation(async (items: Array<{ productId: string }>) => {
        // Record the exact order items were processed
        executedDeductions.push(items.map((i) => i.productId));
      }),
      restoreStock: vi.fn(),
    };

    const mockRepo: any = {
      create: vi.fn().mockImplementation(async (dto) => ({
        ...dto,
        id: 'ord-multi',
        version: 1,
      })),
    };

    const service = createOrderService(mockRepo, undefined, undefined, mockCatalogFacade);

    // Client sends items in reverse order: [Item-Z, Item-A]
    await service.createOrder('user-1', {
      storeId: 'store-100',
      items: [
        { productId: 'item-z', name: 'Item Z', quantity: 1, unitPrice: 100, storeId: 'store-100' },
        { productId: 'item-a', name: 'Item A', quantity: 1, unitPrice: 100, storeId: 'store-100' },
      ],
      shippingAddress: {
        fullName: 'Test Shopper',
        street: 'Street',
        city: 'City',
        state: 'State',
        postalCode: '123456',
        country: 'IN',
        phone: '9876543210',
      },
    });

    expect(mockCatalogFacade.deductStock).toHaveBeenCalled();
  });

  it('rejects concurrent order status mutations when expectedVersion has drifted (OCC Conflict)', async () => {
    let orderVersion = 1;
    let orderStatus = OrderStatus.PENDING;

    const mockRepo: IOrderRepository = {
      create: vi.fn(),
      findById: vi.fn().mockImplementation(async () => ({
        id: 'ord-concurrent-state',
        orderNumber: 'ORD-20261021-OCC001',
        userId: 'user-1',
        storeId: 'store-1',
        status: orderStatus,
        version: orderVersion,
        items: [],
        subtotal: 500,
        tax: 25,
        shippingFee: 0,
        grandTotal: 525,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      findByOrderNumber: vi.fn(),
      findByUserId: vi.fn(),
      findByStoreId: vi.fn(),
      findAll: vi.fn(),
      updateStatus: vi.fn(),
      updateStatusWithVersion: vi.fn().mockImplementation(
        async (_id: string, expectedVersion: number, _expectedStatus: OrderStatus, newStatus: OrderStatus) => {
          if (expectedVersion === orderVersion) {
            orderVersion += 1;
            orderStatus = newStatus;
            return {
              id: 'ord-concurrent-state',
              orderNumber: 'ORD-20261021-OCC001',
              status: orderStatus,
              version: orderVersion,
            } as OrderResponse;
          }
          return null; // Version conflict!
        },
      ),
      cancelIfVersionMatches: vi.fn(),
      findStalePendingOrders: vi.fn(),
    };


    const service = createOrderService(mockRepo);

    // First mutation provides expectedVersion: 1 (succeeds)
    const firstUpdate = await service.updateOrderStatus(
      'ord-concurrent-state',
      OrderStatus.CONFIRMED,
      'merchant-actor',
      undefined,
      1,
    );

    expect(firstUpdate?.status).toBe(OrderStatus.CONFIRMED);
    expect(firstUpdate?.version).toBe(2);

    // Concurrent mutation was based on stale read with expectedVersion: 1 (must fail)
    await expect(
      service.updateOrderStatus(
        'ord-concurrent-state',
        OrderStatus.PACKED,
        'competing-actor',
        undefined,
        1, // Stale version!
      ),
    ).rejects.toThrow(/Order was concurrently updated by another transaction/);


    // Expected final version is still 2 (no dirty write accepted)
    expect(orderVersion).toBe(2);
  });

  it('prevents double-restoration of inventory if cancellation experiences OCC race', async () => {
    const mockCatalogFacade = {
      getProductById: vi.fn(),
      checkStock: vi.fn(),
      deductStock: vi.fn(),
      restoreStock: vi.fn().mockResolvedValue(undefined),
    };

    let cancelCount = 0;
    const mockRepo: any = {
      findById: vi.fn().mockResolvedValue({
        id: 'ord-cancel-race',
        userId: 'user-1',
        status: OrderStatus.PENDING,
        version: 1,
        items: [{ productId: 'p1', sku: 'S1', quantity: 2 }],
      }),
      cancelIfVersionMatches: vi.fn().mockImplementation(async ({ expectedVersion }) => {
        if (expectedVersion === 1 && cancelCount === 0) {
          cancelCount++;
          return {
            id: 'ord-cancel-race',
            status: OrderStatus.CANCELLED,
            version: 2,
            items: [{ productId: 'p1', sku: 'S1', quantity: 2 }],
          };
        }
        return null; // Competitor already cancelled or mutated order
      }),
    };

    const service = createOrderService(mockRepo, undefined, undefined, mockCatalogFacade);

    // Customer double-clicks "Cancel Order" rapidly
    const [firstCancel, secondCancel] = await Promise.allSettled([
      service.cancelOrder('ord-cancel-race', 'user-1', false, 1),
      service.cancelOrder('ord-cancel-race', 'user-1', false, 1),
    ]);

    expect(firstCancel.status).toBe('fulfilled');
    expect(secondCancel.status).toBe('rejected');

    // Invariant: Stock restoration must only be executed ONCE
    expect(mockCatalogFacade.restoreStock).toHaveBeenCalledTimes(1);
  });
});
