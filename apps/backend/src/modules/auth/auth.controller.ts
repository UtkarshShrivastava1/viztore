import { Request, Response, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';
import { AppError } from '../../shared/utils/AppError.js';
import * as authService from './auth.service.js';

export const register: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  return ApiResponse.created(res, result, 'Registration successful');
});

export const login: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  return ApiResponse.success(res, result, 'Login successful');
});

export const refreshToken: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const tokens = await authService.refreshAccessToken(req.body.refreshToken);
  return ApiResponse.success(res, tokens, 'Token refreshed successfully');
});

export const getProfile: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  const user = await authService.getUserProfile(req.user.sub);
  return ApiResponse.success(res, user);
});

export const updateProfile: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  const updatedUser = await authService.updateUserProfile(req.user.sub, req.body);
  return ApiResponse.success(res, updatedUser, 'Profile updated successfully');
});

export const getAddresses: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  const addresses = await authService.getAddresses(req.user.sub);
  return ApiResponse.success(res, addresses, 'Addresses retrieved successfully');
});

export const addAddress: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  const updatedUser = await authService.addAddress(req.user.sub, req.body);
  return ApiResponse.created(res, updatedUser, 'Address added successfully');
});

export const updateAddress: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  const { addressId } = req.params;
  if (!addressId) {
    throw AppError.badRequest('Address ID is required');
  }
  const updatedUser = await authService.updateAddress(req.user.sub, addressId, req.body);
  return ApiResponse.success(res, updatedUser, 'Address updated successfully');
});

export const setDefaultAddress: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  const { addressId } = req.params;
  if (!addressId) {
    throw AppError.badRequest('Address ID is required');
  }
  const updatedUser = await authService.setDefaultAddress(req.user.sub, addressId);
  return ApiResponse.success(res, updatedUser, 'Default address set successfully');
});

export const deleteAddress: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  const { addressId } = req.params;
  if (!addressId) {
    throw AppError.badRequest('Address ID is required');
  }
  const updatedUser = await authService.deleteAddress(req.user.sub, addressId);
  return ApiResponse.success(res, updatedUser, 'Address removed successfully');
});

export const logout: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (req.user) {
    await authService.logoutUser(req.user.sub);
  }
  return ApiResponse.success(res, null, 'Logged out successfully');
});
