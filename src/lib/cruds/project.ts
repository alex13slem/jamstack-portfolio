import type { Lang } from "@/i18n/ui";
import { getCollection, getEntries } from "astro:content";

export const getProjectsWithTechnologies = async (lang: Lang) => {
  const collection = await getCollection("project");
  return await Promise.all(
    collection
      .filter((p) => p.id.startsWith(lang))
      .map(async (p) => {
        const techs = await getEntries(
          p.data.techs.map((t) => ({ ...t, id: "ru" + "/" + t.id }))
        );
        return {
          ...p.data,
          body: p.body,
          techs: techs.map((t) => t.data),
        };
      })
  );
};
export type ProjectWithTechs = Awaited<
  ReturnType<typeof getProjectsWithTechnologies>
>[number];
