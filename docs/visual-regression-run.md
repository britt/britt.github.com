# Visual regression run — design system vs `master`

Produced by `tests/visual/check.sh` against the baseline captured from
`origin/master` at `2d90beec79`. 54 states: 9 routes × 2 schemes × 3 viewports.

## Verdict

**0 of 54 identical, and that is the expected result.** The redesign replaces
every rule on the site, so a state that had *not* changed would be the finding.
What this run is for is the shape of the change, not its presence:

- **No route disappeared and none collapsed.** All 48 baseline states have a
  counterpart; the six `added` rows are `/styleguide/`, which does not exist on
  `master` (#44).
- **`/projects/` renders as the home page**, at exactly home's dimensions at
  every viewport — 375×4696, 768×3245, 1440×2925. That is the alias from #60
  resolving, confirmed by geometry rather than by assertion.
- **Recipe pages got shorter at desktop**, 1440×2372 → 1440×1809 for El Niño
  and 2297 → 1836 for Bitter Nonsense. That is the ingredients rail from #59
  taking height out of the reading column.
- **Everything else grew**, which is the type scale and the spacing tokens: 19px
  body against Coder's 16px, and `--stack-*` rhythm against its flat 2rem.
- **`/404.html` changed least** (1.4–4.2%) because most of the frame is
  background, and the two page colours are close enough that pixelmatch's
  default threshold treats much of the field as unchanged. Confirmed correct by
  eye rather than by percentage.

## Truncation

`/styleguide/` exceeds the harness's 12,000px capture cap at every viewport —
29,700px at 375, 19,474px at 768, 15,642px at 1440. It is compared above the
cap only. Recorded here rather than left implicit: a silently truncated
screenshot is a regression test that has quietly stopped testing the bottom of
the page.

## Full report

| screenshot | verdict | % pixels changed | baseline | current |
|---|---|---:|---|---|
| styleguide--dark--1440.png | added | — | — | — |
| styleguide--dark--375.png | added | — | — | — |
| styleguide--dark--768.png | added | — | — | — |
| styleguide--light--1440.png | added | — | — | — |
| styleguide--light--375.png | added | — | — | — |
| styleguide--light--768.png | added | — | — | — |
| cocktail-peach-julep--dark--768.png | changed | 64.308 | 768x1024 | 768x2369 |
| cocktail-peach-julep--dark--1440.png | changed | 54.341 | 1440x900 | 1440x1762 |
| cocktail-peach-julep--dark--375.png | changed | 53.059 | 375x909 | 375x1866 |
| cocktail-bitter-nonsense--dark--375.png | changed | 52.297 | 375x1365 | 375x1962 |
| projects--dark--768.png | changed | 46.982 | 768x1818 | 768x3245 |
| cocktail-peach-julep--light--768.png | changed | 46.96 | 768x1024 | 768x2369 |
| cocktails-index--dark--1440.png | changed | 45.719 | 1440x967 | 1440x1739 |
| cocktail-el-nino--dark--375.png | changed | 45.052 | 375x1417 | 375x1948 |
| cocktail-el-nino--dark--1440.png | changed | 44.655 | 1440x2372 | 1440x1809 |
| cocktail-bitter-nonsense--dark--768.png | changed | 43.008 | 768x1942 | 768x2415 |
| cocktail-bitter-nonsense--dark--1440.png | changed | 42.092 | 1440x2297 | 1440x1836 |
| projects--dark--375.png | changed | 38.874 | 375x3126 | 375x4696 |
| cocktail-el-nino--dark--768.png | changed | 38.177 | 768x2019 | 768x2461 |
| cocktails-index--dark--375.png | changed | 35.945 | 375x1509 | 375x2229 |
| home--dark--768.png | changed | 35.182 | 768x2312 | 768x3245 |
| projects--dark--1440.png | changed | 32.307 | 1440x2073 | 1440x2925 |
| cocktail-el-nino--light--1440.png | changed | 31.68 | 1440x2372 | 1440x1809 |
| daresnot--dark--768.png | changed | 31.153 | 768x5813 | 768x7397 |
| cocktail-peach-julep--light--375.png | changed | 31.083 | 375x909 | 375x1866 |
| daresnot--dark--375.png | changed | 30.915 | 375x8200 | 375x10760 |
| cocktail-bitter-nonsense--light--375.png | changed | 30.652 | 375x1365 | 375x1962 |
| cocktail-bitter-nonsense--light--1440.png | changed | 30.374 | 1440x2297 | 1440x1836 |
| cocktail-bitter-nonsense--light--768.png | changed | 28.361 | 768x1942 | 768x2415 |
| home--dark--375.png | changed | 27.943 | 375x3827 | 375x4696 |
| cocktail-el-nino--light--768.png | changed | 24.587 | 768x2019 | 768x2461 |
| cocktail-el-nino--light--375.png | changed | 24.056 | 375x1417 | 375x1948 |
| daresnot--dark--1440.png | changed | 22.387 | 1440x6548 | 1440x7743 |
| cocktails-index--dark--768.png | changed | 20.479 | 768x1387 | 768x1673 |
| daresnot--light--768.png | changed | 16.127 | 768x5813 | 768x7397 |
| cocktail-peach-julep--light--1440.png | changed | 14.844 | 1440x900 | 1440x1762 |
| home--dark--1440.png | changed | 13.842 | 1440x2684 | 1440x2925 |
| daresnot--light--1440.png | changed | 11.537 | 1440x6548 | 1440x7743 |
| daresnot--light--375.png | changed | 10.083 | 375x8200 | 375x10760 |
| home--light--375.png | changed | 9.824 | 375x3827 | 375x4696 |
| projects--light--375.png | changed | 8.438 | 375x3126 | 375x4696 |
| home--light--768.png | changed | 7.408 | 768x2312 | 768x3245 |
| projects--light--768.png | changed | 6.374 | 768x1818 | 768x3245 |
| cocktails-index--light--375.png | changed | 6.002 | 375x1509 | 375x2229 |
| home--light--1440.png | changed | 5.095 | 1440x2684 | 1440x2925 |
| cocktails-index--light--768.png | changed | 4.556 | 768x1387 | 768x1673 |
| projects--light--1440.png | changed | 4.422 | 1440x2073 | 1440x2925 |
| notfound--light--375.png | changed | 4.171 | 375x800 | 375x800 |
| notfound--dark--375.png | changed | 3.931 | 375x800 | 375x800 |
| cocktails-index--light--1440.png | changed | 2.93 | 1440x967 | 1440x1739 |
| notfound--light--768.png | changed | 1.929 | 768x1024 | 768x1024 |
| notfound--dark--768.png | changed | 1.786 | 768x1024 | 768x1024 |
| notfound--light--1440.png | changed | 1.54 | 1440x900 | 1440x900 |
| notfound--dark--1440.png | changed | 1.409 | 1440x900 | 1440x900 |

0/54 identical; diff images in /Users/brittcrawford/conductor/workspaces/britt.github.com/medan-v2/tests/visual/diff

Regenerate with `tests/visual/check.sh`. Diff images land in
`tests/visual/diff/`.
