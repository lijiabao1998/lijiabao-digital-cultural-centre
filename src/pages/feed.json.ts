// /feed.json — JSON Feed 1.1 of works and news, newest first.
import type { APIRoute } from 'astro';
import { SITE, areaById } from '@data/site';
import { workMarkdown } from '@lib/markdown';
import { absUrl } from '@lib/pages';
import { areaOf, getNews, getWorks, workUrl } from '@lib/works';

export const GET: APIRoute = async () => {
  const works = await getWorks();
  const news = await getNews();
  const items = [
    ...works.map((w) => ({
      id: workUrl(w),
      url: workUrl(w),
      title: w.data.title,
      summary: w.data.summary,
      content_text: workMarkdown(w),
      date_published: w.data.date.toISOString(),
      date_modified: (w.data.updated ?? w.data.date).toISOString(),
      tags: [areaById(areaOf(w)).name, areaById(areaOf(w)).nameEn, w.data.kind],
      ...(w.data.cover ? { image: absUrl(w.data.cover.src) } : {}),
    })),
    ...news.map((n) => ({
      id: absUrl(`/news/#${n.id}`),
      url: absUrl(`/news/#${n.id}`),
      title: n.data.title,
      summary: n.data.summary,
      content_text: [n.data.summary, n.body?.trim()].filter(Boolean).join('\n\n'),
      date_published: n.data.date.toISOString(),
      date_modified: n.data.date.toISOString(),
      tags: ['最新動態', 'News'],
    })),
  ].sort((a, b) => b.date_modified.localeCompare(a.date_modified));

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: SITE.name,
    description: SITE.tagline,
    home_page_url: `${SITE.url}/`,
    feed_url: `${SITE.url}/feed.json`,
    language: SITE.locale,
    icon: `${SITE.url}/logo.png`,
    favicon: `${SITE.url}/favicon.png`,
    authors: [{ name: SITE.name, url: `${SITE.url}/` }],
    items,
  };
  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'Content-Type': 'application/feed+json; charset=utf-8' },
  });
};
