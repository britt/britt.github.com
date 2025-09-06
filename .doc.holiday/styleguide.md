# Documentation Style Guide

## Project Overview

**Project:** content
**Description:** Documentation site with 2 documentation files

## Content Overview

Main topics and content areas: - Personal site content (root _index.md) and a Projects listing (projects.md) that link to external projects and short descriptions. - A Cocktails collection: a section index (cocktails/_index.md) and per-cocktail pages in subdirectories (each with index.md) documenting recipe name, date, description, Ingredients section and mixing instructions. - A short-form blog/essay area (daresnot/index.md) that includes dates and narrative sections.

Primary purpose and goals: - Present short, human-authored documentation and articles (recipes, projects, essays) with clear headings, external links and images. - Provide a browsable collection of recipes grouped by directory with each recipe as its own page.

Target problems being addressed: - Make it easy to discover and read individual recipes and project descriptions. - Provide reproducible recipe instructions (ingredient lists, quantities, steps) and project summaries with links to source code or sites.

Content scope and categories (specific): - Root pages: homepage content and top-level listings (e.g., _index.md, projects.md). - Collections: cocktails/ (collection index _index.md plus subfolders per recipe). - Items: cocktails/<recipe-slug>/index.md — each contains metadata (title, date optional, path) and the recipe body including section headings like "### Ingredients" and images. - Essays/notes: daresnot/index.md with date and narrative subsections. - Media: image references stored under /img/ (referenced via absolute path like /img/cocktails/...png).

System unknown — observed exact front matter format used throughout repository. Because the publishing system is not provided, use the observed YAML front matter exactly as the canonical requirement. Include these required fields: title and path. date appears in many files (14/17) and should be used when the content is time-sensitive (format: YYYY-MM-DD).

Exact front matter template to use (copy-paste into new pages):
```yaml
---
title: Your Page Title
date: 2025-09-06   # optional; use YYYY-MM-DD when present
path: /your/desired/path/
---
```

Complete example page (use this structure for new recipe or article):
```markdown
---
title: Example Recipe Title
date: 2025-09-06
path: /cocktails/example-recipe/
---

A single-line or short introductory paragraph describing the item. Keep it concise and personal when appropriate.

## Section title (use '##' for main sections)

### Ingredients

* 2oz Example spirit
* 1/2oz Example syrup

Mix ingredients and serve on the rocks.

![Optional image alt text](/img/cocktails/example-recipe.png)
```

System-specific features: none explicitly detected (no shortcodes or templating syntax found). Table of Contents presence: repository metadata indicates a TOC is used, but no explicit TOC shortcode was observed in sample files — likely generated automatically by the publishing framework from headings. Therefore, rely on consistent headings (##, ###) to ensure the TOC renders correctly in the publishing system.

File naming and organization requirements: - Use lowercase, hyphen-separated slugs for directories and files (observed: 'yippee-kay-yay-motherfucker'). - Use index.md for content pages inside folders and _index.md for folder landing pages (observed throughout 'cocktails' collection). - Ensure the front matter 'path' value matches the on-disk location and ends with a trailing slash as shown in examples (e.g., '/cocktails/yippee-kay-yay-motherfucker/').

## Key Recommendations

1. Standardize front matter across all files: require title and path; optional date may be present but should be explicit 'date: YYYY-MM-DD' when used. Reference: files show 'title: X' and 'path: /y/' (projects.md and cocktails pages).
2. Use consistent heading levels: reserve H1 for the page title implemented via front matter (do not duplicate as '# Title' in content). Use '##' for main sections (example: '## Home Cooked Software [^1]') and '###' for subsections (example: '### Ingredients').
3. Adopt filename rules: use index.md for leaf pages within directories and _index.md for a directory's landing/listing page. Example: cocktails/_index.md (collection landing) and cocktails/yippee-kay-yay-motherfucker/index.md (individual recipe).
4. Normalize internal links to use the 'path' front matter values or absolute site paths. Example pattern observed: 'path: /cocktails/yippee-kay-yay-motherfucker/' and image link '![... ](/img/cocktails/yippee-kay-yay-motherfucker.png)'.
5. When publishing recipes, follow the observed content pattern: short description paragraph, '### Ingredients' list, mixing instructions as one or two paragraphs, and an image referenced using the /img/ path.

## Structure Guidelines

### Heading Style

Use YAML front matter 'title' as the canonical page title (do not add '# Title' inside body). Use '##' for main sections and '###' for subsections. Exact examples from content: - '## Home Cooked Software [^1]' (projects.md) - '### Ingredients' (cocktails/yippee-kay-yay-motherfucker/index.md)

Concrete rule: Do not insert an H1 inside the Markdown body. Body headings should begin at H2.

### Content Organization

Each file should follow this body order: 1) Optional short intro paragraph immediately after front matter. 2) One or more '##' sections describing content or listing. 3) Where appropriate, '### Ingredients' or other '###' subsections for lists/details. 4) Final image(s) referenced via absolute '/img/...' paths. Example sequence from a recipe page: front matter -> short description -> '### Ingredients' -> instructions paragraph(s) -> '![... ](/img/cocktails/<slug>.png)'.

### Metadata Usage

Observed front matter fields and exact formatting (use this template):

---
title: Page Title
path: /the/path/   # trailing slash recommended
date: 2018-03-08   # optional; format YYYY-MM-DD when present
---

Notes: - title: required in all 17 files. - path: required in all 17 files; should reflect the final URL and include a trailing slash. - date: present in 14 of 17 files; include it for posts or time-sensitive content; omit if timeless.

Do not add additional arbitrary front matter keys unless the publishing system requires them; no other keys were detected in samples.

### Linking Strategy

External links: Use full-URL Markdown links. Example: '[Readinglist.live](https://www.readinglist.live) - Turn any web page into a podcast episode'. Internal links: Use absolute site paths that match the front matter 'path' field. Example: page front matter 'path: /cocktails/yippee-kay-yay-motherfucker/' and link to it as '/cocktails/yippee-kay-yay-motherfucker/'. Image links: Use absolute paths under /img/, e.g., '![Recipe ...](/img/cocktails/yippee-kay-yay-motherfucker.png)'.

Notes: - Use parentheses-wrapped URLs with descriptive link text. - For cross-references within the site, reference the front-matter path value (avoid relative file-system paths unless necessary).

## Tone and Style

### Voice

"I like tools that serve me, not ones that try to extract value from me or my attention." — conversational, personal, occasionally opinionated and candid.

### Target Audience

"These are things that I have built simply because I wanted them to exist..." — audience is a general reader or maker interested in personal projects and recipes; content assumes curiosity, not enterprise-level expertise.

### Technical Level

"a Go package to read a SQLite database, extract the schema and data to [Apache Avro](https://avro.apache.org/) and vice versa" — technical detail appears when needed (mentions of languages, packages, and APIs), but explanations are concise and aimed at readers who understand basic developer terms.

## Best Practices

1. Front matter as canonical title: Do not add an H1 in the body — rely on the YAML title field for page titles (observed pattern: every file contains a 'title' front matter field). Example front matter: '---\ntitle: Yippee Kay Yay Motherfucker!\npath: /cocktails/yippee-kay-yay-motherfucker/\n---'.
2. Sectioning: Use '##' for page-level sections and '###' for lists/details. Concrete example: projects.md uses '## Home Cooked Software [^1]' as the main section and recipe pages use '### Ingredients'.
3. External links: Use standard Markdown link syntax with full URL and a short descriptor following a hyphen. Example from projects.md: '[Readinglist.live](https://www.readinglist.live) - Turn any web page into a podcast episode, with decently human sounding voices.'
4. Image placement: Place images with absolute site paths under /img/ and reference them directly from pages (example: '![Recipe for the Yippee Kay Yay Motherfucker!](/img/cocktails/yippee-kay-yay-motherfucker.png)').
5. Directory-as-collection: keep collection landing pages named _index.md and individual resources in their own folder with index.md. This mirrors the existing 'cocktails' structure and enables grouping metadata per collection.

## Directory Structure

Observed organization and rules:

Root (.)
- _index.md — site homepage (example: 'title: brittcrawford.com', 'path: /').
- projects.md — a top-level non-index page listing projects (title and path present).

Collection directories (pattern: each collection has _index.md and per-item subfolders):
- cocktails/
  - _index.md — collection landing (title: "Cocktail Recipes", path: /cocktails)
  - <recipe-slug>/
    - index.md — per-recipe page (title, date optional, path: /cocktails/<recipe-slug>/)
  Examples: cocktails/yippee-kay-yay-motherfucker/index.md, cocktails/mother-of-invention/index.md.

Single-section directories:
- daresnot/
  - index.md — essay/note page (title: Daresnot, date: 2018-03-08, path: /daresnot/)

File naming conventions observed:
- Use index.md for a page that represents a specific resource in a directory. Example: cocktails/el-nino/index.md.
- Use _index.md for directory-level landing pages that list or introduce a collection. Example: cocktails/_index.md.
- Slugs and filenames are lowercase and hyphen-separated, including punctuation removed or replaced by hyphens (e.g., "yippee-kay-yay-motherfucker").

Placement rules for new content:
- If you are adding a new collection (e.g., 'desserts'), create a folder desserts/ with desserts/_index.md (collection introduction) and add individual items as desserts/<item-slug>/index.md with their own front matter.
- If the page represents a standalone resource at root, add it as a top-level .md file (like projects.md) and set the correct 'path' front matter.

Recursing explanation for collections: Each recipe lives in its own folder so that related assets (images) can be colocated; e.g., place song image at /img/cocktails/<slug>.png and reference from cocktails/<slug>/index.md using the absolute path '/img/cocktails/<slug>.png'.

## Usage

This style guide should be used when creating new documentation for this project. Follow the patterns and guidelines outlined above to ensure consistency with existing documentation.

*Generated on: 2025-09-06T23:46:17.547Z*
