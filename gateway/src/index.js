// Games gateway for lijiabao.uk.
//
// The games are still built and published by their own repositories (GitHub Pages).
// This Worker makes each one playable under the main domain, next to its work page:
//
//   https://lijiabao.uk/games/defendtaipei/        the work page (static site)
//   https://lijiabao.uk/games/defendtaipei/play/   the game itself (this Worker)
//
// It also carries saves over. Saves live in the browser (localStorage, IndexedDB) and belong
// to the address they were made on. The first time a browser opens a play address it is sent
// through a short page that copies whatever the old address holds, then on to the game.
// Nothing is deleted on the old address, and a save that already exists here is never replaced.
//
// The list of games is in games.js. The work pages link here through `launchUrl`.

import { GAMES, OLD_HOST, PAGES_FALLBACK, PAGES_ORIGIN, SAVES_ORIGIN } from './games.js';
import { oldHost } from './old-host.js';
import { savesPage } from './saves-page.js';

const COOKIE = 'lj_saves';
const YEAR = 60 * 60 * 24 * 365;
const HOUR = 60 * 60;
const FORWARDED = ['accept', 'accept-language', 'if-none-match', 'if-modified-since', 'range', 'user-agent'];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.hostname === OLD_HOST) return oldHost(request, url);
    const hit = match(url.pathname);
    if (!hit) return fetch(request); // not ours: let the site answer
    const { game, kind, rest } = hit;

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
    }

    // /games/x/play  ->  /games/x/play/   (relative links in the games need the slash)
    if (kind === 'slash') return redirect(game.play + url.search, 308);

    // Old-style absolute asset path (/defendtaipei/assets/…). The page itself lives at the play address.
    if (kind === 'alias') {
      if (rest === '' || rest === 'index.html') return redirect(game.play + url.search, 301);
      return proxy(request, url, game, rest, game.alias);
    }

    if (rest === '__saves') return savesPage({ game, to: safeTarget(url.searchParams.get('to'), game) });
    if (rest === '__saves/done' || rest === '__saves/skip') {
      const to = safeTarget(url.searchParams.get('to'), game);
      const maxAge = rest.endsWith('done') ? YEAR : HOUR;
      return redirect(to, 302, {
        'set-cookie': `${COOKIE}=1; Path=/; Max-Age=${maxAge}; Secure; HttpOnly; SameSite=Lax`,
      });
    }

    // A person opening the game for the first time in this browser: bring the saves over first.
    // Crawlers and tools do not send Sec-Fetch-Dest, so they always get the game page itself.
    if (isPageVisit(request, rest) && !hasCookie(request)) {
      const to = url.pathname + url.search;
      return redirect(`${game.play}__saves?to=${encodeURIComponent(to)}`, 302);
    }

    return proxy(request, url, game, rest, game.play);
  },
};

function match(pathname) {
  for (const game of GAMES) {
    if (pathname === game.play.slice(0, -1)) return { game, kind: 'slash', rest: '' };
    if (pathname.startsWith(game.play)) return { game, kind: 'play', rest: pathname.slice(game.play.length) };
    if (game.alias && pathname.startsWith(game.alias)) {
      return { game, kind: 'alias', rest: pathname.slice(game.alias.length) };
    }
  }
  return null;
}

const isPageVisit = (request, rest) =>
  request.method === 'GET' &&
  request.headers.get('sec-fetch-dest') === 'document' &&
  (rest === '' || rest.endsWith('/') || rest.endsWith('.html'));

const hasCookie = (request) =>
  (request.headers.get('cookie') || '').split(';').some((c) => c.trim() === `${COOKIE}=1`);

/** Only ever send people back into the same game. */
function safeTarget(to, game) {
  try {
    const u = new URL(to || '', 'https://lijiabao.uk');
    const inside = u.origin === 'https://lijiabao.uk' && u.pathname.startsWith(game.play);
    if (inside && !u.pathname.startsWith(`${game.play}__saves`)) return u.pathname + u.search;
  } catch {
    // fall through
  }
  return game.play;
}

function redirect(location, status, extra = {}) {
  return new Response(null, { status, headers: { location, 'cache-control': 'no-store', ...extra } });
}

/** Stream a file of the game from where its repository publishes it. */
async function proxy(request, url, game, rest, base) {
  const path = `/${game.repo}/${rest}${url.search}`;
  const target = PAGES_ORIGIN + path;
  const headers = new Headers();
  for (const name of FORWARDED) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  let upstream;
  try {
    upstream = await fetch(target, { method: request.method, headers, redirect: 'manual' });
    if (forwardsToFallback(upstream)) {
      upstream = await fetch(PAGES_FALLBACK + path, { method: request.method, headers, redirect: 'manual' });
    }
  } catch {
    return new Response('The game could not be reached. Please try again in a moment.', {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    });
  }

  const response = new Response(upstream.body, upstream);
  response.headers.delete('set-cookie');
  // GitHub Pages adds a slash by redirecting; keep the visitor on this address.
  const location = upstream.headers.get('location');
  if (location) response.headers.set('location', mapLocation(location, target, game, base));
  return response;
}

/** GitHub Pages pointing at the custom domain it still has (see PAGES_FALLBACK). */
function forwardsToFallback(response) {
  if (!PAGES_FALLBACK || response.status < 300 || response.status >= 400) return false;
  const location = response.headers.get('location') || '';
  return location.replace(/^http:/, 'https:').startsWith(PAGES_FALLBACK + '/');
}

function mapLocation(location, target, game, base) {
  try {
    const u = new URL(location, target);
    const prefix = `/${game.repo}/`;
    const known = u.origin === PAGES_ORIGIN || u.origin === SAVES_ORIGIN || u.hostname.endsWith('.github.io');
    if (known && u.pathname.startsWith(prefix)) return base + u.pathname.slice(prefix.length) + u.search;
  } catch {
    // fall through
  }
  return location;
}
