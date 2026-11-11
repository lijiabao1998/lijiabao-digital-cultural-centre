// The CJK characters the site actually uses, cut into pieces small enough to ask Google Fonts for.
//
// Noto Sans TC is ~18,000 glyphs. Instead of shipping the whole family, every CJK character that
// appears anywhere under `src/` is collected and requested as a `text=` subset, so the site downloads
// a few small font files that contain exactly the characters it uses.
//
// Google answers a `text=` request only while the address stays short. When it is too long the
// request fails and the build silently falls back to the full family: about a hundred font files
// and 170 KB of CSS on every page (this happened on 2026-11-11 when the film pages were added).
// So the list is cut into as many pieces as it takes to keep every request short, and
// scripts/check-dist.mjs fails the build if a page ever carries the full family again.
//
// Used by astro.config.mjs (which fonts to fetch) and src/layouts/Base.astro (which to load).
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Longest `text=` value, counted as it travels in the address (one CJK character is 9 bytes there). */
const MAX_ENCODED = 6000;

const SRC = fileURLToPath(new URL('..', import.meta.url));

function collect(dir) {
  const out = new Set();
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = `${d}/${e.name}`;
      if (e.isDirectory()) walk(p);
      else if (/\.(astro|ts|mjs|md|mdx|json|css)$/.test(e.name)) {
        for (const ch of readFileSync(p, 'utf8')) {
          const cp = ch.codePointAt(0) ?? 0;
          if (cp >= 0x2e80 && !/\s/u.test(ch)) out.add(ch);
        }
      }
    }
  };
  walk(dir);
  return [...out].sort();
}

/** One string of characters per font request. Never empty. */
export function cjkChunks() {
  const chunks = [];
  let current = '';
  for (const ch of collect(SRC)) {
    if (current && encodeURIComponent(current + ch).length > MAX_ENCODED) {
      chunks.push(current);
      current = '';
    }
    current += ch;
  }
  chunks.push(current || '一');
  return chunks;
}

/** The CSS variable each piece is published under: --font-tc-0, --font-tc-1, … */
export const cjkFontVar = (index) => `--font-tc-${index}`;
