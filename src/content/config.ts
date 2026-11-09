import { ProjectCollectionSchema } from "@/lib/schemas/project";
import { SocialCollectionSchema } from "@/lib/schemas/social";
import { TechCollectionSchema } from "@/lib/schemas/tech";
import { ExperienceCollectionSchema } from "@/lib/schemas/experience";
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";

const projectCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/project" }),
  schema: ProjectCollectionSchema,
});

const socialCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/social" }),
  schema: SocialCollectionSchema,
});

const techCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tech" }),
  schema: TechCollectionSchema,
});

export const collections = {
  experience: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
    schema: ExperienceCollectionSchema,
  }),
  project: projectCollection,
  social: socialCollection,
  tech: techCollection,
};
