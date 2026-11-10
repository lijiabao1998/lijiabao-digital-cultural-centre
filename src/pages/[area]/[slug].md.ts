// /<area>/<slug>.md — Markdown twin of every work page.
import type { APIRoute } from 'astro';
import { mdResponse, workMarkdown } from '@lib/markdown';
import { areaOf, getWorks, slugOf, type Work } from '@lib/works';

export async function getStaticPaths() {
  return (await getWorks()).map((work) => ({ params: { area: areaOf(work), slug: slugOf(work) }, props: { work } }));
}

export const GET: APIRoute = ({ props }) => mdResponse(workMarkdown(props.work as Work));
