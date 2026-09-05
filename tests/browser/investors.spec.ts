import { expect, test } from '@playwright/test';

const pagination = { page: 1, pageSize: 100, pageCount: 1, total: 1 };

test('Investors opens on hover and remains keyboard accessible', async ({
  page,
}) => {
  await page.goto('/');
  const investors = page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('button', { name: 'Investors' });
  await investors.hover();
  await expect(investors).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.getByRole('link', { name: 'Overview', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Shareholder Relation', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Financial Reports', exact: true }),
  ).toBeVisible();

  await investors.focus();
  await page.keyboard.press('Escape');
  await expect(investors).toHaveAttribute('aria-expanded', 'false');
  await expect(investors).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(investors).toHaveAttribute('aria-expanded', 'true');
});

test('mobile Investors menu opens by tap', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Navigation menu' }).click();
  const menu = page.getByRole('navigation', { name: 'More navigation' });
  const investors = menu.getByRole('button', { name: 'Investors' });
  await investors.click();
  await expect(
    menu.getByRole('link', { name: 'Overview', exact: true }),
  ).toBeVisible();
  await expect(
    menu.getByRole('link', { name: 'Shareholder Relation', exact: true }),
  ).toBeVisible();
  await expect(
    menu.getByRole('link', { name: 'Financial Reports', exact: true }),
  ).toBeVisible();
});

test('overview titles open as accessible dropdowns with sanitized rich text', async ({
  page,
}) => {
  await page.route('http://strapi.test/api/overviews**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        data: [
          {
            documentId: 'overview-1',
            title: 'Company Overview',
            description:
              'Trusted since 1995.\n\n## Key facts\n\n- Public company\n\n| Market | Status |\n| --- | --- |\n| Equity | Active |\n\n<script>window.bad = true</script>',
          },
        ],
        meta: { pagination },
      }),
    });
  });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/investors/overview/');
  await expect(
    page.getByRole('heading', { name: 'Company Overview' }),
  ).toBeVisible();
  const dropdown = page.locator('details.overview-card');
  const summary = dropdown.locator('summary');
  await expect(dropdown).not.toHaveAttribute('open', '');
  await expect(page.getByText('Trusted since 1995.')).toBeHidden();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(dropdown).toHaveAttribute('open', '');
  await expect(page.getByText('Trusted since 1995.')).toBeVisible();
  await expect(page.locator('.rich-text script')).toHaveCount(0);
  await expect(page.locator('.rich-text h3')).toHaveText('Key facts');
  const tableRegion = page.getByRole('region', {
    name: 'Scrollable overview table',
  });
  await expect(tableRegion.getByRole('table')).toBeVisible();
  await expect(
    tableRegion.getByRole('columnheader', { name: 'Market' }),
  ).toBeVisible();
  await expect(tableRegion.getByRole('cell', { name: 'Equity' })).toBeVisible();
  expect(
    await tableRegion.evaluate(
      (element) => element.scrollWidth > element.clientWidth,
    ),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(
    page.getByText('Enable JavaScript to load the investor overview.', {
      exact: true,
    }),
  ).toBeHidden();
  await expect(page.getByRole('status')).toHaveText('1 overview entry.');
  await page.keyboard.press('Space');
  await expect(dropdown).not.toHaveAttribute('open', '');
});

test('shareholder documents filter locally and retain empty categories', async ({
  page,
}) => {
  await page.route(
    'http://strapi.test/api/shareholder-relation-categories**',
    async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { documentId: 'annual', name: 'Annual Reports' },
            { documentId: 'empty', name: 'Notices' },
          ],
          meta: { pagination: { ...pagination, total: 2 } },
        }),
      });
    },
  );
  await page.route(
    'http://strapi.test/api/shareholder-relations**',
    async (route) => {
      const requestUrl = new URL(route.request().url());
      expect(requestUrl.searchParams.get('populate[0]')).toBe('file');
      expect(requestUrl.searchParams.get('populate[1]')).toBe(
        'shareholder_relation_category',
      );
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              documentId: 'report-1',
              title: 'Annual Report 2025',
              file: {
                name: 'annual-report',
                ext: '.pdf',
                url: '/uploads/annual-report.pdf',
                size: 1250,
              },
              shareholder_relation_category: { documentId: 'annual' },
            },
          ],
          meta: { pagination },
        }),
      });
    },
  );

  await page.goto('/investors/shareholder-relation/');
  await expect(
    page.getByRole('heading', { name: 'Annual Report 2025' }),
  ).toBeVisible();
  await expect(page.getByText('annual-report.pdf')).toBeVisible();
  await expect(page.getByText('1.25 MB')).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Download Annual Report 2025/ }),
  ).toHaveAttribute('href', 'http://strapi.test/uploads/annual-report.pdf');

  await page.getByLabel('Document category').selectOption('empty');
  await expect(page.getByRole('status')).toHaveText(
    'No shareholder documents yet.',
  );
  await expect(
    page.getByRole('heading', { name: 'Annual Report 2025' }),
  ).toBeHidden();
  await page.getByLabel('Document category').selectOption('annual');
  await expect(page.getByRole('status')).toHaveText('1 shareholder document.');
});

test('financial reports group into year dropdowns and expose safe files', async ({
  page,
}) => {
  await page.route(
    'http://strapi.test/api/financial-reports**',
    async (route) => {
      const requestUrl = new URL(route.request().url());
      expect(requestUrl.searchParams.get('populate[0]')).toBe('file');
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              documentId: 'full-2025',
              year: 2025,
              report_type: 'Full Year',
              quarter: null,
              file: null,
            },
            {
              documentId: 'quarter-2025',
              year: 2025,
              report_type: 'Quarter',
              quarter: 2,
              file: {
                name: 'quarter-two',
                ext: '.pdf',
                url: '/uploads/quarter-two.pdf',
                size: 850,
              },
            },
            {
              documentId: 'full-2024',
              year: 2024,
              report_type: 'Full Year',
              quarter: null,
              file: {
                name: 'annual-2024.pdf',
                ext: '.pdf',
                url: 'javascript:alert(1)',
                size: 2100,
              },
            },
          ],
          meta: { pagination: { ...pagination, total: 3 } },
        }),
      });
    },
  );

  await page.goto('/investors/financial-reports/');
  const groups = page.locator('.year-group');
  await expect(groups).toHaveCount(1);
  await expect(groups.locator('summary .year-label')).toHaveText(['2025']);
  await expect(groups.nth(0)).toHaveAttribute('open', '');
  await expect(groups.nth(0).locator('.report-period h3')).toHaveText([
    '2nd Quarter',
  ]);
  await expect(
    page.getByRole('link', { name: /Download Report 2025 — Quarter 2/ }),
  ).toHaveAttribute('href', 'http://strapi.test/uploads/quarter-two.pdf');
  await expect(groups.locator('[data-year-count]')).toHaveCount(0);
  await expect(page.getByText('quarter-two.pdf')).toHaveCount(0);
  await expect(page.getByText('850 KB')).toHaveCount(0);
  await expect(page.getByText('Not available')).toHaveCount(0);
  await expect(page.getByText('Download unavailable')).toHaveCount(0);

  await expect(page.getByRole('status')).toHaveText(
    'Financial reports loaded.',
  );
  await expect(page.getByRole('status')).toHaveClass(/sr-only/);
  await groups.nth(0).locator('summary').focus();
  await expect(groups.nth(0).locator('summary')).toBeFocused();
  await groups.nth(0).locator('summary').press('Enter');
  await expect(groups.nth(0)).not.toHaveAttribute('open', '');
});

test('investor pages show errors with retry and have no narrow overflow', async ({
  page,
}) => {
  let requests = 0;
  await page.route('http://strapi.test/api/overviews**', async (route) => {
    requests++;
    if (requests === 1) {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: '{}',
      });
      return;
    }
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        data: [],
        meta: { pagination: { ...pagination, pageCount: 0, total: 0 } },
      }),
    });
  });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/investors/overview/');
  await expect(page.getByRole('status')).toContainText(
    'not publicly available',
  );
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'No overview information yet.',
  );
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('investor responsive check has no overflow or missing assets', async ({
  page,
}) => {
  await page.route('http://strapi.test/api/**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        data: [],
        meta: {
          pagination: { page: 1, pageSize: 100, pageCount: 0, total: 0 },
        },
      }),
    });
  });
  for (const path of [
    '/investors/overview/',
    '/investors/shareholder-relation/',
    '/investors/financial-reports/',
  ]) {
    for (const width of [1280, 768, 390, 320]) {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
    }
  }
});
