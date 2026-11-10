import { getCollection, type CollectionEntry } from 'astro:content';
import { AREA_IDS, SITE, areaById, type AreaId } from '@data/site';

export type Work = CollectionEntry<'works'>;
export type NewsItem = CollectionEntry<'news'>;

/** `films/first-person` → `films` */
export const areaOf = (w: Work): AreaId => {
  const id = w.id.split('/')[0] as AreaId;
  if (!AREA_IDS.includes(id)) throw new Error(`[works] ${w.id}: unknown area folder "${id}"`);
  return id;
};

/** `films/first-person` → `first-person` */
export const slugOf = (w: Work): string => w.id.split('/').slice(1).join('/');

export const workPath = (w: Work): string => `/${areaOf(w)}/${slugOf(w)}/`;
export const workUrl = (w: Work): string => new URL(workPath(w), SITE.url).href;
export const workMdPath = (w: Work): string => `/${areaOf(w)}/${slugOf(w)}.md`;

const newestFirst = (a: { data: { date: Date } }, b: { data: { date: Date } }) =>
  b.data.date.getTime() - a.data.date.getTime();

/** Every published work, newest first. Drafts never leave this function. */
export async function getWorks(): Promise<Work[]> {
  const all = await getCollection('works', (w) => !w.data.draft);
  return all.sort(newestFirst);
}

export async function getWorksByArea(area: AreaId): Promise<Work[]> {
  return (await getWorks()).filter((w) => areaOf(w) === area);
}

/** Works marked `featured`, in the order of that number. */
export async function getFeatured(): Promise<Work[]> {
  return (await getWorks())
    .filter((w) => w.data.featured !== undefined)
    .sort((a, b) => a.data.featured! - b.data.featured!);
}

export async function getNews(): Promise<NewsItem[]> {
  const all = await getCollection('news', (n) => !n.data.draft);
  return all.sort(newestFirst);
}

export const newsPath = (n: NewsItem): string => `/news/#${n.id}`;

/** 2026-11-10 → 2026 年 11 月 10 日 (dates are calendar days; read them as UTC so they never shift). */
export function formatDate(d: Date): string {
  return `${d.getUTCFullYear()} 年 ${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日`;
}

export const isoDay = (d: Date): string => d.toISOString().slice(0, 10);

export const areaLabel = (w: Work): string => areaById(areaOf(w)).name;
