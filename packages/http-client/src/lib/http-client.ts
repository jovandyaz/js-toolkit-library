import axios, { AxiosInstance } from 'axios';
import { HttpClientConfig, HttpRequestConfig, IHttpClient } from './types';
import {
  createAuthInterceptor,
  createRefreshTokenInterceptor,
  createRetryInterceptor,
  createResponseNormalizer,
} from './interceptors';

/**
 * Creates and configures an HTTP client with Axios
 * @param config - Configuration options for the HTTP client
 * @returns A fully configured HTTP client instance
 */
export function createHttpClient(config: HttpClientConfig = {}): IHttpClient {
  const instance: AxiosInstance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 30000,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });
  if (config.authTokenProvider) {
    instance.interceptors.request.use(
      createAuthInterceptor(config.authTokenProvider)
    );
    if (config.authTokenProvider.refreshToken) {
      instance.interceptors.response.use(
        undefined,
        createRefreshTokenInterceptor(config.authTokenProvider)
      );
    }
  }

  if (config.defaultRetryCount && config.defaultRetryCount > 0) {
    instance.interceptors.response.use(undefined, createRetryInterceptor());
  }
  if (config.requestInterceptors) {
    config.requestInterceptors.forEach((interceptor) => {
      instance.interceptors.request.use(
        interceptor.onFulfilled,
        interceptor.onRejected
      );
    });
  }

  if (config.responseInterceptors) {
    config.responseInterceptors.forEach((interceptor) => {
      instance.interceptors.response.use(
        interceptor.onFulfilled,
        interceptor.onRejected
      );
    });
  }
  instance.interceptors.response.use(createResponseNormalizer());

  const httpClient: IHttpClient = {
    instance,

    /**
     * Perform GET request
     * @param url - Request URL
     * @param config - Request configuration
     * @returns Promise resolving to the response data
     */
    async get<T = unknown>(
      url: string,
      requestConfig?: HttpRequestConfig
    ): Promise<T> {
      const finalConfig: HttpRequestConfig = {
        ...requestConfig,
        retryCount: requestConfig?.retryCount ?? config.defaultRetryCount,
        retryDelay: requestConfig?.retryDelay ?? config.defaultRetryDelay,
      };
      return instance.get<T, T>(url, finalConfig);
    },

    /**
     * Perform POST request
     * @param url - Request URL
     * @param data - Request payload
     * @param config - Request configuration
     * @returns Promise resolving to the response data
     */
    async post<T = unknown, D = unknown>(
      url: string,
      data?: D,
      requestConfig?: HttpRequestConfig
    ): Promise<T> {
      const finalConfig: HttpRequestConfig = {
        ...requestConfig,
        retryCount: requestConfig?.retryCount ?? config.defaultRetryCount,
        retryDelay: requestConfig?.retryDelay ?? config.defaultRetryDelay,
      };
      return instance.post<T, T, D>(url, data, finalConfig);
    },

    /**
     * Perform PUT request
     * @param url - Request URL
     * @param data - Request payload
     * @param config - Request configuration
     * @returns Promise resolving to the response data
     */
    async put<T = unknown, D = unknown>(
      url: string,
      data?: D,
      requestConfig?: HttpRequestConfig
    ): Promise<T> {
      const finalConfig: HttpRequestConfig = {
        ...requestConfig,
        retryCount: requestConfig?.retryCount ?? config.defaultRetryCount,
        retryDelay: requestConfig?.retryDelay ?? config.defaultRetryDelay,
      };
      return instance.put<T, T, D>(url, data, finalConfig);
    },

    /**
     * Perform PATCH request
     * @param url - Request URL
     * @param data - Request payload
     * @param config - Request configuration
     * @returns Promise resolving to the response data
     */
    async patch<T = unknown, D = unknown>(
      url: string,
      data?: D,
      requestConfig?: HttpRequestConfig
    ): Promise<T> {
      const finalConfig: HttpRequestConfig = {
        ...requestConfig,
        retryCount: requestConfig?.retryCount ?? config.defaultRetryCount,
        retryDelay: requestConfig?.retryDelay ?? config.defaultRetryDelay,
      };
      return instance.patch<T, T, D>(url, data, finalConfig);
    },

    /**
     * Perform DELETE request
     * @param url - Request URL
     * @param config - Request configuration
     * @returns Promise resolving to the response data
     */
    async delete<T = unknown>(
      url: string,
      requestConfig?: HttpRequestConfig
    ): Promise<T> {
      const finalConfig: HttpRequestConfig = {
        ...requestConfig,
        retryCount: requestConfig?.retryCount ?? config.defaultRetryCount,
        retryDelay: requestConfig?.retryDelay ?? config.defaultRetryDelay,
      };
      return instance.delete<T, T>(url, finalConfig);
    },

    /**
     * Perform custom request
     * @param config - Request configuration
     * @returns Promise resolving to the response data
     */
    async request<T = unknown>(requestConfig: HttpRequestConfig): Promise<T> {
      const finalConfig: HttpRequestConfig = {
        ...requestConfig,
        retryCount: requestConfig.retryCount ?? config.defaultRetryCount,
        retryDelay: requestConfig.retryDelay ?? config.defaultRetryDelay,
      };
      return instance.request<T, T>(finalConfig);
    },
  };

  return httpClient;
}
