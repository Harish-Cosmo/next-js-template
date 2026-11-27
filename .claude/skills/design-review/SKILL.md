---
name: design-review
description: Review a screen, page or component against this project's design system before shipping. Checks tokens, hierarchy, spacing, states, accessibility and responsiveness, then returns a short prioritized list of fixes. Use when asked to review UI, check a design, or do a pre-ship pass.
---

# Design review

Review the actual rendered screen, not the intention. If you cannot run it, review the source and say what you could not verify.

## 1. Read the system

- Tokens: `app/theme.generated.css`
- Utilities and text tiers: `app/globals.css`
- Rules: `docs/DESIGN.md`

## 2. Check in this order

### Tokens

- Any literal hex, `rgb()`, or named colour that a token covers.
- Any arbitrary type size (`text-[13px]`) where a tier exists.
- Any arbitrary spacing that breaks the 4px rhythm.
- Radius from `--radius`, not a new value.

### Hierarchy

- One `text-hero` per page, one `<h1>`.
- Heading levels do not skip.
- Primary action is obvious without reading everything.
- Body copy is `text-body`; captions are `text-subtle`. Nothing lighter for paragraphs.

### Layout

- Sections use `.section-pad`; the container uses `Container`.
- Alignment is deliberate: one left edge, one grid.
- No orphaned one-word line in a heading at mobile width.
- 320px: no horizontal scroll except a code block or table inside its own scroll box.
- 200% zoom: content reflows, nothing clipped.

### States

- Default, hover, focus, active, disabled, loading, empty, error.
- Focus is visible on every control. Do not remove the global ring.
- Disabled looks disabled without relying on colour alone.
- Empty state says what will appear and how to make it appear.

### Accessibility

- Keyboard reaches every control in a sensible order.
- The skip link works.
- A control that is not a link is a `<button>`.
- Images have `alt`; decorative images have `alt=""`.
- Contrast: body at 72% and subtle at 58% pass on white. Do not lighten.
- `prefers-reduced-motion` disables motion; nothing overrides it.

### Motion

- Motion explains a state change, not an entrance.
- 150–200ms for hover and press.
- No layout shift from an animation.

## 3. Rate and prioritize

Use severity, not a score:

- **P0** — broken: unreadable contrast, unreachable control, horizontal scroll, a crash.
- **P1** — user-visible friction: missing focus, skipped heading, unclear primary action.
- **P2** — inconsistency: off-token colour, wrong text tier, uneven spacing.
- **P3** — polish: optical alignment, a one-word orphan, a shadow that is slightly off.

## 4. Output

Return at most seven findings, P0 first. For each:

```
P1 — Focus ring missing on the pricing toggle
components/pricing/toggle.tsx:24
The button uses `outline-none` with no replacement ring.
Fix: remove `outline-none`; the global :focus-visible rule supplies the ring.
```

End with the single change that would most improve the screen. If there is nothing to fix, say so and name what you verified.

## Do not

- Do not propose a new design direction in a review.
- Do not list every nit. Seven findings, ranked, is the cap.
- Do not claim a visual check you did not do.
