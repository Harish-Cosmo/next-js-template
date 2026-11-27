# SEO

Technical SEO is wired in. This document explains the contract so a page cannot quietly break it.

## The one rule

Every page exports metadata from `pageMetadata()` in `lib/seo.ts`.

```tsx
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Pricing — Acme',
  description: 'Simple plans for teams of every size.',
  path: '/pricing',
});
```

Why a helper instead of hand-written metadata: in Next.js a page-level `openGraph` or `twitter` object replaces the layout's whole object. A page that sets only a canonical inherits the home page's `og:url` and loses its share image. `pageMetadata()` builds the complete set every time: absolute title, description, canonical, `og:url`, Open Graph image, Twitter card and robots.

Rules:

- `title` is the full title tag, brand suffix included. It is used as-is.
- `description` is 155 characters or fewer.
- `path` is this page's path, with no trailing slash. It becomes the canonical and `og:url`.
- `type` is `website` unless the page is an article; then pass `published` and `modified`.

## Canonicals

- One canonical per page, set by `pageMetadata()`.
- `trailingSlash: false` in `next.config.mjs`. Links, canonicals and sitemap URLs all use the no-slash form.
- The 404 page sets no canonical. A default canonical in the root layout would make it claim to be the home page.

## Open Graph and Twitter

- The site-wide card is `app/opengraph-image.tsx`, generated at build time.
- A page with its own image passes `image: { path, width, height, alt }` to `pageMetadata()`.
- The image is 1200×630. Put the page's subject in it, not the site name alone.

## Structured data

Builders live in `lib/schema.ts`. Render them with `<JsonLd data={...} />`.

| Builder | Use |
| --- | --- |
| `organizationSchema()` | Home or About, once per site |
| `websiteSchema()` | Home |
| `webPageSchema()` | Any page |
| `breadcrumbSchema()` | A page with visible breadcrumbs |
| `articleSchema()` | A blog post or guide |
| `faqSchema()` | A page with a visible FAQ |

The rule: every value in the JSON-LD must also be visible on the page. Structured data that describes content a visitor cannot see is a spam signal. Do not add `FAQPage` to a page with no FAQ.

## Sitemap

`app/sitemap.ts` is a hand-maintained list. When you add a public route, add it there with the date its content last really changed.

- Never use the build date as `lastModified`. A lastmod that moves on every deploy teaches crawlers to ignore it.
- Do not list a route that does not exist.
- Do not list a page that is `noindex`.

## Robots

`app/robots.ts` reads `siteConfig.indexable`. A staging or preview deployment sets `NEXT_PUBLIC_SITE_INDEXABLE=false` and the whole site is disallowed. Production allows everything and points at the sitemap.

## Metadata files

| File | Purpose |
| --- | --- |
| `app/layout.tsx` | `metadataBase`, default title template, description, robots, default Open Graph and Twitter |
| `app/opengraph-image.tsx` | The 1200×630 share card |
| `app/icon.svg` | The favicon |
| `app/manifest.ts` | Web app manifest |
| `app/sitemap.ts` | The sitemap |
| `app/robots.ts` | The robots policy |

`metadataBase` is required. Without it every relative OG image and canonical resolves against `localhost`.

## Content rules that affect ranking

- One `<h1>` per page, matching the page's promise.
- Heading levels do not skip. `h2` follows `h1`, `h3` follows `h2`.
- Internal links use descriptive anchor text, not "click here".
- A page that targets a query answers it in the first paragraph, then expands.
- Images have `alt` text that describes the image, not a keyword list.

## Launch checklist

- [ ] Production URL set in `config/project.json` and `NEXT_PUBLIC_SITE_URL`.
- [ ] `siteConfig.indexable` is true in production.
- [ ] Every public route is in `app/sitemap.ts`.
- [ ] Every page uses `pageMetadata()` with a unique title and description.
- [ ] `opengraph-image` renders and the card is readable at small size.
- [ ] JSON-LD validates with no warnings for the types you use.
- [ ] `robots.txt` and `sitemap.xml` resolve on the production domain.
- [ ] The site is submitted to Google Search Console and Bing Webmaster Tools.
- [ ] No `noindex` left on a page that should rank.
