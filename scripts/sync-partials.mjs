// Copies partials/header.html and partials/footer.html into every page.
// Each page keeps complete static HTML; the shared blocks live between
// <!-- @header --> … <!-- /@header --> and <!-- @footer --> … <!-- /@footer -->.
// Run after editing a partial:  node scripts/sync-partials.mjs

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8").trim();

const header = read("partials/header.html");
const footer = read("partials/footer.html");

const inject = (html, name, content) => {
  const re = new RegExp(`(<!-- @${name} -->)[\\s\\S]*?(<!-- /@${name} -->)`);
  if (!re.test(html)) return { html, hit: false };
  return { html: html.replace(re, (_, open, close) => `${open}\n${content}\n${close}`), hit: true };
};

const pages = readdirSync(root).filter((f) => f.endsWith(".html"));

for (const file of pages) {
  const path = join(root, file);
  let html = readFileSync(path, "utf8");

  const nav = header.replace(
    `class="nav__link" href="${file}"`,
    `class="nav__link" href="${file}" aria-current="page"`
  );

  const navWithCta = nav.replace(`class="btn btn--sm" href="${file}"`, `class="btn btn--sm" href="${file}" aria-current="page"`);
  const h = inject(html, "header", navWithCta);
  const f = inject(h.html, "footer", footer);
  writeFileSync(path, f.html);
  console.log(`${file.padEnd(16)} header:${h.hit ? "ok" : "--"}  footer:${f.hit ? "ok" : "--"}`);
}
