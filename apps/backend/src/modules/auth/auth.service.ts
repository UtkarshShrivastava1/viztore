import jwt from 'jsonwebtoken';
import {
  RegisterUserDto,
  LoginUserDto,
  AuthSessionResponse,
  AuthTokens,
  JwtTokenPayload,
  UserRole,
  IUser,
  IUserAddress,
  UserAddressDto,
  UpdateAddressDto,
  UpdateProfileDto,
} from '@repo/shared-types';
import { UserModel, IUserDocument } from './auth.model.js';
import { env } from '../../shared/config/env.config.js';
import { AppError } from '../../shared/utils/AppError.js';

/**
 * Generate Access and Refresh JWT Tokens
 */
export function generateTokenPair(user: { _id: string; role: UserRole; email: string; phone?: string }): AuthTokens {
  const payload: JwtTokenPayload = {
    sub: user._id.toString(),
    role: user.role,
    email: user.email,
    phone: user.phone,
  };

  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'],
  });

  const refreshToken = jwt.sign({ sub: user._id.toString() }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'],
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60, // 15 mins in seconds
  };
}

/**
 * Register a new User (Customer, Merchant, or Admin)
 */
export async function registerUser(dto: RegisterUserDto): Promise<AuthSessionResponse> {
  const existingEmail = await UserModel.findOne({ email: dto.email.toLowerCase() });
  if (existingEmail) {
    throw AppError.conflict('An account with this email address already exists', 'EMAIL_EXISTS');
  }

  const existingPhone = await UserModel.findOne({ phone: dto.phone });
  if (existingPhone) {
    throw AppError.conflict('An account with this mobile number already exists', 'PHONE_EXISTS');
  }

  const user = new UserModel({
    fullName: dto.fullName,
    email: dto.email.toLowerCase(),
    phone: dto.phone,
    password: dto.password,
    role: dto.role || UserRole.CUSTOMER,
    isVerified: false,
    isActive: true,
  });

  const tokens = generateTokenPair({
    _id: user._id.toString(),
    role: user.role,
    email: user.email,
    phone: user.phone,
  });

  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    user: user.toJSON() as unknown as IUser,
    tokens,
  };
}

/**
 * Authenticate User by email/phone & password
 */
export async function loginUser(dto: LoginUserDto): Promise<AuthSessionResponse> {
  const identifier = dto.identifier.trim();
  const isEmail = identifier.includes('@');

  const query = isEmail ? { email: identifier.toLowerCase() } : { phone: identifier };

  const user = await UserModel.findOne(query).select('+password +refreshToken');
  if (!user) {
    throw AppError.unauthorized('Invalid email/phone or password', 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw AppError.forbidden('This account has been deactivated. Please contact support.', 'ACCOUNT_DEACTIVATED');
  }

  const isMatch = await user.comparePassword(dto.password);
  if (!isMatch) {
    throw AppError.unauthorized('Invalid email/phone or password', 'INVALID_CREDENTIALS');
  }

  const tokens = generateTokenPair({
    _id: user._id.toString(),
    role: user.role,
    email: user.email,
    phone: user.phone,
  });

  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    user: user.toJSON() as unknown as IUser,
    tokens,
  };
}

/**
 * Refresh Access Token using Refresh Token
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string };

    const user = await UserModel.findById(decoded.sub).select('+refreshToken');
    if (!user || !user.isActive) {
      throw AppError.unauthorized('Invalid session. Please login again.', 'INVALID_SESSION');
    }

    if (user.refreshToken !== refreshToken) {
      throw AppError.unauthorized('Session has expired or was revoked. Please login again.', 'SESSION_REVOKED');
    }

    const tokens = generateTokenPair({
      _id: user._id.toString(),
      role: user.role,
      email: user.email,
      phone: user.phone,
    });

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw AppError.unauthorized('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
  }
}

/**
 * Retrieve User Profile
 */
export async function getUserProfile(userId: string): Promise<IUser> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found', 'USER_NOT_FOUND');
  }
  return user.toJSON() as unknown as IUser;
}

/**
 * Update Profile info
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<IUser, 'fullName' | 'avatarUrl' | 'dateOfBirth' | 'gender'>>,
): Promise<IUser> {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw AppError.notFound('User not found', 'USER_NOT_FOUND');
  }

  return user.toJSON() as unknown as IUser;
}

/**
 * Get all Saved Addresses for a User
 */
export async function getAddresses(userId: string): Promise<IUserAddress[]> {
  const user = await UserModel.findById(userId).select('addresses');
  if (!user) {
    throw AppError.notFound('User not found', 'USER_NOT_FOUND');
  }
  return (user.addresses || []) as unknown as IUserAddress[];
}

/**
 * Add a Saved Address
 */
export async function addAddress(userId: string, address: UserAddressDto): Promise<IUser> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found', 'USER_NOT_FOUND');
  }

  if (address.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  } else if (user.addresses.length === 0) {
    // First address automatically becomes default
    address.isDefault = true;
  }

  user.addresses.push(address);
  await user.save();

  return user.toJSON() as unknown as IUser;
}

/**
 * Update an existing Saved Address
 */
export async function updateAddress(
  userId: string,
  addressId: string,
  updates: UpdateAddressDto,
): Promise<IUser> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found', 'USER_NOT_FOUND');
  }

  const address = user.addresses.find((addr) => addr._id?.toString() === addressId);
  if (!address) {
    throw AppError.notFound('Address not found', 'ADDRESS_NOT_FOUND');
  }

  if (updates.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  Object.assign(address, updates);
  await user.save();

  return user.toJSON() as unknown as IUser;
}

/**
 * Set an Address as Default
 */
export async function setDefaultAddress(userId: string, addressId: string): Promise<IUser> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found', 'USER_NOT_FOUND');
  }

  const targetAddress = user.addresses.find((addr) => addr._id?.toString() === addressId);
  if (!targetAddress) {
    throw AppError.notFound('Address not found', 'ADDRESS_NOT_FOUND');
  }

  user.addresses.forEach((addr) => {
    addr.isDefault = addr._id?.toString() === addressId;
  });

  await user.save();
  return user.toJSON() as unknown as IUser;
}

/**
 * Delete a Saved Address
 */
export async function deleteAddress(userId: string, addressId: string): Promise<IUser> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found', 'USER_NOT_FOUND');
  }

  const wasDefault = user.addresses.find((addr) => addr._id?.toString() === addressId)?.isDefault;
  user.addresses = user.addresses.filter((addr) => addr._id?.toString() !== addressId);

  // If deleted address was default, promote first remaining address to default
  const firstRemaining = user.addresses[0];
  if (wasDefault && firstRemaining) {
    firstRemaining.isDefault = true;
  }

  await user.save();

  return user.toJSON() as unknown as IUser;
}

/**
 * Logout User / Revoke Refresh Token
 */
export async function logoutUser(userId: string): Promise<void> {
  await UserModel.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
}

/**
 * Exported service function for inter-module communication (Public Contract)
 */
export async function findUserById(userId: string): Promise<IUser | null> {
  const user = await UserModel.findById(userId).lean();
  return user as unknown as IUser | null;
}
