import { useEffect, useRef, useState } from 'react';

export type ScrollDirection = 'up' | 'down' | null;

export function useScrollDirection(
  {
    threshold = 10,
    container
  }: {
    threshold?: number;
    container?: React.RefObject<HTMLElement>;
  } = {}
) {

  const [direction, setDirection] =
    useState<ScrollDirection>(null);

  const previous = useRef(0);

  useEffect(() => {

    const target =
      container?.current ?? window;

    let raf: number;

    const getY = () => {

      return target === window
        ? window.scrollY
        : (target as HTMLElement).scrollTop;

    };

    previous.current = getY();

    const update = () => {

      raf = requestAnimationFrame(() => {

        const current = getY();

        const diff =
          current - previous.current;

        if (
          Math.abs(diff)
          < threshold
        ) {
          return;
        }

        setDirection(
          diff > 0
            ? 'down'
            : 'up'
        );

        previous.current = current;

      });

    };

    target.addEventListener(
      'scroll',
      update,
      { passive: true }
    );

    return () => {

      target.removeEventListener(
        'scroll',
        update
      );

      cancelAnimationFrame(raf);

    };

  }, [
    threshold,
    container?.current
  ]);

  return direction;

}