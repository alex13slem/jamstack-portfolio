import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { load } from "cheerio";
import { parse } from "yaml";
import sharp from "sharp";

const origin = "https://alex13slem.vercel.app";
const read = (path) => readFile(path, "utf8");
const pagePath = (lang, id) =>
  `${lang === "ru" ? "/ru/" : "/"}${id ? `projects/${encodeURIComponent(id)}/` : ""}`;
const projectIds = await Promise.all(
  (await readdir("src/content/project/en"))
    .filter((name) => name.endsWith(".md"))
    .map(async (name) => {
      const markdown = await read(`src/content/project/en/${name}`);
      return parse(markdown.split(/^---\s*$/m)[1]).id;
    }),
);
const expected = [undefined, ...projectIds].flatMap((id) =>
  ["en", "ru"].map((lang) => ({ lang, id, path: pagePath(lang, id) })),
);
const titles = new Set();
const descriptions = new Set();
const images = new Set();

for (const { lang, id, path } of expected) {
  const $ = load(await read(`dist${path}index.html`));
  const meta = (key) =>
    $(`meta[property="${key}"], meta[name="${key}"]`).attr("content");
  assert.equal($("html").attr("lang"), lang);
  assert.equal($('link[rel="canonical"]').length, 1, `${path}: one canonical`);
  assert.equal($('link[rel="canonical"]').attr("href"), origin + path);
  assert.equal(meta("og:url"), origin + path);
  assert.equal(meta("og:type"), "website");
  assert.equal(meta("og:locale"), lang === "ru" ? "ru_RU" : "en_US");
  assert.equal(meta("twitter:card"), "summary_large_image");
  assert.equal(meta("twitter:title"), $("title").text());
  assert.equal(meta("twitter:description"), meta("description"));
  assert.ok(
    meta("description")?.length > 40,
    `${path}: meaningful description`,
  );
  assert.ok(
    !/Welcome|Добро пожаловать/.test($("title").text()),
    `${path}: descriptive title`,
  );
  assert.equal(
    meta("robots"),
    "index, follow",
    `${path}: indexable public page`,
  );
  for (const alternate of ["en", "ru", "x-default"]) {
    assert.equal(
      $(`link[rel="alternate"][hreflang="${alternate}"]`).attr("href"),
      origin + pagePath(alternate === "ru" ? "ru" : "en", id),
    );
  }
  assert.equal(
    $('link[rel="icon"][type="image/svg+xml"]').length,
    1,
    `${path}: one SVG favicon`,
  );
  assert.equal(
    $('link[rel="icon"][sizes="32x32"]').attr("href"),
    "/favicon-32x32.png",
  );
  assert.equal(
    $('link[rel="apple-touch-icon"]').attr("href"),
    "/apple-touch-icon.png",
  );
  const image = new URL(meta("og:image"));
  assert.equal(image.origin, origin);
  assert.equal(meta("twitter:image"), image.href);
  assert.equal(meta("og:image:secure_url"), image.href);
  assert.equal(meta("og:image:type"), "image/png");
  assert.ok(meta("og:image:alt")?.length > 8);
  assert.equal(meta("twitter:image:alt"), meta("og:image:alt"));
  const bytes = await readFile(`dist${image.pathname}`);
  const info = await sharp(bytes).metadata();
  assert.equal(info.width, Number(meta("og:image:width")));
  assert.equal(info.height, Number(meta("og:image:height")));
  assert.equal(info.width, 1200);
  assert.equal(info.height, 630);
  assert.ok(
    image.pathname.includes(
      createHash("sha256").update(bytes).digest("hex").slice(0, 12),
    ),
    `${path}: content-versioned image URL`,
  );
  for (const [set, value, label] of [
    [titles, $("title").text(), "title"],
    [descriptions, meta("description"), "description"],
    [images, image.href, "image"],
  ]) {
    assert.ok(!set.has(value), `${path}: unique ${label}`);
    set.add(value);
  }
  console.log(`PASS SEO ${path}`);
}

const sitemapIndex = load(await read("dist/sitemap-index.xml"), {
  xmlMode: true,
});
const sitemapFiles = sitemapIndex("sitemap > loc")
  .map((_, el) => sitemapIndex(el).text())
  .get();
assert.ok(sitemapFiles.length > 0, "sitemap index lists generated files");
const listedPages = [];
for (const file of sitemapFiles) {
  const url = new URL(file);
  assert.equal(url.origin, origin);
  const sitemap = load(await read(`dist${url.pathname}`), { xmlMode: true });
  for (const entry of sitemap("url").toArray()) {
    const page = sitemap(entry).find("loc").text();
    listedPages.push(page);
    const expectedPage = expected.find(
      (candidate) => origin + candidate.path === page,
    );
    assert.ok(expectedPage, `unexpected sitemap page: ${page}`);
    const links = sitemap(entry)
      .find("xhtml\\:link")
      .toArray()
      .map((link) => ({
        lang: sitemap(link).attr("hreflang"),
        url: sitemap(link).attr("href"),
      }));
    assert.equal(links.length, 3, `${page}: exactly three language links`);
    for (const lang of ["en", "ru", "x-default"]) {
      assert.equal(
        links.find((link) => link.lang === lang)?.url,
        origin + pagePath(lang === "ru" ? "ru" : "en", expectedPage.id),
      );
    }
  }
}
assert.deepEqual(
  listedPages.sort(),
  expected.map((entry) => origin + entry.path).sort(),
);
const robots = await read("dist/robots.txt");
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap-index.xml`));
assert.ok(robots.includes("Disallow: /admin"));
for (const file of ["dist/404.html", "dist/admin/index.html"]) {
  const $ = load(await read(file));
  assert.match($('meta[name="robots"]').attr("content"), /noindex/);
  assert.equal($('link[rel="canonical"]').length, 0);
}
const errorPage = load(await read("dist/404.html"));
assert.equal(errorPage("html").attr("lang"), "en");
assert.match(errorPage("title").text(), /Page not found/);
const favicon = await read("dist/favicon.svg");
assert.ok(favicon.includes("<path"), "favicon uses outlined local font glyphs");
assert.ok(
  !/<text|<script|<foreignObject/.test(favicon),
  "favicon has no runtime font or script requirement",
);
for (const size of [16, 32, 48, 180]) {
  const file =
    size === 180 ? "apple-touch-icon.png" : `favicon-${size}x${size}.png`;
  const icon = await sharp(`dist/${file}`).metadata();
  assert.equal(icon.width, size);
  assert.equal(icon.height, size);
}
console.log(
  `PASS sitemap (${expected.length} pages), robots, 404, admin and favicon variants`,
);
