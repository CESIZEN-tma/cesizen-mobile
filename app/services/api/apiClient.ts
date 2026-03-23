import Constants from 'expo-constants';
import secureStoreService from '../secureStore.service';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';
const API_KEY = Constants.expoConfig?.extra?.apiKey || 'API_KEY';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = await secureStoreService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('NO_REFRESH_TOKEN');
    }

    const response = await fetch(`${API_BASE_URL}/user/refresh-token`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('REFRESH_FAILED');
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;

    await secureStoreService.saveToken(newAccessToken);

    return newAccessToken;
  } catch (error) {
    await secureStoreService.logout();
    return null;
  }
}

async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const token = await secureStoreService.getToken();

  const headers: Record<string, string> = {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const isPublicEndpoint = url.includes('/login') || url.includes('/register') || url.includes('/forgot-password') || url.includes('/reset-password');

  if (response.status === 401 && !isPublicEndpoint) {
    if (!isRefreshing) {
      isRefreshing = true;

      const newToken = await refreshAccessToken();

      isRefreshing = false;

      if (newToken) {
        onTokenRefreshed(newToken);

        return fetchWithAuth(url, options);
      } else {
        throw new ApiError(401, 'Session expired. Please login again.');
      }
    } else {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token: string) => {
          resolve(fetchWithAuth(url, options));
        });
      });
    }
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    let errorDetails = null;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      errorDetails = errorData;
    } catch (e) {
      // Response is not JSON
    }

    console.error(`API Error [${response.status}] ${url}:`, errorDetails || errorMessage);
    throw new ApiError(response.status, errorMessage, errorDetails);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const apiClient = {
  get: (endpoint: string) => {
    return fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
    });
  },

  post: (endpoint: string, data?: any) => {
    return fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put: (endpoint: string, data?: any) => {
    return fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete: (endpoint: string) => {
    return fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
  },
};
