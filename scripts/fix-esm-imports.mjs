// Node's strict ESM resolver requires explicit file extensions and doesn't
// resolve directory imports to their index file. This project (and Prisma's
// own generated client) writes plain extensionless relative imports, which
// only ever ran successfully via tsx's looser resolution. This script
// rewrites them in-place to be ESM-resolution-correct, so `node dist/...`
// (used by Vercel's function runtime, and by `pnpm start` on persistent
// hosts) actually works. Runs after every `prisma generate`, since the
// generated client needs the same fix and gets regenerated from scratch.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const roots = [
  path.join(__dirname, "..", "src"),
  path.join(__dirname, "..", "api"),
];

const tsFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
      tsFiles.push(full);
    }
  }
}
for (const r of roots) {
  if (fs.existsSync(r)) walk(r);
}

const importRe = /((?:import|export)(?:\s+type)?\s+(?:[^'"]*?\bfrom\s+)?)(['"])(\.\.?\/[^'"]*)\2/g;

let totalChanges = 0;
const unresolved = [];

for (const file of tsFiles) {
  let content = fs.readFileSync(file, "utf8");
  const dir = path.dirname(file);
  let changed = false;

  content = content.replace(importRe, (match, prefix, quote, spec) => {
    if (/\.(js|json|ts|mjs|cjs)$/.test(spec)) {
      return match;
    }

    const abs = path.resolve(dir, spec);
    let replacement = null;

    if (fs.existsSync(abs + ".ts")) {
      replacement = spec + ".js";
    } else if (fs.existsSync(path.join(abs, "index.ts"))) {
      replacement = spec.replace(/\/$/, "") + "/index.js";
    } else if (fs.existsSync(abs + ".d.ts")) {
      replacement = spec + ".js";
    } else {
      unresolved.push(`${file}: ${spec} -> could not resolve, left as-is`);
      return match;
    }

    changed = true;
    totalChanges++;
    return `${prefix}${quote}${replacement}${quote}`;
  });

  if (changed) {
    fs.writeFileSync(file, content, "utf8");
  }
}

console.log(`[fix-esm-imports] Files scanned: ${tsFiles.length}, specifiers fixed: ${totalChanges}`);
if (unresolved.length) {
  console.log(`[fix-esm-imports] Unresolved (left as-is):`);
  for (const u of unresolved) console.log(" - " + u);
}
