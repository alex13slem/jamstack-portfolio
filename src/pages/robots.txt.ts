import type { APIRoute } from "astro";
import { absoluteUrl } from "@/lib/seo/site";
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${absoluteUrl("/sitemap-index.xml")}
`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
