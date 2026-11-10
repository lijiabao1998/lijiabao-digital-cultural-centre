// schema.org JSON-LD. Every page carries the Organization and WebSite nodes; pages add their own.
import type { ImageMetadata } from 'astro';
import { AREAS, SITE, STATUS, areaById } from '@data/site';
import { areaOf, isoDay, workUrl, type Work } from './works';

const abs = (path: string) => new URL(path, SITE.url).href;

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export const organization = () => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.name,
  alternateName: [SITE.nameEn, SITE.shortName],
  url: `${SITE.url}/`,
  logo: { '@type': 'ImageObject', url: abs('/logo.png'), width: 512, height: 512 },
  description: SITE.taglineEn,
  slogan: SITE.tagline,
  foundingDate: String(SITE.founded),
  founder: { '@type': 'Person', name: SITE.founder, url: SITE.sisterSite.url },
  sameAs: [SITE.github, SITE.sisterSite.url],
  knowsAbout: AREAS.map((a) => a.nameEn),
});

export const website = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE.name,
  alternateName: SITE.nameEn,
  url: `${SITE.url}/`,
  description: SITE.taglineEn,
  inLanguage: SITE.locale,
  publisher: { '@id': ORG_ID },
});

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});

const TYPE_BY_AREA = { films: 'Movie', games: 'VideoGame', archive: 'Article', lab: 'WebApplication' } as const;
const WORK_STATUS = {
  complete: 'Published',
  ongoing: 'Published',
  prototype: 'Incomplete',
  experiment: 'Incomplete',
  production: 'Incomplete',
  planned: 'Draft',
} as const;

export function workNode(w: Work, cover?: ImageMetadata) {
  const area = areaOf(w);
  const d = w.data;
  const node: Record<string, unknown> = {
    '@type': TYPE_BY_AREA[area],
    '@id': `${workUrl(w)}#work`,
    name: d.title,
    ...(d.titleEn ? { alternateName: d.titleEn } : {}),
    description: d.summary,
    url: workUrl(w),
    mainEntityOfPage: workUrl(w),
    inLanguage: SITE.locale,
    datePublished: isoDay(d.date),
    dateModified: isoDay(d.updated ?? d.date),
    genre: d.kind,
    creativeWorkStatus: WORK_STATUS[d.status],
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@type': 'Collection', name: `${areaById(area).name}（${areaById(area).nameEn}）`, url: abs(`/${area}/`) },
    additionalProperty: [
      { '@type': 'PropertyValue', name: '完成狀態', value: STATUS[d.status].label },
      ...(d.statusNote ? [{ '@type': 'PropertyValue', name: '狀態說明', value: d.statusNote }] : []),
    ],
  };
  if (cover) node.image = abs(cover.src);
  if (d.sources.length) {
    node.citation = d.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, ...(s.url ? { url: s.url } : {}) }));
  }
  if (d.tech.length) node.keywords = d.tech.join(', ');
  if (area === 'films') {
    node['@type'] = 'Movie';
    node.director = { '@type': 'Person', name: SITE.founder };
    if (d.launchUrl) node.sameAs = d.launchUrl;
  }
  if (area === 'games' || area === 'lab') {
    node.applicationCategory = area === 'games' ? 'Game' : 'Interactive experiment';
    node.operatingSystem = 'Any (web browser)';
    node.gamePlatform = 'Web browser';
    node.offers = { '@type': 'Offer', price: '0', priceCurrency: 'USD' };
    if (d.launchUrl) node.installUrl = d.launchUrl;
    if (d.repoUrl) node.codeRepository = d.repoUrl;
  }
  return node;
}

export const graph = (...nodes: unknown[]) => ({
  '@context': 'https://schema.org',
  '@graph': [organization(), website(), ...nodes],
});
