# AGENTS.md

Rules for agents working in this repository. Read this before editing.

## First moves

1. Read `config/project.json`. It is the source of truth for who the site is, its SEO, brand and features.
2. Read the doc that matches the task: `docs/ARCHITECTURE.md` for structure, `docs/DESIGN.md` for UI, `docs/SEO.md` for metadata, `docs/AGENT_WORKFLOW.md` for recipes.
3. Run `npm run check` before claiming a task is done.

## This is Next.js 16

APIs, conventions and file structure may differ from older Next.js versions. Before using a Next.js API you are not certain about, read the relevant guide in `node_modules/next/dist/docs/`. Do not rely on memory.

## Hard rules

- **Server components by default.** Add `'use client'` only when a component uses state, effects or browser APIs. Push the boundary to the smallest leaf.
- **No page reads `config/project.json` directly.** Import `siteConfig`, `siteUrl` or `pageMetadata` from `lib/`.
- **Every page exports metadata from `pageMetadata()`.** Never hand-write an `openGraph` object: a page-level object replaces the layout's whole object.
- **Every public route appears in `app/sitemap.ts`.** A sitemap entry for a route that does not exist is a bug; so is a public page missing from it.
- **Use design tokens.** No hardcoded hex colours, no arbitrary font sizes, no `text-[13px]` when a token exists. Add a token only when the design system genuinely lacks one.
- **Do not add a dependency for a one-line job.** Prefer the platform and the existing primitives. Ask before adding a UI library, state manager or data layer.
- **Do not commit secrets.** `.env.local` is ignored. Keep `.env.example` current with names only.
- **Do not add comments that restate the code.** A comment explains why, a contract, or a non-obvious constraint.

## File placement

| Change | Where it goes |
| --- | --- |
| A route | `app/<segment>/page.tsx` |
| Shared UI primitive | `components/ui/` |
| Header, footer, shells | `components/layout/` |
| A client hook | `hooks/` |
| Site identity, URL, SEO helpers | `lib/` |
| JSON-LD builders | `lib/schema.ts` |
| Project settings | `config/project.json` |
| A one-off script | `scripts/` |

## Definition of done

- `npm run check` passes.
- New public page: has `pageMetadata()`, appears in `app/sitemap.ts`, is reachable from a link.
- New UI: uses tokens, has a visible focus state, works at 320px wide, respects `prefers-reduced-motion`.
- New config value: typed in `types/env.d.ts` if it comes from the environment, documented in `docs/SETUP.md` if a human must set it.

## Do not

- Do not run `git commit`, `git push` or `gh` commands unless explicitly asked.
- Do not rewrite `app/theme.generated.css` by hand when `npm run setup` can generate it.
- Do not add analytics, auth, a database or a CMS because a template "usually has one". Add it when the task requires it.
- Do not leave a placeholder page linked in the navigation. Either build it or remove the link.

## Skills

Project skills live in `.claude/skills/`. Load one when the task matches:

- `new-page` — add a route with metadata, schema, nav and sitemap.
- `design-review` — audit a screen against the design system before shipping.
