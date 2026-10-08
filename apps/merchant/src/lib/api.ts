import { ApiResponse, ApiSuccessResponse } from '@repo/shared-types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');

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

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
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

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      method: 'PUT',
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

export const catalogApi = {
  getStoreCatalog: (storeId: string) =>
    api.get<any>(`/catalog/store/${storeId}`),

  createProduct: (productData: unknown) =>
    api.post<any>('/catalog/products', productData),

  updateProduct: (productId: string, updates: unknown) =>
    api.patch<any>(`/catalog/products/${productId}`, updates),

  updateStock: (productId: string, stock: number) =>
    api.patch<any>(`/catalog/products/${productId}/stock`, { stock }),

  deleteProduct: (productId: string) =>
    api.delete<any>(`/catalog/products/${productId}`),
};

export const storesApi = {
  getMyStore: () =>
    api.get<any>('/stores/me'),

  updateStoreSettings: (storeId: string, data: unknown) =>
    api.patch<any>(`/stores/${storeId}`, data),

  toggleOnlineStatus: (storeId: string, isOpen: boolean) =>
    api.patch<any>(`/stores/${storeId}/status`, { isOpen }),
};

export const notificationsApi = {
  getNotifications: () =>
    api.get<any[]>('/notifications'),

  markAsRead: (id: string) =>
    api.patch<any>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.post<any>('/notifications/read-all'),
};

export const billingApi = {
  getInvoices: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<any>(`/billing/invoices${qs}`);
  },

  createInvoice: (data: unknown, idempotencyKey?: string) =>
    api.post<any>('/billing/invoices', data, {
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
    }),

  getInvoiceById: (id: string) =>
    api.get<any>(`/billing/invoices/${id}`),

  recordPayment: (id: string, data: unknown, expectedVersion?: number) => {
    const qs = expectedVersion ? `?expectedVersion=${expectedVersion}` : '';
    return api.patch<any>(`/billing/invoices/${id}/payment${qs}`, data);
  },

  cancelInvoice: (id: string, expectedVersion?: number) => {
    const qs = expectedVersion ? `?expectedVersion=${expectedVersion}` : '';
    return api.patch<any>(`/billing/invoices/${id}/cancel${qs}`);
  },

  getQuotes: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<any>(`/billing/quotes${qs}`);
  },

  createQuote: (data: unknown) =>
    api.post<any>('/billing/quotes', data),

  convertQuoteToInvoice: (id: string) =>
    api.post<any>(`/billing/quotes/${id}/convert`),

  getSettings: () =>
    api.get<any>('/billing/settings'),

  updateSettings: (data: unknown, expectedVersion?: number) => {
    const qs = expectedVersion ? `?expectedVersion=${expectedVersion}` : '';
    return api.put<any>(`/billing/settings${qs}`, data);
  },
};
