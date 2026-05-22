# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-21

### Added
- Initial launch of the `react-scroll-kit` package.
- `<ScrollToTop />` component for route resets with delay options, route exclusions (prefix and exact match matching), hash linking, and POP guards.
- `<ScrollRestoration />` component for browser history scroll coordinates restoration via `sessionStorage`.
- `<ScrollProgressBar />` progress indicator component optimized with `requestAnimationFrame`.
- `<ScrollToTopButton />` floating action component styled with CSS-only arrow layouts.
- `<ScrollLink />` wrapper for standard React Router links carrying coordinate targets across navigation boundaries.
- Reusable hooks: `useScrollPosition`, `useScrollDirection`, and `useScrolledPast`.
- Programmatic scroll utilities: `scrollTo` and `hashScroll` with built-in retry-lookup patterns and offset padding support.
