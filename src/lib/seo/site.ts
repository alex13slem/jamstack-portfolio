import type { Lang } from "@/i18n/ui";

export const siteUrl = "https://alex13slem.vercel.app";
export const socialImageSize = { width: 1200, height: 630 } as const;

export function pagePath(lang: Lang, projectId?: string) {
  const prefix = lang === "en" ? "/" : `/${lang}/`;
  return projectId
    ? `${prefix}projects/${encodeURIComponent(projectId)}/`
    : prefix;
}

export function canonicalPath(pathname: string) {
  return pathname.endsWith("/") || /\.[a-z0-9]+$/i.test(pathname)
    ? pathname
    : `${pathname}/`;
}

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).href;
}
