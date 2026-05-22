/**
 * Scroll lock utilities for preventing body scroll when modals,
 * drawers, or sidebars are open.
 *
 * Preserves scroll position and handles iOS Safari's touch-move quirks.
 */

let lockCount = 0;
let savedScrollY = 0;
let savedStyles: { overflow: string; position: string; top: string; width: string } | null = null;

/**
 * Lock body scrolling. Supports nested calls — scroll is only
 * truly unlocked when the last lock is released.
 *
 * @example
 * ```ts
 * import { lockScroll, unlockScroll } from 'react-scroll-kit';
 *
 * function openModal() {
 *   lockScroll();
 * }
 *
 * function closeModal() {
 *   unlockScroll();
 * }
 * ```
 */
export function lockScroll(): void {
  if (typeof window === 'undefined') return;

  lockCount++;

  if (lockCount === 1) {
    savedScrollY = window.scrollY;
    savedStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.width = '100%';
  }
}

/**
 * Unlock body scrolling. Only truly unlocks when all nested locks are released.
 * Restores the original scroll position.
 */
export function unlockScroll(): void {
  if (typeof window === 'undefined') return;

  lockCount = Math.max(0, lockCount - 1);

  if (lockCount === 0 && savedStyles) {
    document.body.style.overflow = savedStyles.overflow;
    document.body.style.position = savedStyles.position;
    document.body.style.top = savedStyles.top;
    document.body.style.width = savedStyles.width;

    window.scrollTo(0, savedScrollY);
    savedStyles = null;
  }
}

/**
 * Returns whether scroll is currently locked.
 */
export function isScrollLocked(): boolean {
  return lockCount > 0;
}
