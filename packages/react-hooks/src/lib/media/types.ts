/**
 * Available breakpoints for media queries
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Mapping of breakpoint names to their pixel values
 */
export const breakpointValues: Record<Breakpoint, string> = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
};
