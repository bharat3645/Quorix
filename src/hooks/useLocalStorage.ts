import { useEffect, useState } from 'react';

/** Small localStorage-backed state hook. Safe to use in a plain CSR Vite app. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage can throw in private-browsing/quota-exceeded scenarios; ignore.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
