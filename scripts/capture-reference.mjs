// Optional live comparison. Normal builds and tests never access WordPress.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const pages = {
  home: [
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
  ],
  'about-us': [
    '097cac4',
    '24104a4',
    '879844a',
    '8e0cc70',
    '7a38585',
    'd3eaff8',
    'ccd1d9b',
    '8aeaeb4',
    'c85860a',
    '72e202c',
    'cb3e6b8',
    '921207d',
    '974ba6e',
    '7244e6b',
    '2353195',
  ],
  'mutual-funds': [
    '6964a57',
    '03e8cfd',
    '56ed2ae',
    'a6e96d9',
    'b51b41c',
    'ac0c2a2',
    '266e439',
    'fc04795',
    '6407d02',
    '03e7652',
    'd7c1bc3',
  ],
};
const selected = process.argv[2];
if (selected && !(selected in pages)) throw new Error('Unknown route');
const browser = await chromium.launch();
const measurements = [];
try {
  for (const [route, sections] of Object.entries(pages).filter(
    ([route]) => !selected || route === selected,
  )) {
    const directory = new URL(
      `../artifacts/reference/${route}/`,
      import.meta.url,
    );
    await mkdir(directory, { recursive: true });
    for (const width of [1280, 768, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      page.setDefaultTimeout(15000);
      await page.goto(
        `https://staging-e356-indothaiweb.wpcomstaging.com/${route === 'home' ? '' : `${route}/`}`,
        {
          waitUntil: 'networkidle',
        },
      );
      await page.evaluate(() => document.fonts.ready);
      for (const id of sections) {
        const section = page.locator(`[data-id="${id}"]`).first();
        // Scroll even when Elementor has visibility:hidden pending its entrance animation.
        await section.evaluate((el) => el.scrollIntoView({ block: 'center' }));
        // WordPress entrance animations need to settle after entering the viewport.
        await page.waitForTimeout(1200);
        await section.screenshot({
          path: new URL(`${width}-${id}.png`, directory).pathname,
          style: '[data-elementor-type="header"] { visibility: hidden; }',
        });
      }
      await page.locator('[data-elementor-type="footer"]').screenshot({
        path: new URL(`${width}-footer.png`, directory).pathname,
      });
      measurements.push(
        await page.evaluate(
          (route) => ({
            route,
            width: innerWidth,
            documentWidth: document.documentElement.scrollWidth,
            headings: [
              ...document.querySelectorAll(
                '[data-elementor-type="wp-page"] h2',
              ),
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
          }),
          route,
        ),
      );
      await page.screenshot({
        path: new URL(`${width}-full.png`, directory).pathname,
        fullPage: true,
      });
      await page.close();
      console.log(`Captured reference ${route} at ${width}px`);
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
}
