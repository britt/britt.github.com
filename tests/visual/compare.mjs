/* Diff a capture against the baseline and write a report.
 *
 *   node compare.mjs --baseline baseline --current current --out diff
 *
 * Exits non-zero when anything differs. That is the intended behaviour during
 * a redesign: every difference is either a defect or a deliberate change that
 * should be re-baselined on purpose, and neither should pass in silence.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}

const BASELINE = path.resolve(arg("baseline", "baseline"));
const CURRENT = path.resolve(arg("current", "current"));
const OUT = path.resolve(arg("out", "diff"));
const THRESHOLD = Number(arg("threshold", "0.1"));

async function pngs(dir) {
  try {
    return (await fs.readdir(dir)).filter((f) => f.endsWith(".png")).sort();
  } catch {
    return [];
  }
}

const baseFiles = await pngs(BASELINE);
const curFiles = await pngs(CURRENT);

if (!baseFiles.length) {
  console.error(`no baseline screenshots in ${BASELINE} — run baseline.sh first`);
  process.exit(2);
}

await fs.mkdir(OUT, { recursive: true });

const rows = [];

for (const name of new Set([...baseFiles, ...curFiles])) {
  const inBase = baseFiles.includes(name);
  const inCur = curFiles.includes(name);
  if (!inBase) { rows.push({ name, verdict: "added", pct: null }); continue; }
  if (!inCur) { rows.push({ name, verdict: "removed", pct: null }); continue; }

  const a = PNG.sync.read(await fs.readFile(path.join(BASELINE, name)));
  const b = PNG.sync.read(await fs.readFile(path.join(CURRENT, name)));

  /* Full-page screenshots change height whenever spacing changes, which is
   * most of this redesign. Compare on the union canvas so a height change is
   * reported as a large diff instead of crashing the run. */
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const pad = (img) => {
    if (img.width === width && img.height === height) return img;
    const out = new PNG({ width, height });
    out.data.fill(0);
    PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
    return out;
  };
  const pa = pad(a);
  const pb = pad(b);
  const diff = new PNG({ width, height });
  const changed = pixelmatch(pa.data, pb.data, diff.data, width, height, {
    threshold: THRESHOLD,
    includeAA: false,
  });
  const pct = (changed / (width * height)) * 100;
  if (changed > 0) {
    await fs.writeFile(path.join(OUT, name), PNG.sync.write(diff));
  }
  rows.push({
    name,
    verdict: changed === 0 ? "identical" : "changed",
    pct: Number(pct.toFixed(3)),
    changedPixels: changed,
    baselineSize: `${a.width}x${a.height}`,
    currentSize: `${b.width}x${b.height}`,
  });
}

rows.sort((x, y) => (y.pct ?? Infinity) - (x.pct ?? Infinity));
await fs.writeFile(path.join(OUT, "report.json"), JSON.stringify(rows, null, 2) + "\n");

const lines = ["| screenshot | verdict | % pixels changed | baseline | current |",
               "|---|---|---:|---|---|"];
for (const r of rows) {
  lines.push(`| ${r.name} | ${r.verdict} | ${r.pct === null ? "—" : r.pct} | ${r.baselineSize ?? "—"} | ${r.currentSize ?? "—"} |`);
}
await fs.writeFile(path.join(OUT, "report.md"), lines.join("\n") + "\n");

const differing = rows.filter((r) => r.verdict !== "identical");
console.log(lines.join("\n"));
console.log(`\n${rows.length - differing.length}/${rows.length} identical; diff images in ${OUT}`);
if (differing.length) process.exit(1);
