# Documentation Style Guide

## Project Overview

**Project:** content
**Description:** Documentation site with 2 documentation files

## Content Overview

Main topics and content areas
- Personal project listings (projects.md) describing small software projects with links to repos and sites (example: "[Readinglist.live](https://www.readinglist.live) - Turn any web page into a podcast episode...").
- Long-form essays and notes under topical directories (example: daresnot/index.md: "## electronic voting with time limited privacy").
- A recipe/catalog section of cocktail recipes where each recipe is stored in its own directory with index.md and contains Ingredients and preparation steps (example: cocktails/yippee-kay-yay-motherfucker/index.md uses "### Ingredients").

Primary purpose and goals
- Provide a personal documentation/website where projects, essays, and recipes are published as Markdown pages. The content is intended to present projects, tell short essays, and publish recipes in a readable, web-ready format.

Target problems being addressed
- Publishing small project descriptions and links (projects.md).
- Storing and presenting small collections of themed content (cocktail recipes in separate directories).
- Archiving dated posts (many files include a date front-matter field, e.g., "date: 2014-03-19").

Content scope and categories (specific)
- Root pages: site index and project listing (/_index.md, projects.md).
- Section index pages: _index.md used as the landing page for a section (cocktails/_index.md).
- Section subpages: each recipe or essay has its own directory with index.md (cocktails/<slug>/index.md; daresnot/index.md).
- Metadata: Every Markdown file includes YAML front matter with title and path; many have date.
- Multimedia: Inline images stored under /img/ (example: ![Recipe for the Yippee Kay Yay Motherfucker!](/img/cocktails/yippee-kay-yay-motherfucker.png)).

Writing patterns and conventions observed
- Front matter title is treated as page title; body typically does not repeat an H1. Example front matter: "title: Yippee Kay Yay Motherfucker!" and the body starts with a short paragraph and then section headings like "### Ingredients".
- Use of Markdown link syntax for both external and internal links: [Teleprompter](https://github.com/britt/teleprompter).
- Occasional use of HTML tags (e.g., <del>) and Markdown emphasis like _italics_ and **bold**.
- Footnotes are used (e.g., "[^1]").

Observed publishing format and exact front matter requirements
- System: Unknown. The repository uses YAML front matter at the top of each .md file. The exact publishing engine is not specified, so enforce plain YAML front matter compatible with common static site generators.

Required front matter fields (observed and therefore required for consistency):
- title: string (present in all files)
- path: string (present in all files; must match the desired URL and trailing slash pattern)
- date: optional string in ISO format YYYY-MM-DD (present in many files for dated posts)

Exact front matter template to use in every new file (copy/paste):
```yaml
---
# Required: canonical page title
title: "Your Page Title"
# Required: canonical path for the page, use a leading slash and trailing slash for directories
path: "/path/to/page/"
# Optional but recommended for posts: ISO 8601 date (YYYY-MM-DD)
date: 2025-09-06
---
```

Complete example page (content + front matter) matching observed patterns:
```markdown
---
title: "Yippee Kay Yay Motherfucker!"
path: "/cocktails/yippee-kay-yay-motherfucker/"
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
```

System-specific features and notes (observed):
- Use of "_index.md" for section landing pages (cocktails/_index.md) and "index.md" for page content inside slug directories (cocktails/<slug>/index.md).
- Footnotes are used in content (e.g., "[^1]"). Keep Markdown footnote support enabled in the renderer.
- HTML tags occasionally appear (<del> tags), so the renderer should allow inline HTML.

File naming and placement rules (must follow observed structure):
- Root landing pages: _index.md or files at repository root (e.g., _index.md for site home; projects.md is a top-level page).
- Section pages: create a directory 'section-slug' and place an index.md inside it for that page; place an _index.md at the section root to serve as the list/landing page.
- Images should be placed under /img/<section>/<slug>.<ext> and referenced with root-relative paths.

Because the publishing system is unknown, adopt the simplest compatible rules: YAML front matter as shown, use root-relative paths, and follow index/_index naming patterns so most static site generators (Hugo, Jekyll) will accept the content.

## Key Recommendations

1. Require a standardized front matter block in every Markdown file with title and path; if a post is dated, require date in ISO 8601 (YYYY-MM-DD). Example to enforce: see the 'Publishing Requirements' YAML template below.
2. Standardize heading usage: reserve the front-matter title as the page H1, use '##' for first-level content sections (examples: "## Home Cooked Software", "## electronic voting with time limited privacy") and '###' for recipe subsections (example: "### Ingredients"). Add a linter rule or style check that flags H1s in body content.
3. Follow directory rules: use _index.md at directory root to represent a list/section page (example: cocktails/_index.md), and use index.md inside a named subdirectory as the page for that slug (example: cocktails/yippee-kay-yay-motherfucker/index.md). When adding a new cocktail, create a directory named with the slug and add index.md with the required front matter.
4. Normalize link formatting for external vs internal links: keep full absolute URLs for external resources (example: [Readinglist.live](https://www.readinglist.live)) and use root-relative paths for internal images and internal permalinks (example image path: /img/cocktails/yippee-kay-yay-motherfucker.png; front matter path: path: /cocktails/yippee-kay-yay-motherfucker/).
5. Add an optional 'summary' or 'description' front-matter field for list pages to enable consistent teasers on indexes (observed index pages lack a formal summary field).

## Structure Guidelines

### Heading Style

Use front-matter 'title' as the page H1. For in-body headings use this exact observed pattern:
- Top-level section heading: '##' (example: '## Home Cooked Software [^1]' from projects.md).
- Subsection within pages (recipes, ingredients): '###' (example: '### Ingredients' from cocktails/yippee-kay-yay-motherfucker/index.md).
- Do not add '# Title' inside the body; rely on the front matter title. Example front matter: 'title: Yippee Kay Yay Motherfucker!' and the body starts with a descriptive paragraph and then '### Ingredients'.

### Content Organization

Follow the existing file organization pattern exactly:
- Root pages: place top-level pages like projects.md at repository root.
- Section landing pages: use '_index.md' (example: cocktails/_index.md).
- Page-per-slug: use a directory per slug with a single 'index.md' inside (example: cocktails/yippee-kay-yay-motherfucker/index.md). The 'path' front matter should equal the directory URL (example: 'path: /cocktails/yippee-kay-yay-motherfucker/').
- For recipes: start with a 1-2 sentence description, then '### Ingredients' followed by bullet points with quantities, then a short preparatory paragraph or a '### Preparation' heading for step-by-step instructions.

### Metadata Usage

Complete front matter example observed and recommended (must be present at the top of every .md file):
---
# Required: title (string), path (string) - include leading slash and trailing slash for directories
# Optional: date in ISO format YYYY-MM-DD
title: "Yippee Kay Yay Motherfucker!"
path: "/cocktails/yippee-kay-yay-motherfucker/"
date: 2014-03-19
---

Notes:
- 'title' must be a single-line string.
- 'path' must be the canonical URL path (observed usage across all files).
- Use 'date' only when the content is time-sensitive or a post; keep format consistent (YYYY-MM-DD).

### Linking Strategy

Observed link patterns and the recommended usage:
- External link format: standard Markdown link with full URL. Example: [Readinglist.live](https://www.readinglist.live) and [Teleprompter](https://github.com/britt/teleprompter).
- Internal permalink usage: set 'path' in front matter to the canonical URL and use that for internal links, or use root-relative paths. Example front matter: 'path: /cocktails/yippee-kay-yay-motherfucker/'.
- Image linking: use root-relative image paths. Example: ![Recipe for the Yippee Kay Yay Motherfucker!](/img/cocktails/yippee-kay-yay-motherfucker.png).
- Inline annotations and descriptors: when listing projects, use a hyphen to separate the link from description. Example: '* [Readinglist.live](https://www.readinglist.live) - Turn any web page into a podcast episode...'
- Footnotes: content uses footnote markers like '[^1]'; ensure your renderer supports footnotes.

## Tone and Style

### Voice

"I like tools that serve me, not ones that try to extract value from me or my attention.": use a candid, personal first-person voice with occasional informal commentary (observed direct statements and opinions).

### Target Audience

"These are things that I have built simply because I wanted them to exist...": content targets readers interested in small personal projects, cocktail recipes, and essays — generally an audience of developers, tinkerers, and interested readers rather than enterprise users.

### Technical Level

"a Go package to read a SQLite database, extract the schema and data to [Apache Avro](https://avro.apache.org/) and vice versa": expects readers to be comfortable with technical terms and links to project repositories; level is mixed — some highly-technical project descriptions and some casual recipe content.

## Best Practices

1. Use front matter title as canonical H1 and avoid placing '# Title' inside the body. Rationale: current pages place the title in front matter (e.g., "title: Yippee Kay Yay Motherfucker!") and use body headings starting from '##'.
2. Structure recipes with consistent subsections: start with a one-line description, then a '### Ingredients' list (bullet points with quantities), then preparation steps as a paragraph or separate '### Preparation' heading if steps are multi-paragraph. Example: cocktails/yippee-kay-yay-motherfucker/index.md uses '### Ingredients' followed by list items and a preparation paragraph.
3. Store images in /img/<section>/<slug>.png and reference with root-relative paths in Markdown. Example from content: ![Recipe for the Yippee Kay Yay Motherfucker!](/img/cocktails/yippee-kay-yay-motherfucker.png).
4. Use ISO dates in front matter when present: observed date examples use YYYY-MM-DD (example: "date: 2014-03-19"), so adopt that consistently for sorting and archiving.
5. Use inline Markdown links for external resources and clearly annotate links with hyphenated descriptors when listing projects (pattern: "[Readinglist.live](https://www.readinglist.live) - Turn any web page into a podcast episode...").

## Directory Structure

Observed organization and rules (16 directories described)
- Root (.)
  - Files: projects.md, _index.md
  - Purpose: site home and top-level project listing.
  - Example: projects.md contains a bulleted list of project links and descriptions.

- daresnot/
  - Files: index.md, _has_subdirs_ (placeholder)
  - Purpose: collection of essays or posts; this directory holds individual pages (index.md acts as a page for the directory). Example file: daresnot/index.md (has date in front matter).

- cocktails/
  - Files: _index.md (section landing page), _has_subdirs_
  - Purpose: landing page for the cocktail recipe collection. Example: cocktails/_index.md has a description: "A small but growing collection of cocktails that I have created."

- cocktails/<slug>/ (one directory per recipe)
  - Example directories and files (each contains index.md and a placeholder _has_subdirs_):
    - cocktails/yippee-kay-yay-motherfucker/index.md
    - cocktails/thats-just-dandy/index.md
    - cocktails/slightly-sour-strawberry-smash/index.md
    - cocktails/protein-g1/index.md
    - cocktails/mother-of-invention/index.md
    - cocktails/la-pomme-forte/index.md
    - cocktails/johnny-appleseed/index.md
    - cocktails/holiday-spiced-sour/index.md
    - cocktails/envejeciendo/index.md
    - cocktails/el-nino/index.md
    - cocktails/bittersweet-symphony/index.md
    - cocktails/bitter-nonsense/index.md
    - cocktails/anderson-island-sunset/index.md
  - Purpose: each recipe stored inside its own directory with index.md containing front matter (title, path, optional date) and recipe content. Images referenced from /img/cocktails/<slug>.png.

File naming conventions observed
- Section landing pages: _index.md
- Per-page content inside directories: index.md
- Top-level pages can be named directly (projects.md) or use _index.md for the site root.
- Placeholder files named _has_subdirs_ are present; treat these as markers only and do not publish them.

Placement rules for new content
- To add a new recipe: create directory cocktails/<slug>/, add index.md with front matter (title, path, optional date), and place image at /img/cocktails/<slug>.<ext>.
- To add a new section: create a directory with _index.md as the landing page and place subpages as index.md within child directories.
- Ensure the 'path' front matter matches the directory structure and includes a leading and trailing slash (example: path: /cocktails/yippee-kay-yay-motherfucker/).

## Usage

This style guide should be used when creating new documentation for this project. Follow the patterns and guidelines outlined above to ensure consistency with existing documentation.

*Generated on: 2025-09-06T23:38:57.751Z*
