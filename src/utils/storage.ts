/**
 * Safe sessionStorage wrapper that guards against Server-Side Rendering (SSR)
 * and security policy exceptions (e.g. cookie blocking or private windows).
 */
export const storage = {
  /**
   * Retrieve a parsed item from sessionStorage.
   * Returns null if not found or if storage access fails.
   */
  get(key: string): any {
    if (typeof window === 'undefined') return null;
    try {
      const data = window.sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Save a serialized item to sessionStorage.
   * Fails silently if storage access is blocked or full.
   */
  set(key: string, value: any): void {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Handle QuotaExceededError or security policy errors silently
    }
  },

  /**
   * Remove an item from sessionStorage.
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.removeItem(key);
    } catch (e) {
      // Ignore exceptions
    }
  }
};
