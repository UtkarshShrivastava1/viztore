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

// Promise-based Singleton Mutex for Safe, Concurrency-Proof Token Refresh
let refreshPromise: Promise<string | null> | null = null;

async function performTokenRefresh(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const json = await res.json().catch(() => null);
    if (res.ok && json?.success && json?.data?.accessToken) {
      const newAccessToken = json.data.accessToken;
      const newRefreshToken = json.data.refreshToken || refreshToken;
      localStorage.setItem('access_token', newAccessToken);
      localStorage.setItem('refresh_token', newRefreshToken);
      return newAccessToken;
    }

    // Only if server explicitly rejected the token as REVOKED or INVALID
    if (
      res.status === 401 &&
      (json?.error?.code === 'SESSION_REVOKED' ||
        json?.error?.code === 'INVALID_REFRESH_TOKEN')
    ) {
      console.warn('Session explicitly revoked by server. Session will require manual login.');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_session');
      localStorage.removeItem('current_store');
      return null;
    }
  } catch (err) {
    // Transient network error / server timeout: DO NOT purge credentials!
    console.warn('Silent token refresh failed due to network / transient issue:', err);
    return null;
  }

  return null;
}

function getRefreshedToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = performTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('access_token');
  const storedStoreRaw = localStorage.getItem('current_store');
  let storeIdHeader: string | undefined;
  if (storedStoreRaw) {
    try {
      const parsed = JSON.parse(storedStoreRaw);
      storeIdHeader = parsed._id || parsed.id;
    } catch {
      // Fallback if local storage item is corrupted or not valid JSON
    }
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(storeIdHeader ? { 'x-store-id': storeIdHeader } : {}),
    ...(options.headers as Record<string, string>),
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized via atomic promise-based refresh mutex
  if (
    response.status === 401 &&
    !cleanEndpoint.includes('/auth/login') &&
    !cleanEndpoint.includes('/auth/refresh-token')
  ) {
    const newToken = await getRefreshedToken();
    if (newToken) {
      const retryHeaders: HeadersInit = {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      };
      response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
        ...options,
        headers: retryHeaders,
      });
    }
  }

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
  createOrder: (orderData: unknown) =>
    api.post<any>('/orders', orderData),

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
    api.get<any>(`/catalog/stores/${storeId}/products`),

  createProduct: (productData: unknown) =>
    api.post<any>('/catalog/products', productData),

  bulkCreateProducts: (storeId: string, products: unknown[]) =>
    api.post<{ created: number; errors: any[] }>('/catalog/products/bulk', { storeId, products }),

  updateProduct: (productId: string, updates: unknown) =>
    api.patch<any>(`/catalog/products/${productId}`, updates),

  updateStock: (productId: string, stock: number) =>
    api.patch<any>(`/catalog/products/${productId}/stock`, { stock }),

  deleteProduct: (productId: string) =>
    api.delete<any>(`/catalog/products/${productId}`),

  bulkDeleteProducts: (productIds: string[]) =>
    api.post<{ deletedCount: number }>('/catalog/products/bulk-delete', { productIds }),

  getTaxonomyCategories: () =>
    api.get<Array<{ name: string; subcategoryCount: number; productTypeCount: number }>>('/catalog/taxonomy/categories'),

  getTaxonomySubcategories: (category: string) =>
    api.get<Array<{ name: string; productTypeCount: number }>>(`/catalog/taxonomy/subcategories?category=${encodeURIComponent(category)}`),

  getTaxonomyProductTypes: (category: string, subCategory: string) =>
    api.get<string[]>(`/catalog/taxonomy/product-types?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(subCategory)}`),

  getTaxonomyAttributes: (productType: string, category?: string) => {
    const qs = category ? `&category=${encodeURIComponent(category)}` : '';
    return api.get<any>(`/catalog/taxonomy/attributes?productType=${encodeURIComponent(productType)}${qs}`);
  },

  lookupHSN: (category: string, subcategory?: string, productType?: string) => {
    const params = new URLSearchParams({ category, subcategory: subcategory || '', productType: productType || '' });
    return api.get<any>(`/catalog/taxonomy/hsn-lookup?${params.toString()}`);
  },

  searchTaxonomy: (query: string) =>
    api.get<any[]>(`/catalog/taxonomy/search?q=${encodeURIComponent(query)}`),
};

export const storesApi = {
  getMyStore: () =>
    api.get<any>('/stores/me'),

  getStoreSettings: (storeId: string) =>
    api.get<any>(`/stores/${storeId}/settings`),

  updateStoreSettings: (storeId: string, data: unknown) =>
    api.patch<any>(`/stores/${storeId}/settings`, data),

  updateStoreStatus: (storeId: string, isActive: boolean) =>
    api.patch<any>(`/stores/${storeId}`, { isActive, isOpen: isActive }),

  toggleOnlineStatus: (storeId: string, isOpen: boolean) =>
    api.patch<any>(`/stores/${storeId}`, { isActive: isOpen, isOpen }),

  verifyGstin: (gstin: string) =>
    api.post<any>('/stores/onboarding/verify-gstin', { gstin }),

  verifyPan: (pan: string) =>
    api.post<any>('/stores/onboarding/verify-pan', { pan }),
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

  createPOSSale: (data: unknown, idempotencyKey?: string) =>
    api.post<any>('/billing/pos/sale', data, {
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
    }),

  getLastReceipt: (paperSize?: string) => {
    const qs = paperSize ? `?paperSize=${paperSize}` : '';
    return api.get<any>(`/billing/pos/last-receipt${qs}`);
  },
};

export const expensesApi = {
  getOverview: () =>
    api.get<any>('/expenses/overview'),

  getAllTransactions: () =>
    api.get<any[]>('/expenses/transactions'),

  getExpenses: () =>
    api.get<any[]>('/expenses'),

  createExpense: (data: unknown) =>
    api.post<any>('/expenses', data),

  deleteExpense: (id: string) =>
    api.delete<any>(`/expenses/${id}`),

  getVendors: () =>
    api.get<any[]>('/expenses/vendors'),

  createVendor: (data: unknown) =>
    api.post<any>('/expenses/vendors', data),

  getPurchases: (type?: string) => {
    const qs = type ? `?type=${encodeURIComponent(type)}` : '';
    return api.get<any[]>(`/expenses/purchases${qs}`);
  },

  createPurchase: (data: unknown) =>
    api.post<any>('/expenses/purchases', data),

  receivePurchase: (id: string) =>
    api.post<any>('/expenses/purchases/' + id + '/receive'),

  getCreditNotes: () =>
    api.get<any[]>('/expenses/credit-notes'),

  createCreditNote: (data: unknown) =>
    api.post<any>('/expenses/credit-notes', data),

  getEWayBills: () =>
    api.get<any[]>('/expenses/eway-bills'),

  createEWayBill: (data: unknown) =>
    api.post<any>('/expenses/eway-bills', data),
};

export const couponsApi = {
  getCoupons: () => api.get<any[]>('/coupons'),
  createCoupon: (data: unknown) => api.post<any>('/coupons', data),
  deleteCoupon: (id: string) => api.delete<any>(`/coupons/${id}`),
};

export const mediaApi = {
  uploadImage: async (file: File, folder = 'products') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return api.post<{
      url: string;
      publicId: string;
      format: string;
      width: number;
      height: number;
      bytes: number;
    }>('/media/upload', formData);
  },

  uploadMultipleImages: async (files: File[], folder = 'products') => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    formData.append('folder', folder);
    return api.post<
      Array<{
        url: string;
        publicId: string;
        format: string;
        width: number;
        height: number;
        bytes: number;
      }>
    >('/media/upload-multiple', formData);
  },
};

export const analyticsApi = {
  getOverview: (period: string = '7d') =>
    api.get<any>(`/analytics/overview?period=${encodeURIComponent(period)}`),

  getProfitLoss: (period: string = 'this_month') =>
    api.get<any>(`/analytics/profit-loss?period=${encodeURIComponent(period)}`),

  getProductWise: (period: string = '7d', category?: string) => {
    const qs = category && category !== 'All Categories' ? `&category=${encodeURIComponent(category)}` : '';
    return api.get<any>(`/analytics/products?period=${encodeURIComponent(period)}${qs}`);
  },

  getTotalOrders: (period: string = '7d') =>
    api.get<any>(`/analytics/orders?period=${encodeURIComponent(period)}`),

  getOfflineBilling: (period: string = '7d') =>
    api.get<any>(`/analytics/offline-billing?period=${encodeURIComponent(period)}`),

  getGSTReport: (period: string = 'this_month') =>
    api.get<any>(`/analytics/gst?period=${encodeURIComponent(period)}`),

  getPayouts: (period: string = 'this_month') =>
    api.get<any>(`/analytics/payouts?period=${encodeURIComponent(period)}`),

  getSettlements: (period: string = 'this_month') =>
    api.get<any>(`/analytics/settlements?period=${encodeURIComponent(period)}`),

  getTransactions: (period: string = 'this_month') =>
    api.get<any>(`/analytics/transactions?period=${encodeURIComponent(period)}`),

  downloadReportCsv: async (report: string, period: string = 'this_month') => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/analytics/export?report=${encodeURIComponent(report)}&period=${encodeURIComponent(period)}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error('Failed to download report');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report}_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

export const customersApi = {
  getCustomers: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<any>(`/customers${qs}`);
  },
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<any>(`/customers${qs}`);
  },

  getCustomerById: (id: string) =>
    api.get<any>(`/customers/${id}`),
  getById: (id: string) =>
    api.get<any>(`/customers/${id}`),

  createCustomer: (data: unknown) =>
    api.post<any>('/customers', data),
  create: (data: unknown) =>
    api.post<any>('/customers', data),

  updateCustomer: (id: string, data: unknown) =>
    api.patch<any>(`/customers/${id}`, data),
  update: (id: string, data: unknown) =>
    api.patch<any>(`/customers/${id}`, data),

  deleteCustomer: (id: string) =>
    api.delete<any>(`/customers/${id}`),
  delete: (id: string) =>
    api.delete<any>(`/customers/${id}`),

  adjustCredit: (id: string, data: { amount: number; type: 'add' | 'deduct'; reason: string }) =>
    api.post<any>(`/customers/${id}/credit`, data),
  addCredit: (id: string, data: { amount: number; type: 'add' | 'deduct'; reason: string }) =>
    api.post<any>(`/customers/${id}/credit`, data),

  recordPayment: (id: string, data: { amount: number; paymentMethod: string; notes?: string; referenceNo?: string }) =>
    api.post<any>(`/customers/${id}/payments`, data),
};

export const returnsApi = {
  getReturns: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<any>(`/returns${qs}`);
  },
  getReturnById: (id: string) =>
    api.get<any>(`/returns/${id}`),
  createReturn: (data: unknown) =>
    api.post<any>('/returns', data),
  approveReturn: (id: string, data?: { pickupDate?: string; pickupTime?: string; internalNote?: string }) =>
    api.patch<any>(`/returns/${id}/approve`, data || {}),
  rejectReturn: (id: string, reason: string) =>
    api.patch<any>(`/returns/${id}/reject`, { reason }),
  processRefund: (id: string, data?: { refundAmount?: number; refundMethod?: string; internalNote?: string }) =>
    api.post<any>(`/returns/${id}/refund`, data || {}),
};

export const settlementsApi = {
  getOverview: (storeId?: string) => {
    const url = storeId ? `/settlements/store/${storeId}/overview` : '/settlements/overview';
    return api.get<any>(url);
  },
  getHistory: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<any>(`/settlements${qs}`);
  },
  getById: (id: string) =>
    api.get<any>(`/settlements/${id}`),
  getBankAccount: () =>
    api.get<any>('/settlements/bank-account'),
  saveBankAccount: (data: unknown) =>
    api.post<any>('/settlements/bank-account', data),
  requestPayout: (data: { amount: number; remarks?: string }) =>
    api.post<any>('/settlements/request', data),
};

export const supportApi = {
  getTickets: (params?: Record<string, string | number>) => {
    const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return api.get<{ tickets: any[]; total: number }>(`/support/tickets${qs}`);
  },
  getTicketById: (id: string) =>
    api.get<any>(`/support/tickets/${id}`),
  createTicket: (data: any) =>
    api.post<any>('/support/tickets', data),
  addMessage: (id: string, data: { text: string; attachments?: string[] }) =>
    api.post<any>(`/support/tickets/${id}/messages`, data),
  updateStatus: (id: string, status: string) =>
    api.patch<any>(`/support/tickets/${id}/status`, { status }),
  requestCallback: (data: { contactName: string; phoneNumber: string; preferredTime?: string; topic?: string; notes?: string }) =>
    api.post<any>('/support/callback-requests', data),
};
