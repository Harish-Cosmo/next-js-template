---
name: new-page
description: Add a new public route to this Next.js template with the complete contract: metadata from pageMetadata(), JSON-LD, sitemap entry, optional navigation link, and a passing check. Use when asked to create, add, scaffold or build a page, route or screen.
---

# Add a page

Follow the order. Each step has one correct file.

## 1. Confirm the path

The folder under `app/` is the URL. `/pricing` is `app/pricing/page.tsx`. Do not add a trailing slash; `trailingSlash: false`.

If the page is dynamic (`[slug]`), it still needs metadata per instance. See step 3.

## 2. Create the route

Use the shape of `app/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { webPageSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/json-ld';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = pageMetadata({
  title: 'Page title — Site name',
  description: '155 characters or fewer.',
  path: '/the-path',
});

export default function ThePage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          title: 'Page title',
          description: '155 characters or fewer.',
          path: '/the-path',
        })}
      />
      <Container className="section-pad">
        <h1 className="text-display font-semibold">Page title</h1>
      </Container>
    </>
  );
}
```

Rules:

- `title` is the full `<title>`, brand included. `pageMetadata` uses it as-is.
- `description` is 155 characters or fewer and unique.
- `path` has no trailing slash.
- Do not hand-write `openGraph` or `twitter`. `pageMetadata` builds the complete set.
- One `<h1>`. Heading levels do not skip.

## 3. Dynamic routes

For `app/blog/[slug]/page.tsx`, generate metadata per slug:

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return pageMetadata({
    title: `${post.title} — Site name`,
    description: post.description,
    path: `/blog/${slug}`,
    type: 'article',
    published: post.published,
    modified: post.modified,
  });
}
```

In Next.js 16, `params` is a Promise. Await it.

## 4. Add it to the sitemap

Edit `app/sitemap.ts`:

```ts
{ path: '/the-path', updated: '2026-01-01', priority: 0.8, changeFrequency: 'monthly' }
```

Use the date the content last really changed, not today. A dynamic route needs one entry per published instance, generated from the content source.

## 5. Add it to navigation

Only if it belongs in the main or footer navigation. Edit `lib/nav.ts`. Do not link a page that does not exist.

## 6. Add structured data

| Page | Builder |
| --- | --- |
| Any page | `webPageSchema()` |
| Home | `websiteSchema()` and `organizationSchema()` |
| Blog post | `articleSchema()` |
| Visible breadcrumbs | `breadcrumbSchema()` |
| Visible FAQ | `faqSchema()` |

Every JSON-LD value must be visible on the page.

## 7. Verify

```bash
npm run check
```

Then open the page and confirm: title in the tab, canonical in the HTML source, the share card, keyboard focus, and 320px width.

## Done when

- [ ] `npm run check` passes.
- [ ] Page uses `pageMetadata()`.
- [ ] Page is in `app/sitemap.ts`.
- [ ] Page is reachable from a link, if public.
- [ ] JSON-LD matches visible content.
- [ ] One `<h1>`, no skipped heading levels.
- [ ] Works at 320px and with keyboard only.
