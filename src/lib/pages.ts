// The complete list of pages on the site, in one place.
// sitemap.xml, the HTML sitemap and llms.txt are all generated from this list, so they cannot drift apart.
import { AREAS, BLOG, SITE } from '@data/site';
import { getPosts, postMdPath, postPath } from './blog';
import { areaOf, getNews, getWorks, workMdPath, workPath, type Work } from './works';

export interface PageEntry {
  path: string;
  title: string;
  /** Last change (calendar day). */
  lastmod: Date;
  /** Markdown twin, if the page has one. */
  md?: string;
  group: 'centre' | 'blog' | (typeof AREAS)[number]['id'];
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
  work?: Work;
}

const latest = (dates: Date[], fallback: Date): Date =>
  dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : fallback;

export async function getPages(): Promise<PageEntry[]> {
  const works = await getWorks();
  const news = await getNews();
  const posts = await getPosts();
  const workDate = (w: Work) => w.data.updated ?? w.data.date;
  const launch = new Date(Date.UTC(SITE.founded, 10, 10));
  const postDate = (p: (typeof posts)[number]) => p.data.updated ?? p.data.date;
  const newest = latest([...works.map(workDate), ...news.map((n) => n.data.date), ...posts.map(postDate)], launch);

  const pages: PageEntry[] = [
    { path: '/', title: SITE.name, lastmod: newest, md: '/index.md', group: 'centre', priority: 1, changefreq: 'weekly' },
  ];

  for (const area of AREAS) {
    const list = works.filter((w) => areaOf(w) === area.id);
    pages.push({
      path: `/${area.id}/`,
      title: `${area.name}（${area.nameEn}）`,
      lastmod: latest(list.map(workDate), launch),
      md: `/${area.id}.md`,
      group: area.id,
      priority: 0.9,
      changefreq: 'weekly',
    });
    for (const w of list) {
      pages.push({
        path: workPath(w),
        title: w.data.title,
        lastmod: workDate(w),
        md: workMdPath(w),
        group: area.id,
        priority: 0.8,
        changefreq: 'monthly',
        work: w,
      });
    }
  }

  pages.push(
    { path: '/collection/', title: '全部館藏', lastmod: newest, group: 'centre', priority: 0.7, changefreq: 'weekly' },
    {
      path: '/news/',
      title: '最新動態',
      lastmod: latest(news.map((n) => n.data.date), launch),
      md: '/news.md',
      group: 'centre',
      priority: 0.7,
      changefreq: 'weekly',
    },
    // 文章: listed only once there is something to read (the empty page is noindex).
    ...(posts.length
      ? [
          {
            path: BLOG.path,
            title: BLOG.name,
            lastmod: latest(posts.map(postDate), launch),
            md: '/blog.md',
            group: 'centre' as const,
            priority: 0.8,
            changefreq: 'weekly' as const,
          },
          ...posts.map((p) => ({
            path: postPath(p),
            title: p.data.title,
            lastmod: postDate(p),
            md: postMdPath(p),
            group: 'blog' as const,
            priority: 0.7,
            changefreq: 'monthly' as const,
          })),
        ]
      : []),
    { path: '/about/', title: '關於我們', lastmod: launch, md: '/about.md', group: 'centre', priority: 0.6, changefreq: 'monthly' },
    { path: '/sitemap/', title: '網站地圖', lastmod: newest, group: 'centre', priority: 0.3, changefreq: 'weekly' },
  );

  return pages;
}

export const absUrl = (path: string): string => new URL(path, SITE.url).href;
