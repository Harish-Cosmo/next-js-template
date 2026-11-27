# Decisions

A short log of choices that are easy to undo by accident. Each entry says what was chosen, why, and what would change the answer.

## 001 — Config in JSON, not TypeScript

**Chosen:** `config/project.json`, read through `lib/site.ts`.

**Why:** the setup script is plain Node and cannot import TypeScript. A JSON file is also readable by any tool and by an agent without a build step.

**Change if:** the config needs functions or imports. At that point, move it to `config/project.ts` and run the setup script through `tsx`.

## 002 — Design tokens in generated CSS

**Chosen:** `app/theme.generated.css` holds HSL triplets; Tailwind maps them to utilities.

**Why:** one brand value lives in one place, dark mode is a block swap, and opacity works through `<alpha-value>`.

**Change if:** the project adopts a token pipeline that generates the same file from a design tool. The output contract stays the same.

## 003 — `pageMetadata()` instead of per-page metadata objects

**Chosen:** every page calls one helper.

**Why:** Next.js replaces the whole `openGraph` object when a page sets one. Hand-writing metadata is how pages lose their share image and inherit the home page's canonical.

**Change if:** the framework changes inheritance semantics. Until then, the helper is the contract.

## 004 — Server components by default, `<details>` for the mobile menu

**Chosen:** the shell ships no client JavaScript for navigation.

**Why:** a mobile menu is the most common reason a layout becomes a client component, and it does not need to be one.

**Change if:** the menu needs focus trapping, route-aware animation or a nested submenu that `<details>` cannot express. Then it becomes a small client component, not a client layout.

## 005 — No CMS, auth, database or analytics in the template

**Chosen:** feature flags in config, no scaffolding.

**Why:** a half-built feature is worse than no feature. The template should not make a decision the project has not made.

**Change if:** a project needs one. Add it as its own layer with its own doc.

## 006 — Tailwind v3, not v4

**Chosen:** Tailwind 3.4 with a `tailwind.config.ts`.

**Why:** the token mapping is explicit and stable, and the template's CSS is small. v4's CSS-first config is a different migration, not a free upgrade.

**Change if:** the project wants v4's engine. Migrate the token mapping in one PR, not incrementally.

## 007 — Static by default

**Chosen:** pages are static unless they read a request value or an uncached source.

**Why:** static is faster, cheaper and easier to reason about. A template should start at the cheapest rendering mode.

**Change if:** the page needs personalization, auth or live data. Then make that page dynamic and say why.

## 008 — System font stack

**Chosen:** no web font by default.

**Why:** zero requests, zero layout shift, and it looks native on every platform. A web font is a brand decision, not a default.

**Change if:** the brand has a typeface. Use `next/font`, self-hosted, with one family and the weights actually used.

## 009 — Hand-maintained sitemap

**Chosen:** `app/sitemap.ts` lists routes explicitly.

**Why:** an automatic sitemap from the filesystem is easy to add and easy to get wrong: it lists drafts, ignores `noindex`, and cannot know a real `lastModified`. A short explicit list is honest.

**Change if:** the site grows past a few dozen routes. Then generate from a content source that knows publication state.

## 010 — No restrictive CSP in the template

**Chosen:** safe, boring headers only.

**Why:** a CSP that is wrong breaks the site, and a template cannot know every origin a project will use. `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and HSTS are safe without that knowledge.

**Change if:** the project knows its origins. Add a CSP in `next.config.mjs` and test every integration.

## Adding a decision

Copy the shape: number, chosen, why, change if. Keep it to the choices a future reader could reverse without noticing.
