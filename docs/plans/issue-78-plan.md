# Implementation plan — issue #78: cocktails index doesn't fill the page

See `issue-78-verification.md` for the diagnosis and acceptance criteria. In
short: `design/tokens/utilities.css` renders `.ds-dated` as a one-column grid,
but the component it stands in for defaults to `columns={true}` — a multi-column
`repeat(auto-fit, minmax(var(--grid-min), 1fr))` archive. The export could not
carry a React prop, so it flattened the component to its wrong default.

## A first attempt that was wrong, and why

The first pass wrapped the page in `.ds-split` and put the title and intro in a
rail, reasoning from `design/DESIGN-SYSTEM.md`:

> `RailLayout` — the source site is a single narrow column; the two-column rail
> is this system's way of filling the page at desktop width

That moved the ink from 40% to 65% of the container and looked better, but it
did not fix the reported defect — the list was still one column — and it was not
what the design system says this page is. Both upstream renderings of the
section index put `PageTitle` in the content column, not the rail:
`ui_kits/personal-site/CocktailIndex.jsx` is `PageTitle` + `Prose` + `DatedList`
with **no rail at all**, and `templates/cocktail-index/CocktailIndex.dc.html`
has a rail carrying `ProfileHeader`. The invented title-in-rail split matched
neither.

It is reverted. The lesson is that `design/tokens/` is not the design system —
it is a lossy export of it, and `design/README.md` says so. The `.jsx` sources
are the contract and are fetchable with `DesignSync`.

## Assumptions

1. **The screenshot is the current, correct-per-spec render, not a stale cache
   or a viewport artifact.** The issue leaves this open. Reproduced at the
   reporter's exact viewport against a fresh build.
2. **The fix belongs in `assets/css/pages.css`, not `design/tokens/`.** CLAUDE.md
   forbids editing the mirror, and the design system is not wrong here — the
   export is lossy. `pages.css` is documented as where "this site's pages are
   assembled from the system's primitives", and it is concatenated after
   `ds/utilities.css`, so the override is by intent rather than by accident.
3. **Three-up at 1440px is correct, even though upstream's template calls the
   result "a two-up list".** The component is `auto-fit` — as many columns as
   fit. Upstream gets two because its content column is ~1000px behind a
   `ProfileHeader` rail; without that rail a 1319px container fits three. The
   contract is the reflow, not the number.
4. **The archive's contents do not change.** Same rows, order and links.

## Changes

Only `assets/css/pages.css`, in the existing `── dated archive ──` block. Every
value is quoted from `components/lists/DatedList.jsx`, cited in a comment.

- `.ds-dated` — `grid-template-columns: repeat(auto-fit, minmax(var(--grid-min), 1fr))`
  and `gap: 0 var(--gutter-column)`. The component separates columns but not
  rows, because each row draws its own rule.
- `.ds-dated__row` — `padding-block: var(--space-4)`. `utilities.css` pads only
  the bottom and leans on `.ds-dated`'s row gap for the space above; with that
  gap now zero, the component's symmetric padding is what keeps a row off the
  rule above it.
- `.ds-dated__row`, inside `@media (min-width: 641px)` — `grid-template-columns:
  150px 1fr; gap: var(--space-5)`. `utilities.css` widened the date track to
  `minmax(120px,180px)` with a gap up to 40px, which is fine across a whole page
  and far too greedy inside a 399px column: it left 189px for the title and
  wrapped most of them. **The guard is load-bearing** — see the risk below.
- `.ds-dated__date` — `var(--text-xs)`, per the component (was `--text-sm`).
- `.ds-dated__title` — drop `font-family: var(--font-display)` and
  `font-size: var(--text-h4)`. The component sets neither; it is
  `fontWeight: var(--weight-semibold), color: var(--text-heading)` at body size.
  Display-face h4 titles cannot fit a name like "Slightly Sour Strawberry Smash"
  in a column of the grid.

`layouts/cocktails/list.html` returns to its pre-#78 structure, with its comment
updated to say the list is a multi-column archive and to point at the CSS note.

## Risks

- **Cascade order can silently break the phone layout.** `pages.css` is
  concatenated *after* `ds/utilities.css`, so a flat `.ds-dated__row
  { grid-template-columns: 150px 1fr }` here outranks `utilities.css`'s own
  `@media (max-width:640px)` stack — same specificity, later file — and the row
  would never collapse. Hence the `@media (min-width: 641px)` guard. Checked
  explicitly at 375px (AC4).
- **Title size is a visible change beyond "add columns".** It is not
  decoration: at `--text-h4` in the display face the titles do not fit the
  component's own column width. Reverting the size means reverting the columns.
- **New classes must be styled or `style-coverage.mjs` fails.** No new classes —
  this pass only changes rules on classes the design system already owns.

## Order

1. Revert the `.ds-split` attempt in the template.
2. Rewrite the `── dated archive ──` block in `pages.css`.
3. Build; measure column count and ink extent at 1512 / 900 / 375.
4. Run the full check suite.
