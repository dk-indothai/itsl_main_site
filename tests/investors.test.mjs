import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { parse } from 'parse5';

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

async function page(path) {
  const html = await readFile(
    new URL(`../dist/${path}`, import.meta.url),
    'utf8',
  );
  const tree = parse(html);
  return {
    html,
    tree,
    nodes: (tag) => all(tree, (node) => node.tagName === tag),
  };
}

test('investor overview is a static, noindex CMS shell', async () => {
  const { tree, nodes } = await page('investors/overview/index.html');
  assert.equal(text(nodes('title')[0]), 'Investor Overview - IndoThai');
  assert.equal(nodes('h1').length, 1);
  assert.equal(text(nodes('h1')[0]), 'Investor Overview');
  assert.equal(
    attr(
      nodes('meta').find((node) => attr(node, 'name') === 'robots'),
      'content',
    ),
    'noindex, nofollow',
  );
  assert.equal(
    all(tree, (node) => attr(node, 'data-overview-list') !== undefined).length,
    1,
  );
  assert.ok(
    text(tree).includes('Enable JavaScript to load the investor overview.'),
  );
  assert.ok(
    nodes('a').some(
      (node) =>
        attr(node, 'href') === '/investors/overview/' &&
        attr(node, 'aria-current') === 'page',
    ),
  );
});

test('shareholder relation is a static, noindex CMS shell', async () => {
  const { tree, nodes } = await page(
    'investors/shareholder-relation/index.html',
  );
  assert.equal(text(nodes('title')[0]), 'Shareholder Relation - IndoThai');
  assert.equal(nodes('h1').length, 1);
  assert.equal(text(nodes('h1')[0]), 'Shareholder Relation');
  const select = nodes('select').find(
    (node) => attr(node, 'data-category') !== undefined,
  );
  assert.ok(select);
  assert.notEqual(attr(select, 'disabled'), undefined);
  assert.ok(text(tree).includes('All Categories'));
  assert.ok(
    text(tree).includes('Enable JavaScript to load shareholder documents.'),
  );
  assert.ok(
    nodes('a').some(
      (node) =>
        attr(node, 'href') === '/investors/shareholder-relation/' &&
        attr(node, 'aria-current') === 'page',
    ),
  );
});

test('financial reports is a static, noindex CMS shell', async () => {
  const { tree, nodes } = await page('investors/financial-reports/index.html');
  assert.equal(text(nodes('title')[0]), 'Financial Reports - IndoThai');
  assert.equal(nodes('h1').length, 1);
  assert.equal(text(nodes('h1')[0]), 'Financial Reports');
  assert.equal(
    all(tree, (node) => attr(node, 'data-report-list') !== undefined).length,
    1,
  );
  assert.ok(
    text(tree).includes('Enable JavaScript to load financial reports.'),
  );
  assert.ok(
    nodes('a').some(
      (node) =>
        attr(node, 'href') === '/investors/financial-reports/' &&
        attr(node, 'aria-current') === 'page',
    ),
  );
});

test('Regulation 46 disclosures is a static, noindex CMS shell', async () => {
  const { tree, nodes } = await page(
    'investors/disclosures-under-regulation-46/index.html',
  );
  assert.equal(text(nodes('title')[0]), 'Regulation 46 Disclosures - IndoThai');
  assert.equal(nodes('h1').length, 1);
  assert.equal(
    text(nodes('h1')[0]),
    'Disclosures under Regulation 46 of SEBI (LODR) Regulations, 2015',
  );
  assert.equal(
    all(tree, (node) => attr(node, 'data-disclosure-list') !== undefined)
      .length,
    1,
  );
  assert.ok(
    text(tree).includes('Enable JavaScript to load Regulation 46 disclosures.'),
  );
  assert.ok(
    nodes('a').some(
      (node) =>
        attr(node, 'href') === '/investors/disclosures-under-regulation-46/' &&
        attr(node, 'aria-current') === 'page',
    ),
  );
});

test('financial report years use native dropdown markup', async () => {
  const source = await readFile(
    new URL(
      '../src/components/investors/FinancialReports.astro',
      import.meta.url,
    ),
    'utf8',
  );
  assert.ok(source.includes('<details class="year-group">'));
  assert.ok(source.includes('<summary>'));
  assert.ok(source.includes('group.element.open = index === 0'));
  for (const period of [
    '1st Quarter',
    '2nd Quarter',
    '3rd Quarter',
    '4th Quarter',
    'Full Year',
  ])
    assert.ok(source.includes(period));
  assert.ok(!source.includes('data-report-year'));
  assert.ok(!source.includes('data-file-name'));
  assert.ok(!source.includes('data-file-size'));
  assert.ok(!source.includes('Not available'));
  assert.ok(!source.includes('Download unavailable'));
});

test('investor reads use only the five intended public Strapi collections', async () => {
  const source = await readFile(
    new URL('../src/data/investors.ts', import.meta.url),
    'utf8',
  );
  for (const collection of [
    "'overviews'",
    "'shareholder-relation-categories'",
    "'shareholder-relations'",
    "'financial-reports'",
    "'disclosure-2015s'",
  ])
    assert.ok(source.includes(collection));
  assert.ok(source.includes("['file', 'shareholder_relation_category']"));
  assert.ok(source.includes("credentials: 'omit'"));
  assert.ok(!source.includes('Authorization'));
  assert.ok(!source.includes('POST'));
});

test('investor overview entries use native dropdown markup', async () => {
  const source = await readFile(
    new URL('../src/components/investors/Overview.astro', import.meta.url),
    'utf8',
  );
  assert.ok(source.includes('<details class="overview-card">'));
  assert.ok(source.includes('<summary>'));
  assert.ok(!source.includes("addEventListener('toggle'"));
});
