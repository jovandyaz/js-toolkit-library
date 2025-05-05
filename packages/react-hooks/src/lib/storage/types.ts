/**
 * LocalStorage hook return type
 * @template T The type of the value stored in localStorage
 */
export type UseLocalStorageReturn<T> = [
  /**
   * The current value from localStorage or the default value
   */
  value: T,
  /**
   * Function to update the value in localStorage
   */
  setValue: (value: T | ((prev: T) => T)) => void,
  /**
   * Function to remove the item from localStorage
   */
  removeItem: () => void
];
