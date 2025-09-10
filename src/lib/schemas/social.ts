import { z } from "astro:content";

export const SocialIdEnum = z.enum(["telegram", "github", "vk", "hh"]);
export type SocialId = z.infer<typeof SocialIdEnum>;

export const SocialCollectionSchema = z.object({
  id: SocialIdEnum,
  name: z.string(),
  url: z.string().url(),
  iconify_id: z.string(),
});
export type Social = z.infer<typeof SocialCollectionSchema>;
