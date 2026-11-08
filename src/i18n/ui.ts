export const languages = {
  en: "English",
  ru: "Русский",
};
export const showDefaultLang = false;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "en";

interface UiSchema {
  contact_btn_label: string;
  all_rights_reserved: string;
  "landing.title": string;
  "404.title": string;
  "404.description": string;
  "404.button": string;
  "projects.techs.title": string;
  "a11y.skipContent": string;
  "links.newTab": string;
  "projects.title": string;
  "skills.title": string;
  "projects.openSite": string;
  "projects.openSource": string;
  "motion.label": string;
  "motion.shortLabel": string;
  "motion.on": string;
  "motion.off": string;
  "motion.reduced": string;
  "nav.switchLanguage": string;
  "nav.projects": string;
  "nav.allProjects": string;
  "contacts.writeEmail": string;
  "contacts.copyEmail": string;
  "contacts.copied": string;
  "contacts.copyError": string;
  "contacts.socials": string;
  "experience.present": string;
  "experience.technologies": string;
}

export const ui = {
  en: {
    contact_btn_label: "Contact",
    all_rights_reserved: "All rights reserved.",
    "landing.title": "Welcome",
    "404.title": "Page not found",
    "404.description": "Check the address or return to the main page",
    "404.button": "Return to the main page",
    "projects.techs.title": "Technologies on the project",
    "a11y.skipContent": "Skip to main content",
    "links.newTab": "opens in a new tab",
    "projects.title": "Selected projects",
    "skills.title": "Technologies",
    "projects.openSite": "Visit website",
    "projects.openSource": "View source on GitHub",
    "motion.label": "Page animations",
    "motion.shortLabel": "Animations",
    "motion.on": "on",
    "motion.off": "off",
    "motion.reduced": "Animations disabled by your device settings",
    "nav.switchLanguage": "Switch to Russian",
    "nav.projects": "Projects",
    "nav.allProjects": "All projects",
    "contacts.writeEmail": "Send an email",
    "contacts.copyEmail": "Copy email",
    "contacts.copied": "Email copied",
    "contacts.copyError": "Could not copy. Select the address and copy it manually.",
    "contacts.socials": "Other ways to connect",
    "experience.present": "Present",
    "experience.technologies": "Technologies used in this role",
  } as const satisfies UiSchema,
  ru: {
    contact_btn_label: "Связаться",
    all_rights_reserved: "Все права защищены.",
    "landing.title": "Добро пожаловать",
    "404.title": "Страница не найдена",
    "404.description": "Проверьте адрес или вернитесь на главную",
    "404.button": "Вернуться на главную",
    "projects.techs.title": "Технологии на проекте",
    "a11y.skipContent": "Перейти к основному содержимому",
    "links.newTab": "откроется в новой вкладке",
    "projects.title": "Избранные проекты",
    "skills.title": "Технологии",
    "projects.openSite": "Открыть сайт",
    "projects.openSource": "Открыть код на GitHub",
    "motion.label": "Анимации на странице",
    "motion.shortLabel": "Анимации",
    "motion.on": "вкл.",
    "motion.off": "выкл.",
    "motion.reduced": "Анимации отключены в настройках устройства",
    "nav.switchLanguage": "Переключить на английский",
    "nav.projects": "Проекты",
    "nav.allProjects": "Все работы",
    "contacts.writeEmail": "Написать письмо",
    "contacts.copyEmail": "Скопировать email",
    "contacts.copied": "Email скопирован",
    "contacts.copyError": "Не удалось скопировать. Выделите адрес и скопируйте его вручную.",
    "contacts.socials": "Другие способы связи",
    "experience.present": "настоящее время",
    "experience.technologies": "Технологии в этой роли",
  } as const satisfies UiSchema,
} as const;

export type Ui = typeof ui;
