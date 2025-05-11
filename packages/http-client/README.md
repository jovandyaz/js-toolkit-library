# HTTP Client

A robust and extensible HTTP client package for React/TypeScript applications built on top of Axios.

## Features

- **Simple API**: Clean interface with Promise-based methods for all HTTP verbs
- **Type Safety**: Full TypeScript support with flexible generic typing for requests and responses
- **Authentication**: Built-in authentication token management with refresh capabilities
- **Interceptors**: Configurable request/response interceptors
- **Error Handling**: Comprehensive error handling with retry support and type-safe error detection
- **Extensibility**: Easy to extend with custom functionality

## Installation

```bash
# If using pnpm
pnpm add @jovandyaz/http-client

# If using npm
npm install @jovandyaz/http-client

# If using yarn
yarn add @jovandyaz/http-client
```

## Basic Usage

```typescript
import { createHttpClient, isHttpError } from '@jovandyaz/http-client';

// Create a basic HTTP client
const httpClient = createHttpClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'X-Custom-Header': 'value'
  }
});

// Define your data types
interface User {
  id: number;
  name: string;
  email: string;
}

// Make requests
async function fetchData() {
  try {
    // GET request - returns data directly (no need for .data)
    const users = await httpClient.get<User[]>('/users');

    // POST request with typed data and response
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    const newUser = await httpClient.post<User, typeof userData>('/users', userData);

    // PUT request
    const updateData = {
      name: 'Updated Name'
    };
    await httpClient.put<User, typeof updateData>('/users/1', updateData);

    // DELETE request
    await httpClient.delete('/users/1');
  } catch (error) {
    // Type-safe error handling
    if (isHttpError(error)) {
      console.error('API error:', error.response?.status, error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}
```

## Authentication

```typescript
import { createHttpClient, AuthTokenProvider } from '@jovandyaz/http-client';

// Create an auth token provider
const authTokenProvider: AuthTokenProvider = {
  // Function to get the current token
  getToken: () => localStorage.getItem('auth_token'),

  // Function to refresh token when expired
  refreshToken: async () => {
    try {
      const response = await fetch('https://api.example.com/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: localStorage.getItem('refresh_token')
        })
      });

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      return data.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  },

  // Function to determine if an error is due to token expiration
  isTokenExpired: (error) => {
    return error.response?.status === 401 &&
           error.response?.data?.message === 'Token expired';
  }
};

// Create HTTP client with authentication
const httpClient = createHttpClient({
  baseURL: 'https://api.example.com',
  authTokenProvider
});
```

## Advanced Configuration

```typescript
import { createHttpClient, HttpClientConfig } from '@jovandyaz/http-client';

const config: HttpClientConfig = {
  baseURL: 'https://api.example.com',
  timeout: 10000,

  // Default headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Version': '1.0.0'
  },

  // Retry configuration
  defaultRetryCount: 3,
  defaultRetryDelay: 1000, // milliseconds

  // Custom request interceptors
  requestInterceptors: [
    {
      onFulfilled: (config) => {
        // Add timestamp to all requests
        config.headers = config.headers || {};
        config.headers['X-Timestamp'] = new Date().toISOString();
        return config;
      }
    }
  ],

  // Custom response interceptors with generic typing
  responseInterceptors: [
    {
      onFulfilled: (response) => {
        // Log all successful responses
        console.log('API Response:', response.status, response.config.url);
        return response;
      },
      onRejected: (error) => {
        // Log all failed responses
        console.error('API Error:',
          error.response?.status,
          error.config?.url,
          error.message
        );
        return Promise.reject(error);
      }
    }
  ]
};

const httpClient = createHttpClient(config);
```

## Per-Request Configuration

```typescript
// Override default configuration for a specific request
const data = await httpClient.get<User[]>('/users', {
  timeout: 3000,
  retryCount: 5,
  retryDelay: 500,
  skipAuthHeader: true, // Skip adding auth token for this request
  skipErrorInterceptor: true // Skip error handling for this request
});
```

## Testing with Mocks

```typescript
import { createMockHttpClient } from '@jovandyaz/http-client';

// Define your interface types
interface User {
  id: number;
  name: string;
}

// Create a mock HTTP client with predefined responses
const mockClient = createMockHttpClient({
  get: {
    '/users': [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' }
    ],
    '/users/1': { id: 1, name: 'User 1' }
  },
  post: {
    '/users': { id: 3, name: 'New User' }
  }
});

// Use in tests with proper typing
const users = await mockClient.get<User[]>('/users');
const user = await mockClient.get<User>('/users/1');

// Check if methods were called
const getCalls = (mockClient.get as any).mock.calls;
console.log(`GET was called ${getCalls.length} times`);
```

## Direct Axios Instance Access

```typescript
// Access the underlying Axios instance directly if needed
const { instance } = httpClient;

// Use it for advanced cases
instance.head('/check-endpoint')
  .then(response => console.log(response.headers))
  .catch(error => console.error('Error:', error));
```

## License

MIT
