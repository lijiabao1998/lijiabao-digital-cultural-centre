// Which game is served at which address.
//
//   play   the address under lijiabao.uk where the game is played (must end in /play/)
//   repo   the GitHub repository that publishes it, as it appears in its GitHub Pages address
//   alias  only for games built with an absolute path: their files ask for /<alias>/assets/…
//
// When this list changes, the routes in ../wrangler.jsonc and the `launchUrl` of the work
// page in src/content/works/ must change with it.

/** Where the repositories publish (GitHub Pages behind the owner's custom domain). */
export const PAGES_ORIGIN = 'https://game.lijiabao.uk';

/** The address the saves were made on, and the page there that hands them over. */
export const SAVES_ORIGIN = 'https://game.lijiabao.uk';
export const SAVES_EXPORT_PATH = '/save-export.html';

export const GAMES = [
  { play: '/games/defendtaipei/play/', repo: 'defendtaipei', alias: '/defendtaipei/' },
  { play: '/games/glimmertown/play/', repo: 'glimmertown' },
  { play: '/games/shanghaisurvival/play/', repo: 'shanghaisurvival' },
  { play: '/lab/fpv/play/', repo: 'fpv', alias: '/fpv/' },
  { play: '/lab/glimmertown-3d/play/', repo: 'GlimmerTown3D-lab' },
  { play: '/lab/glimmertown-lab/play/', repo: 'GlimmerTown-lab' },
];
