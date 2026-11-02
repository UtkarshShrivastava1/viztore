import { describe, it, expect, vi } from 'vitest';
import { createOrderRepository } from '../order.repository.js';
import { OrderStatus, type CreateOrderDTO, type OrderDocument } from '../order.types.js';

describe('OrderRepository (Clean Architecture Repository Unit Tests)', () => {
  const baseDto: CreateOrderDTO & { userId: string } = {
    userId: 'user-999',
    storeId: 'store-888',
    items: [
      { productId: 'p1', sku: 'S1', name: 'Almonds', quantity: 2, unitPrice: 100, storeId: 'store-888' },
    ],
    shippingAddress: {
      fullName: 'Vikram Seth',
      street: '12 Residency Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560025',
      country: 'IN',
      phone: '9876543210',
    },
  };

  it('calculates subtotal, 5% tax, standard shipping fee, and sets 4-digit OTP', async () => {
    const fakeModel: any = {
      create: vi.fn().mockImplementation(async (payload) => ({
        ...payload,
        _id: '507f1f77bcf86cd799439011',
        toObject: () => ({
          ...payload,
          _id: '507f1f77bcf86cd799439011',
        }),
      })),
    };

    const repo = createOrderRepository(fakeModel);
    const order = await repo.create(baseDto);

    expect(order.subtotal).toBe(200); // 2 * 100
    expect(order.tax).toBe(10); // 5% of 200
    expect(order.shippingFee).toBe(49); // < 499 threshold
    expect(order.grandTotal).toBe(259); // 200 + 10 + 49
    expect(order.orderNumber).toMatch(/^ORD-\d{8}-[A-F0-9]{6}$/);
    expect(order.deliveryOtp).toMatch(/^\d{4}$/);
    expect(order.status).toBe(OrderStatus.PENDING);
  });

  it('applies free shipping for orders >= ₹499', async () => {
    const fakeModel: any = {
      create: vi.fn().mockImplementation(async (payload) => ({
        ...payload,
        _id: '507f1f77bcf86cd799439011',
        toObject: () => ({
          ...payload,
          _id: '507f1f77bcf86cd799439011',
        }),
      })),
    };

    const repo = createOrderRepository(fakeModel);
    const order = await repo.create({
      ...baseDto,
      items: [
        { productId: 'p1', sku: 'S1', name: 'Premium Cashews', quantity: 1, unitPrice: 600, storeId: 'store-888' },
      ],
    });

    expect(order.subtotal).toBe(600);
    expect(order.shippingFee).toBe(0);
    expect(order.grandTotal).toBe(630); // 600 + 30 (5% tax) + 0 shipping
  });

  it('updateStatus sets deliveredAt timestamp when status is DELIVERED', async () => {
    const updateImpl = async (_idOrQuery: any, update: any) => ({
      _id: '507f1f77bcf86cd799439011',
      orderNumber: 'ORD-12345678-ABCDEF',
      userId: 'user-999',
      storeId: 'store-888',
      items: [],
      shippingAddress: baseDto.shippingAddress,
      subtotal: 100,
      tax: 5,
      shippingFee: 49,
      grandTotal: 154,
      status: update.$set.status,
      deliveredAt: update.$set.deliveredAt,
      deliveryOtp: '4821',
      toObject() {
        return this;
      },
    });

    const fakeModel: any = {
      findByIdAndUpdate: vi.fn().mockImplementation(updateImpl),
      findOneAndUpdate: vi.fn().mockImplementation(updateImpl),
    };

    const repo = createOrderRepository(fakeModel);
    const updated = await repo.updateStatus('507f1f77bcf86cd799439011', OrderStatus.DELIVERED);

    expect(updated?.status).toBe(OrderStatus.DELIVERED);
    expect(updated?.deliveredAt).toBeInstanceOf(Date);
  });
});
