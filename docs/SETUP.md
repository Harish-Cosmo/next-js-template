# Setup and deployment

## Run setup

```bash
npm install
npm run setup
```

The script asks about the site, brand, SEO and deployment, then writes three files:

| File | Committed | Purpose |
| --- | --- | --- |
| `config/project.json` | Yes | Site identity, SEO, brand, features, deployment |
| `app/theme.generated.css` | Yes | Design tokens derived from the brand answers |
| `.env.local` | No | Deployment overrides |

Re-running is safe: existing values become the defaults. `npm run setup -- --defaults` accepts every default without prompting, for CI or an agent.

## What each answer does

| Question | Effect |
| --- | --- |
| Site name | Header, footer, metadata, manifest, JSON-LD |
| Short name | Header mark, manifest `short_name` |
| Description | Meta description fallback, JSON-LD, manifest |
| Tagline | Share card, default SEO title |
| Production URL | `metadataBase`, canonicals, sitemap, OG URLs |
| SEO title | The full `<title>` for the home page |
| SEO description | Home page meta description, 155 characters max |
| X/Twitter handle | `twitter:site` |
| GitHub URL | `codeRepository` in the Organization schema |
| Profile URLs | `sameAs` in the Organization schema |
| Primary colour | Buttons and primary actions |
| Accent colour | Links, focus ring, brand scale |
| Theme colour | Browser UI colour on mobile |
| Corner radius | Every `rounded-*` utility |
| Font stacks | Body and code type |
| Neutral style | Opacity-based neutrals or standard grey |
| Dark mode | Whether a `.dark` token block is generated |
| Features | Flags only; the script does not scaffold them |
| Analytics | Adds the env variable name; you wire the provider |
| Deployment target | `static` sets `staticExport: true` |
| Indexable | `robots.ts` and the `noindex` policy |

Feature answers are flags. They do not create folders or install packages. That is deliberate: a template should not ship a half-built blog or auth flow.

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | Overrides the URL in `config/project.json` |
| `NEXT_PUBLIC_SITE_INDEXABLE` | No | `false` disables indexing on a preview |
| `NEXT_PUBLIC_SITE_NAME` | No | Overrides the site name |
| `NEXT_PUBLIC_ANALYTICS_ID` | If analytics | The provider's measurement ID |

Names only in `.env.example`. Values never in the repository. Only `NEXT_PUBLIC_*` reaches the browser.

## Post-setup checklist

1. Replace the home page copy. See `docs/CONTENT.md`.
2. Replace `app/icon.svg` with the real mark.
3. Check the share card at `http://localhost:3000/opengraph-image`.
4. Set `NEXT_PUBLIC_SITE_URL` in the deployment project.
5. Confirm `robots.txt` and `sitemap.xml` on the production domain.
6. Submit the site to Google Search Console and Bing Webmaster Tools.
7. Add the real navigation links in `lib/nav.ts`, or remove the placeholders.
8. Delete any section, component or dependency you do not use.
9. Run `npm run check`.

## Deploy

### Vercel (default)

1. Push the repository to GitHub.
2. Import it in Vercel.
3. Add `NEXT_PUBLIC_SITE_URL` with the production domain.
4. Deploy.

Preview deployments inherit the environment unless you override it. Set `NEXT_PUBLIC_SITE_INDEXABLE=false` for previews so they never compete with production in search.

### Cloudflare Pages

1. Build command: `npm run build`.
2. Output directory: `.next` (or `out` if you set `staticExport`).
3. Add the same environment variables.
4. Use the Next.js adapter Cloudflare documents for your version.

### Static host

1. Set `deployment.target` to `static` in `config/project.json`, or answer `static` in setup. This writes `staticExport: true`.
2. Run `npm run build`.
3. Upload `out/`.

A static export has no server: no route handlers, no dynamic pages, no image optimizer. Confirm the site needs none of those before choosing it.

## Troubleshooting

**The site looks unstyled.** `app/globals.css` imports `theme.generated.css` and includes the Tailwind directives. Confirm the file exists and the import is intact.

**Type collapses to its minimum size.** The fluid utilities use `cqi` units and need `container-type: inline-size` on an ancestor. `app/layout.tsx` sets it. Do not remove it.

**Canonicals point at localhost.** `NEXT_PUBLIC_SITE_URL` is unset and `config/project.json` still has `https://example.com`. Set the production URL.

**The share card shows the home page on every page.** A page is hand-writing `openGraph` instead of using `pageMetadata()`.

**A preview is indexed.** `NEXT_PUBLIC_SITE_INDEXABLE=false` is missing on the preview environment.

**The build cannot find the workspace root.** `next.config.mjs` pins `turbopack.root`. Keep it.
