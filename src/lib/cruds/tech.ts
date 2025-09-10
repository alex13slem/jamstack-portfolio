import type { Lang } from "@/i18n/ui";
import { getCollection } from "astro:content";
import type { Tech } from "../schemas/tech";

export const getTechs = async (lang: Lang): Promise<Tech[]> => {
  const collection = await getCollection("tech");
  return collection.filter((t) => t.id.startsWith(lang)).map((t) => t.data);
};
