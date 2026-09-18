import { ApiResponse, ApiSuccessResponse } from '@repo/shared-types';

const API_BASE_URL = '/api/v1';

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('access_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    error: {
      code: 'NETWORK_ERROR',
      message: 'Failed to parse response from server',
    },
  }));

  if (!response.ok || !json.success) {
    const errorDetail = !json.success ? json.error : { code: 'UNKNOWN_ERROR', message: 'An error occurred' };
    throw new ApiError(
      errorDetail.code,
      errorDetail.message,
      response.status,
      errorDetail.details,
    );
  }

  return (json as ApiSuccessResponse<T>).data;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
};

export const ordersApi = {
  getStoreOrders: (storeId: string) => 
    api.get<any[]>(`/orders/store/${storeId}`),

  getOrderById: (orderId: string) => 
    api.get<any>(`/orders/${orderId}`),

  updateOrderStatus: (orderId: string, status: string, deliveryOtp?: string) =>
    api.patch<any>(`/orders/${orderId}/status`, { status, deliveryOtp }),

  verifyDeliveryOtp: (orderId: string, otp: string) =>
    api.post<any>(`/orders/${orderId}/verify-otp`, { otp }),

  getOrderInvoice: (orderId: string) =>
    api.get<any>(`/orders/${orderId}/invoice`),
};
