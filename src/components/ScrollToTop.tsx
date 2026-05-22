import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { ScrollToProps } from '../types';
import { scrollTo } from '../utils/scrollTo';
import { hashScroll } from '../utils/hashScroll';

function resolveContainer(
  container?: React.RefObject<HTMLElement> | HTMLElement | Window | null
) {
  if (!container) return window;

  if ('current' in container) {
    return container.current ?? window;
  }

  return container;
}

export const ScrollToTop: React.FC<ScrollToProps> = ({
  behavior = 'instant',
  delay = 0,
  excludeRoutes = [],
  onScrollStart,
  onScrollEnd,
  duration,
  easing,
  scrollAxis,
  container,
  respectReducedMotion
}) => {

  const location = useLocation();
  const navigationType = useNavigationType();

  const prevPathname = useRef(location.pathname);

  const resolvedContainer =
    resolveContainer(container);

  useEffect(() => {

    const current = location.pathname;
    const previous = prevPathname.current;

    prevPathname.current = current;

    if (current === previous) return;

    if (navigationType === 'POP') return;

    const excluded = excludeRoutes.some(route => {

      if (current === route) {
        return true;
      }

      const normalized =
        route.endsWith('/')
          ? route
          : `${route}/`;

      return current.startsWith(normalized);

    });

    if (excluded) {
      return;
    }

    const state = location.state as any;

    const customScroll =
      state?.__scrollKitTarget !== undefined;

    if (location.hash && !customScroll) {

      onScrollStart?.();

      hashScroll(location.hash)
        .finally(() => {
          onScrollEnd?.();
        });

      return;
    }

    onScrollStart?.();

    scrollTo(
      customScroll
        ? state.__scrollKitTarget
        : 'top',
      {
        behavior: customScroll
          ? state.__scrollKitBehavior
          : behavior,

        delay,
        duration,
        easing,
        scrollAxis,
        container: resolvedContainer,
        respectReducedMotion
      }
    ).finally(() => {
      onScrollEnd?.();
    });

  }, [
    location.pathname,
    location.hash,
    navigationType,
    behavior,
    delay,
    excludeRoutes,
    duration,
    easing,
    scrollAxis,
    respectReducedMotion,
    resolvedContainer
  ]);

  return null;
};