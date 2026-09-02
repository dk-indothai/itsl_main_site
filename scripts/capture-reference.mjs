// Optional live comparison. Normal builds and tests never access WordPress.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const directory = new URL('../artifacts/reference/', import.meta.url);
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const sections = [
  'e7c1699',
  'a1e766b',
  '9f2719c',
  'b8bc371',
  'f7461ca',
  '40a144a',
  '0b909cc',
  '8bc54d0',
  '0a19df4',
  '05b4441',
  '8bb9079',
];
const measurements = [];
try {
  for (const width of [1280, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto('https://staging-e356-indothaiweb.wpcomstaging.com/', {
      waitUntil: 'networkidle',
    });
    await page.evaluate(() => document.fonts.ready);
    for (const id of sections) {
      const section = page.locator(`[data-id="${id}"]`).first();
      await section.scrollIntoViewIfNeeded();
      // WordPress entrance animations need to settle after entering the viewport.
      await page.waitForTimeout(1200);
      await section.screenshot({
        path: new URL(`${width}-${id}.png`, directory).pathname,
      });
    }
    await page
      .locator('[data-elementor-type="footer"]')
      .screenshot({ path: new URL(`${width}-footer.png`, directory).pathname });
    measurements.push(
      await page.evaluate(() => ({
        width: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        headings: [
          ...document.querySelectorAll('[data-elementor-type="wp-page"] h2'),
        ].map((el) => {
          const style = getComputedStyle(el);
          return {
            text: el.textContent.trim(),
            font: style.fontFamily,
            size: style.fontSize,
            weight: style.fontWeight,
            lineHeight: style.lineHeight,
            width: el.getBoundingClientRect().width,
            height: el.getBoundingClientRect().height,
          };
        }),
      })),
    );
    await page.screenshot({
      path: new URL(`${width}-full.png`, directory).pathname,
      fullPage: true,
    });
    await page.close();
    console.log(`Captured reference at ${width}px`);
  }
  await writeFile(
    new URL('measurements.json', directory),
    JSON.stringify(measurements, null, 2),
  );
} finally {
  await browser.close();
}
