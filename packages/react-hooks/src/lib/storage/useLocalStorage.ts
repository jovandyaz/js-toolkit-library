import { useState, useEffect, useCallback } from 'react';
import { UseLocalStorageReturn } from './types';

/**
 * A hook to store and sync state with localStorage
 * @template T The type of the value to be stored
 * @param key The localStorage key
 * @param initialValue The initial value (or function that returns it)
 * @returns [storedValue, setValue, removeItem]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): UseLocalStorageReturn<T> {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item
        ? (JSON.parse(item) as T)
        : typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeItem = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        setStoredValue(
          typeof initialValue === 'function'
            ? (initialValue as () => T)()
            : initialValue
        );
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [initialValue, key]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue) as T);
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(
          typeof initialValue === 'function'
            ? (initialValue as () => T)()
            : initialValue
        );
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
    return undefined;
  }, [initialValue, key]);

  return [storedValue, setValue, removeItem];
}
