import type { Lang } from "@/i18n/ui";
import { getCollection, getEntries } from "astro:content";

export const getExperienceWithTechnologies = async (lang: Lang) => {
  const collection = await getCollection("experience");
  return Promise.all(collection
    .filter((entry) => entry.id.startsWith(`${lang}/`) && entry.data.visible)
    .sort((a, b) => a.data.order - b.data.order
      || b.data.start_date.localeCompare(a.data.start_date)
      || a.data.id.localeCompare(b.data.id, "en"))
    .map(async ({ data }) => {
      const techs = await getEntries(data.techs.map((tech) => ({ ...tech, id: `${lang}/${tech.id}` })));
      return { ...data, techs: techs.map((tech) => tech.data) };
    }));
};
