import type { Request, Response, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { INotificationService } from './notification.types.js';
import {
  queryNotificationsSchema,
  createNotificationSchema,
  markAllReadSchema,
} from './notification.validator.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';
import { AppError } from '../../shared/utils/AppError.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';

export interface NotificationController {
  getNotifications: RequestHandler;
  markAsRead: RequestHandler;
  markAllAsRead: RequestHandler;
  getUnreadSummary: RequestHandler;
  createNotification: RequestHandler;
}

function resolveRecipientId(req: Request): string {
  const user = (req as any).user;
  const userId = user?.sub || user?.userId || user?.id;
  if (!user || !userId) {
    throw AppError.unauthorized('Authentication required to access notifications', 'AUTH_REQUIRED');
  }

  // If merchant requests their store-scoped notifications
  if (user.role === 'merchant') {
    const storeIdParam = req.query.storeId as string | undefined;
    if (storeIdParam) return storeIdParam;
    if (user.storeId) return user.storeId;
  }

  return String(userId);
}

export function createNotificationController(service: INotificationService): NotificationController {
  const getNotifications: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const recipientId = resolveRecipientId(req);
    const query = queryNotificationsSchema.parse(req.query);

    const result = await service.getNotifications(recipientId, query);
    return ApiResponse.success(res, result, 'Notifications retrieved successfully');
  });

  const markAsRead: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const recipientId = resolveRecipientId(req);
    const id = req.params.id as string;

    const notification = await service.markAsRead(id, recipientId);
    return ApiResponse.success(res, notification, 'Notification marked as read');
  });

  const markAllAsRead: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const recipientId = resolveRecipientId(req);
    const { category } = markAllReadSchema.parse(req.body || {});

    const result = await service.markAllAsRead(recipientId, category);
    return ApiResponse.success(res, result, 'All notifications marked as read');
  });

  const getUnreadSummary: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const recipientId = resolveRecipientId(req);
    const summary = await service.getUnreadSummary(recipientId);

    return ApiResponse.success(res, summary, 'Unread notification summary retrieved');
  });

  const createNotification: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const dto = createNotificationSchema.parse(req.body);
    const notification = await service.createNotification(dto);

    return ApiResponse.success(res, notification, 'Notification created successfully', StatusCodes.CREATED);
  });

  return {
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadSummary,
    createNotification,
  };
}
