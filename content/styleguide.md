---
title: "Styleguide"
layout: styleguide
description: "Every design token and prose element the site can render, in one place."
build:
  list: never
---

Everything below this line comes from Markdown, so it exercises the real
rendering pipeline rather than hand-written HTML that only looks like it.

### Text

Body copy at the base size, with a [prose link](/), some **bold**, some
*italic*, a bit of `inline code`, and a ~~struck-out clause~~. Long-form text
should hold a comfortable measure rather than running the full width of the
page.[^measure]

[^measure]: Footnotes hang off the bottom with their own rule, which is one of
the three elements Coder styled and the design system's base layer does not —
along with tables and figures. All three are checked on this page for exactly
that reason.

### Lists

* An unordered item
* Another, with a [link](/cocktails/)
  * A nested item
  * And another
* A fourth, to show the marker colour cycle

1. An ordered item
2. A second
3. A third

### Quote

> The best way to predict the future is to invent it. A quote runs at the
> quote leading, with the theme's accent on its left edge.

### Rule

---

### Table

| Token | Role | Where it shows up |
|---|---|---|
| `--surface-page` | Page background | Every page |
| `--text-body` | Running text | Paragraphs, lists |
| `--link` | Link colour | Prose links |
| `--border-hairline` | Hairline | Rules, table cells |

### Figure

![A cocktail, photographed from above](/img/cocktails/el-nino.png "El Niño")

### Code

Inline `const answer = 42;` sits in running text. A fenced block gets syntax
highlighting from the same tokens as everything else:

```go
// Highlighted by Chroma, coloured by --code-* tokens.
func Sum(values []int) int {
	total := 0
	for _, v := range values {
		total += v // an inline comment
	}
	return total
}
```

```javascript
const greet = (name = "world") => `hello, ${name}`;
console.log(greet());
```

### Disclosure

<details>
<summary>A collapsed section</summary>

With content inside it, including a [link](/) and some `code`.

</details>
