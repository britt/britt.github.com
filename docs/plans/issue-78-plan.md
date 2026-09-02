# Implementation plan — issue #78: cocktails index doesn't fill the page

See `issue-78-verification.md` for the diagnosis and acceptance criteria. In
short: `.ds-dated` is behaving to spec; the page around it is not composed. The
cocktails index was the only content page on the site that dropped a component
straight into a full-bleed 1440px `.ds-container` with no rail.

## Assumptions

1. **The screenshot is the current, correct-per-spec render, not a stale cache
   or a viewport artifact.** The issue leaves this open. Reproduced at the
   reporter's exact viewport (1512×949, DPR 2) against a fresh
   `hugo --gc --minify` build; the local render is equivalent to the attachment.
   So the fix is a layout change, not a cache-busting or a CSS-loading fix.
2. **"Fill the page" means the ink, not the hairline rule.** The rules already
   ran the full 1319px; what stopped at 40% of the container was the content.
   Read the other way the issue is already satisfied and there is nothing to do,
   which cannot be what was meant.
3. **`.ds-split` is the mechanism, over the alternatives.** `DESIGN-SYSTEM.md`
   names it twice as what full-bleed width is *for*, and the home page and every
   recipe page already use it. Rejected: `.ds-container--narrow` (contradicts the
   issue's "uses the full `.ds-container` width"); `.ds-cols` (breaks the
   chronological reading order and the rule-per-row an archive is for);
   adding thumbnails or excerpts to fill the row (the design system rules out
   cards and hero imagery on this page, and it is scope the issue never asked
   for).
4. **The title goes in the rail** rather than spanning the page above the split.
   The home page does this; the recipe pages span it, but for a stated reason
   that does not apply here — a drink name like "Yippee Kay Yay Motherfucker!"
   wraps to four lines at 300px, and "Cocktail Recipes" wraps to two.
5. **The archive's contents do not change.** Same rows, same order, same links.

## Changes

### `layouts/cocktails/list.html`

Wrap the page in `.ds-split`. `.archive__rail` (an `<aside>`) carries the
unchanged `.page-header` and the section's `.Content` intro; `.archive__list`
carries the unchanged `.ds-dated` markup. No change to the loop, the sort, the
row markup or the class names the design system owns.

### `assets/css/pages.css`

A new `── cocktail archive page ──` block, sited before the recipe block:

- `.archive__rail` — sticky, `align-self: start`, matching `.recipe__rail`.
- `.archive__list` — `padding-block-start: var(--page-header-top)` so the first
  row starts level with the title instead of hanging above it, and
  `.archive__list .ds-dated { margin-block: 0 }` because `.ds-dated`'s own
  `margin: var(--space-7) 0` exists to clear prose that is no longer above it.
- `.archive__intro` — `var(--text-sm)`; at body size a 300px rail rags badly and
  competes with the archive titles. First/last child margins collapsed.
- `@media (max-width: 820px)` — rail goes static and the intro takes a bottom
  margin, mirroring what the recipe page does at the same breakpoint (which is
  `.ds-split`'s own).

Nothing in `design/tokens/**` is touched; it is a read-only mirror.

## Risks

- **New class names must be styled or `style-coverage.mjs` fails.** *Resolved:*
  three of the five names drafted earn a rule — `.archive__rail`,
  `.archive__list`, `.archive__intro`. A block class `.archive` and an
  `.archive__header` override were tried and **dropped**, because neither ended
  up styling or scoping anything. `.home` and `.recipe` are allowlisted as
  "structural hook […] exists to scope descendants", and that reason would not
  have been true of `.archive` — the CSS here targets the elements directly. No
  new allowlist entry, which is the point of the checker.
- **Sticky rail vs. the axe sweep.** No new focusable content, so no new tab
  order; checked by `npm test`.
- **The 640px stack must survive.** `.ds-dated`'s breakpoint is untouched, but
  it now lives inside a `.ds-split` that collapses at 820px — the two
  breakpoints have to compose, not fight. Checked at 375/640/820/1024/1440.

## Order

1. Rewrite the template.
2. Add the CSS block.
3. Build, measure ink extent before vs. after at 1512px.
4. Run the full check suite (step 7 of the verification plan).
