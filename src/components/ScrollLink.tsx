import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollLinkProps } from '../types';
import { scrollTo } from '../utils/scrollTo';
import { hashScroll } from '../utils/hashScroll';

export const ScrollLink: React.FC<ScrollLinkProps> = ({
  scrollBehavior = 'smooth',
  scrollTo: target = 'top',
  onClick,
  state,
  to,
  ...rest
}) => {

  const location = useLocation();

  const getTargetPath = () => {

    if (typeof to === 'string') {
      return to;
    }

    return to.pathname || '';
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {

    onClick?.(e);

    if (e.defaultPrevented) {
      return;
    }

    const targetHref = getTargetPath();

    const currentPath =
      location.pathname;

    const targetPath =
      targetHref
        .split('?')[0]
        .split('#')[0];

    if (targetPath === currentPath) {

      e.preventDefault();

      if (
        typeof target === 'string'
        && target.startsWith('#')
      ) {
        hashScroll(target);
      }
      else {
        scrollTo(target, {
          behavior:
            scrollBehavior === 'instant'
              ? 'instant'
              : 'smooth'
        });
      }
    }

  };

  const targetState =
    scrollBehavior !== 'none'
      ? {
        ...(state as Record<string, any>),
        __scrollKitTarget: target,
        __scrollKitBehavior:
          scrollBehavior === 'instant'
            ? 'instant'
            : 'smooth'
      }
      : state;

  return (

    <Link
      to={to}
      state={targetState}
      onClick={handleClick}
      {...rest}
    />

  );

};