/* Responsive and cross-browser matrix.
 *
 *   BASE=http://127.0.0.1:1313 node --test responsive.test.mjs
 *
 * hugo-coder had one breakpoint, applied ad hoc to individual elements. The
 * redesign replaces that with a real system, a two-column rail and a dated
 * grid, so everything here is newly at risk (#64).
 *
 * Safari matters more than usual for this site: half its content is iOS
 * Shortcuts, so its audience skews to Apple devices. WebKit is where
 * aspect-ratio, 100dvh, clamp() and :focus-visible are most likely to differ.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { chromium, firefox, webkit } from "playwright";

const BASE = (process.env.BASE ?? "http://127.0.0.1:1313").replace(/\/$/, "");

const BROWSERS = [["chromium", chromium], ["firefox", firefox], ["webkit", webkit]];
const VIEWPORTS = [320, 375, 768, 1024, 1440, 1920];
const PAGES = [
  ["home", "/"],
  ["cocktails index", "/cocktails/"],
  ["cocktail recipe", "/cocktails/yippee-kay-yay-motherfucker/"],
  ["long article", "/daresnot/"],
  ["styleguide", "/styleguide/"],
  ["404", "/404.html"],
];

async function inspect(page, url) {
  await page.goto(BASE + url, { waitUntil: "load" });
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = "eager";
    await document.fonts.ready;
  });
  await page.waitForTimeout(120);
  return page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    /* Anything sticking out past the viewport, ignoring content inside a
     * container that scrolls on purpose. A table wrapper and a code block are
     * both allowed to be wider than the screen — the page is not, and that is
     * what the scrollWidth assertion below covers. */
    const scrolls = (el) => {
      for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
        const ox = getComputedStyle(n).overflowX;
        if (ox === "auto" || ox === "scroll") return true;
      }
      return false;
    };
    const offenders = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > docWidth + 1;
      })
      .filter((el) => !scrolls(el))
      .map((el) => `${el.tagName.toLowerCase()}.${el.className || ""}`.slice(0, 50));
    const footer = document.querySelector("footer");
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: docWidth,
      offenders: [...new Set(offenders)].slice(0, 5),
      docHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
      footerBottom: footer ? Math.round(footer.getBoundingClientRect().bottom) : null,
    };
  });
}

for (const [browserName, launcher] of BROWSERS) {
  test(`${browserName}: no page scrolls sideways at any viewport`, async () => {
    const browser = await launcher.launch();
    const failures = [];
    try {
      for (const width of VIEWPORTS) {
        const context = await browser.newContext({ viewport: { width, height: 900 } });
        const page = await context.newPage();
        for (const [name, url] of PAGES) {
          const m = await inspect(page, url);
          if (m.scrollWidth > m.clientWidth + 1) {
            failures.push(`${name} @${width}: ${m.scrollWidth} > ${m.clientWidth} — ${m.offenders.join(", ")}`);
          }
        }
        await context.close();
      }
    } finally {
      await browser.close();
    }
    assert.deepEqual(failures, []);
  });
}

test("the footer sits on the bottom edge of a short page in every browser", async () => {
  const failures = [];
  for (const [browserName, launcher] of BROWSERS) {
    const browser = await launcher.launch();
    try {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await context.newPage();
      const m = await inspect(page, "/404.html");
      /* Short page: the document should be exactly the viewport, with the
       * footer flush to the bottom rather than floating mid-page. */
      if (Math.abs(m.docHeight - m.viewportHeight) > 2) {
        failures.push(`${browserName}: document ${m.docHeight} vs viewport ${m.viewportHeight}`);
      }
      if (m.footerBottom === null || Math.abs(m.footerBottom - m.viewportHeight) > 2) {
        failures.push(`${browserName}: footer bottom at ${m.footerBottom}, viewport ${m.viewportHeight}`);
      }
      await context.close();
    } finally {
      await browser.close();
    }
  }
  assert.deepEqual(failures, []);
});

test("a phone in landscape has no horizontal scroll", async () => {
  const failures = [];
  for (const [browserName, launcher] of BROWSERS) {
    const browser = await launcher.launch();
    try {
      const context = await browser.newContext({ viewport: { width: 844, height: 390 } });
      const page = await context.newPage();
      for (const [name, url] of PAGES) {
        const m = await inspect(page, url);
        if (m.scrollWidth > m.clientWidth + 1) failures.push(`${browserName} ${name}: ${m.offenders.join(", ")}`);
      }
      await context.close();
    } finally {
      await browser.close();
    }
  }
  assert.deepEqual(failures, []);
});

test("the type scale, dvh and aspect-ratio resolve in every browser", async () => {
  /* clamp(), 100dvh and :focus-visible are the three places WebKit and Firefox
   * are most likely to differ from Chromium, and all three are load-bearing. */
  const results = {};
  for (const [browserName, launcher] of BROWSERS) {
    const browser = await launcher.launch();
    try {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await context.newPage();
      await page.goto(BASE + "/", { waitUntil: "load" });
      await page.evaluate(async () => { await document.fonts.ready; });
      results[browserName] = await page.evaluate(() => {
        const frame = document.querySelector(".ds-page, .wrapper");
        return {
          bodySize: parseFloat(getComputedStyle(document.body).fontSize),
          h1Size: parseFloat(getComputedStyle(document.querySelector("h1")).fontSize),
          minHeight: getComputedStyle(frame).minHeight,
          focusVisible: CSS.supports("selector(:focus-visible)"),
          dvh: CSS.supports("min-height", "100dvh"),
        };
      });
      await context.close();
    } finally {
      await browser.close();
    }
  }
  for (const [name, r] of Object.entries(results)) {
    assert.ok(r.bodySize > 16 && r.bodySize <= 20, `${name}: body ${r.bodySize}px — clamp() did not resolve`);
    assert.ok(r.h1Size > 30, `${name}: h1 ${r.h1Size}px — clamp() did not resolve`);
    assert.ok(parseFloat(r.minHeight) >= 890, `${name}: page frame min-height ${r.minHeight}`);
    assert.equal(r.focusVisible, true, `${name}: no :focus-visible support`);
  }
  const sizes = Object.values(results).map((r) => r.h1Size);
  assert.ok(Math.max(...sizes) - Math.min(...sizes) < 1,
    `h1 size differs across browsers: ${JSON.stringify(results)}`);
});

test("no long word or URL overflows its column at 320px", async () => {
  const failures = [];
  for (const [browserName, launcher] of BROWSERS) {
    const browser = await launcher.launch();
    try {
      const context = await browser.newContext({ viewport: { width: 320, height: 800 } });
      const page = await context.newPage();
      /* The longest slug on the site, and the densest link lists. */
      for (const url of ["/cocktails/yippee-kay-yay-motherfucker/", "/", "/daresnot/"]) {
        const m = await inspect(page, url);
        if (m.offenders.length) failures.push(`${browserName} ${url}: ${m.offenders.join(", ")}`);
      }
      await context.close();
    } finally {
      await browser.close();
    }
  }
  assert.deepEqual(failures, []);
});
