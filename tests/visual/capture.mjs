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
const MAX_HEIGHT = Number(arg("max-height", "12000"));
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

/* A page may navigate out from under us — /projects/ is an alias, which Hugo
 * renders as a meta-refresh to the home page. That is what a visitor sees, so
 * the redirect target is the right thing to capture; we just have to wait for
 * it rather than falling over mid-injection. */
async function settle(page, retry = true) {
  try {
    await settleOnce(page);
  } catch (err) {
    if (!retry || !/Execution context was destroyed|navigation/i.test(String(err))) throw err;
    await page.waitForLoadState("load");
    await settleOnce(page);
  }
}

async function settleOnce(page) {
  await page.addStyleTag({ content: FREEZE });
  await page.evaluate(async () => {
    /* Content images are loading="lazy" (#55), and a lazy image below the
     * viewport never fires load *or* error — so waiting on one hangs the run
     * forever. Opt every image into eager loading first, then scroll to
     * trigger any layout that depends on position, then wait with a deadline:
     * a screenshot that is 200ms early is a bad diff, a capture that never
     * returns is no diff at all. */
    for (const img of document.images) img.loading = "eager";
    window.scrollTo(0, document.body.scrollHeight);
    window.scrollTo(0, 0);

    const deadline = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);
    await deadline(document.fonts.ready, 5000);
    await deadline(
      Promise.all(
        [...document.images]
          .filter((i) => !i.complete)
          .map((i) => new Promise((r) => {
            i.addEventListener("load", r, { once: true });
            i.addEventListener("error", r, { once: true });
          })),
      ),
      10000,
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

        /* Full-page screenshots of very tall pages are pathologically slow —
         * /styleguide/ runs past 40,000px at 375px wide, and Chromium takes
         * minutes on it, if it finishes. Capture is capped, and the cap is
         * *recorded*: a silently truncated screenshot is a regression test
         * that quietly stops testing the bottom of the page. */
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        const truncated = height > MAX_HEIGHT;
        await page.screenshot({
          path: file,
          scale: "css",
          ...(truncated
            ? { clip: { x: 0, y: 0, width: vp.width, height: MAX_HEIGHT } }
            : { fullPage: true }),
        });
        results.push({
          route: route.name, scheme, viewport: vp.name, status: "captured",
          file: path.relative(OUT, file),
          ...(truncated ? { truncated: { fullHeight: height, capturedHeight: MAX_HEIGHT } } : {}),
        });
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}

await fs.writeFile(path.join(OUT, "manifest.json"), JSON.stringify({ base: BASE, results }, null, 2) + "\n");

const captured = results.filter((r) => r.status === "captured").length;
const truncated = results.filter((r) => r.truncated);
const missing = results.filter((r) => r.status === "missing");
const errored = results.filter((r) => r.status === "error");
console.log(`captured ${captured} screenshots into ${OUT}`);
if (missing.length) {
  console.log(`missing routes (not captured): ${[...new Set(missing.map((m) => m.route))].join(", ")}`);
}
if (truncated.length) {
  console.log(`TRUNCATED at ${MAX_HEIGHT}px — these are not compared below the cap:`);
  for (const t of truncated) {
    console.log(`  ${t.route} ${t.scheme} ${t.viewport}: full height ${t.fullHeight ?? t.truncated.fullHeight}px`);
  }
}
if (errored.length) {
  for (const e of errored) console.error(`ERROR ${e.route} ${e.scheme} ${e.viewport}: ${e.detail}`);
  process.exit(1);
}
