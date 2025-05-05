# @js-toolkit-library/react-hooks

A collection of utility React hooks for modern React applications.

## Installation

```bash
# Using pnpm (recommended)
pnpm add @js-toolkit-library/react-hooks

# Using npm
npm install @js-toolkit-library/react-hooks

# Using yarn
yarn add @js-toolkit-library/react-hooks
```

## Development

### Path Aliases

This project uses TypeScript path aliases for cleaner imports:

- `@/*` - Maps to `src/*`
- `@hooks/*` - Maps to `src/lib/*`

When working with examples, use these aliases to import the hooks:

```tsx
import { useLocalStorage } from '@hooks/storage';
import { useBreakpointUp } from '@hooks/media';
```

## Hooks

### Storage

#### `useLocalStorage`

A hook to store and sync state with localStorage.

```tsx
const [value, setValue, removeItem] = useLocalStorage<T>(key, initialValue);
```

**Parameters:**

- `key`: The localStorage key
- `initialValue`: The initial value (or function that returns it)

**Returns:**

- `value`: The current value from localStorage or the default value
- `setValue`: Function to update the value in localStorage
- `removeItem`: Function to remove the item from localStorage

**Example:**

```tsx
import { useLocalStorage } from '@js-toolkit-library/react-hooks';

function App() {
  const [name, setName, removeName] = useLocalStorage<string>('user-name', 'John');

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={removeName}>Clear</button>
    </div>
  );
}
```

### Media Queries

#### `useBreakpointUp`

Hook that checks if the viewport is at least as wide as the specified breakpoint.

```tsx
const matches = useBreakpointUp(breakpoint);
```

**Parameters:**

- `breakpoint`: The breakpoint to check against ('xs', 'sm', 'md', 'lg', 'xl')

**Returns:**

- `matches`: Boolean indicating if the viewport is above the breakpoint

#### `useBreakpointDown`

Hook that checks if the viewport is narrower than the specified breakpoint.

```tsx
const matches = useBreakpointDown(breakpoint);
```

**Parameters:**

- `breakpoint`: The breakpoint to check against ('xs', 'sm', 'md', 'lg', 'xl')

**Returns:**

- `matches`: Boolean indicating if the viewport is below the breakpoint

#### `useBreakpointBetween`

Hook that checks if the viewport is between two specified breakpoints.

```tsx
const matches = useBreakpointBetween(start, end);
```

**Parameters:**

- `start`: The lower breakpoint ('xs', 'sm', 'md', 'lg', 'xl')
- `end`: The upper breakpoint ('xs', 'sm', 'md', 'lg', 'xl')

**Returns:**

- `matches`: Boolean indicating if the viewport is between the breakpoints

**Example:**

```tsx
import { useBreakpointUp, useBreakpointDown } from '@js-toolkit-library/react-hooks';

function ResponsiveComponent() {
  const isDesktop = useBreakpointUp('md');
  const isMobile = useBreakpointDown('sm');

  return (
    <div>
      {isDesktop ? (
        <h1>Desktop View</h1>
      ) : isMobile ? (
        <h1>Mobile View</h1>
      ) : (
        <h1>Tablet View</h1>
      )}
    </div>
  );
}
```

## Breakpoint Reference

The following breakpoints are used for media queries:

| Breakpoint | Value |
|------------|-------|
| xs | 0px |
| sm | 600px |
| md | 960px |
| lg | 1280px |
| xl | 1920px |

## License

MIT © JS Toolkit Library
