/* Which classes does the site emit that nothing styles?
 *
 *   node scripts/style-coverage.mjs public [old-public]
 *
 * Dropping a stylesheet produces no build error — an element simply stops
 * being styled. This enumerates the gap: every class in the generated HTML
 * that no rule in the generated CSS mentions. Given a second build (master's),
 * it also reports which of those the old stylesheet *did* style, which is the
 * regression list as opposed to the always-was-unstyled list.
 *
 * style-coverage-allow.json lists the classes that are deliberately unstyled,
 * each with a reason. Exits non-zero on anything not accounted for, so this
 * can gate CI.
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

const ALLOW = JSON.parse(
  fs.readFileSync(new URL("./style-coverage-allow.json", import.meta.url), "utf8"),
);

const [, , current, previous] = process.argv;
if (!current) {
  console.error("usage: node scripts/style-coverage.mjs <public> [old-public]");
  process.exit(2);
}

const emitted = emittedClasses(current);
const styled = styledClasses(current);
const unstyled = [...emitted].filter((c) => !styled.has(c)).sort();

console.log(`${emitted.size} classes emitted, ${styled.size} classes styled`);

const unaccounted = unstyled.filter((c) => !(c in ALLOW));
const allowed = unstyled.filter((c) => c in ALLOW);

if (previous) {
  const styledBefore = styledClasses(previous);
  const regressions = unaccounted.filter((c) => styledBefore.has(c));
  const neverStyled = unaccounted.filter((c) => !styledBefore.has(c));
  if (regressions.length) {
    console.log(`\nREGRESSIONS — emitted, styled by the old stylesheet, styled by nothing now (${regressions.length}):`);
    for (const c of regressions) console.log(`  .${c}`);
  }
  if (neverStyled.length) {
    console.log(`\nunstyled, and unstyled on the old build too (${neverStyled.length}):`);
    for (const c of neverStyled) console.log(`  .${c}`);
  }
} else if (unaccounted.length) {
  console.log(`\nunstyled and unaccounted for (${unaccounted.length}):`);
  for (const c of unaccounted) console.log(`  .${c}`);
}

console.log(`\ndeliberately unstyled, per style-coverage-allow.json (${allowed.length}): ${allowed.map((c) => "." + c).join(" ") || "—"}`);

if (unaccounted.length) {
  console.log("\nAdd a rule, stop emitting the class, or record why it needs neither in scripts/style-coverage-allow.json.");
  process.exit(1);
}
console.log("every emitted class is either styled or accounted for");
