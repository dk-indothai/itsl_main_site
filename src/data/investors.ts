import { PUBLIC_STRAPI_URL } from 'astro:env/client';

export interface InvestorOverview {
  documentId: string;
  title: string;
  description: string;
}

export interface ShareholderCategory {
  documentId: string;
  name: string;
}

export interface ShareholderFile {
  name?: string | null;
  ext?: string | null;
  url?: string | null;
  size?: number | null;
}

export interface ShareholderRelation {
  documentId: string;
  title: string;
  file?: ShareholderFile | null;
  shareholder_relation_category?: { documentId?: string } | null;
}

export const investorsApi = (() => {
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

interface ApiPage<T> {
  data: T[];
  meta: { pagination: { page: number; pageCount: number } };
}

async function getAll<T>(
  collection: string,
  sortField: string,
  populate: string[] = [],
): Promise<T[]> {
  const records: T[] = [];
  const signal = AbortSignal.timeout(20_000);

  for (let page = 1; ; page++) {
    const url = new URL(`${investorsApi}/${collection}`);
    url.searchParams.set('pagination[page]', String(page));
    url.searchParams.set('pagination[pageSize]', '100');
    url.searchParams.set('sort[0]', `${sortField}:asc`);
    populate.forEach((field, index) =>
      url.searchParams.set(`populate[${index}]`, field),
    );

    const response = await fetch(url, {
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      redirect: 'error',
      cache: 'no-store',
      signal,
    });
    if (response.status === 401 || response.status === 403)
      throw new Error('Investor information is not publicly available yet.');
    if (response.status === 429)
      throw new Error('Too many requests. Please wait before trying again.');
    if (!response.ok)
      throw new Error('Investor information is unavailable. Please try again.');

    const result = (await response.json()) as ApiPage<T>;
    const pagination = result?.meta?.pagination;
    if (
      !Array.isArray(result?.data) ||
      pagination?.page !== page ||
      !Number.isInteger(pagination?.pageCount) ||
      pagination.pageCount < 0 ||
      (pagination.pageCount === 0 && (page !== 1 || result.data.length > 0)) ||
      (pagination.pageCount > 0 &&
        (pagination.pageCount < page || result.data.length === 0))
    )
      throw new Error('The investor service returned an unexpected response.');

    records.push(...result.data);
    if (page >= pagination.pageCount) break;
    if (!result.data.length)
      throw new Error('The investor service returned an incomplete list.');
  }
  return records;
}

export async function getInvestorOverviews(): Promise<InvestorOverview[]> {
  const records = await getAll<InvestorOverview>('overviews', 'title');
  if (
    records.some(
      (item) =>
        typeof item?.documentId !== 'string' ||
        !item.documentId ||
        typeof item.title !== 'string' ||
        !item.title.trim() ||
        typeof item.description !== 'string',
    )
  )
    throw new Error('The investor service returned an unexpected response.');
  return records.sort((a, b) => a.title.localeCompare(b.title, 'en-IN'));
}

export async function getShareholderCategories(): Promise<
  ShareholderCategory[]
> {
  const records = await getAll<ShareholderCategory>(
    'shareholder-relation-categories',
    'name',
  );
  if (
    records.some(
      (item) =>
        typeof item?.documentId !== 'string' ||
        !item.documentId ||
        typeof item.name !== 'string' ||
        !item.name.trim(),
    )
  )
    throw new Error('The investor service returned an unexpected response.');
  return records.sort((a, b) => a.name.localeCompare(b.name, 'en-IN'));
}

export async function getShareholderRelations(): Promise<
  ShareholderRelation[]
> {
  const records = await getAll<ShareholderRelation>(
    'shareholder-relations',
    'title',
    ['file', 'shareholder_relation_category'],
  );
  if (
    records.some(
      (item) =>
        typeof item?.documentId !== 'string' ||
        !item.documentId ||
        typeof item.title !== 'string' ||
        !item.title.trim() ||
        (item.file != null && typeof item.file !== 'object') ||
        (item.shareholder_relation_category != null &&
          typeof item.shareholder_relation_category.documentId !== 'string'),
    )
  )
    throw new Error('The investor service returned an unexpected response.');
  return records.sort((a, b) => a.title.localeCompare(b.title, 'en-IN'));
}

export function investorError(error: unknown): string {
  if (error instanceof DOMException && error.name === 'TimeoutError')
    return 'Loading took too long. Please try again.';
  if (error instanceof TypeError || error instanceof SyntaxError)
    return 'Could not connect to the investor service. Please try again.';
  return error instanceof Error
    ? error.message
    : 'Investor information is unavailable. Please try again.';
}

export function publicFileUrl(file: ShareholderFile | null | undefined) {
  if (typeof file?.url !== 'string' || !file.url.trim()) return '';
  try {
    const base = investorsApi.replace(/\/api$/, '');
    const url = new URL(file.url, `${base}/`);
    return ['http:', 'https:'].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : '';
  } catch {
    return '';
  }
}

export function shareholderFileName(file: ShareholderFile | null | undefined) {
  const name = typeof file?.name === 'string' ? file.name.trim() : '';
  const extension =
    typeof file?.ext === 'string' && /^\.[a-z\d.]+$/i.test(file.ext)
      ? file.ext
      : '';
  return name &&
    extension &&
    !name.toLowerCase().endsWith(extension.toLowerCase())
    ? `${name}${extension}`
    : name;
}

export function shareholderFileSize(file: ShareholderFile | null | undefined) {
  if (
    typeof file?.size !== 'number' ||
    !Number.isFinite(file.size) ||
    file.size < 0
  )
    return '';
  const megabytes = file.size >= 1000;
  const value = megabytes ? file.size / 1000 : file.size;
  return `${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ${megabytes ? 'MB' : 'KB'}`;
}
