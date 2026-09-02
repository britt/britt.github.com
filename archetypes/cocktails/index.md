---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
---

One or two sentences on where the drink came from. Credit anyone else's
recipe here — several of these are other people's.

### Ingredients

* 2oz Something
* ¾oz Something else
* 1 dash Bitters

How to make it, in one paragraph. The template lifts the list above into the
page's rail, so keep the ingredients as the first list on the page.

![Recipe for {{ replace .File.ContentBaseName "-" " " | title }}](/img/cocktails/{{ .File.ContentBaseName }}.png)
