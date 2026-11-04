import { useState, useEffect, useRef } from 'react';
import { LocalCache } from '../models';
import { buildRecordObject } from '../utils';

/**
 * Custom hook that uses local storage with SSR hydration safety
 * @param key Key
 * @param defaultValue Default value
 */
export const useLocalStorageState = <T>(
  key: string,
  defaultValue: T,
): [
  LocalCache.Record<T>,
  React.Dispatch<React.SetStateAction<LocalCache.Record<T>>>,
] => {
  const [state, setState] = useState<LocalCache.Record<T>>(() =>
    buildRecordObject(defaultValue),
  );
  const isInitialMount = useRef(true);

  // Sync from localStorage after mount on the client
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        setState(JSON.parse(stored) as LocalCache.Record<T>);
      }
    } catch {
      // Ignore storage read errors
    }
  }, [key]);

  // Sync to localStorage when state updates (skip initial SSR/mount render)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore storage write errors
    }
  }, [state, key]);

  return [state, setState];
};
