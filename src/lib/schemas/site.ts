import { z } from "astro/zod";
import { locales } from "@/i18n/locales";

const text = z.string().trim().min(1);
const localizedSiteSchema = z.object({
  site_name: text,
  site_title: text,
  site_description: text,
  social_technologies: z.array(text).max(4).default([]),
  section_hero: z.object({
    epithets: z.array(text).min(1),
    epithet_summary: text,
    greeting: text,
  }),
  section_experience: z.object({ title: text, profile_link_label: text }),
  section_about: z.object({
    title: text,
    text,
    interests: z.string().default(""),
  }),
  section_contacts: z.object({ title: text, proposal: text }),
  hero_contact: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
  }),
});

export const SiteConfigSchema = z.object(
  Object.fromEntries(
    locales.map((locale) => [locale, localizedSiteSchema]),
  ) as Record<(typeof locales)[number], typeof localizedSiteSchema>,
);
