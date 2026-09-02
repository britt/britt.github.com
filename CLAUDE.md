# brittcrawford.com

A Hugo site. Personal, small, mostly long-form Markdown link lists and cocktail
recipes.

## The one rule: never edit anything under `themes/`

`themes/hugo-coder/` is vendored — its files are committed into this repository,
tracked from upstream at commit `70c0792`, with **zero local modifications**. It
is not a submodule; `git submodule status` prints nothing.

Hugo resolves `assets/` and `layouts/` from the project root *before* the theme,
so a file at the root **shadows** the theme's copy of the same path. That is the
only supported way to change the theme's behaviour:

```
layouts/partials/footer.html      shadows themes/hugo-coder/layouts/partials/footer.html
layouts/_default/baseof.html      shadows themes/hugo-coder/layouts/_default/baseof.html
layouts/partials/head/extensions.html   shadows an empty extension point
```

Editing the theme in place looks like it works and silently makes it
unupgradable. CI fails any pull request that changes a file under `themes/`.

⚠️ **Shadowing replaces, it does not merge.** A shadowed template is the whole
template — anything the theme's version did that yours does not, stops
happening. Every shadowed file here opens with a comment saying what it shadows
and what it changed, so a future theme refresh can be diffed rather than
re-derived.

The theme is imported as a Hugo module with explicit mounts for `layouts` and
`i18n` only (see `hugo.toml`). Its `assets/` and `static/` are deliberately not
mounted — nothing uses them, and its `static/` is where Font Awesome's 984 KB of
fonts lived.

## How styling works

There is no SCSS. The site compiles no Sass at all.

```
design/tokens/*.css          the design system, mirrored from Claude Design
   │                          (read-only — see design/README.md)
   ├── mounted into assets/ds/  by [[module.mounts]] in hugo.toml
   ▼
assets/css/fonts-local.css   @font-face for the four self-hosted faces
assets/css/gaps.css          markup the export didn't anticipate
assets/css/pages.css         this site's page composition
assets/css/a11y.css          contrast corrections, with measurements
   │
   ▼
layouts/partials/head/theme-styles.html
   concatenates them in order, strips the export's remote @imports,
   derives the no-JS dark fallback, minifies, fingerprints, adds SRI
   ▼
one <link rel="stylesheet"> per page
```

Order is load-bearing — later files override earlier ones. `fonts-local.css` is
first, `a11y.css` last.

### Where a change belongs

| Changing | Edit |
|---|---|
| A colour, size, space, radius — anything the design system defines | Nothing here. Change it upstream in Claude Design and re-export `design/`. |
| A rule the design system doesn't cover because Coder's templates emit the markup | `assets/css/gaps.css` |
| How *this site's* pages are assembled from the system's primitives | `assets/css/pages.css` |
| A colour value that fails WCAG as exported | `assets/css/a11y.css`, with the measurement in a comment |
| Markup | `layouts/**`, shadowing the theme |

**Never edit `design/tokens/`.** It is a mirror of the Claude Design project;
edits there are lost on the next export and make the mirror untrustworthy. If
the design system is wrong, it is wrong upstream.

### Tokens are CSS custom properties, not build-time values

That is the point: one declaration serves both colour schemes. Dark mode is a
token swap under `:root[data-scheme="dark"]`, not a second stylesheet — Coder
shipped a complete duplicate of every rule, and it is gone.

`data-scheme` is absent by default, and its absence is meaningful: it means
"follow the OS", which the stylesheet answers in pure CSS via a
`prefers-color-scheme` block **derived at build time from the dark rules
themselves**. So dark mode works with JavaScript disabled, and a stored
preference always wins because `:not([data-scheme])` stops matching the moment
one is set.

### Refreshing the design system

`design/README.md` has the full process. In short: the source needs an
interactive login (`/design-login` in an interactive Claude Code terminal), then
`DesignSync` `list_files` / `get_file`. It cannot be fetched headlessly.

After a refresh, run the checks — they exist to catch what a refresh silently
breaks:

```
node scripts/token-coverage.mjs public   # a token nobody reads didn't ship
node scripts/style-coverage.mjs public   # a class nothing styles renders wrong
```

### Why there is no SCSS variable bridge

An earlier plan shadowed the theme's `_variables.scss` and pointed each `$var`
at a `var(--token)`. It was viable — the theme applies no SCSS colour functions
to its variables, so `darken($bg-color, 10%)` never had to work — but it was
abandoned. `design/tokens/base.css` and Coder's `_base.scss` style almost the
same set of elements, so keeping both meant two base layers competing on cascade
order, with the winner decided by `@import` sequence rather than by intent.

Do not reintroduce it, and do not add `darken()`/`lighten()` anywhere: a SCSS
colour function cannot operate on `var(--token)`, and the build would fail.

## Local development

Hugo **0.163.0 extended**, pinned in `.hugoversion`, `.tool-versions`, and
enforced by `[module.hugoVersion]` in `hugo.toml` — an older or non-extended
binary fails the build rather than producing a different site.

```
hugo server               # or: the "run" script in conductor.json
hugo --gc --minify --printPathWarnings --panicOnWarning   # what CI runs
```

The vendored theme predates Hugo 0.146's template reorganisation, so **root
overrides use the pre-0.146 paths** (`layouts/_default/`, `layouts/partials/`,
`layouts/index.html`), matching what the theme declares. Mixing conventions is
how an override lands in a directory Hugo never looks in and silently renders
the theme's version instead.

⚠️ `hugo server` is not a measurement surface. It injects an 80 KB LiveReload
script and serves unminified CSS with source maps. Measure against a real build.

## Checks

```
node scripts/check-links.py public       # internal links that point at nothing
node scripts/style-coverage.mjs public   # emitted classes nothing styles
node scripts/token-coverage.mjs public   # defined tokens nothing reads,
                                         # and tokens read but never defined
cd tests/visual
npm test                 # colour scheme behaviour + axe accessibility sweep
npm run test:responsive  # chromium/firefox/webkit x 6 viewports x 6 pages
./baseline.sh            # visual baseline from origin/master
./check.sh               # screenshot diff against it
```

All of these run in CI except the screenshot diff, whose baseline is regenerated
from a git ref rather than committed (`tests/visual/README.md` explains why).

Both coverage checks read an allowlist — `scripts/*-allow.json` — where each
deliberate exception carries a reason. Silencing one means writing an argument
into a diff, which is the point.

## `/styleguide`

`content/styleguide.md` + `layouts/_default/styleguide.html`. Excluded from
listings with `build.list = never`, still reachable.

It renders **every token in `design/tokens/`**, read out of the CSS at build
time rather than typed into the template — a hand-maintained styleguide drifts
the first time a token is added, and a drifted styleguide reports a system that
no longer exists. Values and contrast ratios are resolved in the browser, so
they describe what is on screen in the theme and scheme you are looking at.

**Add new components here.** It is the densest regression target on the site and
the only page that renders a table, a figure and a footnote together, which is
what makes it the place the design system's edges get checked.

## Theme features that no longer ship by default

Coder's notice, tab and taxonomy CSS is **not** in the main stylesheet — no
content uses those shortcodes and `[taxonomies]` is commented out. It is emitted
per page instead, on any page that uses one, so using
`{{< notice >}}` / `{{< tabgroup >}}` still renders correctly rather than
producing a silently unstyled page.

Genuinely gone:

| | |
|---|---|
| Font Awesome | Words instead of icons — the design system has no icon set. Where a glyph is unavoidable, use a plain Unicode character already on the site: `↗` external links, `↩︎` footnote returns. |
| `normalize.css` | `design/tokens/base.css` opens with a modern reset. |
| Right-to-left layout | `params.rtl` would produce an LTR page with an `rtl` class. Unsupported, not half-working. |
| `coder.js` | Replaced by `assets/js/theme.js`. The original also carried Giscus, Utterances and Mermaid plumbing this site does not use. |

## Adding a cocktail

```
hugo new cocktails/your-drink-name        # note: no /index.md
```

That copies the `archetypes/cocktails/` bundle archetype and produces the right
shape. Adding `/index.md` to the path makes Hugo fall back to
`archetypes/default.md` and give you a bare stub instead. By hand:

```
content/cocktails/your-drink-name/
└── index.md
static/img/cocktails/your-drink-name.png
```

```yaml
---
title: "Your Drink Name"     # plain string, becomes the h1
date: 2026-09-01             # drives the archive order on /cocktails/
---
```

`title` and `date` are the only front matter a recipe needs.

Then: a sentence or two of intro, **the ingredients as the first list on the
page**, the method as a paragraph, and the recipe card image last.

⚠️ **The first `<ul>` on the page is lifted into the rail** by
`layouts/cocktails/single.html` — that is how ingredients end up beside the
prose. An `### Ingredients` heading is optional; the template supplies its own
either way. If the ingredients are not the first list, they stay in the body and
the page still renders, just without the rail.

Images: drop the file in `static/img/cocktails/` and reference it by absolute
path. `static/img` is mounted into `assets/` so the render hook can resize it to
three widths, convert to WebP and emit `srcset` — you do not do any of that by
hand. Give every image a real `alt`; a test fails on a missing one.

Filenames must match: `peach-pepper-jelly-julep.png` sat next to a recipe asking
for `...-julep.png` while the file said `...-julip.png`, and the recipe had no
image for months. The link checker catches this now.

## Front matter this site actually uses

`.doc.holiday/styleguide.md` is generated and its front-matter template is
partly wrong — it recommends `path`, which is not a Hugo key at all (`url` and
`slug` are), and `tags`/`categories`, for taxonomies that are commented out.
What the templates read:

| Key | Where | Notes |
|---|---|---|
| `title` | everywhere | Plain string, becomes the `h1`. No markup. |
| `date` | cocktails | Orders the archive. `YYYY-MM-DD`. |
| `description` | optional | Meta description. |
| `layout` | `/styleguide/` | Selects `layouts/_default/<layout>.html`. |
| `aliases` | `content/_index.md` | Keeps `/projects/` redirecting to `/`. |
| `build.list` | `/styleguide/` | `never` — out of listings, still reachable. |
| `draft` | any | Unpublished until `false`. |

## Layout vocabulary

The design system's primitives, all in `design/tokens/utilities.css`:

| Class | What |
|---|---|
| `.ds-page` / `.ds-container` | Page frame and the fluid-gutter container |
| `.ds-split` | Rail + content, collapsing to one column at 820px |
| `.ds-profile` | The home page masthead |
| `.ds-dated` / `.ds-dated__row` | The cocktails archive |
| `.ds-cols` | Multi-column list grid |
| `.ds-scroll` | Wrapper that lets a table scroll instead of the page |

`[data-prose]` marks running prose. It carries two things: the reading measure,
and the link-underline rule that makes links distinguishable without hover.
**Put it on containers of body copy and nowhere else** — the design system keeps
titles, the wordmark and the social row plain on purpose.
