# Self-hosted webfonts

Three families, four files, all OFL 1.1. Latin subset only — the same
`unicode-range` Google Fonts serves as `latin`, which covers the accented
characters the content actually uses (`El Niño`, `Håvamål`).

| File | Family | Axes | Size |
|---|---|---|---:|
| `public-sans-latin-var.woff2` | Public Sans | `wght 300–800` | 25.0 KB |
| `public-sans-italic-latin-var.woff2` | Public Sans Italic | `wght 300–800` | 26.7 KB |
| `fira-code-latin-var.woff2` | Fira Code | `wght 400–500` | 32.9 KB |
| `bricolage-grotesque-latin-var.woff2` | Bricolage Grotesque | `wght 400–800`, `opsz` **pinned to 32** | 38.9 KB |

Bricolage ships with an `opsz` axis spanning 12–96, which costs 36 KB — half
the file — to carry. Every heading on this site renders between 18 px and
44 px, so the axis was instanced at 32 rather than kept variable. That is the
single largest saving in the font budget and the only place where fidelity to
the upstream font was traded for bytes.

## Regenerating

```
python3 -m venv .venv && ./.venv/bin/pip install 'fonttools[woff]' brotli

# 1. fetch the latin @font-face src URLs with a woff2-capable UA
curl -A 'Mozilla/5.0 … Chrome/120' \
  'https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300..800;1,300..800&family=Fira+Code:wght@300..700&family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap'

# 2. download the `latin` subset of each, then narrow the axes
./.venv/bin/python -m fontTools.varLib.instancer -o out.woff2 in.woff2 opsz=32 wght=400:800
```

Licences: [Public Sans](https://github.com/uswds/public-sans),
[Fira Code](https://github.com/tonsky/FiraCode),
[Bricolage Grotesque](https://github.com/ateliertriay/bricolage) — all SIL Open
Font License 1.1.
