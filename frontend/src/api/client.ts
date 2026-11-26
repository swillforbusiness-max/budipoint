import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const AUTH_TOKEN_STORAGE_KEY = 'budipoint_auth_token';
export const AUTH_ROLE_STORAGE_KEY = 'budipoint_active_role';

export interface NormalizedApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Centralized Axios client for all Budipoint REST API communication.
 * All requests flow through this client — no component may call axios or fetch directly.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const status = error.response?.status ?? 500;
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred while communicating with Budipoint API.';

    if (status === 401) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }

    const normalized: NormalizedApiError = {
      status,
      message,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(normalized);
  }
);

export const isMockApiEnabled = (): boolean => {
  return import.meta.env.VITE_USE_MOCK_API !== 'false';
};
