import { useState, useEffect, useRef, RefObject } from 'react';

export interface UseInViewOptions {
  /**
   * IntersectionObserver root element. Defaults to the viewport.
   */
  root?: Element | null;

  /**
   * Margin around the root element (CSS margin syntax).
   * @default '0px'
   */
  rootMargin?: string;

  /**
   * Visibility ratio threshold(s) at which the callback fires.
   * @default 0
   */
  threshold?: number | number[];

  /**
   * If true, the observer disconnects after the element first enters the viewport.
   * @default false
   */
  triggerOnce?: boolean;
}

export interface UseInViewResult {
  /** Ref to attach to the target element. */
  ref: RefObject<HTMLElement | null>;
  /** Whether the element is currently in view. */
  inView: boolean;
  /** The raw IntersectionObserverEntry (null until first observation). */
  entry: IntersectionObserverEntry | null;
}

/**
 * Hook that tracks whether a DOM element is visible within the viewport
 * using IntersectionObserver.
 *
 * @example
 * ```tsx
 * const { ref, inView } = useInView({ threshold: 0.5 });
 * return <div ref={ref}>{inView ? 'Visible!' : 'Hidden'}</div>;
 * ```
 */
export function useInView(options: UseInViewOptions = {}): UseInViewResult {
  const { root = null, rootMargin = '0px', threshold = 0, triggerOnce = false } = options;

  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const frozenRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const element = ref.current;
    if (!element) return;
    if (frozenRef.current) return;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        const isIntersecting = observerEntry.isIntersecting;
        setInView(isIntersecting);
        setEntry(observerEntry);

        if (isIntersecting && triggerOnce) {
          frozenRef.current = true;
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, triggerOnce]);

  return { ref, inView, entry };
}
