import { z } from "astro:content";

export const TechCollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
  iconify_id: z.string(),
});
export type Tech = z.infer<typeof TechCollectionSchema>;
