export const locales = ["en", "ru"] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = "en";
export const localeTags = { en: "en_US", ru: "ru_RU" } as const;
export function isLang(value: string): value is Lang {
  return (locales as readonly string[]).includes(value);
}
