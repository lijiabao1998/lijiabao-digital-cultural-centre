// Post-build check. Fails the build if something a visitor or a crawler relies on is missing or broken.
//   1. the machine-readable files exist and are not empty
//   2. every internal link and asset reference in every HTML page resolves to a file in dist/
//   3. every URL in sitemap.xml has a page, and every page is in sitemap.xml
//   4. every page has a title, a description, a canonical URL and valid JSON-LD
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const ORIGIN = 'https://lijiabao.uk';
const errors = [];
const fail = (msg) => errors.push(msg);

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

if (!existsSync(DIST)) {
  console.error('check-dist: dist/ not found');
  process.exit(1);
}
const files = walk(DIST);
const rel = (f) => '/' + relative(DIST, f).split(sep).join('/');
const has = new Set(files.map(rel));

/** Does a root-relative URL path resolve the way the host serves it? */
const resolves = (path) => {
  const p = decodeURIComponent(path.split('#')[0].split('?')[0]);
  if (p === '' || p === '/') return has.has('/index.html');
  if (has.has(p)) return true;
  if (p.endsWith('/')) return has.has(`${p}index.html`);
  return has.has(`${p}/index.html`) || has.has(`${p}.html`);
};

// 1. required files
for (const f of [
  '/index.html',
  '/404.html',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/llms-full.txt',
  '/index.md',
  '/about.md',
  '/news.md',
  '/feed.xml',
  '/feed.json',
  '/api/works.json',
  '/favicon.svg',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/logo.png',
  '/og.png',
  '/_headers',
]) {
  if (!has.has(f)) fail(`missing ${f}`);
  else if (statSync(join(DIST, f)).size === 0) fail(`empty ${f}`);
}

// 2 + 4. HTML pages
const html = files.filter((f) => f.endsWith('.html'));
const pagePaths = new Set();
for (const file of html) {
  const page = rel(file);
  const src = readFileSync(file, 'utf8');
  const urlPath = page.replace(/index\.html$/, '').replace(/\.html$/, '');
  if (page !== '/404.html') pagePaths.add(urlPath);

  if (!/<title>[^<]+<\/title>/.test(src)) fail(`${page}: no <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(src)) fail(`${page}: no meta description`);
  if (page !== '/404.html' && !/<link rel="canonical" href="https:\/\/lijiabao\.uk\//.test(src)) {
    fail(`${page}: no canonical`);
  }
  if (!/<html lang="zh-Hant"/.test(src)) fail(`${page}: no lang`);

  for (const m of src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      fail(`${page}: invalid JSON-LD (${e.message})`);
    }
  }

  for (const m of src.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    let url = m[1].replace(/&amp;/g, '&');
    if (url.startsWith(ORIGIN)) url = url.slice(ORIGIN.length) || '/';
    if (!url.startsWith('/') || url.startsWith('//')) continue; // external, mailto:, #anchor, data:
    if (!resolves(url)) fail(`${page}: broken link ${m[1]}`);
  }
  for (const m of src.matchAll(/\ssrcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url.startsWith('/') && !resolves(url)) fail(`${page}: broken srcset ${url}`);
    }
  }
}

// 3. sitemap ↔ pages
if (has.has('/sitemap.xml')) {
  const xml = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => !/\.(png|jpe?g|webp|avif)$/.test(u));
  const inMap = new Set(locs.map((u) => u.slice(ORIGIN.length)));
  for (const u of locs) {
    if (!u.startsWith(`${ORIGIN}/`)) fail(`sitemap: foreign URL ${u}`);
    else if (!resolves(u.slice(ORIGIN.length))) fail(`sitemap: no page for ${u}`);
  }
  for (const p of pagePaths) if (!inMap.has(p)) fail(`sitemap: page ${p} is not listed`);
}

// llms.txt links
if (has.has('/llms.txt')) {
  const txt = readFileSync(join(DIST, 'llms.txt'), 'utf8');
  for (const m of txt.matchAll(/\]\((https:\/\/lijiabao\.uk[^)]*)\)/g)) {
    if (!resolves(m[1].slice(ORIGIN.length) || '/')) fail(`llms.txt: broken link ${m[1]}`);
  }
}

if (errors.length) {
  console.error(`check-dist: ${errors.length} problem(s)`);
  for (const e of [...new Set(errors)]) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`check-dist: ok (${html.length} pages, ${files.length} files)`);
