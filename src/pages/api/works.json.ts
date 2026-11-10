// /api/works.json — the catalogue of every public work, for programs and AI agents.
import type { APIRoute } from 'astro';
import { SITE, STATUS, areaById } from '@data/site';
import { absUrl } from '@lib/pages';
import { areaOf, getWorks, isoDay, slugOf, workMdPath, workUrl } from '@lib/works';

export const GET: APIRoute = async () => {
  const works = await getWorks();
  const body = {
    name: SITE.name,
    nameEn: SITE.nameEn,
    description: SITE.taglineEn,
    url: `${SITE.url}/`,
    language: SITE.locale,
    usage:
      'Public content may be crawled, indexed, summarised, quoted, used as AI input and used for AI training. Please attribute and link the page.',
    count: works.length,
    works: works.map((w) => {
      const area = areaById(areaOf(w));
      const d = w.data;
      return {
        id: w.id,
        slug: slugOf(w),
        area: { id: area.id, name: area.name, nameEn: area.nameEn },
        title: d.title,
        titleEn: d.titleEn ?? null,
        summary: d.summary,
        summaryEn: d.summaryEn ?? null,
        kind: d.kind,
        status: {
          id: d.status,
          label: STATUS[d.status].label,
          labelEn: STATUS[d.status].labelEn,
          note: d.statusNote ?? null,
        },
        date: isoDay(d.date),
        updated: d.updated ? isoDay(d.updated) : null,
        runtime: d.runtime ?? null,
        tech: d.tech,
        url: workUrl(w),
        markdownUrl: absUrl(workMdPath(w)),
        launchUrl: d.launchUrl ?? null,
        repoUrl: d.repoUrl ?? null,
        image: d.cover ? absUrl(d.cover.src) : null,
        sources: d.sources,
      };
    }),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
