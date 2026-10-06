import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDeliveryService } from './delivery.service.js';
import {
  DeliveryStatus,
  VehicleType,
  type IDeliveryRepository,
  type DeliveryResponseDto,
} from './delivery.types.js';
import type { IEventBus } from '../../shared/events/eventBus.js';
import type { IOrderFacade } from '../orders/index.js';

describe('DeliveryService Unit Tests', () => {
  let mockRepo: IDeliveryRepository;
  let mockBus: IEventBus;
  let mockOrderFacade: IOrderFacade;

  const sampleDelivery: DeliveryResponseDto = {
    id: 'del-123',
    orderId: 'order-123',
    orderNumber: 'ORD-1001',
    storeId: 'store-1',
    customerId: 'cust-1',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8777, 19.076],
      addressText: 'Store Depot, Mumbai',
    },
    dropoffLocation: {
      type: 'Point',
      coordinates: [72.885, 19.085],
      addressText: 'Bandra West, Mumbai',
    },
    distanceKm: 1.25,
    estimatedMinutes: 20,
    status: DeliveryStatus.PENDING_ASSIGNMENT,
    timeline: [
      {
        status: DeliveryStatus.PENDING_ASSIGNMENT,
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    mockRepo = {
      create: vi.fn().mockResolvedValue(sampleDelivery),
      findByOrderId: vi.fn().mockResolvedValue(sampleDelivery),
      findById: vi.fn().mockResolvedValue(sampleDelivery),
      findByStoreId: vi.fn().mockResolvedValue({ data: [sampleDelivery], total: 1 }),
      findByRiderId: vi.fn().mockResolvedValue({ data: [sampleDelivery], total: 1 }),
      assignRider: vi.fn().mockImplementation((orderId, rider, mins, msg) => {
        return Promise.resolve({
          ...sampleDelivery,
          status: DeliveryStatus.ASSIGNED,
          rider,
          estimatedMinutes: mins,
          dispatchMessage: msg,
        });
      }),
      updateStatus: vi.fn().mockImplementation((orderId, status, note) => {
        return Promise.resolve({
          ...sampleDelivery,
          status,
        });
      }),
    };

    mockBus = {
      emit: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };

    mockOrderFacade = {
      getOrderById: vi.fn(),
      getOrdersByUserId: vi.fn(),
      markAsDelivered: vi.fn().mockResolvedValue({ id: 'order-123', status: 'DELIVERED' } as any),
      cancelOrder: vi.fn(),
    };
  });

  it('should calculate distance and ETA accurately using geospatial coordinates', () => {
    const service = createDeliveryService(mockRepo, mockBus, mockOrderFacade);
    const pickup: [number, number] = [72.8777, 19.076];
    const dropoff: [number, number] = [72.885, 19.085];

    const result = service.calculateEta(pickup, dropoff);

    expect(result.distanceKm).toBeGreaterThan(0);
    expect(result.estimatedMinutes).toBeGreaterThanOrEqual(15);
  });

  it('should assign a delivery rider and emit DELIVERY_ASSIGNED domain event', async () => {
    const service = createDeliveryService(mockRepo, mockBus, mockOrderFacade);

    const riderData = {
      id: 'rider-42',
      name: 'Rahul Sharma',
      phone: '9876543210',
      vehicleType: VehicleType.MOTORCYCLE,
      vehicleNumber: 'MH-02-AB-1234',
    };

    const result = await service.assignRider('order-123', {
      rider: riderData,
      estimatedMinutes: 25,
    });

    expect(result?.status).toBe(DeliveryStatus.ASSIGNED);
    expect(result?.rider?.name).toBe('Rahul Sharma');
    expect(result?.dispatchMessage).toContain('NEW DELIVERY ASSIGNMENT');
    expect(mockBus.emit).toHaveBeenCalledWith(
      'delivery.assigned',
      expect.objectContaining({
        orderId: 'order-123',
        riderId: 'rider-42',
        estimatedMinutes: 25,
        riderName: 'Rahul Sharma',
        riderPhone: '9876543210',
      }),
    );
  });

  it('should reject invalid delivery state transitions', async () => {
    const service = createDeliveryService(mockRepo, mockBus, mockOrderFacade);

    // current is PENDING_ASSIGNMENT; directly transitioning to DELIVERED is forbidden
    await expect(
      service.updateStatus('order-123', {
        status: DeliveryStatus.DELIVERED,
        deliveryOtp: '1234',
      }),
    ).rejects.toThrow('Invalid delivery transition');
  });

  it('should require 4-digit OTP to transition status to DELIVERED', async () => {
    // Current is ARRIVED
    mockRepo.findByOrderId = vi.fn().mockResolvedValue({
      ...sampleDelivery,
      status: DeliveryStatus.ARRIVED,
    });

    const service = createDeliveryService(mockRepo, mockBus, mockOrderFacade);

    await expect(
      service.updateStatus('order-123', {
        status: DeliveryStatus.DELIVERED,
      }),
    ).rejects.toThrow('4-digit Delivery OTP is required');
  });

  it('should verify OTP and emit DELIVERY_COMPLETED event on handoff', async () => {
    mockRepo.findByOrderId = vi.fn().mockResolvedValue({
      ...sampleDelivery,
      status: DeliveryStatus.ARRIVED,
    });

    const service = createDeliveryService(mockRepo, mockBus, mockOrderFacade);

    const result = await service.updateStatus('order-123', {
      status: DeliveryStatus.DELIVERED,
      deliveryOtp: '4821',
    });

    expect(result?.status).toBe(DeliveryStatus.DELIVERED);
    expect(mockOrderFacade.markAsDelivered).toHaveBeenCalledWith('order-123', '4821');
    expect(mockBus.emit).toHaveBeenCalledWith('delivery.completed', expect.objectContaining({
      orderId: 'order-123',
      newStatus: DeliveryStatus.DELIVERED,
    }));
  });
});
