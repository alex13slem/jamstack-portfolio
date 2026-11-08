# Проверка текущего diff

8 ноября 2026 года. Проверены изменения относительно HEAD, включая новые компоненты, коллекции, CMS и два изображения администрирования. Основание: frontend-design, актуальные [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) и [Swiper API](https://swiperjs.com/swiper-api).

## Визуальное направление

Сохранён авторский стиль портфолио: Source Sans 3, персонажи, градиенты и согласованные анимации. Основные цвета: фон #090f16, фон изображения #0d1420, основной текст #dfe5ec, вторичный текст #c8c8c3, фокус #b9bcfe, тёплый акцент #f2cb9f.

Типографика: секционные заголовки 14 px, название кейса 20 px, названия карточек 24 px, основной текст 16 px. Большие фразы первого экрана и «Обо мне» сохранены как визуальные акценты. Подробный текст выровнен влево, длина строки ограничена 75ch.

Бенто использует независимые колонки:

```text
Обложка 4:3          Название и краткая суть
Задача, вклад,       GitHub и технологии
решения              Галерея Swiper
```

На телефоне: название → обложка → подробный кейс → технологии → галерея. Элементы идут в том же порядке в DOM.

## Исправленные замечания

- src/features/landing/sections/portfolio-cards/ProjectCard.svelte:57 — видимое «Смотреть кейс» и подчёркивание удалены; действие включено в доступное имя единственной основной ссылки. Лишний нижний отступ убран.
- src/features/landing/sections/portfolio-cards/ProjectCard.svelte:90 — названия карточек уменьшены до 24 px, добавлены переносы длинных названий и translate="no".
- src/features/product/templates/DetailPage.astro:29 — подробный текст находится под обложкой в левой колонке; его положение не зависит от высоты правых блоков. Отступ составляет 16 px.
- src/features/product/sections/SectionThumbnail.astro:19 — обложка занимает всю ширину колонки; пропорции 4:3, без ограничения внутренней шириной изображения. Добавлен приоритет загрузки обложки.
- src/features/product/sections/SectionDescription.astro:9 — название уменьшено до 20 px, убраны принудительное растягивание и вертикальное центрирование краткой справки.
- src/features/product/sections/SectionBody.astro:9 — текст выровнен по левому краю блока вместо центрирования узкой колонки; внутренние отступы согласованы с соседними блоками. Заголовки 14 px соответствуют стилю «Обо мне».
- src/features/product/sections/SectionTechs.astro:10 — компактный заголовок и подписи иконок; список переносится на узких экранах.
- src/features/product/sections/SectionGallery.astro:10 — Astro определяет размеры изображений на сервере; Svelte-компонент получает только данные и локализованные подписи, гидратируется при появлении в области просмотра.
- src/features/product/components/ProjectGallery.svelte:46 — Svelte управляет состоянием и навигацией; Swiper отвечает за перетаскивание и зум. Используются A11y и Zoom, автоперелистывания нет.
- src/features/product/components/ProjectGallery.svelte:136 — после достижения границы слайда фокус переходит к доступной кнопке; Tab/Shift+Tab остаются в просмотре, Escape возвращает фокус к активной ссылке изображения.
- src/features/product/components/ProjectGallery.svelte:353 — подпись расположена за пределами Swiper. Обрезка задана неподвижному слайду; перемещаемый контейнер не обрезает изображение.
- src/common/scripts/motion.ts:22 — единый независимый контроллер хранит предпочтение, учитывает reduced motion, видимость страницы и переходы Astro. Svelte подписчики очищаются при удалении компонентов.
- src/common/components/MotionToggle.svelte:19 — подпись, состояние switch и краткое раскрытие на телефоне заданы реактивно, без поиска элементов и изменения атрибутов вручную.
- src/common/components/EmailContact.svelte:21 — копирование использует состояния ожидания и обратной связи; mailto и адрес доступны без JS. Сохранены разные адреса EN/RU.
- src/features/landing/sections/hero/HeroEpithets.svelte:6 — смена слов каждые 3 секунды сохранена, общая пауза останавливает таймер, reduced motion возвращает первое слово. Доступный текст стабилен.

## Остальной diff

- public/admin/config.yml — pass: поля короткого описания, галереи, интересов и ручного включения технологии в ленту согласованы с данными; файл изображения общий для EN/RU, подписи и alt переводятся.
- src/common/config.json — pass: конкретное позиционирование, интересы отделены от текущего опыта, анимация эпитетов сохранена.
- src/content/project/en/integra-metal.md; src/content/project/ru/integra-metal.md — pass: короткие описания, локализованные подписи/alt, указание локального стенда, отсутствие GitHub и данных заявок.
- src/content/project/en/jamstack-portfolio.md; src/content/project/ru/jamstack-portfolio.md — pass: короткие описания и добавление реально используемого Swiper в технологии и выполненную работу.
- src/features/landing/sections/about-me/SectionAboutMe.astro — pass: небольшая секционная подпись сохранена, скорость подсветки увеличена; при паузе/reduced motion текст читается полностью.
- src/features/landing/sections/hero/SectionHero.astro; src/features/landing/sections/portfolio-cards/SectionPortfolioCards.astro — pass: отступы и персонаж проверены на компьютере и 320 px; дополнительная кнопка работ не добавлена.
- src/features/landing/sections/ribbon/SectionRibbon.astro; src/lib/cruds/ribbon.ts — pass: технологии актуальных проектов и видимого опыта; подтверждённые вручную технологии могут быть добавлены флагом. Каталог сохранён.
- src/lib/schemas/project.ts; src/lib/schemas/tech.ts; src/lib/utils/gallery.ts — pass: обязательные alt, ограничение короткого описания, пустая галерея по умолчанию, размеры изображений из файла, проверка пути внутри public.
- src/i18n/ui.ts — pass: доступные названия действий и состояний галереи на EN/RU.
- src/styles/base/accessibility.css — сохранены единый фокус и reduced motion; стиль удалённого видимого действия отсутствует в итоговом diff.
- package.json; package-lock.json; astro.config.mjs; tsconfig.json — удалены React, React DOM, интеграция Astro, их типы и react-textra. Добавлена проверка svelte-check; Swiper использует A11y и Zoom. React сохранён в каталоге навыков и опыте преподавания, где он относится к реальной работе.
- public/media/project/integra-metal-admin-hero.jpg; public/media/project/integra-metal-admin-services.jpg — визуально проверены: реальные редакторы локального стенда, без данных заявок и секретов.
- PORTFOLIO_PRIORITY_PLAN.md — актуализированы бенто, размеры, скрытое действие карточек и галерея Swiper.

## Проверки

- Production-сборка: pass. `npm run check`: Svelte — 0 ошибок и 0 предупреждений; TypeScript — pass.
- scripts/check-accessibility.mjs: семь страниц, pass.
- scripts/check-navigation.mjs: языковые помощники и шесть локализованных страниц, pass.
- Diff whitespace с учётом Windows CRLF: pass.
- Браузер: оба кейса, главная, EN/RU, ширины 320/390/1024/1488/1710 px; горизонтального переполнения не обнаружено.
- Обложка и текст имеют ширину левой колонки, отступ между ними 16 px.
- Swiper: кнопки, перетаскивание, клавиатура, границы слайдов, Tab/Shift+Tab, Escape и возврат фокуса проверены. После перехода из кейса без галереи через главную галерея инициализируется.
- Зум: проверено перемещение к верхнему левому и нижнему правому краям; расхождение границ менее 1 px, подпись видна.
- Reduced motion проверен принудительным локальным QA-режимом: переход слайдера 0 s, смена слайда работает. Это проверка ветки приложения, а не системной настройки устройства.
- Без JS, с браузерной CSP: два изображения видны списком, ненужные кнопки скрыты, ссылка открывает исходное изображение.

## Скриншоты

- [Обложка портфолио во всю колонку](C:/Users/Oleksandr/.codex/visualizations/2026/11/07/01a1b64b-fc62-7843-a20a-f465b97e7824/bento-portfolio-fixed.jpg)
- [Бенто Integra Metal](C:/Users/Oleksandr/.codex/visualizations/2026/11/07/01a1b64b-fc62-7843-a20a-f465b97e7824/bento-integra-final.jpg)
- [Карточки без видимого действия](C:/Users/Oleksandr/.codex/visualizations/2026/11/07/01a1b64b-fc62-7843-a20a-f465b97e7824/project-cards-final.jpg)
- [Зум с доступом к правому нижнему краю](C:/Users/Oleksandr/.codex/visualizations/2026/11/07/01a1b64b-fc62-7843-a20a-f465b97e7824/swiper-zoom-pan-fixed.jpg)
- [Компактный просмотр на 390 px](C:/Users/Oleksandr/.codex/visualizations/2026/11/07/01a1b64b-fc62-7843-a20a-f465b97e7824/swiper-mobile-final.jpg)

## Рефакторинг интерактивности на Svelte

Поведение перенесено из custom elements в Svelte для галереи, копирования email и интерфейса паузы; эпитеты перенесены из React. DOM-поиск и изменение текста/атрибутов заменены реактивным шаблоном, refs и обработчиками событий. Swiper остаётся императивной библиотекой; общий контроллер движения — независимым TypeScript-модулем.

Tailwind используется для простых размеров, отступов, flex-размещения и оформления контактов. Scoped CSS оставлен для интеграции со Swiper, ограничений зума и диалога; общий CSS — для согласованных анимаций и их паузы. About и лента сохранены без дополнительной гидратации.

Дополнительно проверено в браузере 8 ноября после переноса: EN/RU копирование с подтверждением; обработка отказа API через явно заданный QA-режим; сохранение паузы после reload; продолжение смены эпитетов; reduced motion; fallback галереи с CSP без JS; клавиатурная ловушка и возврат фокуса; ширины 320/390/1024/1710 px. Действующий dev-сервер 4344 перезапущен с новым кешем после смены зависимостей; новых ошибок гидратации нет. QA-отказ копирования — принудительная проверка ветки ошибки, не проверка настроек разрешений браузера.

Сравнение суммы gzip всех JS-файлов `dist/_astro`: до рефакторинга 252 496 байт, после — 198 965 байт (−53 531 байт, −21,2%). Это размер ресурсов всей сборки, а не объём одной загрузки страницы и не оценка Lighthouse.

Скриншоты после переноса:
- [Галерея на Svelte](C:/Users/Oleksandr/.codex/visualizations/2026/11/07/01a1b64b-fc62-7843-a20a-f465b97e7824/svelte-gallery-desktop.jpg)
- [Просмотр на телефоне](C:/Users/Oleksandr/.codex/visualizations/2026/11/07/01a1b64b-fc62-7843-a20a-f465b97e7824/svelte-gallery-mobile.jpg)
