import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { parse } from 'parse5';

const html = await readFile(
  new URL('../dist/procedure-of-closing-account/index.html', import.meta.url),
  'utf8',
);
const source = await readFile(
  new URL(
    '../src/components/closing-procedure/ClosingProcedure.astro',
    import.meta.url,
  ),
  'utf8',
);
const tree = parse(html);
const attr = (node, key) =>
  node?.attrs?.find((item) => item.name === key)?.value;
const all = (node, predicate) => [
  ...(predicate(node) ? [node] : []),
  ...(node.childNodes || []).flatMap((child) => all(child, predicate)),
];
const text = (node) =>
  node.nodeName === '#text'
    ? node.value
    : (node.childNodes || []).map(text).join('');
const nodes = (tag) => all(tree, (node) => node.tagName === tag);
const pageText = text(tree).replace(/\s+/g, ' ');

test('closing procedure has unique preview metadata and shared chrome', () => {
  assert.equal(
    text(nodes('title')[0]),
    'Procedure for Closing an Account - IndoThai',
  );
  assert.equal(nodes('h1').length, 1);
  assert.equal(
    text(nodes('h1')[0]).replace(/\s+/g, ' ').trim(),
    'Procedure for Closing an Account',
  );
  const metadata = nodes('meta');
  const content = (key, value) =>
    attr(
      metadata.find((node) => attr(node, key) === value),
      'content',
    );
  assert.equal(content('name', 'robots'), 'noindex, nofollow');
  assert.ok(content('name', 'description').length > 50);
  assert.equal(
    content('property', 'og:title'),
    'Procedure for Closing an Account - IndoThai',
  );
  assert.ok(pageText.includes('INZ000194938'));
});

test('closing procedure uses the exact staging image with an accessible transcript', () => {
  const image = nodes('img').find(
    (node) =>
      attr(node, 'alt') ===
      'Flowchart showing IndoThai’s procedure for closing an account',
  );
  assert.ok(image);
  assert.equal(attr(image, 'width'), '2366');
  assert.equal(attr(image, 'height'), '3612');
  assert.ok(attr(image, 'src').startsWith('/_astro/account-closing.'));
  assert.ok(!attr(image, 'src').startsWith('http'));
  assert.ok(attr(image, 'srcset').includes('1342w'));

  const transcript = all(
    tree,
    (node) => attr(node, 'id') === 'closing-procedure-transcript',
  )[0];
  assert.ok(transcript);
  const steps = (transcript.childNodes || [])
    .find((node) => node.tagName === 'ol')
    .childNodes.filter((node) => node.tagName === 'li');
  assert.equal(steps.length, 8);
  for (const value of [
    'Visit Indothai.co.in',
    'Request for account closer Form',
    'Close Nil holding account',
    'With Holding visit',
    'Enter BO I’d',
    'Enter UCC',
    'Enter register email address',
    'Enter register phone number',
    'Click submit',
    'Error occurs',
  ])
    assert.ok(pageText.includes(value), value);
  assert.equal(nodes('form').length, 0);
  assert.ok(source.includes('account-closing.jpg'));
  assert.ok(source.includes('<Image'));
  assert.ok(!source.includes('<script>'));
});

test('closing procedure uses approved local and external destinations', () => {
  const links = nodes('a');
  for (const href of [
    '/',
    '/close-account/',
    '/procedure-of-closing-account/',
    'mailto:compliance@indothai.co.in',
  ])
    assert.ok(
      links.some((node) => attr(node, 'href') === href),
      href,
    );

  const holdings = links.find(
    (node) => attr(node, 'href') === 'https://ekyc.indothai.co.in:90/',
  );
  assert.equal(attr(holdings, 'target'), '_blank');
  assert.ok(attr(holdings, 'rel').includes('noopener'));

  const current = links.filter((node) => attr(node, 'aria-current') === 'page');
  assert.equal(current.length, 1);
  assert.equal(attr(current[0], 'href'), '/procedure-of-closing-account/');
});
