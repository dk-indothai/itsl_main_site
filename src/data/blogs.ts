import { PUBLIC_STRAPI_URL } from 'astro:env/client';

export interface BlogMedia {
  url?: string | null;
  mime?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface BlogPost {
  documentId: string;
  title: string;
  content: string;
  publish_date: string;
  banner?: BlogMedia | null;
}

export const blogApi = (() => {
  try {
    const url = new URL(PUBLIC_STRAPI_URL ?? '');
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      return '';
    return `${url.href.replace(/\/+$/, '')}/api`;
  } catch {
    return '';
  }
})();

const fields = new URLSearchParams();
['title', 'content', 'publish_date'].forEach((field, index) =>
  fields.set(`fields[${index}]`, field),
);
fields.set('populate[0]', 'banner');

function validDate(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
  );
}

function checkPost(post: BlogPost): BlogPost {
  if (
    !post ||
    typeof post.documentId !== 'string' ||
    !post.documentId.trim() ||
    typeof post.title !== 'string' ||
    !post.title.trim() ||
    typeof post.content !== 'string' ||
    typeof post.publish_date !== 'string' ||
    !validDate(post.publish_date) ||
    (post.banner != null && typeof post.banner !== 'object')
  )
    throw new Error('The blog service returned an unexpected response.');
  return post;
}

async function read(url: URL, signal: AbortSignal) {
  const response = await fetch(url, {
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    redirect: 'error',
    cache: 'no-store',
    signal,
  });
  if (response.status === 404) return null;
  if (response.status === 401 || response.status === 403)
    throw new Error('Blog posts are not publicly available yet.');
  if (response.status === 429)
    throw new Error('Too many requests. Please wait before trying again.');
  if (!response.ok)
    throw new Error('Blog posts are unavailable. Please try again.');
  return response.json();
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];
  const signal = AbortSignal.timeout(20_000);

  for (let page = 1; ; page++) {
    const query = new URLSearchParams(fields);
    query.set('sort[0]', 'publish_date:desc');
    query.set('sort[1]', 'title:asc');
    query.set('pagination[page]', String(page));
    query.set('pagination[pageSize]', '100');
    const result = await read(new URL(`${blogApi}/blogs?${query}`), signal);
    const pagination = result?.meta?.pagination;
    if (
      !Array.isArray(result?.data) ||
      pagination?.page !== page ||
      !Number.isInteger(pagination?.pageCount) ||
      pagination.pageCount < 0 ||
      (pagination.pageCount === 0 && (page !== 1 || result.data.length)) ||
      (pagination.pageCount > 0 &&
        (pagination.pageCount < page || !result.data.length))
    )
      throw new Error('The blog service returned an unexpected response.');

    posts.push(...result.data.map(checkPost));
    if (page >= pagination.pageCount) break;
  }

  return posts.sort(
    (a, b) =>
      b.publish_date.localeCompare(a.publish_date) ||
      a.title.localeCompare(b.title, 'en-IN'),
  );
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id)) return null;
  const result = await read(
    new URL(`${blogApi}/blogs/${encodeURIComponent(id)}?${fields}`),
    AbortSignal.timeout(20_000),
  );
  if (result === null) return null;
  const post = checkPost(result?.data);
  if (post.documentId !== id)
    throw new Error('The blog service returned an unexpected response.');
  return post;
}

export function blogImage(media?: BlogMedia | null) {
  if (!media?.url || (media.mime && !media.mime.startsWith('image/')))
    return null;
  try {
    const url = new URL(media.url, blogApi);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password
    )
      return null;
    return {
      url: url.href,
      alt: media.alternativeText?.trim() ?? '',
      width:
        Number.isInteger(media.width) && Number(media.width) > 0
          ? Number(media.width)
          : null,
      height:
        Number.isInteger(media.height) && Number(media.height) > 0
          ? Number(media.height)
          : null,
    };
  } catch {
    return null;
  }
}

export function formatBlogDate(value: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

export function blogError(error: unknown): string {
  if (error instanceof DOMException && error.name === 'TimeoutError')
    return 'Loading took too long. Please try again.';
  if (error instanceof TypeError || error instanceof SyntaxError)
    return 'Could not connect to the blog service. Please try again.';
  return error instanceof Error
    ? error.message
    : 'Blog posts are unavailable. Please try again.';
}
