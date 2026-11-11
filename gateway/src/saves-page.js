// Fills in saves-page.html for one game. The page itself (and what it does) is in that file.

import template from './saves-page.html';
import { SAVES_ORIGIN, SAVES_EXPORT_PATH } from './games.js';

// Long enough for a slow connection: a visitor who is let through without the copy starts with no saves.
const WAIT_MS = 12000;
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function savesPage({ game, to }) {
  const cfg = { base: game.play, to, from: SAVES_ORIGIN, exportPath: SAVES_EXPORT_PATH, wait: WAIT_MS };
  const skip = `${game.play}__saves/skip?to=${encodeURIComponent(to)}`;
  const html = template
    .replace('%SKIP%', () => attr(skip))
    .replace('%CFG%', () => JSON.stringify(cfg).replace(/</g, '\\u003c'));
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex',
    },
  });
}
