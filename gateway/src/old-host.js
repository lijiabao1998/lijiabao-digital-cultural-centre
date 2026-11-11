// What this Worker answers on the old games domain, game.lijiabao.uk.
//
// Active since the switch on 2026-11-11 (README.md, "遊戲" → "舊網域的切換"): the domain is a
// custom domain of this Worker, and GitHub Pages serves the repositories at its default address.
//
//   /save-export.html          hands this browser's saves to lijiabao.uk (see ../save-export.html)
//   /<game>/…                  301 to the game's play address on lijiabao.uk
//   /                          301 to the games area
//   everything else            unchanged from GitHub Pages (legal pages, images, unlisted games)
//
// A game marked `keepOld` in games.js is also left unchanged: its own release checks still
// read the old address byte for byte, so it must not be redirected or altered.

import saveExportPage from '../save-export.html';
import { GAMES, OLD_ALIASES, PAGES_ORIGIN } from './games.js';

const SITE = 'https://lijiabao.uk';

/** Old path prefix -> game. Longest first, so /GlimmerTown-lab/ is not taken for /GlimmerTown/. */
const OLD_PATHS = [
  ...GAMES.map((game) => [`/${game.repo}/`, game]),
  ...Object.entries(OLD_ALIASES).map(([prefix, repo]) => [prefix, GAMES.find((g) => g.repo === repo)]),
].sort((a, b) => b[0].length - a[0].length);

export async function oldHost(request, url) {
  const path = url.pathname;

  if (path === '/save-export.html') {
    return new Response(saveExportPage, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex',
        'content-security-policy': `frame-ancestors ${SITE}`,
      },
    });
  }

  for (const [prefix, game] of OLD_PATHS) {
    if (path !== prefix.slice(0, -1) && !path.startsWith(prefix)) continue;
    if (game.keepOld) break;
    // A service worker registered by an older build must be replaced by a real script:
    // browsers refuse a redirected worker script, and the old one would live on forever.
    if (request.headers.get('service-worker') === 'script') return retireWorker(game);
    const rest = path.startsWith(prefix) ? path.slice(prefix.length) : '';
    return move(`${SITE}${game.play}${rest}${url.search}`);
  }

  if (path === '/' || path === '/index.html') return move(`${SITE}/games/`);
  return unchanged(request, url);
}

const move = (location) => new Response(null, { status: 301, headers: { location, 'cache-control': 'max-age=3600' } });

/** A worker whose only job is to remove itself, so the next visit reaches the redirect. */
function retireWorker(game) {
  const prefixes = JSON.stringify(game.cachePrefixes || []);
  const script = `// ${game.repo} moved to ${SITE}${game.play}
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil((async () => {
  const prefixes = ${prefixes};
  for (const key of await caches.keys()) if (prefixes.some((p) => key.startsWith(p))) await caches.delete(key);
  await self.registration.unregister();
  for (const client of await self.clients.matchAll({ type: 'window' })) client.navigate(client.url);
})()));
`;
  return new Response(script, {
    headers: { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-store' },
  });
}

/** The same bytes GitHub Pages serves, with nothing added by Cloudflare on the way. */
async function unchanged(request, url) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
  }
  const headers = new Headers();
  for (const name of ['accept', 'accept-language', 'if-none-match', 'if-modified-since', 'range', 'user-agent']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  let upstream;
  try {
    upstream = await fetch(PAGES_ORIGIN + url.pathname + url.search, { method: request.method, headers, redirect: 'manual' });
  } catch {
    return new Response('Temporarily unavailable.', { status: 502, headers: { 'cache-control': 'no-store' } });
  }
  const response = new Response(upstream.body, upstream);
  response.headers.delete('set-cookie');
  // no-transform: Cloudflare must not inject or rewrite anything in these files.
  const cache = upstream.headers.get('cache-control');
  response.headers.set('cache-control', cache ? `${cache}, no-transform` : 'no-transform');
  // GitHub Pages adds a missing slash by redirecting to its own host; keep people on this one.
  const location = upstream.headers.get('location');
  if (location) {
    try {
      const to = new URL(location, PAGES_ORIGIN + url.pathname);
      if (to.origin === PAGES_ORIGIN) response.headers.set('location', url.origin + to.pathname + to.search);
    } catch {
      // leave it as it is
    }
  }
  return response;
}
