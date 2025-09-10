import { navigate } from "astro:transitions/client";
import { toast } from "svelte-sonner";
import { defaultLang, showDefaultLang, ui, type Lang, type Ui } from "./ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof Ui[Lang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`;
  };
}

export function switchPathToRus() {
  const path = window.location.pathname;
  navigate("/ru" + path);
}

export function suggestRussianVersion() {
  const langs = navigator.languages || [navigator.language];
  const primary = langs[0]?.toLowerCase() || "";

  const sngLangs = ["be", "be-by", "ru"];

  if (sngLangs.some((l) => primary.startsWith(l))) {
    toast("Просмотреть на русском языке", {
      action: {
        label: "Перейти",
        onClick: switchPathToRus,
      },
      duration: 10000,
      closeButton: true,
    });
  }
}
