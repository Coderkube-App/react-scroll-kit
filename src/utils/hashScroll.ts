import { scrollTo } from './scrollTo';

/**
 * Smoothly scrolls to the element corresponding to the current URL hash,
 * retrying lookup up to 10 times at 50ms intervals in case the DOM is rendering asynchronously.
 * 
 * @param hash Custom hash string (defaults to window.location.hash)
 * @param offset Vertical offset to accommodate layout spacing (e.g. sticky header)
 * @returns A Promise resolving to true if target was found and scrolled to, false otherwise.
 */
export function hashScroll(hash?: string, offset?: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const targetHash = hash || window.location.hash;
    if (!targetHash) {
      resolve(false);
      return;
    }

    const targetId = targetHash.startsWith('#') ? targetHash.substring(1) : targetHash;
    let attempts = 0;

    const attempt = (): boolean => {
      // Find element by id or by selector
      const element = document.getElementById(targetId) || document.querySelector(targetHash);
      if (element) {
        scrollTo(element, { behavior: 'smooth', offset }).then(() => {
          resolve(true);
        });
        return true;
      }
      return false;
    };

    // First attempt immediately
    if (attempt()) return;

    // Retry loop
    const intervalId = setInterval(() => {
      attempts++;
      const success = attempt();
      if (success || attempts >= 10) {
        clearInterval(intervalId);
        if (!success) {
          resolve(false);
        }
      }
    }, 50);
  });
}
