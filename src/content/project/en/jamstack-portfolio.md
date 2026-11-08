---
id: jamstack-portfolio
order: 20
name: JAM-stack portfolio
card_summary: A bilingual portfolio with editable case studies and work experience.
description: A personal website with projects, work experience and contact details in English and Russian. Static pages built with Astro, interactive components in Svelte, and content editing through Sveltia CMS.
role: Full-stack developer
site_url: https://alex13slem.vercel.app
github_url: https://github.com/alex13slem/jamstack-portfolio
image_cover: /media/project/portfolio-thumb1.png
image_preview: /media/project/portfolio-preview.webp
techs:
  - astro
  - svelte
  - tailwind-css
  - typescript
  - zod
  - iconify
  - sveltia
  - swiper
---

## The task

Bring projects, work experience and contact details together on one website. Visitors should be able to understand the work I do, explore individual case studies and get in touch. The content needs to be editable in English and Russian through an administration interface.

## Work completed

- Built the home page, project pages and a language switch that preserves the current section.
- Set up collections for projects, work experience, technologies and social links. Linked entries to technologies and added controls for the order and visibility of work experience.
- Integrated Sveltia CMS for editing content and site settings.
- Implemented animations for the headline, technology ribbon and project cards, with a shared motion control.
- Added a Swiper case gallery with image viewing and zoom controls.
- Added keyboard navigation, visible focus, a skip link and email copying.

## Technical decisions

Astro generates static pages from content collections. Zod schemas validate the data structure during the build. Each entry has separate English and Russian versions; project descriptions use Markdown.

Svelte powers the project cards, gallery, rotating headline words, email copying and motion control interface. A shared TypeScript controller manages motion preferences. Image transitions on the cards use WebGL. A standard HTML image remains available without JavaScript and when WebGL is unavailable.

Tailwind CSS handles layout and base styling, while custom CSS handles complex animations, image viewing and zoom. Reduced-motion preferences and a shared control govern animations. Visitors can get in touch through email links or copy the address.

## Explore the project

The website includes two languages, project case studies and work experience with associated technologies. The administration interface supports editing text and relationships between entries. The source code is available through the GitHub link alongside the project description.
