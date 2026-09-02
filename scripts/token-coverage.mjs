/* Which design tokens are defined but drive nothing?
 *
 *   node scripts/token-coverage.mjs public
 *
 * A custom property that no rule reads is a design decision that did not ship.
 * It produces no error and no visual difference from a token that was never
 * written, so the only way to notice is to check.
 *
 * token-coverage-allow.json records the ones deliberately left unreferenced,
 * each with a reason. Exits non-zero on anything else.
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

const root = process.argv[2] ?? "public";
const ALLOW = JSON.parse(
  fs.readFileSync(new URL("./token-coverage-allow.json", import.meta.url), "utf8"),
);

const defined = new Map(); // name -> Set(files)
const referenced = new Set();
const usedWithoutFallback = new Map(); // name -> Set(files)

for (const f of walk(root, ".css")) {
  const css = fs.readFileSync(f, "utf8");
  const rel = path.relative(root, f);
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:/gi)) {
    if (!defined.has(m[1])) defined.set(m[1], new Set());
    defined.get(m[1]).add(rel);
  }
  for (const m of css.matchAll(/var\(\s*(--[a-z0-9-]+)\s*(,?)/gi)) {
    referenced.add(m[1]);
    /* var(--x) with no comma has no fallback: if --x is undefined the whole
     * declaration is invalid at computed-value time and silently dropped. */
    if (!m[2]) {
      if (!usedWithoutFallback.has(m[1])) usedWithoutFallback.set(m[1], new Set());
      usedWithoutFallback.get(m[1]).add(rel);
    }
  }
}

/* An inline style attribute is a reference too — the styleguide demonstrates
 * tokens that way, and so do any templates that set one. */
for (const f of walk(root, ".html")) {
  const html = fs.readFileSync(f, "utf8");
  for (const m of html.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) referenced.add(m[1]);
}

/* The other direction, and the one that actually breaks a page: a rule reading
 * a token nobody defines, with no fallback, is a dropped declaration. */
const undefinedTokens = [...usedWithoutFallback.keys()].filter((n) => !defined.has(n)).sort();

const orphans = [...defined.keys()].filter((n) => !referenced.has(n)).sort();
const unaccounted = orphans.filter((n) => !(n in ALLOW));
const accounted = orphans.filter((n) => n in ALLOW);

console.log(`${defined.size} tokens defined, ${referenced.size} referenced`);

if (accounted.length) {
  console.log(`\ndefined but unreferenced, by design (${accounted.length}):`);
  for (const n of accounted) console.log(`  ${n} — ${ALLOW[n]}`);
}

if (undefinedTokens.length) {
  console.log(`\nUNDEFINED — read with no fallback, defined nowhere (${undefinedTokens.length}):`);
  for (const n of undefinedTokens) console.log(`  ${n}  (read in ${[...usedWithoutFallback.get(n)].join(", ")})`);
  console.log("\nEach of these silently drops the whole declaration that reads it.");
}

if (unaccounted.length) {
  console.log(`\nORPHANS — defined and read by nothing (${unaccounted.length}):`);
  for (const n of unaccounted) console.log(`  ${n}  (defined in ${[...defined.get(n)].join(", ")})`);
  console.log("\nWire it to a rule, or record why it is unused in scripts/token-coverage-allow.json.");
}

if (unaccounted.length || undefinedTokens.length) process.exit(1);
console.log("every defined token is referenced or accounted for, and every token read is defined");
