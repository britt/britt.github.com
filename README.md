# Hi. Welcome to brittcrawford.com.

This is my personal website. It has a little bit about me and links to some things I have built.

Built with [Hugo](https://gohugo.io/).

## The theme is vendored, and read-only

`themes/hugo-coder/` is **not a submodule**. Its files are committed directly into
this repository, tracked from upstream
[`luizdepra/hugo-coder`](https://github.com/luizdepra/hugo-coder) at commit
`70c0792` (2025-05-27, an ancestor of `v1.2`). Every tracked file under
`themes/hugo-coder/` matches its upstream blob exactly — there are no local edits,
and there must not be any.

**Never edit anything under `themes/`.** Hugo resolves `assets/` and `layouts/` from
the project root *before* the theme, so a file at the root shadows the theme's copy
of the same path. That is the only supported way to change the theme's behaviour.

```
assets/scss/main.scss        shadows nothing — this is ours
layouts/partials/footer.html shadows themes/hugo-coder/layouts/partials/footer.html
```

Editing the theme in place appears to work and silently makes it unupgradable.

To refresh the theme, replace the directory wholesale from upstream and re-run the
build; because there are no local edits, nothing is lost.

## Toolchain

Hugo **0.163.0 extended**, pinned in three places that must stay in step:

| File | Consumed by |
|---|---|
| `.hugoversion` | humans, and any script that wants one line to read |
| `.tool-versions` | the Cloudflare Pages build image, and `asdf`/`mise` locally |
| `hugo.toml` → `[module.hugoVersion]` | Hugo itself — `min = "0.163.0"`, `extended = true` |

The `[module.hugoVersion]` gate is the one with teeth: an older or non-extended
binary fails the build outright instead of quietly producing a different site.
The extended build is not optional — the design system is compiled through Hugo
Pipes' `toCSS`.

### Why 0.163 and not 0.136

The deployed site was building on Hugo 0.136.5 while local development ran 0.163
— twenty-seven minor versions apart, with nothing pinned anywhere. The gap was
resolved by moving the deploy up, not local down, because 0.146 reorganised
template lookup and every template this site adds is authored against the newer
conventions.

The vendored theme still uses the pre-0.146 layout paths (`layouts/_default/`,
`layouts/partials/`, `layouts/index.html`). Hugo 0.163 resolves those without
deprecation warnings, so **root overrides use the same pre-0.146 paths as the
theme.** Mixing conventions is how an override ends up in a directory Hugo never
looks in, silently rendering the theme's version instead.

> **Deploy checklist.** Cloudflare Pages reads `.tool-versions`, but if the
> project also sets a `HUGO_VERSION` environment variable in the dashboard, the
> dashboard wins. Confirm it reads `0.163.0` or is unset.

## Local development

```
hugo server
```

See [CLAUDE.md](CLAUDE.md) for the design system, the token architecture, and how to
add a cocktail.
