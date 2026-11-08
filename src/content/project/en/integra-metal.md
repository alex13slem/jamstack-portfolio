---
id: integra-metal
order: 10
name: Integra Metal
description: Corporate website for a steel construction company, built on 1C-Bitrix. Responsive UI, enquiry forms, a document gallery, and a custom administration module for managing page sections.
role: Full-stack developer
site_url: https://integra-metal.ru/
image_cover: /media/project/integra-metal-cover-4x3.png
image_preview: /media/project/integra-metal-preview-4x3.jpg
techs:
  - bitrix
  - php
  - mysql
  - javascript
  - css
  - vite
  - htmx
  - swiper
  - photoswipe
  - apache
  - docker
  - dokploy
---

## The task

Present Integra Metal's steel structure design, manufacturing and installation services. Visitors need information about the services and a way to submit an enquiry, while the company's team needs to manage content through 1C-Bitrix.

## Work completed

- Implemented the responsive interface, including mobile navigation, service-area tabs, expandable service descriptions and FAQ.
- Set up section management through the `integra.site` module, covering text, repeatable items, images and block visibility.
- Integrated HTMX forms with PHP processing, stored enquiries and email notifications. The interface includes Yandex SmartCaptcha integration.
- Added Swiper carousels and a PhotoSwipe gallery for testimonials and certificates.
- Prepared metadata settings, social previews, a sitemap and robots.txt.
- Set up the container environment and deployment configuration.

## Technical decisions

1C-Bitrix and PHP handle server-side components, administration and enquiry processing; MySQL stores the website data. Editors update content through the administration panel without modifying templates.

Vite bundles JavaScript and CSS into the Bitrix template assets. HTMX updates forms without reloading the page. Swiper and PhotoSwipe provide carousels and document viewing.

The environment uses Docker Compose and Apache. The container build prepared for deployment through Dokploy keeps uploaded files and caches in persistent storage.

## Explore the website

The public website includes service areas, a service catalogue, enquiry forms, testimonials, certificates, FAQ and contact details. The administration interface requires access and is not part of the public demonstration.

[Visit Integra Metal](https://integra-metal.ru/)
