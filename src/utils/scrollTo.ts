import { ScrollToOptions } from '../types';
import { resolveScrollBehavior } from './accessibility';
import { resolveEasing, EasingPreset, EasingFunction } from './easing';

/**
 * Resolves the scrollable container from the given options.
 */
function getContainer(container?: ScrollToOptions['container']): HTMLElement | Window {
  if (!container) return window;
  if ('current' in container) return container.current || window;
  return container as HTMLElement | Window;
}

/**
 * Programmatically scroll the viewport or a specific container to a designated location.
 * Supports offset limits, delayed triggers, custom easing, duration, and accessibility preferences.
 * 
 * Returns a Promise that resolves when the scrolling action is completed.
 *
 * @param target The scroll target ('top', coordinate number, query selector, or element ref)
 * @param options Configurations such as offset, behavior, and trigger delays.
 */
export function scrollTo(
  target: 'top' | number | string | HTMLElement,
  options: ScrollToOptions = {}
): Promise<void> {
  return new Promise<void>((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const { 
      behavior = 'instant', 
      offset = 0, 
      delay = 0, 
      duration = 500, 
      easing = 'easeOutQuad',
      scrollAxis = 'y',
      container,
      respectReducedMotion = true
    } = options;

    const execute = () => {
      const scrollContainer = getContainer(container);
      const isWindow = scrollContainer === window;
      
      let targetY = 0;
      let targetX = 0;

      if (target === 'top') {
        targetY = 0;
        targetX = 0;
      } else if (typeof target === 'number') {
        targetY = target;
        targetX = target; // Fallback for 'both' axis with a single number
      } else if (target instanceof HTMLElement) {
        const rect = target.getBoundingClientRect();
        if (isWindow) {
          targetY = rect.top + window.scrollY;
          targetX = rect.left + window.scrollX;
        } else {
          const containerRect = (scrollContainer as HTMLElement).getBoundingClientRect();
          targetY = rect.top - containerRect.top + (scrollContainer as HTMLElement).scrollTop;
          targetX = rect.left - containerRect.left + (scrollContainer as HTMLElement).scrollLeft;
        }
      } else if (typeof target === 'string') {
        let element: HTMLElement | null = null;
        if (target.startsWith('#')) {
          element = document.getElementById(target.substring(1));
        }
        if (!element) {
          try {
            element = document.querySelector(target);
          } catch (e) {
            // Invalid CSS selector
          }
        }

        if (element) {
          const rect = element.getBoundingClientRect();
          if (isWindow) {
            targetY = rect.top + window.scrollY;
            targetX = rect.left + window.scrollX;
          } else {
            const containerRect = (scrollContainer as HTMLElement).getBoundingClientRect();
            targetY = rect.top - containerRect.top + (scrollContainer as HTMLElement).scrollTop;
            targetX = rect.left - containerRect.left + (scrollContainer as HTMLElement).scrollLeft;
          }
        } else {
          console.warn(`[react-scroll-kit] Target element "${target}" not found.`);
          resolve();
          return;
        }
      }

      const finalY = Math.max(0, targetY - offset);
      const finalX = Math.max(0, targetX - offset);

      const startY = isWindow ? window.scrollY : (scrollContainer as HTMLElement).scrollTop;
      const startX = isWindow ? window.scrollX : (scrollContainer as HTMLElement).scrollLeft;

      const diffY = finalY - startY;
      const diffX = finalX - startX;

      const actualBehavior = resolveScrollBehavior(behavior, respectReducedMotion);

      if (actualBehavior === 'instant') {
        if (isWindow) {
          window.scrollTo({
            top: scrollAxis === 'y' || scrollAxis === 'both' ? finalY : startY,
            left: scrollAxis === 'x' || scrollAxis === 'both' ? finalX : startX,
            behavior: 'instant'
          });
        } else {
          if (scrollAxis === 'y' || scrollAxis === 'both') (scrollContainer as HTMLElement).scrollTop = finalY;
          if (scrollAxis === 'x' || scrollAxis === 'both') (scrollContainer as HTMLElement).scrollLeft = finalX;
        }
        resolve();
      } else {
        // Custom smooth scroll implementation for duration/easing control
        const startTime = performance.now();
        const easingFn = resolveEasing(easing as EasingPreset | EasingFunction);

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = easingFn(progress);

          const nextY = startY + diffY * easeProgress;
          const nextX = startX + diffX * easeProgress;

          if (isWindow) {
            window.scrollTo({
              top: scrollAxis === 'y' || scrollAxis === 'both' ? nextY : startY,
              left: scrollAxis === 'x' || scrollAxis === 'both' ? nextX : startX,
              behavior: 'instant'
            });
          } else {
            if (scrollAxis === 'y' || scrollAxis === 'both') (scrollContainer as HTMLElement).scrollTop = nextY;
            if (scrollAxis === 'x' || scrollAxis === 'both') (scrollContainer as HTMLElement).scrollLeft = nextX;
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(animate);
      }
    };

    if (delay > 0) {
      setTimeout(execute, delay);
    } else {
      execute();
    }
  });
}
