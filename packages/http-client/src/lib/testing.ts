import { IHttpClient, HttpResponse, HttpRequestConfig } from './types';

/**
 * Creates a mock HTTP response
 * @param data - The data to include in the response
 * @param status - The HTTP status code (default: 200)
 * @param headers - Optional response headers
 * @returns A mocked Axios response
 */
export function createMockResponse<T = unknown>(
  data: T,
  status = 200,
  headers = {}
): HttpResponse<T> {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers,
    config: {} as any,
    request: {} as any,
  };
}

/**
 * Helper to create a function that tracks its calls
 */
function createSpy<T extends (...args: any[]) => any>(
  implementation: T
): T & {
  mock: { calls: Array<Parameters<T>> };
} {
  const calls: Array<Parameters<T>> = [];

  const spy = ((...args: Parameters<T>) => {
    calls.push(args);
    return implementation(...args);
  }) as T & { mock: { calls: Array<Parameters<T>> } };

  spy.mock = { calls };

  return spy;
}

/**
 * Type for handler functions in the mock client
 */
interface MockHandlers {
  get?:
    | Record<string, unknown>
    | ((url: string, config?: HttpRequestConfig) => Promise<unknown>);
  post?:
    | Record<string, unknown>
    | ((
        url: string,
        data?: unknown,
        config?: HttpRequestConfig
      ) => Promise<unknown>);
  put?:
    | Record<string, unknown>
    | ((
        url: string,
        data?: unknown,
        config?: HttpRequestConfig
      ) => Promise<unknown>);
  patch?:
    | Record<string, unknown>
    | ((
        url: string,
        data?: unknown,
        config?: HttpRequestConfig
      ) => Promise<unknown>);
  delete?:
    | Record<string, unknown>
    | ((url: string, config?: HttpRequestConfig) => Promise<unknown>);
}

/**
 * Creates a mock HTTP client for testing
 * with predefined responses or custom handlers
 */
export function createMockHttpClient(options: MockHandlers = {}): IHttpClient {
  const createInterceptorMethod = () => {
    return {
      use: createSpy((onFulfilled: unknown, onRejected: unknown) => 0),
      eject: createSpy((id: number) => {}),
    };
  };

  const mockClient: IHttpClient = {
    instance: {
      defaults: { baseURL: 'https://mock-api.test' },
      interceptors: {
        request: createInterceptorMethod(),
        response: createInterceptorMethod(),
      },
      request: createSpy(async () => ({})),
      get: createSpy(async () => ({})),
      post: createSpy(async () => ({})),
      put: createSpy(async () => ({})),
      patch: createSpy(async () => ({})),
      delete: createSpy(async () => ({})),
      head: createSpy(async () => ({})),
      options: createSpy(async () => ({})),
    } as any,
    get: createSpy(
      async <T = unknown>(
        url: string,
        config?: HttpRequestConfig
      ): Promise<T> => {
        if (typeof options.get === 'function') {
          return options.get(url, config) as Promise<T>;
        }

        if (options.get && url in options.get) {
          return options.get[url] as T;
        }

        throw new Error(`No mock defined for GET ${url}`);
      }
    ),
    post: createSpy(
      async <T = unknown, D = unknown>(
        url: string,
        data?: D,
        config?: HttpRequestConfig
      ): Promise<T> => {
        if (typeof options.post === 'function') {
          return options.post(url, data, config) as Promise<T>;
        }

        if (options.post && url in options.post) {
          return options.post[url] as T;
        }

        throw new Error(`No mock defined for POST ${url}`);
      }
    ),
    put: createSpy(
      async <T = unknown, D = unknown>(
        url: string,
        data?: D,
        config?: HttpRequestConfig
      ): Promise<T> => {
        if (typeof options.put === 'function') {
          return options.put(url, data, config) as Promise<T>;
        }

        if (options.put && url in options.put) {
          return options.put[url] as T;
        }

        throw new Error(`No mock defined for PUT ${url}`);
      }
    ),
    patch: createSpy(
      async <T = unknown, D = unknown>(
        url: string,
        data?: D,
        config?: HttpRequestConfig
      ): Promise<T> => {
        if (typeof options.patch === 'function') {
          return options.patch(url, data, config) as Promise<T>;
        }

        if (options.patch && url in options.patch) {
          return options.patch[url] as T;
        }

        throw new Error(`No mock defined for PATCH ${url}`);
      }
    ),
    delete: createSpy(
      async <T = unknown>(
        url: string,
        config?: HttpRequestConfig
      ): Promise<T> => {
        if (typeof options.delete === 'function') {
          return options.delete(url, config) as Promise<T>;
        }

        if (options.delete && url in options.delete) {
          return options.delete[url] as T;
        }

        throw new Error(`No mock defined for DELETE ${url}`);
      }
    ),
    request: createSpy(
      async <T = unknown>(config: HttpRequestConfig): Promise<T> => {
        throw new Error('No mock implementation for request method');
      }
    ),
  };

  return mockClient;
}

/**
 * Example usage in tests:
 *
 * // Create a mock HTTP client with predefined responses
 * const mockHttpClient = createMockHttpClient({
 *   get: {
 *     '/users': [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }],
 *     '/users/1': { id: 1, name: 'User 1' }
 *   },
 *   post: {
 *     '/users': { id: 3, name: 'New User' }
 *   }
 * });
 *
 * // Or with custom handlers
 * const mockHttpClient = createMockHttpClient({
 *   get: async (url) => {
 *     if (url === '/users') {
 *       return [{ id: 1, name: 'User 1' }];
 *     } else {
 *       throw new Error('Not found');
 *     }
 *   }
 * });
 *
 * // Then use in your tests
 * const users = await mockHttpClient.get<User[]>('/users');
 * expect(users).toEqual([{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }]);
 * expect(mockHttpClient.get.mock.calls[0][0]).toBe('/users');
 */
