// Which game is served at which address.
//
//   play           the address under lijiabao.uk where the game is played (must end in /play/)
//   repo           the GitHub repository that publishes it, as it appears in its GitHub Pages address
//   alias          only for games built with an absolute path: their files ask for /<alias>/assets/…
//   keepOld        after the switch of the old domain, leave game.lijiabao.uk/<repo>/ exactly as it is
//                  (no redirect, same bytes) because the repository's own release checks read it
//   cachePrefixes  cache names an older build's service worker created on the old domain
//
// When this list changes, the routes in ../wrangler.jsonc and the `launchUrl` of the work
// page in src/content/works/ must change with it.

/** Where the repositories publish: GitHub Pages, at its default address. */
export const PAGES_ORIGIN = 'https://lijiabao1998.github.io';

/**
 * Only during the switch of the old domain. While GitHub Pages still has the custom domain
 * set, the default address answers with a redirect to it; follow that one hop.
 * Set to null in the same change that routes the old domain to this Worker.
 */
export const PAGES_FALLBACK = null;

/** The address the saves were made on, and the page there that hands them over. */
export const SAVES_ORIGIN = 'https://game.lijiabao.uk';
export const SAVES_EXPORT_PATH = '/save-export.html';

/** The address with www: not a second copy of the site, only a way to the real one. */
export const WWW_HOST = 'www.lijiabao.uk';

/** The old games domain. This Worker answers it since the switch on 2026-11-11; see old-host.js. */
export const OLD_HOST = 'game.lijiabao.uk';

export const GAMES = [
  { play: '/games/defendtaipei/play/', repo: 'defendtaipei', alias: '/defendtaipei/', cachePrefixes: ['dt-'] },
  // Redirected since 2026-11-11: lijiabao1998/glimmertown merged T721, so its release checks read github.io.
  { play: '/games/glimmertown/play/', repo: 'glimmertown', cachePrefixes: ['glimmerville-main-shell-'] },
  { play: '/games/shanghaisurvival/play/', repo: 'shanghaisurvival' },
  { play: '/lab/fpv/play/', repo: 'fpv', alias: '/fpv/' },
  { play: '/lab/glimmertown-3d/play/', repo: 'GlimmerTown3D-lab' },
  { play: '/lab/glimmertown-lab/play/', repo: 'GlimmerTown-lab' },
];

/** Even older addresses on the old domain that already forwarded to a game. */
export const OLD_ALIASES = {
  '/DefendTaipei-Lab/': 'defendtaipei',
  '/GlimmerTown/': 'glimmertown',
  '/Physical-Fpv-Simulator/': 'fpv',
};
