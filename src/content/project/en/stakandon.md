---
id: stakandon
name: Stakandon
description: Modern Stakandon website with a 3D cup constructor, AmoCRM integration, delivery map, and content management powered by Strapi.
role: Full-stack developer
site_url: https://stakandon.ru
github_url: https://github.com/alex13slem
image_cover: /media/project/safeimagekit-crop-image-to-1500x768.webp
image_preview: /media/project/safeimagekit-crop-image-to-1500x768-1.webp
techs:
  - astro
  - dokploy
  - svelte
  - typescript
  - zod
  - amo-crm
  - threlte
---
## 🥤 Project: Stakandon — Website for Selling Custom Cups

The MVP was developed in 2 months. The main goal was to build a modern showcase website with a unique interactive cup constructor, where users can choose the cup color and place their own print. The project focuses on delivering a smooth user experience while tightly integrating with the client’s business processes.

## ⚙️ Tech Stack

- **Frontend:** Astro SSG + Svelte — fast and modern stack for static websites with dynamic islands.
- **3D Constructor:** Threlte (Three.js) — interactive color selection and print placement directly in the browser.
- **Content:** Strapi — headless CMS for managing content and data.
- **CRM Integration:** Custom logic via Astro endpoints for sending leads and automatically creating tasks in AmoCRM.
- **Form Validation:** Felte + Zod for secure and flexible form handling.
- **Map:** Yandex.Maps with custom markers — showing delivery cities and estimated shipping times.
- **UI:** Swiper for interactive galleries.

## 🌐 Hosting & Deployment

The project is hosted on a private VPS using **Dokploy** — a platform that simplifies deployment and infrastructure management. This makes scaling and maintaining the project straightforward, even for non-technical staff.

## 🎯 Result

The website not only presents the product line but also enables users to design their own personalized cup through the 3D constructor. Thanks to the AmoCRM integration, orders and requests flow directly into the company’s workflow, while the interactive map helps customers instantly check delivery times and available cities.
