# CLAUDE.md

Claude Code reads this file. The full rules are in [AGENTS.md](AGENTS.md); this is the short version.

## Commands

```bash
npm run dev
npm run check        # typecheck + lint + build. Run before saying done.
npm run setup        # rewrite config and theme from answers
```

## Non-negotiables

- Server components by default; `'use client'` only at a leaf that needs it.
- Pages import from `lib/`, never from `config/project.json`.
- Every page uses `pageMetadata()` from `lib/seo.ts`.
- Every public route is listed in `app/sitemap.ts`.
- Use design tokens, not hardcoded colours or sizes.
- No new dependency without a reason a reviewer would accept.

## Read before editing

- Structure: `docs/ARCHITECTURE.md`
- UI: `docs/DESIGN.md`
- Metadata: `docs/SEO.md`
- Recipes: `docs/AGENT_WORKFLOW.md`
- Next.js 16 API questions: `node_modules/next/dist/docs/`

## Never

Do not commit, push or open a PR unless asked. Do not commit secrets. Do not add placeholder pages to the nav.
