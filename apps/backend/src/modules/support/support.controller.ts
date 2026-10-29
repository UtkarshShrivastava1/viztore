import { Request, Response, RequestHandler } from 'express';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';
import { AppError } from '../../shared/utils/AppError.js';
import * as supportService from './support.service.js';

export const createTicket: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user
    ? {
        userId: req.user.sub,
        role: req.user.role,
        storeId: req.user.storeId,
        name: (req.user as any).name || (req.user as any).fullName,
      }
    : undefined;

  const ticket = await supportService.createTicket(req.body, actor);
  return ApiResponse.created(res, ticket, 'Support ticket created successfully');
});

export const getTickets: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user
    ? {
        userId: req.user.sub,
        role: req.user.role,
        storeId: req.user.storeId,
      }
    : undefined;

  const result = await supportService.getTickets(req.query, actor);
  return ApiResponse.success(res, result);
});

export const getTicketById: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const ticket = await supportService.getTicketById(req.params.id);
  return ApiResponse.success(res, ticket);
});

export const addMessage: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user
    ? {
        userId: req.user.sub,
        role: req.user.role,
        name: (req.user as any).name || (req.user as any).fullName,
      }
    : undefined;

  const ticket = await supportService.addTicketMessage(req.params.id, req.body, actor);
  return ApiResponse.created(res, ticket, 'Message sent successfully');
});

export const updateStatus: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const ticket = await supportService.updateTicketStatus(req.params.id, req.body);
  return ApiResponse.success(res, ticket, 'Ticket status updated');
});

export const createCallbackRequest: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const callback = await supportService.createCallbackRequest(req.body);
  return ApiResponse.created(res, callback, 'Callback request received. Our team will contact you shortly.');
});

