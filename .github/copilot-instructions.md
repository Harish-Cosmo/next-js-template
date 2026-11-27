# Copilot instructions

Read `AGENTS.md` at the repository root. It is the full rule set. The short version:

- Server components by default; `'use client'` only at the leaf that needs it.
- Pages import from `lib/`, never from `config/project.json`.
- Every page uses `pageMetadata()` from `lib/seo.ts`.
- Every public route is listed in `app/sitemap.ts`.
- Use design tokens from `app/theme.generated.css`; no literal colours or sizes.
- Do not add a dependency without a reason a reviewer would accept.
- Run `npm run check` before saying a task is done.
