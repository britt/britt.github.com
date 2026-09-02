/* Accessibility sweep: axe-core over every page type, in both schemes.
 *
 *   BASE=http://127.0.0.1:1313 node --test a11y.test.mjs
 *
 * Both schemes, because the redesign changes every colour pair twice over and
 * contrast does not carry across a theme swap. axe measures contrast against
 * what an element is actually drawn on, which is the only way to get it right
 * — a token pairing chart is a guess about which surface a colour lands on.
 *
 * Critical and serious violations fail. Moderate and minor are printed, so a
 * regression in them is visible without blocking on judgement calls.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const BASE = (process.env.BASE ?? "http://127.0.0.1:1313").replace(/\/$/, "");

const PAGES = [
  ["home", "/"],
  ["cocktails index", "/cocktails/"],
  ["cocktail recipe", "/cocktails/el-nino/"],
  ["long article", "/daresnot/"],
  ["styleguide", "/styleguide/"],
  ["404", "/404.html"],
];

let browser;
test.before(async () => { browser = await chromium.launch(); });
test.after(async () => { await browser?.close(); });

async function audit(path, scheme) {
  const context = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.addScriptTag({ content: AXE });
  const results = await page.evaluate(async () =>
    await window.axe.run(document, {
      resultTypes: ["violations"],
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
    }));
  await context.close();
  return results.violations;
}

function describe(v) {
  const where = v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ");
  return `${v.impact}: ${v.id} — ${v.help} (${v.nodes.length}×) ${where}`;
}

for (const [name, path] of PAGES) {
  for (const scheme of ["light", "dark"]) {
    test(`${name} (${scheme}) has no critical or serious axe violations`, async () => {
      const violations = await audit(path, scheme);
      const blocking = violations.filter((v) => v.impact === "critical" || v.impact === "serious");
      const advisory = violations.filter((v) => !blocking.includes(v));
      for (const v of advisory) console.log(`  advisory — ${describe(v)}`);
      assert.deepEqual(blocking.map(describe), [], `${name} (${scheme})`);
    });
  }
}

/* ── what axe cannot see ─────────────────────────────────────────────────
 * Automation covers roughly half of WCAG. These are the parts of #62's
 * checklist that need driving rather than scanning.
 */

test("every page is traversable by keyboard with no trap and a visible ring", async () => {
  for (const [name, path] of PAGES) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto(BASE + path, { waitUntil: "load" });
    await page.evaluate(async () => { await document.fonts.ready; });

    const visited = [];
    const noRing = [];
    /* Identity has to be the element itself, not a description of it: two
     * adjacent plain <a> elements describe identically, which made an earlier
     * version of this test report every page as trapped. */
    await page.evaluate(() => { window.__prevFocus = null; });
    let trapped = null;
    /* Bounded: 200 stops is more than the longest page has, and a trap is
     * pressing Tab and not moving. */
    for (let i = 0; i < 200; i++) {
      await page.keyboard.press("Tab");
      const stop = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) { window.__prevFocus = null; return null; }
        const same = window.__prevFocus === el;
        window.__prevFocus = el;
        const cs = getComputedStyle(el);
        return {
          same,
          id: (el.tagName + (el.id ? "#" + el.id : "") + (el.className ? "." + el.className : "")
               + ' "' + (el.textContent || "").trim().slice(0, 24) + '"'),
          outline: parseFloat(cs.outlineWidth) || 0,
          outlineStyle: cs.outlineStyle,
          boxShadow: cs.boxShadow,
        };
      });
      if (!stop) break; /* focus left the document — the end of the tab ring */
      if (stop.same) { trapped = stop.id; break; }
      visited.push(stop.id);
      const ring = stop.outline >= 2 && stop.outlineStyle !== "none";
      if (!ring && stop.boxShadow === "none") noRing.push(stop.id);
    }

    assert.ok(visited.length > 0, `${name}: nothing is focusable`);
    assert.equal(trapped, null, `${name}: focus trapped on ${trapped}`);
    assert.deepEqual(noRing, [], `${name}: focusable elements with no visible focus ring`);
    await context.close();
  }
});

test("no page loses content or scrolls sideways at 200% zoom", async () => {
  /* 200% zoom halves the CSS-pixel viewport; 1280x900 at 200% is 640x450. */
  for (const [name, path] of PAGES) {
    const context = await browser.newContext({ viewport: { width: 640, height: 450 } });
    const page = await context.newPage();
    await page.goto(BASE + path, { waitUntil: "load" });
    await page.evaluate(async () => { await document.fonts.ready; });
    const overflow = await page.evaluate(() => {
      const wide = [...document.querySelectorAll("body *")]
        .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
        .filter((el) => !el.closest(".ds-scroll"))  /* tables scroll on purpose */
        .map((el) => (el.tagName + "." + (el.className || "")).slice(0, 60));
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        wide: [...new Set(wide)].slice(0, 5),
      };
    });
    assert.ok(
      overflow.scrollWidth <= overflow.clientWidth + 1,
      `${name}: page scrolls sideways at 200% (${overflow.scrollWidth} > ${overflow.clientWidth}) — ${overflow.wide.join(", ")}`,
    );
    await context.close();
  }
});

test("every content image has a meaningful alt", async () => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const missing = [];
  for (const path of ["/", "/cocktails/el-nino/", "/daresnot/", "/styleguide/"]) {
    await page.goto(BASE + path, { waitUntil: "load" });
    const bad = await page.evaluate(() =>
      [...document.images]
        .filter((i) => !i.closest("[aria-hidden='true']"))
        /* alt="" is a legitimate answer for a decorative image; an absent alt
         * attribute is not, because a screen reader then reads the filename. */
        .filter((i) => i.getAttribute("alt") === null)
        .map((i) => i.getAttribute("src")));
    missing.push(...bad.map((src) => `${path} ${src}`));
  }
  assert.deepEqual(missing, []);
  await context.close();
});

test("prefers-reduced-motion suppresses transitions", async () => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.evaluate(async () => { await document.fonts.ready; });
  const durations = await page.evaluate(() =>
    [...document.querySelectorAll("a, button, .heading-link")]
      .map((el) => getComputedStyle(el).transitionDuration)
      .filter((d) => d !== "0s")
      .filter((d) => parseFloat(d) > 0.05));
  assert.deepEqual(durations, [], "transitions should be effectively instant under reduced motion");
  await context.close();
});

test("each page has exactly one h1", async () => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const wrong = [];
  for (const [name, path] of PAGES) {
    await page.goto(BASE + path, { waitUntil: "load" });
    const n = await page.evaluate(() =>
      [...document.querySelectorAll("h1")].filter((h) => !h.closest("[aria-hidden='true']")).length);
    if (n !== 1) wrong.push(`${name}: ${n}`);
  }
  assert.deepEqual(wrong, []);
  await context.close();
});
