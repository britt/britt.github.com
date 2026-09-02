# Verification plan — #77

Real system only: a real `hugo --gc --minify` build of this repo, served over
HTTP, loaded in a real headless Chromium. No mocks, no stubs, no `hugo server`
(it injects LiveReload and serves unminified CSS — see CLAUDE.md).

## Harness

```
hugo --gc --minify --printPathWarnings --panicOnWarning   # build
(cd public && python3 -m http.server 8099)                # serve
```

Browser checks run at 1512×949 (the viewport in the issue's screenshots) unless
a scenario says otherwise. Pages under test:

- `/cocktails/peach-pepper-jelly-julep/` — the page in screenshot 1
- `/cocktails/envejeciendo/` — the page in screenshot 2
- `/cocktails/bitter-nonsense/` — all-caps ingredients, `1 ½ oz` measures
- `/cocktails/anderson-island-sunset/` — an ingredient with no measure at all
- `/cocktails/protein-g1/` — the longest ingredient name on the site

## Scenarios

### V1 — the site still builds clean
When `hugo --gc --minify --printPathWarnings --panicOnWarning` runs
Then it exits 0 and prints no `WARN` line.

### V2 — the theme is untouched
When `git diff --stat origin/master... -- themes/` runs
Then it prints nothing.

### V3 — the page uses its width (issue: "fills less than half the browser width")
Given `/cocktails/peach-pepper-jelly-julep/` at 1512px
Then `.ds-split` is at least 95% as wide as `.recipe`
(before: 814px inside a 1319px container = 62%);
And the prose column `.recipe__body` is at least 700px wide
(before: 453px ≈ 39 characters).

### V4 — no ingredient hairlines (issue: "a hairline rule under every single item")
Given each page under test
Then no `.recipe__ingredients li` has a computed `border-bottom-width` other
than `0px`.

### V5 — the rail is not all monospace (issue: "everything set in monospace")
Given each page under test
Then every `.recipe__ingredients li` resolves `font-family` to the body sans
face, and every `.recipe__amount` inside it resolves to the mono face;
And at least one `.recipe__amount` exists on every page under test.

### V6 — measures are still verbatim (RecipeList contract)
Given each of the 14 recipe pages
When the rail's rendered text is normalised (collapse whitespace, drop the
`Ingredients` heading, drop any `of ` the split consumed)
Then it contains every ingredient line from the source Markdown, in order, with
its measure spelled exactly as authored (`1/2oz`, `1 ½ oz`, `1 TBSP`, `16 oz.`).
No ingredient is dropped, reordered, or re-spelled.

### V7 — ingredients with no measure survive
Given `/cocktails/anderson-island-sunset/`
Then the rail contains `Some (enough) Frozen Blueberrries` as a single item with
no `.recipe__amount`, spanning the full rail width (its `<span>` starts at the
same x as the amounts above it, not indented into the second column).

### V8 — the heading is a heading (issue: "leftover debug labels")
Given each page under test
Then `.recipe__ingredients-heading` resolves `font-family` to the display face
(Bricolage Grotesque), a `font-size` of at least 20px, and is not
`text-transform: uppercase`.

### V9 — the recipe card reads as an artifact (issue: "third typeface")
Given each page under test that has a card
Then the `<figure>` carries `recipe__card`, renders no wider than 420px (it is a
1125×2001 poster — at the full measure it would be 1448px tall), carries a
visible `<figcaption>`, and has a non-zero border width on its `<img>`.

### V10 — the rail collapses on mobile
Given `/cocktails/peach-pepper-jelly-julep/` at 390×844
Then `.recipe__rail` and `.recipe__body` start at the same x (one column),
`.recipe__rail` is not `position: sticky`, and nothing overflows horizontally
(`document.documentElement.scrollWidth <= innerWidth`).

### V11 — both colour schemes
Given each page under test in light and in dark
Then no text in the rail, the heading, the caption or the nav resolves to a
colour that is not defined in the active scheme (spot-check that
`.recipe__amount` colour differs between schemes, i.e. it is token-driven, not
a hard-coded hex).

### V12 — the project's own checks
```
node scripts/check-links.py public
node scripts/style-coverage.mjs public
node scripts/token-coverage.mjs public
```
Then all three exit 0 — every class the new markup emits has a rule, and every
token it reads is defined.

### V13 — accessibility and responsive suites
```
cd tests/visual && npm test && npm run test:responsive
```
Then both pass. (`a11y.test.mjs` is the axe sweep; `responsive.test.mjs` is
3 engines × 6 viewports × 6 pages.)

### V14 — it actually looks right
Screenshots of `/cocktails/peach-pepper-jelly-julep/` and
`/cocktails/envejeciendo/` at 1512×949, light and dark, compared against the
two attached to the issue.

### V15 — the page has the navigation the system gives it
`ui_kits/personal-site/RecipePage.jsx` ends its `aside` with one link,
`← All cocktails`, in `var(--font-mono)` at `var(--text-xs)`, and carries no
other navigation. None of the system's seventeen components is a pager.

Given each page under test
Then `.recipe__nav` contains **exactly one** `<a>`, reading `← All cocktails`
and pointing at the section index;
And it is the **last child of `.recipe__rail`**, not inside `.recipe__body`;
And it resolves to the mono face at 14px with `border-top-width: 0px`;
And the document contains no `[rel=prev]`, no `[rel=next]` and no
`.recipe__nav-siblings`;
And the last thing in the content column is the recipe's own last element.

## Verification log

Run 2026-09-01 and re-run in full 2026-09-02 after the navigation fix, against
`hugo v0.163.0+extended` and Playwright's Chromium, serving a real
`hugo --gc --minify` build over `python3 -m http.server`.

| | Scenario | Result | Evidence |
|---|---|---|---|
| V1 | builds clean | **PASS** | exit 0, 26 pages, no `WARN` |
| V2 | theme untouched | **PASS** | `git diff --stat origin/master... -- themes/` printed nothing |
| V3 | page uses its width | **PASS** | `.ds-split` 1319/1319px = **100%** of `.recipe` on all five pages (was 814px = 62%); `.recipe__body` **879px**, prose measure 814px (was 453px) |
| V4 | no ingredient hairlines | **PASS** | every `.recipe__ingredients li` computes `border-bottom-width: 0px`, all five pages |
| V5 | rail is not all monospace | **PASS** | every `.recipe__item` → Public Sans, every `.recipe__amount` → Fira Code; 4/10/6/5/3 amounts found on the five pages |
| V6 | measures verbatim | **PASS** | **89 ingredient lines across all 14 recipes, 0 mismatches**, every rendered line reconstructs its source line and every amount is a verbatim prefix of it — `2oz`, `1/2oz`, `1 ½ oz`, `16 oz.`, `1 TBSP`, `½ PINCH` all unchanged |
| V7 | measureless ingredients survive | **PASS** | 6 of the 89 kept whole; `Some (enough) Frozen Blueberrries` renders as one `.recipe__ingredient--plain` starting at x=96, the same x as the amounts above it |
| V8 | heading is a heading | **PASS** | Bricolage Grotesque, 26px, `text-transform: none`, `rgb(31,79,163)` = `--heading-2` (7.26:1 on paper) |
| V9 | card reads as an artifact | **PASS** | `.recipe__card` 400px on all five, `<figcaption>Recipe card</figcaption>`, `img` border 1px |
| V10 | rail collapses on mobile | **PASS** | 390×844: rail and body both x=20, `position: static`, `scrollWidth` 390 = `innerWidth` 390, card 350px, long names wrap inside their cell |
| V11 | both schemes | **PASS** | `.recipe__amount` `rgb(185,61,24)` light (`--clay-deep`, 5.25:1 on `--paper`) → `rgb(255,166,131)` dark (9.4:1 on `#191714`); token-driven, no hard-coded value |
| V12 | project checks | **PASS** | `check-links.py`: 22 pages, no broken links. `style-coverage`: 92 emitted / 202 styled, nothing unaccounted for. `token-coverage`: 142 defined / 143 referenced, all accounted for |
| V13 | a11y + responsive suites | **PASS** | `npm test` 24/24 (axe light+dark on 6 pages, keyboard, 200% zoom, alt text, one h1). `npm run test:responsive` 7/7 (chromium/firefox/webkit × 6 viewports × 6 pages) |
| V14 | it looks right | **PASS** | `.context/issue-77/issue-77-after-{julep,envejeciendo,dark,mobile}.png` and `issue-77-nav-{after,mobile}.png` against the two in the issue |
| V15 | the system's navigation | **PASS** | all four pages: **1** link, `← All cocktails` → `/cocktails/`, last child of `.recipe__rail`, Fira Code 14px, `border-top-width: 0px`; no `[rel=prev]`/`[rel=next]`/`.recipe__nav-siblings` anywhere; content column now ends on the recipe's own last element |

⚠️ `CLAUDE.md` documents V12's first check as `node scripts/check-links.py`. It
is a Python script; `node` fails on the docstring. Run it with `python3`.
Not changed here — it is not this issue.
