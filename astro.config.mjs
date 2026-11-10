// Not type-checked: @types/node is not a dependency (Node-only config file).
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, fontProviders } from 'astro/config';

/**
 * CJK glyph subset.
 *
 * Noto Sans TC is ~18,000 glyphs. Instead of shipping the whole family, every CJK character that appears
 * anywhere under `src/` is collected here and passed to Google Fonts as a `text=` subset, so the site
 * downloads one small font file that contains exactly the characters it uses. Characters typed after the
 * dev server started fall back to the system CJK font until the next restart; a build always re-scans.
 *
 * The list is split in two so each request URL stays well under Google's length limit.
 */
function collectCjk(dir) {
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

const cjk = collectCjk(fileURLToPath(new URL('./src', import.meta.url)));
const half = Math.ceil(cjk.length / 2);
const glyphsA = cjk.slice(0, half).join('') || '一';
const glyphsB = cjk.slice(half).join('') || '二';

const notoTc = (cssVariable, glyphs) => ({
  provider: fontProviders.google(),
  name: 'Noto Sans TC',
  cssVariable,
  weights: ['400 900'],
  styles: ['normal'],
  fallbacks: [],
  optimizedFallbacks: false,
  options: { experimental: { glyphs: [glyphs] } },
});

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://lijiabao.uk',
  cacheDir: './.cache/astro',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  fonts: [
    {
      // Latin display + text. Stacks are composed in global.css so CJK falls through to Noto Sans TC.
      provider: fontProviders.google(),
      name: 'Archivo',
      cssVariable: '--font-latin',
      weights: ['400 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: [],
    },
    notoTc('--font-tc-a', glyphsA),
    notoTc('--font-tc-b', glyphsB),
  ],
  vite: { cacheDir: './.cache/vite' },
});
