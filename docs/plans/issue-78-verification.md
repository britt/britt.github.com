# Verification plan — issue #78: cocktails index doesn't fill the page

## What is actually wrong

The issue reports `/cocktails/` rendering as "a single narrow column that doesn't
fill the page the way other pages do", and speculates that the screenshot may be
a stale cache or viewport artifact because a headless check at 2000px looked
correct.

It is neither. Reproduced at the reporter's exact viewport (1512×949, DPR 2)
against a fresh `hugo --gc --minify` build: the local render is pixel-equivalent
to the attached screenshot. Measured in the page:

| | |
|---|---|
| `.ds-container` | 1440px wide, 60px gutters — correct |
| `.ds-dated__row` | 1319px wide, `grid-template-columns: 180px 1108.83px` — correct |
| Ink in a row | date ends ~230px, title ends ~530px, hairline rule runs to 1414px |

So the `.ds-dated` component is behaving exactly as `design/tokens/utilities.css`
specifies. What fails is the *page composition around it*: `/cocktails/` is the
only content page on the site that drops a component straight into a full-bleed
1440px `.ds-container` with no rail. Every other page uses `.ds-split`
(`layouts/index.html:17`, `layouts/cocktails/single.html:49`).

`design/DESIGN-SYSTEM.md` is explicit that this is what the width is for:

> **Layout.** Full bleed. […] Width is spent on a two-column `RailLayout`
> (profile or ingredients in a sticky rail, content beside it) — line 39

> `RailLayout` — the source site is a single narrow column; the two-column rail
> is this system's way of filling the page at desktop width — line 112

"The source site is a single narrow column" is the reporter's complaint verbatim.

## Acceptance criteria

Every one is checked in a real browser (Playwright, Chromium) against a real
`hugo --gc --minify` build, not `hugo server`.

| # | Criterion | How it is proved |
|---|---|---|
| AC1 | At 1512px the ink on `/cocktails/` reaches into the right half of the container — the page reads as filled, not as a left-hugging column | Measured: rightmost painted content in the archive region starts at x ≥ 60% of `.ds-container` width, vs. ~33% before |
| AC2 | The archive is still a two-column grid of date + title with a hairline rule per row | `getComputedStyle(.ds-dated__row).gridTemplateColumns` has two tracks; `borderBottomWidth` = 1px |
| AC3 | It still stacks to one column below 640px | At 375px, `gridTemplateColumns` is a single track |
| AC4 | Every recipe is still listed, newest first, each linking to its page | DOM: row count = number of pages in `content/cocktails/`; dates strictly descending; every `href` resolves to a built page |
| AC5 | Nothing under `themes/` changed | `git diff --stat origin/master -- themes/` is empty |
| AC6 | The build is clean under CI's flags | `hugo --gc --minify --printPathWarnings --panicOnWarning` exits 0 |
| AC7 | Coverage checks pass — no class emitted that nothing styles, no token read that nothing defines | `node scripts/style-coverage.mjs public`, `node scripts/token-coverage.mjs public` |
| AC8 | Internal links still resolve | `python3 scripts/check-links.py public` |
| AC9 | Colour-scheme behaviour and the axe accessibility sweep still pass | `cd tests/visual && npm test` |
| AC10 | No responsive regression across 3 engines × 6 viewports | `cd tests/visual && npm run test:responsive` |

## Out of scope

- Changing `design/tokens/**` — it is a read-only mirror (CLAUDE.md).
- Changing what the archive *contains* (no tags, no thumbnails, no excerpts).
  The issue asks about layout; adding content would be scope creep, and the
  design system rules out cards and hero images for this page.
- The 640px/600px and 820px/900px breakpoint discrepancies between
  `DESIGN-SYSTEM.md` prose and `utilities.css` — real, but a separate issue.

## Verification log

Run 2026-09-01 against `hugo v0.163.0+extended` and a fresh
`hugo --gc --minify --printPathWarnings --panicOnWarning` build, served over
plain HTTP (not `hugo server` — it injects LiveReload and unminified CSS).

| # | Result | Evidence |
|---|---|---|
| AC1 | **PASS** | Rightmost text ink in the archive, measured with a `Range` over the title/date text nodes at 1512×949: **before 608px (40% of the 1440px container), after 969px (65%)**. Threshold was 60%. |
| AC2 | **PASS** | At 1440px, `.ds-dated__row` → `grid-template-columns: 180px 758.422px`, `border-bottom-width: 1px`. Unchanged from before. |
| AC3 | **PASS** | 375px → `grid-template-columns: 335px` (one track). 640px → one track. 820px → two tracks with the rail stacked (`.ds-split`'s breakpoint), 1024px and 1440px → two tracks, rail beside. |
| AC4 | **PASS** | 14 rows at every viewport; `content/cocktails/` holds 14 recipes plus `_index.md`. `datetime` values strictly descending (`2026-08-08 … 2014-03-19`); every `href` starts `/cocktails/` and resolves (AC8). |
| AC5 | **PASS** | `git diff --stat origin/master -- themes/` → empty. |
| AC6 | **PASS** | Build exits 0, no path warnings, no panics. |
| AC7 | **PASS** | `style-coverage.mjs`: 91 classes emitted, "every emitted class is either styled or accounted for" — **no new allowlist entry**. `token-coverage.mjs`: 141 defined / 142 referenced, all accounted for. |
| AC8 | **PASS** | `check-links.py`: 22 pages, no broken internal links. |
| AC9 | **PASS** | `npm test` → 24/24 (colour scheme + axe). |
| AC10 | **PASS** | `npm run test:responsive` → 7/7 across chromium/firefox/webkit × 6 viewports. |

Also checked by eye, since the whole issue is "it looks wrong": 375px (stacked,
one column), 900px (rail beside a narrower list), 1512px light, 1512px dark.

### Caveat

`tests/visual/baseline.sh` / `check.sh` (the screenshot diff against
`origin/master`) was **not run**: port 1414 is held by an unrelated `hugo server`
in this workspace, and the script refuses rather than diff against a stale
server. It is not part of CI, its baseline is not committed, and it would report
a large intentional diff on `/cocktails/` by design. The per-viewport checks
above cover the same ground.

### Note for whoever picks up the next one

Two breakpoint numbers in `design/DESIGN-SYSTEM.md` disagree with
`design/tokens/utilities.css`: the prose says the rail collapses under 900px and
the dated index stacks under 600px; the CSS uses 820px and 640px. Harmless here,
but it means the doc cannot be read as authoritative on breakpoints. Out of
scope for #78.
