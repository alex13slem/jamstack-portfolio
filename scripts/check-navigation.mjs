import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { load } from 'cheerio';

// Execute the real helpers without requiring Astro's virtual module loader.
const asModule = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const compile = source => ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const uiModule = asModule(compile(await readFile('src/i18n/ui.ts', 'utf8')));
const helperCode = compile(await readFile('src/i18n/utils.ts', 'utf8')).replace(/from ["']\.\/ui["']/, `from ${JSON.stringify(uiModule)}`);
const { useTranslatedPath, getLangFromUrl } = await import(asModule(helperCode));
const translate = useTranslatedPath('en');
const paths = [
  ['/', '/ru/'],
  ['/projects/integra-metal', '/ru/projects/integra-metal'],
  ['/projects/jamstack-portfolio/?ref=home&ref=case#main-content', '/ru/projects/jamstack-portfolio/?ref=home&ref=case#main-content'],
  ['/?campaign=design#contacts', '/ru/?campaign=design#contacts'],
];
for (const [en, ru] of paths) {
  assert.equal(translate(en, 'ru'), ru);
  assert.equal(translate(ru, 'en'), en);
  assert.equal(translate(ru, 'ru'), ru, 'repeated switches must not duplicate locale');
}
assert.equal(translate('/ru/ru/projects/integra-metal?q=1#main-content', 'ru'), '/ru/projects/integra-metal?q=1#main-content');
assert.equal(translate('/en/projects/integra-metal', 'ru'), '/ru/projects/integra-metal');
assert.equal(translate('/projects/ru', 'ru'), '/ru/projects/ru', 'project segments must not be removed');
assert.equal(translate('mailto:test@example.com', 'ru'), 'mailto:test@example.com');
assert.equal(translate('https://example.com/ru/', 'ru'), 'https://example.com/ru/');
assert.equal(getLangFromUrl(new URL('https://portfolio.invalid/ru/projects/test')), 'ru');
assert.equal(getLangFromUrl(new URL('https://portfolio.invalid/constructor')), 'en');
console.log('PASS language routes, round trips, queries, fragments and duplicate prefixes');

const config = JSON.parse(await readFile('src/common/config.json', 'utf8'));
const errorPage = load(await readFile('dist/404.html', 'utf8'));
assert.equal(errorPage('[data-language]').attr('href'), '/ru/', '404 language control leads to an existing localized page');
for (const locale of ['en', 'ru']) {
  const prefix = locale === 'en' ? '' : 'ru/';
  const home = locale === 'en' ? '/' : '/ru/';
  const target = locale === 'en' ? 'ru' : 'en';
  for (const page of ['', 'projects/integra-metal/', 'projects/jamstack-portfolio/']) {
    const route = `${prefix}${page}index.html`;
    const $ = load(await readFile(`dist/${route}`, 'utf8'));
    const currentPath = home + page;
    const languageLink = $('header a[data-language]');
    assert.equal(languageLink.length, 1, `${route}: one persistent language switch`);
    assert.equal(languageLink.attr('data-language'), target);
    assert.equal(languageLink.attr('href'), translate(currentPath, target), `${route}: equivalent locale route`);
    assert.equal($('body > footer .site-logo').attr('href'), home, `${route}: localized footer home`);
    assert.equal($('meta[name="theme-color"]').attr('content'), '#090f16');
    if (!page) {
      assert.deepEqual($('.project-card__link').map((_, el) => $(el).attr('href')).get(), [
        `${home}projects/integra-metal`, `${home}projects/jamstack-portfolio`,
      ], `${route}: stable project order`);
      assert.equal($('email-contact').attr('data-email'), config[locale].hero_contact.email);
      assert.equal($('.contact-email__address').attr('href'), `mailto:${config[locale].hero_contact.email}`);
      assert.equal($('[data-copy-email][hidden]').length, 1, `${route}: progressive clipboard control`);
      assert.equal($('[data-copy-feedback][role="status"][aria-live="polite"]').length, 1);
    } else {
      assert.equal($('[data-all-projects]').attr('href'), `${home}#projects`, `${route}: return to localized projects`);
    }
    console.log(`PASS ${route}`);
  }
}
