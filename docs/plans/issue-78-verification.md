# Verification plan — issue #78: cocktails index doesn't fill the page

## What is actually wrong

The issue reports `/cocktails/` rendering as "a single narrow column that doesn't
fill the page the way other pages do", and speculates the screenshot may be a
stale cache or viewport artifact because a headless check at 2000px looked
correct.

It is neither, and it is not a viewport problem. Reproduced at the reporter's
exact viewport (1512×949, DPR 2) against a fresh `hugo --gc --minify` build: the
local render is equivalent to the attached screenshot.

**The exported token CSS is only part of the `DatedList` component, and the
missing part is the layout.** `design/tokens/utilities.css` has:

```css
.ds-dated{display:grid;gap:var(--space-4);margin:var(--space-7) 0;padding:0;list-style:none}
```

`display: grid` with no `grid-template-columns` — one column. The component it
is standing in for is not one column. Fetched from the source project with
`DesignSync`, `components/lists/DatedList.jsx`:

```jsx
export function DatedList({ items = [], onSelect, columns = true }) {
  <ul style={{ display: "grid",
               gridTemplateColumns: columns
                 ? "repeat(auto-fit, minmax(var(--grid-min), 1fr))"
                 : "1fr",
               gap: "0 var(--gutter-column)" }}>
    <li style={{ display: "grid", gridTemplateColumns: "150px 1fr",
                 gap: "var(--space-5)", alignItems: "baseline",
                 padding: "var(--space-4) 0",
                 borderBottom: "var(--border-width) solid var(--border-hairline)" }}>
      <span data-date style={{ fontFamily: "var(--font-mono)",
                               fontSize: "var(--text-xs)",
                               color: "var(--date-color, var(--text-faint))" }}>
      <a style={{ fontWeight: "var(--weight-semibold)",
                  color: "var(--text-heading)" }}>
```

`columns` **defaults to `true`**. The archive reflows across as many
`--grid-min` (`min(100%,360px)`) columns as fit. `templates/cocktail-index/
CocktailIndex.dc.html` describes the result in its own template header:

> `@template name="Section index" description="Dated archive index: title,
> one-line intro, and a **two-up list of posts**."`

The single-column form is the `columns={false}` variant. A token file cannot
express a prop, so the export flattened it to the wrong default — and the page
rendered as one narrow column down the left of a 1440px container.

This is the same class of gap `design/README.md` already records for
`--col-min` / `--sidebar` / `--container-max-wide`:

> Upstream these are supplied per-instance by the React components (inline
> `style`), not by the token layer. Any Hugo template using `.ds-cols`,
> `.ds-split`, `.ds-section`, or `.ds-container--wide` **must set them** or the
> grid silently collapses.

`.ds-dated` belongs on that list and was not on it.

### Measured, at 1512×949

| | before | after |
|---|---|---|
| `.ds-dated` `grid-template-columns` | *(none — one column)* | `399.375px 399.375px 399.375px` |
| Columns of rows rendered | 1 | 3 |
| `.ds-dated__row` `grid-template-columns` | `180px 1108.83px` | `150px 233.375px` |
| Rightmost text ink, % of container | 40% | 94% |

## Acceptance criteria

Checked in a real browser (Playwright, Chromium) against a real
`hugo --gc --minify` build, not `hugo server`.

| # | Criterion | How it is proved |
|---|---|---|
| AC1 | The archive is a multi-column grid that reflows with the container, per the component | `getComputedStyle(.ds-dated).gridTemplateColumns` has 3 tracks at 1512px, 2 at 900px, 1 at 375px; distinct row `left` offsets confirm rows actually occupy those columns |
| AC2 | The page reads as filled | Rightmost text ink ≥ 60% of `.ds-container` width at 1512px, vs. 40% before |
| AC3 | Each row is still date + title with a hairline rule | `.ds-dated__row` has two tracks above 640px; `borderBottomWidth` = 1px |
| AC4 | It still stacks to one column below 640px — *both* the grid and the row | At 375px, `.ds-dated` and `.ds-dated__row` each resolve to a single track |
| AC5 | Every recipe still listed, newest first, each linking to its page | Row count = recipes in `content/cocktails/`; dates descending; every `href` resolves |
| AC6 | Nothing under `themes/` or `design/tokens/` changed | `git diff --stat origin/master -- themes/ design/` is empty |
| AC7 | Build is clean under CI's flags | `hugo --gc --minify --printPathWarnings --panicOnWarning` exits 0 |
| AC8 | Coverage checks pass | `node scripts/style-coverage.mjs public`, `node scripts/token-coverage.mjs public` |
| AC9 | Internal links resolve | `python3 scripts/check-links.py public` |
| AC10 | Colour-scheme behaviour and the axe sweep pass | `cd tests/visual && npm test` |
| AC11 | No responsive regression | `cd tests/visual && npm run test:responsive` |

## Out of scope

- Editing `design/tokens/**`. It is a read-only mirror (CLAUDE.md), and the
  design system is not wrong here — the *export* is lossy. The fix belongs in
  `assets/css/pages.css`, which is where "this site's pages are assembled from
  the system's primitives".
- Changing what the archive contains — no tags, thumbnails or excerpts.
- `PageTitle`'s `kicker="Cocktails"` and `meta="14 recipes"` props, and the
  `ProfileHeader` rail in `templates/cocktail-index/CocktailIndex.dc.html`.
  Both are real parts of upstream's section index; both add content the issue
  did not ask for. Noted below instead.

## Verification log

Run 2026-09-01, `hugo v0.163.0+extended`, fresh
`hugo --gc --minify --printPathWarnings --panicOnWarning`, served over plain
HTTP (not `hugo server` — it injects LiveReload and unminified CSS).

| # | Result | Evidence |
|---|---|---|
| AC1 | **PASS** | 1512px → `399.375px 399.375px 399.375px`, 3 distinct row columns × 5 rows. 900px → `396px 396px`, 2 × 7. 375px → `335px`, 1 × 14. |
| AC2 | **PASS** | Rightmost text ink, `Range` over the title/date text nodes: **before 608px (40% of the 1440px container), after 1356px (94%)**. |
| AC3 | **PASS** | `.ds-dated__row` → `150px 233.375px` at 1512px, `150px 230px` at 900px; `border-bottom-width: 1px`. |
| AC4 | **PASS** | 375px: `.ds-dated` → `335px`, `.ds-dated__row` → `335px`. The row override is wrapped in `@media (min-width: 641px)` precisely so it cannot outrank `utilities.css`'s own 640px stack — `pages.css` is concatenated after `ds/utilities.css`, so an unguarded rule there would have silently broken the phone layout. |
| AC5 | **PASS** | 14 rows at every viewport = 14 recipes in `content/cocktails/` (plus `_index.md`); `datetime` strictly descending `2026-08-08 … 2014-03-19`; every `href` starts `/cocktails/` and resolves (AC9). |
| AC6 | **PASS** | `git diff --stat origin/master -- themes/ design/` → empty. |
| AC7 | **PASS** | Exit 0, no path warnings, no panics. |
| AC8 | **PASS** | `style-coverage.mjs`: "every emitted class is either styled or accounted for" — **no new allowlist entry**. `token-coverage.mjs`: 141 defined / 142 referenced, all accounted for. |
| AC9 | **PASS** | 22 pages, no broken internal links. |
| AC10 | **PASS** | 24/24. |
| AC11 | **PASS** | 7/7 across chromium/firefox/webkit × 6 viewports. |

Also checked by eye at 375px, 900px and 1512px.

### Caveat

`tests/visual/baseline.sh` / `check.sh` (screenshot diff against
`origin/master`) was **not run**: port 1414 is held by an unrelated
`hugo server` in this workspace and the script refuses rather than diff against
a stale server. It is not in CI, its baseline is not committed, and it would
report a large intentional diff on `/cocktails/` by design.

### Left for a follow-up

Both are real divergences from upstream's section index, both add content:

1. **`PageTitle` takes `kicker` and `meta`.** Upstream's cocktail index renders
   `kicker="Cocktails"` above the title and `meta="14 recipes"` beside it. The
   site's `.page-header` renders neither.
2. **`templates/cocktail-index/CocktailIndex.dc.html` puts a sticky
   `ProfileHeader` rail beside the content** — avatar, name, tagline, social
   links, the same block the home page carries. `ui_kits/personal-site/
   CocktailIndex.jsx`, the other upstream rendering of this page, has no rail at
   all. The two disagree; this change follows the ui_kit (no rail), which is
   also what the site already did.

Separately: `design/DESIGN-SYSTEM.md` says the rail collapses under 900px and
the dated index stacks under 600px; `design/tokens/utilities.css` uses 820px and
640px. The doc is not authoritative on breakpoints.
