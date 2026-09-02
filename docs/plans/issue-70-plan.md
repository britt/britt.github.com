# Plan — #70 Adopt the Claude Design system across brittcrawford.com

Tracker: https://github.com/britt/britt.github.com/issues/70

## Working model

All 30 open leaf issues are implemented on one branch, one commit per issue, in the
order the tracker's sequencing diagram specifies. The branch opens as a single PR
against `master`; commits are the review unit.

**Assumption (workflow):** the tracker asks for a large, interdependent change set
(`#73` cannot build without `#41`; `#43` cannot be verified without `#73`). Splitting
into 30 PRs would produce a stack that cannot be reviewed or built independently.
One PR, reviewable commit-by-commit, is the narrowest workable unit. Recorded here
because it is a judgment call, not something the tracker states.

## Sequence

```
G #39 build & repo hygiene   → #66 #67 #68 #69
A #33 token foundation       → #41 #73 #43 #44
B #34 typography             → #45 #46 #47 #48
C #35 chrome & layout        → #49 #50 #51 #52 #53
D #36 components & icons     → #54 #55 #56 #57 #71
E #37 section pages          → #58 #59 #60 #61
F #38 quality gates          → #65 #63 #62 #64
```

`#65` (visual baseline) captures from `master` via a detached worktree before any
comparison, satisfying the tracker's "baselines before merge" constraint from a
branch.

## Findings that shape the work

### Theme provenance (#66)

Every one of the 252 tracked files under `themes/hugo-coder/` hashes to a blob that
exists in upstream `luizdepra/hugo-coder`. The tree matches upstream commit
`70c0792` (2025-05-27), an ancestor of `v1.2`. **There are zero local modifications**
— nothing to upstream or preserve. Resolution (a), keep vendored, is therefore free.

Verified with:

```
git ls-files themes/hugo-coder | while read f; do
  git cat-file -e "$(git hash-object "$f")" --git-dir=<upstream> || echo "LOCAL: $f"
done
# checked=252 local-only=0
```

### Layout conventions (#67)

The vendored theme predates Hugo 0.146's template reorganisation: it ships
`layouts/_default/`, `layouts/partials/`, `layouts/index.html`. Upstream `v1.2` has
migrated to `layouts/_partials/`, `home.html`, `single.html`, `list.html`.

Consequence: **root overrides must use the theme's era of paths, not 0.163's**, or
Hugo's lookup will resolve the theme's file and silently ignore ours. New root
templates therefore go in `layouts/_default/` and `layouts/partials/`, matching what
the theme actually declares. Both spellings resolve on 0.163+; only the old one
resolves on the theme's own structure.

### Design export completeness (#41, #73)

`design/tokens/*.css` is a complete style layer, not a token dump: `base.css` styles
`html`/`body`/`a`/`h1..h6`/`p`/`code`/`pre`/`blockquote`/`hr`/`img`, and
`chrome.css` already maps Coder's structural classes (`.wrapper`, `.container`,
`.content`, `.title`, …) onto the token vocabulary. This is why `#42` was closed as
superseded and `#73` (full cutover) replaces it.

## Per-issue plan

| # | Change | Files |
|---|---|---|
| 66 | Delete `.gitmodules`; drop submodule from `conductor.json` setup; document vendored+read-only | `.gitmodules`, `conductor.json`, `README.md` |
| 67 | Pin extended Hugo in-repo; record decision | `.hugoversion`, `hugo.toml`, `README.md` |
| 68 | CI workflow: pinned Hugo, build, fail on warnings, link check | `.github/workflows/build.yml` |
| 69 | Override rule + token architecture docs | `CLAUDE.md`, `README.md` |
| 41 | Token layer as SCSS partial emitting custom properties | `assets/scss/_tokens.scss` |
| 73 | Ship design-system CSS; stop emitting `coder.css`/`coder-dark.css`; `data-theme="playful"` | `assets/scss/main.scss`, `layouts/partials/head/*`, `layouts/_default/baseof.html` |
| 43 | Dark mode = token swap on `data-scheme`; blocking inline head script kills the flash | `layouts/partials/head/color-scheme.html`, `assets/js/theme.js` |
| 44 | `/styleguide` page rendering every token | `content/styleguide.md`, `layouts/_default/styleguide.html` |
| 45 | Self-host Public Sans + Fira Code; drop remote `@import` | `assets/fonts/**`, `assets/scss/_fonts.scss` |
| 46 | Remove `62.5%` root; adopt the px ramp | `assets/scss/_tokens.scss` |
| 47 | Prose: headings, paragraphs, links, lists, footnotes | `assets/scss/_content.scss` |
| 48 | Chroma classes driven by `--code-*` tokens; regenerate | `assets/scss/_syntax.scss`, `hugo.toml` |
| 49 | Container, gutter, rhythm, breakpoint tokens | `assets/scss/_tokens.scss` |
| 50 | Header rebuild + navigation decision | `layouts/partials/header.html` |
| 51 | Footer rebuild | `layouts/partials/footer.html` |
| 52 | Theme toggle as a real `<button>` with `aria-pressed` | `layouts/partials/float.html`, `assets/js/theme.js` |
| 53 | Home layout; fix hardcoded `#000` social icons | `layouts/index.html` |
| 54 | Inline SVG icons; drop Font Awesome | `layouts/partials/icon.html`, `assets/svg/**` |
| 55 | Blockquote, `hr`, table, image, figure | `assets/scss/_content.scss` |
| 56 | Annotated link-list component | `layouts/_shortcodes` / partial + CSS |
| 57 | Drop notices, tabs, taxonomies, pagination CSS | (nothing imported — verify) |
| 71 | Emit `data-theme`/`data-list-mark`/etc. the playful selectors need | templates |
| 58 | Cocktails index as card grid | `layouts/cocktails/list.html` |
| 59 | Cocktail single template | `layouts/cocktails/single.html` |
| 60 | Generic page template; home/projects duplication | `layouts/_default/single.html`, `content/projects.md` |
| 61 | 404 | `layouts/404.html` |
| 65 | Playwright visual baseline from `master` + compare harness | `tests/visual/**` |
| 63 | Payload budget; measure before/after | `docs/performance.md` |
| 62 | A11y audit + fixes | — |
| 64 | Responsive/cross-browser QA | `docs/qa.md` |

## Risks

- **Silent style loss.** Dropping `coder.css` removes styling for any selector the
  design layer does not cover. `#73` names `table`, `figure`, `.footnotes`; the
  `#65` baseline is the instrument for finding the rest.
- **Template lookup.** See "Layout conventions" above — an override in the wrong
  directory fails silently, rendering the theme's version.
- **Remote `@import`.** `@import` must be the first rule in a stylesheet.
  Concatenating token files in the wrong order drops the fonts with no error.
  `#45` removes the problem by self-hosting.
