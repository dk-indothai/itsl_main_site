import { test, expect } from '@playwright/test';

test('closing procedure uses the staging flowchart with an accessible transcript', async ({
  page,
}) => {
  await page.goto('/procedure-of-closing-account/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Procedure for Closing an Account',
  );
  const image = page.getByRole('img', {
    name: 'Flowchart showing IndoThai’s procedure for closing an account',
  });
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute('src', /\/_astro\/account-closing\./);
  await expect(
    page.locator('#closing-procedure-transcript > ol > li'),
  ).toHaveCount(8);
  await expect(page.locator('#closing-procedure-transcript')).toContainText(
    'With Holding visit https://ekyc.indothai.co.in:90/',
  );
});

test('closing procedure has current navigation and no image-map interactions', async ({
  page,
}) => {
  await page.goto('/procedure-of-closing-account/');
  const current = page.locator('a[aria-current="page"]');
  await expect(current).toHaveCount(1);
  await expect(current).toHaveAttribute(
    'href',
    '/procedure-of-closing-account/',
  );
  await expect(page.locator('.closing-procedure a')).toHaveCount(0);
  await expect(page.locator('.closing-procedure map')).toHaveCount(0);
});

test('closing procedure has no overflow or missing assets at responsive widths', async ({
  page,
}, testInfo) => {
  for (const width of [1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 926 });
    await page.goto('/procedure-of-closing-account/');
    await page.evaluate(() => document.fonts.ready);
    const image = page.getByRole('img', {
      name: 'Flowchart showing IndoThai’s procedure for closing an account',
    });
    await expect(image).toBeVisible();
    expect(
      await image.evaluate(
        (node) => (node as HTMLImageElement).naturalWidth > 0,
      ),
    ).toBe(true);
    const imageWidth = await image.evaluate(
      (node) => node.getBoundingClientRect().width,
    );
    expect(imageWidth).toBeLessThanOrEqual(672);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator('.closing-procedure').screenshot({
      path: testInfo.outputPath(`closing-procedure-${width}.png`),
    });
  }
});
