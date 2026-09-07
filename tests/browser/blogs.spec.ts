import { expect, test, type Page } from '@playwright/test';

const api = 'http://strapi.test/api';
const posts = [
  {
    documentId: 'older-post',
    title: 'Market foundations',
    content: 'A practical guide to **long-term investing** and risk.',
    publish_date: '2025-01-10',
    banner: null,
  },
  {
    documentId: 'latest-post',
    title: 'IndoThai market update',
    content:
      '## Market view\n\nFresh perspective for investors.\n\n| Topic | View |\n| --- | --- |\n| Risk | Balanced |',
    publish_date: '2026-09-05',
    banner: {
      url: '/uploads/market-update.jpg',
      mime: 'image/jpeg',
      alternativeText: 'IndoThai market update illustration',
      width: 1200,
      height: 600,
    },
  },
];

async function mockBlogs(page: Page, records = posts) {
  await page.route(`${api}/blogs?**`, (route) =>
    route.fulfill({
      json: {
        data: records,
        meta: {
          pagination: {
            page: 1,
            pageSize: 100,
            pageCount: records.length ? 1 : 0,
            total: records.length,
          },
        },
      },
    }),
  );
  await page.route(`${api}/blogs/*?**`, (route) => {
    const id = new URL(route.request().url()).pathname.split('/').at(-1);
    const post = records.find((entry) => entry.documentId === id);
    return route.fulfill({
      status: post ? 200 : 404,
      json: { data: post ?? null },
    });
  });
  await page.route('http://strapi.test/uploads/market-update.jpg', (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"></svg>',
    }),
  );
}

test('lists newest posts first with banners, excerpts, dates and local links', async ({
  page,
}) => {
  await mockBlogs(page);
  await page.goto('/blog/');
  await expect(page.locator('.post-card h2')).toHaveText([
    'IndoThai market update',
    'Market foundations',
  ]);
  await expect(page.locator('.post-card time')).toHaveText([
    '5 September 2026',
    '10 January 2025',
  ]);
  await expect(
    page.locator('.post-card').first().locator('img'),
  ).toHaveAttribute('alt', 'IndoThai market update illustration');
  await expect(
    page.locator('.post-card').nth(1).locator('[data-banner-link]'),
  ).toBeHidden();
  await page
    .getByRole('link', { name: 'IndoThai market update', exact: true })
    .click();
  await expect(page).toHaveURL(/\/blog\/post\/\?id=latest-post$/);
});

test('renders one post with safe Markdown, tables and safe links', async ({
  page,
}) => {
  const unsafe = {
    ...posts[1],
    content:
      '# Heading\n\n[Safe](https://example.test/) [Bad](javascript:alert(1))\n\n| Topic | View |\n| --- | --- |\n| Risk | Balanced |\n\n<img src="javascript:alert(1)"><script>alert(1)</script><form><input></form>',
  };
  await mockBlogs(page, [unsafe]);
  await page.goto('/blog/post/?id=latest-post');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    unsafe.title,
  );
  await expect(page).toHaveTitle(`${unsafe.title} - IndoThai`);
  await expect(page.locator('.post-body table')).toHaveCount(1);
  await expect(page.locator('.post-body h2')).toHaveText('Heading');
  await expect(page.locator('.post-body script, .post-body form')).toHaveCount(
    0,
  );
  await expect(page.getByRole('link', { name: 'Safe' })).toHaveAttribute(
    'href',
    'https://example.test/',
  );
  await expect(page.getByText('Bad')).not.toHaveAttribute('href');
  await expect(page.locator('.post-body img')).toHaveCount(0);
});

test('handles empty, unavailable and retry states honestly', async ({
  page,
}) => {
  await mockBlogs(page, []);
  await page.goto('/blog/');
  await expect(page.locator('[data-blog-status]')).toHaveText(
    'No blog posts yet.',
  );
  await expect(page.locator('.post-card')).toHaveCount(0);

  await page.goto('/blog/post/?id=missing');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Blog post unavailable',
  );
  await expect(page.locator('[data-post-status]')).toContainText(
    'could not be found',
  );

  await page.route(`${api}/blogs?**`, (route) =>
    route.fulfill({ status: 500, json: { error: 'hidden' } }),
  );
  await page.goto('/blog/');
  await expect(page.locator('[data-blog-status]')).toContainText('unavailable');
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
});

test('follows pagination before sorting the complete blog list', async ({
  page,
}) => {
  await page.route(`${api}/blogs?**`, (route) => {
    const pageNumber = Number(
      new URL(route.request().url()).searchParams.get('pagination[page]'),
    );
    return route.fulfill({
      json: {
        data: pageNumber === 1 ? [posts[0]] : [posts[1]],
        meta: {
          pagination: { page: pageNumber, pageCount: 2, pageSize: 1, total: 2 },
        },
      },
    });
  });
  await page.goto('/blog/');
  await expect(page.locator('.post-card h2')).toHaveText([
    'IndoThai market update',
    'Market foundations',
  ]);
});

for (const width of [1280, 768, 390, 320]) {
  test(`blog has no overflow or missing assets at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await mockBlogs(page);
    for (const route of ['/blog/', '/blog/post/?id=latest-post']) {
      await page.goto(route);
      await expect(
        page.locator('[data-post-list], [data-post-content]'),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      expect(
        await page.locator('img[src]').evaluateAll((images) =>
          images.every((image) => {
            const picture = image as HTMLImageElement;
            return (
              picture.complete &&
              picture.naturalWidth > 0 &&
              picture.getBoundingClientRect().right <= window.innerWidth + 1
            );
          }),
        ),
      ).toBe(true);
    }
  });
}
