# Performance baseline — `master`

Measured from a clean `hugo --gc --minify` build of `origin/master` at
`2d90beec79`, before any redesign work merged. Regenerate with:

```
node scripts/payload.mjs public /index.html /cocktails/el-nino/index.html
```

## Summary

| | raw | gzip |
|---|---:|---:|
| CSS (2 files) | 145.3 KB | **30.6 KB** |
| JS (1 file) | 1.8 KB | 0.7 KB |
| Preloaded webfonts (3 × Font Awesome `woff2`) | 295.3 KB | 295.5 KB |
| Font Awesome `ttf` fallbacks (referenced, not preloaded) | 688.5 KB | 315.0 KB |

Every page pays all of it. Notable in the CSS number: `coder-dark.min.css` is a
complete second copy of the theme's rules, and `coder.min.css` carries notices,
tabs, taxonomies, pagination and Mastodon styling that nothing on this site uses.

The three preloaded Font Awesome files exist to draw **three glyphs**: a GitHub
mark, a LinkedIn mark, and the theme toggle's contrast icon.

## Budget

From #63, held for the rest of the redesign:

| | budget |
|---|---:|
| CSS, gzipped | ≤ 30 KB |
| Webfonts, total | ≤ 100 KB |
| JS, gzipped | ≤ 10 KB |

The CSS budget is deliberately set at the baseline, not below it: the redesign
must not cost more than the theme it replaces, despite adding real webfonts.

## Third-party requests to remove

- `https://www.gravatar.com/avatar/…` — one avatar on the home page, fetched
  from a third party on every visit.
- `https://fonts.googleapis.com/css2?…` — introduced by the design system's
  token export; #45 self-hosts it.

### /index.html

html: 18.3 KB (4.7 KB gzipped)

| asset | kind | raw | gzip |
|---|---|---:|---:|
| /css/coder-dark.min.ad48f476275974885bdc03d5251e3cdbe1678c54a63ff772376b0ed2adc468dd.css | css | 16.9 KB | 1.8 KB |
| /css/coder.min.f03d6359cf766772af14fbe07ce6aca734b321c2e15acba0bbf4e2254941c460.css | css | 128.3 KB | 28.8 KB |
| /fonts/fa-brands-400.ttf | font | 205.9 KB | 119.9 KB |
| /fonts/fa-brands-400.woff2 | font | 115.9 KB | 116.0 KB |
| /fonts/fa-regular-400.ttf | font | 66.5 KB | 26.4 KB |
| /fonts/fa-regular-400.woff2 | font | 24.9 KB | 24.9 KB |
| /fonts/fa-solid-900.ttf | font | 416.1 KB | 168.7 KB |
| /fonts/fa-solid-900.woff2 | font | 154.5 KB | 154.6 KB |
| /images/favicon.svg | MISSING | — | — |
| /images/safari-pinned-tab.svg | MISSING | — | — |
| /img/apple-touch-icon-144-precomposed.png | image | 3.1 KB | 3.0 KB |
| /img/favicon.png | image | 0.8 KB | 0.8 KB |
| /js/coder.min.6ae284be93d2d19dad1f02b0039508d9aab3180a12a06dcc71b0b0ef7825a317.js | js | 1.8 KB | 0.7 KB |

| kind | files | raw | gzip |
|---|---:|---:|---:|
| css | 2 | 145.3 KB | 30.6 KB |
| font | 6 | 983.7 KB | 610.4 KB |
| image | 2 | 3.9 KB | 3.8 KB |
| js | 1 | 1.8 KB | 0.7 KB |

remote requests (31):
  - http://www.linkedin.com/in/brittcrawford/
  - https://avro.apache.org/
  - https://britt.github.io/agent-skills/
  - https://brittcrawford.com/
  - https://brucesterling.tumblr.com/post/749569601319452672/realistic-utopias-a-speech-by-bruce-sterling
  - https://davidgasquez.com/useful-llm-tools-2024/
  - https://github.com/britt/
  - https://github.com/britt/avro-sqlite
  - https://github.com/britt/cf-app-template
  - https://github.com/britt/obsidian-notes-watcher
  - https://github.com/britt/teleprompter
  - https://github.com/britt/testivus/
  - https://github.com/britt/vibes/tree/main/yts
  - https://github.com/davidgasquez/dotfiles/blob/bb9df4a369dbaef95ca0c35642de491c7dd41269/shell/zshrc#L75-L99
  - https://github.com/luizdepra/hugo-coder/
  - https://gohugo.io/
  - https://maggieappleton.com/home-cooked-software
  - https://smile.amazon.com/Snugglebear-Team-Company-Havamal/dp/B07N114BWY/ref=sr_1_2?keywords=havamal&amp;qid=1550960415&amp;s=digital-skills&amp;sr=1-2-catcorr
  - https://www.gravatar.com/avatar/491881dc0136c7ca0d5376e1679ae103?s=240&d=mp
  - https://www.icloud.com/shortcuts/00c6d7ac0b58419dbf30831de73e26f1
  - https://www.icloud.com/shortcuts/184e00cafc484dabbbe89efe19c44cba
  - https://www.icloud.com/shortcuts/18f7fe2b50084cd9ba98655c8d4b9a90
  - https://www.icloud.com/shortcuts/1f2b289be44b425ba16934af629b688f
  - https://www.icloud.com/shortcuts/4e68f1c746334726a8106459f8f3c51b
  - https://www.icloud.com/shortcuts/52abec89fceb40369d192f7e6b270273
  - https://www.icloud.com/shortcuts/b402f6377b5b42169298285437fb28db
  - https://www.icloud.com/shortcuts/ce0b8eb392184f44a510c96f0f1d9509
  - https://www.lotsofcsvs.com
  - https://www.oliverburkeman.com/donelist
  - https://www.readinglist.live
  - https://www.sandgarden.com

### /cocktails/el-nino/index.html

html: 5.4 KB (1.8 KB gzipped)

| asset | kind | raw | gzip |
|---|---|---:|---:|
| /css/coder-dark.min.ad48f476275974885bdc03d5251e3cdbe1678c54a63ff772376b0ed2adc468dd.css | css | 16.9 KB | 1.8 KB |
| /css/coder.min.f03d6359cf766772af14fbe07ce6aca734b321c2e15acba0bbf4e2254941c460.css | css | 128.3 KB | 28.8 KB |
| /fonts/fa-brands-400.ttf | font | 205.9 KB | 119.9 KB |
| /fonts/fa-brands-400.woff2 | font | 115.9 KB | 116.0 KB |
| /fonts/fa-regular-400.ttf | font | 66.5 KB | 26.4 KB |
| /fonts/fa-regular-400.woff2 | font | 24.9 KB | 24.9 KB |
| /fonts/fa-solid-900.ttf | font | 416.1 KB | 168.7 KB |
| /fonts/fa-solid-900.woff2 | font | 154.5 KB | 154.6 KB |
| /images/favicon.svg | MISSING | — | — |
| /images/safari-pinned-tab.svg | MISSING | — | — |
| /img/apple-touch-icon-144-precomposed.png | image | 3.1 KB | 3.0 KB |
| /img/cocktails/el-nino.png | image | 349.2 KB | 318.0 KB |
| /img/favicon.png | image | 0.8 KB | 0.8 KB |
| /js/coder.min.6ae284be93d2d19dad1f02b0039508d9aab3180a12a06dcc71b0b0ef7825a317.js | js | 1.8 KB | 0.7 KB |

| kind | files | raw | gzip |
|---|---:|---:|---:|
| css | 2 | 145.3 KB | 30.6 KB |
| font | 6 | 983.7 KB | 610.4 KB |
| image | 3 | 353.1 KB | 321.8 KB |
| js | 1 | 1.8 KB | 0.7 KB |

remote requests (5):
  - https://brittcrawford.com/
  - https://brittcrawford.com/cocktails/el-nino/
  - https://github.com/luizdepra/hugo-coder/
  - https://gohugo.io/
  - https://twitter.com/jcoltkelly
