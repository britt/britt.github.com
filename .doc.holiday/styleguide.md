# Documentation Style Guide

## Project Overview

**Project:** content
**Description:** Documentation site with 2 documentation files

## Content Overview

Main topics and content areas: - Personal projects and short writeups (projects.md, _index.md) describing small software pieces, e.g. "avro-sqlite" and "Readinglist.live". - Blog-like essays / posts in directories such as daresnot (e.g., "Daresnot" dated 2018-03-08). - A collection of cocktail recipes in a hierarchical folder structure under /cocktails, each recipe as its own directory with index.md, e.g., /cocktails/yippee-kay-yay-motherfucker/ covering ingredients, preparation, and images. Primary purpose and goals: - Serve as a small personal documentation/site combining project descriptions, essays, and recipe entries. The site documents: project links and short descriptions, author reflections, dated posts, and recipe metadata (ingredients, method, image). Target problems being addressed: - Communicate what the author built, how recipes are prepared, and preserve short-form personal writing. Content scope and categories: - Project listings (projects.md): short descriptions and external links. - Top-level landing page (_index.md): overview and grouped sections (e.g., "Home Cooked Software"). - Section index pages (_index.md in directories like cocktails): collection descriptions. - Leaf content pages (index.md per subdirectory): recipe or post content with metadata and content sections (Ingredients, instructions). Specific non-generic details: - Front matter fields observed: title (required), path (required), date (optional, format YYYY-MM-DD). - Footnote usage is present (e.g., [^1]). - Images are stored and referenced with root-relative paths like /img/cocktails/yippee-kay-yay-motherfucker.png. - There are placeholder files named _has_subdirs_ in many directories indicating subdirectory presence.

---
# EXACT front matter template here
# title: required (string)
# path: required (string) — always include a leading and trailing slash
# date: optional (YYYY-MM-DD) for post-like content
---

# Example required front matter (copy exactly):
---
title: Page Title
path: /path/to/page/
date: 2025-09-06
---

# Content file structure requirements (plain Markdown; no platform-specific shortcodes detected):
# 1) Put canonical page title in front matter (do not repeat as an H1 in the body).
# 2) Use H2 (##) for main sections and H3 (###) for subsections.
# 3) Use Markdown inline links and root-relative image paths.

# Complete example page (recipe) showing proper structure:
---
title: Yippee Kay Yay Motherfucker!
path: /cocktails/yippee-kay-yay-motherfucker/
date: 2014-03-19
---

A spicy variant on the Old Fashioned, a tribute to [John McClane](https://en.wikipedia.org/wiki/John_McClane) and a terrible pun.

### Ingredients

* 2oz Bourbon _(I use [Buffalo Trace](http://www.buffalotrace.com/))_
* 1/4oz Maple Syrup
* 1 dash of Cayenne Pepper
* 1 dash of Angostura bitters
* 1 twist of lemon

Gently stir the bourbon, maple syrup, bitters and cayenne with ice to chill. Be careful not to chip the ice and water down the drink. Serve on the rocks with a twist of lemon.

![Recipe for the Yippee Kay Yay Motherfucker!](/img/cocktails/yippee-kay-yay-motherfucker.png)

# Notes about publishing system features
- No framework-specific shortcodes, templating tags, or special build directives were detected in the repository; content appears to be plain Markdown with YAML front matter. If you later adopt a static site generator (Hugo, Jekyll, etc.), map the observed front matter fields to the generator's expected fields. The repository currently expects: title and path at minimum, date optional.
- Maintain root-relative image paths (/img/...) and use index.md for leaf pages and _index.md for section/list pages so generators that treat _index.md specially will work predictably.

## Key Recommendations

1. Standardize front matter: require exactly these fields in this order and format: title, path, date (optional). Use the YAML block below for every file (title and path required). Example: ---\ntitle: Yippee Kay Yay Motherfucker!\npath: /cocktails/yippee-kay-yay-motherfucker/\ndate: 2014-03-19\n---
2. Consistent index file naming: use _index.md for directory/list pages and index.md for leaf pages. Convert top-level projects.md to either _index.md or place it in /projects/_index.md to match the pattern used by /cocktails and /daresnot.
3. Normalize path values to always end with a trailing slash and mirror the directory structure exactly (e.g., path: /cocktails/yippee-kay-yay-motherfucker/). Update existing files that lack trailing slashes or have mismatched paths.
4. Adopt heading conventions: Put the canonical page title only in front matter (do not duplicate as H1 in content). Start content sections with H2 (##) and use H3 (###) for subsections (recipes: use "### Ingredients" exactly).
5. Remove or document placeholder files (_has_subdirs_): either remove them from the published repository or add a README in each directory explaining their purpose to avoid confusion.

## Structure Guidelines

### Heading Style

Use the front-matter title as the canonical page title. In-body headings follow this pattern: - Use '##' for main content sections. Example: '## Home Cooked Software [^1]' (from projects.md). - Use '###' for subsections. Example: '### Ingredients' (from cocktails/yippee-kay-yay-motherfucker/index.md). - Do not include an H1 (#) in the body; the front matter title fulfills that role.

### Content Organization

Page organization observed: - Front matter block with title, path, optional date. - One-sentence summary or lead paragraph. - H2 section(s) for groupings (e.g., '## Home Cooked Software'). - For recipes: H3 '### Ingredients', bulleted ingredient list, preparation paragraph(s), optional image (root-relative). Example order in cocktails/yippee-kay-yay-motherfucker/index.md: front matter -> description line -> '### Ingredients' -> list -> instructions -> image.

### Metadata Usage

Complete front matter example (must be present at top of every file):
---
title: Yippee Kay Yay Motherfucker!
path: /cocktails/yippee-kay-yay-motherfucker/
date: 2014-03-19
---
- title: required; written in plain text exactly as you want it displayed. - path: required; must start and end with a slash and mirror the file location. - date: optional; when present use format YYYY-MM-DD (observed in daresnot/index.md: date: 2018-03-08).

### Linking Strategy

Use Markdown inline links for both external and internal links. Examples from the content: - External link: [Readinglist.live](https://www.readinglist.live) (projects.md). - External reference with description: [avro-sqlite](https://github.com/britt/avro-sqlite) - Image: ![Recipe for the Yippee Kay Yay Motherfucker!](/img/cocktails/yippee-kay-yay-motherfucker.png) - Internal path usage in front matter: path: /cocktails/yippee-kay-yay-motherfucker/ - Footnote usage example: '## Home Cooked Software [^1]' and '...because I wanted to see if I could.[^2]'. Keep link text descriptive (observed practice) and maintain root-relative paths for assets.

## Tone and Style

### Voice

I like tools that serve me, not ones that try to extract value from me or my attention.

### Target Audience

These are things that I have built simply because I wanted them to exist, or in the case of **avro-sqlite**, because I wanted to see if I could.[^2]

### Technical Level

a Go package to read a SQLite database, extract the schema and data to [Apache Avro](https://avro.apache.org/) and vice versa

## Best Practices

1. Use front matter title as the canonical title and avoid an in-body H1. Example observed: file cocktails/yippee-kay-yay-motherfucker/index.md uses front matter title: "Yippee Kay Yay Motherfucker!" and begins content with paragraph text and then uses "### Ingredients".
2. For recipes, follow the exact content structure: an opening one-line summary, then a "### Ingredients" H3 list, followed by preparation instructions and an image referenced with a root-relative path such as: ![Recipe for the Yippee Kay Yay Motherfucker!](/img/cocktails/yippee-kay-yay-motherfucker.png).
3. Use Markdown inline links for external and internal URLs consistently. Example: [Readinglist.live](https://www.readinglist.live) and image paths like /img/cocktails/… for assets.
4. Include dates for time-stamped posts (YYYY-MM-DD) in the front matter when content is a post (observed in daresnot/index.md: date: 2018-03-08).
5. Use footnotes for asides and references where needed. Observed usage: "## Home Cooked Software [^1]" and "...because I wanted to see if I could.[^2]"

## Directory Structure

Observed organization (top-level and subdirectories):
- Root (.) contains: projects.md, _index.md. projects.md is a standalone page, and _index.md is the root landing page. Recommendation: choose one convention (_index.md for landing lists) and migrate projects.md into /projects/_index.md to match the pattern used elsewhere.
- daresnot/ contains index.md (a dated post) and a placeholder file _has_subdirs_. Pattern: directory per topic with a single index.md representing that topic/post.
- cocktails/ is a section directory with _index.md describing the collection and multiple subdirectories for each recipe. Each recipe subdirectory is named as a slug and contains index.md and a placeholder _has_subdirs_. Examples:
  - cocktails/_index.md (collection page)
  - cocktails/yippee-kay-yay-motherfucker/index.md (recipe page)
  - cocktails/thats-just-dandy/index.md
  - cocktails/slightly-sour-strawberry-smash/index.md
  - ... (each recipe has its own folder)

File naming conventions observed:
- Use _index.md for section/collection pages (cocktails/_index.md).
- Use index.md inside a slug-named folder for leaf pages representing that slug (e.g., cocktails/yippee-kay-yay-motherfucker/index.md).
- Some inconsistency at root-level (projects.md instead of /projects/_index.md). Place new collection pages using _index.md inside a directory named for the collection (e.g., /projects/_index.md).

Placement rules for new content:
- For a new recipe or item that needs its own URL: create a directory under the appropriate section (e.g., /cocktails/new-recipe/) and add index.md with front matter path: /cocktails/new-recipe/.
- For a new collection/section: create /section-name/_index.md with front matter path: /section-name/.
- Keep media assets (images) in a centralized folder (observed: /img/cocktails/) and reference them with root-relative paths.

Recursive subdirectory guidance:
- Subdirectories inside /cocktails/ are the canonical place for individual recipes. Each such subdirectory must contain index.md and may include images in /img/ or nested media folders. The placeholder _has_subdirs_ exists in many directories — treat it as non-content; remove or replace with a README.md if needed to explain the directory purpose.

## Usage

This style guide should be used when creating new documentation for this project. Follow the patterns and guidelines outlined above to ensure consistency with existing documentation.

*Generated on: 2025-09-06T23:59:30.856Z*
