/* Colour-scheme behaviour: the parts a screenshot diff cannot see.
 *
 *   BASE=http://127.0.0.1:1313 node --test scheme.test.mjs
 *
 * Three properties are under test, all of them from #43:
 *   - dark mode survives JavaScript being disabled
 *   - an explicit stored preference beats the OS setting
 *   - the attribute that carries that preference exists before first paint,
 *     so there is no flash of the wrong theme
 */
import test from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

const BASE = (process.env.BASE ?? "http://127.0.0.1:1313").replace(/\/$/, "");

let browser;
test.before(async () => { browser = await chromium.launch(); });
test.after(async () => { await browser?.close(); });

async function open({ scheme, stored, javaScriptEnabled = true }) {
  const context = await browser.newContext({ colorScheme: scheme, javaScriptEnabled });
  if (stored !== undefined) {
    await context.addInitScript((v) => {
      try { v === null ? localStorage.removeItem("colorscheme") : localStorage.setItem("colorscheme", v); } catch (e) {}
    }, stored);
  }
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  return { page, context };
}

const bg = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const attr = (page) => page.evaluate(() => document.documentElement.getAttribute("data-scheme"));

test("OS dark preference is honoured with JavaScript disabled", async () => {
  const { page, context } = await open({ scheme: "dark", javaScriptEnabled: false });
  assert.equal(await attr(page), null, "no script ran, so no attribute should be set");
  assert.equal(await bg(page), "rgb(25, 23, 20)", "the page should still render dark");
  await context.close();
});

test("OS light preference is honoured with JavaScript disabled", async () => {
  const { page, context } = await open({ scheme: "light", javaScriptEnabled: false });
  assert.equal(await bg(page), "rgb(251, 247, 239)");
  await context.close();
});

test("a stored dark preference overrides a light OS setting", async () => {
  const { page, context } = await open({ scheme: "light", stored: "dark" });
  assert.equal(await attr(page), "dark");
  assert.equal(await bg(page), "rgb(25, 23, 20)");
  await context.close();
});

test("a stored light preference overrides a dark OS setting", async () => {
  const { page, context } = await open({ scheme: "dark", stored: "light" });
  assert.equal(await attr(page), "light");
  assert.equal(await bg(page), "rgb(251, 247, 239)");
  await context.close();
});

test("no stored preference leaves the attribute off so CSS decides", async () => {
  const { page, context } = await open({ scheme: "dark", stored: null });
  assert.equal(await attr(page), null);
  assert.equal(await bg(page), "rgb(25, 23, 20)");
  await context.close();
});

test("the scheme is settled before first paint, not after", async () => {
  /* Structural, because 'before first paint' is not observable after load: the
   * script that sets the attribute must be inline, in <head>, and neither
   * deferred nor async — anything else can paint first. */
  const context = await browser.newContext({ colorScheme: "light" });
  await context.addInitScript(() => { try { localStorage.setItem("colorscheme", "dark"); } catch (e) {} });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });

  const setter = await page.evaluate(() =>
    [...document.head.querySelectorAll("script")]
      .filter((s) => !s.src && s.textContent.includes("data-scheme"))
      .map((s) => ({ deferred: s.defer, async: s.async, inHead: s.closest("head") !== null })));

  assert.equal(setter.length, 1, "exactly one inline scheme script should be in <head>");
  assert.equal(setter[0].inHead, true);
  assert.equal(setter[0].deferred, false, "a deferred script runs after parsing — too late");
  assert.equal(setter[0].async, false, "an async script has no ordering guarantee");
  assert.equal(await attr(page), "dark");
  await context.close();
});

test("no rule outside the fallback query depends on Coder's body classes", async () => {
  const { page, context } = await open({ scheme: "light" });
  const leftovers = await page.evaluate(() => {
    const found = [];
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      for (const r of rules) {
        if (r.selectorText && /colorscheme-(dark|light|auto)/.test(r.selectorText)) found.push(r.selectorText);
      }
    }
    return found;
  });
  assert.deepEqual(leftovers, [], "dark mode should be a token swap, not a body class");
  await context.close();
});
