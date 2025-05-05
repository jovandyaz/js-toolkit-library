import {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';

/**
 * Custom request config extending the Axios request config
 */
export interface HttpRequestConfig extends AxiosRequestConfig {
  retryCount?: number;
  retryDelay?: number;
  skipAuthHeader?: boolean;
  skipErrorInterceptor?: boolean;
  _retry?: boolean;
}

/**
 * HTTP Client response type
 */
export type HttpResponse<T = unknown> = AxiosResponse<T>;

/**
 * HTTP Client error type
 */
export interface HttpError<T = unknown> extends AxiosError<T> {}

/**
 * Type guard to check if an error is an HTTP Error
 */
export function isHttpError(error: unknown): error is HttpError {
  return isAxiosError(error);
}

/**
 * Authentication token provider interface
 */
export interface AuthTokenProvider {
  getToken: () => string | null | Promise<string | null>;
  refreshToken?: () => Promise<string | null>;
  isTokenExpired?: (error: HttpError) => boolean;
}

/**
 * HTTP client configuration options
 */
export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  authTokenProvider?: AuthTokenProvider;
  defaultRetryCount?: number;
  defaultRetryDelay?: number;
  requestInterceptors?: Array<{
    onFulfilled?: (
      config: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
    onRejected?: (error: unknown) => unknown;
  }>;
  responseInterceptors?: Array<{
    onFulfilled?: <T>(
      response: AxiosResponse<T>
    ) => AxiosResponse<T> | Promise<AxiosResponse<T>>;
    onRejected?: (error: HttpError) => unknown;
  }>;
}

/**
 * HTTP client interface
 */
export interface IHttpClient {
  instance: AxiosInstance;
  get<T = unknown>(url: string, config?: HttpRequestConfig): Promise<T>;
  post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: HttpRequestConfig
  ): Promise<T>;
  put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: HttpRequestConfig
  ): Promise<T>;
  patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: HttpRequestConfig
  ): Promise<T>;
  delete<T = unknown>(url: string, config?: HttpRequestConfig): Promise<T>;
  request<T = unknown>(config: HttpRequestConfig): Promise<T>;
}
