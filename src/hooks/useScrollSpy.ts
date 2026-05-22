import { useState, useEffect } from 'react';

export interface UseScrollSpyOptions {
  offset?: number;
  root?: Element | null;
  rootMargin?: string;
}

export function useScrollSpy(
  sectionIds: string[],
  {
    offset = 0,
    root = null,
    rootMargin
  }: UseScrollSpyOptions = {}
) {

  const [active, setActive] =
    useState<string | null>(null);

  useEffect(() => {

    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    const elements =
      new Map<Element, string>();

    sectionIds.forEach((id) => {

      const el =
        document.querySelector(id);

      if (el) {
        elements.set(el, id);
      }

    });

    const observer =
      new IntersectionObserver(

        (entries) => {

          let bestRatio = 0;
          let bestId: string | null = null;

          entries.forEach((entry) => {

            const id =
              elements.get(entry.target);

            if (
              id &&
              entry.intersectionRatio > bestRatio
            ) {
              bestRatio =
                entry.intersectionRatio;

              bestId = id;
            }

          });

          if (bestId) {
            setActive(bestId);
          }

        },

        {
          root,
          rootMargin:
            rootMargin ??
            `${-offset}px 0px -60% 0px`,
          threshold: [
            0,
            0.2,
            0.4,
            0.6,
            0.8,
            1
          ]
        }
      );

    elements.forEach((_, el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };

  }, [
    sectionIds.join(','),
    offset,
    root,
    rootMargin
  ]);

  return active;
}