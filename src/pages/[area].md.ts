// /films.md, /games.md, /archive.md, /lab.md — Markdown twins of the area pages.
import type { APIRoute } from 'astro';
import { AREAS, type AreaId } from '@data/site';
import { areaMarkdown, mdResponse } from '@lib/markdown';
import { getWorksByArea } from '@lib/works';

export const getStaticPaths = () => AREAS.map((a) => ({ params: { area: a.id } }));

export const GET: APIRoute = async ({ params }) => {
  const area = params.area as AreaId;
  return mdResponse(areaMarkdown(area, await getWorksByArea(area)));
};
