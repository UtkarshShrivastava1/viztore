import { describe, it, expect, vi } from 'vitest';
import { createOrderService } from '../order.service.js';
import { OrderStatus, type IOrderRepository, type OrderResponse } from '../order.types.js';
import type { IEventBus } from '../../../shared/events/eventBus.js';

function buildFakeRepository(): IOrderRepository {
  return {
    create: vi.fn(),
    findById: vi.fn(),
    findByOrderNumber: vi.fn(),
    findByUserId: vi.fn(),
    findByStoreId: vi.fn(),
    findAll: vi.fn(),
    updateStatus: vi.fn(),
  };
}

function buildFakeEventBus(): IEventBus {
  return {
    emit: vi.fn(),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
  };
}

const mockOrder: OrderResponse = {
  id: 'order-123',
  orderNumber: 'ORD-20260903-A1B2C3',
  userId: 'user-123',
  storeId: 'store-456',
  items: [
    { productId: 'p1', sku: 'S1', name: 'Apples', quantity: 2, unitPrice: 50, storeId: 'store-456' },
  ],
  shippingAddress: {
    fullName: 'Rahul Sharma',
    street: '12 Brigade Rd',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'IN',
    phone: '9876543210',
  },
  subtotal: 100,
  tax: 5,
  shippingFee: 49,
  grandTotal: 154,
  status: OrderStatus.PENDING,
  deliveryOtp: '4821',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('OrderService (Enterprise Clean Architecture Unit Tests)', () => {
  it('creates an order through the repository and emits order.placed event', async () => {
    const repo = buildFakeRepository();
    const bus = buildFakeEventBus();
    vi.mocked(repo.create).mockResolvedValue(mockOrder);

    const service = createOrderService(repo, bus);
    const result = await service.createOrder('user-123', {
      storeId: 'store-456',
      items: mockOrder.items,
      shippingAddress: mockOrder.shippingAddress,
    });

    expect(result).toEqual(mockOrder);
    expect(repo.create).toHaveBeenCalled();
    expect(bus.emit).toHaveBeenCalledWith('order.placed', expect.objectContaining({
      orderId: 'order-123',
      orderNumber: 'ORD-20260903-A1B2C3',
      userId: 'user-123',
      storeId: 'store-456',
    }));
  });

  it('enforces single-store cart rule: rejects order with items from different stores', async () => {
    const repo = buildFakeRepository();
    const service = createOrderService(repo);

    await expect(
      service.createOrder('user-123', {
        storeId: 'store-456',
        items: [
          { productId: 'p1', name: 'Item 1', quantity: 1, unitPrice: 50, storeId: 'store-456' },
          { productId: 'p2', name: 'Item 2', quantity: 1, unitPrice: 80, storeId: 'store-DIFFERENT' },
        ],
        shippingAddress: mockOrder.shippingAddress,
      }),
    ).rejects.toThrow(/CART_STORE_MISMATCH|All order items must belong to the specified store/);

    expect(repo.create).not.toHaveBeenCalled();
  });

  it('prevents an invalid state transition (PENDING -> DELIVERED)', async () => {
    const repo = buildFakeRepository();
    vi.mocked(repo.findById).mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.PENDING,
    });

    const service = createOrderService(repo);
    await expect(
      service.updateOrderStatus('order-123', OrderStatus.DELIVERED, 'merchant-1', '4821'),
    ).rejects.toThrow(/Invalid order status transition/);

    expect(repo.updateStatus).not.toHaveBeenCalled();
  });

  it('allows direct transition from PENDING to PACKED (Ready to Ship)', async () => {
    const repo = buildFakeRepository();
    const bus = buildFakeEventBus();
    vi.mocked(repo.findById).mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.PENDING,
    });
    vi.mocked(repo.updateStatus).mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.PACKED,
    });

    const service = createOrderService(repo, bus);
    const result = await service.updateOrderStatus('order-123', OrderStatus.PACKED, 'merchant-1');

    expect(result?.status).toBe(OrderStatus.PACKED);
    expect(repo.updateStatus).toHaveBeenCalledWith('order-123', OrderStatus.PACKED);
    expect(bus.emit).toHaveBeenCalledWith('order.confirmed', expect.objectContaining({
      orderId: 'order-123',
      newStatus: OrderStatus.PACKED,
    }));
  });

  it('verifies 4-digit Delivery OTP before marking as DELIVERED', async () => {
    const repo = buildFakeRepository();
    vi.mocked(repo.findById).mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.SHIPPED,
      deliveryOtp: '4821',
    });

    const service = createOrderService(repo);

    // Wrong OTP throws error
    await expect(
      service.updateOrderStatus('order-123', OrderStatus.DELIVERED, 'rider-1', '9999'),
    ).rejects.toThrow(/Invalid or missing 4-digit delivery OTP/);

    // Correct OTP succeeds
    vi.mocked(repo.updateStatus).mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.DELIVERED,
      deliveredAt: new Date(),
    });

    const delivered = await service.updateOrderStatus('order-123', OrderStatus.DELIVERED, 'rider-1', '4821');
    expect(delivered?.status).toBe(OrderStatus.DELIVERED);
    expect(repo.updateStatus).toHaveBeenCalledWith('order-123', OrderStatus.DELIVERED);
  });

  it('allows order owner to cancel a pending order', async () => {
    const repo = buildFakeRepository();
    vi.mocked(repo.findById).mockResolvedValue(mockOrder);
    vi.mocked(repo.updateStatus).mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.CANCELLED,
    });

    const service = createOrderService(repo);
    const result = await service.cancelOrder('order-123', 'user-123', false);

    expect(result?.status).toBe(OrderStatus.CANCELLED);
    expect(repo.updateStatus).toHaveBeenCalledWith('order-123', OrderStatus.CANCELLED);
  });

  it('rejects access when an unrelated user attempts to view an order', async () => {
    const repo = buildFakeRepository();
    vi.mocked(repo.findById).mockResolvedValue(mockOrder);

    const service = createOrderService(repo);
    await expect(
      service.getOrderById('order-123', 'attacker-user', false),
    ).rejects.toThrow(/You do not have access to this order/);
  });
});
