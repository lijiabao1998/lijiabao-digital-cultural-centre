// Not type-checked: @types/node is not a dependency (Node-only config file).
import { defineConfig, fontProviders } from 'astro/config';
import { cjkChunks, cjkFontVar } from './src/lib/cjk-glyphs.mjs';

// CJK glyph subset: see src/lib/cjk-glyphs.mjs for what it does and why it is cut into pieces.
const cjkFonts = cjkChunks();

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
    ...cjkFonts.map((glyphs, i) => notoTc(cjkFontVar(i), glyphs)),
  ],
  vite: {
    cacheDir: './.cache/vite',
    // The layout loads exactly the pieces configured above. It must not count them again:
    // once bundled, cjk-glyphs.mjs no longer sits next to the source files it reads.
    define: { __CJK_FONT_COUNT__: JSON.stringify(cjkFonts.length) },
  },
});
