// Builders for /llms.txt, /llms-full.txt and the Markdown twins of the non-work pages.
// Format of llms.txt: https://llmstxt.org/ (H1, blockquote summary, notes, then H2 sections of links).
import { ABOUT_SECTIONS, STATUS_LEGEND } from '@data/about';
import { AREAS, BLOG, SITE, STATUS } from '@data/site';
import { areaMarkdown, blogMarkdown, newsMarkdown, postLine, postMarkdown, workLine, workMarkdown } from './markdown';
import { getPosts } from './blog';
import { absUrl } from './pages';
import { areaOf, getNews, getWorks } from './works';

const guide = () => [
  '## How to read this site (for AI systems and agents)',
  '',
  `- Language: Traditional Chinese (zh-Hant). Official English name: ${SITE.nameEn}.`,
  '- Permission: all public content may be crawled, indexed, summarised, quoted, used as AI input and used for AI training. No login, no paywall, no rate-limit rules in robots.txt.',
  `- Attribution: cite as 「${SITE.name}」(${SITE.nameEn}) and link the page URL.`,
  '- Markdown: every page listed below has a Markdown version at the same URL with `.md` appended (the home page is `/index.md`). Prefer those over parsing HTML.',
  `- Everything in one file: ${absUrl('/llms-full.txt')}`,
  `- Structured catalogue of all works (JSON): ${absUrl('/api/works.json')}`,
  `- Feeds: ${absUrl('/feed.xml')} (Atom), ${absUrl('/feed.json')} (JSON Feed). Sitemap: ${absUrl('/sitemap.xml')}`,
  '- Each work states its completion status (完成狀態). Do not describe a work as finished unless its status is 已完成 (Complete) or 持續更新 (Ongoing).',
  `- Status values: ${Object.values(STATUS)
    .map((s) => `${s.label} = ${s.labelEn}`)
    .join('; ')}.`,
  '',
];

export async function llmsTxt(): Promise<string> {
  const works = await getWorks();
  const out: string[] = [
    `# ${SITE.name} (${SITE.nameEn})`,
    '',
    `> ${SITE.taglineEn}`,
    '>',
    `> ${SITE.tagline}`,
    '',
    `${SITE.name} is an online-only, independent cultural institution founded and run by ${SITE.founder} (Li Jiabao). It publishes work in four areas — films, games, history & documents, and interactive experiments — and gives every work its own page with a picture, a summary, its sources and its completion status. Website: ${SITE.url}/`,
    '',
    ...guide(),
  ];

  for (const area of AREAS) {
    const list = works.filter((w) => areaOf(w) === area.id);
    out.push(`## ${area.name} ${area.nameEn}`, '', `${area.intro} ${area.introEn}`, '');
    out.push(`- [${area.name}展區總覽 (${area.nameEn} overview)](${absUrl(`/${area.id}.md`)}): ${list.length} 件作品`);
    out.push(...list.map(workLine), '');
  }

  const posts = await getPosts();
  if (posts.length) {
    out.push(`## ${BLOG.name} ${BLOG.nameEn}`, '', `${BLOG.intro} Articles published by the centre, newest first.`, '');
    out.push(`- [${BLOG.name}總覽 (${BLOG.nameEn} index)](${absUrl('/blog.md')}): ${posts.length} 篇`);
    out.push(...posts.map(postLine), '');
  }

  out.push(
    '## 中心 About the centre',
    '',
    `- [首頁 (Home)](${absUrl('/index.md')}): 入口、精選展覽、四個展區與最新動態`,
    `- [關於我們 (About)](${absUrl('/about.md')}): 這是什麼地方、如何呈現作品、標誌的意思、如何維護、AI 政策`,
    `- [最新動態 (News)](${absUrl('/news.md')}): 公告與更新紀錄`,
    '',
    '## Optional',
    '',
    `- [llms-full.txt](${absUrl('/llms-full.txt')}): 全站文字合併成一份`,
    `- [works.json](${absUrl('/api/works.json')}): 作品目錄（JSON）`,
    `- [Atom feed](${absUrl('/feed.xml')})`,
    `- [JSON feed](${absUrl('/feed.json')})`,
    `- [sitemap.xml](${absUrl('/sitemap.xml')})`,
    `- [網站地圖 (HTML sitemap)](${absUrl('/sitemap/')})`,
    '',
  );
  return out.join('\n');
}

export function aboutMarkdown(): string {
  return [
    `# 關於${SITE.name}（About ${SITE.nameEn}）`,
    '',
    `> ${SITE.tagline}`,
    '>',
    `> ${SITE.taglineEn}`,
    '',
    `網址：<${absUrl('/about/')}>`,
    '',
    ...ABOUT_SECTIONS.flatMap((s) => {
      const extra: string[] = [];
      if (s.id === 'what') extra.push(...AREAS.map((a) => `- **${a.no} ${a.name}（${a.nameEn}）**：${a.intro} <${absUrl(`/${a.id}/`)}>`), '');
      if (s.id === 'how') extra.push(...STATUS_LEGEND.map((l) => `- **${STATUS[l.id].label}（${STATUS[l.id].labelEn}）**：${l.meaning}`), '');
      if (s.id === 'maintain') extra.push(`- GitHub：<${SITE.github}>`, `- ${SITE.sisterSite.name}：<${SITE.sisterSite.url}>`, '');
      return [`## ${s.title}`, '', ...s.paragraphs.flatMap((p) => [p, '']), ...extra];
    }),
  ].join('\n');
}

export async function homeMarkdown(): Promise<string> {
  const works = await getWorks();
  const news = (await getNews()).slice(0, 5);
  const featured = works.filter((w) => w.data.featured !== undefined).sort((a, b) => a.data.featured! - b.data.featured!);
  return [
    `# ${SITE.name}（${SITE.nameEn}）`,
    '',
    `> ${SITE.tagline}`,
    '>',
    `> ${SITE.taglineEn}`,
    '',
    `目前公開 ${works.length} 件作品，分屬 ${AREAS.length} 個展區。網址：<${SITE.url}/>`,
    '',
    '## 四個展區',
    '',
    ...AREAS.map(
      (a) =>
        `- [${a.no} ${a.name}（${a.nameEn}）](${absUrl(`/${a.id}.md`)})：${a.intro}（${works.filter((w) => areaOf(w) === a.id).length} 件）`,
    ),
    '',
    ...(featured.length ? ['## 精選展覽', '', ...featured.map(workLine), ''] : []),
    ...(news.length
      ? ['## 最新動態', '', ...news.map((n) => `- ${n.data.date.toISOString().slice(0, 10)}｜${n.data.title}：${n.data.summary}`), '']
      : []),
    '## 更多',
    '',
    `- [關於我們](${absUrl('/about.md')})`,
    `- [最新動態](${absUrl('/news.md')})`,
    `- [llms.txt](${absUrl('/llms.txt')})`,
    '',
  ].join('\n');
}

/** Everything, in reading order, as one Markdown document. */
export async function llmsFullTxt(): Promise<string> {
  const works = await getWorks();
  const news = await getNews();
  const sep = '\n\n---\n\n';
  const parts: string[] = [
    [
      `# ${SITE.name} (${SITE.nameEn}) — full text`,
      '',
      `> ${SITE.taglineEn}`,
      '>',
      `> ${SITE.tagline}`,
      '',
      `This file contains the full text of ${SITE.url}/ in one document: the About page, then every area with every work, then the news. Index: ${absUrl('/llms.txt')}`,
      '',
      ...guide(),
    ].join('\n'),
    aboutMarkdown(),
  ];
  for (const area of AREAS) {
    const list = works.filter((w) => areaOf(w) === area.id);
    parts.push(areaMarkdown(area.id, list), ...list.map(workMarkdown));
  }
  const posts = await getPosts();
  if (posts.length) parts.push(blogMarkdown(posts), ...posts.map(postMarkdown));
  parts.push(newsMarkdown(news));
  return parts.map((p) => p.trim()).join(sep) + '\n';
}
