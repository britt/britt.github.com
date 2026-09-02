# Implementation plan — #77

Recipe pages don't read as part of the Claude Design system. Four separable
defects, one per section below. Verification plan:
[`issue-77-verification.md`](issue-77-verification.md).

## Root cause of the dead space (the one actual bug)

`design/tokens/chrome.css` clamps every direct child of a content `<article>`
to the reading measure:

```css
.content article>*{max-width:var(--measure)}
.content article>.ds-cols,.content article>table,.content article>.ds-scroll,
.content article>figure,.content article>.highlight,.content article>pre{max-width:none}
```

`.ds-split` is not on the escape list. `layouts/cocktails/single.html` emits
`<article class="recipe"> <div class="ds-split">`, so the **whole two-column
layout** — rail, gutter and prose together — is capped at 70ch. Measured on the
built site at a 1512px viewport:

| | |
|---|---|
| `.recipe` (container) | 1319px |
| `.ds-split` | **814px** (62% of it) |
| `.recipe__rail` | 300px |
| `.recipe__body` | **453px** — about 39 characters |

So the reading measure is applied to the rail *plus* the gutter *plus* the
prose, which starves the prose to roughly half a measure and leaves 505px of
empty page. That is the "insane amount of dead white space" in the issue, and
it also explains why the poster image looked cramped.

`assets/css/gaps.css` already mirrors that escape list for `[data-prose] > *`
and **does** include `.ds-split` there — the two lists have drifted, and its own
comment says they are meant not to. Fixing it in `gaps.css` is where CLAUDE.md
puts "a rule the design system doesn't cover because Coder's templates emit the
markup"; `design/tokens/` is a read-only mirror.

## Changes

### 1. `assets/css/gaps.css` — un-drift the escape list

Add a `.content article > …` block covering `.ds-split` and `.ds-dated`, keyed
the same way and commented with the measurement above.

### 2. `layouts/cocktails/single.html` — emit the RecipeList shape

`design/components/lists/RecipeList.prompt.md` is explicit:

```jsx
<RecipeList items={[{ amount: "2oz", item: "Bourbon" }, …]} />
```

Amount and item are **separate fields**. The template currently hands the rail
a raw `<ul>` of undifferentiated strings, which is why the only way to make the
measures read as measures was to set the whole list in monospace — the thing
the issue complains about.

Split each rendered `<li>` with `replaceRE` into

```html
<li><span class="recipe__amount">2oz</span><span class="recipe__item">Bourbon</span></li>
```

Pattern (Go RE2, `(?i)`): an optional leading integer and/or vulgar or slashed
fraction, an optional unit word from a closed list
(`oz ml cl tbsp tsp dash(es) pinch(es) slice(s) sprig(s) scoop(s) twist(es)
drop(s) part(s) cup(s) barspoon(s)`), then an optional `of`, then the rest.

An `<li>` that does not match keeps its whole text as the item and gets
`recipe__item--full` so it spans both columns — this is the degradation path
for `Several Sprigs of Mint`, `A splash of soda`, `Cilantro Sprig`,
`Some (enough) Frozen Blueberrries`, `The juice of 1 fresh lemon`,
`Juice of 1/2 a Lemon`. Nothing is dropped and no measure is re-spelled
(V6, V7).

Also tag the recipe-card `<figure>` with `recipe__card` and give it a
`<figcaption>` if the Markdown supplied none, by the same rendered-HTML
surgery the template already documents. Doing it here rather than in the 14
content files keeps every recipe consistent and matches the reason the existing
comment gives for not editing content.

### 3. `assets/css/pages.css` — restyle the rail, the header and the card

- **Rail width.** `--sidebar: clamp(260px, 26vw, 380px)` scoped to the recipe's
  `.ds-split`. 300px was never enough for an ingredient list beside a measure
  column; the space freed by change 1 pays for it.
- **Heading.** Drop the monospace/uppercase/`--text-xs`/`--text-muted` override
  entirely and let the `<h2>` be an `<h2>`: display face, `--heading-2`,
  capped to `--text-h3` so it doesn't shout in a 380px rail. That is the fix
  for "leftover debug label" — the label was styled *down* out of the system,
  not missing from it.
- **List.** Two-column grid, measures in mono with `tabular-nums` and
  `--rule-accent` (clay) so they read as quantities, ingredient names in the
  body sans face. Per-item `border-bottom` removed — the design system says
  "separation is done with rules and whitespace", and a rule under every row is
  the opposite of that.
- **Header.** Move the clay rule from above the rail to under the page header,
  where it spans the full width and makes the title + date a masthead band
  instead of a heading with a date dangling under it. Same 2px accent, one rule
  instead of one that started two thirds of the way across the page.
- **Card.** `max-width: min(100%, 400px)`. The cards are 1125×2001 phone
  posters; at the (now correct) 814px measure one would render 1448px tall and
  dominate the page. At 400px, hairline-bordered and captioned, it reads as an
  embedded artifact rather than a competing hero in a third typeface.

## Assumptions

1. **The card's typeface is not ours to change.** It is a generated PNG from
   Highball, not markup. The issue asks that it stop reading "like landing on a
   different website"; the only levers available are scale, framing and
   labelling, so that is what this does. Regenerating the cards in the design
   system's faces would be a content project, not a template fix.
2. **`.post-meta` stays the site-wide meta voice.** The issue groups the date
   with the "INGREDIENTS" label. But `PageTitle.prompt.md` takes the date as
   `meta`, and `DatedList` sets the same dates in the same mono on
   `/cocktails/`; restyling it on recipe pages only would make the archive and
   the page it links to disagree. Addressed by giving it a header band to sit
   in (change 3) rather than by changing its type.
3. **Ingredients stay in the rail.** `PageShell.prompt.md` says the rail
   "carries identity or metadata only". The existing template made the call
   that an ingredient list is metadata; the issue complains about how the rail
   *looks*, not where it is, so that decision is left alone.
4. **`layouts/_default/_markup/render-image.html` is untouched.** Its
   `sizes="…814px"` becomes conservative once the card renders at 400px, but
   the hook is shared with `/daresnot/`, whose image still uses the full
   measure. The srcset still resolves correctly; only a 1x desktop downloads
   more than it needs.

## Order

1. Verification plan (done — `issue-77-verification.md`).
2. `gaps.css` — the layout bug, verifiable on its own (V3).
3. `single.html` — markup, verifiable against V6/V7 before any styling exists.
4. `pages.css` — the typography, then V4/V5/V8/V9.
5. Full run: V1–V14.

## Risks

- **The measure regex mis-splits an ingredient.** Mitigated by V6, which diffs
  all 14 rendered rails against the source Markdown line by line.
- **Freeing `.ds-split` widens something else.** Only two templates emit it
  inside a content `<article>` — the recipe page and the home page — so V13's
  responsive sweep plus the screenshot check cover the blast radius.
- **`style-coverage.mjs` fails on the new classes.** Every class introduced
  here gets a rule in `pages.css`; V12 is the check.
