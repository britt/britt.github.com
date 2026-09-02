# Visual regression harness

The redesign rewrites essentially every CSS rule on the site across
9 routes × 2 schemes × 3 viewports. Spot-checking will not find what it breaks.

```
./baseline.sh          # capture the "before" from origin/master
./check.sh             # capture the working tree and diff it
npm test               # colour-scheme behaviour and the accessibility sweep
npm run test:responsive # three engines x six viewports x six pages
```

`check.sh` exits non-zero if anything differs. During a redesign that is the
point: every difference is either a defect or a deliberate change that should be
re-baselined on purpose, and neither should pass in silence.

## The baseline is regenerated, not committed

`baseline.sh` checks the ref out into a detached worktree, serves it, and
captures from that. So the baseline is a **function of a git ref**, not a stored
artifact, and `origin/master` can be re-captured at any point in the future.

The screenshots themselves are gitignored. A full set is ~16 MB, and #65 asks
for re-baselining after each epic — committing would add another ~16 MB blob
every time, to a repository whose entire working tree is 30 MB.

This departs from #65's literal "committed before redesign work merges". It
satisfies the requirement behind it — that the "before" stay recoverable once
`master` moves — provided `master`'s history survives, which is a weaker
assumption than the repository surviving at all.

⚠️ Regenerating gives byte-identical results only for a fixed Chromium build.
Compare a baseline and a capture taken with the **same** Playwright version;
after a Playwright upgrade, re-run `baseline.sh` before trusting a diff.

## What is pinned for determinism

| Source of noise | How it is pinned |
|---|---|
| Transitions and animations | Overridden to `none` after load, and `reducedMotion: "reduce"` |
| Webfont load timing | `await document.fonts.ready` before capture |
| Lazy images | Page is scrolled to the bottom and back, then all `<img>` awaited |
| Gravatar | Third-party request intercepted, blank pixel served |
| Colour scheme | `localStorage.colorscheme` seeded *and* `colorScheme` emulated |
| Device pixel ratio | Forced to 1 |

## `scheme.test.mjs`

Screenshot diffing cannot see whether dark mode still works with JavaScript
disabled, whether a stored preference beats the OS setting, or whether the
attribute that carries it is set before the first paint. Those are asserted
directly against a running `hugo server`:

```
BASE=http://127.0.0.1:1313 npm test
```

The no-flash test is structural rather than temporal — "before first paint" is
not observable after load, so it asserts the only arrangement that can
guarantee it: exactly one inline `<script>` in `<head>`, neither `defer` nor
`async`.

## `a11y.test.mjs`

axe-core over every page type in both schemes, plus the parts of an audit that
have to be driven rather than scanned: keyboard traversal with no trap and a
visible ring at every stop, 200% zoom without sideways scrolling, `alt` on every
image, `prefers-reduced-motion`, and one `h1` per page.

Both schemes, because the redesign changes every colour pair twice over and
contrast does not survive a theme swap. Critical and serious violations fail the
run; moderate and minor are printed so a regression in them is visible without
blocking on a judgement call.

## `responsive.test.mjs`

Chromium, Firefox and WebKit at 320, 375, 768, 1024, 1440 and 1920, plus phone
landscape. Asserts that no page scrolls sideways, that the footer sits on the
bottom edge of a short page, that `clamp()`, `100dvh` and `:focus-visible` all
resolve, and that no long slug or URL overflows its column at 320px.

Overflow is measured by ignoring anything inside a container whose computed
`overflow-x` scrolls — a code block and a table wrapper are both allowed to be
wider than the screen. The page is not, and `scrollWidth` covers that.

## Reading the diff

`diff/report.md` is a table sorted by how much changed. `diff/*.png` highlights
the differing pixels. Full-page screenshots change height whenever spacing
changes, so a height change shows up as a large diff rather than an error — check
`baseline`/`current` dimensions in the report before assuming a rule broke.
