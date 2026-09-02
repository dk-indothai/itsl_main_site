import { chromium } from '@playwright/test';
import { preview } from 'astro';
import { mkdir, writeFile } from 'node:fs/promises';
const directory = new URL('../artifacts/local/', import.meta.url);
await mkdir(directory, { recursive: true });
const server = await preview({ server: { host: '127.0.0.1', port: 4326 } });
const browser = await chromium.launch();
const measurements = [];
try {
  for (const width of [1280, 768, 390, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    await page.goto('http://127.0.0.1:4326/');
    await page.evaluate(() => document.fonts.ready);
    for (const section of await page.locator('main > section, footer').all()) {
      await section.scrollIntoViewIfNeeded();
      const name = (await section.getAttribute('aria-labelledby')) || 'footer';
      await section.screenshot({
        path: new URL(`${width}-${name}.png`, directory).pathname,
        style: '.site-header { visibility: hidden; }',
      });
    }
    measurements.push(
      await page.evaluate(() => ({
        width: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        overflow: [...document.querySelectorAll('body *')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.right > innerWidth && !el.closest('.testimonial-track');
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
      })),
    );
    await page.screenshot({
      path: new URL(`${width}-full.png`, directory).pathname,
      fullPage: true,
    });
    await page.close();
  }
  await writeFile(
    new URL('measurements.json', directory),
    JSON.stringify(measurements, null, 2),
  );
} finally {
  await browser.close();
  await server.stop();
}
