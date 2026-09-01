> Mirrored verbatim from the Claude Design project `2a40bf64-878f-4a85-9f83-e2a4df491326`
> ("brittcrawford.com Design System"), file `readme.md`. Do not hand-edit — see `README.md`
> in this directory for how to refresh.

# brittcrawford.com — Design System

A design system for **brittcrawford.com**, the personal site of Britt Crawford (who works on [Sandgarden](https://www.sandgarden.com)). The site is a small, text-and-images Hugo site: a portrait, a name, a few annotated lists of software he built for himself, cocktail recipes, and a footer. There is almost no interaction — no nav menu, no search, no cards, no calls to action.

This system keeps that aesthetic and modernises it: the same one-column layout, link-blue accent and light/dark pairing, with a real typeface, a documented token set, and tighter, more deliberate spacing.

## Sources

- Live site: https://brittcrawford.com/ — home, https://brittcrawford.com/cocktails/ (index) and https://brittcrawford.com/cocktails/peach-pepper-jelly-julep/ (recipe detail) were read for structure and copy.
- Theme source of truth: [luizdepra/hugo-coder](https://github.com/luizdepra/hugo-coder) (`assets/scss/_variables.scss`, `_base.scss`, `_content.scss`, `_footer.scss`), read at `main`. All type sizes, spacing rhythm and colours below derive from these files, not from screenshots.
- Site generator: Hugo 0.136.5.

No Figma file, codebase or slide deck was provided.

## Surfaces

One product: the personal site, with three real page types — **home** (profile + annotated lists), **list index** (dated archive), **article** (title, prose, ingredients, image) — plus a **404**. Everything else on the site is one of these. `ui_kits/personal-site/` has one example page per type, two of them also at mobile width.

## Content fundamentals

- **First person, past tense, plain.** "These are things that I have built simply because I wanted them to exist, or because I wanted to see if I could."
- **Descriptions are one sentence and factual.** "a Go package to read a SQLite database, extract the schema and data to Apache Avro and vice versa." No benefit statements, no adjectives like *powerful* or *seamless*.
- **Honest asides in parentheses or italics.** "(It just reads it to you in a nice human voice, no AI commentary or nonsense like that.)" Corrections are struck through rather than deleted: "~~I use Highball on my phone~~ *I recently learned they pulled it from the app store.*"
- **Credit is explicit.** "**I didn't create this one** but I have found it very useful, and I did fix a bug…"
- **Casing:** sentence case in prose; Title Case for section headings ("Home Cooked Software", "Abandoned but not forgotten" — inconsistently, and that's fine); the wordmark is always lowercase `brittcrawford.com`.
- **Quotes** are for other people's words only, with attribution.
- **Emoji:** rare and incidental (one 👆 in a shortcut description). Do not design with emoji; never use them as icons or bullets.
- **Vibe:** a workshop notebook. Understated, slightly wry, anti-marketing. Never write copy that tries to convert the reader.

## Visual foundations

- **Colour.** Warm off-white paper (`--paper #fafaf8`) with near-black ink; the dark scheme is a peer, not a variant (`#17181a` ground, `#c9ccd1` text). Exactly one accent — link blue `#1565c0` light / `#6fb4f5` dark, inherited from the Coder theme. Blue is reserved for links; nothing else in the system is coloured. No semantic red/green/amber (the site has no forms or alerts).
- **Type.** Public Sans (Google Fonts) for everything, Fira Code for the wordmark, dates, measures and code. Every size is fluid: display 38→62, h1 30→44, h2 25→34, h3 21→26, body 17→19 at 1.75 leading. Headings are 600 with `-0.018em` tracking; body is 400.
- **Spacing.** A 4/8/10 hybrid scale (the original site's root font size was 10px). Rhythm is fluid: 32→56px above a heading, 20px below, 20px between paragraphs, 32→72px before a page header.
- **Layout.** Full bleed. The page *is* the container: 100% width with fluid gutters, `clamp(20px, 4vw, 72px)`. Width is spent on a two-column `RailLayout` (profile or ingredients in a sticky rail, content beside it) and on `ProjectList`, which reflows across as many 320px columns as fit. Prose still clamps to a 74ch measure — filling the page never means 200-character lines. Under 900px the rail collapses and the profile centers; under 600px the dated index stacks. Both breakpoints are token overrides in `tokens/layout.css`, so no component ships a media query. Type and gutters scale continuously with `clamp()`. Original body copy was justified; this system left-aligns for cleaner rag.
- **Backgrounds.** Flat colour only. No gradients, no textures, no patterns, no full-bleed imagery, no hero art.
- **Imagery.** Photographs appear only as the circular portrait and occasional recipe/screenshot images in content. They sit inline in the column, hairline-bordered at `--radius-md`, never full-bleed and never treated (no duotone, grain, or overlay).
- **Borders and radii.** 1px `--border-hairline` rules; 6px radius on small chrome (code, tags, the toggle), 10px on images and code blocks, 50% on the avatar. That's the whole vocabulary.
- **Shadows.** None. There are no cards, no elevation, no protection gradients, no capsules. Separation is done with rules and whitespace.
- **Transparency and blur.** Not used anywhere.
- **Animation.** Colour transitions only, 160ms `cubic-bezier(.2,0,.2,1)`. Nothing moves, scales, fades in on scroll, or bounces.
- **Hover.** Links shift to `--link-hover` and gain an underline at 3px offset. Archive titles shift from heading colour to link blue. Heading anchors ("#") fade from 0 to 1 opacity.
- **Press.** No transform, no scale, no colour change — the link is already blue.
- **Focus.** 2px `--focus-ring` outline at 2px offset. Always visible; never removed.

## Playful theme (variant)

An opt-in warm-primaries theme lives in `tokens/playful.css`, scoped to `:root[data-theme="playful"]`. Set `data-theme="playful"` on `<html>` and every existing component re-themes; nothing in the default system changes.

- **Palette.** Cream paper `#fbf7ef` with warm near-black ink, and four accents: clay `#e2542a`, amber `#f0a92b`, pine `#2f7d63`, lapis `#1f4fa3`. Lapis carries links, clay carries rules and underlines, amber and pine are taxonomy stickers. No accent is ever a page background.
- **Type.** Bricolage Grotesque 700 for headings only (`--font-display`, `--heading-weight`, `--heading-tracking`); Public Sans body and Fira Code chrome are unchanged.
- **Links.** Prose links are lapis with a 2px clay underline; on hover the underline takes the link colour. Headings, list titles, the wordmark and the social row stay plain until hover, as in the default theme.
- **Headings.** A colour per level: h1 ink, h2 clay, h3 pine, h4+ lapis. Levels never recolour for emphasis.
- **Tints.** `--tint-clay/amber/pine/lapis` are the only backgrounds colour touches. `data-tint="pine"` on a section fills and pads it; one tint per section, never nested.
- **Rules.** `hr` thickens to 3px clay; hairline borders warm to tan `#e8ddca`. Blockquotes sit on a lapis tint, code chips on pine, list markers are clay, selection is amber.
- **Tags.** `Tag` gains a `tone` prop (`neutral | clay | amber | pine | lapis`) for filled sticker labels. One tone per category, held consistently.
- Still flat: no gradients, shadows, textures, rotation, or decorative shapes. Layout, spacing and motion tokens are untouched.

Dark variant: add `data-scheme="dark"` alongside `data-theme="playful"`. Accents lift to pastel weights, the `-deep` shades invert (lighter, not darker), tints become warm near-blacks, and sticker tags flip to dark text on the lifted accent.

Cards under the **Playful theme** group (palette, headings, tints, tags, rules); example pages at `ui_kits/personal-site/home-playful.html` and `section-index-playful.html`.

## Iconography

**The site has no icon set and no logo.** The one graphic element is a Gravatar portrait; the Coder theme ships Font Awesome, but this site's pages use none of its glyphs — social links are plain uppercase words (GITHUB, LINKEDIN).

Rules that follow:
- The brand mark is the name set in type — `brittcrawford.com` in Fira Code for chrome, "Britt Crawford" in Public Sans Semibold for the masthead. Nothing was drawn or reconstructed.
- Prefer a word to an icon. The theme toggle says "dark" / "light".
- Where a glyph is unavoidable, use a plain Unicode character already present on the site: `—` list markers, `↩︎` footnote returns, `#` heading anchors, `←` back links, `©` in the footer.
- No emoji as UI. No hand-drawn SVG.
- If a future surface genuinely needs an icon set, link [Lucide](https://lucide.dev) from CDN at 1.5px stroke and flag it as an addition — it is **not** part of the current brand.

## Assets

`assets/` is empty by design. The portrait is a Gravatar hosted off-site and the recipe photographs are the author's own; neither was copied. `Avatar` falls back to a neutral monogram, and the recipe screen shows a labelled placeholder where the photo belongs.

## Fonts

Public Sans and Fira Code load from the Google Fonts CDN via `@import` in `tokens/fonts.css` — no font binaries are vendored, so the compiler reports zero `@font-face` rules. **Substitution flag:** the original site used the system UI stack (`-apple-system`, Segoe UI, Roboto…) and `SF Mono`; Public Sans and Fira Code are the modernisation. Send real font files if you'd rather license something specific.

## Index

| Path | What |
| --- | --- |
| `styles.css` | Entry point — `@import`s only |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `layout.css`, `base.css` |
| `guidelines/` | Foundation specimen cards (Colors, Type, Spacing, Brand) |
| `components/` | Component library, grouped by concern |
| `ui_kits/personal-site/` | `home.html`, `section-index.html`, `article.html`, `mobile.html`, plus `index.html` (click-through) — see its README |
| `thumbnail.html` | Homepage tile |
| `SKILL.md` | Agent Skills wrapper |

### Components

- **components/layout/** — `Container`, `RailLayout`, `SiteHeader`, `SiteFooter`, `ThemeToggle`
- **components/identity/** — `Avatar`, `ProfileHeader`
- **components/content/** — `Prose`, `PageTitle`, `SectionHeading`, `Quote`, `Figure`, `Footnotes`, `EmptyState`
- **components/lists/** — `ProjectList`, `DatedList`, `RecipeList`, `Tag`

Each has a sibling `.d.ts` (props) and `.prompt.md` (usage). Every family maps to something the source site actually renders.

### Intentional additions

- `ThemeToggle` — the Coder theme ships a colour-scheme switch and the site declares `color-scheme: light dark`, but the toggle's visual treatment here (a text label, not an icon) is this system's choice.
- `Container`, `Prose` — structural wrappers standing in for the theme's `.container` and `.content` CSS classes.
- `PageShell` — the two-column rail/content layout. The original site is single-column; this is the mechanism for the full-width brief, and it is where the modernisation is most visible.
- `RailLayout` — the source site is a single narrow column; the two-column rail is this system's way of filling the page at desktop width while collapsing back to the original stacked reading order on mobile.
- `EmptyState` — the live 404 page was not read; this is a type-only dead end built from existing tokens.
