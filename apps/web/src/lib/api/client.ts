import type { ApiSuccessResponse } from '@repo/shared-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | string[] | undefined>;
}

/**
 * Build URL with query parameters, handling arrays
 */
function buildUrl(path: string, params?: FetchOptions['params']): string {
  const url = new URL(path, API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '') return;
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, v));
      } else {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Core fetch wrapper with typed responses
 */
export async function apiClient<T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiSuccessResponse<T>> {
  const { body, params, headers: customHeaders, ...restOptions } = options;

  const url = buildUrl(path, params);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customHeaders as Record<string, string>),
  };

  const config: RequestInit = {
    ...restOptions,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      success: false,
      error: { code: 'NETWORK_ERROR', message: response.statusText },
    }));
    throw new ApiError(
      response.status,
      errorData?.error?.code || 'UNKNOWN_ERROR',
      errorData?.error?.message || 'An unexpected error occurred',
    );
  }

  const data = await response.json();
  return data as ApiSuccessResponse<T>;
}

/**
 * Convenience methods
 */
export const api = {
  get: <T>(path: string, params?: FetchOptions['params']) =>
    apiClient<T>(path, { method: 'GET', params }),

  post: <T>(path: string, body?: unknown) =>
    apiClient<T>(path, { method: 'POST', body }),

  patch: <T>(path: string, body?: unknown) =>
    apiClient<T>(path, { method: 'PATCH', body }),

  delete: <T>(path: string) =>
    apiClient<T>(path, { method: 'DELETE' }),
};

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
