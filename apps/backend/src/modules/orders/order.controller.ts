import type { Request, Response, RequestHandler } from 'express';
import type { IOrderService } from './order.types.js';
import type { AuthenticatedRequest } from '../../shared/types/authenticated-request.js';
import {
  createOrderSchema,
  paginationSchema,
  updateOrderStatusSchema,
  verifyOtpSchema,
} from './order.validator.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';
import { AppError } from '../../shared/utils/AppError.js';

function getUserId(req: Request): string | undefined {
  return req.user?.sub || req.user?.id;
}

export function createOrderController(service: IOrderService) {
  const createOrder: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = getUserId(authReq);
    if (!userId) {
      throw AppError.unauthorized('Authentication required to place an order');
    }

    const body = createOrderSchema.parse(req.body);
    const order = await service.createOrder(userId, body, authReq.correlationId);

    return ApiResponse.created(res, order, 'Order created successfully');
  });

  const getOrder: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = getUserId(authReq) || '';
    const isAdminOrMerchant = authReq.user?.role === 'admin' || authReq.user?.role === 'merchant';
    const orderId = req.params.id as string;

    const order = await service.getOrderById(orderId, userId, isAdminOrMerchant);
    if (!order) {
      throw AppError.notFound('Order not found', 'ORDER_NOT_FOUND');
    }

    return ApiResponse.success(res, order, 'Order retrieved successfully');
  });

  const getMyOrders: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = getUserId(authReq);
    if (!userId) {
      throw AppError.unauthorized('Authentication required');
    }

    const { page, limit } = paginationSchema.parse(req.query);
    const result = await service.getOrdersByUserId(userId, page, limit);

    return ApiResponse.success(res, result.data, 'Orders fetched successfully', 200, {
      page: result.pagination.page,
      limit: result.pagination.limit,
      total: result.pagination.total,
      totalPages: Math.ceil(result.pagination.total / result.pagination.limit),
    });
  });

  const getStoreOrders: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const { page, limit } = paginationSchema.parse(req.query);
    const storeId = req.params.storeId as string;
    const result = await service.getOrdersByStoreId(storeId, page, limit);

    return ApiResponse.success(res, result.data, 'Store orders fetched successfully', 200, {
      page: result.pagination.page,
      limit: result.pagination.limit,
      total: result.pagination.total,
      totalPages: Math.ceil(result.pagination.total / result.pagination.limit),
    });
  });

  const getAllOrders: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = await service.getAllOrders(page, limit);

    return ApiResponse.success(res, result.data, 'All orders fetched successfully', 200, {
      page: result.pagination.page,
      limit: result.pagination.limit,
      total: result.pagination.total,
      totalPages: Math.ceil(result.pagination.total / result.pagination.limit),
    });
  });

  const updateStatus: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const actorId = getUserId(authReq) || 'system';
    const orderId = req.params.id as string;

    const { status, deliveryOtp } = updateOrderStatusSchema.parse(req.body);
    const expectedVersion = req.body.expectedVersion ? Number(req.body.expectedVersion) : undefined;
    const order = await service.updateOrderStatus(orderId, status, actorId, deliveryOtp, expectedVersion);

    if (!order) {
      throw AppError.notFound('Order not found', 'ORDER_NOT_FOUND');
    }

    return ApiResponse.success(res, order, 'Order status updated successfully');
  });

  const verifyOtp: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id as string;
    const { otp } = verifyOtpSchema.parse(req.body);
    const isValid = await service.verifyDeliveryOtp(orderId, otp);

    return ApiResponse.success(res, { valid: isValid }, 'OTP verified successfully');
  });

  const cancel: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = getUserId(authReq) || '';
    const isAdmin = authReq.user?.role === 'admin';
    const orderId = req.params.id as string;

    const expectedVersion = req.body.expectedVersion
      ? Number(req.body.expectedVersion)
      : req.query.expectedVersion
        ? Number(req.query.expectedVersion)
        : undefined;

    const order = await service.cancelOrder(orderId, userId, isAdmin, expectedVersion);
    if (!order) {
      throw AppError.notFound('Order not found', 'ORDER_NOT_FOUND');
    }

    return ApiResponse.success(res, order, 'Order cancelled successfully');
  });

  const getInvoice: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = getUserId(authReq) || '';
    const isAdminOrMerchant = authReq.user?.role === 'admin' || authReq.user?.role === 'merchant';
    const orderId = req.params.id as string;

    const invoice = await service.getOrderInvoice(orderId, userId, isAdminOrMerchant);
    return ApiResponse.success(res, invoice, 'Order invoice retrieved successfully');
  });

  return {
    createOrder,
    getOrder,
    getInvoice,
    getMyOrders,
    getStoreOrders,
    getAllOrders,
    updateStatus,
    verifyOtp,
    cancel,
  };
}
