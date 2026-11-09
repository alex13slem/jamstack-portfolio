import type { SitemapOptions } from "@astrojs/sitemap";
import { canonicalPath } from "./site";

const excludedPages = new Set(["/admin/", "/404/", "/500/"]);

export const sitemapOptions = {
  filter: (page) => !excludedPages.has(canonicalPath(new URL(page).pathname)),

  i18n: {
    defaultLocale: "en",
    locales: { en: "en", ru: "ru" },
  },

  serialize(item) {
    const links = item.links ?? [];
    const english = links.find((link) => link.lang === "en");

    return {
      ...item,
      links: english
        ? [...links, { lang: "x-default", url: english.url }]
        : links,
    };
  },
} satisfies SitemapOptions;
