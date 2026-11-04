import { useState, useEffect } from 'react';

/**
 * Hook to keep component mounted during exit animation.
 */
export function useTransitionMount(open: boolean, durationMs = 220): boolean {
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, durationMs);
      return () => clearTimeout(timer);
    }
  }, [open, durationMs]);

  return shouldRender;
}

export default useTransitionMount;

