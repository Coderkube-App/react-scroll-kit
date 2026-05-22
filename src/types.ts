import React from 'react';
import { LinkProps } from 'react-router-dom';

/**
 * Props for the ScrollToTop component.
 */
export interface ScrollToProps {
  /**
   * Scroll behavior. Either 'smooth' or 'instant'.
   * @default 'instant'
   */
  behavior?: 'smooth' | 'instant';

  /**
   * Respect user's reduced motion preference (OS level).
   * @default true
   */
  respectReducedMotion?: boolean;
  
  /**
   * Custom easing preset or function for smooth scrolling.
   */
  easing?: string | ((t: number) => number);
  
  /**
   * Custom duration in milliseconds for smooth scrolling.
   */
  duration?: number;
  
  /**
   * Axis to scroll on route change.
   * @default 'y'
   */
  scrollAxis?: 'x' | 'y' | 'both';
  
  /**
   * Scrollable container element or ref. Defaults to the window/document.
   */
  container?: React.RefObject<HTMLElement> | HTMLElement | Window | null;
  
  /**
   * Delay in milliseconds before scrolling is executed.
   * Useful for page transitions.
   * @default 0
   */
  delay?: number;
  
  /**
   * Routes to exclude from resetting scroll. Supports exact match and prefix segment match.
   * @default []
   */
  excludeRoutes?: string[];
  
  /**
   * Callback fired immediately before the scroll begins.
   */
  onScrollStart?: () => void;
  
  /**
   * Callback fired once the scroll completes.
   */
  onScrollEnd?: () => void;
}

/**
 * Props for the ScrollRestoration component.
 */
export interface ScrollRestorationProps {
  /**
   * Delay in milliseconds before restoring coordinates.
   * @default 0
   */
  delay?: number;
  
  /**
   * Debounce time in milliseconds for saving scroll position.
   * @default 150
   */
  debounceMs?: number;
  
  /**
   * Custom key name used to store scroll data in sessionStorage.
   * @default 'rstr'
   */
  storageKey?: string;
  
  /**
   * Scrollable container element or ref. Defaults to the window/document.
   */
  container?: React.RefObject<HTMLElement> | HTMLElement | Window | null;
}

/**
 * Props for the ScrollProgressBar component.
 */
export interface ScrollProgressBarProps {
  /**
   * Color of the progress bar.
   * @default '#1565C0'
   */
  color?: string;
  
  /**
   * Height of the progress bar in pixels.
   * @default 3
   */
  height?: string | number;
  
  /**
   * CSS z-index value for overlay stacking.
   * @default 9999
   */
  zIndex?: number;
  
  /**
   * Placement position of the progress bar.
   * @default 'top'
   */
  position?: 'top' | 'bottom';
  
  /**
   * Scrollable container element or ref. Defaults to the window/document.
   */
  container?: React.RefObject<HTMLElement> | HTMLElement | Window | null;
  
  /**
   * Custom CSS class name.
   */
  className?: string;
  
  /**
   * Custom style overrides.
   */
  style?: React.CSSProperties;
}

/**
 * Props for the ScrollToTopButton component.
 */
export interface ScrollToTopButtonProps {
  /**
   * Minimum scroll distance in pixels before button is shown.
   * @default 300
   */
  threshold?: number;
  
  /**
   * Scroll behavior.
   * @default 'smooth'
   */
  behavior?: 'smooth' | 'instant';
  
  /**
   * Respect user's reduced motion preference (OS level).
   * @default true
   */
  respectReducedMotion?: boolean;
  
  /**
   * Enable keyboard navigation (makes button focusable and operable via Enter/Space).
   * @default true
   */
  enableKeyboardNavigation?: boolean;
  
  /**
   * Custom button label. Renders if showLabel is true.
   */
  children?: React.ReactNode;
  
  /**
   * Custom CSS class name.
   */
  className?: string;
  
  /**
   * Inline style overrides.
   */
  style?: React.CSSProperties;
  
  /**
   * Whether to show the text label inside the button (e.g. if custom children are not provided).
   * @default false
   */
  showLabel?: boolean;
}

/**
 * Props for the ScrollLink component, extending react-router-dom's LinkProps.
 */
export interface ScrollLinkProps extends LinkProps {
  /**
   * Scrolling behavior applied when navigating.
   * @default 'smooth'
   */
  scrollBehavior?: 'smooth' | 'instant' | 'none';
  
  /**
   * Target position to scroll to. Can be 'top', a target selector string (like '#element-id'), or a coordinate number.
   * @default 'top'
   */
  scrollTo?: 'top' | string | number;
}

/**
 * Options for programmatic scrollTo function.
 */
export interface ScrollToOptions {
  /**
   * Scroll behavior.
   * @default 'instant'
   */
  behavior?: 'smooth' | 'instant';
  
  /**
   * Vertical offset in pixels (useful for sticky headers).
   * @default 0
   */
  offset?: number;
  
  /**
   * Delay in milliseconds before triggering the scroll.
   * @default 0
   */
  delay?: number;
  
  /**
   * Custom duration in milliseconds for smooth scrolling.
   */
  duration?: number;
  
  /**
   * Custom easing preset or function for smooth scrolling.
   */
  easing?: string | ((t: number) => number);
  
  /**
   * Scrollable container element or ref. Defaults to the window/document.
   */
  container?: React.RefObject<HTMLElement> | HTMLElement | Window | null;
  
  /**
   * Axis to scroll.
   * @default 'y'
   */
  scrollAxis?: 'x' | 'y' | 'both';
  
  /**
   * Respect user's reduced motion preference (OS level).
   * @default true
   */
  respectReducedMotion?: boolean;
}
