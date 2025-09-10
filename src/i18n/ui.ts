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
  } as const satisfies UiSchema,
  ru: {
    contact_btn_label: "Связаться",
    all_rights_reserved: "Все права защищены.",
    "landing.title": "Добро пожаловать",
    "404.title": "Страница не найдена",
    "404.description": "Проверьте адрес или вернитесь на главную",
    "404.button": "Вернуться на главную",
    "projects.techs.title": "Технологии на проекте",
  } as const satisfies UiSchema,
} as const;

export type Ui = typeof ui;
