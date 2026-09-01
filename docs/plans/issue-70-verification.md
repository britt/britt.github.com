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

Filled in during step 7 of the workflow. Format: `V<n> — PASS/FAIL — evidence`.
