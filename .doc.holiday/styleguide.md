# Documentation Style Guide

## Project Overview

**Project:** Hi. Welcome to brittcrawford.com.
**Description:** This is my personal website. Right now it just has a business card-like list of links and a non-committal description. I might add more to it in the future.
**Publishing System:** Hugo
**Publishing Detection Confidence:** high

## Content Overview

Main topics and content areas
- Personal home page and projects: content/_index.md and content/projects.md list projects and links (e.g., Readinglist.live, lotsofcsvs.com, avro-sqlite). These pages are short, descriptive lists of projects and links.
- Cocktails collection: content/cocktails contains many per-recipe subfolders (e.g., content/cocktails/yippee-kay-yay-motherfucker/index.md) with associated images in static/img/cocktails/. Each recipe uses index.md and an image file with matching slug-name.
- Daresnot, exampleSite and theme docs: themes/hugo-coder contains theme documentation (docs/*.md), archetypes and exampleSite content which include configuration and analytics guides. The theme README includes HTML and image usage.
- Static assets: static/ contains robots.txt, a PDF (we_can_be_heroes.pdf), a GPG key (britt.gpg) and a CNAME; static/img holds favicons and content images.
Primary purpose and goals
- Present a concise personal site that lists projects and content (cocktails, daresnot) with links to code repositories and external sites. The theme docs and exampleSite are present because the theme is vendored in-the-repo.
Target problems being addressed
- Provide a lightweight personal presence that links to code and projects.
- Host static content (recipes/cocktails) with images and per-item pages.
Content scope and categories
- Landing / (content/_index.md): summary plus project list.
- Projects (/projects, content/projects.md): longer list and descriptions of personal projects, with external links to GitHub and live sites.
- Collections: content/cocktails/*, content/daresnot/index.md—each collection uses directories and index.md files per item.
- Theme/docs: themes/hugo-coder/docs/* — instructions, analytics integration examples.
Specific content features observed
- Markdown body content with Markdown links, emphasis and footnotes (example: "## Home Cooked Software [^1]").
- Front matter present and used for title, path, date, draft.
- Archetype uses TOML (+ + +) to generate default front matter with draft = true.
- Images and static assets are organized under static/img and static/img/cocktails matching content slugs.

---
# REQUIRED front matter template for content files (use YAML, as observed in content/*.md)
# Keep the three dashes exactly as shown; Hugo accepts YAML between '---' delimiters.
---
title: "<Page Title>"
path: "/<path>"        # exact site path, leading slash required (observed usage: path: /projects)
date: "2025-01-01T00:00:00Z"  # ISO 8601 date; optional if not needed but present in many files
draft: true            # true for unpublished content; archetype sets this by default in the repo
---

# NOTES specific to this Hugo repo
- Place content files under content/. Use _index.md for section/list pages and index.md inside a slug directory for content items.
  - Example: content/cocktails/_index.md  (section)
  - Example: content/cocktails/el-nino/index.md (item)
- Static assets (images, PDFs) go under static/ and are referenced from Markdown as '/img/<...>' or '/<file>'. The repo uses static/img and static/img/cocktails/ with filenames matching the content slug.
- Archetypes: this repo's archetypes/default.md uses TOML (+ + +) templating. If you standardize front matter to YAML, update archetypes/default.md accordingly.

# Hugo features used / supported in this repo
- Shortcodes & templating: theme (hugo-coder) and exampleSite reference shortcodes and theme partials. Use Hugo shortcodes for advanced image handling and embedding when needed (the repo's theme supports shortcodes in exampleSite).
- Taxonomies: none observed in content, but theme exampleSite uses authors/tags/categories. If you add taxonomies, place them in front matter and follow theme conventions.

# Hugo file/organization requirements (explicit)
- Every page must live in content/ (Hugo's requirement).
- For section pages that list children, use _index.md (observed pattern in content/cocktails/_index.md). For leaf content, use content/<section>/<slug>/index.md.
- Keep theme files under themes/hugo-coder and do not modify vendor theme files unless you intend to vendor the theme; prefer to override templates in layouts/ if customizing.


## Key Recommendations

1. Standardize front matter format across the repo: choose YAML (---) or TOML (+++) and convert existing files to that format. Currently content files use YAML (---) while archetypes/default.md uses TOML (+++). Pick one to avoid confusion and ensure archetype matches produced files.
2. Use consistent page filenames: use _index.md for section/list pages (e.g., content/cocktails/_index.md) and index.md for single content entries in a slug folder (e.g., content/cocktails/el-nino/index.md). Replace duplicates of both index.md and _index.md in the same path with the correct pattern to avoid Hugo ambiguity.
3. Enforce a minimal front matter set for all content files: every content file must include title and path. Add date where relevant. Adopt and commit a single exact front matter template (see 'Publishing Requirements' YAML block) and add a pre-commit hook or linter that asserts presence/format.
4. Normalize internal linking to use the front matter path field for canonical internal links and use relative links for intra-section navigation. Example: link to Projects as /projects (matches 'path: /projects').
5. Add explicit alt text and consistent naming for images: name images with the content slug (observed pattern) and require alt text in Markdown image references or use Hugo image shortcodes to ensure accessibility and responsive handling (e.g., use the static/img/ path observed).

## Structure Guidelines

### Heading Style

Use one H1 per page that mirrors the front matter title. Examples observed:
- Use '# Hi. Welcome to brittcrawford.com.' for the site landing page H1 (README.md example).
- Use '## Home Cooked Software [^1]' for subsection headings in content/projects.md and content/_index.md.
- Pattern: H1 for page title, H2 for main sections. Example snippet from content/_index.md:
  ## Home Cooked Software [^1]
  * [Readinglist.live](https://www.readinglist.live) - Turn any web page into a podcast episode, ...

Guideline: keep headings shallow (H1 + H2) unless content requires deeper structure.

### Content Organization

Follow this file-level organization (observed pattern):
- Root-level pages: content/<name>.md (example: content/projects.md) with front matter including 'path: /<name>'. These act as single pages with explicit paths.
- Section pages: content/<section>/_index.md to present lists/section metadata (example: content/cocktails/_index.md).
- Item pages: content/<section>/<slug>/index.md for each item (example: content/cocktails/el-nino/index.md).
- Static assets: static/img/<section>/<slug>.<ext> (example: static/img/cocktails/el-nino.png).
- Archetype: archetypes/default.md should supply the default front matter when creating new content. Current archetype uses TOML and sets draft = true.

Example concrete file mapping:
- content/cocktails/el-nino/index.md => url: /cocktails/el-nino/ (served by Hugo)
- static/img/cocktails/el-nino.png => referenced in the page as '/img/cocktails/el-nino.png' or via a Hugo image shortcode.

### Metadata Usage

Complete front matter example (YAML) used by content files. Use exactly this format for new content files (Hugo interprets YAML between '---'):

```yaml
---
title: "<Page Title>"
path: "/<path>"
date: "<YYYY-MM-DDTHH:MM:SSZ>"
draft: true
---
```

Observations:
- 'title' is present in 35 files; ensure it is present in every content file.
- 'path' is present in 34 files; when present it sets the canonical URL (example: 'path: /projects').
- 'date' is used in ~29 files; include date for posts/time-sensitive pages.
- archetypes/default.md currently uses TOML (+ + +) and templates the title and date:

```toml
+++
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
date = {{ .Date }}
draft = true
+++
```

Recommendation: convert archetype to YAML to match most content or convert content to TOML consistently.


### Linking Strategy

Use Markdown links for external sites and explicit path-based internal links for site navigation. Examples from the content:
- External link (Markdown): [Readinglist.live](https://www.readinglist.live)
- External GitHub link: [Teleprompter](https://github.com/britt/teleprompter)
- Internal canonical path specified in front matter: 'path: /projects' and link to that path from nav or other pages as '/projects'.

Guidelines:
- For external resources: use full absolute URLs in standard Markdown link syntax: [label](https://host/path).
- For internal pages: link to the front-matter path (e.g., '/projects') rather than linking to filenames (e.g., content/projects.md). This keeps links stable if files are moved or reorganized.
- For images: reference them using absolute paths to static assets (observed pattern): '/img/cocktails/el-nino.png' or use Hugo image shortcodes to enable responsive behavior and alt text.
- Footnotes: observed '[^1]' usage in headings; keep footnote syntax consistent if used across pages.

## Tone and Style

### Voice

"This is my personal website. Right now it just has a business card-like list of links and a non-committal description. I might add more to it in the future.",
- This exact sentence (from README.md) demonstrates a casual, first-person, conversational voice with mild self-deprecation and minimalism.

### Target Audience

"These are things that I have built simply because I wanted them to exist, or in the case of **avro-sqlite**, because I wanted to see if I could.[^2] I like tools that serve me, not ones that try to extract value from me or my attention."
- This explicit phrasing shows the target audience is other builders, developers, and people interested in small, practical tooling and personal projects (technical and maker-oriented readers).

### Technical Level

"avro-sqlite - a Go package to read a SQLite database, extract the schema and data to Apache Avro and vice versa"
- This concrete example indicates a moderate technical level: audience expected to understand programming languages (Go), data serialization formats (Avro), and project-level tooling. Theme docs (analytics.md, configurations.md) add configuration-level technical material.

## Best Practices

1. Title and H1 parity: Put the page title in front matter (title:) and use that same text as the H1 on the page. Example observed: front matter title: 'brittcrawford.com' and page body starts with no H1 but the repo shows '# Hi. Welcome to brittcrawford.com.' as the H1 sample. Implement: include both so the rendered page has consistent title/meta and content H1.
2. Section and item file organization: Follow the observed pattern of directories per item. Example: content/cocktails/el-nino/index.md (content) paired with static/img/cocktails/el-nino.png (image). When adding new recipe pages, create a folder named with the slug and an index.md in it and add the image to static/img/<section> with matching slug.
3. Use archetypes to seed new content: The repo includes archetypes/default.md (TOML) that sets draft = true and a templated title. Keep or adapt this archetype so new content consistently has draft set and the title auto-filled. If you standardize to YAML, update the archetype accordingly.
4. Link formatting consistency: Use Markdown link style for external links. Example observed: '[Readinglist.live](https://www.readinglist.live)'. For internal links use the explicit path front matter value (e.g., 'path: /projects') and link to '/projects' so links remain stable regardless of filename changes.

## Directory Structure

Top-level organization (observed across 39 directories):
- content/: main site content. Examples:
  - content/_index.md (site landing page) — front matter with title, path.
  - content/projects.md (a page at '/projects') — front matter with title and path.
  - content/cocktails/ (section) contains a _index.md and many per-item folders: content/cocktails/el-nino/index.md, content/cocktails/anderson-island-sunset/index.md, etc.
  - content/daresnot/index.md — another content page.
- archetypes/: contains default.md (templated front matter used when creating new content). Current archetype uses TOML with draft = true.
- themes/hugo-coder/: vendored theme with docs/, exampleSite/, assets/. Theme includes README.md, LICENSE and many docs such as analytics providers and quick-start instructions.
- static/: static assets served at site root. Examples: static/robots.txt, static/we_can_be_heroes.pdf, static/britt.gpg, static/CNAME.
- static/img/: images referenced by content and theme, including static/img/cocktails/ with file names matching content slugs (e.g., static/img/cocktails/yippee-kay-yay-motherfucker.png).
- layouts/: custom templates for the site; index.html present at layouts/index.html.

File naming conventions observed and rules for adding new content
- Section listing pages: use _index.md (example: content/cocktails/_index.md). If a section has multiple items, create a _index.md for the section overview.
- Per-item pages: create a folder under the section named with the slug and place index.md inside (example: content/cocktails/el-nino/index.md). This pattern is used consistently for cocktails.
- Single-file pages at root: allowed (example content/projects.md). For these files, include a 'path' front matter field to set the URL explicitly (example front matter: 'path: /projects').
- Images: store under static/img/<section>/ and name the file to match the content slug (example: content/cocktails/el-nino/index.md pairs with static/img/cocktails/el-nino.png).
- Theme docs and exampleSite follow similar content/ structure inside themes/hugo-coder/exampleSite/content/.

Duplicate/ambiguous items to resolve when adding content
- The repo contains duplicates of some files (e.g., multiple README.md and repeated _index.md in the listing). When adding new content, avoid creating both index.md and _index.md at the same path unless intentionally creating a section vs a leaf page; follow the rule: use _index.md for section pages and index.md for a leaf within slug directory.

## Usage

This style guide should be used when creating new documentation for this project. Follow the patterns and guidelines outlined above to ensure consistency with existing documentation.

*Generated on: 2025-09-07T00:09:04.918Z*
