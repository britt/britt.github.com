/* Report the byte cost of a built page: what it links, how big, gzipped.
 *
 *   node scripts/payload.mjs public /index.html /cocktails/el-nino/index.html
 *
 * Counts only same-origin assets the HTML references directly — stylesheets,
 * scripts, fonts they preload, and images. Remote requests (Gravatar, Google
 * Fonts) are listed separately because they cost a connection but not repo
 * bytes, and the distinction matters when deciding whether to self-host.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = process.argv[2] ?? "public";
const pages = process.argv.slice(3);
if (!pages.length) pages.push("/index.html");

const size = (p) => {
  const buf = fs.readFileSync(p);
  return { raw: buf.length, gz: zlib.gzipSync(buf, { level: 9 }).length };
};

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

function classify(href) {
  const ext = path.extname(href.split("?")[0]).toLowerCase();
  if (ext === ".css") return "css";
  if (ext === ".js" || ext === ".mjs") return "js";
  if ([".woff", ".woff2", ".ttf", ".otf", ".eot"].includes(ext)) return "font";
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg", ".ico"].includes(ext)) return "image";
  return "other";
}

for (const page of pages) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) {
    console.log(`\n## ${page}\n\n(not built)`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const htmlSize = size(file);

  const refs = new Set();
  const remote = new Set();
  const re = /(?:href|src)=["']?([^"'\s>]+)/g;
  let m;
  while ((m = re.exec(html))) {
    const href = m[1];
    if (/^(https?:)?\/\//.test(href)) { remote.add(href); continue; }
    if (!href.startsWith("/")) continue;
    if (classify(href) === "other") continue;
    refs.add(href);
  }
  /* stylesheets can pull more stylesheets and fonts via @import / url() */
  for (const href of [...refs]) {
    if (classify(href) !== "css") continue;
    const p = path.join(root, href);
    if (!fs.existsSync(p)) continue;
    const css = fs.readFileSync(p, "utf8");
    const inner = /url\(["']?([^)"']+)/g;
    let n;
    while ((n = inner.exec(css))) {
      const u = n[1];
      if (/^(https?:)?\/\//.test(u)) { remote.add(u); continue; }
      if (u.startsWith("data:")) continue;
      refs.add(u.startsWith("/") ? u : path.posix.join(path.posix.dirname(href), u));
    }
    const imp = /@import\s+(?:url\()?["']([^"']+)/g;
    while ((n = imp.exec(css))) {
      const u = n[1];
      if (/^(https?:)?\/\//.test(u)) remote.add(u);
    }
  }

  const totals = {};
  const rows = [];
  for (const href of [...refs].sort()) {
    const p = path.join(root, href.split("?")[0]);
    if (!fs.existsSync(p)) { rows.push([href, "MISSING", "—", "—"]); continue; }
    const s = size(p);
    const kind = classify(href);
    totals[kind] ??= { raw: 0, gz: 0, n: 0 };
    totals[kind].raw += s.raw;
    totals[kind].gz += s.gz;
    totals[kind].n += 1;
    rows.push([href, kind, kb(s.raw), kb(s.gz)]);
  }

  console.log(`\n## ${page}\n`);
  console.log(`html: ${kb(htmlSize.raw)} (${kb(htmlSize.gz)} gzipped)\n`);
  console.log("| asset | kind | raw | gzip |");
  console.log("|---|---|---:|---:|");
  for (const r of rows) console.log(`| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} |`);
  console.log("\n| kind | files | raw | gzip |");
  console.log("|---|---:|---:|---:|");
  for (const [kind, t] of Object.entries(totals).sort()) {
    console.log(`| ${kind} | ${t.n} | ${kb(t.raw)} | ${kb(t.gz)} |`);
  }
  if (remote.size) {
    console.log(`\nremote requests (${remote.size}):`);
    for (const r of [...remote].sort()) console.log(`  - ${r}`);
  }
}
