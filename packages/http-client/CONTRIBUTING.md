# Contributing to HTTP Client

Thank you for your interest in contributing to the HTTP Client package! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-org/js-toolkit-library.git
cd js-toolkit-library
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Build the package**

```bash
pnpm nx build http-client
```

## Code Structure

The HTTP Client package follows a modular structure:

- `src/index.ts` - Main entry point that exports public API
- `src/lib/http-client.ts` - Core HTTP client implementation
- `src/lib/types.ts` - TypeScript interfaces and types
- `src/lib/interceptors.ts` - Axios interceptors for authentication, retries, etc.
- `src/lib/testing.ts` - Testing utilities for consumers

## Type System Guidelines

We follow strict type safety principles in this package:

1. **Use generics extensively** - All HTTP methods use generics for both request and response types
2. **Avoid `any` type** - Use `unknown` when the type cannot be predetermined
3. **Use type guards** - Provide type guards (like `isHttpError`) for type-safe error handling
4. **Leverage Axios types** - Extend and use Axios types appropriately
5. **Document types** - Add JSDoc comments to explain complex types

Example of preferred typing approach:

```typescript
async post<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: HttpRequestConfig
): Promise<T>;

## Pull Request Process

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the coding style and conventions
3. **Add tests** for any new functionality
4. **Run the tests** to ensure nothing breaks: `pnpm nx test http-client`
5. **Update documentation** if needed
6. **Submit a pull request**

## Coding Standards

- Follow TypeScript best practices
- Use ES6+ syntax where appropriate
- Document public APIs with JSDoc comments
- Write unit tests for new functionality
- Follow the Single Responsibility Principle
- Maintain strict type safety - no implicit `any` types
- Use nullable types (`string | null`) instead of optional chaining where appropriate

## Feature Requests

If you have a feature request, please open an issue in the repository with the following information:

- Clear and descriptive title
- Detailed description of the feature
- Any relevant code examples or use cases
- Why this feature would be beneficial to the package

## Bug Reports

When filing a bug report, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Version of the package, Node.js, and package manager
- Any relevant logs or error messages

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT license.
