import React, { useEffect, useState } from 'react';
import { ScrollToTopButtonProps } from '../types';
import { scrollTo } from '../utils/scrollTo';

/**
 * ScrollToTopButton renders a floating button that appears after scrolling past a threshold.
 * 
 * Provides smooth transitions (opacity + transform) and utilizes a pure CSS arrow
 * with no SVG dependencies.
 */
export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  threshold = 300,
  behavior = 'smooth',
  children,
  className,
  style,
  showLabel = false,
  respectReducedMotion = true,
  enableKeyboardNavigation = true,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        setVisible(window.scrollY > threshold);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [threshold]);

  const handleClick = () => {
    scrollTo('top', { behavior, respectReducedMotion });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!enableKeyboardNavigation) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#1f2937', // dark slate gray
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    pointerEvents: visible ? 'auto' : 'none',
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ...style,
  };

  const cssArrowStyle: React.CSSProperties = {
    border: 'solid currentColor',
    borderWidth: '0 3px 3px 0',
    display: 'inline-block',
    padding: '4px',
    transform: 'rotate(-135deg)',
    marginTop: '4px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 'bold',
    marginTop: '2px',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={visible && enableKeyboardNavigation ? 0 : -1}
      className={className}
      style={buttonStyle}
      aria-label="Scroll to top"
    >
      {children ? (
        children
      ) : showLabel ? (
        <>
          <span style={cssArrowStyle} />
          <span style={labelStyle}>TOP</span>
        </>
      ) : (
        <span style={cssArrowStyle} />
      )}
    </button>
  );
};
