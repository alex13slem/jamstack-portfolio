import { useTranslatedPath } from "@/i18n/utils";
import type { Lang } from "@/i18n/ui";

function syncLanguageLinks() {
  const path = location.pathname + location.search + location.hash;
  document
    .querySelectorAll<HTMLAnchorElement>("a[data-language]")
    .forEach((link) => {
      const language = link.dataset.language as Lang;
      link.href = useTranslatedPath(language)(
        link.dataset.languagePath ?? path,
      );
    });
}

document.addEventListener("astro:page-load", syncLanguageLinks);
window.addEventListener("hashchange", syncLanguageLinks);
window.addEventListener("popstate", syncLanguageLinks);
document.addEventListener(
  "click",
  (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest("a[data-language]")
    )
      syncLanguageLinks();
  },
  { capture: true },
);
syncLanguageLinks();
