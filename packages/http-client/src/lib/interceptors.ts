import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  AuthTokenProvider,
  HttpError,
  HttpRequestConfig,
  isHttpError,
} from './types';

/**
 * Creates an authentication request interceptor
 * @param authTokenProvider - Provider for authentication tokens
 */
export const createAuthInterceptor = (authTokenProvider: AuthTokenProvider) => {
  return async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    if ((config as HttpRequestConfig).skipAuthHeader) {
      return config;
    }

    try {
      const token = await authTokenProvider.getToken();

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error('Auth interceptor error:', error);
      return config;
    }
  };
};

/**
 * Creates a response error interceptor with token refresh capability
 * @param authTokenProvider - Provider for authentication tokens
 */
export const createRefreshTokenInterceptor = (
  authTokenProvider: AuthTokenProvider
) => {
  let isRefreshing = false;
  let refreshSubscribers: Array<(token: string) => void> = [];

  const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
  };
  const processRefreshSubscribers = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
  };

  return async (error: HttpError): Promise<unknown> => {
    if (!isHttpError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as HttpRequestConfig;
    if (originalRequest?.skipErrorInterceptor) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      authTokenProvider.refreshToken &&
      authTokenProvider.isTokenExpired?.(error) &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await authTokenProvider.refreshToken();

          if (newToken) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            processRefreshSubscribers(newToken);
            return axios(originalRequest);
          }

          return Promise.reject(error);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  };
};

/**
 * Creates a retry request interceptor
 */
export const createRetryInterceptor = () => {
  return async (error: unknown): Promise<unknown> => {
    if (!isHttpError(error)) {
      return Promise.reject(error);
    }

    const config = error.config as HttpRequestConfig;

    if (!config) {
      return Promise.reject(error);
    }

    const retryCount = config.retryCount || 0;
    const maxRetries = config.retryCount !== undefined ? config.retryCount : 0;
    if (retryCount >= maxRetries) {
      return Promise.reject(error);
    }

    config.retryCount = retryCount + 1;
    const delay = config.retryDelay
      ? config.retryDelay * Math.pow(2, retryCount)
      : 1000;

    await new Promise((resolve) => setTimeout(resolve, delay));
    return axios(config);
  };
};

/**
 * Creates a response data normalizer
 * This removes the need to access response.data in consumer code
 */
export const createResponseNormalizer = () => {
  return <T>(response: AxiosResponse<T>): T => {
    return response.data;
  };
};
