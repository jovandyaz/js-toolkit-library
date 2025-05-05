import { useEffect, useState } from 'react';
import { Breakpoint, breakpointValues } from './types';

/**
 * Hook that checks if the viewport is at least as wide as the specified breakpoint
 * @param breakpoint The breakpoint to check against
 * @returns Boolean indicating if the viewport is above the breakpoint
 */
export const useBreakpointUp = (breakpoint: Breakpoint): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(
      `(min-width: ${breakpointValues[breakpoint]})`
    );
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [breakpoint]);

  return matches;
};

/**
 * Hook that checks if the viewport is narrower than the specified breakpoint
 * @param breakpoint The breakpoint to check against
 * @returns Boolean indicating if the viewport is below the breakpoint
 */
export const useBreakpointDown = (breakpoint: Breakpoint): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(
      `(max-width: ${breakpointValues[breakpoint]})`
    );
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [breakpoint]);

  return matches;
};

/**
 * Hook that checks if the viewport is between two specified breakpoints
 * @param start The lower breakpoint
 * @param end The upper breakpoint
 * @returns Boolean indicating if the viewport is between the breakpoints
 */
export const useBreakpointBetween = (
  start: Breakpoint,
  end: Breakpoint
): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(
      `(min-width: ${breakpointValues[start]}) and (max-width: ${breakpointValues[end]})`
    );
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [start, end]);

  return matches;
};
