import { test, expect, type Page, type Request } from '@playwright/test';

const api = 'http://strapi.test';
const categories = [
  { documentId: 'it', name: 'IT' },
  { documentId: 'empty', name: 'Compliance' },
];
const software = [
  { documentId: 'z', name: 'Zeta', software_category: null, artifact: [] },
  {
    documentId: 'b',
    name: 'Beta',
    description: 'Trading software for your desktop.',
    software_category: categories[0],
    artifact: [
      {
        name: 'Beta Desktop.zip',
        ext: '.zip',
        url: '/uploads/first.zip',
        size: 2000,
      },
      {
        name: 'Ignored.zip',
        ext: '.zip',
        url: '/uploads/ignored.zip',
        size: 6000,
      },
    ],
  },
  {
    documentId: 'a',
    name: 'Alpha',
    description: null,
    software_category: categories[0],
    artifact: [{ url: 'https://downloads.example.test/alpha.pdf', size: 966 }],
  },
];

const envelope = (
  data: unknown[],
  page = 1,
  pageCount = data.length ? 1 : 0,
) => ({
  data,
  meta: { pagination: { page, pageCount, pageSize: 100, total: data.length } },
});

async function mockCatalogue(
  page: Page,
  entries: unknown[] = software,
  groups: unknown[] = categories,
) {
  const requests: Request[] = [];
  await page.route(`${api}/**`, async (route) => {
    requests.push(route.request());
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/software-categories')
      await route.fulfill({ json: envelope(groups) });
    else if (path === '/api/softwares')
      await route.fulfill({ json: envelope(entries) });
    else await route.abort(); // Never fetch attachments or contact the live CMS in tests.
  });
  return requests;
}

test('All Categories includes sorted, uncategorized software and uses only the first file', async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: 'private-session', value: 'synthetic', url: api },
  ]);
  const requests = await mockCatalogue(page);
  await page.goto('/downloads/');
  await expect(page.locator('.software-card h2')).toHaveText([
    'Alpha',
    'Beta',
    'Zeta',
  ]);
  await expect(page.locator('.category-filter')).toHaveText([
    'All Categories',
    'Compliance',
    'IT',
  ]);
  await expect(
    page.getByRole('button', { name: 'All Categories' }),
  ).toHaveAttribute('aria-pressed', 'true');
  const beta = page
    .locator('.software-card')
    .filter({ has: page.getByRole('heading', { name: 'Beta', exact: true }) });
  await expect(beta.locator('[data-size-text]')).toHaveText('2 MB');
  await expect(beta.locator('[data-file-name]')).toHaveText('Beta Desktop.zip');
  await expect(
    page.locator('.software-card').first().locator('[data-file-name]'),
  ).toHaveText('alpha.pdf');
  await expect(
    page.locator('.software-card').last().locator('[data-file-details]'),
  ).toBeHidden();
  await expect(beta.getByRole('link')).toHaveAttribute(
    'href',
    `${api}/uploads/first.zip`,
  );
  await expect(page.locator('a[href*="ignored"]')).toHaveCount(0);
  await expect(
    page.locator('.software-card').first().locator('[data-size-text]'),
  ).toHaveText('966 KB');
  await expect(
    page.locator('.software-card').last().getByText('Download unavailable'),
  ).toBeVisible();
  await expect(
    page.locator('.software-card').last().getByRole('link'),
  ).toHaveCount(0);
  expect(requests).toHaveLength(2);
  for (const request of requests) {
    expect(request.method()).toBe('GET');
    expect(request.postData()).toBeNull();
    const headers = await request.allHeaders();
    expect(headers.authorization).toBeUndefined();
    expect(headers.cookie).toBeUndefined();
    expect(headers.referer).toBeUndefined();
    const query = new URL(request.url()).searchParams;
    expect(query.get('pagination[page]')).toBe('1');
    expect(query.get('pagination[pageSize]')).toBe('100');
    expect(query.has('status')).toBe(false);
  }
  const query = new URL(
    requests.find((r) => new URL(r.url()).pathname === '/api/softwares')!.url(),
  ).searchParams;
  expect(query.get('populate[0]')).toBe('artifact');
  expect(query.get('populate[1]')).toBe('software_category');
  expect(new URL(page.url()).search).toBe('');
  await page.reload();
  await expect(page.locator('.software-card')).toHaveCount(3);
  expect(requests).toHaveLength(4);
});

test('keyboard filters show empty categories without fetching again and keep focus visible', async ({
  page,
}) => {
  const requests = await mockCatalogue(page);
  await page.goto('/downloads/');
  const all = page.getByRole('button', { name: 'All Categories' });
  await expect(all).toBeEnabled();
  await all.focus();
  await page.keyboard.press('Tab');
  const empty = page.getByRole('button', { name: 'Compliance', exact: true });
  await expect(empty).toBeFocused();
  await page.keyboard.press('Space');
  await expect(empty).toHaveAttribute('aria-pressed', 'true');
  await expect(empty).toHaveCSS('outline-style', 'solid');
  await expect(page.locator('[data-status]')).toHaveText('No software yet.');
  await expect(page.locator('.software-card:visible')).toHaveCount(0);
  await expect(page.locator('.software-card a:visible')).toHaveCount(0);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(page.locator('.downloads-help a[href^="tel:"]')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('button', { name: 'IT', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.software-card:visible h2')).toHaveText([
    'Alpha',
    'Beta',
  ]);
  await all.click();
  await expect(page.locator('.software-card')).toHaveCount(3);
  expect(requests).toHaveLength(2);
});

test('matches category documentId rather than its display name', async ({
  page,
}) => {
  await mockCatalogue(page, software, [
    { documentId: 'other-it', name: 'IT' },
    ...categories,
  ]);
  await page.goto('/downloads/');
  await page.locator('button[data-category="other-it"]').click();
  await expect(page.locator('[data-status]')).toHaveText('No software yet.');
  await page.locator('button[data-category="it"]').click();
  await expect(page.locator('.software-card:visible')).toHaveCount(2);
});

test('category selection reuses cards instead of rebuilding them', async ({
  page,
}) => {
  await mockCatalogue(page);
  await page.goto('/downloads/');
  await expect(page.locator('.software-card')).toHaveCount(3);
  const firstCard = await page
    .locator('.software-card')
    .first()
    .elementHandle();
  await page.getByRole('button', { name: 'Compliance', exact: true }).click();
  expect(
    await firstCard!.evaluate(
      (card) => card.isConnected && card.hasAttribute('hidden'),
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'All Categories' }).click();
  expect(
    await firstCard!.evaluate(
      (card) => card.isConnected && !card.hasAttribute('hidden'),
    ),
  ).toBe(true);
});

test('genuinely empty software keeps categories and the empty message', async ({
  page,
}) => {
  await mockCatalogue(page, []);
  await page.goto('/downloads/');
  await expect(page.locator('[data-status]')).toHaveText('No software yet.');
  await expect(page.locator('.category-filter')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Retry' })).toBeHidden();
});

test('accepts the current single-attachment Strapi schema', async ({
  page,
}) => {
  await mockCatalogue(page, [
    {
      documentId: 'single',
      name: 'Single attachment',
      artifact: {
        name: 'Software installer',
        ext: '.zip',
        url: 'https://storage.example.test/software.zip',
        size: 1250,
      },
      software_category: categories[0],
    },
  ]);
  await page.goto('/downloads/');
  await expect(page.locator('.software-card')).toHaveCount(1);
  await expect(page.locator('.software-card a')).toHaveAttribute(
    'href',
    'https://storage.example.test/software.zip',
  );
  await expect(page.locator('[data-size-text]')).toHaveText('1.25 MB');
  await expect(page.locator('[data-file-name]')).toHaveText(
    'Software installer.zip',
  );
});

test('filenames retain extensions, use safe URL basenames and never use a second attachment', async ({
  page,
}) => {
  await mockCatalogue(page, [
    {
      documentId: '1',
      name: 'A',
      artifact: { name: 'Installer.ZIP', ext: '.zip', url: '/hashed.zip' },
    },
    {
      documentId: '2',
      name: 'B',
      artifact: { url: '/downloads/User%20guide.pdf?version=1#file' },
    },
    { documentId: '3', name: 'C', artifact: { url: '/bad%name.zip' } },
    {
      documentId: '4',
      name: 'D',
      artifact: [null, { name: 'Ignored.exe', url: '/ignored.exe' }],
    },
    {
      documentId: '5',
      name: 'E',
      artifact: {
        name: '<img src=x onerror=alert(1)>.zip',
        ext: '.zip',
        url: '/safe.zip',
      },
    },
  ]);
  await page.goto('/downloads/');
  await expect(page.locator('[data-file-name]')).toHaveText([
    'Installer.ZIP',
    'User guide.pdf',
    'bad%name.zip',
    '',
    '<img src=x onerror=alert(1)>.zip',
  ]);
  await expect(page.locator('.software-card img')).toHaveCount(0);
  await expect(page.getByText('Ignored.exe')).toHaveCount(0);
});

test('the complete long filename and extension wrap inside a narrow card', async ({
  page,
}, testInfo) => {
  const filename = `IndoThai-${'DesktopSoftware'.repeat(12)}.tar.gz`;
  await page.setViewportSize({ width: 320, height: 926 });
  await mockCatalogue(page, [
    {
      documentId: 'long',
      name: 'Trading software',
      artifact: { name: filename, ext: '.gz', url: '/app.tar.gz', size: 4500 },
    },
  ]);
  await page.goto('/downloads/');
  const label = page.locator('[data-file-name]');
  await expect(label).toHaveText(filename);
  await expect(label).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const details = await page.locator('[data-file-details]').boundingBox();
  const card = await page.locator('.software-card').boundingBox();
  expect(details!.x + details!.width).toBeLessThanOrEqual(
    card!.x + card!.width,
  );
  const size = await page.locator('[data-size]').boundingBox();
  expect(Math.abs(details!.y - size!.y)).toBeLessThan(1);
  expect(details!.x + details!.width).toBeLessThan(size!.x);
  expect(size!.x + size!.width).toBeLessThanOrEqual(card!.x + card!.width);
  await page
    .locator('main')
    .screenshot({ path: testInfo.outputPath('long-filename-320.png') });
});

test('metadata handles missing filename or size without an orphan divider or blank row', async ({
  page,
}) => {
  await mockCatalogue(page, [
    { documentId: 'a', name: 'Name only', artifact: { name: 'guide.pdf' } },
    { documentId: 'b', name: 'Neither value', artifact: null },
    { documentId: 'c', name: 'Size only', artifact: { size: 125 } },
  ]);
  await page.goto('/downloads/');
  const cards = page.locator('.software-card');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0).locator('[data-file-name]')).toHaveText(
    'guide.pdf',
  );
  await expect(cards.nth(0).locator('[data-size]')).toBeHidden();
  await expect(cards.nth(1).locator('.file-meta')).toBeHidden();
  await expect(cards.nth(2).locator('[data-file-details]')).toBeHidden();
  await expect(cards.nth(2).locator('[data-size-text]')).toHaveText('125 KB');
  await expect(cards.nth(2).locator('[data-size]')).toHaveCSS(
    'border-left-width',
    '0px',
  );
});

test('follows pagination for both collections before rendering and sorts the full result', async ({
  page,
}) => {
  const requests = await mockCatalogue(page);
  await page.route(`${api}/api/**`, async (route) => {
    requests.push(route.request());
    const url = new URL(route.request().url());
    const current = Number(url.searchParams.get('pagination[page]'));
    const data = url.pathname.endsWith('software-categories')
      ? categories
      : software;
    await route.fulfill({
      json: envelope([data[current - 1]], current, data.length),
    });
  });
  await page.goto('/downloads/');
  await expect(page.locator('.software-card h2')).toHaveText([
    'Alpha',
    'Beta',
    'Zeta',
  ]);
  await expect(page.locator('.category-filter')).toHaveText([
    'All Categories',
    'Compliance',
    'IT',
  ]);
  expect(requests).toHaveLength(5);
});

test('renders CMS text literally and rejects unsafe or missing first files without falling back', async ({
  page,
}) => {
  const unsafe = [
    'javascript:alert(1)',
    'data:text/html,hello',
    'file:///tmp/app',
    'https://user:password@example.test/a',
    '',
    null,
  ];
  const entries = unsafe.map((url, index) => ({
    documentId: `bad-${index}`,
    name: `Unavailable ${index}`,
    artifact: [{ url }, { url: '/valid-second.zip' }],
  }));
  await mockCatalogue(
    page,
    [
      ...entries,
      {
        documentId: 'text',
        name: '<img src=x onerror=alert(1)>',
        description: '<script>alert(1)</script>\nPlain text',
        artifact: null,
      },
      {
        documentId: 'empty-first',
        name: 'Empty first attachment',
        artifact: [null, { url: '/second.zip' }],
      },
      {
        documentId: 'no-size',
        name: 'No size',
        artifact: [{ url: 'uploads/readme.pdf' }],
      },
    ],
    [{ documentId: 'unsafe-name', name: '<svg onload=alert(1)>' }],
  );
  await page.goto('/downloads/');
  await expect(page.locator('.software-card')).toHaveCount(9);
  await expect(
    page.locator('.software-card [data-unavailable]:visible'),
  ).toHaveCount(8);
  await expect(page.locator('.software-card a:visible')).toHaveCount(1);
  await expect(page.locator('.software-card a:visible')).toHaveAttribute(
    'href',
    `${api}/uploads/readme.pdf`,
  );
  await expect(
    page.locator(
      '.software-card img, .software-card script, .category-filter svg',
    ),
  ).toHaveCount(0);
  await expect(
    page.getByRole('heading', {
      name: '<img src=x onerror=alert(1)>',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: '<svg onload=alert(1)>', exact: true }),
  ).toBeVisible();
  await expect(page.locator('[data-size]:visible')).toHaveCount(0);
});

for (const failure of [
  '401',
  '403',
  '429',
  '500',
  'network',
  'invalid-json',
  'invalid-data',
  'missing-pagination',
  'wrong-page',
  'bad-record',
]) {
  test(`reports ${failure} as an error, not an empty list, and allows manual retry`, async ({
    page,
  }) => {
    const requests = await mockCatalogue(page);
    await page.route(`${api}/api/softwares?*`, async (route) => {
      if (/^\d+$/.test(failure))
        await route.fulfill({ status: Number(failure), json: { data: null } });
      else if (failure === 'network') await route.abort('failed');
      else if (failure === 'invalid-json')
        await route.fulfill({ body: 'not json' });
      else if (failure === 'invalid-data')
        await route.fulfill({
          json: { data: null, meta: { pagination: { page: 1, pageCount: 0 } } },
        });
      else if (failure === 'missing-pagination')
        await route.fulfill({ json: { data: [] } });
      else if (failure === 'wrong-page')
        await route.fulfill({ json: envelope(software, 2) });
      else
        await route.fulfill({
          json: envelope([{ documentId: 'broken', name: { not: 'text' } }]),
        });
    });
    await page.goto('/downloads/');
    await expect(
      page.getByRole('button', { name: 'Retry', exact: true }),
    ).toBeVisible();
    await expect(page.locator('[data-status]')).not.toHaveText(
      'No software yet.',
    );
    await expect(page.locator('[data-status]')).not.toHaveText(
      'Loading software downloads…',
    );
    await expect(page.locator('.software-card')).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: 'All Categories' }),
    ).toBeDisabled();
    await page.unroute(`${api}/api/softwares?*`);
    const retry = page.getByRole('button', { name: 'Retry', exact: true });
    await retry.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.software-card')).toHaveCount(3);
    await expect(retry).toBeHidden();
    await expect(
      page.getByRole('button', { name: 'All Categories' }),
    ).toBeFocused();
    expect(requests.length).toBeGreaterThanOrEqual(2);
  });
}

test('category permission denial and later-page errors do not display partial results', async ({
  page,
}) => {
  await mockCatalogue(page);
  await page.route(`${api}/api/software-categories?*`, (route) =>
    route.fulfill({ status: 403, json: { data: null } }),
  );
  await page.goto('/downloads/');
  await expect(page.locator('[data-status]')).toContainText(
    'not available to the public',
  );
  await expect(page.locator('.software-card')).toHaveCount(0);
  await page.unroute(`${api}/api/software-categories?*`);
  await page.route(`${api}/api/softwares?*`, (route) => {
    const current = Number(
      new URL(route.request().url()).searchParams.get('pagination[page]'),
    );
    return route.fulfill(
      current === 1 ? { json: envelope([software[0]], 1, 2) } : { status: 500 },
    );
  });
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.locator('[data-status]')).toContainText(
    'service is unavailable',
  );
  await expect(page.locator('.software-card')).toHaveCount(0);
});

test('loading times out at 20 seconds, does not retry automatically, and blocks repeated retry clicks', async ({
  page,
}) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  let count = 0;
  await page.route(`${api}/**`, () => {
    count++;
  });
  await page.goto('/downloads/');
  await expect(page.locator('[data-status]')).toHaveText(
    'Loading software downloads…',
  );
  await expect(page.locator('[data-software-list]')).toHaveAttribute(
    'aria-busy',
    'true',
  );
  await page.clock.runFor(19_900);
  await expect(page.getByRole('button', { name: 'Retry' })).toBeHidden();
  await page.clock.runFor(200);
  await expect(page.locator('[data-status]')).toHaveText(
    'Loading took too long. Please try again.',
  );
  await page.clock.runFor(25_000);
  expect(count).toBe(2);
  const retry = page.getByRole('button', { name: 'Retry', exact: true });
  const before = await retry.boundingBox();
  await retry.click();
  await expect(retry).toBeDisabled();
  await retry.evaluate((button) => {
    (button as HTMLButtonElement).click();
  });
  await expect.poll(() => count).toBe(4);
  expect((await retry.boundingBox())!.width).toBe(before!.width);
  await page.clock.runFor(20_100);
  await expect(retry).toBeEnabled();
});

test('without JavaScript the explanation, phone/email and native menu remain usable', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  let calls = 0;
  await page.route(`${api}/**`, (route) => {
    calls++;
    return route.abort();
  });
  await page.goto('/downloads/');
  await expect(page.locator('[data-status]')).toHaveText(
    'Enable JavaScript to load software downloads.',
  );
  await expect(
    page.getByRole('button', { name: 'All Categories' }),
  ).toBeDisabled();
  await expect(page.locator('.software-card')).toHaveCount(0);
  await expect(page.locator('.downloads-help a[href^="tel:"]')).toBeVisible();
  await expect(
    page.locator('.downloads-help a[href^="mailto:"]'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Navigation menu' }).click();
  await expect(
    page.getByRole('link', { name: 'Software Downloads', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  expect(calls).toBe(0);
  await context.close();
});

test('unconfigured fallback never requests the CMS', async ({ page }) => {
  const requests = await mockCatalogue(page);
  // Simulate an unset build-time env value without a second build/server.
  await page.route('**/downloads/', async (route) => {
    const response = await route.fetch();
    const html = (await response.text())
      .replace('data-api-base="http://strapi.test"', 'data-api-base=""')
      .replace(
        'Enable JavaScript to load software downloads.',
        'Software downloads are not configured yet. Please contact us for assistance.',
      );
    await route.fulfill({ response, body: html });
  });
  await page.goto('/downloads/');
  await expect(page.locator('[data-status]')).toContainText(
    'not configured yet',
  );
  await expect(
    page.getByRole('button', { name: 'All Categories' }),
  ).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Retry' })).toBeHidden();
  expect(requests).toHaveLength(0);
});

for (const [width, columns] of [
  [1280, 3],
  [768, 2],
  [390, 1],
  [320, 1],
]) {
  test(`downloads has no overflow or missing assets at ${width}px with ${columns} columns`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 926 });
    await mockCatalogue(page, software, [
      ...categories,
      { documentId: 'long', name: 'Trading platforms and account utilities' },
    ]);
    await page.goto('/downloads/');
    await expect(page.locator('.software-card')).toHaveCount(3);
    await page.evaluate(() => document.fonts.ready);
    const metadata = page.locator('.software-card').filter({
      has: page.getByRole('heading', { name: 'Beta', exact: true }),
    });
    // Compare the two line boxes, not flex-item versus inline text bounds.
    const filename = await metadata
      .locator('[data-file-details]')
      .boundingBox();
    const size = await metadata.locator('[data-size]').boundingBox();
    expect(Math.abs(filename!.y - size!.y)).toBeLessThan(1);
    expect(filename!.height).toBe(size!.height);
    expect(filename!.x + filename!.width).toBeLessThan(size!.x);
    expect(
      await page
        .locator('.software-grid')
        .evaluate(
          (grid) =>
            getComputedStyle(grid).gridTemplateColumns.split(' ').length,
        ),
    ).toBe(columns);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const img of await page.locator('img').all())
      await img.evaluate((image) => (image as HTMLImageElement).decode());
    await page
      .locator('main')
      .screenshot({ path: testInfo.outputPath(`downloads-${width}.png`) });
    await page.getByRole('button', { name: 'Compliance', exact: true }).click();
    await expect(page.locator('[data-status]')).toHaveText('No software yet.');
    await page.locator('main').screenshot({
      path: testInfo.outputPath(`downloads-empty-${width}.png`),
    });
    await page.route(`${api}/api/software-categories?*`, (route) =>
      route.fulfill({ status: 403, json: { data: null } }),
    );
    await page.reload();
    await expect(
      page.getByRole('button', { name: 'Retry', exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator('main').screenshot({
      path: testInfo.outputPath(`downloads-error-${width}.png`),
    });
    expect(errors).toEqual([]);
  });
}

test('software navigation from the homepage opens the local route', async ({
  page,
}) => {
  await mockCatalogue(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Navigation menu' }).click();
  await page
    .getByRole('link', { name: 'Software Downloads', exact: true })
    .click();
  await expect(page).toHaveURL(/\/downloads\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Software Downloads',
  );
});
