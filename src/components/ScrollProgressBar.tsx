import React, { useEffect, useState } from 'react';
import { ScrollProgressBarProps } from '../types';
import { resolveContainer } from '../utils/resolveContainer';

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  height = 3,
  color = '#1565C0',
  zIndex = 9999,
  position = 'top',
  container,
  className,
  style,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number;

    const scrollTarget = resolveContainer(container);

    const updateProgress = () => {
      rafId = requestAnimationFrame(() => {
        let scrollTop = 0;
        let scrollHeight = 0;
        let clientHeight = 0;

        if (scrollTarget === window) {
          scrollTop = window.scrollY;

          scrollHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight
          );

          clientHeight = window.innerHeight;
        } else {
          const el = scrollTarget as HTMLElement;

          scrollTop = el.scrollTop;
          scrollHeight = el.scrollHeight;
          clientHeight = el.clientHeight;
        }

        const maxScrollable =
          scrollHeight - clientHeight;

        const percent =
          maxScrollable > 0
            ? (scrollTop / maxScrollable) * 100
            : 0;

        setProgress(
          Math.min(
            100,
            Math.max(0, percent)
          )
        );
      });
    };

    scrollTarget.addEventListener(
      'scroll',
      updateProgress,
      { passive: true }
    );

    updateProgress();

    return () => {
      scrollTarget.removeEventListener(
        'scroll',
        updateProgress
      );

      cancelAnimationFrame(rafId);
    };
  }, [container]);

  return (
    <div
      className={className}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Scroll progress"
      style={{
        position: 'fixed',
        left: 0,
        width: `${progress}%`,
        height:
          typeof height === 'number'
            ? `${height}px`
            : height,

        background: color,
        zIndex,

        transition: 'width 100ms ease-out',

        ...(position === 'top'
          ? { top: 0 }
          : { bottom: 0 }),

        ...style
      }}
    />
  );
};