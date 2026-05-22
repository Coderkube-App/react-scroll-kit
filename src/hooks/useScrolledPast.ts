import {
  useEffect,
  useState
} from 'react';

export function useScrolledPast(
  threshold: number | string | HTMLElement,
  container?: React.RefObject<HTMLElement>
) {

  const [past, setPast] =
    useState(false);

  useEffect(() => {

    const target =
      container?.current ?? window;

    const getY = () => {

      return target === window
        ? window.scrollY
        : (target as HTMLElement)
          .scrollTop;

    };

    const calculate = () => {

      let value = 0;

      if (typeof threshold === 'number') {

        value = threshold;

      }

      else if (
        threshold instanceof HTMLElement
      ) {

        value =
          threshold.offsetTop;

      }

      else {

        const el =
          document.querySelector(
            threshold
          );

        if (el) {

          value =
            (el as HTMLElement)
              .offsetTop;

        }

      }

      setPast(
        getY() > value
      );

    };

    target.addEventListener(
      'scroll',
      calculate,
      { passive: true }
    );

    calculate();

    return () => {

      target.removeEventListener(
        'scroll',
        calculate
      );

    };

  }, [
    threshold,
    container?.current
  ]);

  return past;

}