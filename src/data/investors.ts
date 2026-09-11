import { PUBLIC_STRAPI_URL } from 'astro:env/client';

interface OrderedInvestorRecord {
  documentId: string;
  title: string;
  order?: number | null;
  createdAt: string;
}

export interface InvestorOverview extends OrderedInvestorRecord {
  description: string;
}

export interface ShareholderCategory {
  documentId: string;
  name: string;
  slug?: string | null;
}

export interface InvestorFile {
  name?: string | null;
  ext?: string | null;
  url?: string | null;
  size?: number | null;
}

export interface ShareholderRelation {
  documentId: string;
  title: string;
  original_created_at?: string | null;
  file?: InvestorFile | null;
  shareholder_relation_category?: { documentId?: string } | null;
}

export interface FinancialReport {
  documentId: string;
  year: number;
  report_type: 'Quarter' | 'Full Year';
  quarter: number | null;
  file?: InvestorFile | null;
}

export interface Regulation46Disclosure extends OrderedInvestorRecord {
  link: string;
}

export interface ClientRelation extends OrderedInvestorRecord {
  file?: InvestorFile | null;
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
  sort: string[],
  populate: string[] = [],
  query: Record<string, string> = {},
): Promise<T[]> {
  const records: T[] = [];
  const signal = AbortSignal.timeout(20_000);

  for (let page = 1; ; page++) {
    const url = new URL(`${investorsApi}/${collection}`);
    url.searchParams.set('pagination[page]', String(page));
    url.searchParams.set('pagination[pageSize]', '100');
    sort.forEach((value, index) =>
      url.searchParams.set(`sort[${index}]`, value),
    );
    for (const [key, value] of Object.entries(query))
      url.searchParams.set(key, value);
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

function validManagedOrder(record: OrderedInvestorRecord) {
  return (
    (record.order == null || Number.isInteger(record.order)) &&
    typeof record.createdAt === 'string' &&
    Number.isFinite(Date.parse(record.createdAt))
  );
}

function compareManagedOrder(
  a: OrderedInvestorRecord,
  b: OrderedInvestorRecord,
) {
  return (
    (a.order ?? 0) - (b.order ?? 0) ||
    Date.parse(b.createdAt) - Date.parse(a.createdAt) ||
    a.title.localeCompare(b.title, 'en-IN') ||
    a.documentId.localeCompare(b.documentId, 'en-IN')
  );
}

export async function getInvestorOverviews(): Promise<InvestorOverview[]> {
  const records = await getAll<InvestorOverview>('overviews', [
    'order:asc',
    'createdAt:desc',
  ]);
  if (
    records.some(
      (item) =>
        typeof item?.documentId !== 'string' ||
        !item.documentId ||
        typeof item.title !== 'string' ||
        !item.title.trim() ||
        typeof item.description !== 'string' ||
        !validManagedOrder(item),
    )
  )
    throw new Error('The investor service returned an unexpected response.');
  return records.sort(compareManagedOrder);
}

export async function getShareholderCategories(): Promise<
  ShareholderCategory[]
> {
  const records = await getAll<ShareholderCategory>(
    'shareholder-relation-categories',
    ['name:asc'],
  );
  if (
    records.some(
      (item) =>
        typeof item?.documentId !== 'string' ||
        !item.documentId ||
        typeof item.name !== 'string' ||
        !item.name.trim() ||
        (item.slug != null &&
          (typeof item.slug !== 'string' || !item.slug.trim())),
    )
  )
    throw new Error('The investor service returned an unexpected response.');
  return records.sort((a, b) => a.name.localeCompare(b.name, 'en-IN'));
}

export async function getShareholderRelations(
  categoryDocumentId: string,
): Promise<ShareholderRelation[]> {
  if (!categoryDocumentId)
    throw new Error('The investor service returned an unexpected response.');
  const records = await getAll<ShareholderRelation>(
    'shareholder-relations',
    ['original_created_at:desc'],
    ['file', 'shareholder_relation_category'],
    {
      'filters[shareholder_relation_category][documentId][$eq]':
        categoryDocumentId,
    },
  );
  if (
    records.some(
      (item) =>
        typeof item?.documentId !== 'string' ||
        !item.documentId ||
        typeof item.title !== 'string' ||
        !item.title.trim() ||
        (item.file != null && typeof item.file !== 'object') ||
        item.shareholder_relation_category?.documentId !== categoryDocumentId,
    )
  )
    throw new Error('The investor service returned an unexpected response.');
  return records.sort((a, b) => {
    const aDate =
      typeof a.original_created_at === 'string'
        ? Date.parse(a.original_created_at)
        : NaN;
    const bDate =
      typeof b.original_created_at === 'string'
        ? Date.parse(b.original_created_at)
        : NaN;
    if (Number.isFinite(aDate) && Number.isFinite(bDate) && aDate !== bDate)
      return bDate - aDate;
    if (Number.isFinite(aDate) !== Number.isFinite(bDate))
      return Number.isFinite(aDate) ? -1 : 1;
    return (
      a.title.localeCompare(b.title, 'en-IN') ||
      a.documentId.localeCompare(b.documentId, 'en-IN')
    );
  });
}

export async function getFinancialReports(): Promise<FinancialReport[]> {
  const records = await getAll<FinancialReport>(
    'financial-reports',
    ['year:asc'],
    ['file'],
  );
  if (
    records.some(
      (item) =>
        typeof item?.documentId !== 'string' ||
        !item.documentId ||
        !Number.isInteger(item.year) ||
        !['Quarter', 'Full Year'].includes(item.report_type) ||
        (item.report_type === 'Quarter' &&
          (item.quarter === null ||
            !Number.isInteger(item.quarter) ||
            item.quarter < 1 ||
            item.quarter > 4)) ||
        (item.report_type === 'Full Year' && item.quarter !== null) ||
        (item.file != null && typeof item.file !== 'object'),
    )
  )
    throw new Error('The investor service returned an unexpected response.');

  return records.sort(
    (a, b) =>
      b.year - a.year ||
      Number(b.report_type === 'Full Year') -
        Number(a.report_type === 'Full Year') ||
      (b.quarter ?? 0) - (a.quarter ?? 0),
  );
}

export async function getRegulation46Disclosures(): Promise<
  Regulation46Disclosure[]
> {
  const records = await getAll<Regulation46Disclosure>('disclosure-2015s', [
    'order:asc',
    'createdAt:desc',
  ]);
  if (
    records.some(
      (item) =>
        typeof item?.documentId !== 'string' ||
        !item.documentId ||
        typeof item.title !== 'string' ||
        !item.title.trim() ||
        typeof item.link !== 'string' ||
        !item.link.trim() ||
        !validManagedOrder(item),
    )
  )
    throw new Error('The investor service returned an unexpected response.');
  return records.sort(compareManagedOrder);
}

export async function getClientRelations(): Promise<ClientRelation[]> {
  const records = await getAll<ClientRelation>(
    'client-relations',
    ['order:asc', 'createdAt:desc'],
    ['file'],
  );
  if (
    records.some(
      (item) =>
        typeof item?.documentId !== 'string' ||
        !item.documentId ||
        typeof item.title !== 'string' ||
        !item.title.trim() ||
        (item.file != null && typeof item.file !== 'object') ||
        !validManagedOrder(item),
    )
  )
    throw new Error('The investor service returned an unexpected response.');
  return records.sort(compareManagedOrder);
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

export function publicFileUrl(file: InvestorFile | null | undefined) {
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

export function publicInvestorLink(value: string) {
  const link = value.trim();
  if (!/^https?:\/\//i.test(link) && !link.startsWith('/')) return '';
  try {
    const base = investorsApi.replace(/\/api$/, '');
    const url = new URL(link, `${base}/`);
    return ['http:', 'https:'].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : '';
  } catch {
    return '';
  }
}

export function investorFileName(file: InvestorFile | null | undefined) {
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

export function investorFileSize(file: InvestorFile | null | undefined) {
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
