# Performance

The template is fast because it ships little. Keep it that way.

## Budgets

Measure on a production build, on a mid-range phone, on a slow connection. The numbers below are ceilings, not targets.

| Metric | Ceiling |
| --- | --- |
| First-load JS, any page | 120 KB gzipped |
| Largest Contentful Paint | 2.5 s |
| Interaction to Next Paint | 200 ms |
| Cumulative Layout Shift | 0.1 |
| Total page weight, home | 500 KB |

If a change crosses a ceiling, the change explains why or it does not merge.

## Server-first

- A page is a server component. `'use client'` is a boundary, not a default.
- Put the boundary at the leaf: a button that opens a dialog is a client component; the page around it is not.
- Do not mark a whole layout client to use one hook.
- The header menu is a `<details>` element. It needs no JavaScript, so it works before hydration.

## Images

- Use `next/image` for content images. It sizes, lazy-loads and serves AVIF/WebP.
- Set `width` and `height`, or `fill` with a sized parent. A missing dimension is a layout shift.
- The first image above the fold may use `priority`. Everything else stays lazy.
- A decorative image is CSS, not an `<img>`.
- `images.formats` is already `['image/avif', 'image/webp']`; do not add a format without measuring.

## Fonts

- The default is the system font stack: zero network requests, zero layout shift.
- If you add a web font, use `next/font` so it self-hosts and generates a size-adjusted fallback. Never load a font from a third-party CDN in CSS.
- Load one family and the weights you actually use. A second family is a decision, not a default.

## JavaScript

- No dependency for a one-line job.
- Import from the specific module, not a barrel, unless `optimizePackageImports` covers the package (`lucide-react` is configured).
- A client component that only formats a date or toggles a class does not need to exist; do it on the server or in CSS.
- Check the build output after adding a dependency. If the first-load JS grows by more than a few KB, justify it.

## CSS

- Tailwind purges unused classes at build time.
- Tokens are CSS variables, so a theme change does not recompile every component.
- Avoid `@apply` in components. Use utilities in markup; keep `@apply` for base element styles in `globals.css`.

## Rendering and caching

- Static by default. A page becomes dynamic only when it reads a request value or an uncached source.
- Prefer `revalidate` over `no-store` when the data can be stale for a minute.
- Do not fetch the same data twice in one render tree; fetch once and pass it down, or use React's `cache()`.

## Measuring

```bash
npm run build
npm start
```

Then:

- Lighthouse in Chrome, mobile preset, on the production build.
- The Next.js build output for first-load JS per route.
- Chrome DevTools Performance for a real interaction, not just load.

A local dev server is not a measurement. Hydration, minification and caching differ.

## Review checklist

- [ ] The page is static unless it must be dynamic.
- [ ] No client boundary larger than the component that needs it.
- [ ] Every image has dimensions; only the hero is `priority`.
- [ ] No new dependency without a measured reason.
- [ ] First-load JS is within budget.
- [ ] Lighthouse mobile shows no red.
