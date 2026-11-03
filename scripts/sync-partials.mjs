// Copies the shared header and footer into every page.
// Each page keeps complete static HTML; the shared blocks live between
// <!-- @header --> … <!-- /@header --> and <!-- @footer --> … <!-- /@footer -->.
//
// English pages (root)  use partials/header.html    + partials/footer.html
// Arabic pages  (ar/)   use partials/header.ar.html + partials/footer.ar.html
// Russian pages (ru/)   use partials/header.ru.html + partials/footer.ru.html
//
// Pages may sit one level deeper (services/<slug>.html in each language);
// relative links inside the partials get the "../" prefix automatically.
//
// Inside a header, the token {{alt:xx}} becomes the link to the same page in
// language xx (en, ar or ru), so the language switch is always correct.
// The nav link that points at the current page gets aria-current="page";
// service pages mark the "Services" link.
//
// Run after editing a partial or adding a page:  node scripts/sync-partials.mjs

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
  { code: "en", dir: "", header: "partials/header.html", footer: "partials/footer.html" },
  { code: "ar", dir: "ar", header: "partials/header.ar.html", footer: "partials/footer.ar.html" },
  { code: "ru", dir: "ru", header: "partials/header.ru.html", footer: "partials/footer.ru.html" },
];
const SUBDIRS = ["services"];

// All pages of a language, as paths relative to the language root.
const pagesOf = (lang) => {
  const folder = join(root, lang.dir);
  const list = readdirSync(folder).filter((f) => f.endsWith(".html"));
  for (const sd of SUBDIRS) {
    const d = join(folder, sd);
    if (existsSync(d)) list.push(...readdirSync(d).filter((f) => f.endsWith(".html")).map((f) => `${sd}/${f}`));
  }
  return list;
};

// Relative links in a partial (page.html, services/x.html) get the depth prefix.
const prefixLinks = (html, up) => (up ? html.replace(/href="(?!https?:|mailto:|tel:|#|\.\.\/|\{\{)([^"]+)"/g, (m, h) => `href="${up}${h}"`) : html);

for (const lang of langs) {
  const folder = join(root, lang.dir);
  if (!existsSync(folder) || !existsSync(join(root, lang.header))) continue;

  const header = read(lang.header);
  const footer = read(lang.footer);

  for (const rel of pagesOf(lang)) {
    const path = join(folder, rel);
    const html = readFileSync(path, "utf8");
    const depth = rel.split("/").length - 1;
    const up = "../".repeat(depth);
    const toRoot = up + (lang.dir ? "../" : "");
    const navFile = rel.startsWith("services/") ? "services.html" : rel;

    let nav = header
      .replace(`class="nav__link" href="${navFile}"`, `class="nav__link" href="${navFile}" aria-current="page"`)
      .replace(`class="btn btn--sm" href="${navFile}"`, `class="btn btn--sm" href="${navFile}" aria-current="page"`);
    for (const other of langs) nav = nav.replaceAll(`{{alt:${other.code}}}`, toRoot + (other.dir ? `${other.dir}/` : "") + rel);
    nav = prefixLinks(nav, up);

    const h = inject(html, "header", nav);
    const f = inject(h.html, "footer", prefixLinks(footer, up));
    writeFileSync(path, f.html);
    const label = (lang.dir ? lang.dir + "/" : "") + rel;
    console.log(`${label.padEnd(28)} header:${h.hit ? "ok" : "--"}  footer:${f.hit ? "ok" : "--"}`);
  }
}
