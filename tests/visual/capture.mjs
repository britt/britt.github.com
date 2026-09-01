/* Capture one full-page screenshot per route x scheme x viewport.
 *
 *   node capture.mjs --out baseline --base http://127.0.0.1:1313
 *
 * Determinism is the whole point of this file. Anything that can render
 * differently between two otherwise identical runs is pinned here: animations
 * and transitions are killed, webfonts are awaited, lazy images are forced to
 * load by scrolling the page, and the remote Gravatar is blanked because a
 * third-party request has no business deciding whether a diff is red.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { ROUTES, VIEWPORTS, SCHEMES } from "./routes.mjs";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}

const OUT = path.resolve(arg("out", "current"));
const BASE = arg("base", "http://127.0.0.1:1313").replace(/\/$/, "");

/* Injected before any page script runs. Sets the scheme the way the site's own
 * bootstrap reads it, so the page renders the target scheme on first paint
 * rather than being repainted after load. */
function seedScheme(scheme) {
  try {
    localStorage.setItem("colorscheme", scheme);
  } catch (e) {
    /* storage disabled — the emulated media preference still applies */
  }
}

const FREEZE = `
  *, *::before, *::after {
    transition: none !important;
    animation: none !important;
    caret-color: transparent !important;
  }
  html { scroll-behavior: auto !important; }
`;

async function settle(page) {
  await page.addStyleTag({ content: FREEZE });
  await page.evaluate(async () => {
    /* force lazy content and any scroll-triggered layout to resolve */
    window.scrollTo(0, document.body.scrollHeight);
    window.scrollTo(0, 0);
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((i) => !i.complete)
        .map((i) => new Promise((r) => {
          i.addEventListener("load", r, { once: true });
          i.addEventListener("error", r, { once: true });
        })),
    );
  });
  await page.waitForTimeout(150);
}

const results = [];

const browser = await chromium.launch();
try {
  for (const scheme of SCHEMES) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: scheme,
        reducedMotion: "reduce",
        deviceScaleFactor: 1,
      });
      await context.addInitScript(seedScheme, scheme);
      /* Gravatar is a third-party request on the home page. Serve a blank
       * pixel instead so the network cannot make a diff red. */
      await context.route(/gravatar\.com/, (route) =>
        route.fulfill({
          status: 200,
          contentType: "image/gif",
          body: Buffer.from("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64"),
        }));

      const page = await context.newPage();
      for (const route of ROUTES) {
        const url = `${BASE}${route.path}`;
        const file = path.join(OUT, `${route.name}--${scheme}--${vp.name}.png`);
        let response;
        try {
          response = await page.goto(url, { waitUntil: "load", timeout: 20000 });
        } catch (err) {
          results.push({ route: route.name, scheme, viewport: vp.name, status: "error", detail: String(err) });
          continue;
        }
        /* 404.html is served as a file and returns 200; a real missing route
         * returns 404 and is recorded, not captured. */
        if (response && response.status() >= 400) {
          results.push({ route: route.name, scheme, viewport: vp.name, status: "missing" });
          continue;
        }
        await settle(page);
        await fs.mkdir(path.dirname(file), { recursive: true });
        await page.screenshot({ path: file, fullPage: true, scale: "css" });
        results.push({ route: route.name, scheme, viewport: vp.name, status: "captured", file: path.relative(OUT, file) });
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}

await fs.writeFile(path.join(OUT, "manifest.json"), JSON.stringify({ base: BASE, results }, null, 2) + "\n");

const captured = results.filter((r) => r.status === "captured").length;
const missing = results.filter((r) => r.status === "missing");
const errored = results.filter((r) => r.status === "error");
console.log(`captured ${captured} screenshots into ${OUT}`);
if (missing.length) {
  console.log(`missing routes (not captured): ${[...new Set(missing.map((m) => m.route))].join(", ")}`);
}
if (errored.length) {
  for (const e of errored) console.error(`ERROR ${e.route} ${e.scheme} ${e.viewport}: ${e.detail}`);
  process.exit(1);
}
