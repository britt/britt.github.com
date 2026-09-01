/* Which classes does the site emit that nothing styles?
 *
 *   node scripts/style-coverage.mjs public [old-public]
 *
 * Dropping a stylesheet produces no build error — an element simply stops
 * being styled. This enumerates the gap: every class in the generated HTML
 * that no rule in the generated CSS mentions. Given a second build (master's),
 * it also reports which of those the old stylesheet *did* style, which is the
 * regression list as opposed to the always-was-unstyled list.
 */
import fs from "node:fs";
import path from "node:path";

function walk(dir, ext, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, ext, out);
    else if (p.endsWith(ext)) out.push(p);
  }
  return out;
}

function emittedClasses(root) {
  const set = new Set();
  for (const f of walk(root, ".html")) {
    const html = fs.readFileSync(f, "utf8");
    for (const m of html.matchAll(/class=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
      for (const c of (m[1] ?? m[2] ?? m[3] ?? "").split(/\s+/)) if (c) set.add(c);
    }
  }
  return set;
}

function styledClasses(root) {
  const set = new Set();
  for (const f of walk(root, ".css")) {
    const css = fs.readFileSync(f, "utf8");
    /* selector position only: everything before each '{', ignoring declarations */
    for (const m of css.matchAll(/([^{}]*)\{/g)) {
      for (const c of m[1].matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) set.add(c[1]);
    }
  }
  return set;
}

const [, , current, previous] = process.argv;
if (!current) {
  console.error("usage: node scripts/style-coverage.mjs <public> [old-public]");
  process.exit(2);
}

const emitted = emittedClasses(current);
const styled = styledClasses(current);
const unstyled = [...emitted].filter((c) => !styled.has(c)).sort();

console.log(`${emitted.size} classes emitted, ${styled.size} classes styled`);

if (previous) {
  const styledBefore = styledClasses(previous);
  const regressions = unstyled.filter((c) => styledBefore.has(c));
  const neverStyled = unstyled.filter((c) => !styledBefore.has(c));
  console.log(`\nREGRESSIONS — emitted, styled by the old stylesheet, styled by nothing now (${regressions.length}):`);
  for (const c of regressions) console.log(`  .${c}`);
  console.log(`\nunstyled before and after, so not a regression (${neverStyled.length}):`);
  for (const c of neverStyled) console.log(`  .${c}`);
  process.exit(regressions.length ? 1 : 0);
}

console.log(`\nunstyled (${unstyled.length}):`);
for (const c of unstyled) console.log(`  .${c}`);
