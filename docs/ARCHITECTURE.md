# Architecture

The project is four layers with one direction of dependency:

```
app/  →  components/  →  lib/  →  config/project.json
```

A file may import from a layer to its right, never from one to its left. `lib/` does not import components. `components/` does not import a route.

## Layers

### `app/` — routes and route-level contracts

- One folder per URL segment, one `page.tsx` per page.
- `layout.tsx` owns the document, the header, the footer and the default metadata.
- Metadata files live here: `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`, `icon.svg`.
- Route files stay thin: compose components and data, do not hold design decisions.

### `components/` — presentation

- `ui/` — primitives with no knowledge of the site. A button, a container, a section header.
- `layout/` — the shell: header and footer.
- `seo/` — the JSON-LD renderer.
- Components are server components unless they use state, effects or browser APIs. A client component gets `'use client'` and stays as small as possible.

### `lib/` — site logic and contracts

| File | Owns |
| --- | --- |
| `site.ts` | `siteConfig`, `siteUrl`, `normalizePath`, env overrides |
| `seo.ts` | `pageMetadata()` — the complete metadata set for a page |
| `schema.ts` | JSON-LD builders for Organization, WebSite, WebPage, Breadcrumb, Article, FAQ |
| `nav.ts` | `mainNav`, `footerNav` |
| `utils.ts` | `cn()` — class name merging |

`lib/` is framework-light. It has no JSX except where a helper genuinely needs it.

### `config/project.json` — the source of truth

Site identity, SEO defaults, brand values, feature flags and deployment target. Written by `npm run setup`. Read only through `lib/site.ts`.

Why JSON and not a TypeScript file: the setup script is plain Node and cannot import TypeScript. Why committed and not env-only: an agent should be able to read one file and know who the site is.

## Rendering strategy

Default to static. A page is static unless it does one of these:

- reads `cookies()`, `headers()` or `searchParams`
- calls an authenticated or uncached API
- needs `revalidate = 0`

Prefer static generation. It is faster, cheaper and easier to reason about. When a page must be dynamic, say why in the PR.

Client components are opt-in. The header menu uses `<details>` instead of a stateful mobile menu, so the shell ships no client JavaScript for navigation.

## Data flow

```
config/project.json
        │
        ▼
   lib/site.ts  ── env overrides ──►  siteConfig
        │
        ├──► lib/seo.ts       pageMetadata()
        ├──► lib/schema.ts    JSON-LD
        └──► components       header, footer, page copy
```

A page never reads the JSON. It reads `siteConfig`. That is what lets an environment variable change the URL on a preview deployment without editing committed code.

## Environment

- `config/project.json` — values that describe the project and belong in version control.
- `.env.local` — values that differ per deployment and must not be committed.
- `types/env.d.ts` — the typed contract for environment variables.
- `.env.example` — the names, no values.

Only `NEXT_PUBLIC_*` variables reach the browser. A secret never gets that prefix.

## Adding a feature

| Feature | Where it starts |
| --- | --- |
| A new page | `app/<segment>/page.tsx`, then `lib/nav.ts` and `app/sitemap.ts` |
| A reusable control | `components/ui/` |
| A section pattern used twice | `components/ui/section.tsx` or a new `components/<domain>/` folder |
| A data helper | `lib/` |
| A new brand value | `app/theme.generated.css` plus the mapping in `tailwind.config.ts` |
| A new setting | `config/project.json`, `lib/site.ts`, `types/env.d.ts` if env-driven |
| A blog | `app/blog/`, `lib/schema.ts` `articleSchema()`, sitemap entries |

## Boundaries worth keeping

- `app/` composes; `components/` presents; `lib/` decides.
- No component imports a route.
- No route hardcodes a URL, a brand colour or a metadata object.
- No secret in a client component.
- No dependency added for something the platform already does.
