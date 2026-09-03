import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, access, readdir } from 'node:fs/promises';
import { parse } from 'parse5';

const html = await readFile(
  new URL('../dist/index.html', import.meta.url),
  'utf8',
);
const tree = parse(html);
const attr = (node, key) =>
  node.attrs?.find((item) => item.name === key)?.value;
const all = (node, predicate) => [
  ...(predicate(node) ? [node] : []),
  ...(node.childNodes || []).flatMap((child) => all(child, predicate)),
];
const text = (node) =>
  node.nodeName === '#text'
    ? node.value
    : (node.childNodes || []).map(text).join('');
const nodes = (tag) => all(tree, (node) => node.tagName === tag);
const pageText = text(tree);

test('component colors and CSS breakpoints use the canonical design tokens', async () => {
  const root = new URL('../src/components/', import.meta.url);
  for (const path of await readdir(root, { recursive: true })) {
    if (!path.endsWith('.astro')) continue;
    const source = await readFile(new URL(path, root), 'utf8');
    const css = source.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] || '';
    assert.ok(!/#[\da-f]{3,8}\b/i.test(css), `Raw color in ${path}`);
    assert.ok(
      !/@media[^\{]*\d+(?:px|rem)/.test(css),
      `Duplicated breakpoint in ${path}`,
    );
  }
});

test('only the three approved routes are generated', async () => {
  assert.deepEqual(
    (await readdir(new URL('../dist/', import.meta.url), { recursive: true }))
      .filter((name) => name.endsWith('.html'))
      .sort(),
    ['about-us/index.html', 'index.html', 'mutual-funds/index.html'],
  );
  assert.equal(nodes('main').length, 1);
  assert.equal(nodes('h1').length, 1);
  assert.equal(
    text(nodes('h1')[0]),
    'Tailored Financial Solutions For Your Unique Needs',
  );
  let previous = 0;
  for (const heading of all(tree, (node) =>
    /^h[1-6]$/.test(node.tagName || ''),
  )) {
    const level = Number(heading.tagName[1]);
    assert.ok(
      level <= previous + 1,
      `Heading skipped a level: ${text(heading)}`,
    );
    previous = level;
  }
});

test('preview SEO is explicit and does not invent production URLs', () => {
  assert.equal(text(nodes('title')[0]), 'Home - IndoThai');
  const metadata = nodes('meta');
  const content = (key, value) =>
    attr(
      metadata.find((node) => attr(node, key) === value),
      'content',
    );
  assert.equal(content('name', 'robots'), 'noindex, nofollow');
  assert.ok(content('name', 'description').length > 50);
  assert.equal(content('property', 'og:title'), 'Home - IndoThai');
  assert.equal(content('name', 'twitter:card'), 'summary');
  assert.equal(
    nodes('link').filter((node) => attr(node, 'rel') === 'canonical').length,
    0,
  );
});

test('all services, final statistics, testimonials and regulatory details are rendered', () => {
  assert.equal(
    all(tree, (node) =>
      (attr(node, 'class') || '').split(' ').includes('service-card'),
    ).length,
    9,
  );
  assert.equal(
    all(tree, (node) => attr(node, 'data-slide') !== undefined).length,
    6,
  );
  for (const expected of [
    '10,000+ cr',
    '15,000+',
    '75+',
    'Kopal Mehta',
    'Gourav Jain',
    'Vivek Hingad',
    'Piyush Khasgiwala',
    'Shraddha Surana',
    'Sanjay Kathed',
    'INZ000194938',
    'INH000024842',
    'Smart ODR',
    'Procedure to lodge grievances complaint',
    'Attention Investors',
  ])
    assert.ok(pageText.includes(expected), expected);
});

test('contact starts disabled until its JavaScript submission guard is ready', () => {
  assert.equal(nodes('form').length, 1);
  assert.equal(attr(nodes('form')[0], 'method'), 'post');
  assert.notEqual(attr(nodes('form')[0], 'novalidate'), undefined);
  assert.equal(attr(nodes('form')[0], 'action'), undefined);
  assert.notEqual(attr(nodes('fieldset')[0], 'disabled'), undefined);
  const fields = [...nodes('input'), ...nodes('textarea')];
  assert.equal(fields.length, 4);
  for (const field of fields) {
    assert.ok(
      ['name', 'contact_no', 'email', 'message'].includes(attr(field, 'name')),
    );
    assert.equal(attr(field, 'form'), undefined);
    assert.ok(
      nodes('label').some((label) => attr(label, 'for') === attr(field, 'id')),
    );
  }
  const submit = nodes('button').find((node) => text(node) === 'Submit');
  assert.equal(attr(submit, 'type'), 'submit');
  assert.notEqual(attr(submit, 'disabled'), undefined);
  assert.ok(nodes('p').some((node) => attr(node, 'role') === 'status'));
});

test('images, fonts, styles and browser scripts load from local build output', async () => {
  for (const img of nodes('img')) {
    assert.notEqual(attr(img, 'alt'), undefined);
    assert.ok(Number(attr(img, 'width')) > 0);
    assert.ok(Number(attr(img, 'height')) > 0);
  }
  const urls = [
    ...nodes('img').map((node) => attr(node, 'src')),
    ...nodes('script')
      .map((node) => attr(node, 'src'))
      .filter(Boolean),
    ...nodes('link').map((node) => attr(node, 'href')),
  ];
  for (const url of urls) {
    assert.ok(url.startsWith('/'), `Remote asset: ${url}`);
    await access(new URL(`../dist${url}`, import.meta.url));
  }
  assert.equal(nodes('astro-island').length, 0);
});

test('migrated routes link locally and remaining pages stay on staging', () => {
  const ids = new Set(
    all(tree, (node) => !!attr(node, 'id')).map((node) => attr(node, 'id')),
  );
  for (const anchor of nodes('a')) {
    const href = attr(anchor, 'href');
    assert.ok(href && href !== '#', 'No placeholder links');
    assert.ok(!href.startsWith('javascript:'));
    if (href.startsWith('/'))
      assert.ok(['/', '/about-us/', '/mutual-funds/'].includes(href));
    if (href.startsWith('#')) assert.ok(ids.has(href.slice(1)));
    if (attr(anchor, 'target') === '_blank')
      assert.ok(attr(anchor, 'rel').includes('noopener'));
  }
  assert.ok(nodes('a').some((node) => attr(node, 'href') === '/about-us/'));
  assert.ok(nodes('a').some((node) => attr(node, 'href') === '/mutual-funds/'));
  assert.ok(
    nodes('a').some(
      (node) =>
        attr(node, 'href') ===
        'https://staging-e356-indothaiweb.wpcomstaging.com/careers/',
    ),
  );
});

test('source anomalies are preserved rather than silently corrected', () => {
  assert.ok(pageText.includes('ard and Aadhaar card ready'));
  const badge = nodes('a').find((node) =>
    attr(node, 'aria-label')?.startsWith('Get WINVEST'),
  );
  assert.equal(
    attr(badge, 'href'),
    'https://play.google.com/store/apps/details?id=com.wave.indothai',
  );
  assert.ok(pageText.includes('What our clients says'));
  assert.ok(pageText.includes('Copyrights © 2024'));
});
