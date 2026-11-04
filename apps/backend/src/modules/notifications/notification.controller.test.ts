import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { createNotificationController } from './notification.controller.js';
import type { INotificationService } from './notification.types.js';

describe('NotificationController Unit Tests', () => {
  let mockService: Partial<INotificationService>;
  let controller: ReturnType<typeof createNotificationController>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockService = {
      getNotifications: vi.fn().mockResolvedValue({
        notifications: [
          {
            id: 'notif-1',
            recipientId: 'user-sub-123',
            recipientRole: 'customer',
            category: 'order',
            title: 'Order Placed',
            message: 'Your order was placed',
            data: { orderId: 'ord-1' },
            isRead: false,
            readAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
      }),
      getUnreadSummary: vi.fn().mockResolvedValue({
        unreadCount: 1,
        byCategory: { order: 1, inventory: 0, system: 0, promo: 0 },
      }),
      markAsRead: vi.fn().mockResolvedValue({
        id: 'notif-1',
        isRead: true,
      } as any),
      markAllAsRead: vi.fn().mockResolvedValue(1),
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    controller = createNotificationController(mockService as INotificationService);
  });

  it('should resolve recipientId from req.user.sub (JWT payload) for customer notifications', async () => {
    const mockReq = {
      user: {
        sub: 'user-sub-123',
        role: 'customer',
        email: 'customer@example.com',
      },
      query: {},
    } as unknown as Request;

    await new Promise<void>((resolve, reject) => {
      const next = (err?: any) => (err ? reject(err) : resolve());
      (mockRes.json as any).mockImplementation(() => {
        resolve();
        return mockRes;
      });
      (controller.getNotifications as any)(mockReq, mockRes as Response, next);
    });

    expect(mockService.getNotifications).toHaveBeenCalledWith(
      'user-sub-123',
      expect.objectContaining({ page: 1, limit: 20 }),
    );
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ total: 1 }),
      }),
    );
  });

  it('should resolve recipientId from req.user.userId fallback if present', async () => {
    const mockReq = {
      user: {
        userId: 'custom-user-456',
        role: 'customer',
      },
      query: {},
    } as unknown as Request;

    await new Promise<void>((resolve, reject) => {
      const next = (err?: any) => (err ? reject(err) : resolve());
      (mockRes.json as any).mockImplementation(() => {
        resolve();
        return mockRes;
      });
      (controller.getUnreadSummary as any)(mockReq, mockRes as Response, next);
    });

    expect(mockService.getUnreadSummary).toHaveBeenCalledWith('custom-user-456');
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ unreadCount: 1 }),
      }),
    );
  });

  it('should resolve storeId for merchant role when querying store-scoped notifications', async () => {
    const mockReq = {
      user: {
        sub: 'merchant-user-789',
        role: 'merchant',
        storeId: 'store-scope-abc',
      },
      query: {},
    } as unknown as Request;

    await new Promise<void>((resolve, reject) => {
      const next = (err?: any) => (err ? reject(err) : resolve());
      (mockRes.json as any).mockImplementation(() => {
        resolve();
        return mockRes;
      });
      (controller.getNotifications as any)(mockReq, mockRes as Response, next);
    });

    expect(mockService.getNotifications).toHaveBeenCalledWith(
      'store-scope-abc',
      expect.any(Object),
    );
  });
});

