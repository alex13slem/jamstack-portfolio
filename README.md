## 🚀 Project: Personal Portfolio Website

Portfolio website showcasing my projects and technical expertise. The main goal was to create a **modern, fast-loading, and interactive website** that demonstrates my skills in frontend development, UI/UX, and content management.

## 📋 Role in the Project

I fully implemented the project, including frontend, interactivity, and infrastructure setup. My responsibilities included creating the site architecture, integrating dynamic components, animations, and ensuring high performance. I also integrated **Sveltia**, a Git-based CMS, to manage the website content easily.

## 💼 Technologies

- [**Astro JS (SSG)**](https://astro.build/) — static site generation for fast performance and SEO-friendly pages.
- [**Svelte**](https://svelte.dev/) — interactive components and dynamic islands.
- [**TailwindCSS**](https://tailwindcss.com/) + [**@tailwindcss/typography**](https://tailwindcss.com/docs/typography-plugin) — responsive, modern, and maintainable styling.
- [**TypeScript**](https://www.typescriptlang.org/) — safe and predictable code.
- [**Iconify**](https://iconify.design/) — vector icons integration.
- [**hover-effect**](https://github.com/robin-dela/hover-effect) — interactive image transitions and effects.
- [**marked**](https://github.com/markedjs/marked) — Markdown content rendering.
- [**@fontsource/source-sans-3**](https://fontsource.org/fonts/source-sans-3) — clean and readable typography.
- [**Sveltia**](https://github.com/sveltia/sveltia-cms) — Git-based CMS for managing website content directly via repository.

## ✨ Features

- **Interactive Islands:** Dynamic components using Svelte for fast, responsive UI.
- **Animations & Effects:** Smooth hover transitions and notifications for modern UX.
- **Markdown Content:** Easily manage portfolio content via Markdown files.
- **Git-based CMS:** Full content administration via **Sveltia**, no backend required.
- **Type-Safe Setup:** Full TypeScript integration for reliability and maintainability.
- **Responsive Design:** TailwindCSS ensures mobile-friendly and scalable layouts.

## 🌐 Hosting & Deployment

The website is **deployed on&#32;[Cloudflare Pages](https://pages.cloudflare.com/)**, using static hosting with serverless functions for forms and interactive integrations. Fully optimized for **fast loading and SEO**.

## 🔗 Contact & Repository

**Project Repository:** [GitHub](https://github.com/alex13slem/jamstack-portfolio)

![Astro JS](https://img.shields.io/badge/Astro%20JS-ff5a03?logo=astro\&logoColor=fff\&style=flat)

![Svelte](https://img.shields.io/badge/Svelte-ff3e00?logo=svelte\&logoColor=fff\&style=flat)


![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06b6d4?logo=tailwind-css\&logoColor=fff\&style=flat)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript\&logoColor=fff\&style=flat)

![Iconify](https://img.shields.io/badge/Iconify-000000?logo=iconify\&logoColor=fff\&style=flat)

![Sveltia](https://img.shields.io/badge/Sveltia-ff3e00?logo=svelte\&logoColor=fff\&style=flat)

![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?logo=cloudflare\&logoColor=fff\&style=flat)

## Local validation

- `npm run check` — Svelte diagnostics and TypeScript.
- `npm run build` — static production build.
- `npm run check:pages` — accessibility and localized routes in the built HTML.

Astro renders the content and fallback images on the server. Svelte handles the
interactive islands; the gallery and clipboard widget hydrate when visible.
Shared motion preferences stay in TypeScript. Layout utilities use Tailwind;
Swiper zoom constraints, dialog backdrop and complex motion use scoped or shared CSS.
