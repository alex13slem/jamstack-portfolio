import type { Lang } from "@/i18n/ui";
import { getCollection } from "astro:content";
import type { Social, SocialId } from "../schemas/social";

export const getSocials = async (lang: Lang): Promise<Social[]> => {
  const collection = await getCollection("social");
  return collection.filter((s) => s.id.startsWith(lang)).map((s) => s.data);
};

export const getSocial = async (id: SocialId, lang: Lang): Promise<Social> => {
  const data = await getSocials(lang);
  return data.find((s) => s.id === id)!;
};
