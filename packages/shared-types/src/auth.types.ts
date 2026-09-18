import { z } from 'zod';

export enum UserRole {
  CUSTOMER = 'customer',
  MERCHANT = 'merchant',
  ADMIN = 'admin',
}

export interface IUserAddress {
  _id?: string;
  label: 'Home' | 'Work' | 'Other' | string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
  coordinates?: [number, number]; // [lng, lat]
}

export type IAddress = IUserAddress;

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  addresses: IUserAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface AuthSessionResponse {
  user: Omit<IUser, 'addresses'> & { addresses?: IUserAddress[] };
  tokens: AuthTokens;
}

export interface JwtTokenPayload {
  sub: string; // userId
  role: UserRole;
  email: string;
  phone?: string;
  iat?: number;
  exp?: number;
}

// Zod Validation Schemas
export const registerUserSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number (10 digits starting with 6-9)'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER),
});

export const loginUserSchema = z.object({
  identifier: z.string().min(3, 'Email or phone number is required'), // accepts email or 10-digit phone
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const userAddressSchema = z.object({
  label: z.string().min(1).default('Home'),
  recipientName: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid 10-digit mobile number'),
  street: z.string().min(5).max(250),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid 6-digit PIN code'),
  isDefault: z.boolean().optional(),
  coordinates: z.tuple([z.number(), z.number()]).optional(), // [lng, lat]
});

export const updateAddressSchema = userAddressSchema.partial();

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number').optional(),
  avatarUrl: z.string().url().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
export type UserAddressDto = z.infer<typeof userAddressSchema>;
export type CreateAddressDto = UserAddressDto;
export type UpdateAddressDto = z.infer<typeof updateAddressSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type IUserProfile = IUser;

