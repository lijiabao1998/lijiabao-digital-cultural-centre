// /feed.xml — Atom feed of works and news, newest first.
import type { APIRoute } from 'astro';
import { BLOG, SITE, areaById } from '@data/site';
import { absUrl } from '@lib/pages';
import { getPosts, postUrl } from '@lib/blog';
import { areaOf, getNews, getWorks, workUrl } from '@lib/works';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const works = await getWorks();
  const news = await getNews();
  const posts = await getPosts();
  const entries = [
    ...works.map((w) => ({
      id: workUrl(w),
      url: workUrl(w),
      title: `${areaById(areaOf(w)).name}｜${w.data.title}`,
      summary: w.data.summary,
      date: w.data.updated ?? w.data.date,
      published: w.data.date,
      category: areaById(areaOf(w)).nameEn,
    })),
    ...posts.map((p) => ({
      id: postUrl(p),
      url: postUrl(p),
      title: `${BLOG.name}｜${p.data.title}`,
      summary: p.data.summary,
      date: p.data.updated ?? p.data.date,
      published: p.data.date,
      category: 'Blog',
    })),
    ...news.map((n) => ({
      id: absUrl(`/news/#${n.id}`),
      url: absUrl(`/news/#${n.id}`),
      title: `最新動態｜${n.data.title}`,
      summary: n.data.summary,
      date: n.data.date,
      published: n.data.date,
      category: 'News',
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const updated = (entries[0]?.date ?? new Date(Date.UTC(SITE.founded, 10, 10))).toISOString();
  const items = entries
    .map((e) =>
      [
        '  <entry>',
        `    <id>${esc(e.id)}</id>`,
        `    <title>${esc(e.title)}</title>`,
        `    <link href="${esc(e.url)}" rel="alternate" type="text/html"/>`,
        `    <published>${e.published.toISOString()}</published>`,
        `    <updated>${e.date.toISOString()}</updated>`,
        `    <category term="${esc(e.category)}"/>`,
        `    <summary>${esc(e.summary)}</summary>`,
        '  </entry>',
      ].join('\n'),
    )
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${SITE.locale}">`,
    `  <title>${esc(SITE.name)}</title>`,
    `  <subtitle>${esc(SITE.tagline)}</subtitle>`,
    `  <id>${SITE.url}/</id>`,
    `  <link href="${SITE.url}/" rel="alternate" type="text/html"/>`,
    `  <link href="${SITE.url}/feed.xml" rel="self" type="application/atom+xml"/>`,
    `  <updated>${updated}</updated>`,
    `  <author><name>${esc(SITE.name)}</name><uri>${SITE.url}/</uri></author>`,
    items,
    '</feed>',
    '',
  ].join('\n');
  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
};
