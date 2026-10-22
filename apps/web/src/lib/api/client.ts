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
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  const url = new URL(cleanPath, baseUrl);

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

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

/**
 * Get active auth tokens from localStorage or zustand persisted storage
 */
function getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null };
  }

  let accessToken = localStorage.getItem('token');
  let refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    try {
      const persisted = localStorage.getItem('customer-auth-storage');
      if (persisted) {
        const parsed = JSON.parse(persisted);
        if (!accessToken && parsed?.state?.token) {
          accessToken = parsed.state.token;
        }
        if (!refreshToken && parsed?.state?.refreshToken) {
          refreshToken = parsed.state.refreshToken;
        }
      }
    } catch {
      // ignore JSON parse errors
    }
  }

  return { accessToken, refreshToken };
}

/**
 * Perform silent token refresh against backend /auth/refresh-token
 */
async function performTokenRefresh(): Promise<string | null> {
  const { refreshToken } = getStoredTokens();
  if (!refreshToken) return null;

  try {
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const res = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const json = await res.json().catch(() => null);
    if (res.ok && json?.success && json?.data?.accessToken) {
      const newAccessToken = json.data.accessToken;
      const newRefreshToken = json.data.refreshToken || refreshToken;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        try {
          const persisted = localStorage.getItem('customer-auth-storage');
          if (persisted) {
            const parsed = JSON.parse(persisted);
            parsed.state = {
              ...parsed.state,
              token: newAccessToken,
              refreshToken: newRefreshToken,
              isAuthenticated: true,
            };
            localStorage.setItem('customer-auth-storage', JSON.stringify(parsed));
          }
        } catch {
          // ignore storage parse errors
        }
      }

      return newAccessToken;
    }
  } catch (err) {
    console.warn('Customer silent token refresh failed:', err);
  }

  // If refresh failed or was revoked, clear stale tokens
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('customer-auth-storage');
  }
  return null;
}

/**
 * Core fetch wrapper with typed responses and automatic 401 token refresh retry
 */
export async function apiClient<T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiSuccessResponse<T>> {
  const { body, params, headers: customHeaders, ...restOptions } = options;

  const url = buildUrl(path, params);

  const { accessToken: token } = getStoredTokens();

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

  let response = await fetch(url, config);

  // Automatic 401 token refresh & retry
  const isAuthRoute = path.includes('/auth/login') || path.includes('/auth/register') || path.includes('/auth/refresh-token');
  if (response.status === 401 && !isAuthRoute) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await performTokenRefresh();
      isRefreshing = false;

      if (newToken) {
        onRefreshed(newToken);
        const retryHeaders: Record<string, string> = {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(url, { ...config, headers: retryHeaders });
      }
    } else {
      // Wait for ongoing token refresh to complete
      const retryToken = await new Promise<string | null>((resolve) => {
        subscribeTokenRefresh((refreshedToken) => {
          resolve(refreshedToken);
        });
      });

      if (retryToken) {
        const retryHeaders: Record<string, string> = {
          ...headers,
          Authorization: `Bearer ${retryToken}`,
        };
        response = await fetch(url, { ...config, headers: retryHeaders });
      }
    }
  }

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

