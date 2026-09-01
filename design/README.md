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
