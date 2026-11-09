# alex13slem portfolio

Bilingual portfolio with project case studies, work experience and contact details.
Public site: [alex13slem.vercel.app](https://alex13slem.vercel.app/).

## Stack

- Astro generates static pages from Markdown content collections.
- Svelte powers interactive islands, including project cards, the gallery, rotating headline words, email copying and motion controls.
- Tailwind handles layout and base styling; CSS handles complex motion and image-viewer constraints.
- TypeScript and Zod validate code and content.
- Sveltia CMS edits projects, experience, technologies and site settings.
- Swiper handles case galleries. Project cards load WebGL previews on devices that support hover and serve static HTML covers on devices without hover.

## Local development

```sh
npm install
npm run dev
```

The development server uses port 4344. The static build is written to `dist/`.

## Validation

```sh
npm run check
npm run build
npm run check:pages
npm run format:check
```

`check` runs Astro, Svelte and TypeScript diagnostics. `check:pages` validates accessibility,
localized navigation and SEO in the generated HTML. `npm run check:seo` can run
only the metadata, sitemap, social-image and favicon checks after a build.

`npm run format` formats source and configuration with Prettier's Astro, Svelte and
Tailwind plugins. Markdown content and generated/media assets are excluded. The
navigation checker uses `tsx` to import the real TypeScript helpers directly.

## Shared settings

`src/common/config.json` remains the CMS source. Application code imports
`src/common/config.ts`, which validates settings with the Zod schema in
`src/lib/schemas/site.ts`. Invalid emails, missing text and empty headline-word
lists produce validation errors instead of silently reaching the generated pages.

`src/i18n/locales.ts` defines supported languages; Astro's native i18n helper builds
SEO alternate URLs. Client navigation retains query strings and anchors through
the shared path helper. `src/common/brand.ts` supplies the site and social-image
palette.

## Social images and favicon

The Svelte social-card template in `src/features/social/` renders on the server during the build.
Satori converts their HTML to SVG; Sharp produces PNG images. These tools add no
browser JavaScript. Fonts, project covers and the portrait are local assets.

Each home page and project receives a localized 1200×630 image under `dist/og/`.
Project names, summaries, roles, covers and technologies come from the collections.
Home-page branding, title, description and preview technologies come from site settings. Updating content
and rebuilding also updates the previews. Image URLs contain a hash of the PNG bytes,
so changed images receive new URLs.

The old manual OG Image field has been replaced by automatic generation. Search
Title and Site Description remain editable in the CMS. `astro-seo` renders metadata
through the shared `SeoFragment.astro` wrapper.

`public/favicon.svg` is the editable source for the number 13 in the logo font and
gradient. Its glyphs are outlined and need no font download. `astro-favicons`
generates ICO, SVG, PNG 16/32/48 and the 180 px Apple icon, and injects their links.
No custom favicon endpoints or PWA manifests are needed.

The social-image renderer caches by image inputs and retries failed renders.
Font files resolve through package exports rather than hardcoded `node_modules`
paths. The npm `sharp` override shares one native version between Astro, favicon
generation and social-image rendering; mixed native versions caused a Windows
DLL-loading failure.

## Deployment

The site targets Vercel static hosting. `astro.config.mjs` and the SEO helpers use
`https://alex13slem.vercel.app` as the canonical origin. `vercel.json` defines trailing
slashes, caching for versioned social images and noindex headers for the admin page.
The official `@astrojs/sitemap` integration discovers public Astro pages and writes
`sitemap-index.xml` and `sitemap-0.xml` during the build. Locale links and exclusions
are configured in `src/lib/seo/sitemap.ts`. The CMS is excluded by
robots rules and noindex metadata. There are no serverless contact forms: contact
uses email links and copying the address.
