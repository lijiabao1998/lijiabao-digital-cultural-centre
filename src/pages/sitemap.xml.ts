// /sitemap.xml — every public page, with last-modified dates and cover images.
import type { APIRoute } from 'astro';
import { absUrl, getPages } from '@lib/pages';
import { isoDay } from '@lib/works';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const pages = await getPages();
  const urls = pages.map((p) => {
    const cover = p.work?.data.cover;
    const image = cover
      ? `\n    <image:image><image:loc>${esc(absUrl(cover.src))}</image:loc></image:image>`
      : '';
    return `  <url>
    <loc>${esc(absUrl(p.path))}</loc>
    <lastmod>${isoDay(p.lastmod)}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(1)}</priority>${image}
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
