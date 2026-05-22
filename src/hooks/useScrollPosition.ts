import { useState, useEffect } from 'react';

export interface ScrollPosition {
  x: number;
  y: number;
}

export function useScrollPosition(
  container?: React.RefObject<HTMLElement>
) {

  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });

  useEffect(() => {

    const target =
      container?.current ?? window;

    let raf: number;

    const update = () => {

      raf = requestAnimationFrame(() => {

        if (target === window) {

          setPosition({
            x: window.scrollX,
            y: window.scrollY
          });

        } else {

          const el = target as HTMLElement;

          setPosition({
            x: el.scrollLeft,
            y: el.scrollTop
          });

        }

      });

    };

    target.addEventListener(
      'scroll',
      update,
      { passive: true }
    );

    update();

    return () => {

      target.removeEventListener(
        'scroll',
        update
      );

      cancelAnimationFrame(raf);

    };

  }, [container?.current]);

  return position;

}