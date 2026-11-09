import { defaultLang, showDefaultLang, ui, type Lang, type Ui } from "./ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (Object.hasOwn(ui, lang)) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof Ui[Lang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function unlocalizedPath(pathname: string) {
  const segments = pathname.split("/");
  while (Object.hasOwn(ui, segments[1])) segments.splice(1, 1);
  return segments.join("/") || "/";
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, targetLang: Lang = lang) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path;
    const url = new URL(path, "https://portfolio.invalid");
    const prefix =
      !showDefaultLang && targetLang === defaultLang ? "" : `/${targetLang}`;
    return `${prefix}${unlocalizedPath(url.pathname)}${url.search}${url.hash}`;
  };
}
