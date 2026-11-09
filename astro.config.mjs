// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import favicons from "astro-favicons";
import { faviconOptions } from "./src/lib/seo/favicons";
import { locales, defaultLang } from "./src/i18n/locales";
import { siteUrl } from "./src/lib/seo/site";
import { sitemapOptions } from "./src/lib/seo/sitemap";

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  // Vercel normalizes page URLs; keep file endpoints accessible in Astro 5 dev.
  trailingSlash: "ignore",
  i18n: {
    locales: [...locales],
    defaultLocale: defaultLang,
    routing: { prefixDefaultLocale: false },
  },
  server: {
    port: 4344,
  },
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [svelte(), sitemap(sitemapOptions), favicons(faviconOptions)],
});
