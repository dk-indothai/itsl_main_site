import { SITE_INDEXING } from 'astro:env/server';
import type { APIRoute } from 'astro';

import { site } from '../data/site';

export const GET: APIRoute = () => {
  const sitemap = SITE_INDEXING
    ? `\nSitemap: ${site.origin}/sitemap.xml\n`
    : '\n';

  return new Response(`User-agent: *\nAllow: /\n${sitemap}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
