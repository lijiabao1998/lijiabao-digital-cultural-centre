// Markdown twins: every page that matters has a plain Markdown version at the same address plus `.md`.
// These are what /llms.txt links to, and what /llms-full.txt concatenates.
import { AREAS, BLOG, SITE, STATUS, areaById } from '@data/site';
import { postMdPath, postUrl, type Post } from './blog';
import { areaOf, formatDate, isoDay, workMdPath, workUrl, type NewsItem, type Work } from './works';

const abs = (path: string) => new URL(path, SITE.url).href;

export const mdResponse = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });

export const textResponse = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

/** One work as a self-contained Markdown document. */
export function workMarkdown(w: Work): string {
  const d = w.data;
  const area = areaById(areaOf(w));
  const facts = [
    `- 展區：${area.name}（${area.nameEn}）`,
    `- 類型：${d.kind}`,
    `- 完成狀態：${STATUS[d.status].label}（${STATUS[d.status].labelEn}）${d.statusNote ? `— ${d.statusNote}` : ''}`,
    `- 日期：${isoDay(d.date)}`,
    d.updated ? `- 最後更新：${isoDay(d.updated)}` : '',
    d.runtime ? `- 片長：${d.runtime}` : '',
    d.tech.length ? `- 技術：${d.tech.join('、')}` : '',
    d.launchUrl ? `- ${area.action}：<${d.launchUrl}>` : '',
    d.repoUrl ? `- 原始碼：<${d.repoUrl}>` : '',
    `- 本頁網址：<${workUrl(w)}>`,
  ].filter(Boolean);

  const sources = d.sources.length
    ? [
        '',
        '## 來源',
        '',
        ...d.sources.map(
          (s, i) => `${i + 1}. ${s.url ? `[${s.title}](${s.url})` : s.title}${s.note ? ` — ${s.note}` : ''}`,
        ),
      ]
    : [];

  return [
    `# ${d.title}${d.titleEn ? `（${d.titleEn}）` : ''}`,
    '',
    `> ${d.summary}`,
    ...(d.summaryEn ? ['>', `> ${d.summaryEn}`] : []),
    '',
    ...facts,
    '',
    (w.body ?? '').trim(),
    ...sources,
    '',
    '---',
    `出自 ${SITE.name}（${SITE.nameEn}）：<${SITE.url}/>`,
    '',
  ].join('\n');
}

/** One line per work, the way llms.txt lists links. */
export const workLine = (w: Work): string =>
  `- [${w.data.title}${w.data.titleEn ? ` (${w.data.titleEn})` : ''}](${abs(workMdPath(w))}): ${w.data.summary}｜${w.data.kind}｜${STATUS[w.data.status].label}｜${isoDay(w.data.date)}`;

export function areaMarkdown(areaId: (typeof AREAS)[number]['id'], works: Work[]): string {
  const area = areaById(areaId);
  return [
    `# ${area.name}（${area.nameEn}）`,
    '',
    `> ${area.intro}`,
    '>',
    `> ${area.introEn}`,
    '',
    `本展區目前收錄 ${works.length} ${area.unit}作品。網址：<${abs(`/${area.id}/`)}>`,
    '',
    works.length ? '## 作品' : '展品整理中。',
    '',
    ...works.map(workLine),
    '',
  ].join('\n');
}

export function newsMarkdown(items: NewsItem[]): string {
  return [
    '# 最新動態',
    '',
    `> ${SITE.name}的公告與更新紀錄。網址：<${abs('/news/')}>`,
    '',
    ...items.flatMap((n) => [
      `## ${n.data.title}`,
      '',
      `${formatDate(n.data.date)}（${isoDay(n.data.date)}）`,
      '',
      n.data.summary,
      ...(n.body?.trim() ? ['', n.body.trim()] : []),
      ...(n.data.link ? ['', `相關連結：<${abs(n.data.link)}>`] : []),
      '',
    ]),
  ].join('\n');
}

/** One post as a self-contained Markdown document. */
export function postMarkdown(p: Post): string {
  const d = p.data;
  return [
    `# ${d.title}`,
    '',
    `> ${d.summary}`,
    '',
    `- 發表：${formatDate(d.date)}（${isoDay(d.date)}）`,
    ...(d.updated ? [`- 最後更新：${formatDate(d.updated)}（${isoDay(d.updated)}）`] : []),
    ...(d.byline ? [`- 署名：${d.byline}`] : []),
    ...(d.tags.length ? [`- 主題：${d.tags.join('、')}`] : []),
    `- 網址：<${postUrl(p)}>`,
    `- 出處：${SITE.name}（${SITE.nameEn}）`,
    ...(p.body?.trim() ? ['', p.body.trim()] : []),
    '',
  ].join('\n');
}

export const postLine = (p: Post): string =>
  `- [${p.data.title}](${abs(postMdPath(p))}): ${isoDay(p.data.date)}｜${p.data.summary}`;

/** The list of posts, as Markdown. */
export function blogMarkdown(posts: Post[]): string {
  return [
    `# ${BLOG.name}（${BLOG.nameEn}）`,
    '',
    `> ${BLOG.intro}網址：<${abs(BLOG.path)}>`,
    '',
    ...(posts.length ? posts.map(postLine) : ['目前還沒有文章。']),
    '',
  ].join('\n');
}
