/**
 * Suspense Utilities for React 19
 * Enables Suspense boundaries to work with async operations
 * 
 * React 19 Feature: Suspense integration for async data loading
 */

// Simple cache for Suspense-compatible promises
// Maps request keys to promise results
const promiseCache = new Map<string, Promise<unknown>>();

/**
 * Wraps a promise to be compatible with React Suspense
 * Throws the promise while it's pending, resolves when complete
 * 
 * Usage:
 * ```tsx
 * const data = wrapPromise(fetchData());
 * ```
 * Must be called outside render (in event handlers or effects)
 */
export function wrapPromise<T>(promise: Promise<T>): T {
  let status = 'pending';
  let result: T;
  let error: unknown;

  const suspense = promise
    .then(
      (res) => {
        status = 'success';
        result = res;
      },
      (err) => {
        status = 'error';
        error = err;
      }
    )
    .catch(() => {
      // Prevent unhandled rejection warnings
    });

  return {
    read() {
      if (status === 'pending') {
        throw suspense;
      } else if (status === 'error') {
        throw error;
      }
      return result;
    },
  } as T;
}

/**
 * Caches a promise by key to prevent duplicate requests
 * Returns cached result if exists, otherwise creates and caches new promise
 * 
 * React 19 Feature: Optimization for concurrent rendering
 */
export function cachedResource<T>(
  key: string,
  fetcher: () => Promise<T>
):  () => T {
  if (!promiseCache.has(key)) {
    const promise = fetcher();
    promiseCache.set(key, promise as Promise<unknown>);
  }

  const promise = promiseCache.get(key)!;
  let status = 'pending';
  let result: T;
  let error: unknown;

  const suspense = promise
    .then(
      (res) => {
        status = 'success';
        result = res as unknown as T;
      },
      (err) => {
        status = 'error';
        error = err;
      }
    )
    .catch(() => {
      // Prevent unhandled rejection warnings
    });

  return () => {
    if (status === 'pending') {
      throw suspense;
    } else if (status === 'error') {
      throw error;
    }
    return result;
  };
}

/**
 * Clears the promise cache
 * Useful for refetching data or in tests
 */
export function clearCache(): void {
  promiseCache.clear();
}
