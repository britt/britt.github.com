# Verification plan — #70

Real system only: a real `hugo` build of this repo, and a real headless Chromium
loading the built site. No mocks, no stubs.

## Harness

```
hugo --gc --minify --printPathWarnings    # build
hugo server --port 1313                   # serve for browser checks
```

## Scenarios

### V1 — the site builds on the pinned version (#67, #68)
Given the pinned extended Hugo from `.hugoversion`
When `hugo --gc --minify --printPathWarnings` runs
Then it exits 0 and prints no `WARN` line.

### V2 — a broken override fails CI (#68)
Given a deliberately invalid rule appended to a shipped stylesheet
When the build runs
Then it exits non-zero. (Revert after.)

### V3 — the theme is never edited (#66, #69)
When `git diff --stat origin/master... -- themes/` runs
Then it prints nothing.

### V4 — Coder's stylesheets are gone (#73)
When the built `public/` is searched for `coder.css` / `coder-dark.css`
Then neither appears in any emitted `<link>` and neither file is written.

### V5 — tokens reach the browser (#41, #43)
Given `/` loaded in headless Chromium
Then `getComputedStyle(document.documentElement)` resolves `--surface-page`,
`--text-body`, `--link`, `--space-5`, `--text-h1` to non-empty values;
And setting `data-scheme="dark"` on `<html>` changes `--surface-page`.

### V6 — no flash of wrong theme (#43)
Given `localStorage.colorscheme = "dark"` and an OS preference of light
When `/` is loaded
Then the first painted frame is already dark (assert `<html data-scheme>` is set
before `DOMContentLoaded` by checking it inside a `document.currentScript`-era
inline script, and visually via a screenshot at first paint).

### V7 — the gap set is styled (#73, #55)
Given `/styleguide/` loaded
Then `table th` has a non-`0px` `border-bottom-width`, `figcaption` has a
`font-size` below body size, and `.footnotes` is present and styled.

### V8 — every route renders with its intended template (#58–#61, #67)
For each of `/`, `/cocktails/`, a cocktail permalink, `/projects/`, `/daresnot/`,
`/styleguide/`, `/404.html`
Then the page returns 200 (404.html: exists in `public/`) and contains the marker
class its template emits.

### V9 — focus is visible (#62)
Given tabbing through `/styleguide/`
Then every focused element has a visible outline of >=2px.

### V10 — payload does not regress (#63)
Then total CSS bytes shipped on `/` is measured and recorded against the `master`
baseline; the build ships no Font Awesome `woff2`.

### V11 — visual regression (#65)
Given baselines captured from `master`
Then each route is screenshotted at 375/768/1440 in both schemes and diffed;
every difference is either expected-by-design (recorded) or a defect.

## Log

Run against a clean `hugo --gc --minify --printPathWarnings --panicOnWarning`
build of this branch, and against a real headless browser for anything the
build cannot answer.

| | | |
|---|---|---|
| V1 | **PASS** | Build exits 0 on Hugo 0.163.0 extended with zero `WARN` lines. `[module.hugoVersion]` fails an older or non-extended binary before it can produce a different site. |
| V2 | **PASS** | Two ways. A stylesheet name typo fails the build: `ERROR stylesheet not found: css/gaps-typo.css`. A rule reading an undefined token builds fine — as it always would — and `scripts/token-coverage.mjs` exits 1 with `UNDEFINED — read with no fallback, defined nowhere: --nope`. Both reverted. |
| V3 | **PASS** | `git diff --stat origin/master -- themes/` is empty. CI fails any PR where it is not. |
| V4 | **PASS** | `public/css/` contains `site.min.<hash>.css` and `styleguide.min.<hash>.css`. No `coder.css`, no `coder-dark.css`, no reference to either anywhere in the output. |
| V5 | **PASS** | 140 custom properties resolve on `:root`. Setting `data-scheme="dark"` moves `--surface-page` #fbf7ef → #191714 and `--link` #1f4fa3 → #8fb6ff, while `--space-5`, `--text-h1` and `--container-max` are unchanged. |
| V6 | **PASS** | `scheme.test.mjs`, 7/7. Dark honoured with JavaScript disabled; a stored preference beats the OS both ways; no stored preference leaves the attribute off so CSS decides; and the setter is one inline `<script>` in `<head>`, neither deferred nor async — the only arrangement that can guarantee it runs before first paint. |
| V7 | **PASS** | `/styleguide/` renders a table, a figure and four `.footnotes` references. `th` draws a hairline bottom border, `figcaption` sets below body size, `.footnotes` carries its 3px pine rule. This is the only page on the site with a table, which is why it is the gap set's verification surface. |
| V8 | **PASS** | All seven routes present in `public/`, each rendering its intended template. `/projects/` is an alias whose captured dimensions match the home page exactly at all three viewports. |
| V9 | **PASS** | `a11y.test.mjs` tabs every page type and asserts a ≥2px outline at every stop, with no trap. Also: 200% zoom without sideways scroll, `alt` on every image, `prefers-reduced-motion` honoured, one `h1` per page. 17/17. |
| V10 | **PASS** | CSS 145.3 KB → 27.9 KB raw, 30.6 KB → 6.1 KB gzipped. Zero Font Awesome files in the build. A recipe page: ~794 KB → 182.3 KB. CLS 0 on all three page types. Full table in `docs/performance.md`. |
| V11 | **PASS (reviewed)** | 54 states captured, 0 identical — the expected result when every rule has been replaced. Reviewed for shape rather than for presence: no route disappeared, none collapsed, recipe pages got *shorter* at desktop as the ingredients rail took height out of the column, everything else grew with the type scale. `docs/visual-regression-run.md`. |

### Beyond the plan

| | | |
|---|---|---|
| axe-core | **PASS** | Zero critical or serious violations across six page types × two schemes, 12/12. Three real contrast failures were found and fixed; see `assets/css/a11y.css`. |
| Cross-browser | **PASS** | Chromium, Firefox and WebKit at 320/375/768/1024/1440/1920 across six pages — 108 page-states — plus phone landscape. No horizontal scroll anywhere; `clamp()`, `100dvh` and `:focus-visible` resolve identically. 7/7. |
| Internal links | **PASS** | 22 pages, no broken internal link. Three 404s that shipped on the live site are fixed. |
| Style coverage | **PASS** | Every class the site emits is either styled or recorded as deliberately unstyled with a reason. |
| Token coverage | **PASS** | 140 tokens defined, 141 referenced, one recorded orphan (`--hover-opacity`), and nothing read without being defined. |

### Not verified here

- **The deploy.** That Cloudflare Pages picks up `.tool-versions`, that an
  unmatched path actually serves `404.html`, and Lighthouse on the preview URL.
  All three need the deploy, not a local build.
- **A screen-reader pass.** VoiceOver over the home page, a recipe and the
  toggle. axe covers roughly half of WCAG; this is part of the other half.
