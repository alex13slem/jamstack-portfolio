import { createHash } from "node:crypto";
import config from "@/common/config";
import { locales, type Lang } from "@/i18n/locales";
import {
  getProjectsWithTechnologies,
  type ProjectWithTechs,
} from "@/lib/cruds/project";
import {
  mediaDataUrl,
  portraitDataUrl,
  renderSocialCard,
} from "@/features/social/render";
import type { SocialCardData } from "@/features/social/types";
import { siteUrl } from "./site";

type SocialPage = { lang: Lang; projectId?: string; data: SocialCardData };

function commonData(lang: Lang) {
  return { siteName: config[lang].site_name, domain: new URL(siteUrl).host };
}
function homeData(lang: Lang, image: string): SocialCardData {
  const site = config[lang];
  return {
    ...commonData(lang),
    image,
    project: false,
    role: "",
    title: `${site.section_hero.epithets[0]} ${site.section_hero.epithet_summary}`,
    description: site.site_description,
    technologies: site.social_technologies,
  };
}
async function projectData(
  lang: Lang,
  project: ProjectWithTechs,
): Promise<SocialCardData> {
  return {
    ...commonData(lang),
    project: true,
    title: project.name,
    role: project.role,
    description: project.card_summary,
    image: await mediaDataUrl(project.image_cover),
    technologies: project.techs.slice(0, 4).map((tech) => tech.name),
  };
}
async function localizedPages(
  lang: Lang,
  portrait: string,
): Promise<SocialPage[]> {
  const projects = await getProjectsWithTechnologies(lang);
  return [
    { lang, data: homeData(lang, portrait) },
    ...(await Promise.all(
      projects.map(async (project) => ({
        lang,
        projectId: project.id,
        data: await projectData(lang, project),
      })),
    )),
  ];
}
async function renderPage({ lang, projectId, data }: SocialPage) {
  const png = await renderSocialCard(data);
  const hash = createHash("sha256").update(png).digest("hex").slice(0, 12);
  return {
    lang,
    projectId,
    png,
    imagePath: `/og/${lang}/${projectId ?? "home"}-${hash}.png`,
    alt:
      lang === "ru"
        ? `${data.siteName}: ${data.title}`
        : `${data.title} — ${data.siteName}`,
  };
}
async function createCards() {
  const portrait = await portraitDataUrl();
  const pages = (
    await Promise.all(locales.map((lang) => localizedPages(lang, portrait)))
  ).flat();
  return Promise.all(pages.map(renderPage));
}
let buildCards: ReturnType<typeof createCards> | undefined;
export function getSocialCards() {
  // Dev reads current collections/assets; the renderer reuses unchanged image inputs.
  if (import.meta.env.DEV) return createCards();
  return (buildCards ??= createCards().catch((error) => {
    buildCards = undefined;
    throw error;
  }));
}
export async function getSocialCard(lang: Lang, projectId?: string) {
  const card = (await getSocialCards()).find(
    (entry) => entry.lang === lang && entry.projectId === projectId,
  );
  if (!card)
    throw new Error(`Missing social card: ${lang}/${projectId ?? "home"}`);
  return card;
}
