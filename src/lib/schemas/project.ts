import { reference, z } from "astro:content";

export const ProjectCollectionSchema = z.object({
  id: z.string(),
  order: z.number().int().nonnegative().default(100),
  name: z.string(),
  description: z.string(),
  card_summary: z.string().trim().min(1).max(160),
  role: z.string(),
  site_url: z.string().url().optional(),
  github_url: z.string().url().optional(),
  image_cover: z.string(),
  image_preview: z.string(),
  techs: z.array(reference("tech")),
  gallery: z.array(z.object({
    image: z.string().startsWith("/media/"),
    alt: z.string().trim().min(1),
    caption: z.string().trim().default(""),
  })).default([]),
});
export type Project = z.infer<typeof ProjectCollectionSchema>;
