# Agent workflow

Recipes for the tasks an agent actually gets. Read `AGENTS.md` first for the rules; this is the how.

## The loop

1. Read `config/project.json` and the doc for the task.
2. Find the nearest existing example and copy its shape.
3. Make the smallest change that satisfies the task.
4. Run `npm run check`.
5. Fix what it reports, then report what changed and what you verified.

Do not skip step 4. A typecheck or build failure is the cheapest possible feedback; finding it after a deploy is the most expensive.

## Add a page

Example: a `/pricing` page.

**1. Create the route.**

```tsx
// app/pricing/page.tsx
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { webPageSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/json-ld';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';

export const metadata: Metadata = pageMetadata({
  title: 'Pricing — Your Project',
  description: 'Simple plans for teams of every size.',
  path: '/pricing',
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          title: 'Pricing',
          description: 'Simple plans for teams of every size.',
          path: '/pricing',
        })}
      />
      <Container className="section-pad">
        <SectionHeader eyebrow="Pricing" title="Simple plans." />
      </Container>
    </>
  );
}
```

**2. Add it to the sitemap.** `app/sitemap.ts`, with the date the content last changed.

**3. Add it to the navigation** if it belongs there. `lib/nav.ts`.

**4. Verify.**

```bash
npm run check
```

## Add a UI primitive

Only if it is reused or encodes a rule. Otherwise use a `div` with utilities.

1. Create `components/ui/<name>.tsx`.
2. Server component unless it needs state, effects or browser APIs.
3. Accept `className` and merge it with `cn()`.
4. Use tokens, not literal values.
5. Add a visible focus state if it is interactive.
6. Use it in at least one place in the same change.

## Add structured data

1. Build it in `lib/schema.ts` if it will be reused, otherwise inline in the page.
2. Render with `<JsonLd data={...} />`.
3. Every value must be visible on the page.
4. Validate the result with a schema validator before shipping.

## Add an environment variable

1. Add the name to `.env.example`.
2. Add it to `types/env.d.ts`.
3. Read it in `lib/site.ts` (or the module that owns it), not in a component.
4. Document it in `docs/SETUP.md`.
5. If it reaches the browser, the prefix is `NEXT_PUBLIC_` and it must not be a secret.

## Add a dependency

Answer these before installing:

- What does it do that the platform or an existing package cannot?
- What is the bundle cost, measured?
- Is it maintained and typed?

If the answer is not convincing, do not add it. If it is, add it and note the reason in `docs/DECISIONS.md`.

## Debug a build failure

1. Read the first error, not the last. Later errors are often cascade.
2. `npm run typecheck` isolates type errors from bundling errors.
3. `npm run lint` catches unused imports and hook mistakes.
4. If it is a Next.js API, read `node_modules/next/dist/docs/` before guessing.
5. Reproduce on a clean build: delete `.next`, run `npm run build`.

## Common mistakes

| Symptom | Cause |
| --- | --- |
| `'use client'` on a layout | A hook was needed in one child; move the boundary down |
| Metadata missing on a page | No `pageMetadata()` export, or it is not exported as `metadata` |
| Page inherits the home OG image | Hand-written `openGraph` replaced the layout's object |
| Build fails on `window` | Browser API used in a server component |
| Styles missing in a new route group | The layout does not import `globals.css` (only the root layout should) |
| Hydration mismatch | `Date.now()`, `Math.random()` or `window` during render |

## Definition of done

- `npm run check` passes.
- The change is in the right layer.
- A new page is in the sitemap and reachable by a link.
- A new UI uses tokens and works at 320px.
- The diff contains nothing unrelated to the task.
