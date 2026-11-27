## What

<!-- One paragraph. What changed and why. -->

## How to verify

<!-- The steps a reviewer takes, or the command that proves it. -->

```bash
npm run check
```

## Checklist

- [ ] `npm run check` passes.
- [ ] The change is scoped to one concern.
- [ ] New public route is in `app/sitemap.ts` and reachable from a link.
- [ ] Metadata uses `pageMetadata()`; no hand-written `openGraph`.
- [ ] No hardcoded colours, type sizes or spacing that a token covers.
- [ ] Works at 320px wide and with keyboard only.
- [ ] No secrets, no debug logging left in.
- [ ] Docs updated if a contract changed (env var, config key, required step).

## Screenshots

<!-- Before and after, if the change is visual. Delete if not. -->
