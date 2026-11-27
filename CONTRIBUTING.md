# Contributing

## Setup

```bash
npm install
npm run setup
npm run dev
```

Node 20.9 or newer. The pinned version is in `.nvmrc`.

## Workflow

1. Create a branch: `feat/<short-name>`, `fix/<short-name>` or `docs/<short-name>`.
2. Make the change.
3. Run `npm run check`.
4. Open a pull request using the template.

`npm run check` runs the typechecker, the linter and a production build. A PR that does not pass it is not ready for review.

## What a good change looks like

- **Scoped.** One concern per PR. A new page does not also refactor the header.
- **Token-based.** Colours, spacing, radius and type come from the design system. If the system is missing something, add the token in the same PR and say why.
- **Accessible.** Keyboard reachable, visible focus, labelled controls, alt text on meaningful images, decorative images hidden.
- **Server-first.** A new client component needs a sentence in the PR explaining why it cannot be a server component.
- **Documented when it changes a contract.** A new environment variable, config key or required step goes in `docs/SETUP.md`. An architectural choice goes in `docs/DECISIONS.md`.

## Commit messages

Use the imperative mood, a short subject line and a body only when the reason is not obvious.

```
Add pricing page metadata and schema

The page needs its own canonical and FAQ JSON-LD; both are built from
pageMetadata() and faqSchema().
```

## Review checklist

- [ ] `npm run check` passes.
- [ ] New route is in `app/sitemap.ts` and reachable from a link.
- [ ] Metadata uses `pageMetadata()`; no page-level `openGraph` object.
- [ ] No hardcoded colours or type sizes.
- [ ] Works at 320px wide and with keyboard only.
- [ ] No secrets, no debug logging left in.
