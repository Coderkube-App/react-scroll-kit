import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { ScrollRestorationProps } from '../types';
import { storage } from '../utils/storage';

/**
 * ScrollRestoration component records scroll positions in sessionStorage on page leave,
 * restoring them when browser back/forward (POP) navigation is detected.
 */
export const ScrollRestoration: React.FC<ScrollRestorationProps> = ({
  delay = 0,
  debounceMs = 150,
  storageKey = 'rstr',
  container,
}) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const locationKey = location.key || 'default';
  
  const prevLocationKey = useRef<string | null>(null);
  const scrollTimeoutRef = useRef<any>(null);
  const isRestoring = useRef(false);

  // 1. Record position dynamically during scrolling (as fallback and for high precision)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scrollTarget = (container && 'current' in container ? container.current : container) || window;
    if (!scrollTarget) return;

    const handleScroll = () => {
      if (isRestoring.current) return;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const x = scrollTarget === window ? window.scrollX : (scrollTarget as HTMLElement).scrollLeft;
        const y = scrollTarget === window ? window.scrollY : (scrollTarget as HTMLElement).scrollTop;
        storage.set(`${storageKey}:${locationKey}`, { x, y });
      }, debounceMs);
    };

    (scrollTarget as HTMLElement | Window).addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      (scrollTarget as HTMLElement | Window).removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [locationKey, debounceMs, storageKey, container]);

  // 2. Capture scroll position "on leave" and restore on POP navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scrollTarget = (container && 'current' in container ? container.current : container) || window;
    if (!scrollTarget) return;

    // Save previous page position on leave
    if (prevLocationKey.current && prevLocationKey.current !== locationKey) {
      const x = scrollTarget === window ? window.scrollX : (scrollTarget as HTMLElement).scrollLeft;
      const y = scrollTarget === window ? window.scrollY : (scrollTarget as HTMLElement).scrollTop;
      storage.set(`${storageKey}:${prevLocationKey.current}`, { x, y });
    }

    prevLocationKey.current = locationKey;

    if (navigationType === 'POP') {
      isRestoring.current = true;

      const restore = () => {
        const savedPos = storage.get(`${storageKey}:${locationKey}`);
        if (savedPos) {
          if (scrollTarget === window) {
            window.scrollTo({
              left: savedPos.x,
              top: savedPos.y,
              behavior: 'auto'
            });
          } else {
            (scrollTarget as HTMLElement).scrollLeft = savedPos.x;
            (scrollTarget as HTMLElement).scrollTop = savedPos.y;
          }
        }
        
        // Brief timeout to avoid capturing restoration scroll events
        setTimeout(() => {
          isRestoring.current = false;
        }, 100);
      };

      if (delay > 0) {
        const timer = setTimeout(restore, delay);
        return () => clearTimeout(timer);
      } else {
        restore();
      }
    }
  }, [locationKey, navigationType, delay, storageKey, container]);

  // Save layout position on unmount of the entire component
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && locationKey) {
        const scrollTarget = (container && 'current' in container ? container.current : container) || window;
        if (!scrollTarget) return;
        const x = scrollTarget === window ? window.scrollX : (scrollTarget as HTMLElement).scrollLeft;
        const y = scrollTarget === window ? window.scrollY : (scrollTarget as HTMLElement).scrollTop;
        storage.set(`${storageKey}:${locationKey}`, { x, y });
      }
    };
  }, [locationKey, storageKey, container]);

  return null;
};
