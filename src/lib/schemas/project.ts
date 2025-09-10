import { reference, z } from "astro:content";

export const ProjectCollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  role: z.string(),
  site_url: z.string().url().optional(),
  github_url: z.string().url(),
  image_cover: z.string(),
  image_preview: z.string(),
  techs: z.array(reference("tech")),
});
export type Project = z.infer<typeof ProjectCollectionSchema>;
