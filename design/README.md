# Design system mirror

Local, offline copy of the Claude Design project that drives the site redesign.

## Provenance

| | |
|---|---|
| **Project** | brittcrawford.com Design System |
| **Project ID** | `2a40bf64-878f-4a85-9f83-e2a4df491326` |
| **Source** | <https://claude.ai/design/p/2a40bf64-878f-4a85-9f83-e2a4df491326> |
| **Owner** | Britt Crawford |
| **Exported** | 2026-09-01, via the `DesignSync` tool |
| **UI kit copy fetched from the live site** | 2026-08-26 (per `ui_kits/personal-site/README.md` upstream) |

## What's here

| Path | What |
|---|---|
| `styles.css` | Entry point — `@import`s the token files in order |
| `tokens/*.css` | **The canonical token set.** All 8 files, verbatim |
| `components/**/*.prompt.md` | Usage contract for each of the 17 components |
| `DESIGN-SYSTEM.md` | The upstream `readme.md`, verbatim — visual foundations, content voice, iconography rules |

## What's deliberately *not* mirrored

Fetch these from the source project as needed; they are reference material, not build inputs.

- `components/**/*.jsx` and `*.d.ts` — React implementations. This site is Hugo/Go templates, so the `.prompt.md` contracts plus the token CSS are the useful part. Pull a `.jsx` when you need exact markup for a component.
- `ui_kits/personal-site/*.html` — rendered example pages for the three page types (`home.html`, `section-index.html`, `article.html`, `mobile.html`, plus `home-playful.html` / `section-index-playful.html`). **Worth fetching when building the corresponding Hugo template** — they show final markup and class usage.
- `guidelines/*.card.html` — 24 specimen cards.
- `templates/` — `Home.dc.html`, `CocktailIndex.dc.html`, `RecipePage.dc.html`.
- `assets/` — empty upstream by design. The portrait is an off-site Gravatar; recipe photos are the author's own.

## Refreshing

The source needs an interactive login; it cannot be fetched headlessly.

1. Run `/design-login` in an interactive Claude Code terminal.
2. `DesignSync` `list_files` on the project id above, then `get_file` per path.
3. Overwrite the files here and update the **Exported** date in this table.

## Rules for this directory

- **Treat everything here as read-only.** It is a mirror. Edits belong upstream in Claude Design, then get re-exported — otherwise the two drift and the mirror stops being trustworthy.
- The token CSS is the input to `assets/scss/_tokens.scss`, not a stylesheet the site loads directly. See the token-layer issue for how it is consumed.

## Integration notes for this repo

Things the export settles that the redesign issues had left open or assumed wrongly:

- **Dark scope is `:root[data-scheme="dark"]`.** The Coder theme's `coder.js` sets `body.colorscheme-dark` / `.colorscheme-light`. These do not match; one side has to be adapted.
- **Fonts load from the Google Fonts CDN** via `@import` in `tokens/fonts.css` — Public Sans + Fira Code. Upstream vendors no font binaries. Self-hosting is a deliberate deviation, not a default.
- **`--container-max: 1440px`, full-bleed with fluid gutters.** Not the theme's 900px ribbon.
- **No icon set, no logo, no cards, no shadows.** Social links are plain words (GITHUB, LINKEDIN); the theme toggle is the word "dark" / "light".
- **The cocktails index is a dated archive list (`DatedList`), not a card grid.**
- **`RecipeList` is the ingredients list on a recipe page**, not a list of recipes.

## Verified gaps in the export

`tokens/utilities.css` references three custom properties that **no token file defines**:

| Property | Used by | Note |
|---|---|---|
| `--col-min` | `.ds-cols` | Grid column floor. `layout.css` defines `--grid-min` / `--grid-min-wide` but not this. |
| `--sidebar` | `.ds-split`, `.ds-section` | Rail width. `layout.css` defines `--rail-basis`. |
| `--container-max-wide` | `.ds-container--wide` | No analogue defined. |

Upstream these are supplied per-instance by the React components (inline `style`), not by the token layer. Any Hugo template using `.ds-cols`, `.ds-split`, `.ds-section`, or `.ds-container--wide` **must set them** or the grid silently collapses — `grid-template-columns: repeat(auto-fill, minmax(<invalid>, 1fr))` drops the whole declaration.

Checked with a resolver over all 8 token files: 122 defined, 84 referenced, these 3 unresolved. Everything else resolves and all brace pairs balance.

## Decision: the `playful` variant is what ships

Decided 2026-09-01. The site renders with `data-theme="playful"` on `<html>` at all times; the neutral default is the **base layer only**, never a surface a visitor sees.

Base tokens are still required — `playful.css` overrides a subset and inherits the rest (the whole type ramp, spacing, radii, motion, and `utilities.css` layout all come from the base files). Do not delete them.

### What this changes

- **`<html>` carries two attributes**, not one: `data-theme="playful"` always, plus `data-scheme="dark"` when dark. The dark rules are scoped `[data-theme="playful"][data-scheme="dark"]`, so a missing `data-theme` silently drops the entire dark palette.
- **Prose links are underlined at rest** — 2px clay underline, taking the link colour on hover. This is a different link model from the base theme.
- **Blockquotes are not italic** under playful: lapis tint background, 4px left border, `--radius-md` padding box, `font-style: normal`.
- **Headings take a colour per level** (see the contradiction below).
- **A second Google Fonts import** is pulled in for the display face.

### Verified problems to handle

**1. Two of the three imported fonts are never used.** `playful.css` imports three families:

```
family=Bricolage+Grotesque:opsz,wght@12..96,400..800
family=Space+Grotesk:wght@400..700
family=Instrument+Serif:ital@0;1
```

Only **Bricolage Grotesque** is referenced (`--font-display`). Space Grotesk and Instrument Serif appear nowhere in any token file. Strip them from the `@import` — they are two entire families of dead payload.

**2. The heading colours in the CSS contradict the prose.**

| | h1 | h2 | h3 | h4+ |
|---|---|---|---|---|
| `playful.css` (authoritative) | **clay** | **lapis** | **pine** | **amber-deep** |
| `DESIGN-SYSTEM.md` prose | ink | clay | pine | lapis |

Only h3 agrees. **Trust the CSS** — same rule as the breakpoint disagreement noted above.

**3. Eighteen playful tokens are defined but wired by no CSS rule.** Upstream's React components apply them inline; a Hugo template gets nothing for free. Every one of these must be wired by hand or the theme renders half-applied:

`--header-rule` · `--header-rule-width` · `--wordmark-color` · `--avatar-bg` · `--avatar-fg` · `--date-color` · `--list-mark-color` · `--footnotes-rule` · `--footnotes-rule-width` · `--lapis-deep` · and all eight `--tag-*-bg` / `--tag-*-fg` pairs.

**4. The section-heading colour chip needs a layout property the CSS doesn't set.** `h2[data-section]::before` uses `flex:0 0 auto` and `align-self:center`, which do nothing unless the heading itself is `display:flex`. Nothing in any token file sets that. The template must.

**5. List markers must be real elements.** Playful cycles marker colour through the palette via `li:nth-child(4n+k) [data-list-mark]`. A CSS `::marker` cannot be targeted this way — emit a `<span data-list-mark>—</span>`.

### Accepted risk

The base theme's colour-only link identification (~2.3:1 link-vs-body-text) was reviewed and **accepted** — and it is largely moot here, since playful underlines prose links at rest. Absolute-`px` type sizing is likewise accepted; page zoom works, browser font-size settings do not scale.

## Previewing locally

`preview.html` renders the shipping (`playful`) variant against real site content — profile
masthead, annotated link lists, blockquote, dated cocktails archive, code, tinted section,
heading colour ramp, palette. It has a light/dark toggle.

Standalone; no Hugo, no build step, no server:

```sh
open design/preview.html          # macOS
```

Needs network access for the Google Fonts `@import`. Hugo does not publish `design/`, so
this file never reaches the live site.

**What it is honest about.** The `<style>` block at the top of the file is hand-wired and is
*not* part of the design system's CSS — it supplies the 18 orphan tokens and the `data-*`
attributes the selectors depend on. Delete that block to see what the theme looks like
without that work: correct palette, distinctive parts absent. That difference is the scope
of the orphan-token issue.

To preview the **actual site**, use `hugo server` — but note it renders the existing Coder
theme until the redesign is implemented. Nothing in `design/` is wired into the Hugo build yet.
