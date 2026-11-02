// Copies the shared header and footer into every page.
// Each page keeps complete static HTML; the shared blocks live between
// <!-- @header --> … <!-- /@header --> and <!-- @footer --> … <!-- /@footer -->.
//
// English pages (root)  use partials/header.html    + partials/footer.html
// Arabic pages  (ar/)   use partials/header.ar.html + partials/footer.ar.html
// The token {{alt}} inside a header becomes the link to the same page in the
// other language, so the language switch is always correct.
//
// Run after editing a partial:  node scripts/sync-partials.mjs

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8").trim();

const inject = (html, name, content) => {
  const re = new RegExp(`(<!-- @${name} -->)[\\s\\S]*?(<!-- /@${name} -->)`);
  if (!re.test(html)) return { html, hit: false };
  return { html: html.replace(re, (_, open, close) => `${open}\n${content}\n${close}`), hit: true };
};

const langs = [
  { dir: "", header: "partials/header.html", footer: "partials/footer.html", alt: (f) => `ar/${f}` },
  { dir: "ar", header: "partials/header.ar.html", footer: "partials/footer.ar.html", alt: (f) => `../${f}` },
];

for (const lang of langs) {
  const folder = join(root, lang.dir);
  if (!existsSync(folder) || !existsSync(join(root, lang.header))) continue;

  const header = read(lang.header);
  const footer = read(lang.footer);
  const pages = readdirSync(folder).filter((f) => f.endsWith(".html"));

  for (const file of pages) {
    const path = join(folder, file);
    const html = readFileSync(path, "utf8");

    let nav = header
      .replace(`class="nav__link" href="${file}"`, `class="nav__link" href="${file}" aria-current="page"`)
      .replace(`class="btn btn--sm" href="${file}"`, `class="btn btn--sm" href="${file}" aria-current="page"`)
      .replaceAll("{{alt}}", lang.alt(file));

    const h = inject(html, "header", nav);
    const f = inject(h.html, "footer", footer);
    writeFileSync(path, f.html);
    const label = (lang.dir ? lang.dir + "/" : "") + file;
    console.log(`${label.padEnd(20)} header:${h.hit ? "ok" : "--"}  footer:${f.hit ? "ok" : "--"}`);
  }
}
