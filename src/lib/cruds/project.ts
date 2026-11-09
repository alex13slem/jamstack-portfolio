import type { Lang } from "@/i18n/ui";
import { getCollection, getEntries } from "astro:content";

export const getProjectsWithTechnologies = async (lang: Lang) => {
  const collection = await getCollection("project");
  return await Promise.all(
    collection
      .filter((p) => p.id.startsWith(`${lang}/`))
      .sort(
        (a, b) =>
          a.data.order - b.data.order ||
          a.data.id.localeCompare(b.data.id, "en"),
      )
      .map(async (p) => {
        const techs = await getEntries(
          p.data.techs.map((t) => ({ ...t, id: `${lang}/${t.id}` })),
        );
        return {
          ...p.data,
          body: p.body,
          techs: techs.map((t) => t.data),
        };
      }),
  );
};
export type ProjectWithTechs = Awaited<
  ReturnType<typeof getProjectsWithTechnologies>
>[number];
