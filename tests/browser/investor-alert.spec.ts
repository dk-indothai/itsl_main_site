import { expect, investorAlertTest as test } from './fixtures';

const alertCopy =
  'We caution all investors to be aware of fraudulent groups on social media platforms like WhatsApp, Telegram, Facebook, Instagram, etc. and advise them not to conduct any financial transactions or invest their money on these platforms without verifying the company/platform. Indo Thai Securities never approaches customers/public through social media/ WhatsApp for any formal business transaction. Neither has authorized any person or entity to collect funds through any WhatsApp groups, social media channels, or any such unauthorized channels.';

test('Investor Alert opens as a keyboard-contained modal and closes safely', async ({
  page,
}) => {
  await page.setViewportSize({ width: 760, height: 926 });
  await page.goto('/');

  const dialog = page.getByRole('dialog', { name: 'Investor Alert' });
  const close = page.getByRole('button', { name: 'Close investor alert' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(alertCopy);
  await expect(close).toBeFocused();
  await expect(page.locator('html')).toHaveAttribute(
    'data-investor-alert-open',
    '',
  );
  await expect(page.locator('html')).toHaveCSS('overflow', 'hidden');
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('html')).not.toHaveAttribute(
    'data-investor-alert-open',
    '',
  );
  await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
});

test('Investor Alert fits a narrow viewport and supports pointer dismissal', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 600 });
  await page.goto('/');

  const dialog = page.getByRole('dialog', { name: 'Investor Alert' });
  const bounds = await dialog.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(600);
  await expect(page.getByText(alertCopy, { exact: true })).toHaveCSS(
    'overflow-y',
    'auto',
  );

  await page.mouse.click(4, 4);
  await expect(dialog).toBeHidden();
});

test('/investors/ redirects to Shareholder Relation', async ({ page }) => {
  await page.goto('/investors/');
  await page.waitForURL('/investors/shareholder-relation/');
  await expect(page.locator('[data-investor-alert]')).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Shareholder Relation', level: 1 }),
  ).toBeVisible();
});

test('unknown routes redirect to Home', async ({ page }) => {
  await page.goto('/sdsd');
  await page.waitForURL('/');
  await expect(
    page.getByRole('heading', {
      name: 'Tailored Financial Solutions For Your Unique Needs',
      level: 1,
    }),
  ).toBeVisible();
});
