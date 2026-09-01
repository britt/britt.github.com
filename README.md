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

## Local development

```
hugo server
```

See [CLAUDE.md](CLAUDE.md) for the design system, the token architecture, and how to
add a cocktail.
