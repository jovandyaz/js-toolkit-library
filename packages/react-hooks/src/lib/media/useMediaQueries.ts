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

/**
 * Hook that detects if a media query matches the current screen size
 * @param query CSS media query string (e.g. '(min-width: 768px)')
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);

    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);

    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

/**
 * Hook that checks if the current viewport is mobile (max-width: 599px)
 * @returns Boolean indicating if the viewport is mobile size
 */
export function useIsMobile(): boolean {
  return useBreakpointDown('xs');
}

/**
 * Hook that checks if the current viewport is desktop (min-width: 960px)
 * @returns Boolean indicating if the viewport is desktop size
 */
export function useIsDesktop(): boolean {
  return useBreakpointUp('md');
}
