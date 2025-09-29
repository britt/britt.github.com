# Documentation Style Guide

## Project Summary

Project: Hi. Welcome to brittcrawford.com.

This repository is a personal website built with Hugo (static site generator) and the hugo-coder theme. The site currently functions as a small personal/business-card site with lists of links and short descriptions, with potential for future expansion (projects, posts, recipes/cocktails, a daresnot page, etc.). The audience is primarily site visitors (general public), and the internal audience includes the site owner and any contributors who may add content. Technical details: content is organized under content/, static assets under static/, and theme files under themes/hugo-coder/. Markdown files with YAML/TOML front matter drive page metadata. Content features observed include table-of-contents usage, explicit metadata front-matter, code examples, API-style or reference-style content, and tables.

Purpose and goals:
- Provide consistent, small-site content (about, contact, projects, posts, content collections such as cocktails).
- Maintain a clean, minimal structure matching Hugo conventions so new pages can be added quickly and consistently.
- Enable future expansion (tutorials, API docs, examples) without breaking site generation.

Technical complexity level: Low to medium. Content is primarily Markdown pages augmented with Hugo front matter and optional shortcodes or template-specific features from the hugo-coder theme. Contributors should be comfortable with Markdown, front matter metadata, and basic Hugo path conventions.

Writing patterns and conventions observed:
- File names follow kebab-case (e.g., yippee-kay-yay-motherfucker). Collection indexes use _index.md or index.md. Archetypes/default.md exists for new content skeletons.
- Front matter commonly includes title, path, date; draft is used rarely but present. These three appear consistently across content samples.
- Content collections (content/cocktails, content/daresnot, etc.) each contain an index or _index and per-item pages with index.md.
- Theme documentation filenames indicate section titles like Quick Start, FAQ, Analytics, etc. Use Title Case for section headings.

Examples of content types present:
- Short descriptive pages (index/_index.md)
- Project listing pages (projects.md)
- Collection items (content/cocktails/*/index.md)
- Theme documentation (themes/hugo-coder/docs/*.md)
- Static assets (static/img/*)

Key takeaway: Use minimal, consistent metadata, a clear heading hierarchy, plain-language short paragraphs, and Hugo-native link paths when linking between pages.

## Context

**Project:** Hi. Welcome to brittcrawford.com.
**Description:** This is my personal website. Right now it just has a business card-like list of links and a non-committal description. I might add more to it in the future.
**Publishing System:** Hugo

## Primary Documentation Goals

## Writing Rules

### Core Principles
- **Be concise** - Use the minimum words necessary
- **Be practical** - Focus on actionable information
- **Be example-driven** - Show working code for every concept
- **Be consistent** - Match existing documentation patterns

### Tone Guidelines

#### Default Tone (Technical Users)
- Direct and practical language
- Assume familiarity with TypeScript, package managers, CLI
- Use technical jargon and shorthand
- Focus on code examples over explanations
- Avoid marketing language or benefit statements

#### Non-Technical User Adjustments
When explicitly writing for non-technical users:
- Explain what each command does and why
- Spell out abbreviations and technical terms
- Provide simpler code examples with explanations
- Include more step-by-step guidance
- Link to additional learning resources

### Publishing System Requirements
Hugo-specific publishing requirements and front-matter templates

Required metadata fields (based on repository patterns)
- title (string) — appears in nearly all pages; used as H1 and page title
- path (string) — used in this repo; set to the canonical URL path (relative) for the page
- date (date/time) — content creation or publish date
- draft (boolean) — optional but present in at least one file; default false for published content

Recommended optional metadata (use as needed)
- description (string) — short summary used by themes for meta description
- slug (string) — if you need a custom slug different from filename/path
- tags (array of strings) — for posts or collections
- categories (array of strings) — for posts
- image (string) — path to a representative image under static/img/
- menu (object) — if adding to site menu

Exact front-matter template (YAML-style) to use in new pages

---
title: "Your Page Title"
path: "your/desired/path/"
date: 2025-09-29T12:00:00Z
draft: false
# Optional fields
# description: "One-line summary for SEO and previews"
# slug: "custom-slug"
# tags: ["tag1", "tag2"]
# categories: ["category1"]
# image: "/img/path-to-image.png"
---

Notes on using the front matter:
- Keep title as a plain string. This will be the H1 in templates. Avoid markup in title.
- path should end with a trailing slash when representing a directory-style URL (recommended by observed patterns). Example: path: "cocktails/"
- Use ISO 8601 datetimes for date. If you only need a date, YYYY-MM-DD is acceptable but include time when possible.
- Set draft: true for local or in-progress pages to prevent publication; switch to false when ready.

Code and content examples
- Inline code: Use single backticks for inline code like `hugo server`.
- Code blocks: Use fenced code blocks with language for syntax highlighting. Example:

```bash
# Start local Hugo server
hugo server -D
```

```markdown
# Example Markdown snippet
## Ingredients
- 2 oz Bourbon
- 0.75 oz Lemon juice
```

API & reference documentation guidance
- Treat API docs like technical pages: start with a short summary, followed by request/response examples, parameters table, and example code blocks.
- Use fenced JSON/YAML blocks for API examples. Example:

```json
{
  "status": "ok",
  "message": "Example response"
}
```

Table usage
- Use GitHub-style Markdown tables for simple tabular data. Keep column headers short and left-aligned unless numeric.
- Example:

| Parameter | Type | Description |
|---|---:|---|
| id | string | Unique identifier |
| limit | int | Max items to return |

Publishing checklist before committing
1. Ensure required front matter fields exist: title, path, date, draft
2. Run a local Hugo build (hugo server -D) and confirm no template or link errors
3. Validate internal links (see linking strategy) and verify image references under static/img/
4. Confirm TOC generation if present and adjust headings so H1 → H2 progression is sensible

If using archetypes/default.md
- Keep archetype up to date with the required front matter template above. The repo contains archetypes/default.md — update it if metadata requirements change.

### Content Structure Rules
Content organization guidelines by page type

General rules
- Start each page with front matter, then a single H1 (which may be rendered by the theme from title), then an introductory paragraph (1-3 short sentences) stating purpose.
- Use a Table of Contents for long pages (Hugo can auto-generate TOC). Ensure H2s reflect the TOC entries.
- Break content into digestible sections with H2 headers, and use H3/H4 for subpoints.
- Use bulleted lists for non-sequential items and numbered lists for step-by-step instructions.
- Provide code examples, API request/response examples, and small runnable snippets where helpful.
- Use images sparingly; reference them from /img/ and include alt text.

Technical Documentation Pages (API, reference)
- Begin with a brief overview and purpose statement.
- Provide authentication and prerequisites if applicable.
- Include a canonical example request and response near the top.
- Use a parameters table for listing request/query/body parameters.
- Include a troubleshooting or common errors section at the end.

Process / How-to pages (if added)
- Begin with prerequisites and a short summary.
- Use numbered steps for procedures. Keep steps concise.
- Provide validation/expected outcome and troubleshooting at the end.

Collection item pages (e.g., cocktails)
- Start with metadata (front matter) then a short intro sentence.
- Include key structured sections: Ingredients (H2), Instructions (H2), Notes/Variations (H2).
- Provide a representative image via front matter image or inline Markdown image referencing /img/cocktails/<image>.

Examples (documented patterns found in the repo)
- Collection home (_index.md) -> gives an overview and a list of links to per-item pages.
- Per-item index.md inside a folder -> H1 equals the item name, followed by sections like Ingredients and Instructions.

Tables
- Use Markdown tables for parameter lists or small datasets. Keep them narrow (3–4 columns maximum) for readability.
- Example table header style: | Parameter | Type | Description |

Metadata and TOC
- Keep the front-matter minimal but consistent. If using the theme’s auto-generated TOC, ensure headings are H2/H3 only so the TOC is useful.

Accessibility and style
- Use descriptive link text (avoid "click here").
- Add alt text for all images.
- Keep sentences short and active voice.
- Prefer inclusive, neutral language.

#### Heading Rules
```markdown
Heading hierarchy and exact examples

H1 (Single per file)
- Use exactly one H1 per document. The H1 should match the front-matter title and be the canonical page title.
- Capitalization: Title Case.
- No trailing punctuation.
- Example headings inferred from file names/observed docs: "# Quick Start", "# Multilingual Mode", "# Home", "# FAQ", "# Contributing", "# Configurations", "# Comment System", "# Analytics"

H2 (Major sections)
- Use H2 for top-level sections inside a page. Title Case.
- Examples: "## Project Overview", "## Ingredients", "## Instructions", "## API Reference", "## Examples"
- When a TOC is present, H2s should represent the primary TOC entries.

H3 (Subsections)
- Use H3 for details under H2 sections.
- Examples: "### Request", "### Response", "### Parameters", "### Notes"

H4-H6 (Rare usage)
- Use only when necessary for deep technical or nested information (e.g., nested lists in an API section).
- Example: "#### Error Codes"

Heading usage rules
- Maintain a strict progression: H1 → H2 → H3 (do not skip levels)
- Keep headings short and descriptive; one line or less.
- Use Title Case for headings throughout.

Exact examples drawn from repository file names (use these as canonical headings):
- # Quick Start
- ## Analytics
- ## Multilingual Mode
- ## FAQ
- ## Home
- ## Contributing
- ## Configurations
- ## Comment System

Note: Many theme docs use Title Case and singular words for major headings; follow that same pattern for consistency.
```

### Formatting Requirements

#### Lists

- Use bullets for unordered lists
- No periods at end of list items
- Use Oxford comma in series

### Code Example Requirements

1. Always include syntax highlighting with language tags
2. Always include a language tag when adding a code block
3. Show both input and expected output
4. Include comments for complex logic
5. Place runnable example near page top
6. Use codetabs for platform variants

### Linking Rules
Linking strategy and exact syntax patterns

Internal links
- Use absolute paths relative to the site root (start with /). This keeps links stable regardless of page location.
- Examples:
  - Link to a collection home: [Projects](/projects/)
  - Link to an item: [La Pomme Forte](/cocktails/la-pomme-forte/)
  - Link to theme docs: [Quick Start](/themes/hugo-coder/docs/quick-start/) (if served)
- When linking to content files in Markdown, use their canonical path (path front-matter or directory slug). If the front matter includes path, prefer linking to that path.
- For asset links (images), use site-root absolute paths: ![La Pomme Forte](/img/cocktails/la-pomme-forte.png)

External links
- Use full URLs with protocol (https://) and open in the same tab by default. If you intend to open in a new tab, add a brief note in parentheses or use target attributes only if supported by templates.
- Example: [Node.js](https://nodejs.org)
- Prefer linking to authoritative sources for technical references and include the date last accessed in documentation where stability matters.

Cross-reference and navigation standards
- Prefer internal absolute paths for cross-references so links remain stable (e.g., [Contact](/contact/)).
- When referencing another document in the repo, link to the public URL path, not the raw GitHub file path.
- When linking to a section on another page, link to the page with a hash to the heading slug, for example: [API Parameters](/docs/api#parameters) — ensure the target heading slug matches Hugo’s slug generation rules (lowercase, hyphen-separated).

Link maintenance and validation
- Validate internal links during the review process by running the site locally and navigating to each link.
- Prefer relative links for assets under static/ but absolute site-root links are recommended for pages.

Exact syntax examples
- Internal page link: [Projects](/projects/)
- Internal item link: [Mother of Invention](/cocktails/mother-of-invention/)
- Image reference: ![Whoa animation](/img/whoa.gif)
- External link: [Hugo](https://gohugo.io)

Special cases
- If a page uses a custom front-matter 'path' that differs from the folder structure, link to the declared path value.
- When cross-referencing docs in the theme exampleSite, match the public-facing route (exampleSite is for demonstration and may not be published at the same root).

### Documentation Content Examples
- Below are examples of existing documentation that you should use for reference, including formatting, structure, layout, style, and language.
- The start and end of the following examples is marked by 10 dashes in a row, like this ----------. The 10 dashes in a row are not part of the formatting or content of the examples.

undefined

## Existing Documentation Directory Structure
Top-level overview and what belongs in each path

. (repository root)
- README.md — repository-level documentation and quick notes about the site.

content/
- _index.md — collection home pages for the site root or specific sections.
- projects.md, projects/ — pages and lists for projects. Use content/<collection>/_index.md for the collection home and content/<collection>/item-slug/index.md for items.
- content/cocktails/ — example collection. Each cocktail has its own folder and index.md (e.g., content/cocktails/la-pomme-forte/index.md). Use images from static/img/cocktails/.
- content/daresnot/index.md — single-page content or collection index.

archetypes/
- default.md — archetype template used by hugo new. Ensure front matter in this file matches the required front matter template.

layouts/
- index.html — site-level layout overrides. Only update if customizing templates beyond the theme.

themes/
- hugo-coder/ — theme files, documentation, and exampleSite. Do not edit the theme directly unless you intend to fork or vendor changes. Prefer theme overrides in layouts/ or assets/.

themes/hugo-coder/docs/
- Documentation for theme configuration (quick-start.md, analytics.md, etc.). These are examples of heading and content structure to follow for documentation pages.

static/
- robots.txt, CNAME, GPG, PDFs — static assets served as-is. Images go under static/img/ (and static/img/cocktails/ for cocktail thumbnails).

Key file conventions
- Collection homepage: content/<collection>/_index.md
- Per-item page: content/<collection>/<slug>/index.md
- Flat single pages: content/<pagename>.md or content/<pagename>/index.md
- Use kebab-case for filenames and slugs (lowercase, hyphen-separated)
- Keep media in static/img/ and reference as /img/<file> in Markdown or front matter image field.


*Generated on: 2025-09-29T23:46:06.863Z*
