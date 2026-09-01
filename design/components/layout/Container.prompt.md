Page wrapper — every screen sits inside one. Gutters are fluid, so it works from 320px up.

```jsx
<Container><PageShell aside={<Meta/>}>…</PageShell></Container>
```

Use the default width; `narrow` only when a page is a single unbroken run of prose with no rail.
