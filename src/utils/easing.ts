/**
 * Easing functions for custom scroll animations.
 *
 * Each function takes a progress value `t` in the range [0, 1]
 * and returns an eased value also in [0, 1].
 */

export type EasingFunction = (t: number) => number;

/** Built-in easing presets. */
export type EasingPreset =
  | 'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeOutExpo'
  | 'easeInOutExpo';

export const easingFunctions: Record<EasingPreset, EasingFunction> = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
};

/**
 * Resolve an easing preset string or custom function to an EasingFunction.
 */
export function resolveEasing(easing: EasingPreset | EasingFunction): EasingFunction {
  if (typeof easing === 'function') return easing;
  return easingFunctions[easing] ?? easingFunctions.easeOutQuad;
}
