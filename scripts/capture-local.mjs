import { chromium } from '@playwright/test';
import { preview } from 'astro';
import { mkdir, writeFile } from 'node:fs/promises';
const routes = ['home', 'about-us', 'mutual-funds'];
const selected = process.argv[2];
if (selected && !routes.includes(selected)) throw new Error('Unknown route');
const server = await preview({ server: { host: '127.0.0.1', port: 4326 } });
const browser = await chromium.launch();
const measurements = [];
try {
  for (const route of routes.filter(
    (route) => !selected || route === selected,
  )) {
    const directory = new URL(`../artifacts/local/${route}/`, import.meta.url);
    await mkdir(directory, { recursive: true });
    for (const width of [1280, 768, 390, 320]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: 'reduce',
      });
      await page.goto(
        `http://127.0.0.1:4326/${route === 'home' ? '' : `${route}/`}`,
      );
      await page.evaluate(() => document.fonts.ready);
      for (const section of await page
        .locator('main > section, footer')
        .all()) {
        await section.scrollIntoViewIfNeeded();
        for (const img of await section.locator('img').all()) {
          await img.evaluate(async (image) => {
            await image.decode();
          });
        }
        const name =
          (await section.getAttribute('aria-labelledby')) || 'footer';
        await section.screenshot({
          path: new URL(`${width}-${name}.png`, directory).pathname,
          style: '.site-header { visibility: hidden; }',
        });
      }
      measurements.push(
        await page.evaluate(
          (route) => ({
            route,
            width: innerWidth,
            documentWidth: document.documentElement.scrollWidth,
            overflow: [...document.querySelectorAll('body *')]
              .filter((el) => {
                const r = el.getBoundingClientRect();
                return (
                  r.right > innerWidth && !el.closest('.testimonial-track')
                );
              })
              .map((el) => ({
                tag: el.tagName,
                classes: el.className,
                width: el.getBoundingClientRect().width,
                right: el.getBoundingClientRect().right,
              })),
            headings: [...document.querySelectorAll('main h1, main h2')].map(
              (el) => ({
                text: el.textContent.trim(),
                size: getComputedStyle(el).fontSize,
                lineHeight: getComputedStyle(el).lineHeight,
                width: el.getBoundingClientRect().width,
                height: el.getBoundingClientRect().height,
              }),
            ),
            resources: performance
              .getEntriesByType('resource')
              .map((e) => ({ url: e.name, bytes: e.transferSize })),
          }),
          route,
        ),
      );
      await page.screenshot({
        path: new URL(`${width}-full.png`, directory).pathname,
        fullPage: true,
      });
      await page.close();
      console.log(`Captured local ${route} at ${width}px`);
    }
    await writeFile(
      new URL('measurements.json', directory),
      JSON.stringify(
        measurements.filter((item) => item.route === route),
        null,
        2,
      ),
    );
  }
} finally {
  await browser.close();
  await server.stop();
}
