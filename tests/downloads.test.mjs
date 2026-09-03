import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { parse } from 'parse5';

const html = await readFile(
  new URL('../dist/downloads/index.html', import.meta.url),
  'utf8',
);
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
const tree = parse(html);
const nodes = (tag) => all(tree, (node) => node.tagName === tag);

test('downloads has unique preview metadata, shared chrome and local navigation', () => {
  assert.equal(nodes('h1').length, 1);
  assert.equal(text(nodes('h1')[0]), 'Software Downloads');
  assert.equal(text(nodes('title')[0]), 'Software Downloads - IndoThai');
  const meta = (key) =>
    attr(
      nodes('meta').find(
        (node) => attr(node, 'name') === key || attr(node, 'property') === key,
      ),
      'content',
    );
  assert.equal(meta('robots'), 'noindex, nofollow');
  assert.equal(meta('og:title'), 'Software Downloads - IndoThai');
  assert.equal(meta('twitter:title'), meta('og:title'));
  assert.ok(meta('description').length > 50);
  assert.equal(
    nodes('link').some((node) => attr(node, 'rel') === 'canonical'),
    false,
  );
  assert.equal(nodes('header').length, 1);
  assert.equal(nodes('footer').length, 1);
  assert.ok(text(tree).includes('INZ000194938'));
  const active = nodes('a').filter(
    (node) => attr(node, 'aria-current') === 'page',
  );
  assert.equal(active.length, 1);
  assert.equal(attr(active[0], 'href'), '/downloads/');
});

test('initial downloads HTML is an honest disabled fallback, not CMS content', async () => {
  const list = nodes('ul').find((node) => attr(node, 'id') === 'software-list');
  assert.equal(text(list), '');
  assert.equal(list.childNodes.length, 0);
  const allButton = nodes('button').find(
    (node) => text(node) === 'All Categories',
  );
  assert.notEqual(attr(allButton, 'disabled'), undefined);
  assert.equal(attr(allButton, 'aria-pressed'), 'true');
  const status = nodes('p').find((node) => attr(node, 'role') === 'status');
  assert.match(text(status), /Enable JavaScript|not configured yet/);
  for (const scheme of ['tel:', 'mailto:'])
    assert.ok(
      nodes('a').some((node) => attr(node, 'href')?.startsWith(scheme)),
    );
  assert.equal(nodes('astro-island').length, 0);
  const source = await readFile(
    new URL('../src/components/downloads/Downloads.astro', import.meta.url),
    'utf8',
  );
  const frontmatter = source.split('---')[1];
  assert.ok(!frontmatter.includes('fetch('), 'No build-time Strapi requests');
  assert.ok(
    !source.includes('innerHTML') && !source.includes('set:html'),
    'CMS text must not become HTML',
  );
});
