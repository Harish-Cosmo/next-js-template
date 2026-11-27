# Next.js Template

A barebones, agent-friendly Next.js 16 starter. Server-first architecture, a token-based design system, technical SEO already wired in, and documentation an agent can follow without guessing.

No database, no auth, no product code. Just the structure every project needs before it grows.

## Quick start

```bash
npm install
npm run setup
npm run dev
```

`npm run setup` asks about your site, brand, SEO and deployment, then writes:

- `config/project.json` — committed source of truth for site identity, SEO, brand and features
- `app/theme.generated.css` — design tokens derived from your brand answers
- `.env.local` — deployment overrides (never committed)

Agents and CI can accept every default:

```bash
npm run setup -- --defaults
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check` | Typecheck, lint and build in one pass |
| `npm run setup` | Interactive project setup |

Run `npm run check` before every commit. It is the definition of green.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript strict
- Tailwind CSS v3 with HSL design tokens
- ESLint flat config
- No runtime dependencies beyond small UI primitives

## Structure

```
app/                  routes, layout, metadata files
components/
  ui/                 primitives (button, container, section)
  layout/             header, footer
  seo/                JSON-LD renderer
lib/                  site config, SEO, schema, nav, utils
hooks/                client-only hooks
config/project.json   committed project identity
scripts/setup.mjs     setup questionnaire
docs/                 architecture, design, SEO, performance, content
```

## How it works

- **Server first.** Pages are server components until a browser API is genuinely needed. Client components are small and opt-in.
- **One source of truth.** `config/project.json` holds identity and settings. `lib/site.ts` merges it with environment overrides. Pages import from `lib/`, never from the JSON directly.
- **One metadata function.** `pageMetadata()` in `lib/seo.ts` builds the complete title, canonical, Open Graph and Twitter set for every page, so a page cannot accidentally inherit the home page's share URL.
- **Design tokens, not magic values.** Colour, radius, type and motion live in `app/theme.generated.css`. Tailwind maps them to utilities. Components use tokens.
- **Agent-friendly.** `AGENTS.md` states the rules, `docs/AGENT_WORKFLOW.md` gives the recipes, and the check command proves the result.

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [Design system](docs/DESIGN.md)
- [SEO](docs/SEO.md)
- [Performance](docs/PERFORMANCE.md)
- [Content and voice](docs/CONTENT.md)
- [Setup and deployment](docs/SETUP.md)
- [Agent workflow](docs/AGENT_WORKFLOW.md)
- [Decisions](docs/DECISIONS.md)

## Deploy

The default target is Vercel. Set `NEXT_PUBLIC_SITE_URL` in the project settings, then deploy. For a static host, set `deployment.target` to `static` in `config/project.json` (or answer the setup question) and run `npm run build`; the output is in `out/`.

## License

MIT. See [LICENSE](LICENSE).
