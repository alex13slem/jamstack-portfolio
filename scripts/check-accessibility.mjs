import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';

const routes = ['index.html', 'ru/index.html', ...['', 'ru/'].flatMap(locale => ['jamstack-portfolio', 'integra-metal'].map(id => `${locale}projects/${id}/index.html`)), '404.html'];
for (const route of routes) {
  const $ = load(await readFile(`dist/${route}`, 'utf8'));
  assert.equal($('#main-content[tabindex="-1"]').length, 1, `${route}: focusable main`);
  assert.equal($('.skip-link[href="#main-content"]').length, 1, `${route}: skip link`);
  assert.equal($('h1').length, 1, `${route}: one h1`);
  assert.equal($('astro-island[renderer-url*="react"]').length, 0, `${route}: no React runtime`);
  assert.equal($('button[data-motion-toggle][type="button"][aria-label][hidden]').length, 1, `${route}: named progressive motion control`);
  assert.equal($('[data-motion-toggle][role="switch"][aria-checked]').length, 1, `${route}: motion state is exposed`);
  assert.equal($('header [data-motion-toggle], .tech-ribbon button').length, 0, `${route}: one floating motion control`);
  assert.equal($('a a, a button, button a, button button').length, 0, `${route}: nested controls`);
  $('a[href]').each((_, link) => {
    const name = $(link).attr('aria-label') || ($(link).attr('aria-labelledby') || '').split(/\s+/).map(id => $(`[id="${id}"]`).text()).join(' ').trim() || $(link).text().trim();
    assert.ok(name && name !== '.', `${route}: unnamed link ${$(link).attr('href')}`);
  });
  if (route === 'index.html' || route === 'ru/index.html') {
    assert.equal($('.project-card').length, 2, `${route}: both current projects`);
    assert.equal($('.hero-epithet[data-active="true"]').length, 1, `${route}: static hero word before JS`);
    assert.ok($('.hero-epithets > .sr-only').text().trim(), `${route}: stable accessible hero text`);
    assert.equal($('.hero-epithet').not('[aria-hidden="true"] .hero-epithet').length, 0, `${route}: decorative rotating words`);
    assert.equal($('.project-card img[alt][width][height]').length, 2, `${route}: SSR fallback images`);
    $('.project-card a[aria-label]').each((_, link) => {
      assert.equal($(link).find('svg').length, 1, `${route}: icon missing without JS`);
    });
  }
  if (route.includes('projects/integra-metal/')) {
    assert.equal($('[data-gallery-inline] img[alt][width][height]').length, 2, `${route}: complete gallery before JS`);
    assert.equal($('[data-gallery-inline] .swiper-slide[inert]').length, 0, `${route}: all fallback slides accessible`);
    assert.equal($('[data-gallery-controls][hidden]').length, 1, `${route}: progressive gallery controls`);
    assert.equal($('[data-gallery-dialog][aria-label]').length, 1, `${route}: named image viewer`);
  } else {
    assert.equal($('.project-gallery').length, 0, `${route}: empty galleries omitted`);
  }
  console.log(`PASS ${route}`);
}
