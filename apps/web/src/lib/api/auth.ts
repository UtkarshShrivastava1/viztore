import { api } from './client.js';
import type { IUserProfile } from '@repo/shared-types';

export interface AuthSessionResponse {
  user: IUserProfile;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  /**
   * Register a new customer
   */
  register: async (payload: RegisterPayload): Promise<AuthSessionResponse> => {
    const res = await api.post<AuthSessionResponse>('/auth/register', {
      ...payload,
      role: 'customer',
    });
    return res.data;
  },

  /**
   * Login existing customer
   */
  login: async (payload: LoginPayload): Promise<AuthSessionResponse> => {
    const res = await api.post<AuthSessionResponse>('/auth/login', payload);
    return res.data;
  },

  /**
   * Get current authenticated user profile
   */
  getProfile: async (): Promise<IUserProfile> => {
    const res = await api.get<IUserProfile>('/users/me');
    return res.data;
  },
};
