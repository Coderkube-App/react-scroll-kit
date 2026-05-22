/**
 * Accessibility utilities for scroll behavior.
 *
 * Provides helpers to detect the user's `prefers-reduced-motion` OS setting
 * and to resolve scroll behavior accordingly.
 */

/**
 * Checks if the user has requested reduced motion at the OS level.
 *
 * @returns true if the user prefers reduced motion
 *
 * @example
 * ```ts
 * import { prefersReducedMotion } from 'react-scroll-kit';
 *
 * if (prefersReducedMotion()) {
 *   // skip animations
 * }
 * ```
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Resolves scroll behavior respecting the user's reduced-motion preference.
 *
 * If `respectReducedMotion` is true and the user prefers reduced motion,
 * the returned behavior is always `'instant'` regardless of what was requested.
 *
 * @param behavior The developer-intended scroll behavior
 * @param respectReducedMotion Whether to respect the OS-level setting
 * @returns The resolved scroll behavior
 */
export function resolveScrollBehavior(
  behavior: 'smooth' | 'instant',
  respectReducedMotion: boolean = false
): 'smooth' | 'instant' {
  if (respectReducedMotion && prefersReducedMotion()) {
    return 'instant';
  }
  return behavior;
}
