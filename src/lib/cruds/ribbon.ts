import type { Lang } from "@/i18n/ui";
import { getCollection } from "astro:content";
import { getTechs } from "./tech";

export async function getRibbonTechs(lang: Lang) {
  const [projects, experience, techs] = await Promise.all([
    getCollection("project"), getCollection("experience"), getTechs(lang),
  ]);
  const referenced = new Set([
    ...projects.filter((entry) => entry.id.startsWith(`${lang}/`)),
    ...experience.filter((entry) => entry.id.startsWith(`${lang}/`) && entry.data.visible),
  ].flatMap((entry) => entry.data.techs.map((tech) => tech.id)));
  return techs.filter((tech) => referenced.has(tech.id) || tech.show_in_ribbon)
    .sort((a, b) => a.name.localeCompare(b.name, lang));
}
