import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOrderService } from '../order.service.js';
import { OrderStatus, type CreateOrderDTO, type IOrderRepository, type OrderResponse } from '../order.types.js';
import type { ICatalogFacade } from '../../catalog/index.js';
import type { IStoreFacade } from '../../stores/index.js';

describe('Order Reserve / Hold Pipeline Unit Tests (AUDIT-006)', () => {
  let mockRepo: Partial<IOrderRepository>;
  let mockCatalog: Partial<ICatalogFacade>;
  let mockStore: Partial<IStoreFacade>;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      findById: vi.fn(),
      updateStatus: vi.fn(),
      updateStatusWithVersion: vi.fn(),
      cancelIfVersionMatches: vi.fn(),
      findStalePendingOrders: vi.fn(),
    };

    mockCatalog = {
      getProductById: vi.fn().mockResolvedValue({
        id: 'prod-1',
        name: 'Cotton Casual Shirt',
        price: 999,
        isActive: true,
        storeId: 'store-1',
      }),
      checkStock: vi.fn().mockResolvedValue({ available: true }),
      deductStock: vi.fn().mockResolvedValue(true),
      restoreStock: vi.fn().mockResolvedValue(true),
    };

    mockStore = {
      getStoreById: vi.fn().mockResolvedValue({
        id: 'store-1',
        name: 'Fashion Retailer',
        isActive: true,
      }),
    };
  });

  it('1. creates in-store reservation with RES- prefix, 2h hold window, and zero delivery fee', async () => {
    const service = createOrderService(
      mockRepo as IOrderRepository,
      undefined,
      mockStore as IStoreFacade,
      mockCatalog as ICatalogFacade,
    );

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const createdOrder: OrderResponse = {
      id: 'ord-reserve-1',
      orderNumber: 'RES-20261029-A1B2C3',
      reserveCode: 'RES-A1B2C',
      userId: 'user-cust-1',
      storeId: 'store-1',
      items: [
        {
          productId: 'prod-1',
          name: 'Cotton Casual Shirt',
          quantity: 2,
          unitPrice: 999,
          storeId: 'store-1',
        },
      ],
      shippingAddress: {
        fullName: 'Rahul Sharma',
        phone: '9876543210',
        street: 'In-Store Pickup',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        postalCode: '490006',
        country: 'IN',
      },
      subtotal: 1998,
      tax: 99.9,
      shippingFee: 0,
      grandTotal: 2097.9,
      status: OrderStatus.PENDING,
      fulfilmentMode: 'reserve',
      isReserved: true,
      reserveExpiresAt: twoHoursLater,
      deliveryOtp: '4821',
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    vi.mocked(mockRepo.create!).mockResolvedValue(createdOrder);

    const dto: CreateOrderDTO = {
      storeId: 'store-1',
      fulfilmentMode: 'reserve',
      items: [
        {
          productId: 'prod-1',
          name: 'Cotton Casual Shirt',
          quantity: 2,
          unitPrice: 999,
          storeId: 'store-1',
        },
      ],
      shippingAddress: {
        fullName: 'Rahul Sharma',
        phone: '9876543210',
        street: 'In-Store Pickup',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        postalCode: '490006',
        country: 'IN',
      },
    };

    const result = await service.createOrder('user-cust-1', dto);

    expect(result.fulfilmentMode).toBe('reserve');
    expect(result.isReserved).toBe(true);
    expect(result.orderNumber.startsWith('RES-')).toBe(true);
    expect(result.reserveCode?.startsWith('RES-')).toBe(true);
    expect(result.shippingFee).toBe(0);
    const deductCall = vi.mocked(mockCatalog.deductStock!).mock.calls[0];
    expect(deductCall[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ productId: 'prod-1', quantity: 2 }),
      ]),
    );
  });

  it('2. claimReservation transitions active hold to DELIVERED when claimed in-store', async () => {
    const service = createOrderService(
      mockRepo as IOrderRepository,
      undefined,
      mockStore as IStoreFacade,
      mockCatalog as ICatalogFacade,
    );

    const activeReservation: OrderResponse = {
      id: 'ord-reserve-2',
      orderNumber: 'RES-20261029-X9Y8Z7',
      reserveCode: 'RES-X9Y8Z',
      userId: 'user-cust-2',
      storeId: 'store-1',
      items: [
        {
          productId: 'prod-1',
          name: 'Cotton Casual Shirt',
          quantity: 1,
          unitPrice: 999,
          storeId: 'store-1',
        },
      ],
      shippingAddress: {
        fullName: 'Pooja Verma',
        phone: '9876543211',
        street: 'In-Store Hold',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        postalCode: '490006',
        country: 'IN',
      },
      subtotal: 999,
      tax: 49.95,
      shippingFee: 0,
      grandTotal: 1048.95,
      status: OrderStatus.PENDING,
      fulfilmentMode: 'reserve',
      isReserved: true,
      reserveExpiresAt: new Date(Date.now() + 3600000), // expires in 1 hour
      deliveryOtp: '1234',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockRepo.findById!).mockResolvedValue(activeReservation);
    vi.mocked(mockRepo.updateStatusWithVersion!).mockResolvedValue({
      ...activeReservation,
      status: OrderStatus.DELIVERED,
      version: 2,
    });

    const claimed = await service.claimReservation('ord-reserve-2', 'merchant-actor-1');

    expect(claimed.status).toBe(OrderStatus.DELIVERED);
  });

  it('3. claimReservation rejects claiming an already expired reservation', async () => {
    const service = createOrderService(
      mockRepo as IOrderRepository,
      undefined,
      mockStore as IStoreFacade,
      mockCatalog as ICatalogFacade,
    );

    const expiredReservation: OrderResponse = {
      id: 'ord-reserve-expired',
      orderNumber: 'RES-20261029-EXPIRED',
      reserveCode: 'RES-EXPIR',
      userId: 'user-cust-3',
      storeId: 'store-1',
      items: [],
      shippingAddress: {
        fullName: 'Amit Patel',
        phone: '9876543212',
        street: 'In-Store Hold',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        postalCode: '490006',
        country: 'IN',
      },
      subtotal: 500,
      tax: 25,
      shippingFee: 0,
      grandTotal: 525,
      status: OrderStatus.PENDING,
      fulfilmentMode: 'reserve',
      isReserved: true,
      reserveExpiresAt: new Date(Date.now() - 600000), // expired 10 minutes ago
      deliveryOtp: '9999',
      version: 1,
      createdAt: new Date(Date.now() - 7800000),
      updatedAt: new Date(),
    };

    vi.mocked(mockRepo.findById!).mockResolvedValue(expiredReservation);

    await expect(
      service.claimReservation('ord-reserve-expired', 'merchant-actor-1'),
    ).rejects.toThrow('Reservation has expired and can no longer be claimed');
  });

  it('4. releaseReservation cancels hold and restores catalog inventory immediately', async () => {
    const service = createOrderService(
      mockRepo as IOrderRepository,
      undefined,
      mockStore as IStoreFacade,
      mockCatalog as ICatalogFacade,
    );

    const reservationToRelease: OrderResponse = {
      id: 'ord-reserve-rel',
      orderNumber: 'RES-20261029-REL123',
      reserveCode: 'RES-REL12',
      userId: 'user-cust-4',
      storeId: 'store-1',
      items: [
        {
          productId: 'prod-1',
          name: 'Cotton Casual Shirt',
          quantity: 3,
          unitPrice: 999,
          storeId: 'store-1',
        },
      ],
      shippingAddress: {
        fullName: 'Neha Gupta',
        phone: '9876543213',
        street: 'In-Store Hold',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        postalCode: '490006',
        country: 'IN',
      },
      subtotal: 2997,
      tax: 149.85,
      shippingFee: 0,
      grandTotal: 3146.85,
      status: OrderStatus.PENDING,
      fulfilmentMode: 'reserve',
      isReserved: true,
      reserveExpiresAt: new Date(Date.now() + 3600000),
      deliveryOtp: '5678',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockRepo.findById!).mockResolvedValue(reservationToRelease);
    vi.mocked(mockRepo.cancelIfVersionMatches!).mockResolvedValue({
      ...reservationToRelease,
      status: OrderStatus.CANCELLED,
      version: 2,
    });

    const released = await service.releaseReservation(
      'ord-reserve-rel',
      'merchant-actor-1',
      'Customer requested cancellation of in-store hold',
    );

    expect(released.status).toBe(OrderStatus.CANCELLED);
    const restoreCall = vi.mocked(mockCatalog.restoreStock!).mock.calls[0];
    expect(restoreCall[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ productId: 'prod-1', quantity: 3 }),
      ]),
    );
  });
});
