import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

export interface UseInfiniteScrollOptions {
  /**
   * Distance in pixels from the bottom of the container at which onLoadMore fires.
   * @default 200
   */
  threshold?: number;

  /**
   * Whether there are more items to load. Set to false to stop observing.
   * @default true
   */
  hasMore?: boolean;

  /**
   * Optional scrollable container ref. Defaults to the window.
   */
  container?: RefObject<HTMLElement | null>;

  /**
   * Direction to observe. 'down' watches the bottom edge, 'up' watches the top.
   * @default 'down'
   */
  direction?: 'down' | 'up';
}

export interface UseInfiniteScrollResult {
  /** Whether a load operation is currently in progress. */
  loading: boolean;
  /** Sentinel ref to place at the bottom (or top) of your list. */
  sentinelRef: RefObject<HTMLDivElement | null>;
}

/**
 * Hook for infinite scrolling / pagination. Calls `onLoadMore` when the user
 * scrolls near the edge of the container.
 *
 * @param onLoadMore Async callback invoked when the threshold is reached
 * @param options Configuration options
 *
 * @example
 * ```tsx
 * const { loading, sentinelRef } = useInfiniteScroll(
 *   async () => { await fetchNextPage(); },
 *   { threshold: 300, hasMore: page < totalPages }
 * );
 *
 * return (
 *   <div>
 *     {items.map(item => <Card key={item.id} {...item} />)}
 *     <div ref={sentinelRef} />
 *     {loading && <Spinner />}
 *   </div>
 * );
 * ```
 */
export function useInfiniteScroll(
  onLoadMore: () => Promise<void> | void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollResult {
  const { threshold = 200, hasMore = true, container, direction = 'down' } = options;

  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const handleLoadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      await onLoadMore();
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [onLoadMore, hasMore]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!hasMore) return;

    // Use IntersectionObserver if sentinel element exists
    if (sentinelRef.current && 'IntersectionObserver' in window) {
      const root = container?.current ?? null;
      const margin = direction === 'down' ? `0px 0px ${threshold}px 0px` : `${threshold}px 0px 0px 0px`;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            handleLoadMore();
          }
        },
        { root, rootMargin: margin, threshold: 0 }
      );

      observer.observe(sentinelRef.current);

      return () => {
        observer.disconnect();
      };
    }

    // Fallback: scroll event listener
    const scrollTarget = container?.current ?? window;

    const handleScroll = () => {
      if (loadingRef.current || !hasMore) return;

      let shouldLoad = false;

      if (container?.current) {
        const el = container.current;
        if (direction === 'down') {
          shouldLoad = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
        } else {
          shouldLoad = el.scrollTop < threshold;
        }
      } else {
        const docHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;
        if (direction === 'down') {
          shouldLoad = docHeight - scrollTop - viewportHeight < threshold;
        } else {
          shouldLoad = scrollTop < threshold;
        }
      }

      if (shouldLoad) {
        handleLoadMore();
      }
    };

    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
    };
  }, [handleLoadMore, hasMore, threshold, container, direction]);

  return { loading, sentinelRef };
}
